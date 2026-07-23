"""Step 2 — 3D OBJECT ISOLATION.

Automatically detect, mask and crop the "3D spring" out of the hero image using
a text-promptable Segment-Anything model. The remote model gives us a binary
mask; we apply it locally with Pillow to produce a tight, transparent PNG crop
that the image->3D provider can consume.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

from ..clients.fal_client import FalClient
from ..config import SEGMENT_TARGET, settings
from ..utils import download, log


def run(image_url: str, image_path: Path) -> tuple[Path, tuple[int, int, int, int]]:
    """Return (cropped_png_path, bbox) where bbox is (left, top, right, bottom).

    The bbox is expressed in the ORIGINAL hero-image pixel space so Step 4 can
    place the rebuilt 3D model exactly where the flat spring used to be.
    """
    mask_url = FalClient().segment(image_url, SEGMENT_TARGET)
    mask_path = download(mask_url, settings.artifact("02_mask.png"))

    crop_path, bbox = _apply_mask(image_path, mask_path)
    log(f"isolated spring -> {crop_path}  bbox={bbox}", step="2/4")
    return crop_path, bbox


def _apply_mask(
    image_path: Path, mask_path: Path
) -> tuple[Path, tuple[int, int, int, int]]:
    """Composite the mask onto the source, crop to the mask's bounding box."""
    src = Image.open(image_path).convert("RGBA")
    mask = Image.open(mask_path).convert("L").resize(src.size)

    # Threshold to a clean alpha channel and find the object's tight bbox.
    alpha = mask.point(lambda p: 255 if p > 127 else 0)
    bbox = alpha.getbbox()
    if bbox is None:
        # Mask empty -> fall back to the whole frame so the pipeline still runs.
        bbox = (0, 0, src.width, src.height)
        log("warning: empty segmentation mask, using full frame", step="2/4")

    src.putalpha(alpha)
    # Pad the crop slightly so the coil isn't clipped at the very edge.
    pad = 16
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(src.width, bbox[2] + pad)
    bottom = min(src.height, bbox[3] + pad)

    cropped = src.crop((left, top, right, bottom))
    out = settings.artifact("02_spring_cutout.png")
    cropped.save(out)
    return out, (left, top, right, bottom)
