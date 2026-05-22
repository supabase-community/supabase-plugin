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

| Vendor         | Supported |
|----------------|-----------|
| Claude Code    | ✓         |
| Cursor         | ✓         |
| Codex          | ✓         |
| GitHub Copilot | ✓         |
| Gemini         | ✓         |


## Notes
- The root `skills/` directory must contain real files. Do not switch it back to a symlink or submodule-backed path.
- Vendored skills are synced from `supabase/agent-skills` release assets through `.github/workflows/sync-agent-skills.yml`.
