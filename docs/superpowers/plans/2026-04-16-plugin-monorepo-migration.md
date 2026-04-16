# Plugin Monorepo Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the `supabase-plugin` monorepo from a single Claude Code plugin into a unified repo that packages and releases the Supabase plugin for Claude Code, Cursor, Gemini, and Codex simultaneously.

**Architecture:** Four `packages/<platform>/` directories each contain their platform-specific manifest, MCP config, and a `skills/` symlink pointing to `../../submodules/agent-skills/skills/`. A single Release Please config at the repo root bumps all four manifests to the same version. One CI workflow builds four tarballs on release.

**Tech Stack:** Git submodules, Release Please (simple release type), GitHub Actions, tar archives

---

## File Map

**Create:**
- `packages/claude-code/.claude-plugin/plugin.json` — Claude Code manifest (moved from root)
- `packages/claude-code/.mcp.json` — MCP config for Claude Code (moved from root)
- `packages/claude-code/skills` — symlink → `../../submodules/agent-skills/skills/`
- `packages/cursor/.cursor-plugin/plugin.json` — Cursor manifest
- `packages/cursor/mcp.json` — MCP config for Cursor (no leading dot)
- `packages/cursor/skills` — symlink → `../../submodules/agent-skills/skills/`
- `packages/gemini/gemini-extension.json` — Gemini manifest (MCP embedded)
- `packages/gemini/SUPABASE.md` — Gemini context file
- `packages/gemini/skills` — symlink → `../../submodules/agent-skills/skills/`
- `packages/codex/.codex-plugin/plugin.json` — Codex manifest
- `packages/codex/.mcp.json` — MCP config for Codex
- `packages/codex/assets/logo.svg` — Codex logo
- `packages/codex/skills` — symlink → `../../submodules/agent-skills/skills/`
- `.gitignore`
- `.github/dependabot.yml`
- `.github/workflows/release-please.yml`
- `release-please-config.json`
- `.release-please-manifest.json`

**Delete:**
- `.claude-plugin/` (moved to `packages/claude-code/.claude-plugin/`)
- `.mcp.json` (moved to `packages/claude-code/.mcp.json`)
- `skills/` (replaced by per-package symlinks to submodule)

**Submodule added by git:**
- `submodules/agent-skills/` — `supabase/agent-skills`
- `.gitmodules` — written by `git submodule add`

---

### Task 1: Add the agent-skills submodule

**Files:**
- Create: `submodules/agent-skills/` (via git)
- Create: `.gitmodules` (via git)

- [ ] **Step 1: Add the submodule**

```bash
git submodule add git@github.com:supabase/agent-skills.git submodules/agent-skills
```

Expected output: `Cloning into '.../submodules/agent-skills'...` followed by success.

- [ ] **Step 2: Verify submodule is populated**

```bash
ls submodules/agent-skills/skills/
```

Expected: `supabase/` and `supabase-postgres-best-practices/` directories listed.

- [ ] **Step 3: Verify .gitmodules was written**

```bash
cat .gitmodules
```

Expected:
```
[submodule "submodules/agent-skills"]
	path = submodules/agent-skills
	url = git@github.com:supabase/agent-skills.git
```

- [ ] **Step 4: Commit**

```bash
git add .gitmodules submodules/agent-skills
git commit -m "chore: add agent-skills submodule"
```

---

### Task 2: Scaffold packages/claude-code and migrate existing files

**Files:**
- Create: `packages/claude-code/.claude-plugin/plugin.json`
- Create: `packages/claude-code/.mcp.json`
- Create: `packages/claude-code/skills` (symlink)
- Delete: `.claude-plugin/`
- Delete: `.mcp.json`
- Delete: `skills/`

- [ ] **Step 1: Create package directory structure**

```bash
mkdir -p packages/claude-code/.claude-plugin
```

- [ ] **Step 2: Write packages/claude-code/.claude-plugin/plugin.json**

```json
{
  "name": "supabase",
  "version": "0.1.0",
  "description": "Supabase MCP integration for database operations, authentication, storage, and real-time subscriptions. Manage your Supabase projects, run SQL queries, and interact with your backend directly.",
  "author": {
    "name": "Supabase"
  }
}
```

