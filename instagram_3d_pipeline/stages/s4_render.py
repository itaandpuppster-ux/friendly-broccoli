"""Step 4 — 3D RENDERING & VANE COMPOSITING.

Superimpose the freshly generated 3D spring back over the original background
with a slow rotational animation, and render the result to a high-fidelity
4:5 MP4 using headless Blender.

Blender runs as a separate process:

    blender --background --python blender/render_spring.py -- <json-args>

We hand the child script a single JSON blob of arguments (paths, geometry,
timing) via argv after the ``--`` separator, which is Blender's convention for
passing user args through to a Python script.
"""

from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

from ..config import settings
from ..utils import die, log


def run(background_path: Path, glb_path: Path, bbox: tuple[int, int, int, int]) -> Path:
    """Render the final MP4 and return its path."""
    if shutil.which(settings.blender_bin) is None and not Path(settings.blender_bin).exists():
        die(
            f"Blender binary '{settings.blender_bin}' not found. Install Blender and "
            f"either put it on PATH or set BLENDER_BIN. See PIPELINE_README.md."
        )

    output_mp4 = settings.artifact("04_final_instagram_reel.mp4")
    render_script = Path(__file__).resolve().parent.parent / "blender" / "render_spring.py"

    args = {
        "background": str(background_path),
        "glb": str(glb_path),
        "output": str(output_mp4),
        # Where the flat spring sat in the source image, so we can re-seat the
        # 3D model in the same spot.
        "bbox": list(bbox),
        "src_width": settings.gen_width,
        "src_height": settings.gen_height,
        "width": settings.video_width,
        "height": settings.video_height,
        "fps": settings.video_fps,
        "seconds": settings.video_seconds,
    }

    cmd = [
        settings.blender_bin,
        "--background",
        "--python",
        str(render_script),
        "--",
        json.dumps(args),
    ]

    log("launching headless Blender render…", step="4/4")
    log(" ".join(cmd[:5]) + " -- <args>", step="4/4")
    proc = subprocess.run(cmd, capture_output=True, text=True)

    # Surface Blender's own logging so failures are debuggable from the phone.
    if proc.stdout:
        print(proc.stdout[-4000:])
    if proc.returncode != 0:
        print(proc.stderr[-4000:])
        die(f"Blender exited with code {proc.returncode}")

    if not output_mp4.exists():
        die("Blender finished but no MP4 was produced — check the log above.")

    log(f"final video ready: {output_mp4}", step="4/4")
    return output_mp4
