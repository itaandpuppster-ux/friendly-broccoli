"""Headless Blender render script (runs INSIDE Blender, not the host Python).

Invoked by stages/s4_render.py as:

    blender --background --python render_spring.py -- '<json-args>'

It:
  * uses the original hero image as a full-frame background plate,
  * imports the generated .glb spring,
  * seats the spring where the flat spring was (from the segmentation bbox),
  * spins it a full turn over the clip's duration,
  * renders straight to an H.264 MP4 at the Instagram 4:5 geometry.

Only Blender's bundled ``bpy`` is required — no pip installs inside Blender.
"""

import json
import math
import sys

import bpy  # provided by the Blender runtime


# ---------------------------------------------------------------------------
# Parse the JSON args passed after the "--" separator.
# ---------------------------------------------------------------------------
def _get_args() -> dict:
    argv = sys.argv
    if "--" not in argv:
        raise SystemExit("render_spring.py: no args after '--'")
    return json.loads(argv[argv.index("--") + 1])


def _reset_scene() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)


def _setup_render(cfg: dict) -> None:
    scene = bpy.context.scene
    scene.render.resolution_x = cfg["width"]
    scene.render.resolution_y = cfg["height"]
    scene.render.resolution_percentage = 100
    scene.render.fps = cfg["fps"]

    # Use Eevee for fast, phone-friendly renders; swap to CYCLES for max fidelity.
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"  # Blender 4.2+
    except Exception:
        scene.render.engine = "BLENDER_EEVEE"

    total_frames = max(1, int(round(cfg["fps"] * cfg["seconds"])))
    scene.frame_start = 1
    scene.frame_end = total_frames

    # Direct-to-MP4 (H.264 / AAC-less) output.
    scene.render.image_settings.file_format = "FFMPEG"
    scene.render.ffmpeg.format = "MPEG4"
    scene.render.ffmpeg.codec = "H264"
    scene.render.ffmpeg.constant_rate_factor = "HIGH"
    scene.render.filepath = cfg["output"]
    scene.render.film_transparent = False


def _add_background_plate(cfg: dict) -> None:
    """Full-frame background using the original hero image behind everything.

    We render the plate through the world/compositor so it always fills the 4:5
    frame regardless of camera moves.
    """
    scene = bpy.context.scene
    scene.use_nodes = True
    tree = scene.node_tree
    for node in list(tree.nodes):
        tree.nodes.remove(node)

    img = bpy.data.images.load(cfg["background"])

    image_node = tree.nodes.new("CompositorNodeImage")
    image_node.image = img

    scale_node = tree.nodes.new("CompositorNodeScale")
    scale_node.space = "RENDER_SIZE"
    scale_node.frame_method = "CROP"

    render_layers = tree.nodes.new("CompositorNodeRLayers")

    # Alpha-over the rendered spring (with transparency) onto the background.
    over = tree.nodes.new("CompositorNodeAlphaOver")
    composite = tree.nodes.new("CompositorNodeComposite")

    tree.links.new(image_node.outputs["Image"], scale_node.inputs["Image"])
    tree.links.new(scale_node.outputs["Image"], over.inputs[1])          # background
    tree.links.new(render_layers.outputs["Image"], over.inputs[2])       # foreground
    tree.links.new(over.outputs["Image"], composite.inputs["Image"])

    # Make the 3D layer render with a transparent film so alpha-over works.
    scene.render.film_transparent = True


def _import_spring(cfg: dict):
    bpy.ops.import_scene.gltf(filepath=cfg["glb"])
    imported = [o for o in bpy.context.selected_objects if o.type == "MESH"]
    if not imported:
        imported = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    if not imported:
        raise SystemExit("render_spring.py: no mesh found in the imported .glb")

    # Group everything under one empty so we can transform/animate as a unit.
    pivot = bpy.data.objects.new("SpringPivot", None)
    bpy.context.collection.objects.link(pivot)
    for obj in imported:
        obj.parent = pivot

    _normalize(imported, pivot)
    return pivot