- [ ] **Step 3: Write packages/claude-code/.mcp.json**

```json
{
  "supabase": {
    "type": "http",
    "url": "https://mcp.supabase.com/mcp"
  }
}
```

- [ ] **Step 4: Create skills symlink**

```bash
cd packages/claude-code && ln -s ../../submodules/agent-skills/skills skills && cd ../..
```

- [ ] **Step 5: Verify symlink resolves**

```bash
ls packages/claude-code/skills/
```

Expected: `supabase/` and `supabase-postgres-best-practices/` listed.

- [ ] **Step 6: Remove old root-level files**

```bash
git rm -r .claude-plugin .mcp.json skills/
```

- [ ] **Step 7: Stage and commit**

```bash
git add packages/claude-code/
git commit -m "feat: scaffold claude-code package"
```

---

### Task 3: Scaffold packages/cursor

**Files:**
- Create: `packages/cursor/.cursor-plugin/plugin.json`
- Create: `packages/cursor/mcp.json`
- Create: `packages/cursor/skills` (symlink)

- [ ] **Step 1: Create directory**

```bash
mkdir -p packages/cursor/.cursor-plugin
```

- [ ] **Step 2: Write packages/cursor/.cursor-plugin/plugin.json**

```json
{
  "name": "supabase",
  "version": "0.1.0",
  "description": "Access your Supabase projects and perform tasks like managing tables, fetching config, and querying data.",
  "author": {
    "name": "Supabase",
    "email": "support@supabase.io",
    "url": "https://supabase.com"
  },
  "keywords": [
    "supabase",
    "postgres",
    "database",
    "backend",
    "mcp"
  ],
  "logo": "https://supabase.com/favicon/favicon.svg",
  "primaryColor": "#3ECF8E"
}
```

- [ ] **Step 3: Write packages/cursor/mcp.json** (no leading dot — Cursor requirement)

```json
{
  "supabase": {
    "type": "http",
    "url": "https://mcp.supabase.com/mcp"
  }
}
```

- [ ] **Step 4: Create skills symlink**

```bash
cd packages/cursor && ln -s ../../submodules/agent-skills/skills skills && cd ../..
```

- [ ] **Step 5: Verify symlink resolves**

```bash
ls packages/cursor/skills/
```

Expected: `supabase/` and `supabase-postgres-best-practices/` listed.

- [ ] **Step 6: Commit**

```bash
git add packages/cursor/
git commit -m "feat: scaffold cursor package"
```

---

### Task 4: Scaffold packages/gemini

**Files:**
- Create: `packages/gemini/gemini-extension.json`
- Create: `packages/gemini/SUPABASE.md`
- Create: `packages/gemini/skills` (symlink)

- [ ] **Step 1: Create directory**

```bash
mkdir -p packages/gemini
```

- [ ] **Step 2: Write packages/gemini/gemini-extension.json**

```json
{
  "name": "supabase",
  "description": "Access your Supabase projects and perform tasks like managing tables, fetching config, and querying data.",
  "version": "0.1.0",
  "contextFileName": "SUPABASE.md",
  "mcpServers": {
    "supabase": {
      "httpUrl": "https://mcp.supabase.com/mcp"
    }
  }
}
```

- [ ] **Step 3: Write packages/gemini/SUPABASE.md**

