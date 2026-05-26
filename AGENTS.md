# AGENTS.md

This repository is the plugin distribution repo for Supabase across Claude Code, Cursor, Codex, and Gemini.

## Purpose

Keep this repository focused on the shared multi-vendor plugin layout:

- `.claude-plugin/plugin.json` defines the Claude Code plugin identity and metadata
- `.cursor-plugin/plugin.json` defines the Cursor plugin surface
- `.codex-plugin/plugin.json` defines the Codex plugin surface
- `.github/plugin/plugin.json` defines the GitHub Copilot plugin surface
- `agents/claude/.mcp.json`, `agents/cursor/mcp.json`, `agents/codex/.app.json`, and `agents/copilot/.mcp.json` hold agent-specific MCP config files
- `gemini-extension.json` defines the Gemini extension manifest
- `skills/` contains the shipped, real skill files consumed by the supported plugin surfaces

This repo should stay self-contained. Claude marketplace installs copy the plugin into Claude's local cache, so paths outside the plugin root are fragile and should be avoided.

## Important Commands

Validate the plugin manifest:

```bash
npx claude plugin validate .claude-plugin/plugin.json
```

## Editing Rules

- Do not move `skills/`, `agents/`, `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`, or `.codex-plugin/plugin.json` out of the repo root layout.
- Do not replace `skills/` with a symlink or submodule reference.
- Keep the plugin name stable as `supabase` unless there is a deliberate migration plan.
- When changing descriptions or keywords, update all relevant `plugin.json` files together.

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
- GitHub Copilot:
  - https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing
  - https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating
  - https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference
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

6. Wire up the release pipeline:
   - In `release-please-config.json`, add an entry to `extra-files` for the vendor manifest's `version` field, and for `X-Source-Version` in the MCP config if present.
   - In `.github/workflows/release.yml`, add the vendor to the `archives` associative array in the "Create vendor archives" step, and add the archive filename to the `gh release upload` command.
   - Do not edit `.release-please-manifest.json` by hand; release-please manages it automatically.

7. Document, in the PR or maintainer notes:
   - the vendor documentation URL used
   - required manifest path
   - required MCP filename
   - whether marketplace metadata is needed
   - local validation command for that vendor
