/**
 * Static website builder.
 *
 * Assembles AI-generated images into a polished, responsive, single-file
 * landing page (plus an assets/ folder). No external CSS/JS dependencies —
 * everything is inlined so the site works offline and from file://.
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { SITES_DIR } from "../constants.js";
import { slugify, type GeneratedImage } from "./imageService.js";

export interface SiteSection {
  heading: string;
  body: string;
  image?: GeneratedImage;
}

export interface SiteSpec {
  title: string;
  tagline?: string;
  accentColor: string;
  theme: "light" | "dark";
  heroImage?: GeneratedImage;
  sections: SiteSection[];
  galleryImages: GeneratedImage[];
  footerText?: string;
}

export interface BuiltSite {
  /** Absolute path of the site directory. */
  siteDir: string;
  /** Absolute path of index.html. */
  indexPath: string;
  /** Number of image files copied into assets/. */
  assetCount: number;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Copy an image into the site's assets dir; returns the relative href. */
async function copyAsset(
  image: GeneratedImage,
  assetsDir: string
): Promise<string> {
  const dest = path.join(assetsDir, image.fileName);
  await fs.copyFile(image.filePath, dest);
  return `assets/${image.fileName}`;
}

function renderCss(spec: SiteSpec): string {
  const dark = spec.theme === "dark";
  const bg = dark ? "#0d1117" : "#ffffff";
  const bgAlt = dark ? "#161b22" : "#f6f8fa";
  const text = dark ? "#e6edf3" : "#1f2328";
  const muted = dark ? "#9198a1" : "#59636e";
  return `
    :root { --accent: ${spec.accentColor}; --bg: ${bg}; --bg-alt: ${bgAlt}; --text: ${text}; --muted: ${muted}; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
    img { max-width: 100%; display: block; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }
    header.hero { position: relative; min-height: 70vh; display: flex; align-items: center; justify-content: center; text-align: center; overflow: hidden; }
    header.hero .hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.55); }
    header.hero .hero-content { position: relative; padding: 4rem 1.5rem; color: #fff; }
    header.hero.no-image { background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 40%, #000)); }
    h1 { font-size: clamp(2.2rem, 6vw, 4rem); font-weight: 800; letter-spacing: -0.02em; }
    .tagline { font-size: clamp(1.05rem, 2.5vw, 1.4rem); margin-top: 1rem; opacity: 0.92; max-width: 46rem; margin-left: auto; margin-right: auto; }
    .cta { display: inline-block; margin-top: 2rem; padding: 0.85rem 2.2rem; background: var(--accent); color: #fff; border-radius: 999px; text-decoration: none; font-weight: 600; transition: transform 0.15s ease, box-shadow 0.15s ease; }
    .cta:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,0.25); }
    section.feature { padding: 4.5rem 0; }
    section.feature:nth-of-type(even) { background: var(--bg-alt); }
    .feature-inner { display: flex; align-items: center; gap: 3rem; flex-wrap: wrap; }
    .feature-inner.reverse { flex-direction: row-reverse; }
    .feature-text { flex: 1 1 320px; }
    .feature-media { flex: 1 1 320px; }
    .feature-media img { border-radius: 16px; box-shadow: 0 16px 40px rgba(0,0,0,0.18); width: 100%; object-fit: cover; }
    h2 { font-size: clamp(1.5rem, 3.5vw, 2.2rem); margin-bottom: 1rem; }
    h2::after { content: ""; display: block; width: 3.5rem; height: 4px; background: var(--accent); border-radius: 2px; margin-top: 0.6rem; }
    .feature-text p { color: var(--muted); font-size: 1.05rem; }
    section.gallery { padding: 4.5rem 0; }
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-top: 2rem; }
    .gallery-grid img { border-radius: 12px; aspect-ratio: 4 / 3; object-fit: cover; width: 100%; transition: transform 0.2s ease; }
    .gallery-grid img:hover { transform: scale(1.03); }
    footer { padding: 2.5rem 0; text-align: center; color: var(--muted); border-top: 1px solid color-mix(in srgb, var(--muted) 25%, transparent); font-size: 0.95rem; }
  `;
}

async function renderHtml(spec: SiteSpec, assetsDir: string): Promise<string> {
  const heroHref = spec.heroImage
    ? await copyAsset(spec.heroImage, assetsDir)
    : undefined;

  const sectionsHtml: string[] = [];
  for (let i = 0; i < spec.sections.length; i++) {
    const section = spec.sections[i];
    const imageHref = section.image
      ? await copyAsset(section.image, assetsDir)
      : undefined;
    const media = imageHref
      ? `<div class="feature-media"><img src="${imageHref}" alt="${escapeHtml(section.heading)}" loading="lazy"></div>`
      : "";
    sectionsHtml.push(`
    <section class="feature" id="section-${i + 1}">
      <div class="container feature-inner${i % 2 === 1 ? " reverse" : ""}">
        <div class="feature-text">
          <h2>${escapeHtml(section.heading)}</h2>
          <p>${escapeHtml(section.body)}</p>
        </div>
        ${media}
      </div>
    </section>`);
  }

  let galleryHtml = "";
  if (spec.galleryImages.length > 0) {
    const items: string[] = [];
    for (const image of spec.galleryImages) {
      const href = await copyAsset(image, assetsDir);
      items.push(
        `<img src="${href}" alt="${escapeHtml(image.fullPrompt.slice(0, 80))}" loading="lazy">`
      );
    }
    galleryHtml = `
    <section class="gallery">
      <div class="container">
        <h2>Gallery</h2>
        <div class="gallery-grid">${items.join("\n")}</div>
      </div>
    </section>`;
  }

  const heroInner = `
      <div class="hero-content">
        <h1>${escapeHtml(spec.title)}</h1>
        ${spec.tagline ? `<p class="tagline">${escapeHtml(spec.tagline)}</p>` : ""}
        ${spec.sections.length > 0 ? `<a class="cta" href="#section-1">Explore</a>` : ""}
      </div>`;

  const hero = heroHref
    ? `<header class="hero"><img class="hero-bg" src="${heroHref}" alt="">${heroInner}</header>`
    : `<header class="hero no-image">${heroInner}</header>`;

  const footer = `<footer><div class="container">${escapeHtml(
    spec.footerText ?? `${spec.title} — built with AI-generated imagery`
  )}</div></footer>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(spec.title)}</title>
<style>${renderCss(spec)}</style>
</head>
<body>
${hero}
${sectionsHtml.join("\n")}
${galleryHtml}
${footer}
</body>
</html>
`;
}

/** Build the site on disk and return its location. */
export async function buildSite(spec: SiteSpec): Promise<BuiltSite> {
  const siteDir = path.join(SITES_DIR, slugify(spec.title));
  const assetsDir = path.join(siteDir, "assets");
  await fs.mkdir(assetsDir, { recursive: true });

  const html = await renderHtml(spec, assetsDir);
  const indexPath = path.join(siteDir, "index.html");
  await fs.writeFile(indexPath, html, "utf-8");

  const assetCount = (await fs.readdir(assetsDir)).length;
  return { siteDir, indexPath, assetCount };
}
