---
titulo: "AGENTS.md"
versao: "v3.0"
data_criacao: 2025-07-10
ultima_atualizacao: 2025-07-11
node: ["ModelingNode"]
proposito: ["Guia de agentes", "Compliance de licenciamento e desenvolvimento", "Histórico e governança técnica", "Workflow estruturado"]
origem: ["Nuno Salvação", "Fork gemini-cli da Google LLC"]
reutilizavel: true
status: "ativo"
dependencias: ["LICENSE", "README.md", "CHANGELOG.md", "ROADMAP.md", "logs/", "db/", "NexoCLI_BaseGemini.md"]
tags: ["@compliance", "@agentes", "@logging", "@licenciamento", "@dashboard", "@menu_arranque", "@base_de_dados", "@workflow", "@templates"]
----------------------------------------------------------------------------------------------------------------------

# AGENTS.md — Guia Oficial para Agentes e Colaboradores

## 1. Visão Geral do Projeto

**NexoCLI_BaseGemini** é um fork avançado do projeto open-source Gemini-CLI (Google LLC), licenciado sob Apache License 2.0. O projeto evoluiu para integrar lógica de multi-provider, rotação e fallback inteligente, logging robusto, gravação em base de dados e menu interativo de arranque, mantendo sempre Gemini como provider default.

Este documento define as regras de compliance, desenvolvimento, atribuição e documentação obrigatória para todos os agentes (humanos ou IA) que contribuam para este repositório. **É de leitura obrigatória antes de qualquer contribuição.**

---

## 2. Regras Obrigatórias de Compliance e Licenciamento

### 2.1. Atribuição Legal e Notas de Modificação

**CRÍTICO:** Todos os ficheiros modificados, criados ou adaptados devem incluir, obrigatoriamente, no início:

```js
// Modificado por Nuno Salvação, 2025
// Baseado em código de gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
```

**Para novos ficheiros:**
```js
// Criado por [Nome do Agente], 2025
// Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)
```

### 2.2. Compliance Checklist Obrigatório

Antes de qualquer commit, verificar:
- [ ] Cabeçalho de atribuição presente em ficheiros modificados
- [ ] Nenhuma chave API, token ou informação sensível incluída
- [ ] `.env` não commitado (verificar `.gitignore`)
- [ ] CHANGELOG.md atualizado com entry da alteração
- [ ] Log técnico criado (ver secção 2.5)
- [ ] Testes implementados ou validados
- [ ] Documentação relevante atualizada

### 2.3. README.md — Licenciamento e Histórico

- Deve conter secção explícita sobre origem, adaptação e licenciamento
- Indicar claramente que se trata de um fork do Gemini-CLI (Google LLC), Apache 2.0
- Incluir referência ao LICENSE e link para repositório original
- Detalhar diferenças face ao original
- Indicar contacto/responsável pelas alterações

### 2.4. LICENSE — Manutenção e Transparência

O ficheiro LICENSE deve conter:
- Corpo integral da Apache License 2.0
- Cabeçalho adicional: projeto derivado, autorias, anos
- **Nunca modificar ou omitir textos obrigatórios da licença original**

### 2.5. CHANGELOG.md — Documentação Histórica

**Todas as alterações devem ser obrigatoriamente registadas** com data, autor e breve descrição:

```markdown
## [1.1.0] - 2025-07-11
### Added (Compliance)
- [PROVIDER] Integração OpenRouter com fallback automático
- [BD] Nova tabela provider_logs para rastreabilidade

### Changed
- [MENU] Interface de seleção melhorada com validação

### Fixed
- [GEMINI] Correção timeout em modelos grandes

### Security
- [ENV] Validação adicional de API keys
```

### 2.6. Logging Técnico de Alterações e Desenvolvimento

**Cada alteração relevante** (desenvolvimento, bugfix, refatoração, feature, etc.) deve ser documentada num ficheiro markdown autónomo:

**Padrão de nome:**
```
log_{tipo}_{nome_do_agente}_{YYYYMMDD-HHMMSS}.md
```

**Exemplos:**
- `log_desenvolvimento_nuno_20250710-154210.md`
- `log_bugfix_claude_20250711-092130.md`
- `log_feature_programador_20250712-161545.md`

