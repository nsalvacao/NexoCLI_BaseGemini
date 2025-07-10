```
titulo: "AGENTS.md"
versao: "v1.1"
data\_criacao: 2025-07-10
ultima\_atualizacao: 2025-07-10
node: \["ModelingNode"]
proposito: \["Guia de agentes", "Compliance de licenciamento e desenvolvimento", "Histórico e governança técnica"]
origem: \["Nuno Salvação", "Fork gemini-cli da Google LLC"]
reutilizavel: true
status: "ativo"
dependencias: \["LICENSE", "README.md", "CHANGELOG.md"]
tags: \["@compliance", "@agentes", "@logging", "@licenciamento"];
```

# AGENTS.md — Guia Oficial para Agentes e Colaboradores

## 1. Visão Geral do Projeto

**NexoCLI\_BaseGemini** é um fork avançado do projeto open-source Gemini-CLI (Google LLC), licenciado sob Apache License 2.0. Este documento define as regras de compliance, desenvolvimento, atribuição e documentação obrigatória para todos os agentes (humanos ou IA) que contribuam para este repositório.



## 2. Regras Obrigatórias de Compliance e Licenciamento

### 2.1. Atribuição Legal e Notas de Modificação

* **Todos os ficheiros modificados, criados ou adaptados devem incluir, obrigatoriamente, no início:**

  ```js
  // Modificado por Nuno Salvação, 2025
  // Baseado em código de gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
  ```
* **Nunca remover avisos de copyright, licenciamento, nem ficheiros NOTICE do original.**
* **Atribuir sempre autoria e data em novos ficheiros ou módulos substanciais.**

### 2.2. README.md — Licenciamento e Histórico

* Deve conter secção explícita sobre origem, adaptação e licenciamento:

  * Indicar claramente que se trata de um fork do Gemini-CLI (Google LLC), Apache 2.0.
  * Incluir referência ao LICENSE.
  * Detalhar diferenças face ao original.
  * Indicar contacto/responsável pelas alterações.

### 2.3. LICENSE — Manutenção e Transparência

* O ficheiro LICENSE deve conter:

  * Corpo integral da Apache License 2.0.
  * Cabeçalho adicional: projeto derivado, autorias, anos.
  * Não modificar ou omitir textos obrigatórios.

### 2.4. CHANGELOG.md — Documentação Histórica

* **Todas as alterações devem ser obrigatoriamente registadas com data, autor e breve descrição.**
* O resumo de alterações é obrigatório, mesmo para mudanças mínimas.
* O changelog deve seguir ordem cronológica inversa e estar permanentemente atualizado.

### 2.5. Logging Técnico de Alterações e Desenvolvimento

* **Cada alteração relevante (desenvolvimento, bugfix, refatoração, feature, etc.) deve ser documentada num ficheiro markdown autónomo.**
* **Padrão de nome do ficheiro:**

  ```
  log_{tipo}_{nome_do_agente}_{YYYYMMDD-HHMMSS}.md
  ```

  * Ex: `log_desenvolvimento_nuno_20250710-154210.md`
* **Conteúdo mínimo do log:**

  * Descrição técnica detalhada
  * Motivação e contexto
  * Lista de ficheiros/funcionalidades afetadas
  * Impacto e/ou recomendações
  * (Opcional) Exemplo de código, screenshot, stack trace
* Os logs devem estar centralizados numa pasta `/logs` ou equivalente, nunca dispersos.
* Não é permitido apagar ou sobrescrever logs antigos.

---

## 3. Diretrizes de Desenvolvimento

### 3.1. Estrutura e Organização do Projeto

```
NexoCLI_BaseGemini/
├── src/
│   ├── modules/
│   ├── utils/
│   └── ...
├── logs/
├── docs/
├── tests/
├── LICENSE
├── README.md
├── CHANGELOG.md
├── AGENTS.md
├── .gitignore
└── ...
```

* **Nunca incluir informação sensível** (tokens, passwords, API keys, dados pessoais) em ficheiros de código, logs, docs ou histórico.
* **Respeitar o `.gitignore` do projeto:**

  * Pastas de referência local, dumps, bases de dados, ficheiros temporários ou de configuração personalizada nunca devem ser versionados.

### 3.2. Naming, Code Style e Commits

* Usar convenções de nomeação consistentes.
* Todas as alterações devem ter commits descritivos e estruturados:

  * `feat: ...` (nova feature)
  * `fix: ...` (correção)
  * `refactor: ...` (refatoração)
  * `docs: ...` (documentação)
* Todos os commits relevantes devem estar refletidos no CHANGELOG.md.

### 3.3. Documentação e Onboarding

* Todas as features, integrações, workflows ou alterações críticas devem ser documentadas na docs/.
* O AGENTS.md é obrigatório para onboarding de novos agentes/colaboradores.
* Sempre que um novo agente for onboarded:

  * Deve ler LICENSE, README.md, CHANGELOG.md e AGENTS.md.
  * Deve compreender o workflow de logging e compliance descrito neste documento.

---

## 4. Testing, Quality & Security

### 4.1. Testes

* Usar framework de testes adequado (ex: Jest para Node.js/TypeScript).
* Garantir cobertura mínima definida no projeto.
* Testes unitários, integração e, se aplicável, E2E.

### 4.2. Segurança

* Validar inputs, proteger contra injecção e vulnerabilidades conhecidas.
* Garantir que dependências estão atualizadas e livres de falhas críticas.

---

## 5. Monitorização, Performance e Manutenção

* Monitorizar logs para padrões de erro ou regressão.
* Otimizar código para performance quando necessário, documentando sempre.
* Manter a pasta /logs limpa mas completa — nunca eliminar logs antigos.

---

## 6. Referências e Recursos

* [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)
* [Gemini-CLI Original](https://github.com/google/gemini-cli)
* [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
* Outros recursos relevantes para segurança, logging e compliance.

---

**Nota Final:**
Este documento é de leitura obrigatória para qualquer pessoa (ou agente automatizado) que colabore neste projeto.
Não cumprir estas regras pode levar à exclusão do histórico ou rejeição de contribuições.