```markdown
# Supabase extension for Gemini CLI

## Overview

This extension allows you to access your Supabase projects and perform tasks like managing tables, fetching config, and querying data.

**Key capabilities**: Execute SQL, manage migrations, deploy functions, generate TypeScript types, access logs, and search documentation.

Tools executing using this server affect the hosted Supabase project(s), and changes can be synced to the filesystem using Supabase CLI. Assume the hosted database is the source of truth for migration history, and use CLI to sync changes to the local workspace.

## CLI invocation

Supabase CLI may be installed globally (e.g. with homebrew or scoop) or as a project dependency (e.g. in "devDependency" with npm, pnpm, bun, etc.). Prefer using it as a project dependency to keep CLI version pinned in your development environment.

**Package manager setup**

To install or use CLI through a Node.js package manager, you must determine which package manager is desired for the project.

You MUST either:

- Determine the project's existing package manager by checking for popular lockfile formats (e.g. package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb)
- Ask the user which package manager they prefer

For Node.js package managers, `supabase` commands MUST be prefixed with the package manager's command runner.
- npm: `npx supabase ...`
- pnpm: `pnpm supabase ...`
- bun: `bun supabase ...`

**IMPORTANT** Every time a bare `supabase` command is mentioned, consider which prefix is needed and add it accordingly.

## Best Practices

**Project identification**

The user will likely have linked their Supabase CLI to a development project.
The output of `[prefix?] supabase projects list` indicates which project is linked, use its `project_id` in MCP tool calls.

**Schema management**

To update tables:

1. Call MCP `list_tables` to inspect the current schema
2. Call `apply_migration` with desired changes
3. Call MCP `get_advisors` to find and fix "security" and "performance" issues as needed with further migrations
4. Sync new migration(s) to `supabase/migrations/` locally with `[prefix?] supabase migration fetch --yes`
5. Generate updated types and review codebase to align usage

- Use `apply_migration` for schema changes (CREATE/ALTER/DROP tables) - these are tracked
- Use `execute_sql` for queries and data operations (SELECT/INSERT/UPDATE/DELETE) - these are not tracked
- Always specify schemas explicitly: `public.users` instead of `users`

**Type generation**

While iterating on the schema, you should generate updated types with `[prefix?] supabase gen types --linked`. This outputs to stdio, so use `>` to redirect to a file.

## Troubleshooting

**Common errors**
- "permission denied": Remove `read_only=true` for write operations
- "relation does not exist": Use `list_tables` to verify table names and schemas
- "Not authenticated": Restart MCP connection and verify organization access
- Migration conflicts: Check `list_migrations` history before applying new migrations
- Frontend error `Could not find the '<column>' column of '<table>' in the schema cache`: Update types + implementation to ensure code matches current schema
- No project ref: Run `[prefix?] supabase link` to link the workspace to a hosted development project
- Data not appearing in app: Run `[prefix?] supabase db diff --linked`. If schema drift exists run `[prefix?] supabase db pull <migration_name> --yes` to store changes in a new local migration and repair remote migration history. Then proceed to update types and usage.

**Using logs for debugging**
- Use `get_logs` to view service logs when certain action fails
- Available log types: `api`, `branch-action`, `postgres`, `edge-function`, `auth`, `storage`, `realtime`
- Check Postgres logs to see slow queries, errors, or connection issues
- Review API logs to debug PostgREST endpoint failures or RLS policy issues

**Further resources**
- For MCP configuration help: https://supabase.com/mcp
- For Supabase CLI troubleshooting: https://supabase.com/docs/guides/cli/getting-started
```

- [ ] **Step 4: Create skills symlink**

```bash
cd packages/gemini && ln -s ../../submodules/agent-skills/skills skills && cd ../..
```

- [ ] **Step 5: Verify symlink resolves**

```bash
ls packages/gemini/skills/
```

Expected: `supabase/` and `supabase-postgres-best-practices/` listed.

- [ ] **Step 6: Commit**

```bash
git add packages/gemini/
git commit -m "feat: scaffold gemini package"
```

---

### Task 5: Scaffold packages/codex

**Files:**
- Create: `packages/codex/.codex-plugin/plugin.json`
- Create: `packages/codex/.mcp.json`
- Create: `packages/codex/assets/logo.svg`
- Create: `packages/codex/skills` (symlink)

- [ ] **Step 1: Create directories**

```bash
mkdir -p packages/codex/.codex-plugin packages/codex/assets
```

- [ ] **Step 2: Write packages/codex/.codex-plugin/plugin.json**

