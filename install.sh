#!/usr/bin/env bash
# 牛来 skill installer (macOS / Linux / WSL)
# Usage:  curl -fsSL https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/install.sh | bash
set -euo pipefail

RAW_URL="https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/skills/niulai/SKILL.md"
TARGETS=(
  "$HOME/.claude/skills/niulai"
  "$HOME/.agents/skills/niulai"
  "$HOME/.codex/skills/niulai"
)

echo "Installing niulai skill..."
content="$(curl -fsSL "$RAW_URL")"

for dir in "${TARGETS[@]}"; do
  mkdir -p "$dir"
  printf '%s' "$content" > "$dir/SKILL.md"
  echo "  installed -> $dir"
done

echo "Done. Restart Claude Code / Codex, then say hi."
