# NexoCLI - Wrapper para PowerShell
# Replicar comportamento do npm install -g
# Modificado por Nexo, 2025 - Baseado em gemini-cli (Copyright 2025 Google LLC, Apache 2.0)

param()

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$nexocliPath = Join-Path $scriptDir "bundle\nexocli.js"

if (Test-Path $nexocliPath) {
    # Usar & para chamada de comando com argumentos
    & node $nexocliPath @args
} else {
    Write-Error "Ficheiro nexocli.js não encontrado em $nexocliPath"
    Write-Host "Execute 'npm run build' primeiro para gerar o bundle." -ForegroundColor Yellow
    exit 1
}