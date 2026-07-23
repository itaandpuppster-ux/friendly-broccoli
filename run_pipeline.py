#!/usr/bin/env python3
"""Single-trigger entrypoint for the Instagram 3D Art Pipeline.

Just run:

    python run_pipeline.py

…and the whole chain executes: Flux image -> SAM crop -> Tripo/Meshy 3D ->
Blender MP4. Every artifact lands in ./output/.

Optional overrides (handy from a phone terminal):

    python run_pipeline.py --prompt "your own prompt"
    python run_pipeline.py --image-provider fal   --model-3d meshy
    python run_pipeline.py --preflight             # just check keys + Blender

API keys are read from environment variables or a local .env file. Copy
.env.example -> .env and paste your keys. See PIPELINE_README.md.
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from instagram_3d_pipeline import pipeline
from instagram_3d_pipeline.config import TREND_PROMPT, settings


def _preflight() -> bool:
    """Print a readiness report for keys and the Blender binary."""
    ok = True
    print("Preflight check:")

    def check(label: str, present: bool) -> None:
        nonlocal ok
        mark = "OK " if present else "-- "
        print(f"  [{mark}] {label}")
        ok = ok and present

    if settings.image_provider == "fal":
        check("FAL_KEY (image gen + segmentation)", bool(settings.fal_key))
    else:
        check("Midjourney base url", bool(settings.midjourney_base_url))
        check("Midjourney api key", bool(settings.midjourney_api_key))
        # Segmentation still uses Fal by default.
        check("FAL_KEY (segmentation)", bool(settings.fal_key))

    if settings.model_3d_provider == "tripo":
        check("TRIPO_API_KEY (image -> 3D)", bool(settings.tripo_api_key))
    else:
        check("MESHY_API_KEY (image -> 3D)", bool(settings.meshy_api_key))

    blender_ok = (
        shutil.which(settings.blender_bin) is not None
        or Path(settings.blender_bin).exists()
    )
    check(f"Blender binary ('{settings.blender_bin}')", blender_ok)

    print("Ready to run." if ok else "Missing prerequisites above — see PIPELINE_README.md.")
    return ok


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the Instagram 3D art pipeline.")
    parser.add_argument("--prompt", default=TREND_PROMPT, help="override the trend prompt")
    parser.add_argument("--image-provider", choices=["fal", "midjourney"], default=None)
    parser.add_argument("--model-3d", choices=["tripo", "meshy"], default=None)
    parser.add_argument("--preflight", action="store_true", help="check readiness and exit")
    args = parser.parse_args()

    if args.image_provider:
        settings.image_provider = args.image_provider
    if args.model_3d:
        settings.model_3d_provider = args.model_3d

    if args.preflight:
        raise SystemExit(0 if _preflight() else 1)

    pipeline.run(args.prompt)


if __name__ == "__main__":
    main()
