#!/usr/bin/env bash
# Install Niu Lai Codex pet into $CODEX_HOME/pets/niulai
# Usage:  curl -fsSL https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/pets/install.sh | bash
set -euo pipefail

BASE="https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/pets/niulai"
DEST="${CODEX_HOME:-$HOME/.codex}/pets/niulai"
mkdir -p "$DEST"
curl -fsSL "$BASE/pet.json" -o "$DEST/pet.json"
curl -fsSL "$BASE/spritesheet.webp" -o "$DEST/spritesheet.webp"

# If running under WSL, also write the Windows Codex home so Desktop can see it.
win_home=""
if [[ -n "${USERPROFILE:-}" ]]; then
  win_home="$USERPROFILE"
elif command -v wslpath >/dev/null 2>&1 && [[ -d /mnt/c/Users ]]; then
  win_user="$(cmd.exe /c "echo %USERNAME%" 2>/dev/null | tr -d '\r' || true)"
  if [[ -n "$win_user" && -d "/mnt/c/Users/$win_user/.codex" ]]; then
    win_home="C:\\Users\\$win_user"
  fi
fi
if [[ -n "$win_home" ]]; then
  if command -v wslpath >/dev/null 2>&1; then
    win_dest="$(wslpath "$win_home")/.codex/pets/niulai"
  else
    win_dest=""
  fi
  if [[ -n "${win_dest:-}" ]]; then
    mkdir -p "$win_dest"
    cp -f "$DEST/pet.json" "$DEST/spritesheet.webp" "$win_dest/"
    echo "also installed -> $win_dest"
  fi
fi

echo "installed -> $DEST"
echo "Open Settings → Pets → Refresh, pick Niu Lai, then /pet"
