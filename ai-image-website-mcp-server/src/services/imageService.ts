/**
 * Image generation service.
 *
 * Uses the free Pollinations.ai image API (no API key required) to turn a
 * text prompt into a real AI-generated image. If the API is unreachable
 * (offline machine, blocked network), it falls back to writing a styled SVG
 * placeholder locally so website building always succeeds.
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as crypto from "node:crypto";
import {
  POLLINATIONS_BASE_URL,
  IMAGES_DIR,
  IMAGE_TIMEOUT_MS,
} from "../constants.js";

export type ImageStyle =
  | "photorealistic"
  | "digital-art"
  | "3d-render"
  | "anime"
  | "watercolor"
  | "pixel-art"
  | "minimalist"
  | "cinematic"
  | "none";

export interface GeneratedImage {
  /** Absolute path of the saved image file. */
  filePath: string;
  /** File name only, e.g. "sunset-beach-a1b2c3.jpg". */
  fileName: string;
  /** The full prompt that was sent to the generator (including style suffix). */
  fullPrompt: string;
  /** Direct URL that regenerates this exact image (same seed). */
  sourceUrl: string;
  width: number;
  height: number;
  seed: number;
  /** True when the API could not be reached and a local SVG placeholder was written instead. */
  placeholder: boolean;
}

const STYLE_SUFFIXES: Record<Exclude<ImageStyle, "none">, string> = {
  photorealistic:
    "photorealistic, ultra detailed, natural lighting, high resolution photography",
  "digital-art": "digital art, vibrant colors, highly detailed illustration",
  "3d-render": "3d render, octane render, soft studio lighting, high detail",
  anime: "anime style, studio quality, clean line art, vivid colors",
  watercolor: "watercolor painting, soft brush strokes, artistic, paper texture",
  "pixel-art": "pixel art, 16-bit, crisp pixels, retro game style",
  minimalist: "minimalist flat design, clean composition, simple shapes",
  cinematic: "cinematic still, dramatic lighting, film grain, wide dynamic range",
};

/** Turn a prompt into a short, filesystem-safe slug. */
export function slugify(text: string, maxLength = 40): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/-+$/g, "");
  return slug || "image";
}

export function buildFullPrompt(prompt: string, style: ImageStyle): string {
  if (style === "none") return prompt;
  return `${prompt}, ${STYLE_SUFFIXES[style]}`;
}

export function buildImageUrl(
  fullPrompt: string,
  width: number,
  height: number,
  seed: number
): string {
  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    seed: String(seed),
    nologo: "true",
    model: "flux",
  });
  return `${POLLINATIONS_BASE_URL}/${encodeURIComponent(fullPrompt)}?${params}`;
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

/** A pleasant deterministic gradient derived from the prompt, for placeholders. */
function placeholderSvg(prompt: string, width: number, height: number): string {
  const hash = crypto.createHash("md5").update(prompt).digest();
  const hue1 = hash[0] * 360 / 255;
  const hue2 = (hue1 + 60 + hash[1] / 4) % 360;
  const label = prompt.length > 60 ? `${prompt.slice(0, 57)}...` : prompt;
  const escaped = label
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(${hue1.toFixed(0)}, 70%, 55%)"/>
      <stop offset="100%" stop-color="hsl(${hue2.toFixed(0)}, 75%, 40%)"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        font-family="system-ui, sans-serif" font-size="${Math.max(14, Math.round(width / 40))}"
        fill="rgba(255,255,255,0.92)">${escaped}</text>
</svg>`;
}

/**
 * Generate one image from a prompt and save it under IMAGES_DIR (or destDir
 * when provided). Falls back to a local SVG placeholder if the API fails.
 */
export async function generateImage(options: {
  prompt: string;
  style?: ImageStyle;
  width?: number;
  height?: number;
  seed?: number;
  destDir?: string;
  fileStem?: string;
}): Promise<GeneratedImage> {
  const style = options.style ?? "photorealistic";
  const width = options.width ?? 1024;
  const height = options.height ?? 768;
  const seed = options.seed ?? crypto.randomInt(1, 1_000_000_000);
  const destDir = options.destDir ?? IMAGES_DIR;
  const fullPrompt = buildFullPrompt(options.prompt, style);
  const sourceUrl = buildImageUrl(fullPrompt, width, height, seed);
  const stem =
    options.fileStem ?? `${slugify(options.prompt)}-${seed.toString(36)}`;

  await ensureDir(destDir);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), IMAGE_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch(sourceUrl, { signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
    if (!response.ok) {
      throw new Error(`Image API returned HTTP ${response.status}`);
    }
    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const ext = contentType.includes("png") ? "png" : "jpg";
    const fileName = `${stem}.${ext}`;
    const filePath = path.join(destDir, fileName);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 100) {
      throw new Error("Image API returned an empty response");
    }
    await fs.writeFile(filePath, bytes);
    return {
      filePath,
      fileName,
      fullPrompt,
      sourceUrl,
      width,
      height,
      seed,
      placeholder: false,
    };
  } catch {
    const fileName = `${stem}.svg`;
    const filePath = path.join(destDir, fileName);
    await fs.writeFile(filePath, placeholderSvg(options.prompt, width, height));
    return {
      filePath,
      fileName,
      fullPrompt,
      sourceUrl,
      width,
      height,
      seed,
      placeholder: true,
    };
  }
}
