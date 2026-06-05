# Changelog

## [0.1.11](https://github.com/supabase-community/supabase-plugin/compare/v0.1.10...v0.1.11) (2026-06-05)


### Bug Fixes

* ship platform-specific gemini extension tarballs ([#37](https://github.com/supabase-community/supabase-plugin/issues/37)) ([b4c1943](https://github.com/supabase-community/supabase-plugin/commit/b4c19435c1b51fcb4efbcdfa8107a7800ec8a578))

## [0.1.10](https://github.com/supabase-community/supabase-plugin/compare/v0.1.9...v0.1.10) (2026-05-27)


### Features

* sync skills from supabase/agent-skills v0.1.5 ([#34](https://github.com/supabase-community/supabase-plugin/issues/34)) ([74842f0](https://github.com/supabase-community/supabase-plugin/commit/74842f0daf5dc07635ed8832f1e1a1b43cb4b6f8))

## [0.1.9](https://github.com/supabase-community/supabase-plugin/compare/v0.1.8...v0.1.9) (2026-05-26)


### Bug Fixes

* use shopt -s dotglob so wildcards capture dotfiles in archives ([#32](https://github.com/supabase-community/supabase-plugin/issues/32)) ([76a228a](https://github.com/supabase-community/supabase-plugin/commit/76a228a67d6f3c8a253aba7ce0d305bf1f7cfa42))

## [0.1.8](https://github.com/supabase-community/supabase-plugin/compare/v0.1.7...v0.1.8) (2026-05-26)


### Features

* add Cursor, Codex, and Gemini plugin surfaces ([#8](https://github.com/supabase-community/supabase-plugin/issues/8)) ([1df3f13](https://github.com/supabase-community/supabase-plugin/commit/1df3f13a54849c9960ad86214e68f5010483a2ce))
* add GitHub Copilot CLI plugin ([#19](https://github.com/supabase-community/supabase-plugin/issues/19)) ([2fb3bb6](https://github.com/supabase-community/supabase-plugin/commit/2fb3bb65bfc9bc9c99fac34a58f35c27595b39a7))
* add install commands to README and pack .mcp.json into plugin dirs ([df2f101](https://github.com/supabase-community/supabase-plugin/commit/df2f101425d87809aa9c38b07d0315b8f7b56c79))
* add release-please automation for all vendor plugins ([#23](https://github.com/supabase-community/supabase-plugin/issues/23)) ([df7c9e9](https://github.com/supabase-community/supabase-plugin/commit/df7c9e9664a0002b77dae454f2eda747f6ce1fdb))
* add Supabase Claude Code plugin ([52a1593](https://github.com/supabase-community/supabase-plugin/commit/52a1593c899ff353b6c5068f4b11b5a77e41a84e))
* add X-Source-Name/Version headers and remove utm_source from MCP URL ([0f7f0c0](https://github.com/supabase-community/supabase-plugin/commit/0f7f0c046a274122b9f49ce7c7080d88777bdd60))
* add X-Source-Name/Version headers and remove utm_source from MCP URL ([a45ceda](https://github.com/supabase-community/supabase-plugin/commit/a45cedaddb353a9de2a2016a59587ef6b4356641))
* add X-Source-Name/Version headers to MCP server config ([69e7dff](https://github.com/supabase-community/supabase-plugin/commit/69e7dff74e1585a3642252ce04c1681d6a43caa1))
* claude code plugin with skills and mcp ([fb8f47d](https://github.com/supabase-community/supabase-plugin/commit/fb8f47d9702e596560aae55e4fade4f8af6386c2))
* poll agent-skills releases for sync ([fe220b4](https://github.com/supabase-community/supabase-plugin/commit/fe220b42c479635e512d7835fc737017da102458))
* poll agent-skills releases for sync ([2f6c841](https://github.com/supabase-community/supabase-plugin/commit/2f6c841b6512b6c3843f9e9600e519a6c0783643))
* scaffold claude-code package ([897c883](https://github.com/supabase-community/supabase-plugin/commit/897c88358f61d6b2f952ba7aff089a60bd331c1e))
* scaffold codex package ([5fd60d1](https://github.com/supabase-community/supabase-plugin/commit/5fd60d190a6549fd39454bbc460c74b89923f1cf))
* scaffold cursor package ([322cfab](https://github.com/supabase-community/supabase-plugin/commit/322cfab0b6f030e2ffb5fc3e957d65a3d58c414a))
* scaffold gemini package ([1aeb60b](https://github.com/supabase-community/supabase-plugin/commit/1aeb60bd5e0025dc9df61c2b6ef88e991462696d))
* sync vendored skills from agent-skills releases ([77294de](https://github.com/supabase-community/supabase-plugin/commit/77294defb482bbf0ed257532df93a7f16dc123fa))
* trigger release for skills v0.1.2 sync ([#30](https://github.com/supabase-community/supabase-plugin/issues/30)) ([199243d](https://github.com/supabase-community/supabase-plugin/commit/199243d6f624fa6edf69852505c416eba70a07ab))
* update supabase skill to v0.1.1 ([#14](https://github.com/supabase-community/supabase-plugin/issues/14)) ([976c281](https://github.com/supabase-community/supabase-plugin/commit/976c281f13144e8e4a3180a8be81080276ad589e))


### Bug Fixes

* correct sync workflow YAML and naming ([fb2a954](https://github.com/supabase-community/supabase-plugin/commit/fb2a954a4eee35f8f854822099be92205a7e8d49))
* quote sync workflow pull request metadata ([5bada23](https://github.com/supabase-community/supabase-plugin/commit/5bada23233619621c1932ec0a0b4cbf7aa8dce54))
* rename plugin from supabase-plugin to supabase across all platforms ([118bfb1](https://github.com/supabase-community/supabase-plugin/commit/118bfb174f8d6c1a652122386e74ae35a60f53c2))
* rewrite skill sync workflow ([#25](https://github.com/supabase-community/supabase-plugin/issues/25)) ([38f96df](https://github.com/supabase-community/supabase-plugin/commit/38f96dfc82bbcde6777a93d43885966d259c7403))
