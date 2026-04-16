# Supabase Plugin

The official Supabase plugin for AI coding assistants. One plugin, distributed to all supported platforms simultaneously.

## Supported Platforms

| Platform | Package | Install |
|---|---|---|
| [Claude Code](https://claude.ai/code) | [`packages/claude-code`](packages/claude-code) | — |
| [Cursor](https://cursor.com) | [`packages/cursor`](packages/cursor) | — |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | [`packages/gemini`](packages/gemini) | `gemini extensions install https://github.com/supabase-community/supabase-plugin` |
| [Codex](https://codex.openai.com) | [`packages/codex`](packages/codex) | — |

## What's Included

Each platform package contains:

- **MCP Server** — Remote connection to the [Supabase MCP server](https://supabase.com/mcp) for project management, SQL execution, migrations, and more
- **Skills** — Agent skills from [supabase/agent-skills](https://github.com/supabase/agent-skills) including `supabase` and `supabase-postgres-best-practices`

## Development

This repo uses a git submodule for shared agent skills.

After cloning, initialize the submodule:

```bash
git submodule update --init --recursive
```

To update the submodule to the latest agent-skills:

```bash
git submodule update --remote submodules/agent-skills
git add submodules/agent-skills
git commit -m "chore: update agent-skills submodule"
```

## Releasing

This repo uses [Release Please](https://github.com/googleapis/release-please) for automated releases. A single release bumps the version in all four platform packages simultaneously.

1. Merge commits with `feat:` or `fix:` prefixes to trigger a release
2. Release Please opens a release PR with version bump and changelog
3. Merge the release PR to publish
4. Four platform archives are uploaded to the GitHub release:
   - `supabase-claude-code-plugin.tar.gz`
   - `supabase-cursor-plugin.tar.gz`
   - `supabase-gemini-extension.tar.gz`
   - `supabase-codex-plugin.tar.gz`
