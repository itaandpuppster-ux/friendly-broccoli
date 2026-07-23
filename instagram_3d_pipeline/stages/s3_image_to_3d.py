"""Step 3 — IMAGE-TO-3D GENERATION.

Send the isolated spring crop to Tripo3D (default) or Meshy and download a
production-ready, textured .glb model.
"""

from __future__ import annotations

from pathlib import Path

from ..clients.meshy_client import MeshyClient
from ..clients.tripo_client import TripoClient
from ..config import settings
from ..utils import die, log


def run(crop_path: Path) -> Path:
    """Return the local path to the generated .glb model."""
    provider = settings.model_3d_provider.lower()
    dest = settings.artifact("03_spring.glb")

    if provider == "tripo":
        # Tripo uploads the local file directly (best for transparent PNGs).
        glb = TripoClient().image_to_glb(crop_path, dest)
    elif provider == "meshy":
        # Meshy wants a public URL. Tripo's uploader or any object store works;
        # here we re-upload the cutout through Fal's storage for a public link.
        image_url = _publish(crop_path)
        glb = MeshyClient().image_to_glb(image_url, dest)
    else:
        die(f"unknown model_3d_provider '{provider}' (use 'tripo' or 'meshy')")

    log(f"3D model ready: {glb}", step="3/4")
    return glb


def _publish(path: Path) -> str:
    """Upload a local image to Fal storage and return its public URL.

    Meshy needs an internet-reachable image URL; this gives us one without
    standing up an S3 bucket.
    """
    import requests

    from ..config import settings as cfg

    if not cfg.fal_key:
        die("Meshy path needs FAL_KEY to publish the cutout, or supply your own URL.")

    with open(path, "rb") as fh:
        resp = requests.post(
            "https://rest.alpha.fal.ai/storage/upload",
            headers={"Authorization": f"Key {cfg.fal_key}"},
            files={"file": (path.name, fh, "image/png")},
            timeout=cfg.request_timeout,
        )
    if resp.status_code >= 400:
        die(f"Fal storage upload failed [{resp.status_code}]: {resp.text[:300]}")
    url = resp.json().get("access_url") or resp.json().get("url")
    if not url:
        die(f"Fal storage returned no url: {resp.text[:300]}")
    return url
