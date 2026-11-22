#!/usr/bin/env bash
# 牛来 skill installer (macOS / Linux / WSL)
# Usage:  curl -fsSL https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/install.sh | bash
# Run from a checkout (bash install.sh), it installs that checkout's SKILL.md and does not download.
set -euo pipefail

RAW_URL="https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/skills/niulai/SKILL.md"
TARGETS=(
  "$HOME/.claude/skills/niulai"
  "$HOME/.agents/skills/niulai"
  "$HOME/.codex/skills/niulai"
)

echo "Installing niulai skill..."
tmp=""
trap '[ -z "$tmp" ] || rm -f "$tmp"' EXIT
# BASH_SOURCE is empty when the script is piped into bash.
if [ -n "${BASH_SOURCE:-}" ] && [ -f "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/skills/niulai/SKILL.md" ]; then
  src="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/skills/niulai/SKILL.md"
else
  tmp="$(mktemp)"
  # Download to a file: "$(curl ...)" drops the trailing newline.
  curl -fsSL "$RAW_URL" -o "$tmp"
  src="$tmp"
fi

for dir in "${TARGETS[@]}"; do
  mkdir -p "$dir"
  cp "$src" "$dir/SKILL.md"
  echo "  installed -> $dir"
done

echo "Done. Restart Claude Code / Codex, then say hi."
