# 📱 Instagram 3D Art Pipeline

An end-to-end, cloud-API automation that turns **one text prompt** into a
rendered, animated **4:5 Instagram video** — designed to be triggered from a
single command, even on a phone terminal.

```
  Trend prompt
       │
   ┌───▼──────────────┐   ┌──────────────────┐   ┌────────────────┐   ┌─────────────────────┐
   │ 1. Flux (Fal.ai) │──▶│ 2. Segment (SAM) │──▶│ 3. Tripo/Meshy │──▶│ 4. Blender → MP4    │
   │  4:5 hero image  │   │  isolate spring  │   │  image → .glb  │   │  spin + composite   │
   └──────────────────┘   └──────────────────┘   └────────────────┘   └─────────────────────┘
```

Every artifact is written to `./output/`:

| File | What it is |
|------|-----------|
| `01_hero.png` | The generated 4:5 trend image |
| `02_mask.png` / `02_spring_cutout.png` | Segmentation mask + isolated spring |
| `03_spring.glb` | Textured 3D model of the spring |
| `04_final_instagram_reel.mp4` | The final animated video |

---

## 1. Where to put your API keys 🔑

Copy the template and paste your real keys — **this is the only place you edit**:

```bash
cp .env.example .env
nano .env        # or vi / any editor
```

```dotenv
# .env
FAL_KEY=your-fal-key-here          # Step 1 (Flux) + Step 2 (SAM)
TRIPO_API_KEY=your-tripo-key-here  # Step 3 (image → 3D)   [default]
# MESHY_API_KEY=your-meshy-key     # …or use Meshy instead
```

Where to get them:

- **Fal.ai** → https://fal.ai/dashboard/keys
- **Tripo3D** → https://platform.tripo3d.ai (API keys)
- **Meshy** (optional alt) → https://www.meshy.ai/settings/api
- **Midjourney** (optional): no official API — use a proxy (useapi.net, goapi.ai,
  imagineapi.dev) and set `MIDJOURNEY_BASE_URL` + `MIDJOURNEY_API_KEY`, then
  run with `--image-provider midjourney`.

> Keys are read from the environment, so `export FAL_KEY=...` works too — handy
> in CI or a locked-down phone shell.

---

## 2. Install

```bash
pip install -r requirements.txt
```

**Blender** (Step 4) is a separate binary, not a pip package:

- Desktop/server: install Blender ≥ 3.6 and make sure `blender` is on your PATH,
  or set `BLENDER_BIN=/full/path/to/blender` in `.env`.
- On a phone: run Steps 1–3 anywhere, and either install Blender inside
  **Termux (proot Ubuntu)** or point `BLENDER_BIN` at a small cloud box / render
  service. Steps 1–3 need no local GPU at all — they're pure API calls.

---

## 3. Run it (single trigger) ▶️

```bash
python run_pipeline.py
```

That one command runs all four steps in order and drops the MP4 in `./output/`.

Check readiness first (keys + Blender) without spending any credits:

```bash
python run_pipeline.py --preflight
```

Useful overrides:

```bash
python run_pipeline.py --prompt "your own idea --ar 4:5"
python run_pipeline.py --model-3d meshy
python run_pipeline.py --image-provider midjourney
```

---

## 4. Running from your phone 📲

Any terminal app works — **Termux** (Android), **iSH** / **a-Shell** (iOS):

```bash
pkg install python                # Termux
git clone <this-repo> && cd friendly-broccoli
pip install -r requirements.txt
cp .env.example .env && nano .env # paste keys
python run_pipeline.py --preflight
python run_pipeline.py
```

Steps 1–3 are just HTTPS requests, so they run comfortably on a phone. For Step
4, either use Blender in a Termux proot, or set `BLENDER_BIN` to a remote
Blender you can reach — the rest of the pipeline is identical.

---

## Project layout

```
run_pipeline.py                     # single-trigger entrypoint
instagram_3d_pipeline/
├── config.py                       # ← settings, sizes, embedded trend prompt
├── pipeline.py                     # orchestrates the 4 steps
├── utils.py                        # logging, polling, downloads
├── clients/
│   ├── fal_client.py               # Flux image gen + SAM segmentation
│   ├── tripo_client.py             # image → .glb (default)
│   └── meshy_client.py             # image → .glb (alternative)
├── stages/
│   ├── s1_generate_image.py        # Step 1
│   ├── s2_segment.py               # Step 2
│   ├── s3_image_to_3d.py           # Step 3
│   └── s4_render.py                # Step 4 (drives Blender)
└── blender/
    └── render_spring.py            # headless Blender render script
```

---

## Notes & knobs

- **Model slugs**: Fal model names (`fal-ai/flux/dev`, `fal-ai/evf-sam`) and the
  3D providers' options move fast. If a call 404s, check the provider's current
  model list and update the slug in `config.py` (or via `FAL_FLUX_MODEL` /
  `FAL_SAM_MODEL` env vars).
- **Cost**: each run spends credits on 3–4 providers. Use `--preflight` while
  wiring things up.
- **Render engine**: `blender/render_spring.py` uses Eevee for speed. Switch it
  to Cycles for maximum fidelity if you have a GPU.
- **Video geometry**: 1080×1350 (Instagram 4:5), 30 fps, ~5 s loop — all in
  `config.py`.
