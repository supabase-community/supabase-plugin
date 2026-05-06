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
├── .app.json
├── assets/
│   └── logo.svg
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── .github/workflows/
│   ├── bump-marketplace-versions.yml
│   ├── sync-agent-skills.yml
│   └── validate-plugin-manifests.yml
├── gemini-extension.json
├── mcp/
│   ├── claude-code/.mcp.json
│   └── cursor/mcp.json
└── skills/
    ├── .upstream.json
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
- Vendored skills are synced from `supabase/agent-skills` release assets through `.github/workflows/sync-agent-skills.yml`.
- `release-please` publishes `supabase-claude-code-plugin.tar.gz`, `supabase-gemini-extension.tar.gz`, `supabase-cursor-plugin.tar.gz`, and `supabase-codex-plugin.tar.gz` from this repo.