def _normalize(meshes, pivot) -> None:
    """Center the model on its pivot and scale it to a predictable size."""
    import mathutils

    # World-space bounding box across all imported meshes.
    coords = []
    for obj in meshes:
        for corner in obj.bound_box:
            coords.append(obj.matrix_world @ mathutils.Vector(corner))
    min_v = mathutils.Vector((min(c[i] for c in coords) for i in range(3)))
    max_v = mathutils.Vector((max(c[i] for c in coords) for i in range(3)))
    center = (min_v + max_v) / 2.0
    size = max((max_v - min_v)[i] for i in range(3)) or 1.0

    pivot.location = (0.0, 0.0, 0.0)
    for obj in meshes:
        obj.location -= center
    target = 2.0  # fit the spring into a ~2 unit tall frame
    pivot.scale = (target / size, target / size, target / size)


def _place_from_bbox(pivot, cfg: dict) -> None:
    """Nudge the spring horizontally/vertically to match where it was in 2D.

    Converts the segmentation bbox center (image pixels) into a small camera-
    plane offset so the rebuilt spring lands over its original footprint.
    """
    left, top, right, bottom = cfg["bbox"]
    cx = (left + right) / 2.0 / cfg["src_width"]   # 0..1 across the frame
    cy = (top + bottom) / 2.0 / cfg["src_height"]  # 0..1 down the frame
    # Map [0,1] -> [-1,1] and scale to a gentle offset; y is inverted (image
    # top is +Z up in the camera view).
    pivot.location.x += (cx - 0.5) * 2.2
    pivot.location.z += (0.5 - cy) * 2.2


def _animate_rotation(pivot, cfg: dict) -> None:
    """One smooth full turn about the vertical axis over the whole clip."""
    scene = bpy.context.scene
    pivot.rotation_euler = (0.0, 0.0, 0.0)
    pivot.keyframe_insert(data_path="rotation_euler", frame=scene.frame_start)
    pivot.rotation_euler = (0.0, 0.0, 2.0 * math.pi)
    pivot.keyframe_insert(data_path="rotation_euler", frame=scene.frame_end)

    # Constant-speed spin (linear interpolation) so the loop is seamless.
    if pivot.animation_data and pivot.animation_data.action:
        for fcurve in pivot.animation_data.action.fcurves:
            for kp in fcurve.keyframe_points:
                kp.interpolation = "LINEAR"


def _add_camera_and_lights() -> None:
    scene = bpy.context.scene

    cam_data = bpy.data.cameras.new("Cam")
    cam = bpy.data.objects.new("Cam", cam_data)
    scene.collection.objects.link(cam)
    cam.location = (0.0, -6.0, 0.0)
    cam.rotation_euler = (math.radians(90), 0.0, 0.0)  # look down +Y
    scene.camera = cam

    # Soft three-point-ish lighting to flatter the plasticine/clay textures.
    for name, loc, energy in (
        ("Key", (4.0, -4.0, 5.0), 800.0),
        ("Fill", (-5.0, -3.0, 2.0), 300.0),
        ("Rim", (0.0, 4.0, 4.0), 500.0),
    ):
        light_data = bpy.data.lights.new(name, type="AREA")
        light_data.energy = energy
        light_data.size = 5.0
        light = bpy.data.objects.new(name, light_data)
        light.location = loc
        scene.collection.objects.link(light)


def main() -> None:
    cfg = _get_args()
    _reset_scene()
    _setup_render(cfg)
    _add_camera_and_lights()

    pivot = _import_spring(cfg)
    _place_from_bbox(pivot, cfg)
    _animate_rotation(pivot, cfg)

    _add_background_plate(cfg)

    print(f"[blender] rendering {cfg['width']}x{cfg['height']} -> {cfg['output']}")
    bpy.ops.render.render(animation=True)
    print("[blender] done.")


if __name__ == "__main__":
    main()
