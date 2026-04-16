# Plugin Monorepo Migration Design

**Date:** 2026-04-16  
**Status:** Approved

## Overview

Consolidate four platform-specific plugin repos (`cursor-plugin`, `gemini-extension`, `codex-plugin`, and the existing Claude Code plugin) into a single repo (`supabase-plugin`). One plugin, one version, one release — distributed to all platforms simultaneously.

The three existing repos are deprecated in place (no changes made to them). This repo becomes the single source of truth.

## Repo Structure

```
supabase-plugin/
├── packages/
│   ├── claude-code/
│   │   ├── .claude-plugin/plugin.json
│   │   ├── .mcp.json
│   │   └── skills/ → ../../submodules/agent-skills/skills/
│   ├── cursor/
│   │   ├── .cursor-plugin/plugin.json
│   │   ├── mcp.json                   # Cursor requires no leading dot
│   │   └── skills/ → ../../submodules/agent-skills/skills/
│   ├── gemini/
│   │   ├── gemini-extension.json      # MCP config embedded; contextFileName: "SUPABASE.md"
│   │   ├── SUPABASE.md
│   │   └── skills/ → ../../submodules/agent-skills/skills/
│   └── codex/
│       ├── .codex-plugin/plugin.json  # references ./skills/, ./.mcp.json, ./assets/logo.svg
│       ├── .mcp.json
│       ├── assets/
│       │   └── logo.svg
│       └── skills/ → ../../submodules/agent-skills/skills/
├── submodules/
│   └── agent-skills/                  # git submodule: supabase/agent-skills
├── .gitmodules
├── .gitignore
├── .github/
│   ├── dependabot.yml                 # gitsubmodule, daily
│   └── workflows/
│       └── release-please.yml         # single workflow, produces 4 tarballs
├── release-please-config.json
├── .release-please-manifest.json
├── CHANGELOG.md
└── LICENSE
```

## Skills

Skills come exclusively from the `supabase/agent-skills` git submodule. Each package directory contains a `skills/` symlink pointing to `../../submodules/agent-skills/skills/`. The CI workflow uses `tar --dereference` when creating archives, so tarballs contain the actual skill files rather than broken symlinks.

Dependabot monitors the submodule daily and opens PRs with `chore:` prefix when `agent-skills` has new commits.

## Platform Manifests

Each platform has a unique manifest format. All four are updated to the same version on each release.

| Platform | Manifest file | MCP config | Extra files |
|---|---|---|---|
| Claude Code | `packages/claude-code/.claude-plugin/plugin.json` | `packages/claude-code/.mcp.json` | — |
| Cursor | `packages/cursor/.cursor-plugin/plugin.json` | `packages/cursor/mcp.json` (no dot) | — |
| Gemini | `packages/gemini/gemini-extension.json` | embedded in manifest | `SUPABASE.md` |
| Codex | `packages/codex/.codex-plugin/plugin.json` | `packages/codex/.mcp.json` | `assets/logo.svg` |

## Versioning and Release

Single Release Please config at the repo root, `release-type: simple`. One version number covers all platforms. The `extra-files` array bumps the `version` field in all four manifests simultaneously.

```json
{
  "bump-minor-pre-major": true,
  "bump-patch-for-minor-pre-major": true,
  "packages": {
    ".": {
      "release-type": "simple",
      "extra-files": [
        { "type": "json", "path": "packages/claude-code/.claude-plugin/plugin.json", "jsonpath": "$.version" },
        { "type": "json", "path": "packages/cursor/.cursor-plugin/plugin.json", "jsonpath": "$.version" },
        { "type": "json", "path": "packages/gemini/gemini-extension.json", "jsonpath": "$.version" },
        { "type": "json", "path": "packages/codex/.codex-plugin/plugin.json", "jsonpath": "$.version" }
      ]
    }
  }
}
```

Starting version: `0.1.0` (reset from the diverged versions in individual repos — all platforms now in sync).

## CI Workflow

On release (triggered by Release Please merging a release PR):

1. Checkout with `submodules: true`
2. Build four tarballs using `tar --dereference` from each `packages/<platform>/` directory
3. Upload all four as assets on the single GitHub release

Tarballs:
- `supabase-claude-code-plugin.tar.gz`
- `supabase-cursor-plugin.tar.gz`
- `supabase-gemini-extension.tar.gz`
- `supabase-codex-plugin.tar.gz`

## Migration Steps

1. **Rename repo** — rename `supabase-plugin` (GitHub repo rename + update local remote)
2. **Add submodule** — `git submodule add git@github.com:supabase/agent-skills.git submodules/agent-skills`
3. **Remove inline skills** — delete current `skills/supabase/` (content is superseded by submodule)
4. **Scaffold packages** — create `packages/claude-code/`, `packages/cursor/`, `packages/gemini/`, `packages/codex/`
5. **Migrate manifests** — move/copy platform manifests, MCP configs, SUPABASE.md, logo.svg into respective package dirs. Update relative paths in Codex manifest (`./skills/`, `./.mcp.json`, `./assets/logo.svg` remain correct since they're relative to the package dir).
6. **Add skills symlinks** — `ln -s ../../submodules/agent-skills/skills skills` inside each package dir
7. **Add `.gitmodules`** — committed by `git submodule add`
8. **Add `.gitignore`** — ignore `.claude/`, `CLAUDE.local.md`, macOS files
9. **Add `dependabot.yml`** — gitsubmodule, daily, `chore:` prefix
10. **Add Release Please config** — single package bumping all four manifests
11. **Add CI workflow** — Release Please + four-tarball build
12. **Set starting version** — `0.1.0` in all manifests and `.release-please-manifest.json`
13. **Push and set remote** — `git remote add origin git@github.com:supabase-community/supabase-plugin.git`

## Out of Scope

- Changes to the deprecated repos (`cursor-plugin`, `gemini-extension`, `codex-plugin`) — left as-is
- GitHub repo rename (done manually by user or via GitHub settings)
- Migrating git history from old repos
