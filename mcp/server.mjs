#!/usr/bin/env node
/**
 * Lumen MCP server — closes USING-LUMEN.md hard rule 4 ("the MCP server reads
 * component.json"). The server exposes Lumen's machine contracts (components,
 * tokens, ADRs, patterns) over the Model Context Protocol so any MCP-compatible
 * agent (Claude Desktop, Claude Code, Cursor, etc.) can discover + read Lumen
 * structure without filesystem walks.
 *
 * Protocol: JSON-RPC 2.0 over stdio. Implements:
 *   - initialize → returns server capabilities
 *   - tools/list → list of callable Lumen tools
 *   - tools/call → invoke a tool with arguments
 *   - resources/list → enumerate component / token / ADR / pattern resources
 *   - resources/read → fetch a resource by URI
 *
 * Run with: node mcp/server.mjs
 * Wire to Claude Desktop: add to ~/Library/Application Support/Claude/claude_desktop_config.json:
 *   {
 *     "mcpServers": {
 *       "lumen": {
 *         "command": "node",
 *         "args": ["/absolute/path/to/Warp-Lumen-Design-Guidelines/mcp/server.mjs"]
 *       }
 *     }
 *   }
 *
 * v0.14 — minimal-but-functional first ship (ADR 0029 / 0030 / 0031 omnibus).
 * Future rounds will add: token-search, ADR cross-link queries, component
 * dependency graphs, validation diagnostics surfaced as tool results.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, dirname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const COMPONENTS_DIR = resolve(ROOT, "design-system/02-components");
const TOKENS_DIR = resolve(ROOT, "design-system/01-tokens/semantic");
const PATTERNS_DIR = resolve(ROOT, "design-system/05-patterns");
const ADRS_DIR = resolve(ROOT, "_meta/decisions");
const REGISTRY_PATH = resolve(ROOT, "_registry/registry.json");
const VERSION_PATH = resolve(ROOT, "VERSION");

const LUMEN_VERSION = readFileSync(VERSION_PATH, "utf8").trim();

// ─────────────────────────────────────────────────────────────────────────
// Resource enumeration
// ─────────────────────────────────────────────────────────────────────────

function listComponents() {
  return readdirSync(COMPONENTS_DIR)
    .filter((name) => name !== "_schema" && !name.startsWith("."))
    .filter((name) => existsSync(join(COMPONENTS_DIR, name, "component.json")))
    .map((name) => {
      const meta = JSON.parse(readFileSync(join(COMPONENTS_DIR, name, "component.json"), "utf8"));
      return {
        slug: name,
        name: meta.name,
        version: meta.version,
        status: meta.status,
        deprecated: meta.deprecated || false,
        summary: meta.summary?.slice(0, 200) || "",
        platforms: Object.keys(meta.examples || {}),
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function getComponent(slug) {
  const dir = join(COMPONENTS_DIR, slug);
  if (!existsSync(dir)) {
    throw new Error(`Component not found: ${slug}`);
  }
  const componentJson = JSON.parse(readFileSync(join(dir, "component.json"), "utf8"));
  const componentMdPath = join(dir, "component.md");
  const componentMd = existsSync(componentMdPath) ? readFileSync(componentMdPath, "utf8") : null;
  const examplesDir = join(dir, "examples");
  const examples = {};
  if (existsSync(examplesDir)) {
    for (const file of readdirSync(examplesDir)) {
      examples[file] = readFileSync(join(examplesDir, file), "utf8");
    }
  }
  return { contract: componentJson, prose: componentMd, examples };
}

function listTokenFiles() {
  return readdirSync(TOKENS_DIR)
    .filter((f) => f.endsWith(".tokens.json"))
    .map((f) => ({
      file: f,
      slug: f.replace(/\.tokens\.json$/, ""),
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function getTokenFile(slug) {
  const path = join(TOKENS_DIR, `${slug}.tokens.json`);
  if (!existsSync(path)) throw new Error(`Token file not found: ${slug}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function listADRs() {
  return readdirSync(ADRS_DIR)
    .filter((f) => f.match(/^\d{4}-.+\.md$/))
    .map((f) => {
      const content = readFileSync(join(ADRS_DIR, f), "utf8");
      const titleMatch = content.match(/^# (.+)$/m);
      const statusMatch = content.match(/^\*\*Status:\*\*\s*(\S+)/m);
      const dateMatch = content.match(/^\*\*Date:\*\*\s*([\d-]+)/m);
      return {
        id: f.replace(/\.md$/, ""),
        file: f,
        title: titleMatch ? titleMatch[1].trim() : f,
        status: statusMatch ? statusMatch[1].trim() : "—",
        date: dateMatch ? dateMatch[1].trim() : "—",
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

function getADR(id) {
  // Accept either short id like "0028" or full filename
  const files = readdirSync(ADRS_DIR);
  const match = files.find((f) => f === `${id}.md` || f.startsWith(`${id}-`));
  if (!match) throw new Error(`ADR not found: ${id}`);
  return {
    id: match.replace(/\.md$/, ""),
    content: readFileSync(join(ADRS_DIR, match), "utf8"),
  };
}

function listPatterns() {
  return readdirSync(PATTERNS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => {
      const content = readFileSync(join(PATTERNS_DIR, f), "utf8");
      const titleMatch = content.match(/^# (.+)$/m);
      const summaryMatch = content.match(/^> (.+)$/m);
      return {
        slug: f.replace(/\.md$/, ""),
        title: titleMatch ? titleMatch[1].trim() : f,
        summary: summaryMatch ? summaryMatch[1].slice(0, 200).trim() : "",
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function getPattern(slug) {
  const path = join(PATTERNS_DIR, `${slug}.md`);
  if (!existsSync(path)) throw new Error(`Pattern not found: ${slug}`);
  return readFileSync(path, "utf8");
}

function searchAll(query) {
  const q = query.toLowerCase();
  const results = [];
  // Search components
  for (const c of listComponents()) {
    if (c.slug.includes(q) || c.name.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q)) {
      results.push({ kind: "component", uri: `lumen://components/${c.slug}`, name: c.name, summary: c.summary });
    }
  }
  // Search ADRs
  for (const a of listADRs()) {
    if (a.id.toLowerCase().includes(q) || a.title.toLowerCase().includes(q)) {
      results.push({ kind: "adr", uri: `lumen://adrs/${a.id}`, name: a.title, summary: `${a.status} · ${a.date}` });
    }
  }
  // Search patterns
  for (const p of listPatterns()) {
    if (p.slug.includes(q) || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)) {
      results.push({ kind: "pattern", uri: `lumen://patterns/${p.slug}`, name: p.title, summary: p.summary });
    }
  }
  return results;
}

// ─────────────────────────────────────────────────────────────────────────
// MCP protocol — JSON-RPC 2.0 over stdio
// ─────────────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: "list_components",
    description: "List all Lumen components (98 in v0.14.0). Returns name, slug, version, status, platforms with examples.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "get_component",
    description: "Get the full contract (component.json), prose (component.md), and all platform examples for a Lumen component.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Component slug (kebab-case, e.g. 'button', 'live-dot').",
        },
      },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "list_tokens",
    description: "List all Lumen semantic token files. Returns the file slug and path for each.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "get_token_file",
    description: "Get the full content of a Lumen semantic token file by slug (e.g. 'color.dark', 'shadow', 'motion').",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Token file slug, no extension (e.g. 'color.dark', 'motion', 'shadow').",
        },
      },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "list_adrs",
    description: "List all Lumen Architecture Decision Records (ADRs). Returns id, title, status, date.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "get_adr",
    description: "Get the full markdown content of a Lumen ADR by id (e.g. '0028' or '0028-inline-css-mobile-perf-v0135').",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "ADR id — either the short numeric id (0001, 0028) or the full slug.",
        },
      },
      required: ["id"],
      additionalProperties: false,
    },
  },
  {
    name: "list_patterns",
    description: "List Lumen composition patterns (10 in v0.14.0). Returns slug, title, summary for each.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "get_pattern",
    description: "Get the full markdown content of a Lumen composition pattern by slug (e.g. 'auth-flow', 'error-pages', 'email-layout').",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Pattern slug from 05-patterns/ directory.",
        },
      },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "search",
    description: "Search across all Lumen resources (components, ADRs, patterns) by a free-text query.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query (case-insensitive substring match)." },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
];

function handleToolCall(name, args) {
  switch (name) {
    case "list_components":
      return { content: [{ type: "text", text: JSON.stringify(listComponents(), null, 2) }] };
    case "get_component":
      return { content: [{ type: "text", text: JSON.stringify(getComponent(args.slug), null, 2) }] };
    case "list_tokens":
      return { content: [{ type: "text", text: JSON.stringify(listTokenFiles(), null, 2) }] };
    case "get_token_file":
      return { content: [{ type: "text", text: JSON.stringify(getTokenFile(args.slug), null, 2) }] };
    case "list_adrs":
      return { content: [{ type: "text", text: JSON.stringify(listADRs(), null, 2) }] };
    case "get_adr":
      return { content: [{ type: "text", text: getADR(args.id).content }] };
    case "list_patterns":
      return { content: [{ type: "text", text: JSON.stringify(listPatterns(), null, 2) }] };
    case "get_pattern":
      return { content: [{ type: "text", text: getPattern(args.slug) }] };
    case "search":
      return { content: [{ type: "text", text: JSON.stringify(searchAll(args.query), null, 2) }] };
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function buildResourcesList() {
  const resources = [];
  for (const c of listComponents()) {
    resources.push({
      uri: `lumen://components/${c.slug}`,
      name: c.name,
      mimeType: "application/json",
      description: c.summary,
    });
  }
  for (const a of listADRs()) {
    resources.push({
      uri: `lumen://adrs/${a.id}`,
      name: a.title,
      mimeType: "text/markdown",
      description: `${a.status} · ${a.date}`,
    });
  }
  for (const p of listPatterns()) {
    resources.push({
      uri: `lumen://patterns/${p.slug}`,
      name: p.title,
      mimeType: "text/markdown",
      description: p.summary,
    });
  }
  for (const t of listTokenFiles()) {
    resources.push({
      uri: `lumen://tokens/${t.slug}`,
      name: t.slug,
      mimeType: "application/json",
      description: `Lumen semantic token file: ${t.slug}`,
    });
  }
  return resources;
}

function handleResourceRead(uri) {
  const match = uri.match(/^lumen:\/\/(\w+)\/(.+)$/);
  if (!match) throw new Error(`Invalid resource URI: ${uri}`);
  const [, kind, slug] = match;
  switch (kind) {
    case "components": {
      const comp = getComponent(slug);
      return [{ uri, mimeType: "application/json", text: JSON.stringify(comp, null, 2) }];
    }
    case "adrs": {
      const adr = getADR(slug);
      return [{ uri, mimeType: "text/markdown", text: adr.content }];
    }
    case "patterns": {
      return [{ uri, mimeType: "text/markdown", text: getPattern(slug) }];
    }
    case "tokens": {
      return [{ uri, mimeType: "application/json", text: JSON.stringify(getTokenFile(slug), null, 2) }];
    }
    default:
      throw new Error(`Unknown resource kind: ${kind}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// stdio JSON-RPC loop
// ─────────────────────────────────────────────────────────────────────────

function send(obj) {
  process.stdout.write(JSON.stringify(obj) + "\n");
}

function sendError(id, code, message, data) {
  send({ jsonrpc: "2.0", id, error: { code, message, ...(data && { data }) } });
}

function handleMessage(msg) {
  if (msg.jsonrpc !== "2.0") {
    sendError(msg.id ?? null, -32600, "Invalid request — missing jsonrpc 2.0");
    return;
  }
  // Notifications (no id) — don't respond
  const isNotification = msg.id === undefined;

  try {
    switch (msg.method) {
      case "initialize":
        send({
          jsonrpc: "2.0",
          id: msg.id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: { listChanged: false },
              resources: { subscribe: false, listChanged: false },
            },
            serverInfo: {
              name: "lumen-mcp",
              version: LUMEN_VERSION,
              description: "Lumen design system MCP server. Exposes components, tokens, ADRs, and patterns as MCP tools + resources.",
            },
          },
        });
        return;

      case "initialized":
      case "notifications/initialized":
        // Notification — no response
        return;

      case "tools/list":
        send({ jsonrpc: "2.0", id: msg.id, result: { tools: TOOLS } });
        return;

      case "tools/call": {
        const { name, arguments: args = {} } = msg.params || {};
        const result = handleToolCall(name, args);
        send({ jsonrpc: "2.0", id: msg.id, result });
        return;
      }

      case "resources/list":
        send({ jsonrpc: "2.0", id: msg.id, result: { resources: buildResourcesList() } });
        return;

      case "resources/read": {
        const { uri } = msg.params || {};
        const contents = handleResourceRead(uri);
        send({ jsonrpc: "2.0", id: msg.id, result: { contents } });
        return;
      }

      case "ping":
        send({ jsonrpc: "2.0", id: msg.id, result: {} });
        return;

      default:
        if (!isNotification) {
          sendError(msg.id, -32601, `Method not found: ${msg.method}`);
        }
        return;
    }
  } catch (err) {
    if (!isNotification) {
      sendError(msg.id, -32603, "Internal error", { stack: err.stack });
    } else {
      // Notification handler errored; log to stderr so we don't break stdio
      process.stderr.write(`[lumen-mcp] handler error for ${msg.method}: ${err.message}\n`);
    }
  }
}

// Read newline-delimited JSON-RPC messages from stdin
const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const msg = JSON.parse(trimmed);
    handleMessage(msg);
  } catch (err) {
    process.stderr.write(`[lumen-mcp] parse error: ${err.message}\nLine was: ${trimmed.slice(0, 200)}\n`);
  }
});

// Log startup to stderr (not stdout — stdout is the protocol channel)
process.stderr.write(`[lumen-mcp] Lumen MCP server v${LUMEN_VERSION} listening on stdio.\n`);
