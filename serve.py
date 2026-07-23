#!/usr/bin/env python3
"""Local phone-friendly web app for the Instagram 3D Art Pipeline.

Serves the mobile control panel (webapp/page.html) and drives the real pipeline
from a tap. Pure Python standard library — no extra dependencies — so it runs in
Termux / iSH just like the CLI.

    python serve.py                 # then open http://localhost:8000
    python serve.py --port 8080
    python serve.py --host 0.0.0.0  # reach it from your phone on the same Wi-Fi

Endpoints the page uses:
    GET  /                 the control panel
    GET  /api/health       readiness (keys + Blender)
    POST /api/run          kick off the pipeline in the background
    GET  /api/status       live progress (which step, done, output links)
    GET  /output/<file>    the generated image / model / MP4
"""

from __future__ import annotations

import argparse
import json
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from instagram_3d_pipeline.config import TREND_PROMPT, settings
from instagram_3d_pipeline.stages import (
    s1_generate_image,
    s2_segment,
    s3_image_to_3d,
    s4_render,
)

ROOT = Path(__file__).resolve().parent
PAGE = ROOT / "webapp" / "page.html"

# Shared, thread-safe-enough progress state for a single-user local tool.
STATE: dict = {"running": False, "step": 0, "done": False, "error": None, "video": None}
_LOCK = threading.Lock()


def _readiness() -> dict:
    """Which prerequisites are satisfied (mirrors run_pipeline --preflight)."""
    import shutil

    checks = {
        "fal_key": bool(settings.fal_key),
        "tripo_key": bool(settings.tripo_api_key),
        "meshy_key": bool(settings.meshy_api_key),
        "blender": shutil.which(settings.blender_bin) is not None
        or Path(settings.blender_bin).exists(),
    }
    model_ok = checks["tripo_key"] if settings.model_3d_provider == "tripo" else checks["meshy_key"]
    checks["ready"] = checks["fal_key"] and model_ok and checks["blender"]
    return checks


def _worker() -> None:
    """Run the four steps sequentially, updating STATE as we go."""
    def mark(step: int) -> None:
        with _LOCK:
            STATE["step"] = step

    try:
        mark(1)
        image_url, hero = s1_generate_image.run(TREND_PROMPT)
        mark(2)
        cutout, bbox = s2_segment.run(image_url, hero)
        mark(3)
        glb = s3_image_to_3d.run(cutout)
        mark(4)
        video = s4_render.run(hero, glb, bbox)
        with _LOCK:
            STATE.update(running=False, done=True, video=f"/output/{Path(video).name}")
    except SystemExit as exc:  # pipeline calls die() -> SystemExit
        with _LOCK:
            STATE.update(running=False, error=str(exc) or "Pipeline stopped early.")
    except Exception as exc:  # pragma: no cover - surface any unexpected failure
        with _LOCK:
            STATE.update(running=False, error=f"{type(exc).__name__}: {exc}")


def _render_page() -> bytes:
    """Wrap the shared page fragment in a full, mobile-ready HTML document."""
    fragment = PAGE.read_text(encoding="utf-8")
    doc = (
        "<!doctype html><html lang='en'><head><meta charset='utf-8'>"
        "<meta name='viewport' content='width=device-width, initial-scale=1, "
        "viewport-fit=cover'>"
        "<title>Trinity Spring Studio</title>"
        "<style>html,body{margin:0;padding:0}</style></head><body>"
        f"{fragment}</body></html>"
    )
    return doc.encode("utf-8")


class Handler(BaseHTTPRequestHandler):
    def _send(self, code: int, body: bytes, ctype: str) -> None:
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _json(self, obj: dict, code: int = 200) -> None:
        self._send(code, json.dumps(obj).encode("utf-8"), "application/json")

    def do_GET(self) -> None:  # noqa: N802 (stdlib naming)
        path = self.path.split("?", 1)[0]
        if path in ("/", "/index.html"):
            self._send(200, _render_page(), "text/html; charset=utf-8")
        elif path == "/api/health":
            self._json({"ok": True, **_readiness()})
        elif path == "/api/status":
            with _LOCK:
                self._json(dict(STATE))
        elif path.startswith("/output/"):
            self._serve_output(path[len("/output/"):])
        else:
            self._json({"error": "not found"}, 404)

    def do_POST(self) -> None:  # noqa: N802
        if self.path.split("?", 1)[0] == "/api/run":
            with _LOCK:
                if STATE["running"]:
                    self._json({"started": False, "reason": "already running"})
                    return
                STATE.update(running=True, step=1, done=False, error=None, video=None)
            threading.Thread(target=_worker, daemon=True).start()
            self._json({"started": True})
        else:
            self._json({"error": "not found"}, 404)

    def _serve_output(self, name: str) -> None:
        # Guard against path traversal — only serve files directly in output/.
        safe = (settings.output_dir / Path(name).name).resolve()
        out_dir = settings.output_dir.resolve()
        if not str(safe).startswith(str(out_dir)) or not safe.exists():
            self._json({"error": "not found"}, 404)
            return
        ctype = {
            ".mp4": "video/mp4", ".png": "image/png",
            ".jpg": "image/jpeg", ".glb": "model/gltf-binary",
        }.get(safe.suffix.lower(), "application/octet-stream")
        self._send(200, safe.read_bytes(), ctype)

    def log_message(self, *_args) -> None:  # keep the phone terminal quiet
        pass


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve the mobile pipeline control panel.")
    parser.add_argument("--host", default="127.0.0.1",
                        help="bind address (use 0.0.0.0 to reach it from your phone)")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    shown = "localhost" if args.host in ("127.0.0.1", "localhost") else args.host
    print(f"Trinity Spring Studio → http://{shown}:{args.port}")
    print("  Ctrl+C to stop.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nbye.")


if __name__ == "__main__":
    main()
