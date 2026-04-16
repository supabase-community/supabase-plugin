# Supabase Plugin for Codex

The Supabase plugin for [Codex](https://codex.openai.com) gives Codex the tools and skills needed to work effectively with Supabase projects.

## What's Included

- **MCP Server** — Remote connection to the [Supabase MCP server](https://supabase.com/mcp) for project management, SQL execution, migrations, and more
- **Skills** — Agent skills from [supabase/agent-skills](https://github.com/supabase/agent-skills) (e.g. `supabase`, `supabase-postgres-best-practices`)

## Development

This package is part of the [supabase-community/supabase-plugin](https://github.com/supabase-community/supabase-plugin) monorepo.

After cloning the monorepo, initialize the submodule:

```bash
git submodule update --init --recursive
```

To update the submodule:

```bash
git submodule update --remote submodules/agent-skills
git add submodules/agent-skills
git commit -m "chore: update agent-skills submodule"
```

## Releasing

Releases are managed at the monorepo level via [Release Please](https://github.com/googleapis/release-please). See the [root README](../../README.md) for details.

On release, `supabase-codex-plugin.tar.gz` is uploaded to the GitHub release.
