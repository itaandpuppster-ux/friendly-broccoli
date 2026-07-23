"""Small shared helpers: logging, HTTP polling and file download."""

from __future__ import annotations

import sys
import time
from pathlib import Path
from typing import Callable, Optional

import requests

from .config import settings


# ---------------------------------------------------------------------------
# Logging — tiny, dependency-free, phone-terminal friendly.
# ---------------------------------------------------------------------------
def log(message: str, step: Optional[str] = None) -> None:
    prefix = f"[{step}] " if step else ""
    print(f"{prefix}{message}", flush=True)


def die(message: str) -> "NoReturn":  # type: ignore[name-defined]
    print(f"\n[FATAL] {message}", file=sys.stderr, flush=True)
    raise SystemExit(1)


# ---------------------------------------------------------------------------
# HTTP helpers.
# ---------------------------------------------------------------------------
def download(url: str, dest: Path) -> Path:
    """Stream a remote file to disk and return its path."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    with requests.get(url, stream=True, timeout=settings.request_timeout) as r:
        r.raise_for_status()
        with open(dest, "wb") as fh:
            for chunk in r.iter_content(chunk_size=1 << 16):
                if chunk:
                    fh.write(chunk)
    log(f"downloaded -> {dest}")
    return dest


def poll_until(
    fetch: Callable[[], dict],
    is_done: Callable[[dict], bool],
    is_failed: Callable[[dict], bool] = lambda _: False,
    describe: Callable[[dict], str] = lambda _: "",
    step: Optional[str] = None,
) -> dict:
    """Generic async-job poller shared by Tripo/Meshy/Fal-queue clients.

    Repeatedly calls ``fetch`` until ``is_done`` returns True, raising on
    timeout or when ``is_failed`` trips.
    """
    deadline = time.monotonic() + settings.poll_timeout
    while True:
        payload = fetch()
        if is_failed(payload):
            die(f"remote job reported failure: {payload}")
        if is_done(payload):
            return payload
        note = describe(payload)
        log(f"…waiting{f' ({note})' if note else ''}", step=step)
        if time.monotonic() > deadline:
            die(f"timed out after {settings.poll_timeout:.0f}s waiting for job")
        time.sleep(settings.poll_interval)
