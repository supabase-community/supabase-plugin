# Supabase Claude Plugin

Official Supabase plugin for Claude Code.
This repository is the Claude-specific distribution surface for Supabase. It bundles:

- `skills/supabase` for general Supabase product guidance
- `skills/supabase-postgres-best-practices` for Postgres performance and schema guidance
- `.mcp.json` for the hosted Supabase MCP server

## Repository Structure

```text
supabase-plugin/
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
├── .mcp.json
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── .github/workflows/
│   └── sync-agent-skills.yml
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
