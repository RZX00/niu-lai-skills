# Install Niu Lai Codex pet into %USERPROFILE%\.codex\pets\niulai
# Usage:  irm https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/pets/install.ps1 | iex
#Requires -Version 5
$ErrorActionPreference = 'Stop'

$Base = 'https://raw.githubusercontent.com/RZX00/niu-lai-skills/main/pets/niulai'
$HomeDir = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE '.codex' }
$Dest = Join-Path $HomeDir 'pets\niulai'
New-Item -ItemType Directory -Force -Path $Dest | Out-Null
Invoke-WebRequest -UseBasicParsing -Uri "$Base/pet.json" -OutFile (Join-Path $Dest 'pet.json')
Invoke-WebRequest -UseBasicParsing -Uri "$Base/spritesheet.webp" -OutFile (Join-Path $Dest 'spritesheet.webp')
Write-Host "installed -> $Dest"
Write-Host 'Open Settings → Pets → Refresh, pick Niu Lai, then /pet'
