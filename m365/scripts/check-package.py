#!/usr/bin/env python3
"""
Validate the Microsoft 365 package: companion-file rules for every skill the
manifest declares, and the mcpToolDescription contract.

Enforces Microsoft's Error-severity companion-file rules (≤ 20 files, ≤ 5 MB/file,
≤ 10 MB total, no hidden files, no unsafe names, no Windows reserved names) and
checks mcpToolDescription: every tool needs a non-empty description and a concrete
inputSchema (parameterized tools must declare at least one property). Excludes
CHANGELOG.md from the count to match the set shipped in the release ZIP.

Usage:
  python3 m365/scripts/check-package.py                          # committed skills + tools (PR / push:main)
  python3 check-package.py --tools <path>                        # tools only, sync path (live temp file)
  python3 check-package.py --skills-root <dir>                   # staged skills + committed tools, release path
"""
import argparse
import json
import os
import re
import sys
from pathlib import Path

RESERVED = {'CON', 'PRN', 'AUX', 'NUL'} | {f'COM{i}' for i in range(1, 10)} | {f'LPT{i}' for i in range(1, 10)}
SAFE_NAME = re.compile(r'^[A-Za-z0-9._! -]+$')
ZERO_ARG = {'list_organizations', 'list_projects'}

ROOT = Path(__file__).resolve().parent.parent.parent  # repo root (m365/scripts/check-package.py -> up 3)


def check_skills(manifest_path: Path, skills_root: Path):
    m = json.loads(manifest_path.read_text())
    for skill in m.get('agentSkills', []):
        folder = skill['folder'].lstrip('./')
        base = skills_root / folder.split('/')[-1]
        if not base.is_dir():
            base = skills_root / folder
        if not base.is_dir():
            print(f'M365: skill folder {base} missing')
            sys.exit(1)
        count = 0
        total = 0
        for root, _dirs, files in os.walk(base):
            for f in files:
                if f in ('CHANGELOG.md', 'SKILL.md'):
                    continue
                count += 1
                p = Path(root) / f
                size = p.stat().st_size
                total += size
                if size > 5 * 1024 * 1024:
                    print(f'M365: {p} exceeds 5 MB')
                    sys.exit(1)
                base_name = f.split('.')[0].upper()
                if f.startswith('.') or not SAFE_NAME.match(f) or base_name in RESERVED:
                    print(f'M365: {p} violates MS companion-name rules')
                    sys.exit(1)
        if count > 20:
            print(f'M365: {base} has {count} companion files (MS limit 20)')
            sys.exit(1)
        if total > 10 * 1024 * 1024:
            print(f'M365: {base} companions total {total} bytes (MS limit 10 MB)')
            sys.exit(1)
        print(f'M365: {base} OK ({count} companions, {total} bytes)')


def check_tools(tools_path: Path):
    tools = json.loads(tools_path.read_text())
    if not isinstance(tools, list) or len(tools) == 0:
        print('M365: mcpToolDescription is empty')
        sys.exit(1)
    for t in tools:
        if not t.get('name') or not isinstance(t.get('inputSchema'), dict) or not t['inputSchema']:
            print(f'M365: tool entry malformed: {t}')
            sys.exit(1)
        if not t.get('description'):
            print(f'M365: tool {t["name"]} has an empty description')
            sys.exit(1)
        if t['name'] not in ZERO_ARG and not t['inputSchema'].get('properties'):
            print(f'M365: parameterized tool {t["name"]} has an empty inputSchema')
            sys.exit(1)
    print(f'M365: {len(tools)} tools OK (descriptions + schemas)')


def main():
    ap = argparse.ArgumentParser()
    group = ap.add_mutually_exclusive_group()
    group.add_argument('--tools',
                       help='validate ONLY this tool-description file and skip the skills check '
                            '(used by the nightly sync on the live-generated temp file)')
    group.add_argument('--skills-root',
                       help='validate skills under this root instead of the committed <repo>/skills '
                            '(used by the release build on the staged m365-build/skills tree)')
    args = ap.parse_args()
    if args.tools is not None:
        # sync path: tools-only (do not gate on a skills condition the sync did not change)
        check_tools(Path(args.tools))
        return
    skills_root = Path(args.skills_root) if args.skills_root else ROOT / 'skills'
    check_skills(ROOT / 'm365' / 'manifest.json', skills_root)
    check_tools(ROOT / 'm365' / 'tools' / 'supabase-tools.json')


if __name__ == '__main__':
    main()
