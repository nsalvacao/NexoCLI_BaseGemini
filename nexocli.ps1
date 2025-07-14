# NexoCLI - Script auxiliar para Windows PowerShell
# Permite executar nexocli no Windows sem precisar digitar 'node' sempre

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$nexocliPath = Join-Path $scriptDir "bundle\nexocli.js"

if (Test-Path $nexocliPath) {
    node $nexocliPath @args
} else {
    Write-Error "Ficheiro nexocli.js não encontrado em $nexocliPath"
    Write-Host "Execute 'npm run build' primeiro para gerar o bundle."
    exit 1
}