```json
{
  "name": "supabase",
  "version": "0.1.0",
  "description": "Access your Supabase projects and perform tasks like managing tables, fetching config, and querying data.",
  "author": {
    "name": "Supabase",
    "email": "support@supabase.io",
    "url": "https://supabase.com"
  },
  "homepage": "https://supabase.com",
  "repository": "https://github.com/supabase-community/supabase-plugin",
  "license": "MIT",
  "keywords": ["supabase", "postgres", "database", "backend", "mcp"],
  "skills": "./skills/",
  "mcpServers": "./.mcp.json",
  "interface": {
    "displayName": "Supabase",
    "shortDescription": "Supabase skills and MCP tools for Codex",
    "longDescription": "Official Supabase plugin for Codex. Includes agent skills for Supabase development and Postgres best practices, plus MCP server integration for managing your Supabase projects directly from Codex.",
    "developerName": "Supabase",
    "category": "Productivity",
    "capabilities": ["Read", "Write"],
    "websiteURL": "https://supabase.com",
    "privacyPolicyURL": "https://supabase.com/privacy",
    "termsOfServiceURL": "https://supabase.com/terms",
    "defaultPrompt": [
      "Help me set up Supabase Auth with Next.js",
      "Optimize this Postgres query",
      "Review my schema for performance issues"
    ],
    "brandColor": "#3ECF8E",
    "logo": "./assets/logo.svg"
  }
}
```

- [ ] **Step 3: Write packages/codex/.mcp.json**

```json
{
  "supabase": {
    "type": "http",
    "url": "https://mcp.supabase.com/mcp"
  }
}
```

- [ ] **Step 4: Write packages/codex/assets/logo.svg**

```svg
<svg width="109" height="113" viewBox="0 0 109 113" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint0_linear)"/>
<path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint1_linear)" fill-opacity="0.2"/>
<path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E"/>
<defs>
<linearGradient id="paint0_linear" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
<stop stop-color="#249361"/>
<stop offset="1" stop-color="#3ECF8E"/>
</linearGradient>
<linearGradient id="paint1_linear" x1="36.1558" y1="30.578" x2="54.4844" y2="65.0806" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="1" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>
```

- [ ] **Step 5: Create skills symlink**

```bash
cd packages/codex && ln -s ../../submodules/agent-skills/skills skills && cd ../..
```

- [ ] **Step 6: Verify symlink resolves**

```bash
ls packages/codex/skills/
```

Expected: `supabase/` and `supabase-postgres-best-practices/` listed.

- [ ] **Step 7: Commit**

```bash
git add packages/codex/
git commit -m "feat: scaffold codex package"
```

---

### Task 6: Add .gitignore

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Write .gitignore**

```gitignore
### Agents ###
CLAUDE.local.md
.claude/

### macOS ###
.DS_Store
.AppleDouble
.LSOverride
Icon
._*
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk
*.icloud
```

- [ ] **Step 2: Verify the file**

```bash
cat .gitignore
```

Expected: file shows the two sections above.

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: add .gitignore"
```

---

### Task 7: Add Dependabot config

**Files:**
- Create: `.github/dependabot.yml`

- [ ] **Step 1: Create directory**

```bash
mkdir -p .github
```

- [ ] **Step 2: Write .github/dependabot.yml**

```yaml
version: 2
updates:
  - package-ecosystem: "gitsubmodule"
    directory: "/"
    schedule:
      interval: "daily"
    commit-message:
      prefix: "chore"
```

- [ ] **Step 3: Commit**

```bash
git add .github/dependabot.yml
git commit -m "chore: add dependabot config for agent-skills submodule"
```

---

### Task 8: Add Release Please config

**Files:**
- Create: `release-please-config.json`
- Create: `.release-please-manifest.json`

- [ ] **Step 1: Write release-please-config.json**

```json
{
  "bump-minor-pre-major": true,
  "bump-patch-for-minor-pre-major": true,
  "packages": {
    ".": {
      "release-type": "simple",
      "extra-files": [
        {
          "type": "json",
          "path": "packages/claude-code/.claude-plugin/plugin.json",
          "jsonpath": "$.version"
        },
        {
          "type": "json",
          "path": "packages/cursor/.cursor-plugin/plugin.json",
          "jsonpath": "$.version"
        },
        {
          "type": "json",
          "path": "packages/gemini/gemini-extension.json",
          "jsonpath": "$.version"
        },
        {
          "type": "json",
          "path": "packages/codex/.codex-plugin/plugin.json",
          "jsonpath": "$.version"
        }
      ]
    }
  }
}
```

- [ ] **Step 2: Write .release-please-manifest.json**

```json
{
  ".": "0.1.0"
}
```

- [ ] **Step 3: Commit**

```bash
git add release-please-config.json .release-please-manifest.json
git commit -m "chore: add release-please config"
```

---

### Task 9: Add CI workflow

**Files:**
- Create: `.github/workflows/release-please.yml`

- [ ] **Step 1: Write .github/workflows/release-please.yml**

```yaml
name: Release Please

