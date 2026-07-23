"""Fal.ai client — used for BOTH image generation (Flux) and segmentation (SAM).

Fal exposes two calling conventions:

  * Synchronous:  POST https://fal.run/<model>          (blocks, returns result)
  * Queued:       POST https://queue.fal.run/<model>    (returns a job handle)

Flux-dev and the SAM variants are fast enough for the synchronous endpoint, so
that is the default path. Auth is a single header: ``Authorization: Key <FAL_KEY>``.
"""

from __future__ import annotations

from typing import Optional

import requests

from ..config import settings
from ..utils import die, log

_SYNC_BASE = "https://fal.run"


class FalClient:
    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or settings.fal_key
        if not self.api_key:
            die("FAL_KEY is not set. Add it to your .env file (see .env.example).")

    # -- internals ----------------------------------------------------------
    @property
    def _headers(self) -> dict:
        return {
            "Authorization": f"Key {self.api_key}",
            "Content-Type": "application/json",
        }

    def _run(self, model: str, payload: dict) -> dict:
        url = f"{_SYNC_BASE}/{model}"
        resp = requests.post(
            url, json=payload, headers=self._headers, timeout=settings.request_timeout
        )
        if resp.status_code >= 400:
            die(f"Fal call to {model} failed [{resp.status_code}]: {resp.text[:500]}")
        return resp.json()

    # -- public: text -> image ---------------------------------------------
    def generate_image(self, prompt: str, width: int, height: int) -> str:
        """Generate one image and return its hosted URL."""
        log(f"requesting Flux image ({width}x{height})", step="1/4")
        data = self._run(
            settings.fal_flux_model,
            {
                "prompt": prompt,
                # Flux accepts an explicit portrait size for the 4:5 frame.
                "image_size": {"width": width, "height": height},
                "num_images": 1,
                "enable_safety_checker": True,
                "output_format": "png",
            },
        )
        images = data.get("images") or []
        if not images or "url" not in images[0]:
            die(f"Fal returned no image url: {data}")
        return images[0]["url"]

    # -- public: image + text -> segmentation mask -------------------------
    def segment(self, image_url: str, target: str) -> str:
        """Run text-prompted Segment-Anything and return a MASK image URL.

        The mask is a white-on-black cut-out of ``target`` (the spring). We then
        composite it against the original locally to get a clean crop.
        """
        log(f"segmenting '{target}' with {settings.fal_sam_model}", step="2/4")
        data = self._run(
            settings.fal_sam_model,
            {
                "image_url": image_url,
                # Text-promptable SAM variants (EVF-SAM / Grounded-SAM) take a
                # natural-language target here. For click-based SAM2 you would
                # instead pass point/box coordinates.
                "prompt": target,
            },
        )
        # Different SAM variants nest the mask differently; probe the common keys.
        mask_url = (
            _first_url(data.get("image"))
            or _first_url(data.get("mask"))
            or _first_url((data.get("masks") or [None])[0])
        )
        if not mask_url:
            die(f"segmentation returned no mask url: {data}")
        return mask_url


def _first_url(node) -> Optional[str]:
    """Fal returns file refs as either a bare url string or a {'url': ...} dict."""
    if isinstance(node, str):
        return node
    if isinstance(node, dict):
        return node.get("url")
    return None
