"""End-to-end orchestrator — the single trigger that runs all four steps."""

from __future__ import annotations

import time
from dataclasses import dataclass
from pathlib import Path

from .config import TREND_PROMPT, settings
from .stages import s1_generate_image, s2_segment, s3_image_to_3d, s4_render
from .utils import log


@dataclass
class PipelineResult:
    hero_image: Path
    spring_cutout: Path
    glb_model: Path
    final_video: Path


def run(prompt: str = TREND_PROMPT) -> PipelineResult:
    """Run the whole viral-3D pipeline sequentially and return the artifacts."""
    started = time.monotonic()
    log("=" * 68)
    log("  INSTAGRAM 3D ART PIPELINE")
    log(f"  provider chain: image={settings.image_provider}  "
        f"3d={settings.model_3d_provider}  render=blender")
    log("=" * 68)

    # Step 1 — trend image ---------------------------------------------------
    image_url, hero = s1_generate_image.run(prompt)

    # Step 2 — isolate the spring -------------------------------------------
    cutout, bbox = s2_segment.run(image_url, hero)

    # Step 3 — image -> textured .glb ---------------------------------------
    glb = s3_image_to_3d.run(cutout)

    # Step 4 — composite + animate -> mp4 -----------------------------------
    video = s4_render.run(hero, glb, bbox)

    elapsed = time.monotonic() - started
    log("-" * 68)
    log(f"  DONE in {elapsed:.0f}s")
    log(f"  hero image : {hero}")
    log(f"  spring 3D  : {glb}")
    log(f"  final reel : {video}")
    log("-" * 68)

    return PipelineResult(
        hero_image=hero,
        spring_cutout=cutout,
        glb_model=glb,
        final_video=video,
    )