**Template obrigatório:**
```markdown
# Log de Desenvolvimento - [TIPO] - [AGENTE] - [DATA]

## Contexto
- **Feature/Bug:** [Descrição detalhada]
- **Provider Afetado:** [Gemini/OpenRouter/Local/etc.]
- **Impacto:** [Critical/High/Medium/Low]
- **Ticket/Issue:** [Se aplicável]

## Alterações Técnicas
- **Ficheiros Modificados:** 
  - `src/providers/gemini.js` - linha 45-67 (função authenticateProvider)
  - `src/cli/menu.js` - nova função selectProvider()
- **Dependências Adicionadas:** [listagem com versões]
- **Configuração:** [alterações em .env.example, configs, etc.]

## Testes Realizados
- [ ] Unit tests passing
- [ ] Integration tests passing  
- [ ] Manual testing scenarios
- [ ] Performance testing (se aplicável)
- [ ] Security validation (se aplicável)

## Base de Dados
- **Schema Changes:** [DDL statements se aplicável]
- **Data Migration:** [scripts ou processo]
- **Backup Required:** [Sim/Não e justificação]

## Next Steps / Recomendações
- [Ações futuras necessárias]
- [Melhorias sugeridas]
- [Pontos de atenção para próximas fases]

## Rollback Plan
- [Como reverter alterações se necessário]
- [Ficheiros de backup necessários]
```

**Armazenamento:** Centralizado em `/logs` e **obrigatoriamente gravado na base de dados** para rastreabilidade.

---

## 3. Workflow de Desenvolvimento Estruturado

### 3.1. Processo Obrigatório de Desenvolvimento

**1. Planeamento**
- Consultar ROADMAP.md para verificar dependências
- Identificar impacto no provider default (Gemini)
- Validar compliance e atribuição necessárias

**2. Implementação**
- Criar branch com naming: `feat/`, `fix/`, `refactor/`, `docs/`
- Implementar alterações seguindo arquitetura modular
- Manter Gemini como provider default funcional
- Garantir que logging é implementado

**3. Testing**
- Unit tests obrigatórios para nova funcionalidade
- Integration tests para providers
- Manual testing em ambiente local
- Performance validation se crítico

**4. Documentação**
- Atualizar CHANGELOG.md
- Criar log técnico detalhado
- Atualizar documentação relevante
- Verificar compliance checklist

**5. Review e Merge**
- Code review (ver checklist 3.2)
- Validação de testes automáticos
- Verificação final de compliance
- Merge apenas após aprovação completa

### 3.2. Code Review Checklist

**Compliance Obrigatório**
- [ ] Cabeçalho de atribuição presente
- [ ] CHANGELOG.md atualizado
- [ ] Log técnico criado e detalhado
- [ ] Testes implementados e a passar
- [ ] `.env` não commitado, `.env.example` atualizado se necessário
- [ ] Documentação atualizada (README, AGENTS, ou docs/)

**Arquitetura e Qualidade**
- [ ] Provider agnóstico mantido (interfaces padronizadas)
- [ ] Gemini default preservado e funcional
- [ ] Modularidade respeitada (`/src/providers`, `/src/cli`, etc.)
- [ ] Base de dados corretamente utilizada para logging
- [ ] Tratamento de erros implementado
- [ ] Validação de inputs presente
- [ ] Performance aceitável (sem regressões)

**Segurança**
- [ ] Nenhuma informação sensível em código
- [ ] Validação adequada de API keys
- [ ] Tratamento seguro de dados do utilizador
- [ ] Sanitização de inputs externos

---

## 4. Estrutura e Organização do Projeto

### 4.1. Árvore de Diretórios Obrigatória

