# Lumen MCP server

> Closes USING-LUMEN.md hard rule 4 ("the JSON is what LLMs and the MCP server read"). Exposes Lumen's machine contracts — components, semantic tokens, ADRs, composition patterns — over the [Model Context Protocol](https://modelcontextprotocol.io) so any MCP-compatible agent (Claude Desktop, Claude Code, Cursor, etc.) can discover + read Lumen structure without filesystem walks.

## Running

The server is stdio-based JSON-RPC 2.0. Run from the repo root:

```bash
node mcp/server.mjs
```

It listens on stdin for newline-delimited JSON-RPC messages and writes responses to stdout. Startup info goes to stderr so the protocol channel stays clean.

## Wiring to MCP clients

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "lumen": {
      "command": "node",
      "args": ["/absolute/path/to/Warp-Lumen-Design-Guidelines/mcp/server.mjs"]
    }
  }
}
```

Restart Claude Desktop. Lumen tools and resources will surface in the MCP toolbar.

### Claude Code

Add to `~/.claude/settings.json` under `mcpServers`:

```json
{
  "mcpServers": {
    "lumen": {
      "command": "node",
      "args": ["/absolute/path/to/Warp-Lumen-Design-Guidelines/mcp/server.mjs"]
    }
  }
}
```

### Cursor

Add to `~/.cursor/mcp.json` or the equivalent project-level config:

```json
{
  "mcpServers": {
    "lumen": {
      "command": "node",
      "args": ["/absolute/path/to/Warp-Lumen-Design-Guidelines/mcp/server.mjs"]
    }
  }
}
```

## Tools

| Tool | Returns | Use when |
|---|---|---|
| `list_components` | All 98 components — slug, name, version, status, platforms | "What components does Lumen ship?" |
| `get_component` | Full component contract + prose + all platform examples | "Give me Button's full contract + examples" |
| `list_tokens` | All semantic token files | "What token files does Lumen have?" |
| `get_token_file` | Full content of a token file | "Show me shadow.tokens.json" |
| `list_adrs` | All ADRs — id, title, status, date | "What architectural decisions are documented?" |
| `get_adr` | Full ADR markdown by id | "Show me ADR 0028" |
| `list_patterns` | All composition patterns — slug, title, summary | "What composition patterns are available?" |
| `get_pattern` | Full pattern markdown | "Show me the auth-flow pattern" |
| `search` | Free-text search across components + ADRs + patterns | "Find anything about typography" |

## Resources

Lumen exposes everything as MCP resources too. URIs:

- `lumen://components/{slug}` — component contract + examples
- `lumen://adrs/{id}` — ADR markdown
- `lumen://patterns/{slug}` — pattern markdown
- `lumen://tokens/{slug}` — semantic token file

Resources are listable via `resources/list` and readable via `resources/read`. Agents that support resources (vs tools) can browse Lumen as a virtual filesystem.

## Smoke test

```bash
# Send an initialize request + tools/list request
node -e "
const { spawn } = require('child_process');
const child = spawn('node', ['mcp/server.mjs'], { stdio: ['pipe', 'pipe', 'inherit'] });
child.stdout.on('data', d => console.log(d.toString().trim()));
child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} }) + '\n');
child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }) + '\n');
setTimeout(() => child.kill(), 500);
"
```

You should see the `initialize` response listing capabilities, then the `tools/list` response listing 9 tools.

## v0.14.0 ship scope

This is the first ship of the Lumen MCP server. Minimal-but-functional:

- ✓ 9 tools (list/get for components/tokens/ADRs/patterns + free-text search)
- ✓ Resources for browse-as-virtual-filesystem
- ✓ Pure Node.js, zero new dependencies
- ✓ stdio JSON-RPC 2.0 protocol

Future rounds will add:
- Token-search by path / by value
- ADR cross-link queries ("what ADRs cite ADR 0023?")
- Component dependency graphs ("what components reference Button?")
- Validation diagnostics surfaced as tool results
- Streaming responses for large queries
- Auth surface (Claude Code already runs in a trust context; Cursor / Desktop scenarios may need auth)

## How this closes USING-LUMEN.md hard rule 4

Before v0.14.0, hard rule 4 read: "Every component ships `component.json` first, code second. **The JSON is what other LLMs and the MCP server read.**" But there was no MCP server in the repo. The reference was aspirational. v0.14.0 ships the actual server; the rule is now structural, not aspirational.
