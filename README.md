# Supabase Plugin

The official Supabase plugin for AI coding assistants. One repo, distributed to all supported platforms simultaneously.

## Supported Platforms

| Platform | Install |
|---|---|
| [Claude Code](https://claude.ai/code) | `/plugin marketplace add supabase-community/supabase-plugin` then `/plugin install supabase-plugin@supabase` |
| [Cursor](https://cursor.com) | `/add-plugin` in the editor, or via Dashboard → Settings → Plugins → Team Marketplaces → Import `https://github.com/supabase-community/supabase-plugin` |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | `gemini extensions install https://github.com/supabase-community/supabase-plugin` |
| [Codex](https://openai.com/codex) | Run `codex`, then `/plugins` → Install plugin → search for `supabase` |

## What's Included

- **MCP Server** (`mcp.json`) — Remote connection to the [Supabase MCP server](https://supabase.com/mcp) for project management, SQL execution, migrations, and more
- **Skills** (`skills/`) — Agent skills from [supabase/agent-skills](https://github.com/supabase/agent-skills):
  - `supabase` — General Supabase guidance for Auth, Storage, Edge Functions, Realtime, and more
  - `supabase-postgres-best-practices` — Postgres performance optimization and schema best practices
- **Gemini Extension** (`gemini-extension.json`) — Gemini CLI extension manifest
- **Context** (`SUPABASE.md`) — Shared context file loaded by Gemini and other platforms

## Repository Structure

```
supabase-plugin/
├── mcp.json                    # MCP server config (mcpServers wrapper format)
├── gemini-extension.json       # Gemini CLI extension manifest
├── SUPABASE.md                 # Shared context loaded by Gemini
├── assets/
│   └── logo.svg
├── skills/                     # Symlink → submodules/agent-skills/skills/supabase*
│   ├── supabase/
│   └── supabase-postgres-best-practices/
└── submodules/
    └── agent-skills/           # git submodule: github.com/supabase/agent-skills
```

## Development

This repo uses a git submodule for shared agent skills.

After cloning, initialize the submodule:

```bash
git clone https://github.com/supabase-community/supabase-plugin
git submodule update --init --recursive
```

To update the submodule to the latest agent-skills:

```bash
git submodule update --remote submodules/agent-skills
git add submodules/agent-skills
git commit -m "chore: update agent-skills submodule"
```

## Releasing

This repo uses [Release Please](https://github.com/googleapis/release-please) for automated releases.

1. Merge commits with `feat:` or `fix:` prefixes to trigger a release PR
2. Release Please opens a PR with version bump and changelog
3. Merge the release PR to publish
4. Four platform archives are uploaded to the GitHub release:
   - `supabase-claude-code-plugin.tar.gz`
   - `supabase-cursor-plugin.tar.gz`
   - `supabase-gemini-extension.tar.gz`
   - `supabase-codex-plugin.tar.gz`
