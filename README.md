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

```bash
# 1. Clonar e instalar
git clone https://github.com/nsalvacao/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini
npm install

# 2. Build e testar localmente
npm run build
./bundle/nexocli.js --version

# 3. Configurar alias para desenvolvimento
echo 'alias nexocli="./bundle/nexocli.js"' >> ~/.bashrc
source ~/.bashrc

# 4. Primeiro uso
nexocli "Olá! Este é o NexoCLI personalizado."
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
```

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
```bash
nexocli "sua pergunta"           # Chat direto
nexocli --help                   # Ajuda completa
nexocli --version                # Versão
nexocli /clear                   # Limpar sessão
nexocli /help                    # Ajuda interativa
nexocli /memory                  # Gestão de memória
nexocli /theme                   # Selecionar tema
```

### **🔧 Comandos Personalizados (Futuros)**
```bash
nexocli /nexo info               # Informações do sistema Nexo
nexocli /nexo status             # Status de todos os agentes
nexocli /nexo config             # Configuração específica
nexocli /nexo orchestrate        # Integrar com n8n
```

---

## ⚙️ **Desenvolvimento Isolado**

### **🛡️ Ambiente Seguro**
```bash
# Desenvolvimento sem afetar instalação global
cd /path/to/NexoCLI_BaseGemini
npm run build
./bundle/nexocli.js "$@"

# Alias temporário
alias nexocli-dev="./bundle/nexocli.js"
```

### **🔄 Workflow de Desenvolvimento**
```bash
# 1. Modificar código
vim packages/cli/src/ui/components/AsciiArt.ts

# 2. Build e testar
npm run build
./bundle/nexocli.js --version

# 3. Verificar funcionamento
./bundle/nexocli.js "Teste de funcionalidade"
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
```bash
# Testes obrigatórios
npm run build                   # Build success
./bundle/nexocli.js --version   # Versão correcta
./bundle/nexocli.js "teste"     # Funcionalidade básica
```

### **🎯 Testes de Personalização**
```bash
# Verificar rebranding
./bundle/nexocli.js --version | grep -i nexo

# Testar comandos personalizados (futuros)
./bundle/nexocli.js /nexo info
```

---

## 🗑️ **Não Afeta Instalação Global**

### **✅ Operações Seguras**
- `npm install` - Dependências locais
- `npm run build` - Build local
- `./bundle/nexocli.js` - Execução local
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

**🎉 Pronto para personalizar o futuro da interação com IA!**

---

*Desenvolvido por [Nuno Salvação](mailto:nexo-modeling@outlook.com) | Baseado em Gemini-CLI (Google LLC, Apache 2.0) | Parte do ecossistema Nexo*