```
NexoCLI_BaseGemini/
├── src/
│   ├── providers/           # Módulos de providers (Gemini, OpenRouter, etc.)
│   │   ├── gemini.js       # Provider default (obrigatório)
│   │   ├── openrouter.js   # Provider OpenRouter
│   │   ├── local.js        # Provider modelos locais
│   │   └── base.js         # Interface base para providers
│   ├── cli/                # Interface de linha de comandos
│   │   ├── menu.js         # Menu interativo de arranque
│   │   ├── commands.js     # Comandos disponíveis
│   │   └── validation.js   # Validação de inputs
│   ├── database/           # Gestão de base de dados
│   │   ├── schema.sql      # Schema da BD
│   │   ├── migrations/     # Scripts de migração
│   │   └── connection.js   # Conexão e queries
│   ├── utils/              # Utilitários partilhados
│   │   ├── logger.js       # Sistema de logging
│   │   ├── config.js       # Gestão de configuração
│   │   └── security.js     # Validações de segurança
│   └── dashboard/          # Dashboard interativo (futuro)
├── logs/                   # Logs técnicos (obrigatório)
├── db/                     # Base de dados local (obrigatório)
├── models/                 # Modelos locais (Ollama, etc.)
├── tests/                  # Testes unitários e integração
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── docs/                   # Documentação adicional
├── LICENSE                 # Licença Apache 2.0 (obrigatório)
├── README.md               # Documento principal (obrigatório)
├── CHANGELOG.md            # Histórico de alterações (obrigatório)
├── AGENTS.md               # Este documento (obrigatório)
├── ROADMAP.md              # Planeamento técnico (obrigatório)
├── .gitignore              # Exclusões de versionamento
├── .env.example            # Template de configuração
└── NexoCLI_BaseGemini.md   # Personalidade do agente
```

### 4.2. Base de Dados Local — Schema Obrigatório

**Tabelas mínimas requeridas:**
```sql
-- Logs técnicos de desenvolvimento
CREATE TABLE development_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    agent_name VARCHAR(100),
    log_type VARCHAR(50), -- 'desenvolvimento', 'bugfix', 'feature'
    file_path TEXT,
    description TEXT,
    impact_level VARCHAR(20) -- 'Critical', 'High', 'Medium', 'Low'
);

-- Histórico de chats/interações
CREATE TABLE chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    provider VARCHAR(50),
    user_input TEXT,
    agent_response TEXT,
    session_id VARCHAR(100)
);

-- Configurações e estado do sistema
CREATE TABLE system_config (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Monitorização de providers
CREATE TABLE provider_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    provider VARCHAR(50),
    status VARCHAR(20), -- 'success', 'error', 'timeout'
    response_time_ms INTEGER,
    error_message TEXT
);
```

### 4.3. Menu Interativo de Arranque — Especificações

O menu deve permitir:
- **Seleção de Provider:** Gemini (default), OpenRouter, Local, outros do `.env`
- **Configuração de Logging:** Ativar/desativar, destino (ficheiro/BD/ambos)
- **Opções de Histórico:** Gravar chats, exportar sessões anteriores
- **Configuração Runtime:** Alterar provider sem restart (se implementado)
- **Help/Documentação:** Acesso rápido a comandos disponíveis

**A lógica deve ser agnóstica e facilmente extensível** para novos providers.

---

## 5. Testing, Quality & Security

### 5.1. Framework e Estrutura de Testes

**Framework principal:** Jest (extensível para Vitest)

**Estrutura obrigatória:**
```
tests/
├── unit/
│   ├── providers/          # Testes isolados por provider
│   ├── cli/               # Testes de interface CLI
│   └── utils/             # Testes de utilitários
├── integration/
│   ├── provider-flow/     # Testes end-to-end por provider
│   ├── database/          # Testes de BD e persistência
│   └── menu-interaction/  # Testes do menu interativo
└── fixtures/              # Dados de teste e mocks
```

**Cobertura mínima:** 80% para código novo, 70% para código adaptado

### 5.2. Validações de Segurança Obrigatórias

**Input Validation:**
- Sanitização de todas as entradas do utilizador
- Validação de formato de API keys
- Proteção contra injection (SQL, command, etc.)

**Gestão de Credenciais:**
- Nunca incluir chaves reais em código ou logs
- Validação de existência de `.env` antes de execução
- Encriptação de dados sensíveis na BD local

**Auditoria:**
- Todos os acessos a providers registados na BD
- Logs de alterações de configuração
- Monitorização de tentativas de acesso inválidas

---

## 6. Dashboard e Monitorização

