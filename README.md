# Supabase Agent Plugin

Official Supabase plugin for Claude Code, Cursor, Codex, Antigravity, and other AI coding agents (see [Agents supported](#agents-supported)). It gives your agent:

- the Supabase MCP server (`https://mcp.supabase.com/mcp`) to manage your projects, databases, and Edge Functions
- the `supabase` skill for general Supabase product guidance
- the `supabase-postgres-best-practices` skill for Postgres performance and schema guidance

## Getting started

Install the plugin from your agent's plugin marketplace, or follow the steps for your agent in the [Supabase docs](https://supabase.com/docs/guides/ai-tools/plugins). The first time your agent uses the MCP server, it opens your browser so you can sign in to Supabase and authorize access.

If you already added the Supabase MCP server by hand, remove it after installing the plugin so your agent doesn't load the same tools twice.

> Want to contribute? Read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## Repository Structure

Shared across all vendors:
- `skills/` — vendored skill files consumed by all surfaces
- `assets/` — shared assets (logo, etc.)

Each vendor also has its own plugin manifest and MCP config.

### Agents supported:

| Vendor         | Supported |
|----------------|-----------|
| Claude Code    | ✓         |
| Cursor         | ✓         |
| Codex          | ✓         |
| GitHub Copilot | ✓         |
| Gemini CLI         | ✓         |
| VS Code (Open Plugin) | ✓  |
| Kimi Code         | ✓         |
| Grok Build     | ✓         |
| Antigravity    | ✓         |


## Notes
- The root `skills/` directory must contain real files. Do not switch it back to a symlink or submodule-backed path.
- Skills are synced automatically from `supabase/agent-skills` releases via `.github/workflows/sync-agent-skills.yml`. The workflow is triggered by the release pipeline in [`supabase/agent-skills`](https://github.com/supabase/agent-skills/blob/4e69c80e213f315c02c9ebef9c28dd6e43a4707e/.github/workflows/release.yml#L65) and opens a PR here with the updated skill files.
