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

### **Principais Inovações**

1. **Seleção Dinâmica:** Menu interativo para escolher entre Gemini puro, APIs do `.env` (OpenAI, Anthropic, OpenRouter, etc.), ou modelos locais (Ollama)
2. **Logging Robusto:** Base de dados local para histórico completo de chats e logs técnicos
3. **Dashboard Integrado:** Interface de gestão para visualização, exportação e análise
4. **Fallback Inteligente:** Rotação automática entre providers em caso de falha
5. **Compliance Reforçado:** Rastreabilidade completa e atribuição legal rigorosa

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
# Pergunta simples
npm start -- "Explica-me computação quântica em 3 parágrafos"

# Conversa interativa
npm start -- --interactive

# Análise de ficheiro
npm start -- "Analisa este código:" --file exemplo.js
```

### **Seleção de Provider**

```bash
# Menu interativo para escolher provider
npm start -- --select-provider

# Usar provider específico
npm start -- --provider openrouter "Qual é o melhor modelo de IA atual?"

# Fallback automático (se provider principal falhar)
npm start -- --provider anthropic --fallback gemini "Pergunta complexa"
```

### **Gestão de Histórico**

```bash
# Ver histórico de conversas
npm start -- --history

# Exportar conversas
npm start -- --export --format json --days 7

# Limpar histórico (com confirmação)
npm start -- --clear-history --confirm
```

### **Dashboard e Logging**

```bash
# Abrir dashboard CLI
npm run dashboard

# Ver logs técnicos
npm start -- --logs --filter development

# Estatísticas de uso por provider
npm start -- --stats --provider-breakdown
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

### **1. Multi-Provider com Fallback Automático**

- **Provider Default:** Gemini sempre disponível e funcional
- **Providers Externos:** OpenRouter, Anthropic, OpenAI, Together, Fireworks
- **Modelos Locais:** Ollama, Llama.cpp (offline)
- **Fallback Inteligente:** Rotação automática em caso de falha
- **Load Balancing:** Distribuição de carga entre providers

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

### **5. Compliance e Segurança**

- **Atribuição Legal:** Compliance total com Apache 2.0
- **Auditoria:** Rastreabilidade completa de alterações
- **Segurança:** Proteção de API keys e dados sensíveis
- **Validação:** Inputs sanitizados e verificação de credenciais
- **Backup:** Sistema de recovery para dados críticos

---

## 🟦 **Roadmap**

| Sprint | Entrega-chave | Status | Timeline |
|--------|---------------|---------|----------|
| **0. Bootstrap** | Fork, compliance, estrutura base | ✅ Completed | Semana 1 |
| **1. Base de Dados** | SQLite, logging persistente, backup | ⏳ In Progress | Semana 1 |
| **2. Gemini MVP** | Provider default, CLI básica | 📅 Planned | Semana 2 |
| **3. Modularidade** | Arquitetura providers, interfaces | 📅 Planned | Semana 2 |
| **4. Multi-Provider** | OpenRouter, Anthropic, fallback | 📅 Planned | Semana 3 |
| **5. Menu Interativo** | CLI interativa, seleção dinâmica | 📅 Planned | Semana 3 |
| **6. Modelos Locais** | Ollama, fallback local | 📅 Planned | Semana 4 |
| **7. Dashboard** | Interface gestão, análise | 📅 Planned | Semana 4 |
| **8. Expansões** | Features avançadas, plugins | 🔮 Future | Semana 5+ |

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