# Contributing

## Adding a New Vendor Plugin

After adding the vendor-specific files, wire up the new vendor into the release pipeline:

1. **`release-please-config.json`** — add an entry to `extra-files` for each JSON field that should be bumped on release. At minimum this is the `version` field in the vendor's manifest. If the vendor's MCP config includes an `X-Source-Version` header, add that field too.

2. **`.github/workflows/release.yml`** — add the new vendor to the `archives` associative array in the "Create vendor archives" step, mapping the archive filename to the space-separated list of files to include. Then add the new archive filename to the `gh release upload` command.

3. **`.release-please-manifest.json`** — this file is managed automatically by release-please. Do not edit it by hand; it will be updated when the next release PR is merged.


## Testing

Before opening a PR, test the plugin locally on the surfaces you've changed. Follow the instructions below to test the plugin for every vendor supported:

- **Claude Code** — [Create your first plugin](https://code.claude.com/docs/en/plugins#create-your-first-plugin)
- **Cursor** — [Test plugins locally](https://cursor.com/docs/plugins#test-plugins-locally)
- **Codex** — [Install a local plugin manually](https://developers.openai.com/codex/plugins/build#install-a-local-plugin-manually)
- **GitHub Copilot** — [Extending Copilot Chat in your organization](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating#creating-a-plugin)
- **Gemini CLI** — [Link your extension](https://geminicli.com/docs/extensions/writing-extensions/#step-4-link-your-extension)

## Releases

Releases are managed automatically by [release-please](https://github.com/googleapis/release-please) via `.github/workflows/release.yml`. The workflow runs on every push to `main` and decides whether to open or update a release PR based on commit message types ([Conventional Commits](https://www.conventionalcommits.org/)):

| Commit type | Release effect |
|---|---|
| `feat:` | Patch bump (minor pre-1.0, per config) |
| `fix:` | Patch bump |
| `feat!:` / `BREAKING CHANGE` | Major bump |
| `chore:`, `docs:`, `refactor:`, `ci:`, etc. | No release |

When a release PR is merged, release-please creates a GitHub release and the workflow builds and uploads the vendors archives, each containing the vendor manifest, MCP adapter, shared `skills/`, and `assets/`.

Version numbers are bumped automatically across all vendor `plugin.json` files and MCP config headers — do not edit them by hand.
