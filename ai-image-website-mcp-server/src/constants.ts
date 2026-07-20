import * as path from "node:path";
import * as os from "node:os";

/** Base URL of the free Pollinations image generation API (no API key required). */
export const POLLINATIONS_BASE_URL = "https://image.pollinations.ai/prompt";

/** Where generated images and websites are written. Override with IMAGESITE_OUTPUT_DIR. */
export const OUTPUT_DIR = process.env.IMAGESITE_OUTPUT_DIR
  ? path.resolve(process.env.IMAGESITE_OUTPUT_DIR)
  : path.join(os.homedir(), "ai-image-websites");

export const IMAGES_DIR = path.join(OUTPUT_DIR, "images");
export const SITES_DIR = path.join(OUTPUT_DIR, "sites");

/** Maximum characters returned in a single tool response. */
export const CHARACTER_LIMIT = 25000;

/** Timeout for a single image generation request, in milliseconds. */
export const IMAGE_TIMEOUT_MS = 120_000;

export const MIN_DIMENSION = 64;
export const MAX_DIMENSION = 2048;
export const MAX_IMAGES_PER_CALL = 4;
export const MAX_SECTIONS = 12;
