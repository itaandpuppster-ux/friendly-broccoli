#!/usr/bin/env node
/**
 * AI Image + Website MCP Server
 *
 * Tools to generate AI images from text prompts (free Pollinations.ai API,
 * no key required) and assemble them into complete static websites.
 *
 * Transports:
 *   - stdio (default): for Claude Desktop / Claude Code local config
 *   - streamable HTTP: set TRANSPORT=http (and optionally PORT) for cloud use
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { registerTools } from "./tools/registerTools.js";
import { OUTPUT_DIR } from "./constants.js";

function createServer(): McpServer {
  const server = new McpServer({
    name: "ai-image-website-mcp-server",
    version: "1.0.0",
  });
  registerTools(server);
  return server;
}

async function runStdio(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`ai-image-website-mcp-server running via stdio (output: ${OUTPUT_DIR})`);
}

async function runHttp(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.post("/mcp", async (req, res) => {
    // Stateless: fresh server+transport per request avoids request ID collisions.
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    res.on("close", () => {
      void transport.close();
      void server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", server: "ai-image-website-mcp-server" });
  });

  const port = parseInt(process.env.PORT ?? "3000", 10);
  app.listen(port, () => {
    console.error(
      `ai-image-website-mcp-server running on http://localhost:${port}/mcp (output: ${OUTPUT_DIR})`
    );
  });
}

const transportMode = process.env.TRANSPORT ?? "stdio";
const run = transportMode === "http" ? runHttp : runStdio;
run().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
