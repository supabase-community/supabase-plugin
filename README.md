# Supabase Agent Plugin

Official Supabase plugin distribution repo for Claude Code, Cursor, Codex, and Gemini. It bundles:

> Want to contribute? Read [CONTRIBUTING.md](CONTRIBUTING.md) first.

- `skills/supabase` for general Supabase product guidance
- `skills/supabase-postgres-best-practices` for Postgres performance and schema guidance
- vendor-specific plugin manifests and MCP adapters for each supported surface

## Repository Structure

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
- Skills are synced automatically from `supabase/agent-skills` releases via `.github/workflows/sync-agent-skills.yml`. The workflow is triggered by the release pipeline in [`supabase/agent-skills](https://github.com/supabase/agent-skills/blob/4e69c80e213f315c02c9ebef9c28dd6e43a4707e/.github/workflows/release.yml#L65)` and opens a PR here with the updated skill files.
