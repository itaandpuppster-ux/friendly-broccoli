"""Step 1 — IMAGE CREATION (Layout & Trend).

Generate a 4:5 Instagram-optimized hero image from the embedded trend prompt.
Default provider is Fal.ai/Flux; Midjourney (via a proxy) is a pluggable option.
"""

from __future__ import annotations

from pathlib import Path

from ..clients.fal_client import FalClient
from ..config import settings
from ..utils import die, download, log


def run(prompt: str) -> tuple[str, Path]:
    """Return (hosted_image_url, local_image_path)."""
    provider = settings.image_provider.lower()

    if provider == "fal":
        url = FalClient().generate_image(prompt, settings.gen_width, settings.gen_height)
    elif provider == "midjourney":
        url = _midjourney(prompt)
    else:
        die(f"unknown image_provider '{provider}' (use 'fal' or 'midjourney')")

    local = download(url, settings.artifact("01_hero.png"))
    log(f"hero image ready: {local}", step="1/4")
    # We keep the hosted URL too — some 3D providers accept a URL directly.
    return url, local


def _midjourney(prompt: str) -> str:
    """Midjourney has no official API; drive it through a hosted proxy.

    The exact request shape depends on the proxy you subscribe to
    (useapi.net, goapi.ai, imagineapi.dev, ...). This implements the common
    "imagine -> poll -> upscale first tile" pattern. Fill in MIDJOURNEY_BASE_URL
    and MIDJOURNEY_API_KEY to enable it.
    """
    import requests

    from ..utils import poll_until

    base = settings.midjourney_base_url.rstrip("/")
    key = settings.midjourney_api_key
    if not (base and key):
        die("Midjourney selected but MIDJOURNEY_BASE_URL / MIDJOURNEY_API_KEY unset.")

    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    # Append the aspect-ratio flag so Midjourney renders the 4:5 frame natively.
    submit = requests.post(
        f"{base}/imagine",
        headers=headers,
        json={"prompt": f"{prompt} --ar 4:5 --v 6"},
        timeout=settings.request_timeout,
    )
    submit.raise_for_status()
    job_id = submit.json().get("id") or submit.json().get("taskId")
    if not job_id:
        die(f"Midjourney proxy returned no job id: {submit.text[:300]}")

    result = poll_until(
        fetch=lambda: requests.get(
            f"{base}/message/{job_id}", headers=headers,
            timeout=settings.request_timeout,
        ).json(),
        is_done=lambda d: d.get("status") in ("done", "completed", "SUCCESS"),
        is_failed=lambda d: d.get("status") in ("failed", "error"),
        describe=lambda d: str(d.get("status")),
        step="1/4",
    )
    url = result.get("uri") or result.get("imageUrl") or result.get("url")
    if not url:
        die(f"Midjourney proxy returned no image url: {result}")
    return url
