# NexoCLI - Personalização do Gemini CLI

---

> **NexoCLI** é um fork personalizado do [Gemini-CLI](https://github.com/google-gemini/gemini-cli) da Google LLC, mantendo toda a funcionalidade original enquanto adiciona personalizações específicas para o ecossistema de desenvolvimento Nexo.
>
> **🎯 Foco:** Personalização mínima do Gemini-CLI original com rebranding, comandos customizados e preparação para integração com solução híbrida de múltiplos agentes.
>
> **Projeto mantido por** [Nuno Salvação](mailto:nexo-modeling@outlook.com) | **Licenciado sob** Apache License 2.0

---

## 📋 **Arquitetura da Solução Completa**

Este projeto é parte de uma **solução híbrida** composta por 4 subprojetos:

### **1. 🔧 NexoCLI** (Este repositório)
- **Função:** Personalização mínima do Gemini-CLI original
- **Responsabilidade:** Interface com modelos Google Gemini
- **Status:** Desenvolvimento ativo
- **Comando:** `nexocli`

### **2. 🤖 Ollama**
- **Função:** Modelos LLM locais
- **Responsabilidade:** Execução offline de modelos
- **Status:** Solução original mantida
- **Comando:** `ollama`

### **3. 🎛️ n8n Orchestrator**
- **Função:** Orquestração visual de agentes
- **Responsabilidade:** Workflow e routing entre agentes
- **Status:** Planeamento
- **Interface:** Web dashboard

### **4. 🖥️ Interface Unificada**
- **Função:** Menu único para todos os agentes
- **Responsabilidade:** UX consolidada
- **Status:** Planeamento
- **Tipo:** Menu terminal ou web

---

## ⚡ **Quick Start NexoCLI**

> **💡 Escolha o tipo de instalação:**
> - **Desenvolvimento local:** Para testar, modificar código
> - **Instalação global:** Para usar comando `nexocli` em qualquer lugar

### **📁 Opção 1: Desenvolvimento Local**

#### **🐧 Linux/macOS:**
```bash
# 1. Clonar e instalar
git clone https://github.com/nsalvacao/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini
npm install

# 2. Build e testar
npm run build
node bundle/nexocli.js --version

# 3. Usar diretamente
node bundle/nexocli.js "Olá! Este é o NexoCLI personalizado."
```

#### **🪟 Windows (PowerShell):**
```powershell
# 1. Clonar e instalar
git clone https://github.com/nsalvacao/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini
npm install

# 2. Build e testar
npm run build
node bundle/nexocli.js --version

# 3. Usar via wrappers
.\nexocli.ps1 "Olá! Este é o NexoCLI personalizado."
.\nexocli.bat "Olá! Este é o NexoCLI personalizado."
```

### **🌐 Opção 2: Instalação Global (Recomendada)**

#### **🐧 Linux/macOS:**
```bash
# 1. Clonar e preparar
git clone https://github.com/nsalvacao/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini
npm install
npm run build

# 2. Instalar globalmente
npm install -g .

# 3. Usar em qualquer lugar
nexocli --version
nexocli "Olá! Este é o NexoCLI personalizado."
```

#### **🪟 Windows (PowerShell):**
```powershell
# 1. Clonar e preparar
git clone https://github.com/nsalvacao/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini
npm install
npm run build

# 2. Instalar globalmente
npm install -g .

# 3. Usar em qualquer lugar
nexocli --version
nexocli "Olá! Este é o NexoCLI personalizado."
```

### **🔄 Desinstalar/Reinstalar**

```bash
# Desinstalar instalação global
npm uninstall -g nexocli
# OU (se foi instalado com nome incorreto)
npm uninstall -g nexocli-base-gemini

# Reinstalar corretamente
cd /path/to/NexoCLI_BaseGemini
npm install -g .

# Verificar funcionamento
nexocli --version
```

**✅ Funciona com OAuth Google gratuito** (60 requests/min + 1000/dia)

---

## 🔧 **Pré-requisitos**

### **📋 Essenciais**
- **[Node.js 20+](https://nodejs.org/)**
- **[Git](https://git-scm.com/)**
- **Terminal compatível**
- **Browser moderno** (OAuth)
- **Conexão Internet**

### **⚠️ Windows**
```powershell
# Se erro de execution policy:
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# IMPORTANTE: No desenvolvimento local, usar 'node' ou os wrappers
node bundle/nexocli.js --version        # Comando direto
.\nexocli.bat --version                 # Via wrapper CMD
.\nexocli.ps1 --version                 # Via wrapper PowerShell
```

### **📝 Diferença Entre Métodos de Instalação**

**📁 Desenvolvimento Local:**
- **Comando:** `node bundle/nexocli.js` ou wrappers `.\nexocli.ps1`/`.\nexocli.bat`
- **Localização:** Apenas no diretório do projeto
- **Uso:** Desenvolvimento, testes, modificações

**🌐 Instalação Global:**
- **Comando:** `nexocli` (em qualquer diretório)
- **Localização:** Disponível sistema-wide via PATH
- **Uso:** Utilização diária, produção

**⚠️ Problema Comum:**
Se o comando global `nexocli` não funcionar, use a secção **🔄 Desinstalar/Reinstalar** acima.

---

## 🚀 **Personalização Atual**

### **✅ Implementado**
- **Rebranding:** `gemini` → `nexocli`
- **Arte ASCII:** Logo personalizado Nexo
- **Comandos base:** Todos os comandos originais mantidos
- **Compatibilidade:** 100% com Gemini-CLI original

### **🔄 Em Desenvolvimento**
- **Comandos slash personalizados:** `/nexo`, `/status`, `/config`
- **Mensagens de boas-vindas:** Interface personalizada
- **Preparação para orquestração:** APIs para integração n8n

### **📋 Planeado**
- **Integração n8n:** Endpoints para orquestração
- **Interface unificada:** Menu consolidado
- **Configuração modular:** Settings específicos Nexo

---

## 📚 **Comandos Disponíveis**

### **🎯 Comandos Base (Herdados)**

#### **🐧 Linux/macOS:**
```bash
./bundle/nexocli.js "sua pergunta"    # Chat direto
./bundle/nexocli.js --help            # Ajuda completa
./bundle/nexocli.js --version         # Versão
./bundle/nexocli.js /clear            # Limpar sessão
./bundle/nexocli.js /help             # Ajuda interativa
./bundle/nexocli.js /memory           # Gestão de memória
./bundle/nexocli.js /theme            # Selecionar tema
```

#### **🪟 Windows (CMD/PowerShell):**
```batch
REM Comando direto
node bundle/nexocli.js "sua pergunta"    

REM Via wrappers (mais fácil)
nexocli.bat "sua pergunta"              # CMD
.\nexocli.ps1 "sua pergunta"            # PowerShell

REM Comandos disponíveis
node bundle/nexocli.js --help            # Ajuda completa
nexocli.bat --version                    # Versão via wrapper
.\nexocli.ps1 /clear                     # Limpar sessão
.\nexocli.ps1 /help                      # Ajuda interativa
.\nexocli.ps1 /memory                    # Gestão de memória
.\nexocli.ps1 /theme                     # Selecionar tema
```

### **🔧 Comandos Personalizados (Futuros)**

#### **🐧 Linux/macOS:**
```bash
./bundle/nexocli.js /nexo info           # Informações do sistema Nexo
./bundle/nexocli.js /nexo status         # Status de todos os agentes
./bundle/nexocli.js /nexo config         # Configuração específica
./bundle/nexocli.js /nexo orchestrate    # Integrar com n8n
```

#### **🪟 Windows (PowerShell):**
```powershell
node bundle/nexocli.js /nexo info           # Informações do sistema Nexo
node bundle/nexocli.js /nexo status         # Status de todos os agentes
node bundle/nexocli.js /nexo config         # Configuração específica
node bundle/nexocli.js /nexo orchestrate    # Integrar com n8n
```

---

## ⚙️ **Desenvolvimento Isolado**

### **🛡️ Ambiente Seguro**

#### **🐧 Linux/macOS:**
```bash
# Desenvolvimento sem afetar instalação global
cd /path/to/NexoCLI_BaseGemini
npm run build
./bundle/nexocli.js "$@"

# Alias temporário
alias nexocli-dev="./bundle/nexocli.js"
```

#### **🪟 Windows (PowerShell):**
```powershell
# Desenvolvimento sem afetar instalação global
cd C:\path\to\NexoCLI_BaseGemini
npm run build
node bundle/nexocli.js $args

# Função temporária
function nexocli-dev { node bundle/nexocli.js $args }
```

### **🔄 Workflow de Desenvolvimento**

#### **🐧 Linux/macOS:**
```bash
# 1. Modificar código
vim packages/cli/src/ui/components/AsciiArt.ts

# 2. Build e testar
npm run build
./bundle/nexocli.js --version

# 3. Verificar funcionamento
./bundle/nexocli.js "Teste de funcionalidade"
```

#### **🪟 Windows (PowerShell):**
```powershell
# 1. Modificar código
notepad packages/cli/src/ui/components/AsciiArt.ts

# 2. Build e testar
npm run build
node bundle/nexocli.js --version

# 3. Verificar funcionamento
node bundle/nexocli.js "Teste de funcionalidade"
```

---

## 🔐 **Autenticação**

### **🚀 OAuth Google (Padrão)**
- **Método principal:** OAuth com conta Google
- **Gratuito:** 60 requests/min + 1000/dia
- **Setup:** Automático na primeira execução
- **Localização:** Credenciais geridas pelo Gemini-CLI

### **🔑 API Keys (Opcional)**
```bash
# Apenas para quotas maiores
export GEMINI_API_KEY="sua_chave_aqui"
```

---

## 📁 **Estrutura do Projeto**

```
NexoCLI_BaseGemini/
├── packages/
│   ├── cli/                    # Interface CLI personalizada
│   │   ├── src/ui/components/
│   │   │   ├── AsciiArt.ts    # ← Logo personalizado
│   │   │   ├── Header.tsx     # ← Boas-vindas
│   │   │   └── ...
│   │   └── src/ui/hooks/
│   │       └── slashCommandProcessor.ts # ← Comandos personalizados
│   └── core/                   # Lógica core (mantida)
├── 0. Log_Dev_NexoCli_BaseGemini/
│   ├── Dev_Logs/              # Logs de desenvolvimento
│   └── Docs_Exemplo/          # Templates de documentação
├── bundle/                    # Build final
├── README.md                  # ← Este ficheiro
├── AGENTS.md                  # ← Guia para agentes
├── CHANGELOG.md               # ← Histórico de alterações
├── LICENSE                    # ← Apache 2.0
└── package.json              # ← Configuração (bin: nexocli)
```

---

## 🧪 **Testes**

### **🔍 Validação Básica**

#### **🐧 Linux/macOS:**
```bash
# Testes obrigatórios
npm run build                   # Build success
./bundle/nexocli.js --version   # Versão correcta
./bundle/nexocli.js "teste"     # Funcionalidade básica
```

#### **🪟 Windows (PowerShell):**
```powershell
# Testes obrigatórios
npm run build                        # Build success
node bundle/nexocli.js --version     # Versão correcta
node bundle/nexocli.js "teste"       # Funcionalidade básica
```

### **🎯 Testes de Personalização**

#### **🐧 Linux/macOS:**
```bash
# Verificar rebranding
./bundle/nexocli.js --version | grep -i nexo

# Testar comandos personalizados (futuros)
./bundle/nexocli.js /nexo info
```

#### **🪟 Windows (PowerShell):**
```powershell
# Verificar rebranding
node bundle/nexocli.js --version | Select-String -Pattern "nexo"

# Testar comandos personalizados (futuros)
node bundle/nexocli.js /nexo info
```

---

## 🗑️ **Não Afeta Instalação Global**

### **✅ Operações Seguras**
- `npm install` - Dependências locais
- `npm run build` - Build local
- `./bundle/nexocli.js` (Linux/macOS) ou `node bundle/nexocli.js` (Windows) - Execução local
- Desenvolvimento em diretório isolado

### **⚠️ Evitar**
- `npm link` - Sobrescreveria comando global
- `npm install -g .` - Substituiria instalação global
- Publicar com mesmo nome no npm

---

## 📄 **Licenciamento e Compliance**

### **📋 Origem e Atribuição**
- **Baseado em:** [Gemini-CLI](https://github.com/google-gemini/gemini-cli) — Google LLC
- **Licença Original:** Apache License 2.0
- **Modificações:** Nuno Salvação, 2025
- **Licença Final:** Apache License 2.0 (mantida)

### **🔍 Modificações Documentadas**
- **Rebranding:** `gemini` → `nexocli`
- **Arte ASCII:** Logo personalizado
- **Comandos:** Extensões específicas Nexo
- **Build:** Processo mantido, output personalizado

### **📚 Compliance**
- **Atribuição:** Mantida em todos os ficheiros
- **Licença:** Texto completo em [LICENSE](LICENSE)
- **Histórico:** Documentado em [CHANGELOG.md](CHANGELOG.md)
- **Transparência:** Processo documentado em [AGENTS.md](AGENTS.md)

---

## 🛠️ **Integração com Solução Híbrida**

### **🔄 Preparação n8n**
```bash
# Futura integração via endpoints
nexocli --api-mode              # Modo API para n8n
nexocli --webhook-url=URL       # Configurar webhook
```

### **🎛️ Interface Unificada**
```bash
# Futuro menu consolidado
nexo                            # Menu principal
├── 🤖 NexoCLI (Google Gemini)
├── 🦾 Ollama (Modelos Locais)
├── 🎛️ n8n (Orquestração)
└── ⚙️ Configurações
```

---

## 📞 **Suporte e Contribuições**

### **🤝 Contribuir**
1. **Ler:** [AGENTS.md](AGENTS.md) - Guia obrigatório
2. **Fork:** Criar fork do repositório
3. **Desenvolver:** Seguir workflow documentado
4. **Testar:** Validar funcionamento
5. **Pull Request:** Submeter com documentação

### **📧 Contactos**
- **Maintainer:** [Nuno Salvação](mailto:nexo-modeling@outlook.com)
- **Issues:** [GitHub Issues](https://github.com/nsalvacao/NexoCLI_BaseGemini/issues)
- **Suporte:** Email direto

---

## 📊 **Status do Projeto**

### **✅ Fase Atual: Personalização Básica**
- ✅ Fork funcional do Gemini-CLI
- ✅ Rebranding `gemini` → `nexocli`
- ✅ Build isolado configurado
- ✅ Documentação básica
- 🔄 Arte ASCII personalizada
- 🔄 Comandos slash customizados
- 🔄 Mensagens de boas-vindas

### **📋 Próximas Fases**
- **Fase 2:** Comandos personalizados completos
- **Fase 3:** Preparação para integração n8n
- **Fase 4:** Interface unificada
- **Fase 5:** Solução híbrida completa

### **🎯 Roadmap Detalhado**
Ver [ROADMAP.md](ROADMAP.md) para cronograma completo.

---

## 🚀 **Começar Desenvolvimento**

### **🐧 Linux/macOS:**
```bash
# Setup completo
git clone https://github.com/nsalvacao/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini
npm install

# Primeiro build
npm run build

# Testar funcionamento
./bundle/nexocli.js "Olá NexoCLI!"

# Configurar ambiente
echo 'alias nexocli-dev="./bundle/nexocli.js"' >> ~/.bashrc
source ~/.bashrc

# Primeira personalização
nexocli-dev --version
```

### **🪟 Windows (PowerShell):**
```powershell
# Setup completo
git clone https://github.com/nsalvacao/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini
npm install

# Primeiro build
npm run build

# Testar funcionamento
node bundle/nexocli.js "Olá NexoCLI!"

# Configurar ambiente
function nexocli-dev { node bundle/nexocli.js $args }

# Primeira personalização
nexocli-dev --version
```

**🎉 Pronto para personalizar o futuro da interação com IA!**

---

*Desenvolvido por [Nuno Salvação](mailto:nexo-modeling@outlook.com) | Baseado em Gemini-CLI (Google LLC, Apache 2.0) | Parte do ecossistema Nexo*