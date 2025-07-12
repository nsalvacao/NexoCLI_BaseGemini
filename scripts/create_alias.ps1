# NexoCLI_BaseGemini Alias Setup - PowerShell
# Criado por Claude-Code, 2025
# Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)

# Script para criar alias do NexoCLI em PowerShell (Windows)

Write-Host "🚀 NexoCLI_BaseGemini Alias Setup" -ForegroundColor Green

# Obter diretório do projeto
$PROJECT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Definition
$PROJECT_ROOT = Split-Path -Parent $PROJECT_DIR
$NEXOCLI_PATH = Join-Path $PROJECT_ROOT "src\cli\index.js"

# Verificar se o ficheiro existe
if (-not (Test-Path $NEXOCLI_PATH)) {
    Write-Host "❌ NexoCLI script not found at: $NEXOCLI_PATH" -ForegroundColor Red
    Write-Host "Please ensure the project is properly installed." -ForegroundColor Yellow
    exit 1
}

# Definir função de alias
$ALIAS_FUNCTION = @"
function nexocli {
    node "$NEXOCLI_PATH" @args
}
"@

Write-Host "📋 This script will add the following alias to your PowerShell profile:" -ForegroundColor Cyan
Write-Host $ALIAS_FUNCTION -ForegroundColor White

# Verificar se o profile existe
if (-not (Test-Path $PROFILE)) {
    Write-Host "📁 PowerShell profile not found. Creating..." -ForegroundColor Yellow
    New-Item -Path $PROFILE -ItemType File -Force | Out-Null
    Write-Host "✅ PowerShell profile created at: $PROFILE" -ForegroundColor Green
}

# Verificar se o alias já existe
$profileContent = Get-Content $PROFILE -Raw -ErrorAction SilentlyContinue
if ($profileContent -and $profileContent.Contains("function nexocli")) {
    Write-Host "⚠️  A 'nexocli' alias already exists in your PowerShell profile." -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne 'y' -and $overwrite -ne 'Y') {
        Write-Host "❌ Aborted. No changes were made." -ForegroundColor Red
        exit 0
    }
    
    # Remover alias existente
    $profileContent = $profileContent -replace "function nexocli \{[^}]*\}", ""
    $profileContent | Set-Content $PROFILE
}

# Adicionar novo alias
Add-Content $PROFILE "`n# NexoCLI_BaseGemini Alias`n$ALIAS_FUNCTION`n"

Write-Host "✅ Alias added to PowerShell profile successfully!" -ForegroundColor Green
Write-Host "📁 Profile location: $PROFILE" -ForegroundColor Cyan

# Testar o alias
Write-Host "🧪 Testing alias..." -ForegroundColor Yellow
try {
    # Recarregar o profile na sessão atual
    . $PROFILE
    
    Write-Host "✅ Alias is now available in this session." -ForegroundColor Green
    Write-Host "💡 To use nexocli in new PowerShell sessions, restart PowerShell or run: `. `$PROFILE`" -ForegroundColor Cyan
    Write-Host "🎯 You can now use 'nexocli' command anywhere in PowerShell!" -ForegroundColor Magenta
    
    # Mostrar exemplo de uso
    Write-Host "`n📖 Example usage:" -ForegroundColor Cyan
    Write-Host "   nexocli --help" -ForegroundColor White
    Write-Host "   nexocli --version" -ForegroundColor White
    Write-Host "   nexocli `"Hello, how are you?`"" -ForegroundColor White
    
} catch {
    Write-Host "⚠️  Alias added but there was an error testing it: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "💡 Try restarting PowerShell or running: `. `$PROFILE`" -ForegroundColor Cyan
}

Write-Host "`n🎉 Setup completed successfully!" -ForegroundColor Green