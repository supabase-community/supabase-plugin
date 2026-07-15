import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const readJson = (relPath: string): any => JSON.parse(readFileSync(join(repoRoot, relPath), "utf-8"));

const MCP_URL = "https://mcp.supabase.com/mcp";
// The whole repo is released in lockstep; the Claude manifest is the reference.
const VERSION: string = readJson(".claude-plugin/plugin.json").version;
const CANONICAL_KEYWORDS: string[] = readJson(".claude-plugin/plugin.json").keywords;

describe("Claude Code plugin", () => {
  const manifest = readJson(".claude-plugin/plugin.json");

  it("manifest is named supabase at the shared version", () => {
    expect(manifest.name).toBe("supabase");
    expect(manifest.version).toBe(VERSION);
  });

  it("MCP server targets Supabase as claude-code-plugin", () => {
    const server = readJson("agents/claude/.mcp.json").mcpServers.supabase;
    expect(server.url).toBe(MCP_URL);
    expect(server.headers["X-Source-Name"]).toBe("claude-code-plugin");
    expect(server.headers["X-Source-Version"]).toBe(VERSION);
  });
});

describe("Cursor plugin", () => {
  const manifest = readJson(".cursor-plugin/plugin.json");

  it("manifest is named supabase at the shared version", () => {
    expect(manifest.name).toBe("supabase");
    expect(manifest.version).toBe(VERSION);
  });

  it("keywords stay within the canonical set", () => {
    for (const keyword of manifest.keywords) expect(CANONICAL_KEYWORDS).toContain(keyword);
  });

  it("MCP server targets Supabase as cursor-plugin", () => {
    const server = readJson("agents/cursor/mcp.json").supabase;
    expect(server.url).toBe(MCP_URL);
    expect(server.headers["X-Source-Name"]).toBe("cursor-plugin");
    expect(server.headers["X-Source-Version"]).toBe(VERSION);
  });
});

describe("Codex plugin", () => {
  const manifest = readJson(".codex-plugin/plugin.json");

  it("manifest is named supabase at the shared version", () => {
    expect(manifest.name).toBe("supabase");
    expect(manifest.version).toBe(VERSION);
  });

  it("keywords stay within the canonical set", () => {
    for (const keyword of manifest.keywords) expect(CANONICAL_KEYWORDS).toContain(keyword);
  });

  it("registers a Codex app id (Codex uses apps, not MCP headers)", () => {
    const apps = readJson("agents/codex/.app.json").apps;
    expect(apps.supabase.id).toBeTruthy();
  });
});

describe("Grok Build plugin", () => {
  const manifest = readJson(".grok-plugin/plugin.json");

  it("manifest is named supabase at the shared version", () => {
    expect(manifest.name).toBe("supabase");
    expect(manifest.version).toBe(VERSION);
  });

  it("keywords match the canonical Claude list", () => {
    expect(manifest.keywords).toEqual(CANONICAL_KEYWORDS);
  });

  it("references a dedicated agents/grok/mcp.json file", () => {
    expect(manifest.mcpServers).toBe("./agents/grok/mcp.json");
    expect(existsSync(join(repoRoot, "agents/grok/mcp.json"))).toBe(true);
  });

  it("MCP server targets Supabase as grok-plugin", () => {
    const server = readJson("agents/grok/mcp.json").mcpServers.supabase;
    expect(server.url).toBe(MCP_URL);
    expect(server.headers["X-Source-Name"]).toBe("grok-plugin");
    expect(server.headers["X-Source-Version"]).toBe(VERSION);
  });
});

describe("Kimi Code plugin", () => {
  const manifest = readJson(".kimi-plugin/plugin.json");

  it("manifest is named supabase at the shared version", () => {
    expect(manifest.name).toBe("supabase");
    expect(manifest.version).toBe(VERSION);
  });

  it("keywords match the canonical Claude list", () => {
    expect(manifest.keywords).toEqual(CANONICAL_KEYWORDS);
  });

  it("declares its MCP server inline, with no external agents/kimi file", () => {
    expect(typeof manifest.mcpServers).toBe("object");
    expect(existsSync(join(repoRoot, "agents/kimi/mcp.json"))).toBe(false);
  });

  it("inline MCP server targets Supabase as kimi-plugin", () => {
    const server = manifest.mcpServers.supabase;
    expect(server.url).toBe(MCP_URL);
    expect(server.headers["X-Source-Name"]).toBe("kimi-plugin");
    expect(server.headers["X-Source-Version"]).toBe(VERSION);
  });
});

describe("GitHub Copilot plugin", () => {
  const manifest = readJson(".github/plugin/plugin.json");

  it("manifest is named supabase at the shared version", () => {
    expect(manifest.name).toBe("supabase");
    expect(manifest.version).toBe(VERSION);
  });

  it("keywords match the canonical Claude list", () => {
    expect(manifest.keywords).toEqual(CANONICAL_KEYWORDS);
  });

  it("MCP server targets Supabase as github-copilot-plugin", () => {
    const server = readJson("agents/copilot/.mcp.json").mcpServers.supabase;
    expect(server.url).toBe(MCP_URL);
    expect(server.headers["X-Source-Name"]).toBe("github-copilot-plugin");
    expect(server.headers["X-Source-Version"]).toBe(VERSION);
  });
});

describe("Gemini extension", () => {
  const manifest = readJson("gemini-extension.json");

  it("manifest is named supabase at the shared version", () => {
    expect(manifest.name).toBe("supabase");
    expect(manifest.version).toBe(VERSION);
  });

  it("MCP server targets Supabase as gemini-extension (httpUrl)", () => {
    const server = manifest.mcpServers.supabase;
    expect(server.httpUrl).toBe(MCP_URL);
    expect(server.headers["X-Source-Name"]).toBe("gemini-extension");
    expect(server.headers["X-Source-Version"]).toBe(VERSION);
  });
});

describe("release-please wiring", () => {
  const extraFiles: Array<{ path: string; jsonpath: string }> =
    readJson("release-please-config.json").packages["."]["extra-files"];
  const has = (path: string, jsonpath: string) =>
    extraFiles.some((f) => f.path === path && f.jsonpath === jsonpath);

  it("tracks the Grok manifest version and its MCP X-Source-Version", () => {
    expect(has(".grok-plugin/plugin.json", "$.version")).toBe(true);
    expect(has("agents/grok/mcp.json", '$.mcpServers.supabase.headers["X-Source-Version"]')).toBe(true);
  });

  it("tracks the Kimi manifest version and its inline MCP X-Source-Version", () => {
    expect(has(".kimi-plugin/plugin.json", "$.version")).toBe(true);
    expect(has(".kimi-plugin/plugin.json", '$.mcpServers.supabase.headers["X-Source-Version"]')).toBe(true);
  });
});
