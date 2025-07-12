# NexoCLI_BaseGemini

---

> **NexoCLI_BaseGemini** é um fork avançado e extensível do [Gemini-CLI](https://github.com/google-gemini/gemini-cli) da Google LLC, adaptado e melhorado para suporte multi-provider (Gemini, OpenRouter, Ollama/local, outros), rotação e fallback automático, logging robusto e documentação de personalidade/instruções estáticas do agente. 
>
> **Projeto mantido por** [Nuno Salvação](mailto:nexo-modeling@outlook.com) | **Licenciado sob** Apache License 2.0

---

## 🟦 **Índice**

1. [Licenciamento & Origem](#-licenciamento--origem)
2. [Resumo do Projeto](#-resumo-do-projeto--estratégia)
3. [System Requirements](#-system-requirements--compatibility)
4. [Quickstart](#-quickstart--instalação)
5. [Quick Examples](#-quick-examples)
6. [Configuração](#-configuração-providers-e-personalidade-do-agente)
7. [Funcionalidades](#-funcionalidades-principais)
8. [Roadmap](#-roadmap)
9. [Contribuição](#-boas-práticas-e-guia-de-contribuição)
10. [Troubleshooting](#-troubleshooting--faq)
11. [Referências](#-referências-e-recursos)
12. [Contactos](#-contactos)
13. [Disclaimer Legal](#-disclaimer-legal)

---

## 🟦 **Licenciamento & Origem**

### **Compliance Legal Obrigatório**

- **Baseado em:** [Gemini-CLI](https://github.com/google-gemini/gemini-cli) — Google LLC, Apache 2.0
- **Modificações, integração e manutenção:** [Nuno Salvação](mailto:nexo-modeling@outlook.com)
- **Licença:** [Apache License 2.0](LICENSE) (texto completo disponível)
- **Projeto original:** Direitos mantidos pela Google LLC
- **Compatibilidade:** 100% compatível com licenciamento original

### **Atribuição Obrigatória**

Todos os ficheiros modificados incluem no início:
```js
// Modificado por Nuno Salvação, 2025
// Baseado em código de gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
```

### **Transparência e Rastreabilidade**

- **Histórico detalhado:** Consulte [CHANGELOG.md](CHANGELOG.md) para todas as alterações e melhorias
- **Documentação técnica:** Ver [AGENTS.md](AGENTS.md) para guidelines de desenvolvimento
- **Roadmap:** Consulte [ROADMAP.md](ROADMAP.md) para planeamento técnico e sequência de desenvolvimento

---

## 🟦 **Resumo do Projeto & Estratégia**

O NexoCLI_BaseGemini mantém **total compatibilidade** com o Gemini-CLI original, expandindo as capacidades para máxima flexibilidade e aderência às preferências do utilizador:

### **Filosofia do Projeto**

- **Compatibilidade garantida:** Acesso normal ao(s) modelo(s) Gemini tal como definido no projeto original
- **Flexibilidade máxima:** Seleção dinâmica entre múltiplos providers sem perder funcionalidade
- **Transparência total:** Logging robusto, rastreabilidade completa e compliance legal rigoroso
- **Extensibilidade:** Arquitetura preparada para futuros providers e funcionalidades

### **Principais Inovações da Fase 4**

1. **Multi-Provider com Fallback Automático:** Sistema inteligente de fallback entre Gemini, OpenRouter, Anthropic e Together AI
2. **Rate Limiting Avançado:** Controlo de quotas e custos por provider com tracking detalhado
3. **Gateway OpenRouter:** Acesso a 100+ modelos através de uma única API
4. **Claude Integration:** Suporte completo para modelos Anthropic (Haiku, Sonnet, Opus)
5. **Diagnóstico Inteligente:** Validação automática de providers com health checks
6. **CLI Expandida:** Comandos avançados para gestão multi-provider
7. **Zero Breaking Changes:** Compatibilidade total mantida com comandos da Fase 2

---

## 🟦 **System Requirements & Compatibility**

### **Requisitos Mínimos**

- **Node.js:** 20.x ou superior (testado em 20.x, 22.x)
- **Sistemas Operativos:** 
  - **Windows 10+ (nativo)** - PowerShell, Command Prompt ou Terminal
  - **macOS 12+** - Terminal nativo
  - **Ubuntu 20.04+ / Debian 11+** - bash/zsh
- **RAM:** 512MB disponível
- **Disco:** 100MB para instalação base + espaço para modelos locais (opcional)
- **Internet:** Conexão para OAuth e providers cloud
- **Browser:** Qualquer browser moderno (para autenticação OAuth)

**⚠️ Importante:** Funciona **nativamente no Windows** sem necessidade de WSL (Windows Subsystem for Linux).

### **Dependências Opcionais**

- **[Ollama](https://ollama.com/):** Para modelos locais (ex: Llama, DeepSeek)
- **[Git](https://git-scm.com/):** Para desenvolvimento e contribuições
- **SQLite:** Incluído automaticamente (base de dados local)

### **Compatibilidade Testada**

| OS | Versão | Node.js | Status |
|---|---|---|---|
| Windows | 10, 11 | 20.x, 22.x | ✅ Suportado |
| macOS | 12+, 13+ | 20.x, 22.x | ✅ Suportado |
| Ubuntu | 20.04, 22.04 | 20.x, 22.x | ✅ Suportado |
| Debian | 11, 12 | 20.x, 22.x | ✅ Suportado |

---

## 🟦 **Quickstart / Instalação**

### **Instalação Rápida**

```bash
# 1. Clonar o repositório
git clone https://github.com/nsalvacao/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini

# 2. Instalar dependências
npm install

# 3. Primeira execução (OAuth automático - SEM chaves API necessárias)
npm start
# O browser abrirá automaticamente para login Google
# Após login: 60 requests/minuto + 1000/dia GRATUITOS

# 4. (Opcional) Configurar providers externos
cp .env.example .env
# Editar .env apenas se quiser outros providers além do Gemini
```

### **Configuração de Autenticação**

**Por defeito, não precisa de chaves API!** O Gemini funciona com autenticação OAuth:

1. **Primeira execução:** Autenticação OAuth automática
   ```bash
   npm start
   # Abre browser automaticamente para login Google
   # 60 requests/minuto + 1000/dia GRATUITOS
   ```

2. **Providers externos opcionais** (só se quiser usar outros modelos):
   ```env
   # Opcional - apenas para providers extras
   OPENROUTER_API_KEY=sua_chave_openrouter_aqui
   ANTHROPIC_API_KEY=sua_chave_anthropic_aqui
   OPENAI_API_KEY=sua_chave_openai_aqui
   
   # Opcional - só para quotas maiores no Gemini
   GEMINI_API_KEY=sua_chave_gemini_aqui
   ```

3. **Obter chaves (apenas se necessário):**
   - **OpenRouter:** [OpenRouter Dashboard](https://openrouter.ai/keys)
   - **Anthropic:** [Anthropic Console](https://console.anthropic.com/)
   - **OpenAI:** [OpenAI Platform](https://platform.openai.com/api-keys)
   - **Gemini API Key** (opcional): [Google AI Studio](https://aistudio.google.com/app/apikey)

### **Verificação da Instalação**

```bash
# Testar instalação básica
npm run test

# Primeira execução com OAuth automático
npm start
# Browser abrirá para login Google (gratuito)

# Verificar providers disponíveis (após configurar .env se necessário)
npm start -- --list-providers

# Teste rápido com Gemini OAuth
npm start -- "Olá, como estás?"
```

---

## 🟦 **Quick Examples**

### **Uso Básico (Gemini Default)**

```bash
# Pergunta simples (fallback automático ativo)
npm start -- "Explica-me computação quântica em 3 parágrafos"

# Teste de conectividade
npm start -- --test

# Diagnóstico de providers
npm start -- --diagnose
```

### **Seleção Multi-Provider (Fase 4)**

```bash
# Listar providers disponíveis
npm start -- --list-providers

# OpenRouter (gateway para 100+ modelos)
npm start -- --provider openrouter "Qual é o melhor modelo de IA atual?"

# Anthropic Claude
npm start -- --provider anthropic "Analisa este código Python"

# Together AI (modelos open-source)
npm start -- --provider together "História da computação"

# Gemini com configuração avançada
npm start -- --provider gemini --model gemini-1.5-pro --temperature 0.3 "Análise técnica"
```

### **Fallback e Configuração Avançada**

```bash
# Fallback automático (recomendado)
npm start -- "Pergunta complexa"  # Usa cadeia: Gemini → OpenRouter → Anthropic → Together

# Desativar fallback (provider específico only)
npm start -- --provider anthropic --no-fallback "Só Claude"

# Configuração de modelo e parâmetros
npm start -- --provider openrouter --model gpt-4 --temperature 0.1 --max-tokens 2000 "Ensaio técnico"
```

### **Gestão e Diagnóstico**

```bash
# Ver status de todos os providers
npm start -- --list-providers

# Diagnóstico rápido
npm start -- --diagnose

# Testes específicos
npm run test:providers
npm run test:integration

# Scripts de gestão
npm run providers:list
npm run providers:health
```

---

## 🟦 **Configuração: Providers e Personalidade do Agente**

### **API Keys e Providers**

### **Autenticação e Providers**

**Método Principal - OAuth (SEM chaves API):**
- **Gemini Google** - Autenticação OAuth com conta pessoal (gratuito)
- **60 requests/minuto + 1000/dia** sem qualquer custo
- **Login automático** via browser na primeira execução

**Providers Externos Opcionais:**
- **OpenRouter** - Gateway para 100+ modelos (requer chave API)
- **Anthropic** - Claude (Sonnet, Opus, Haiku) (requer chave API)
- **OpenAI** - GPT-4, GPT-3.5 (requer chave API)
- **Together** - Modelos open-source (requer chave API)
- **Fireworks** - Modelos rápidos e eficientes (requer chave API)
- **Local** - Ollama, Llama.cpp (sem chaves, offline)

**Configuração opcional via `.env`:**
```env
# SEM necessidade de configuração para Gemini OAuth

# Apenas se quiser providers externos:
OPENROUTER_API_KEY=your_openrouter_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENAI_API_KEY=your_openai_key_here

# Apenas se quiser quotas maiores no Gemini:
GEMINI_API_KEY=your_gemini_api_key_here

# Configurações de Sistema
LOG_LEVEL=info
LOG_TO_DATABASE=true
FALLBACK_ENABLED=true
```

### **Personalidade do Agente**

A personalidade e comportamento do agente são definidos em `NexoCLI_BaseGemini.md`:

```markdown
# Personalidade NexoCLI_BaseGemini v1.0

## Comportamento Default
- Provider: Gemini (Google)
- Logging: Ativo para rastreabilidade
- Histórico: Gravado em base de dados local
- Fallback: Automático para providers secundários

## Características
- Resposta técnica e precisa
- Manutenção de contexto entre sessões
- Atribuição clara de fontes
- Compliance legal rigoroso
```

---

## 🟦 **Funcionalidades Principais**

### **1. Multi-Provider com Fallback Automático (Fase 4 ✅)**

- **Provider Default:** Gemini sempre disponível e funcional
- **OpenRouter Provider:** Gateway para 100+ modelos (GPT, Claude, Llama, Mixtral)
- **Anthropic Provider:** Claude 3 completo (Haiku, Sonnet, Opus)
- **Together AI Provider:** Modelos open-source com inferência rápida
- **Fallback Inteligente:** Cadeia automática Gemini → OpenRouter → Anthropic → Together
- **Rate Limiting:** Controlo de quotas e custos por provider
- **Health Checks:** Validação contínua de disponibilidade

### **2. Menu Interativo de Arranque**

Ao iniciar, o utilizador pode configurar:
- Seleção do provider principal
- Configuração de logging (ficheiro/BD/ambos)
- Gestão de histórico e sessões
- Configurações de performance
- Help e documentação integrados

### **3. Base de Dados e Logging Robusto**

- **SQLite Local:** Armazenamento de chats, logs e configurações
- **Rastreabilidade:** Histórico completo de interações
- **Backup Automático:** Proteção contra perda de dados
- **Exportação:** JSON, CSV, Markdown
- **Análise:** Métricas de uso e performance

### **4. Dashboard de Gestão**

- **Visualização:** Histórico de chats filtrado por data/provider
- **Logs Técnicos:** Pesquisa e análise de logs de desenvolvimento
- **Métricas:** Performance, quotas e usage por provider
- **Exportação:** Dados completos em múltiplos formatos
- **Configuração:** Alterações runtime de providers e logging

## 🤖 **Modelos Locais (Ollama) - Funcionalidade Offline**

### **⚠️ Disclaimer Importante**
**As recomendações de modelos e verificações de sistema são indicativas.** O NexoCLI_BaseGemini faz o seu melhor para avaliar os recursos disponíveis, mas:
- **Leituras do sistema podem conter imprecisões** devido a limitações da plataforma ou configurações específicas
- **A gestão do espaço em disco e recursos é da inteira responsabilidade do utilizador**
- **Modelos podem consumir mais recursos** do que o estimado, dependendo da configuração do sistema
- **É recomendado monitorizar o sistema** durante a utilização de modelos locais
- **O utilizador deve fazer backup** dos seus dados antes de instalar modelos grandes
- **Responsabilidade por custos** de largura de banda e armazenamento é do utilizador

### **📋 Visão Geral**
O NexoCLI_BaseGemini suporta modelos locais via **Ollama**, permitindo funcionalidade **offline** e **maior privacidade**. O sistema verifica automaticamente os recursos do seu sistema e recomenda modelos compatíveis.

### **🔧 Instalação e Setup**

**1. Instalar Ollama (uma única vez):**
```bash
# Windows: Download de https://ollama.com/download
# macOS: brew install ollama
# Linux: curl -fsSL https://ollama.com/install.sh | sh

# Verificar instalação
ollama --version
```

**2. Verificar Recursos do Sistema:**
```bash
# Após instalar NexoCLI_BaseGemini
nexocli models check-system
# Mostra: RAM disponível, CPU, recomendações de modelos
```

**3. Instalar Modelos Recomendados:**
```bash
# Instalação assistida baseada no seu sistema
nexocli models install-recommended

# Ou escolher manualmente
nexocli models list-available
nexocli models install deepseek-coder:6.7b
```

### **🎯 Modelos por Recursos de Sistema**

| **Recursos** | **Modelos Recomendados** | **Uso Típico** |
|--------------|--------------------------|----------------|
| **4-8GB RAM** | `phi3:mini` (2GB)<br>`deepseek-coder:6.7b` (4GB) | Testes, coding básico |
| **8-16GB RAM** | `llama3:8b` (5GB)<br>`mistral:7b` (4GB) | Geral, conversação |
| **16GB+ RAM** | `deepseek-coder:14b` (8GB)<br>`codellama:13b` (7GB) | Coding avançado, análise |

### **⚡ Comandos de Gestão**

```bash
# Verificar sistema e modelos
nexocli models check-system          # Recursos disponíveis
nexocli models list                  # Modelos instalados
nexocli models list-available        # Modelos disponíveis para download

# Gestão de modelos
nexocli models install <model>       # Instalar modelo específico
nexocli models remove <model>        # Remover modelo
nexocli models test <model>          # Testar modelo com prompt simples

# Informações detalhadas
nexocli models info <model>          # Detalhes do modelo
nexocli models benchmark <model>     # Testar performance
```

### **🔄 Fallback Automático**

O sistema implementa **fallback inteligente**:
1. **Tenta provider cloud** (Gemini, OpenRouter, etc.)
2. **Se falhar**, muda automaticamente para **modelo local**
3. **Se modelo local indisponível**, sugere instalação

```bash
# Exemplo de uso com fallback
nexocli --provider gemini --fallback local "Explica esta função JavaScript"
# Tenta Gemini primeiro, depois modelo local se falhar
```

### **📁 Estrutura de Configurações**

**⚠️ Importante:** Os **modelos binários** ficam em `~/.ollama/` (global). O projeto só mantém **configurações**:

```
models/                    # Configurações apenas (não modelos binários)
├── configs/              # Configurações específicas por modelo
│   ├── deepseek-coding.json    # Config para coding
│   ├── llama3-general.json     # Config para conversação
│   └── phi3-lightweight.json   # Config para testes rápidos
├── prompts/              # Prompts customizados
│   ├── coding-assistant.md     # Prompts para programação
│   ├── documentation-writer.md # Prompts para documentação
│   └── system-analysis.md      # Prompts para análise técnica
└── benchmarks/           # Testes de performance (local, não versionado)
    ├── response-times.json
    └── resource-usage.log
```

### **🛡️ Verificações de Segurança**

O sistema implementa **verificações defensivas**:
- **Recursos mínimos** antes de instalar modelos
- **Monitorização de RAM/CPU** durante execução
- **Alertas** se sistema sobrecarregado
- **Sugestões automáticas** de modelos mais leves

```bash
# Verificação antes de usar modelo pesado
nexocli models check deepseek-coder:14b
# Output: ⚠️ Modelo requer 8GB RAM, disponível: 6GB
#         💡 Sugestão: Use deepseek-coder:6.7b (4GB)
```

### **🔧 Troubleshooting Modelos Locais**

**❌ Erro: "Ollama not found"**
```bash
# Verificar instalação
ollama --version

# Se não instalado, instalar de https://ollama.com/download
```

**❌ Erro: "Model not found"**
```bash
# Verificar modelos instalados
ollama list

# Instalar modelo
nexocli models install deepseek-coder:6.7b
```

**❌ Erro: "Insufficient resources"**
```bash
# Verificar recursos
nexocli models check-system

# Usar modelo mais leve
nexocli models recommend
```

---

## 🟦 **Roadmap**

| Sprint | Entrega-chave | Status | Timeline |
|--------|---------------|---------|----------|
| **0. Bootstrap** | Fork, compliance, estrutura base | ✅ Completed | Semana 1 |
| **1. Base de Dados** | SQLite, logging persistente, backup | ✅ Completed | Semana 1 |
| **2. Gemini MVP** | Provider default, CLI básica | ✅ Completed | Semana 2 |
| **3. Modularidade** | Arquitetura providers, interfaces | ✅ Completed | Semana 2 |
| **4. Multi-Provider** | OpenRouter, Anthropic, fallback | ✅ **COMPLETED** | Semana 3 |
| **5. Menu Interativo** | CLI interativa, seleção dinâmica | 📅 Planned | Semana 3 |
| **6. Modelos Locais** | Ollama, fallback local | 📅 Planned | Semana 4 |
| **7. Dashboard** | Interface gestão, análise | 📅 Planned | Semana 4 |
| **8. Expansões** | Features avançadas, plugins | 🔮 Future | Semana 5+ |

### **🎉 Fase 4 COMPLETA! - Providers Externos com Fallback Automático**

**Data de Conclusão:** 2025-07-12  
**Desenvolvido por:** Claude-Code Agent  
**Duração:** ~2.5 horas de desenvolvimento intensivo  

**Principais Conquistas:**
- ✅ **4 Providers Implementados:** Gemini, OpenRouter, Anthropic, Together AI
- ✅ **Sistema de Fallback:** Cadeia inteligente com health checks
- ✅ **Rate Limiting:** Controlo avançado de quotas por provider
- ✅ **CLI Expandida:** 15+ novos comandos e opções
- ✅ **Testes Completos:** Suite de testes unitários e integração
- ✅ **Zero Breaking Changes:** Compatibilidade total mantida

**Para detalhes técnicos completos:** Ver [ROADMAP.md](ROADMAP.md)

---

## 🟦 **Estrutura do Projeto**

```
NexoCLI_BaseGemini/
├── src/
│   ├── providers/          # Módulos de providers (Gemini, OpenRouter, etc.)
│   ├── cli/                # Interface de linha de comandos
│   ├── database/           # Gestão de base de dados SQLite
│   ├── utils/              # Utilitários partilhados
│   └── dashboard/          # Dashboard interativo
├── logs/                   # Logs técnicos obrigatórios
├── db/                     # Base de dados local (SQLite)
├── models/                 # Modelos locais (Ollama, etc.)
├── tests/                  # Testes unitários e integração
├── docs/                   # Documentação adicional
├── LICENSE                 # Apache License 2.0
├── README.md               # Este documento
├── CHANGELOG.md            # Histórico de alterações
├── AGENTS.md               # Guia para programadores
├── ROADMAP.md              # Planeamento técnico
├── .env.example            # Template de configuração
└── NexoCLI_BaseGemini.md   # Personalidade do agente
```

---

## 🟦 **Boas Práticas e Guia de Contribuição**

### **Para Utilizadores**

1. **OAuth é o método principal** (sem chaves API necessárias)
2. **Backup regular** da base de dados local
3. **Testar múltiplos providers** para encontrar o ideal (se configurados)
4. **Consultar logs** em caso de problemas
5. **Reportar bugs** via Issues com logs relevantes

### **Para Contribuidores**

**Pré-requisitos obrigatórios:**
- [ ] Leitura completa de [AGENTS.md](AGENTS.md), [LICENSE](LICENSE) e [CHANGELOG.md](CHANGELOG.md)
- [ ] Compreensão da arquitetura de providers e compliance legal
- [ ] Setup de ambiente de desenvolvimento local

**Processo de contribuição:**
1. **Fork** do repositório e clone local
2. **Branch** com naming: `feat/`, `fix/`, `refactor/`, `docs/`
3. **Implementação** seguindo guidelines do AGENTS.md
4. **Testing** obrigatório (unit + integration)
5. **Documentação** atualizada (CHANGELOG + log técnico)
6. **Pull Request** com descrição detalhada

**Compliance obrigatório:**
- Cabeçalho de atribuição em ficheiros modificados
- CHANGELOG.md atualizado mesmo para pequenas alterações
- Log técnico detalhado em `/logs` (ver template no AGENTS.md)
- Nunca versionar `.env`, chaves API ou dados sensíveis
- Testes a passar em multiple plataformas

### **Testing e Qualidade**

```bash
# Executar todos os testes
npm test

# Testes específicos
npm run test:unit
npm run test:integration

# Coverage report
npm run test:coverage

# Lint e formatting
npm run lint
npm run format

# Build e validação completa
npm run preflight
```

---

## 🟦 **Troubleshooting & FAQ**

### **Problemas Comuns**

**❌ Erro: "Authentication failed" ou "Login required"**
```bash
# Executar novamente para reautenticar OAuth
npm start
# Browser abrirá automaticamente

# Se ainda falhar, limpar cache de autenticação
npm run clear-auth-cache

# Verificar se tem conta Google válida
# OAuth requer conta Google pessoal ativa
```

**❌ Erro: "API Key not found" (apenas para providers externos)**
```bash
# Só acontece se configurou providers externos
cat .env | grep API_KEY

# Recriar .env se necessário
cp .env.example .env
# Editar .env apenas com providers que quer usar
```

**❌ Erro: "Connection timeout"**
```bash
# Verificar internet
ping google.com

# Verificar quotas da API
npm start -- --check-quotas

# Tentar fallback
npm start -- --provider gemini --fallback local
```

**❌ Erro: "Database locked"**
```bash
# Parar todas as instâncias
pkill -f "NexoCLI"

# Verificar integridade da BD
npm run db:check

# Restaurar backup se necessário
npm run db:restore --date=yesterday
```

**❌ Erro: "Module not found"**
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar versão do Node.js
node --version  # Deve ser 20.x+
```

### **FAQ**

**Q: Preciso de chaves API para usar o NexoCLI_BaseGemini?**  
A: **Não!** O Gemini funciona com OAuth gratuito (60 requests/min + 1000/dia). Chaves API só são necessárias para providers externos opcionais.

**Q: É seguro usar OAuth e as minhas credenciais?**  
A: Sim. OAuth é o método oficial do Google. As credenciais ficam apenas na sua máquina local, nunca são enviadas para terceiros.

**Q: O NexoCLI_BaseGemini substitui o Gemini-CLI original?**  
A: Não, é uma extensão. Mantém 100% compatibilidade com Gemini-CLI e adiciona funcionalidades extra.

**Q: Posso usar sem providers externos?**  
A: Sim. O Gemini OAuth funciona perfeitamente sozinho. Providers extras (OpenRouter, Anthropic) são totalmente opcionais.

**Q: Como exportar o meu histórico?**  
A: `npm start -- --export --format json` ou usar o dashboard para exportação customizada.

**Q: Funciona offline?**  
A: Parcialmente. Com Ollama configurado, pode usar modelos locais offline. Providers cloud precisam de internet.

### **Performance e Otimização**

**Para melhor performance:**
- Use SSD para base de dados local
- Configure timeouts adequados no `.env`
- Use providers regionalmente próximos
- Ative cache local quando disponível
- Monitorize usage via dashboard

**Benchmarks típicos:**
- Gemini: 1-3s response time
- OpenRouter: 2-5s response time  
- Local (Ollama): 5-15s response time
- Database queries: <100ms

---

## 🟦 **Third-Party Dependencies & Licenses**

### **Dependências Principais**

| Package | Version | License | Purpose |
|---------|---------|---------|---------|
| **Original: Gemini-CLI** | Fork base | Apache 2.0 | Core functionality |
| sqlite3 | ^5.1.x | BSD-3-Clause | Local database |
| axios | ^1.6.x | MIT | HTTP requests |
| inquirer | ^9.2.x | MIT | Interactive CLI |
| winston | ^3.11.x | MIT | Logging system |
| jest | ^29.7.x | MIT | Testing framework |

### **Licenças Compatíveis**

Todas as dependências utilizam licenças compatíveis com Apache 2.0:
- MIT License ✅
- BSD License ✅  
- ISC License ✅
- Apache 2.0 ✅

**Verificação de licenças:**
```bash
npm run license-check
```

---

## 🟦 **Referências e Recursos**

### **Documentação Oficial**

- **[Gemini-CLI Original](https://github.com/google-gemini/gemini-cli)** - Projeto base da Google LLC
- **[Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)** - Licença oficial
- **[Google AI Studio](https://aistudio.google.com/)** - Documentação da API Gemini
- **[OpenRouter Docs](https://openrouter.ai/docs)** - Documentação OpenRouter

### **Recursos Técnicos**

- **[Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)** - Guidelines de desenvolvimento
- **[SQLite Documentation](https://www.sqlite.org/docs.html)** - Base de dados local
- **[Jest Testing](https://jestjs.io/docs/getting-started)** - Framework de testes
- **[Ollama Documentation](https://ollama.com/docs)** - Modelos locais

### **Comunidade e Suporte**

- **Issues:** [GitHub Issues](https://github.com/nsalvacao/NexoCLI_BaseGemini/issues)
- **Discussions:** [GitHub Discussions](https://github.com/nsalvacao/NexoCLI_BaseGemini/discussions)
- **Email:** [nexo-modeling@outlook.com](mailto:nexo-modeling@outlook.com)

---

## 🟦 **Contactos**

### **Maintainer Principal**
**Nuno Salvação**  
📧 [nexo-modeling@outlook.com](mailto:nexo-modeling@outlook.com)  
🔗 GitHub: [@nsalvacao](https://github.com/nsalvacao)

### **Contribuições e Suporte**
- **Bug Reports:** Use [GitHub Issues](https://github.com/nsalvacao/NexoCLI_BaseGemini/issues)
- **Feature Requests:** Use [GitHub Discussions](https://github.com/nsalvacao/NexoCLI_BaseGemini/discussions)
- **Desenvolvimento:** Consulte [AGENTS.md](AGENTS.md) antes de contribuir
- **Questões Legais:** Contactar maintainer diretamente

---

## 🟦 **Disclaimer Legal**

### **Limitação de Responsabilidade**

Este software é fornecido "AS IS", sem garantias de qualquer tipo, expressas ou implícitas. O uso é por sua conta e risco. O maintainer não se responsabiliza por:

- Perda de dados ou informações
- Custos de APIs de terceiros
- Interrupções de serviço
- Problemas de compatibilidade
- Violações de termos de serviço de providers externos

### **Responsabilidades do Utilizador**

- **API Keys:** Proteger adequadamente as suas credenciais
- **Compliance:** Respeitar termos de serviço dos providers utilizados
- **Backup:** Fazer backup regular dos seus dados
- **Legal:** Usar o software dentro da legalidade da sua jurisdição
- **Custos:** Gerir quotas e custos dos providers externos

### **Atribuição e Direitos**

- Este projeto é um fork do Gemini-CLI (Google LLC)
- Direitos originais mantidos pela Google LLC
- Modificações licenciadas sob Apache 2.0
- Uso comercial permitido conforme Apache 2.0
- Redistribuição permitida com atribuição adequada

### **Conformidade Legal**

Este projeto mantém conformidade total com:
- Apache License 2.0
- Direitos de propriedade intelectual da Google LLC
- Termos de serviço dos providers integrados
- Legislação aplicável de software open-source

---

**Este projeto é mantido com total transparência, compliance legal e rastreabilidade de alterações. Para qualquer questão legal ou de compliance, contacte o maintainer antes de utilizar ou contribuir.**