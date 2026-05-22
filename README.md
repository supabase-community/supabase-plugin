# Supabase Agent Plugin

Official Supabase plugin distribution repo for Claude Code, Cursor, Codex, GitHub Copilot, and Gemini. It bundles:

> Want to contribute? Read [CONTRIBUTING.md](CONTRIBUTING.md) first.

- `skills/supabase` for general Supabase product guidance
- `skills/supabase-postgres-best-practices` for Postgres performance and schema guidance
- vendor-specific plugin manifests and MCP adapters for each supported surface

## Repository Structure

Shared across all vendors:
- `skills/` — vendored skill files consumed by all surfaces
- `assets/` — shared assets (logo, etc.)
- `.github/workflows/` — CI for skill syncing and manifest validation

Per-vendor plugin manifests and MCP adapters:

| Vendor         | Manifest                     | Agent config                |
|----------------|------------------------------|-----------------------------|
| Claude Code    | `.claude-plugin/plugin.json` | `agents/claude/.mcp.json`   |
| Cursor         | `.cursor-plugin/plugin.json` | `agents/cursor/mcp.json`    |
| Codex          | `.codex-plugin/plugin.json`  | `agents/codex/.app.json`    |
| GitHub Copilot | `.github/plugin/plugin.json` | `agents/copilot/.mcp.json`  |
| Gemini         | `gemini-extension.json`      | —                           |

## Local Validation

Validate the plugin manifest:

```bash
claude plugin validate .claude-plugin/plugin.json
```

Validate the marketplace wrapper:

```bash
claude plugin validate .claude-plugin/marketplace.json
```

Run the plugin locally:

```bash
claude --plugin-dir .
```

Then use `/reload-plugins` after edits and verify the namespaced skills:

- `/supabase:supabase`
- `/supabase:supabase-postgres-best-practices`

## Notes
- The root `skills/` directory must contain real files. Do not switch it back to a symlink or submodule-backed path.
- Vendored skills are synced from `supabase/agent-skills` release assets through `.github/workflows/sync-agent-skills.yml`.
