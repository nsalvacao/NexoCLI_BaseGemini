#!/bin/bash
# NexoCLI_BaseGemini Alias Setup - Bash
# Criado por Claude-Code, 2025
# Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)

# Script para criar alias do NexoCLI em sistemas Unix/Linux/macOS

echo "🚀 NexoCLI_BaseGemini Alias Setup"
echo

# Obter diretório do projeto
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$PROJECT_DIR")"
NEXOCLI_PATH="$PROJECT_ROOT/src/cli/index.js"

# Verificar se o ficheiro existe
if [[ ! -f "$NEXOCLI_PATH" ]]; then
    echo "❌ NexoCLI script not found at: $NEXOCLI_PATH"
    echo "Please ensure the project is properly installed."
    exit 1
fi

# Definir comando de alias
ALIAS_COMMAND="alias nexocli='node \"$NEXOCLI_PATH\"'"

echo "📋 This script will add the following alias to your shell configuration:"
echo "   $ALIAS_COMMAND"
echo

# Detectar shell e definir ficheiro de configuração
if [[ "$SHELL" == *"/bash"* ]]; then
    if [[ -f "$HOME/.bashrc" ]]; then
        CONFIG_FILE="$HOME/.bashrc"
    elif [[ -f "$HOME/.bash_profile" ]]; then
        CONFIG_FILE="$HOME/.bash_profile"
    else
        CONFIG_FILE="$HOME/.bashrc"
    fi
elif [[ "$SHELL" == *"/zsh"* ]]; then
    CONFIG_FILE="$HOME/.zshrc"
elif [[ "$SHELL" == *"/fish"* ]]; then
    CONFIG_FILE="$HOME/.config/fish/config.fish"
    ALIAS_COMMAND="alias nexocli 'node \"$NEXOCLI_PATH\"'"
else
    echo "⚠️  Unsupported shell: $SHELL"
    echo "Please manually add the following alias to your shell configuration:"
    echo "   $ALIAS_COMMAND"
    exit 1
fi

echo "🔧 Detected shell: $SHELL"
echo "📁 Config file: $CONFIG_FILE"
echo

# Verificar se o alias já existe
if [[ -f "$CONFIG_FILE" ]] && grep -q "alias nexocli=" "$CONFIG_FILE"; then
    echo "⚠️  A 'nexocli' alias already exists in $CONFIG_FILE"
    read -p "Do you want to overwrite it? (y/n): " -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted. No changes were made."
        exit 0
    fi
    
    # Remover alias existente
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' '/alias nexocli=/d' "$CONFIG_FILE"
    else
        # Linux
        sed -i '/alias nexocli=/d' "$CONFIG_FILE"
    fi
fi

# Criar ficheiro de configuração se não existir
if [[ ! -f "$CONFIG_FILE" ]]; then
    touch "$CONFIG_FILE"
    echo "📁 Created config file: $CONFIG_FILE"
fi

# Adicionar alias
echo "" >> "$CONFIG_FILE"
echo "# NexoCLI_BaseGemini Alias" >> "$CONFIG_FILE"
echo "$ALIAS_COMMAND" >> "$CONFIG_FILE"
echo "" >> "$CONFIG_FILE"

echo "✅ Alias added to $CONFIG_FILE successfully!"
echo

# Testar o alias
echo "🧪 Testing alias..."
if source "$CONFIG_FILE" 2>/dev/null; then
    echo "✅ Alias is now available in this session."
else
    echo "⚠️  Could not source config file. Please restart your shell."
fi

echo
echo "💡 To use nexocli in new shell sessions, run:"
echo "   source $CONFIG_FILE"
echo "   OR restart your terminal"
echo
echo "🎯 You can now use 'nexocli' command anywhere!"
echo

echo "📖 Example usage:"
echo "   nexocli --help"
echo "   nexocli --version"
echo "   nexocli \"Hello, how are you?\""
echo

echo "🎉 Setup completed successfully!"