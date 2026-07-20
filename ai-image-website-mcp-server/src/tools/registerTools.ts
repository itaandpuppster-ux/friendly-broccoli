import * as fs from "node:fs/promises";
import * as path from "node:path";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  IMAGES_DIR,
  SITES_DIR,
  OUTPUT_DIR,
  MIN_DIMENSION,
  MAX_DIMENSION,
  MAX_IMAGES_PER_CALL,
  MAX_SECTIONS,
  CHARACTER_LIMIT,
} from "../constants.js";
import {
  generateImage,
  type GeneratedImage,
  type ImageStyle,
} from "../services/imageService.js";
import { buildSite, type SiteSection } from "../services/siteBuilder.js";

const STYLE_VALUES = [
  "photorealistic",
  "digital-art",
  "3d-render",
  "anime",
  "watercolor",
  "pixel-art",
  "minimalist",
  "cinematic",
  "none",
] as const;

const styleSchema = z
  .enum(STYLE_VALUES)
  .default("photorealistic")
  .describe(
    "Visual style applied to the image (adds style keywords to the prompt). Use 'none' to send the prompt untouched."
  );

const dimensionSchema = (label: string, def: number) =>
  z
    .number()
    .int()
    .min(MIN_DIMENSION)
    .max(MAX_DIMENSION)
    .default(def)
    .describe(`${label} in pixels (${MIN_DIMENSION}-${MAX_DIMENSION})`);

const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color like #4f46e5")
  .default("#4f46e5")
  .describe("Accent color for buttons/headings, hex format e.g. '#4f46e5'");

function imageSummary(image: GeneratedImage): Record<string, unknown> {
  return {
    file_path: image.filePath,
    file_name: image.fileName,
    width: image.width,
    height: image.height,
    seed: image.seed,
    source_url: image.sourceUrl,
    placeholder: image.placeholder,
  };
}

function placeholderNote(images: GeneratedImage[]): string {
  const count = images.filter((i) => i.placeholder).length;
  if (count === 0) return "";
  return (
    `\n\nNote: ${count} image(s) could not be fetched from the image API ` +
    `(network unreachable), so styled SVG placeholders were saved instead. ` +
    `Re-run with internet access to get real AI images.`
  );
}

function textResult(text: string, structured?: Record<string, unknown>) {
  const clipped =
    text.length > CHARACTER_LIMIT
      ? `${text.slice(0, CHARACTER_LIMIT)}\n...[truncated]`
      : text;
  return {
    content: [{ type: "text" as const, text: clipped }],
    ...(structured ? { structuredContent: structured } : {}),
  };
}

/** Resolve a section's image: reuse an existing file or generate a new one. */
async function resolveImage(options: {
  imagePath?: string;
  imagePrompt?: string;
  style: ImageStyle;
  width: number;
  height: number;
}): Promise<GeneratedImage | undefined> {
  if (options.imagePath) {
    const filePath = path.resolve(options.imagePath);
    await fs.access(filePath);
    return {
      filePath,
      fileName: path.basename(filePath),
      fullPrompt: "(existing image)",
      sourceUrl: "",
      width: options.width,
      height: options.height,
      seed: 0,
      placeholder: false,
    };
  }
  if (options.imagePrompt) {
    return generateImage({
      prompt: options.imagePrompt,
      style: options.style,
      width: options.width,
      height: options.height,
    });
  }
  return undefined;
}

