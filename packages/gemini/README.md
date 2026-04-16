# Supabase Extension for Gemini CLI

The Supabase extension for [Gemini CLI](https://github.com/google-gemini/gemini-cli) gives Gemini the tools, skills, and context needed to work effectively with Supabase projects.

## Installation

```bash
gemini extensions install https://github.com/supabase-community/supabase-plugin
```

## What's Included

- **MCP Server** — Remote connection to the [Supabase MCP server](https://supabase.com/mcp) for project management, SQL execution, migrations, and more
- **Skills** — Agent skills from [supabase/agent-skills](https://github.com/supabase/agent-skills) (e.g. `supabase`, `supabase-postgres-best-practices`)
- **Context** — `SUPABASE.md` with CLI usage patterns and best practices

## Development

This package is part of the [supabase-community/supabase-plugin](https://github.com/supabase-community/supabase-plugin) monorepo.

After cloning the monorepo, initialize the submodule:

```bash
git submodule update --init --recursive
```

To test locally:

```bash
gemini extensions install ./packages/gemini
```

To update the submodule:

```bash
git submodule update --remote submodules/agent-skills
git add submodules/agent-skills
git commit -m "chore: update agent-skills submodule"
```

## Releasing

Releases are managed at the monorepo level via [Release Please](https://github.com/googleapis/release-please). See the [root README](../../README.md) for details.

On release, `supabase-gemini-extension.tar.gz` is uploaded to the GitHub release.
