# 牛来 skill installer (Windows / PowerShell)
# Usage:  irm https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/install.ps1 | iex
#Requires -Version 5
$ErrorActionPreference = 'Stop'

$RawUrl = 'https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/skills/niulai/SKILL.md'
$Targets = @(
    (Join-Path $HOME '.claude\skills\niulai'),
    (Join-Path $HOME '.agents\skills\niulai'),
    (Join-Path $HOME '.codex\skills\niulai')
)

Write-Host 'Installing niulai skill...' -ForegroundColor Cyan
$content = (Invoke-WebRequest -Uri $RawUrl -UseBasicParsing).Content

foreach ($dir in $Targets) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    Set-Content -Path (Join-Path $dir 'SKILL.md') -Value $content -Encoding UTF8
    Write-Host "  installed -> $dir" -ForegroundColor Green
}

Write-Host 'Done. Restart Claude Code / Codex, then say hi.' -ForegroundColor Cyan
