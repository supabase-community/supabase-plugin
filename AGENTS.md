# AGENTS.md

This repository is the Claude Code plugin distribution repo for Supabase.

## Purpose

Keep this repository focused on the Claude plugin shape:

- `.claude-plugin/plugin.json` defines plugin identity and metadata
- `.claude-plugin/marketplace.json` provides an optional self-hosted marketplace wrapper
- `.mcp.json` configures the Supabase MCP server for Claude Code
- `skills/` contains the shipped, real skill files consumed by Claude

This repo should stay self-contained. Claude marketplace installs copy the plugin into Claude's local cache, so paths outside the plugin root are fragile and should be avoided.

## Important Commands

Validate the plugin manifest:

```bash
npx claude plugin validate .claude-plugin/plugin.json
```

Validate the marketplace wrapper:

```bash
npx claude plugin validate .claude-plugin/marketplace.json
```

## Editing Rules

- Do not move `skills/`, `.mcp.json`, or `.claude-plugin/plugin.json` out of the repo root layout.
- Do not replace `skills/` with a symlink or submodule reference.
- Keep the plugin name stable as `supabase` unless there is a deliberate migration plan.
- When changing descriptions or keywords, update both `plugin.json` and `marketplace.json` together.

## Adding New Vendor Plugins

Before adding a new vendor plugin, or changing an existing vendor plugin, fetch the official plugin documentation for that specific vendor.

Known vendor documentation pages:

- Claude Code:
  - https://code.claude.com/docs/en/plugins
  - https://code.claude.com/docs/en/plugins-reference
  - https://code.claude.com/docs/en/plugin-marketplaces
- Cursor:
  - https://cursor.com/plugins
  - https://docs.cursor.com/en/context/mcp
- Codex:
  - https://developers.openai.com/codex/plugins/build
- Gemini CLI:
  - https://geminicli.com/docs/extensions/writing-extensions/

For vendors listed above, read the official documentation pages for the vendor you are working on and follow the plugin structure required by those docs.

For vendors not listed above, search the vendor's official documentation and follow the plugin structure described there. Do not infer the structure from community examples before checking the vendor's own documentation.

When adding a new vendor plugin:

1. Keep the plugin structures that already exist in this repository intact. Add the new vendor plugin around the existing shared layout instead of restructuring the repo for the new vendor.

2. Add only the vendor-specific adapter files required by the vendor documentation.

3. Reuse the shared root `skills/` directory and shared assets where the vendor supports them.

4. Keep vendor manifests thin and adapter-focused:
   - vendor metadata
   - pointers to shared `skills/`
   - pointers to vendor-specific MCP filenames if required

5. If a vendor requires a different MCP filename, add or generate that adapter file without changing the structures for the plugins already present in this repo.

6. Document, in the PR or maintainer notes:
   - the vendor documentation URL used
   - required manifest path
   - required MCP filename
   - whether marketplace metadata is needed
   - local validation command for that vendor

## Syncing Skills

The shipped skills in `skills/` are intended to be real vendored files.

- The source of truth for skill content is `supabase/agent-skills`.
- This repo consumes release assets from `supabase/agent-skills`, not a submodule or symlink.
- The sync workflow expects the upstream release to publish:
  - `supabase.tar.gz`
  - `supabase-postgres-best-practices.tar.gz`
- Synced provenance is tracked in `skills/.upstream.json`.

If skills are updated upstream, use the sync workflow or the repository dispatch event to vendor them into this repo as normal files and review the resulting PR here before merge.
