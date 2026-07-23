"""Central configuration for the pipeline.

Everything you might want to tweak lives here so the rest of the code stays
declarative. API keys are read from environment variables (or a local ``.env``
file) — never hard-code secrets into source.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

try:
    # Optional convenience: auto-load a local .env if python-dotenv is present.
    from dotenv import load_dotenv

    load_dotenv()
except Exception:  # pragma: no cover - dotenv is optional
    pass


# ---------------------------------------------------------------------------
# The single, embedded trend prompt that drives the whole pipeline.
# ---------------------------------------------------------------------------
TREND_PROMPT = (
    "A viral 3D digital art composition. Surreal, floating 'Trinity' background "
    "with three massive geometric arches layered in deep perspective, shifting "
    "from pastel lavender to muted terracotta. In the center, a minimalist human "
    "character interacts with an oversized 3D spiral spring. Tactile, hand-molded "
    "plasticine mixed with smooth clay-like textures. Deep-of-field blurring in "
    "the background, sharp crisp focus on the central objects."
)

# Text label handed to the segmentation model so it knows what to cut out.
SEGMENT_TARGET = "spiral spring coil"


def _env(name: str, default: str = "") -> str:
    """Read an env var, treating whitespace-only values as empty."""
    return (os.environ.get(name) or default).strip()


@dataclass
class Settings:
    """Runtime settings. Adjust providers, sizes and output paths here."""

    # --- Provider selection -------------------------------------------------
    # image gen:   "fal"  | "midjourney"
    # segmentation:"fal"
    # image->3d:   "tripo" | "meshy"
    image_provider: str = _env("IMAGE_PROVIDER", "fal")
    model_3d_provider: str = _env("MODEL_3D_PROVIDER", "tripo")

    # --- API keys (pulled from environment / .env) --------------------------
    fal_key: str = field(default_factory=lambda: _env("FAL_KEY"))
    midjourney_api_key: str = field(default_factory=lambda: _env("MIDJOURNEY_API_KEY"))
    midjourney_base_url: str = field(default_factory=lambda: _env("MIDJOURNEY_BASE_URL"))
    tripo_api_key: str = field(default_factory=lambda: _env("TRIPO_API_KEY"))
    meshy_api_key: str = field(default_factory=lambda: _env("MESHY_API_KEY"))

    # --- Fal model slugs (verify against current fal.ai model listings) -----
    # Flux endpoint used for the hero image.
    fal_flux_model: str = _env("FAL_FLUX_MODEL", "fal-ai/flux/dev")
    # Text-promptable Segment-Anything variant (Grounded/EVF-SAM style) so the
    # "spring" can be found automatically from a word rather than click points.
    fal_sam_model: str = _env("FAL_SAM_MODEL", "fal-ai/evf-sam")

    # --- Instagram output geometry (4:5 portrait) ---------------------------
    # 1080x1350 is Instagram's max-quality 4:5 frame. Flux wants multiples of
    # 32; 1024x1280 keeps the ratio and upscales cleanly at render time.
    gen_width: int = 1024
    gen_height: int = 1280
    video_width: int = 1080
    video_height: int = 1350
    video_fps: int = 30
    video_seconds: float = 5.0  # one smooth spring rotation loop

    # --- Networking ---------------------------------------------------------
    request_timeout: int = 120          # per-request seconds
    poll_interval: float = 5.0          # seconds between job-status polls
    poll_timeout: float = 900.0         # give async jobs up to 15 minutes

    # --- Filesystem ---------------------------------------------------------
    output_dir: Path = field(default_factory=lambda: Path(_env("OUTPUT_DIR", "output")))

    # Path to the Blender binary (or just "blender" if it is on PATH).
    blender_bin: str = _env("BLENDER_BIN", "blender")

    def artifact(self, name: str) -> Path:
        """Return an absolute path inside the run's output directory."""
        self.output_dir.mkdir(parents=True, exist_ok=True)
        return (self.output_dir / name).resolve()


# A single shared instance the rest of the code imports.
settings = Settings()
