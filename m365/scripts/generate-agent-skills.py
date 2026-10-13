#!/usr/bin/env python3
"""
Regenerate `agentSkills` in m365/manifest.json from the `skills/` directory.

Microsoft 365 Copilot requires one `agentSkills[]` entry per skill folder (each
entry references a folder containing a SKILL.md directly — there is no
directory-scan), so this keeps the manifest in sync when skills are synced from
supabase/agent-skills. Only skills at or below Microsoft's companion-file cap are
included; a skill over the cap cannot be uploaded and is skipped.

Usage:
  python3 m365/scripts/generate-agent-skills.py     # from the repo root
"""
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent  # repo root

# Microsoft caps companion files (any file other than SKILL.md) at 20 per skill,
# validated at upload and sync time (Error severity):
# https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugin-development#companion-file-limits
MS_COMPANION_FILE_CAP = 20


def companion_file_count(skill_dir: Path) -> int:
    count = 0
    for root, _dirs, files in os.walk(skill_dir):
        for f in files:
            if f in ('SKILL.md', 'CHANGELOG.md'):
                continue
            count += 1
    return count


def main() -> int:
    manifest_path = ROOT / 'm365' / 'manifest.json'
    skills_root = ROOT / 'skills'
    if not skills_root.is_dir():
        print(f'M365: skills directory {skills_root} missing')
        return 1

    manifest = json.loads(manifest_path.read_text())

    entries = []
    for skill_dir in sorted(skills_root.iterdir()):
        if not skill_dir.is_dir() or not (skill_dir / 'SKILL.md').is_file():
            continue
        count = companion_file_count(skill_dir)
        if count > MS_COMPANION_FILE_CAP:
            print(
                f'M365: skip {skill_dir.name} ({count} companion files > '
                f'{MS_COMPANION_FILE_CAP} cap)'
            )
            continue
        entries.append({'folder': f'./skills/{skill_dir.name}'})
        print(f'M365: include {skill_dir.name} ({count} companion files)')

    manifest['agentSkills'] = entries
    manifest_path.write_text(f'{json.dumps(manifest, indent=2)}\n')
    print(f'M365: wrote {len(entries)} agentSkills entries to {manifest_path}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
