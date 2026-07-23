"""Instagram 3D Art Pipeline.

An end-to-end, cloud-API-driven pipeline that turns a single text prompt into a
rendered, animated 3D Instagram video:

    1. Generate a 4:5 image        (Fal.ai / Flux)
    2. Isolate the "3D spring"      (Segment Anything family)
    3. Image -> textured .glb       (Tripo3D or Meshy)
    4. Composite + animate -> .mp4  (headless Blender)

Run it with ``python run_pipeline.py``.
"""

__version__ = "1.0.0"
