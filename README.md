# NexoCLI\_BaseGemini

[![Forked from Gemini-CLI by Google LLC](https://img.shields.io/badge/Forked%20from-Gemini--CLI%20by%20Google%20LLC-blue?logo=github)](https://github.com/google-gemini/gemini-cli)
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-green.svg)](LICENSE)

---

> **NexoCLI\_BaseGemini** é um fork avançado e extensível do [Gemini-CLI](https://github.com/google-gemini/gemini-cli) da Google LLC, adaptado e melhorado para suporte multi-provider (Gemini, OpenRouter, Ollama/local), rotação e fallback automático, e documentação de personalidade/instruções estáticas do agente.
> Projeto mantido por [Nuno Salvação](mailto:nexo-modeling@outlook.com) | Licenciado sob Apache License 2.0.

---

## 🟦 **Resumo do Projeto**

O NexoCLI\_BaseGemini visa:

* Permitir rotação inteligente entre múltiplos LLM providers (Gemini API, OpenRouter, modelos locais via Ollama).
* Documentar e versionar a personalidade/instruções do agente em ficheiro estático (ex: `settings.json`, `NexoCLI_BaseGemini.md`).
* Oferecer fallback local para uso offline ou em cenários de quota atingida.
* Rastrear e documentar todas as alterações e decisões arquiteturais para garantir onboarding rápido e auditoria.

> **Nota:** Este repositório inclui e modifica código original da Google LLC (Gemini-CLI), com atribuição explícita e histórico completo de alterações no CHANGELOG.md.

---

## 🟦 **Licenciamento & Origem**

* **Baseado em:** [Gemini-CLI](https://github.com/google-gemini/gemini-cli) — Google LLC, Apache 2.0
* **Modificações, integração e manutenção:**
  [Nuno Salvação](mailto:nexo-modeling@outlook.com)
* **Licença:** [Apache License 2.0](LICENSE)
* **Atribuição obrigatória:** Todos os ficheiros modificados incluem no início:

  ```js
  // Modificado por Nuno Salvação, 2025
  // Baseado em código de gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
  ```
* **Histórico detalhado:** Consulte [CHANGELOG.md](CHANGELOG.md) para todas as alterações e melhorias.

---

## 🟦 **Principais Diferenças e Melhorias face ao original**

* Integração nativa com múltiplos providers gratuitos (Gemini, OpenRouter, etc.) e fallback local (Ollama).
* Personalidade e instruções do agente centralizadas em ficheiro estático (`settings.json`, `NexoCLI_BaseGemini.md`, etc.) para facilitar auditoria e versionamento.
* Logging técnico estruturado (`/logs`), registo de todas as intervenções em markdown (ver AGENTS.md).
* HUD/Rainmeter e websocket para visualização em tempo real de métricas e estados (planeado).
* Boas práticas de compliance, onboarding e documentação obrigatória para todos os agentes.

---

## 🟦 **Roadmap**

| Sprint                | Entrega-chave                                        | Status        |
| --------------------- | ---------------------------------------------------- | ------------- |
| 0. Bootstrap          | Fork, rename, setup ESLint/Prettier, base structure  | ✅ Completed   |
| 1. MVP Providers      | OpenRouter, LocalProvider, CLI básico, Jest          | ⏳ In Progress |
| 2. Personality Static | Definição e documentação da personalidade/instruções | ⏳ Planned     |
| 3. Rotação & Failover | Algoritmo de quotas/pesos, retry exponential         | 🔲 Planned    |
| 4. Shadow-Eval        | Shadow eval, telemetria e métricas de latência       | 🔲 Planned    |
| 5. HUD Integration    | WS server, integração Rainmeter/mini-dashboard       | 🔲 Planned    |
| 6. MCP Layer          | MCPProvider, server multi-agent                      | 🔲 Planned    |

---

## 🟦 **Quickstart / Instalação**

### **Pré-requisitos**

* [Node.js 20+](https://nodejs.org/en/download)
* [Ollama](https://ollama.com/) para modelos locais (opcional)
* Clonar este repositório localmente

### **Instalação e Setup**

```bash
# 1. Clonar o repositório
git clone https://github.com/nsalvacao/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente (ver exemplo em .env.example)
cp .env.example .env
# Adicionar chaves API (Gemini, OpenRouter, etc.)
```

### **Primeira Execução**

```bash
npm run start
# ou para desenvolvimento:
npm run dev
```

---

## 🟦 **Configuração: Providers e Personalidade do Agente**

* **API Keys**:

  * Gemini: `GEMINI_API_KEY`
  * OpenRouter: `OPENROUTER_API_KEY`
  * Outros: ver .env.example

* **Personalidade do agente**:

  * Todas as definições de instrução, parâmetros de comportamento e identidade do agente são centralizadas em ficheiro estático (ex: `settings.json` ou `NexoCLI_BaseGemini.md`).
  * Não há dependência de base de dados externa para metadados dos agentes neste projeto.
  * A gestão central de agentes, quotas ou tokens — caso exista — é feita **num projeto separado**, nunca versionado ou dependente deste repositório.

---

## 🟦 **Estrutura Recomendada do Projeto**

```
NexoCLI_BaseGemini/
├── src/
│   ├── providers/
│   ├── cli/
│   ├── utils/
│   └── ...
├── logs/
├── tests/
├── docs/
├── AGENTS.md
├── CHANGELOG.md
├── LICENSE
├── README.md
├── .gitignore
└── settings.json (ou NexoCLI_BaseGemini.md)
```

* Logs técnicos obrigatórios em `/logs` (um ficheiro markdown por intervenção).
* Ficheiros modificados com cabeçalho de atribuição.
* Documentação adicional em `/docs` ou `GEMINI.md` (ver normas originais).

---

## 🟦 **Boas Práticas e Guia de Contribuição**

* **Compliance obrigatório**: Leitura de [AGENTS.md](AGENTS.md), [LICENSE](LICENSE) e [CHANGELOG.md](CHANGELOG.md) antes de qualquer contribuição.
* **Cabeçalho obrigatório** em todos os ficheiros modificados (ver acima).
* **Resumo de alterações obrigatório** no CHANGELOG.md (mesmo para pequenas correções).
* **Cada alteração técnica relevante** deve gerar um log detalhado em `/logs` (ver AGENTS.md para naming).
* **Commits com mensagens claras**: `feat:`, `fix:`, `docs:`, `refactor:`, etc.
* **Nunca versionar ficheiros sensíveis, BDs, dumps, nem diretórios locais não especificados** (respeita o `.gitignore`).

---

## 🟦 **Testing e Qualidade**

* Framework principal: **Jest** (adaptação possível para Vitest, ver GEMINI.md para guidelines de testing originais)

* Cobertura de testes obrigatória para novos módulos/funcionalidades.

* Validar alterações com:

  ```bash
  npm run preflight
  ```

  (constrói, testa, valida tipagem, lint)

* Respeitar padrões e guidelines de estilo, modularidade e segurança (ver docs e GEMINI.md para detalhes técnicos e padrões originais).

---

## 🟦 **Referências e Recursos**

* [Gemini-CLI (Google LLC)](https://github.com/google-gemini/gemini-cli)
* [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)
* [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
* [GEMINI.md](GEMINI.md)
* [AGENTS.md](AGENTS.md)

---

## 🟦 **Contactos**

* **Autor & Maintainer:** [Nuno Salvação](mailto:nexo-modeling@outlook.com)

---

## 🟦 **Notas Finais de Compliance**

* Este projeto é mantido com total transparência, compliance legal e rastreabilidade de alterações.
* Consulte sempre AGENTS.md, CHANGELOG.md e LICENSE antes de contribuir.
* Em caso de dúvida, contacte o responsável antes de submeter código ou sugestões.

---
