# Estrutura Completa do Projeto com Modelos e Downloads

## 📂 Estrutura de Pastas Recomendada

```
NexoCLI_BaseGemini/
├── src/                           # Código fonte
│   ├── providers/
│   │   ├── gemini.js             # Provider OAuth gratuito
│   │   ├── ollama.js             # Provider modelos locais
│   │   ├── openrouter.js         # Provider OpenRouter
│   │   └── base.js               # Interface base
│   ├── cli/
│   ├── database/
│   ├── utils/
│   └── dashboard/
├── models/                        # ⭐ MODELOS LOCAIS (OLLAMA)
│   ├── .ollama/                   # Cache do Ollama (auto-criado)
│   ├── model-configs/             # Configurações customizadas
│   │   ├── deepseek-coding.json
│   │   ├── llama3-general.json
│   │   └── qwen-balanced.json
│   ├── model-prompts/             # Prompts customizados por modelo
│   │   ├── coding-assistant.md
│   │   ├── documentation-writer.md
│   │   └── code-reviewer.md
│   └── benchmarks/                # Testes de performance
│       ├── coding-tests/
│       └── response-times.json
├── downloads/                     # ⭐ DOWNLOADS ADICIONAIS
│   ├── embeddings/                # Embeddings para RAG (futuro)
│   │   └── all-MiniLM-L6-v2/
│   ├── datasets/                  # Datasets para fine-tuning
│   │   ├── coding-examples/
│   │   └── documentation-samples/
│   ├── tools/                     # Ferramentas externas
│   │   ├── ollama-utils/
│   │   └── model-quantization/
│   └── temp/                      # Downloads temporários
├── db/                            # Base de dados SQLite
├── logs/                          # Logs técnicos
├── tests/
├── docs/
├── .env.example                   # Template configuração
├── .gitignore                     # ⚠️ Incluir models/ e downloads/
└── ollama-setup.md               # ⭐ NOVO: Guia de setup
```

## 🔧 Downloads Específicos Recomendados

### **1. Configurações de Modelo (models/model-configs/)**
```json
// deepseek-coding.json
{
  "model": "deepseek-coder:6.7b",
  "temperature": 0.1,
  "top_p": 0.95,
  "context_length": 4096,
  "specialization": "coding",
  "prompt_template": "coding-assistant"
}
```

### **2. Prompts Customizados (models/model-prompts/)**
```markdown
# coding-assistant.md
You are a senior software engineer assistant specialized in:
- Code review and optimization
- Bug detection and fixes
- Architecture recommendations
- Best practices enforcement

Context: Working on NexoCLI_BaseGemini project
Base: Fork of Google's Gemini-CLI
Language: Node.js/JavaScript
```

### **3. Ferramentas Úteis (downloads/tools/)**
```bash
# Scripts de gestão Ollama
├── ollama-manager.sh          # Start/stop/status
├── model-updater.js           # Check for model updates
├── performance-tester.js      # Benchmark modelos
└── cleanup-cache.sh           # Limpar cache desnecessário
```

### **4. Datasets Práticos (downloads/datasets/)**
```bash
# Para treino/teste
├── javascript-patterns/       # Padrões JS comuns
├── node-best-practices/       # Node.js examples
├── api-documentation/         # Exemplos de docs
└── error-handling/            # Casos de erro comuns
```

## 📋 .gitignore Atualizado

```bash
# Modelos locais (muito grandes)
models/.ollama/
models/*/model.bin
models/*/model.safetensors

# Downloads temporários
downloads/temp/
downloads/*/cache/

# Logs de performance
models/benchmarks/*.log
models/benchmarks/temp/

# Configurações locais específicas
models/user-configs/
.ollama-local-config
```

## 🚀 Setup Script Recomendado

```bash
#!/bin/bash
# ollama-setup.sh

echo "🔧 Setting up NexoCLI_BaseGemini local models..."

# 1. Verificar Ollama
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama not found. Please install from https://ollama.com/"
    exit 1
fi

# 2. Criar estrutura de pastas
mkdir -p models/{model-configs,model-prompts,benchmarks}
mkdir -p downloads/{embeddings,datasets,tools,temp}

# 3. Download modelos essenciais
echo "📥 Downloading essential models..."
ollama pull deepseek-coder:6.7b
ollama pull llama3.2:3b
ollama pull qwen2.5:7b

# 4. Testar modelos
echo "🧪 Testing models..."
echo "Test prompt: Write a hello world in JavaScript" | ollama run deepseek-coder:6.7b

echo "✅ Setup complete! Models ready in ./models/"
ollama list
```

## 🎯 Comandos de Gestão

```bash
# Ver modelos instalados
ollama list

# Informação sobre modelo específico
ollama show deepseek-coder:6.7b

# Remover modelo (liberta espaço)
ollama rm modelo-não-usado

# Atualizar modelo
ollama pull deepseek-coder:6.7b

# Monitor de recursos
ollama ps
```