### 6.1. Funcionalidades Mínimas do Dashboard

**Visualização:**
- Histórico de chats filtrado por data, provider, sessão
- Logs técnicos com pesquisa e filtros
- Métricas de performance por provider
- Estado atual do sistema e configurações

**Gestão:**
- Exportação de dados (JSON, CSV, markdown)
- Configuração de providers em runtime
- Gestão de logs (archive, cleanup, backup)
- Help/documentação integrada

**Monitorização:**
- Consumo de recursos (API calls, quotas)
- Alertas de falhas ou degradação
- Performance benchmarks por provider

### 6.2. Acesso à Base de Dados

**Queries padronizadas:**
- Logs por agente e período
- Performance média por provider
- Sessões de chat por utilizador
- Alertas de sistema e erros

**Exportação e Backup:**
- Backup automático semanal da BD
- Exportação selectiva por filtros
- Migração de dados entre versões

---

## 7. Incident Response e Manutenção

### 7.1. Procedimentos de Emergência

**Falha Crítica do Provider Default (Gemini):**
1. Ativar fallback automático se configurado
2. Registar incident log na BD
3. Notificar maintainer se configurado
4. Documentar problema e solução em `/logs`

**Corrupção de Base de Dados:**
1. Parar sistema imediatamente
2. Restaurar último backup válido
3. Investigar causa raiz
4. Implementar medidas preventivas

**Exposição de Credenciais:**
1. Revogar imediatamente chaves comprometidas
2. Atualizar `.env` com novas credenciais
3. Audit logs para identificar exposição
4. Documentar incident e prevenção

### 7.2. Backup e Recovery

**Backup Automático:**
- BD local: backup diário incremental
- Logs críticos: backup semanal completo
- Configurações: backup antes de alterações

**Recovery Testing:**
- Testar restore mensalmente
- Validar integridade de dados
- Documentar procedimentos de recovery

---

## 8. Templates e Recursos

### 8.1. Template de Feature Branch

```bash
# Criar branch para nova feature
git checkout -b feat/provider-anthropic

# Após implementação
git add .
git commit -m "feat: adicionar provider Anthropic com fallback automático

- Integração com API Anthropic via .env
- Fallback para Gemini em caso de falha  
- Testes unitários e integração implementados
- Log técnico: log_feature_agente_20250711-143022.md"
```

### 8.2. Template de Issue/Bug Report

```markdown
## Bug Report

**Ambiente:**
- OS: [Windows/macOS/Linux]
- Node.js: [versão]
- NexoCLI_BaseGemini: [versão]

**Provider em uso:** [Gemini/OpenRouter/Local]

**Descrição:**
[Descrição clara do problema]

**Passos para reproduzir:**
1. [Passo 1]
2. [Passo 2] 
3. [Resultado obtido vs esperado]

**Logs relevantes:**
```
[Cole logs do sistema ou BD se relevantes]
```

**Impacto:** [Critical/High/Medium/Low]
```

### 8.3. Recursos de Referência

- **Apache License 2.0:** http://www.apache.org/licenses/LICENSE-2.0
- **Gemini-CLI Original:** https://github.com/google-gemini/gemini-cli
- **Node.js Best Practices:** https://github.com/goldbergyoni/nodebestpractices
- **Jest Testing Framework:** https://jestjs.io/docs/getting-started
- **SQLite Documentation:** https://www.sqlite.org/docs.html

---

## 9. Contactos e Suporte

**Maintainer Principal:** [Nuno Salvação](mailto:nexo-modeling@outlook.com)

**Para Agentes IA:** Seguir rigorosamente este documento. Em caso de dúvida sobre compliance ou arquitetura, referir às secções relevantes antes de proceder.

**Para Contribuidores Humanos:** Ler integralmente este documento, LICENSE, README.md e ROADMAP.md antes da primeira contribuição.

---

**Nota Final de Compliance:**
Este documento é **obrigatório** para qualquer pessoa ou agente automatizado que colabore neste projeto. O não cumprimento destas regras pode levar à rejeição de contribuições ou exclusão do histórico do projeto. A conformidade legal com a Apache License 2.0 e a atribuição ao Gemini-CLI (Google LLC) são inegociáveis.