export function registerTools(server: McpServer): void {
  // ------------------------------------------------------------------
  // Tool 1: generate images
  // ------------------------------------------------------------------
  server.registerTool(
    "imagesite_generate_image",
    {
      title: "Generate AI Image",
      description: `Generate one or more AI images from a text prompt and save them to disk.

Uses the free Pollinations.ai image API (flux model, no API key needed). Each image is saved under the output directory (default: ~/ai-image-websites/images, override with the IMAGESITE_OUTPUT_DIR environment variable).

Args:
  - prompt (string): What the image should show, e.g. "a cozy coffee shop interior at golden hour"
  - style (enum): One of ${STYLE_VALUES.join(", ")} (default: photorealistic)
  - width / height (number): Pixel dimensions, ${MIN_DIMENSION}-${MAX_DIMENSION} (default 1024x768)
  - count (number): How many variations to generate, 1-${MAX_IMAGES_PER_CALL} (default 1). Each gets a different random seed.
  - seed (number, optional): Fix the seed to reproduce an exact image (only used when count=1).

Returns: JSON with an "images" array; each entry has file_path, file_name, width, height, seed, source_url (a URL that regenerates the identical image) and placeholder (true if the API was unreachable and a local SVG placeholder was written instead).

Example: prompt="futuristic city skyline at night", style="cinematic", width=1920, height=1080`,
      inputSchema: {
        prompt: z
          .string()
          .min(3, "Prompt must be at least 3 characters")
          .max(1000, "Prompt must not exceed 1000 characters")
          .describe("Text description of the image to generate"),
        style: styleSchema,
        width: dimensionSchema("Image width", 1024),
        height: dimensionSchema("Image height", 768),
        count: z
          .number()
          .int()
          .min(1)
          .max(MAX_IMAGES_PER_CALL)
          .default(1)
          .describe(`Number of variations to generate (1-${MAX_IMAGES_PER_CALL})`),
        seed: z
          .number()
          .int()
          .min(0)
          .optional()
          .describe("Optional fixed seed for reproducible output (count=1 only)"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ prompt, style, width, height, count, seed }) => {
      try {
        const images: GeneratedImage[] = [];
        for (let i = 0; i < count; i++) {
          images.push(
            await generateImage({
              prompt,
              style,
              width,
              height,
              seed: count === 1 ? seed : undefined,
            })
          );
        }
        const output = { count: images.length, images: images.map(imageSummary) };
        const lines = images.map(
          (img, i) =>
            `${i + 1}. ${img.filePath}${img.placeholder ? " (placeholder)" : ""} — seed ${img.seed}`
        );
        return textResult(
          `Generated ${images.length} image(s) for "${prompt}":\n${lines.join("\n")}` +
            placeholderNote(images),
          output
        );
      } catch (error) {
        return textResult(
          `Error generating image: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  // ------------------------------------------------------------------
  // Tool 2: create a website from a full specification
  // ------------------------------------------------------------------
  server.registerTool(
    "imagesite_create_website",
    {
      title: "Create Website with AI Images",
      description: `Build a complete, responsive static website (single index.html + assets folder) using AI-generated images.

You provide the copy (title, tagline, section headings/text) and image prompts; the tool generates every image and assembles a polished landing page: hero section with background image, alternating feature sections, optional image gallery, and footer. The site is self-contained (inline CSS, no external dependencies) and works directly from file://.

Args:
  - title (string): Site/brand name shown in the hero and browser tab
  - tagline (string, optional): Subtitle under the title
  - hero_image_prompt (string, optional): Prompt for the full-width hero background image
  - sections (array, max ${MAX_SECTIONS}): Each { heading, body, image_prompt?, image_path? }. image_path reuses an existing file from imagesite_generate_image instead of generating a new one.
  - gallery_prompts (array of strings, optional, max 8): Extra images shown in a gallery grid
  - style (enum): Visual style applied to all generated images (default: photorealistic)
  - accent_color (string): Hex color for buttons/underlines (default #4f46e5)
  - theme ('light' | 'dark'): Page color scheme (default light)
  - footer_text (string, optional)

Returns: JSON with site_dir, index_path (open this in a browser), asset_count, and the list of generated images.

Sites are written to <output>/sites/<slug-of-title>/ (default output: ~/ai-image-websites).`,
      inputSchema: {
        title: z.string().min(1).max(120).describe("Site title / brand name"),
        tagline: z.string().max(300).optional().describe("Subtitle shown under the title"),
        hero_image_prompt: z
          .string()
          .max(1000)
          .optional()
          .describe("Prompt for the hero background image (wide, 1920x1080)"),
        sections: z
          .array(
            z.object({
              heading: z.string().min(1).max(150),
              body: z.string().min(1).max(2000),
              image_prompt: z
                .string()
                .max(1000)
                .optional()
                .describe("Prompt to generate this section's image"),
              image_path: z
                .string()
                .optional()
                .describe("Path to an already-generated image to reuse instead"),
            })
          )
          .max(MAX_SECTIONS)
          .default([])
          .describe("Content sections, rendered alternating left/right"),
        gallery_prompts: z
          .array(z.string().max(1000))
          .max(8)
          .default([])
          .describe("Prompts for gallery grid images"),
        style: styleSchema,
        accent_color: hexColorSchema,
        theme: z.enum(["light", "dark"]).default("light").describe("Page color scheme"),
        footer_text: z.string().max(300).optional(),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const allImages: GeneratedImage[] = [];

        const heroImage = params.hero_image_prompt
          ? await generateImage({
              prompt: params.hero_image_prompt,
              style: params.style,
              width: 1920,
              height: 1080,
            })
          : undefined;
        if (heroImage) allImages.push(heroImage);

        const sections: SiteSection[] = [];
        for (const section of params.sections) {
          const image = await resolveImage({
            imagePath: section.image_path,
            imagePrompt: section.image_prompt,
            style: params.style,
            width: 1024,
            height: 768,
          });
          if (image && !section.image_path) allImages.push(image);
          sections.push({ heading: section.heading, body: section.body, image });
        }

        const galleryImages: GeneratedImage[] = [];
        for (const prompt of params.gallery_prompts) {
          const image = await generateImage({
            prompt,
            style: params.style,
            width: 1024,
            height: 768,
          });
          galleryImages.push(image);
          allImages.push(image);
        }

        const site = await buildSite({
          title: params.title,
          tagline: params.tagline,
          accentColor: params.accent_color,
          theme: params.theme,
          heroImage,
          sections,
          galleryImages,
          footerText: params.footer_text,
        });

        const output = {
          site_dir: site.siteDir,
          index_path: site.indexPath,
          asset_count: site.assetCount,
          images: allImages.map(imageSummary),
        };
        return textResult(
          `Website "${params.title}" built successfully!\n\n` +
            `Open in your browser: ${site.indexPath}\n` +
            `Site folder: ${site.siteDir}\n` +
            `Images generated: ${allImages.length}` +
            placeholderNote(allImages),
          output
        );
      } catch (error) {
        return textResult(
          `Error building website: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  // ------------------------------------------------------------------
  // Tool 3: one-shot website from a single idea
  // ------------------------------------------------------------------
  server.registerTool(
    "imagesite_build_website_from_idea",
    {
      title: "Build Website from One Idea",
      description: `One-shot workflow: turn a single idea into a full website with AI-generated images — hero image, three feature sections with images, and a gallery — without writing any copy or prompts yourself.

Prefer imagesite_create_website when you can write tailored copy and per-section image prompts; this tool auto-derives generic-but-clean content from the idea, which is ideal for a fast first draft the user can iterate on.

Args:
  - idea (string): The concept, e.g. "a bakery in Paris specializing in chocolate croissants"
  - site_title (string, optional): Brand name; derived from the idea if omitted
  - style (enum): Image style for all generated images (default: photorealistic)
  - theme ('light' | 'dark'): Page color scheme (default light)
  - accent_color (string): Hex accent color (default #4f46e5)

Returns: Same shape as imagesite_create_website (site_dir, index_path, images).`,
      inputSchema: {
        idea: z
          .string()
          .min(5, "Describe the idea in at least a few words")
          .max(500)
          .describe("The website concept in one or two sentences"),
        site_title: z.string().max(120).optional().describe("Brand/site name (optional)"),
        style: styleSchema,
        theme: z.enum(["light", "dark"]).default("light"),
        accent_color: hexColorSchema,
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ idea, site_title, style, theme, accent_color }) => {
      try {
        const title =
          site_title ??
          idea
            .split(/[,.;]/)[0]
            .split(/\s+/)
            .slice(0, 6)
            .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
            .join(" ");

        const heroImage = await generateImage({
          prompt: `${idea}, stunning wide banner image`,
          style,
          width: 1920,
          height: 1080,
        });

        const sectionDefs = [
          {
            heading: "What We Do",
            body: `${idea.charAt(0).toUpperCase() + idea.slice(1)}. We bring this vision to life with passion, craft, and attention to every detail.`,
            prompt: `${idea}, detailed close-up view`,
          },
          {
            heading: "Why It Matters",
            body: `Quality you can see and feel. Everything about ${title} is designed around one goal: an experience worth coming back to.`,
            prompt: `${idea}, people enjoying the experience, lifestyle shot`,
          },
          {
            heading: "Get Started",
            body: `Ready to dive in? Explore the gallery below and get in touch — we would love to hear from you.`,
            prompt: `${idea}, inviting atmosphere, warm welcoming scene`,
          },
        ];

        const allImages: GeneratedImage[] = [heroImage];
        const sections: SiteSection[] = [];
        for (const def of sectionDefs) {
          const image = await generateImage({
            prompt: def.prompt,
            style,
            width: 1024,
            height: 768,
          });
          allImages.push(image);
          sections.push({ heading: def.heading, body: def.body, image });
        }

        const galleryImages: GeneratedImage[] = [];
        for (const anglePrompt of [
          `${idea}, artistic angle`,
          `${idea}, vibrant details`,
          `${idea}, wide establishing shot`,
        ]) {
          const image = await generateImage({
            prompt: anglePrompt,
            style,
            width: 1024,
            height: 768,
          });
          galleryImages.push(image);
          allImages.push(image);
        }

        const site = await buildSite({
          title,
          tagline: idea,
          accentColor: accent_color,
          theme,
          heroImage,
          sections,
          galleryImages,
        });

        const output = {
          site_dir: site.siteDir,
          index_path: site.indexPath,
          asset_count: site.assetCount,
          images: allImages.map(imageSummary),
        };
        return textResult(
          `Website "${title}" built from your idea!\n\n` +
            `Open in your browser: ${site.indexPath}\n` +
            `Images generated: ${allImages.length}` +
            placeholderNote(allImages),
          output
        );
      } catch (error) {
        return textResult(
          `Error building website: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  // ------------------------------------------------------------------
  // Tool 4: list generated assets
  // ------------------------------------------------------------------
  server.registerTool(
    "imagesite_list_assets",
    {
      title: "List Generated Images and Websites",
      description: `List all images and websites this server has generated so far.

Args: none.

Returns: JSON with output_dir, images (file names under images/) and sites (folder names under sites/, each containing an index.html). Use the returned paths with imagesite_create_website's image_path to reuse images.`,
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        const listDir = async (dir: string): Promise<string[]> => {
          try {
            return (await fs.readdir(dir)).sort();
          } catch {
            return [];
          }
        };
        const images = await listDir(IMAGES_DIR);
        const sites = await listDir(SITES_DIR);
        const output = {
          output_dir: OUTPUT_DIR,
          image_count: images.length,
          images: images.map((f) => path.join(IMAGES_DIR, f)),
          site_count: sites.length,
          sites: sites.map((f) => path.join(SITES_DIR, f, "index.html")),
        };
        return textResult(JSON.stringify(output, null, 2), output);
      } catch (error) {
        return textResult(
          `Error listing assets: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );
}
