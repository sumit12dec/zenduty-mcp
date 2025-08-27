import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildTools } from "./tools.js";
import { ZendutyClient } from "./zendutyClient.js";

const token = process.env.ZENDUTY_API_TOKEN;
if (!token) {
  console.error("ZENDUTY_API_TOKEN is not set. Put it in .env or environment.");
  process.exit(1);
}

const baseUrl = process.env.ZENDUTY_BASE_URL || "https://www.zenduty.com/api";
const client = new ZendutyClient({ token, baseUrl });

const server = new Server({
  name: "zenduty-mcp-server",
  version: "0.1.0"
});

for (const tool of buildTools(client)) {
  server.tool(tool);
}

const transport = new StdioServerTransport();
await server.connect(transport);
