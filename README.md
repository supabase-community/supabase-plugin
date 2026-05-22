# Supabase Agent Plugin

Official Supabase plugin distribution repo for Claude Code, Cursor, Codex, GitHub Copilot, and Gemini. It bundles:

> Want to contribute? Read [CONTRIBUTING.md](CONTRIBUTING.md) first.

- `skills/supabase` for general Supabase product guidance
- `skills/supabase-postgres-best-practices` for Postgres performance and schema guidance
- vendor-specific plugin manifests and MCP adapters for each supported surface

## Repository Structure

<<<<<<< HEAD
Shared across all vendors:
- `skills/` — vendored skill files consumed by all surfaces
- `assets/` — shared assets (logo, etc.)
- `.github/workflows/` — CI for skill syncing and manifest validation
=======
```text
supabase-plugin/
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
├── .codex-plugin/
│   ├── plugin.json
│   └── marketplace.json
├── .cursor-plugin/
│   ├── plugin.json
│   └── marketplace.json
├── agents/
│   ├── claude/.mcp.json
│   ├── codex/.app.json
│   └── cursor/mcp.json
├── assets/
│   └── logo.svg
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── .github/workflows/
│   ├── sync-agent-skills.yml
│   └── validate-plugin-manifests.yml
├── gemini-extension.json
└── skills/
    ├── supabase/
    └── supabase-postgres-best-practices/
```
>>>>>>> 533eed8 (fix: rewrite skill sync workflow and update docs)

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
<<<<<<< HEAD
- Skills are synced automatically from `supabase/agent-skills` releases via `.github/workflows/sync-agent-skills.yml`. The workflow is triggered by the release pipeline in [`supabase/agent-skills](https://github.com/supabase/agent-skills/blob/4e69c80e213f315c02c9ebef9c28dd6e43a4707e/.github/workflows/release.yml#L65)` and opens a PR here with the updated skill files.
=======
- Skills are synced automatically from `supabase/agent-skills` releases via `.github/workflows/sync-agent-skills.yml`. The workflow is triggered by the release pipeline in `supabase/agent-skills` and opens a PR here with the updated skill files.
>>>>>>> 533eed8 (fix: rewrite skill sync workflow and update docs)
