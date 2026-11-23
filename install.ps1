# 牛来 skill installer (Windows / PowerShell)
# Usage:  irm https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/install.ps1 | iex
# Run from a checkout (.\install.ps1), it installs that checkout's SKILL.md and does not download.
#Requires -Version 5
$ErrorActionPreference = 'Stop'

$RawUrl = 'https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/skills/niulai/SKILL.md'
$Targets = @(
    (Join-Path $HOME '.claude\skills\niulai'),
    (Join-Path $HOME '.agents\skills\niulai'),
    (Join-Path $HOME '.codex\skills\niulai')
)

Write-Host 'Installing niulai skill...' -ForegroundColor Cyan
# $PSScriptRoot is empty when the script is piped into iex.
$Local = if ($PSScriptRoot) { Join-Path $PSScriptRoot 'skills\niulai\SKILL.md' } else { $null }
$Tmp = $null
if ($Local -and (Test-Path $Local)) {
    $Source = $Local
} else {
    # Save the bytes as downloaded. Going through a string and Set-Content changes them:
    # Windows PowerShell 5 puts a byte order mark in front of the '---' line.
    $Tmp = [System.IO.Path]::GetTempFileName()
    Invoke-WebRequest -Uri $RawUrl -UseBasicParsing -OutFile $Tmp
    $Source = $Tmp
}

foreach ($dir in $Targets) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    Copy-Item -Path $Source -Destination (Join-Path $dir 'SKILL.md') -Force
    Write-Host "  installed -> $dir" -ForegroundColor Green
}
if ($Tmp) { Remove-Item $Tmp -Force }

Write-Host 'Done. Restart Claude Code / Codex, then say hi.' -ForegroundColor Cyan
