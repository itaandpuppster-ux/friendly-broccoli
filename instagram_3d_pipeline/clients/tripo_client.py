"""Tripo3D client — image -> textured .glb.

Flow (Tripo v2 OpenAPI):
  1. POST /upload                    multipart file  -> image_token
  2. POST /task  {image_to_model}    image_token     -> task_id
  3. GET  /task/{task_id}            poll            -> status + model url
  4. download the .glb

Auth: ``Authorization: Bearer <TRIPO_API_KEY>``.
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

import requests

from ..config import settings
from ..utils import die, download, log, poll_until

_BASE = "https://api.tripo3d.ai/v2/openapi"


class TripoClient:
    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or settings.tripo_api_key
        if not self.api_key:
            die("TRIPO_API_KEY is not set. Add it to your .env file.")

    @property
    def _headers(self) -> dict:
        return {"Authorization": f"Bearer {self.api_key}"}

    def _upload(self, image_path: Path) -> tuple[str, str]:
        """Upload the cropped image; return (image_token, file_type)."""
        suffix = image_path.suffix.lower().lstrip(".") or "png"
        file_type = "jpeg" if suffix in ("jpg", "jpeg") else "png"
        with open(image_path, "rb") as fh:
            resp = requests.post(
                f"{_BASE}/upload",
                headers=self._headers,
                files={"file": (image_path.name, fh, f"image/{file_type}")},
                timeout=settings.request_timeout,
            )
        if resp.status_code >= 400:
            die(f"Tripo upload failed [{resp.status_code}]: {resp.text[:400]}")
        token = (resp.json().get("data") or {}).get("image_token")
        if not token:
            die(f"Tripo upload returned no image_token: {resp.text[:400]}")
        return token, file_type

    def _create_task(self, image_token: str, file_type: str) -> str:
        resp = requests.post(
            f"{_BASE}/task",
            headers={**self._headers, "Content-Type": "application/json"},
            json={
                "type": "image_to_model",
                "file": {"type": file_type, "file_token": image_token},
                "texture": True,
                "pbr": True,  # production-ready PBR textures
            },
            timeout=settings.request_timeout,
        )
        if resp.status_code >= 400:
            die(f"Tripo task create failed [{resp.status_code}]: {resp.text[:400]}")
        task_id = (resp.json().get("data") or {}).get("task_id")
        if not task_id:
            die(f"Tripo task create returned no task_id: {resp.text[:400]}")
        return task_id

    def _fetch(self, task_id: str) -> dict:
        resp = requests.get(
            f"{_BASE}/task/{task_id}", headers=self._headers,
            timeout=settings.request_timeout,
        )
        resp.raise_for_status()
        return resp.json().get("data") or {}

    def image_to_glb(self, image_path: Path, dest: Path) -> Path:
        log("uploading cropped spring to Tripo3D", step="3/4")
        token, file_type = self._upload(image_path)
        task_id = self._create_task(token, file_type)
        log(f"Tripo task {task_id} queued", step="3/4")

        result = poll_until(
            fetch=lambda: self._fetch(task_id),
            is_done=lambda d: d.get("status") == "success",
            is_failed=lambda d: d.get("status") in ("failed", "cancelled", "banned"),
            describe=lambda d: f"status={d.get('status')} {d.get('progress', 0)}%",
            step="3/4",
        )

        # PBR model preferred; fall back to the base model url.
        output = result.get("output") or {}
        model_url = (
            output.get("pbr_model")
            or output.get("model")
            or output.get("base_model")
        )
        if not model_url:
            die(f"Tripo success but no model url in output: {output}")
        return download(model_url, dest)
