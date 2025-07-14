@echo off
REM NexoCLI - Wrapper para Command Prompt (CMD)
REM Replicar comportamento do npm install -g
REM Modificado por Nexo, 2025 - Baseado em gemini-cli (Copyright 2025 Google LLC, Apache 2.0)

setlocal
set "SCRIPT_DIR=%~dp0"
set "NEXOCLI_PATH=%SCRIPT_DIR%bundle\nexocli.js"

if exist "%NEXOCLI_PATH%" (
    node "%NEXOCLI_PATH%" %*
) else (
    echo [ERRO] Ficheiro nexocli.js nao encontrado em %NEXOCLI_PATH%
    echo Execute 'npm run build' primeiro para gerar o bundle.
    exit /b 1
)