@echo off
rem NexoCLI_BaseGemini Alias Setup - Batch
rem Criado por Claude-Code, 2025
rem Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)

echo.
echo 🚀 NexoCLI_BaseGemini Alias Setup
echo.

rem Obter diretório do projeto
set "PROJECT_DIR=%~dp0"
set "PROJECT_ROOT=%PROJECT_DIR%.."
set "NEXOCLI_PATH=%PROJECT_ROOT%\src\cli\index.js"

rem Verificar se o ficheiro existe
if not exist "%NEXOCLI_PATH%" (
    echo ❌ NexoCLI script not found at: %NEXOCLI_PATH%
    echo Please ensure the project is properly installed.
    pause
    exit /b 1
)

rem Definir comando de alias
set "ALIAS_COMMAND=doskey nexocli=node "%NEXOCLI_PATH%" $*"

echo 📋 This script will create a doskey alias for 'nexocli' command.
echo.
echo The alias will be: %ALIAS_COMMAND%
echo.

rem Criar ficheiro de alias
set "ALIAS_FILE=%USERPROFILE%\nexocli_alias.bat"
echo %ALIAS_COMMAND% > "%ALIAS_FILE%"

echo ✅ Alias created successfully!
echo 📁 Alias file: %ALIAS_FILE%
echo.

rem Executar o alias na sessão atual
call "%ALIAS_FILE%"

echo 💡 To use nexocli in new Command Prompt sessions, run:
echo    "%ALIAS_FILE%"
echo.
echo 🎯 You can now use 'nexocli' command in this session!
echo.

echo 📖 Example usage:
echo    nexocli --help
echo    nexocli --version
echo    nexocli "Hello, how are you?"
echo.

rem Perguntar se quer adicionar ao startup
set /p "ADD_STARTUP=Do you want to add this alias to Windows startup? (y/n): "
if /i "%ADD_STARTUP%"=="y" (
    rem Adicionar ao registo para carregar automaticamente
    reg add "HKCU\Software\Microsoft\Command Processor" /v "AutoRun" /t REG_SZ /d "%ALIAS_FILE%" /f >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✅ Alias added to Windows startup
    ) else (
        echo ⚠️  Could not add to startup. You may need to run as administrator.
    )
)

echo.
echo 🎉 Setup completed successfully!
pause