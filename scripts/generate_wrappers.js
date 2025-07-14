/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Template for PowerShell wrapper
const powershellTemplate = `# NexoCLI - Wrapper para PowerShell
# Replicar comportamento do npm install -g
# Modificado por Nexo, 2025 - Baseado em gemini-cli (Copyright 2025 Google LLC, Apache 2.0)

param()

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$nexocliPath = Join-Path $scriptDir "bundle\\nexocli.js"

if (Test-Path $nexocliPath) {
    # Usar & para chamada de comando com argumentos
    & node $nexocliPath @args
} else {
    Write-Error "Ficheiro nexocli.js não encontrado em $nexocliPath"
    Write-Host "Execute 'npm run build' primeiro para gerar o bundle." -ForegroundColor Yellow
    exit 1
}`;

// Template for Batch wrapper
const batchTemplate = `@echo off
REM NexoCLI - Wrapper para Command Prompt (CMD)
REM Replicar comportamento do npm install -g
REM Modificado por Nexo, 2025 - Baseado em gemini-cli (Copyright 2025 Google LLC, Apache 2.0)

setlocal
set "SCRIPT_DIR=%~dp0"
set "NEXOCLI_PATH=%SCRIPT_DIR%bundle\\nexocli.js"

if exist "%NEXOCLI_PATH%" (
    node "%NEXOCLI_PATH%" %*
) else (
    echo [ERRO] Ficheiro nexocli.js nao encontrado em %NEXOCLI_PATH%
    echo Execute 'npm run build' primeiro para gerar o bundle.
    exit /b 1
)`;

// Generate wrappers
const ps1Path = join(root, 'nexocli.ps1');
const batPath = join(root, 'nexocli.bat');

try {
  writeFileSync(ps1Path, powershellTemplate, 'utf8');
  writeFileSync(batPath, batchTemplate, 'utf8');
  
  console.log('Wrappers gerados com sucesso:');
  console.log('- nexocli.ps1 (PowerShell)');
  console.log('- nexocli.bat (Command Prompt)');
} catch (error) {
  console.error('Erro ao gerar wrappers:', error.message);
  process.exit(1);
}