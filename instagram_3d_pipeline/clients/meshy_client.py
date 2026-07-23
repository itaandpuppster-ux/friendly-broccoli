"""Meshy client — image -> textured .glb (drop-in alternative to Tripo3D).

Flow (Meshy OpenAPI v1):
  1. POST /openapi/v1/image-to-3d   {image_url}  -> task id
  2. GET  /openapi/v1/image-to-3d/{id}           -> poll -> model_urls.glb
  3. download the .glb

Meshy accepts a public image URL directly, so no separate upload step is
needed. Auth: ``Authorization: Bearer <MESHY_API_KEY>``.
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

import requests

from ..config import settings
from ..utils import die, download, log, poll_until

_BASE = "https://api.meshy.ai/openapi/v1"


class MeshyClient:
    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or settings.meshy_api_key
        if not self.api_key:
            die("MESHY_API_KEY is not set. Add it to your .env file.")

    @property
    def _headers(self) -> dict:
        return {"Authorization": f"Bearer {self.api_key}"}

    def _create_task(self, image_url: str) -> str:
        resp = requests.post(
            f"{_BASE}/image-to-3d",
            headers={**self._headers, "Content-Type": "application/json"},
            json={
                "image_url": image_url,
                "enable_pbr": True,
                "should_texture": True,
                "ai_model": "meshy-5",
            },
            timeout=settings.request_timeout,
        )
        if resp.status_code >= 400:
            die(f"Meshy task create failed [{resp.status_code}]: {resp.text[:400]}")
        task_id = resp.json().get("result")
        if not task_id:
            die(f"Meshy task create returned no id: {resp.text[:400]}")
        return task_id

    def _fetch(self, task_id: str) -> dict:
        resp = requests.get(
            f"{_BASE}/image-to-3d/{task_id}", headers=self._headers,
            timeout=settings.request_timeout,
        )
        resp.raise_for_status()
        return resp.json()

    def image_to_glb(self, image_url: str, dest: Path) -> Path:
        log("submitting cropped spring to Meshy", step="3/4")
        task_id = self._create_task(image_url)
        log(f"Meshy task {task_id} queued", step="3/4")

        result = poll_until(
            fetch=lambda: self._fetch(task_id),
            is_done=lambda d: d.get("status") == "SUCCEEDED",
            is_failed=lambda d: d.get("status") in ("FAILED", "CANCELED", "EXPIRED"),
            describe=lambda d: f"status={d.get('status')} {d.get('progress', 0)}%",
            step="3/4",
        )

        glb = (result.get("model_urls") or {}).get("glb")
        if not glb:
            die(f"Meshy success but no glb url: {result.get('model_urls')}")
        return download(glb, dest)
