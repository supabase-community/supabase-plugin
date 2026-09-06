# Microsoft 365 Copilot plugin

A Microsoft 365 App Package that installs the Supabase [MCP server](https://supabase.com/docs/guides/ai-tools/mcp) and [agent skills](https://supabase.com/docs/guides/ai-tools/ai-skills) into [Microsoft 365 Copilot (Cowork)](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugin-development).

This is a manual bring-up: the `plugins` CLI (`npx plugins add`) does not yet target Microsoft 365, so installs go through the Microsoft 365 Agents Toolkit CLI (`atk`).

## What's here

| File | Purpose |
|------|---------|
| `manifest.json` | M365 Unified App Manifest **v1.28** (strict schema). Uses Dynamic Client Registration (no `authorization` block), which matches the Supabase MCP server's native DCR support. |
| `color.png` / `outline.png` | App icons generated from the repo `assets/logo.svg` (192×192 / 32×32, required by the manifest). |
| `tools/supabase-tools.json` | `mcpToolDescription` — required by the v1.28 schema (HTTP 400 if absent). Generated from the MCP server's tool definitions; see [Keeping tool descriptions up to date](#keeping-tool-descriptions-up-to-date). |
| `scripts/generate-tools.mjs` | Regenerates `tools/supabase-tools.json` from the live MCP server's `tools/list`. |
| `scripts/check-package.py` | Companion-file + `mcpToolDescription` guard, shared by `release.yml`, `validate-plugin-manifests.yml` and `sync-m365-tools.yml`. |

The `skills/` folder is shared from the repo root `skills/` (referenced by `agentSkills[].folder`); it is not duplicated here.

**Which skills ship:** the manifest declares only skills that fit Microsoft's companion-file cap (20 non-`SKILL.md` files per skill, Error at upload/sync). Currently that's `skills/supabase` — 2 companion files shipped (3 in-repo; `CHANGELOG.md` is stripped from the package). `skills/supabase-postgres-best-practices` has 34 shipped / 35 in-repo companion files and is excluded until it is split or pruned below 20. The release build step and the PR validation workflow fail if a sync puts any declared skill over the cap.

## Build and install

Prerequisite: Node.js 18+ and the Agents Toolkit CLI ≥ 1.1.12.

```bash
npm install -g @microsoft/m365agentstoolkit-cli
```

Validate the manifest against the v1.28 schema:

```bash
atk validate --manifest-file ./m365/manifest.json
```

Assemble the app package (manifest + icons + tools + shared skills) and sideload it:

```bash
rm -rf build && mkdir -p build/tools build/skills
cp m365/manifest.json m365/color.png m365/outline.png build/
cp m365/tools/supabase-tools.json build/tools/
cp -R skills/supabase build/skills/   # only the skill(s) the manifest declares
find build/skills -name CHANGELOG.md -delete
(cd build && zip -r ../supabase-m365-plugin.zip .) && rm -rf build
```

> Stages the shared `skills/` at the archive root next to the manifest, matching the layout the manifest references (`./skills/...`, `./tools/supabase-tools.json`). This mirrors the [`release.yml`](../.github/workflows/release.yml) build step.

Then install into your tenant (personal scope for testing):

```bash
atk auth login
atk install --file-path ./supabase-m365-plugin.zip --scope Personal
```

For tenant-wide deployments, upload the ZIP at **M365 admin center → Manage apps → Upload custom app** instead.

## Keeping tool descriptions up to date

`tools/supabase-tools.json` is the `mcpToolDescription`: the array of the MCP server's `tools` with names, descriptions, and input schemas. The checked-in file is generated from the live MCP server — real JSON Schemas, verbatim descriptions, and full MCP `annotations` (e.g. `execute_sql` declares `project_id` + `query` and `destructiveHint: true`). `generate-tools.mjs` normalizes one detail: `search_docs`' live description embeds the full runtime GraphQL SDL, so the file (and the generator) keep only its stable first sentence. They are kept in sync automatically by the [`sync-m365-tools`](../.github/workflows/sync-m365-tools.yml) workflow: nightly (or on demand via workflow_dispatch) it calls `tools/list` on `mcp.supabase.com` with `secrets.SUPABASE_ACCESS_TOKEN` (a Supabase PAT, per the [MCP CI auth docs](https://supabase.com/docs/guides/ai-tools/mcp#manual-authentication)) and opens a PR when the file differs. To run it manually, write to a temp file first so a failed run never truncates the pinned file:

```bash
SUPABASE_MCP_TOKEN=<supabase-pat> node ./m365/scripts/generate-tools.mjs \
  > /tmp/tools.json && mv /tmp/tools.json ./m365/tools/supabase-tools.json
```

Pass the PAT via the `SUPABASE_MCP_TOKEN` env var (as the workflow does), not on argv, so it never lands in shell history.

Do not edit `tools/supabase-tools.json` by hand — let the sync own it.

## Notes

- **Dynamic Client Registration**: the connector deliberately omits `authorization`. The Supabase MCP server advertises a `registration_endpoint` (`https://api.supabase.com/platform/oauth/apps/register`), so Cowork registers its OAuth client automatically. Do not switch to `OAuthPluginVault` — the issued `referenceId` would be a placeholder that never matches a registered client.
- **Traffic attribution**: Cowork identifies itself via `User-Agent: copilot-cowork/1.0` and the MCP `initialize` `clientInfo` — not the `X-Source-Name` headers used on other surfaces. The Connector's `description.short` (80 chars) and the app package fields came from the Supabase plugin metadata; adjust copy per store guidelines.
- **Tool annotations**: Cowork reads MCP `annotations` (`readOnlyHint` / `destructiveHint` / `title`) from the connector's tools. The Supabase MCP server already returns full annotations on every tool, and `tools/supabase-tools.json` + `generate-tools.mjs` forward them, so destructive tools (e.g. `apply_migration`, `execute_sql`) prompt for confirmation while read-only tools auto-run. Tools without annotations would be treated as destructive — keep annotations flowing through the generator.
- MS requires a `description` of ≤ 1024 chars per skill. Both shared skills comply as-is: `supabase` 788, `supabase-postgres-best-practices` 834.

## References

- [Build plugins for Copilot Cowork](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugin-development) — package model, `mcpToolDescription`, DCR, validation rules, `atk` CLI.
- [Publish agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/publish) — Partner Center listing (out of scope here).