on:
  push:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write

jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        id: release
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/checkout@v4
        if: ${{ steps.release.outputs.release_created }}
        with:
          submodules: true

      - name: Build Claude Code archive
        if: ${{ steps.release.outputs.release_created }}
        run: |
          cd packages/claude-code
          tar -czvf ../../supabase-claude-code-plugin.tar.gz \
            --dereference \
            .claude-plugin/plugin.json \
            .mcp.json \
            skills/

      - name: Build Cursor archive
        if: ${{ steps.release.outputs.release_created }}
        run: |
          cd packages/cursor
          tar -czvf ../../supabase-cursor-plugin.tar.gz \
            --dereference \
            .cursor-plugin/plugin.json \
            mcp.json \
            skills/

      - name: Build Gemini archive
        if: ${{ steps.release.outputs.release_created }}
        run: |
          cd packages/gemini
          tar -czvf ../../supabase-gemini-extension.tar.gz \
            --dereference \
            gemini-extension.json \
            SUPABASE.md \
            skills/

      - name: Build Codex archive
        if: ${{ steps.release.outputs.release_created }}
        run: |
          cd packages/codex
          tar -czvf ../../supabase-codex-plugin.tar.gz \
            --dereference \
            .codex-plugin/plugin.json \
            .mcp.json \
            skills/ \
            assets/

      - name: Upload release assets
        if: ${{ steps.release.outputs.release_created }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh release upload ${{ steps.release.outputs.tag_name }} \
            supabase-claude-code-plugin.tar.gz \
            supabase-cursor-plugin.tar.gz \
            supabase-gemini-extension.tar.gz \
            supabase-codex-plugin.tar.gz
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/release-please.yml
git commit -m "ci: add release-please workflow with four-platform tarball builds"
```

---

### Task 10: Wire up remote and verify final state

**Files:** none (git config only)

- [ ] **Step 1: Add remote**

```bash
git remote add origin git@github.com:supabase-community/supabase-plugin.git
```

Note: the GitHub repo must already be renamed to `supabase-plugin` before pushing. Do that via GitHub Settings → Repository name before this step.

- [ ] **Step 2: Verify the full tree looks correct**

```bash
find packages/ -maxdepth 3 | sort
```

Expected output:
```
packages/
packages/claude-code
packages/claude-code/.claude-plugin
packages/claude-code/.claude-plugin/plugin.json
packages/claude-code/.mcp.json
packages/claude-code/skills
packages/codex
packages/codex/.codex-plugin
packages/codex/.codex-plugin/plugin.json
packages/codex/.mcp.json
packages/codex/assets
packages/codex/assets/logo.svg
packages/codex/skills
packages/cursor
packages/cursor/.cursor-plugin
packages/cursor/.cursor-plugin/plugin.json
packages/cursor/mcp.json
packages/cursor/skills
packages/gemini
packages/gemini/SUPABASE.md
packages/gemini/gemini-extension.json
packages/gemini/skills
```

- [ ] **Step 3: Verify all symlinks resolve**

```bash
ls packages/claude-code/skills/ packages/cursor/skills/ packages/gemini/skills/ packages/codex/skills/
```

Expected: each listing shows `supabase/` and `supabase-postgres-best-practices/`.

- [ ] **Step 4: Verify all versions are 0.1.0**

```bash
grep '"version"' \
  packages/claude-code/.claude-plugin/plugin.json \
  packages/cursor/.cursor-plugin/plugin.json \
  packages/gemini/gemini-extension.json \
  packages/codex/.codex-plugin/plugin.json
```

Expected: all four lines show `"version": "0.1.0"`.

- [ ] **Step 5: Push to remote**

```bash
git push -u origin main
```
