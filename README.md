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
- Skills are synced automatically from `supabase/agent-skills` releases via `.github/workflows/sync-agent-skills.yml`. The workflow is triggered by the release pipeline in [`supabase/agent-skills](https://github.com/supabase/agent-skills/blob/4e69c80e213f315c02c9ebef9c28dd6e43a4707e/.github/workflows/release.yml#L65)` and opens a PR here with the updated skill files.
