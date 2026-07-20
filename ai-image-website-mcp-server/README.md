# AI Image + Website MCP Server

An MCP (Model Context Protocol) server that lets Claude **generate AI images from text prompts** and **build complete websites using those images** — just like typing an idea and getting a finished site back.

Image generation uses the free [Pollinations.ai](https://pollinations.ai) API (flux model). **No API key required.**

## Tools

| Tool | What it does |
|------|--------------|
| `imagesite_generate_image` | Turn a text prompt into an AI image (choose style, size, seed, up to 4 variations) and save it to disk |
| `imagesite_create_website` | Build a polished responsive landing page — hero image, feature sections, gallery — generating every image from your prompts |
| `imagesite_build_website_from_idea` | One-shot: give it a single idea ("a bakery in Paris") and get a full website with 7 AI images |
| `imagesite_list_assets` | List every image and website generated so far |

Generated files go to `~/ai-image-websites/` by default (`images/` and `sites/`). Override with the `IMAGESITE_OUTPUT_DIR` environment variable. Each website is a self-contained folder — open `index.html` in any browser, or drag the folder into Netlify/Vercel to publish it.

If the image API is unreachable (offline), the server saves styled SVG placeholders instead of failing, so website building always works.

## Setup

```bash
cd ai-image-website-mcp-server
npm install
npm run build
```

### Claude Desktop

Add to `claude_desktop_config.json` (Settings → Developer → Edit Config):

```json
{
  "mcpServers": {
    "ai-image-website": {
      "command": "node",
      "args": ["/absolute/path/to/ai-image-website-mcp-server/dist/index.js"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add ai-image-website -- node /absolute/path/to/ai-image-website-mcp-server/dist/index.js
```

### Cloud / remote (streamable HTTP)

```bash
TRANSPORT=http PORT=3000 npm start
# MCP endpoint: http://localhost:3000/mcp   Health check: /health
```

## Example prompts to try

- *"Generate a cinematic image of a neon-lit Tokyo street in the rain"*
- *"Build me a website for my dog-walking business, dark theme, orange accent"*
- *"Make a website about space tourism with a gallery of planet images"*

## Development

```bash
npm run dev    # watch mode (tsx)
npm run build  # compile to dist/
```
