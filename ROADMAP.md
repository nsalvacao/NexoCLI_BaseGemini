---
titulo: "ROADMAP.md"
versao: "v2.0"
data_criacao: 2025-07-10
ultima_atualizacao: 2025-07-11
node: ["ModelingNode"]
proposito: ["Evolução do projeto", "Planeamento técnico", "Governança de desenvolvimento", "Sequência lógica corrigida"]
origem: ["Nuno Salvação", "NexoCLI_BaseGemini", "Fork gemini-cli da Google LLC"]
reutilizavel: true
status: "ativo"
dependencias: ["README.md", "AGENTS.md", "LICENSE", "CHANGELOG.md", "logs/", "db/", "NexoCLI_BaseGemini.md", "src/"]
tags: ["@roadmap", "@governanca", "@planeamento", "@compliance", "@dashboard", "@menu_arranque", "@multi-provider", "@logs", "@database", "@dependencias_logicas"]
-------------------------------------------------------------------------------------------------------------------------------------------

# ROADMAP.md — Planeamento Estratégico NexoCLI_BaseGemini

---

## 1. Princípios e Regras Core (Inegociáveis)

### 1.1. Compliance e Licenciamento

**Atribuição e licenciamento:**
- Sempre indicar origem no Gemini-CLI (Google LLC), licenciamento Apache 2.0
- Manter compliance absoluta com todas as obrigações legais
- **É proibido remover cabeçalhos de atribuição, ficheiros NOTICE ou alterar licenças** sem justificação explícita e aprovação do maintainer

**Documentação obrigatória:**
- Todos os commits relevantes documentados no CHANGELOG.md
- Log técnico obrigatório para alterações de desenvolvimento (ver AGENTS.md)
- Atribuição de autoria e data em todos os ficheiros modificados

### 1.2. Funcionalidades Core (Não Negociáveis)

**Provider e Arquitetura:**
- **Gemini Google como provider default e referência** (nunca pode ser removido)
- Modularidade nativa para rotação/seleção de providers externos (APIs diretas, OpenRouter, etc.)
- Arquitetura agnóstica que permite extensão sem reescrever o core

**Funcionalidades obrigatórias:**
- Suporte robusto a modelos locais (ex: Ollama) em pasta designada (`/models`)
- Menu inicial interativo obrigatório para seleção de provider, logging, histórico e configurações
- Base de dados local para logging técnico, histórico de chat e rastreabilidade
- Dashboard para gestão, consulta e exportação de logs e dados

**Rastreabilidade:**
- Todos os logs de desenvolvimento gravados em BD local
- Sistema de backup e recovery implementado
- Auditoria completa de alterações e interações

---

## 2. Sequência Técnica de Desenvolvimento (Dependências Corrigidas)

> **CRÍTICO:** A sequência foi corrigida para respeitar dependências lógicas. Cada fase só pode iniciar após a anterior estar completamente funcional.

### **Fase 0 — Bootstrap & Compliance**
**Duração estimada:** 1-2 dias  
**Dependências:** Nenhuma  

**Objetivos:**
- Fork do Gemini-CLI, setup inicial de compliance e atribuição
- Adaptação do repositório, diretórios e ficheiros obrigatórios (`LICENSE`, `README.md`, `AGENTS.md`)
- ESLint/Prettier configurados, .gitignore completo
- **Logging básico em ficheiros** implementado (`/logs`)

**Outputs obrigatórios:**
- Projeto funcional com compliance legal completo
- Estrutura de pastas definida e documentada
- Logging básico operacional (ficheiros)

**Critérios de conclusão:**
- [ ] Fork completo com atribuição correta
- [ ] LICENSE, README.md, AGENTS.md criados e validados
- [ ] .gitignore protege informação sensível
- [ ] Logging básico grava ficheiros em `/logs`
- [ ] Build e testes básicos a funcionar

**Exemplo de commit:**
```
feat: Bootstrap inicial com compliance e atribuição Google LLC

- Fork do Gemini-CLI com licenciamento Apache 2.0 mantido
- Documentação inicial (LICENSE, README, AGENTS) criada
- Estrutura de pastas definida (/src, /logs, /db, /tests)
- Logging básico implementado para desenvolvimento
- ESLint/Prettier configurados
```

---

### **Fase 1 — Base de Dados & Logging Core** 
**Duração estimada:** 2-3 dias  
**Dependências:** Fase 0 concluída  

**Objetivos:**
- **CRÍTICO:** Implementar BD local (SQLite) antes de qualquer funcionalidade que precise de persistência
- Schema inicial: logs técnicos, configurações, histórico básico
- Logging operacional integrado com BD (substituir logging básico de ficheiros)
- Sistema de backup e recovery básico

**Outputs obrigatórios:**
- Base de dados SQLite funcional com schema definido
- Sistema de logging persistente na BD
- Migrações básicas implementadas
- Backup automático configurado

**Schema mínimo requerido:**
```sql
-- Logs técnicos de desenvolvimento
CREATE TABLE development_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    agent_name VARCHAR(100),
    log_type VARCHAR(50),
    file_path TEXT,
    description TEXT,
    impact_level VARCHAR(20)
);

-- Configurações do sistema
CREATE TABLE system_config (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Histórico de interações (preparação para fases seguintes)
CREATE TABLE chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    provider VARCHAR(50),
    user_input TEXT,
    agent_response TEXT,
    session_id VARCHAR(100)
);
```

**Critérios de conclusão:**
- [ ] BD SQLite criada e acessível
- [ ] Schema completo implementado
- [ ] Logging técnico grava na BD
- [ ] Sistema de backup funcional
- [ ] Testes de persistência a passar

**Exemplo de commit:**
```
feat: Base de dados SQLite e logging persistente implementados

- Schema inicial com tabelas para logs, config e histórico
- Logging técnico migrado de ficheiros para BD
- Sistema de backup automático configurado
- Migrações básicas implementadas
- Testes de persistência criados
```

---

### **Fase 2 — Provider Gemini MVP**
**Duração estimada:** 3-4 dias  
**Dependências:** Fases 0-1 concluídas  

**Objetivos:**
- Garantir funcionalidade integral com provider Gemini original (OAuth gratuito)
- Manter compatibilidade 100% com autenticação OAuth do Gemini-CLI
- CLI básica funcional com logging de interações na BD
- Testes mínimos para garantir compatibilidade multiplataforma

**Outputs obrigatórios:**
- Provider Gemini totalmente funcional (OAuth + API key opcional)
- Autenticação OAuth preservada do original
- CLI básica operacional
- Logging de interações gravado na BD
- Testes unitários e integração do provider

**Critérios de conclusão:**
- [ ] Provider Gemini funciona identicamente ao original (OAuth)
- [ ] Autenticação via browser preservada e funcional
- [ ] Suporte opcional a API key para quotas maiores
- [ ] Todas as interações são registadas na BD
- [ ] CLI básica responde a comandos standard
- [ ] Testes passam em Windows, macOS e Linux
- [ ] Performance equivalente ao original

**Exemplo de commit:**
```
feat: Provider Gemini MVP com OAuth e logging BD

- OAuth authentication preservada do Gemini-CLI original
- Suporte opcional a API key para quotas maiores
- CLI básica funcional com comandos essenciais
- Logging de todas as interações na BD local
- Testes unitários e integração implementados
- Compatibilidade Windows/macOS/Linux validada
```

---

### **Fase 3 — Modularidade de Providers**
**Duração estimada:** 3-4 dias  
**Dependências:** Fases 0-2 concluídas  

**Objetivos:**
- Arquitetura agnóstica de providers (`/src/providers`)
- Interfaces padronizadas para múltiplos providers
- Sistema de configuração via `.env` implementado
- Base para extensibilidade futura

**Outputs obrigatórios:**
- Interface base para providers (`BaseProvider`)
- Configuração via `.env` funcional
- Sistema de validação de credenciais
- Arquitetura preparada para novos providers

**Estrutura de providers:**
```
src/providers/
├── base.js           # Interface base obrigatória
├── gemini.js         # Provider Gemini (refatorado)
├── providerFactory.js # Factory para instanciação
└── validation.js     # Validação de credenciais
```

**Critérios de conclusão:**
- [ ] Interface BaseProvider definida e documentada
- [ ] Provider Gemini refatorado para usar interface base
- [ ] Sistema de configuração `.env` funcional
- [ ] Validação de credenciais implementada
- [ ] Arquitetura extensível testada

**Exemplo de commit:**
```
refactor: Modularização de providers com interface padronizada

- Interface BaseProvider criada para extensibilidade
- Provider Gemini refatorado mantendo funcionalidade
- Sistema de configuração via .env implementado
- Validação de credenciais e API keys
- Arquitetura preparada para novos providers
```

---

### **Fase 4 — Providers Externos**
**Duração estimada:** 4-5 dias  
**Dependências:** Fases 0-3 concluídas  

**Objetivos:**
- Integração OpenRouter, Together, Fireworks, Anthropic, etc.
- Sistema de fallback automático entre providers
- Logging específico por provider na BD
- Gestão de quotas e rate limiting

**Outputs obrigatórios:**
- Mínimo 3 providers externos funcionais
- Fallback automático implementado
- Monitoring de performance por provider
- Gestão de erros robusta

**Providers prioritários:**
1. OpenRouter (gateway para múltiplos modelos)
2. Anthropic (Claude)
3. Together AI
4. Fireworks AI

**Critérios de conclusão:**
- [ ] Mínimo 3 providers externos funcionais
- [ ] Fallback automático entre providers a funcionar
- [ ] Logging detalhado por provider na BD
- [ ] Rate limiting e quota management implementados
- [ ] Testes de integração para todos os providers

**Exemplo de commit:**
```
feat: Integração multi-provider com fallback automático

- Providers OpenRouter, Anthropic e Together implementados
- Sistema de fallback automático entre providers
- Monitoring de performance e quotas por provider
- Gestão robusta de erros e timeouts
- Testes de integração para todos os providers
```

---

### **Fase 5 — Menu Interativo + CLI Modelos**
**Duração estimada:** 4-5 dias (expandido para incluir gestão de modelos)  
**Dependências:** Fases 0-4 concluídas (crítico: BD funcional + providers modulares)  

**Objetivos:**
- Menu de arranque para seleção dinâmica de provider
- Configuração de logging em runtime
- **CLI avançada para gestão de modelos locais**
- Interface de utilizador intuitiva e robusta
- Validação de configurações e recursos de sistema

**Outputs obrigatórios:**
- Menu interativo CLI completo
- Seleção dinâmica de providers
- Configuração de logging runtime
- **CLI para Ollama:** Verificação, instalação, gestão de modelos
- **System checks:** Verificação de recursos (RAM, CPU, disco)
- **Model recommendations:** Sugestões baseadas em recursos disponíveis
- Help e documentação integrados

**Funcionalidades do menu:**
- Seleção de provider (lista dos disponíveis via `.env`)
- Configuração de logging (ativar/desativar, destino)
- Gestão de histórico (visualizar, exportar, limpar)
- **Gestão de modelos locais:**
  - `nexocli models list` - Listar modelos instalados
  - `nexocli models check-system` - Verificar recursos do sistema
  - `nexocli models recommend` - Sugerir modelos compatíveis
  - `nexocli models install <model>` - Instalar modelo
  - `nexocli models test <model>` - Testar modelo específico
  - `nexocli models info <model>` - Informações detalhadas
  - `nexocli models benchmark <model>` - Testes de performance
- Help contextual e comandos disponíveis

**Critérios de conclusão:**
- [ ] Menu CLI interativo funcional
- [ ] Seleção de providers dinâmica
- [ ] Configuração de logging runtime
- [ ] **CLI de gestão de modelos operacional**
- [ ] **Verificações de sistema implementadas**
- [ ] **Recomendações inteligentes funcionais**
- [ ] Validação robusta de inputs
- [ ] Help integrado e documentação acessível

**Exemplo de commit:**
```
feat: Menu interativo + CLI gestão modelos locais

- Menu CLI completo para seleção de provider e configurações
- Seleção dinâmica entre providers disponíveis
- Sistema de verificação de recursos implementado
- CLI completa para gestão de modelos Ollama
- Recomendações inteligentes baseadas em sistema
- Validação robusta de inputs e configurações
- Help contextual integrado
```

---

### **Fase 6 — Modelos Locais (LLM) + Configurações**
**Duração estimada:** 3-4 dias  
**Dependências:** Fases 0-5 concluídas (crítico: CLI de gestão da Fase 5)

**Objetivos:**
- Integração Ollama com verificações defensivas de sistema
- **Configurações específicas por modelo** (não modelos binários - ficam em ~/.ollama/)
- Fallback inteligente cloud → local baseado em recursos
- **Provider local robusto** com gestão de erros

**Outputs obrigatórios:**
- Provider Ollama com verificações de sistema
- **Configurações de modelo** em `models/configs/`
- **Prompts customizados** em `models/prompts/`
- **Scripts de gestão** em `models/scripts/`
- **Benchmarks e testes** em `models/benchmarks/` (não versionados)
- Fallback inteligente cloud → local
- **Verificações defensivas** de compatibilidade

**Estrutura de models/ (Configurações apenas):**
```
models/                    # ❌ SEM modelos binários (ficam em ~/.ollama/)
├── configs/              # ✅ Configurações específicas por modelo
│   ├── deepseek-coding.json    # Config para coding
│   ├── llama3-general.json     # Config para conversação
│   ├── phi3-lightweight.json   # Config para testes
│   └── mistral-balanced.json   # Config balanceado
├── prompts/              # ✅ Prompts customizados por uso
│   ├── coding-assistant.md     # Prompts para programação
│   ├── documentation-writer.md # Prompts para docs
│   ├── system-analysis.md      # Prompts para análise
│   └── general-chat.md         # Prompts conversação
├── scripts/              # ✅ Scripts de gestão
│   ├── install-recommended.sh  # Auto-instalação
│   ├── system-check.js         # Verificação recursos
│   ├── model-test.js           # Testes automatizados
│   └── cleanup.sh              # Limpeza de cache
└── benchmarks/           # ❌ NÃO VERSIONADO - Dados locais
    ├── response-times.json     # Performance tracking
    └── resource-usage.log      # Uso de recursos
```

**Funcionalidades:**
- Deteção automática de Ollama instalado
- Verificação defensiva de recursos antes de usar modelos
- Recomendações inteligentes baseadas em sistema
- Fallback automático para local em caso de falha cloud
- Monitoring de performance local vs cloud
- Gestão de configurações e prompts por modelo

**Critérios de conclusão:**
- [ ] Provider local (Ollama) funcional com verificações defensivas
- [ ] Sistema de verificação de recursos implementado
- [ ] Recomendações inteligentes de modelos baseadas em sistema
- [ ] Fallback cloud → local a funcionar
- [ ] CLI de gestão operacional (integrada da Fase 5)
- [ ] Performance local testada e documentada
- [ ] **Configurações e prompts versionados** (modelos binários em ~/.ollama/)
- [ ] **Verificações defensivas** contra sobrecarga do sistema

**Exemplo de commit:**
```
feat: Provider local Ollama com verificações defensivas

- Provider Ollama com verificações robustas de sistema
- Configurações específicas por modelo implementadas
- Prompts customizados para diferentes casos de uso
- Fallback inteligente cloud → local funcional
- Scripts de gestão e verificação de recursos
- Monitoring de performance integrado com BD
- Verificações defensivas contra sobrecarga do sistema
```

---

### **Fase 7 — Dashboard Básico + Gestão Visual de Modelos**
**Duração estimada:** 5-6 dias  
**Dependências:** Fases 0-6 concluídas (crítico: BD com dados + providers funcionais + CLI de modelos)  

**Objetivos:**
- Dashboard CLI/Web para gestão e análise
- Visualização de histórico, logs e métricas
- **Interface visual para gestão de modelos locais**
- Exportação e filtros básicos
- Interface de gestão do sistema

**Outputs obrigatórios:**
- Dashboard funcional (CLI prioritário, Web opcional)
- Visualização de dados da BD
- **Interface visual para modelos locais**
- Exportação em múltiplos formatos
- Gestão de configurações

**Funcionalidades prioritárias:**
- Visualização de histórico de chats
- Logs técnicos filtráveis por data/agente/tipo
- Métricas de performance por provider
- **Interface visual para gestão de modelos locais:**
  - Visualização de modelos instalados com status
  - Monitorização de recursos em tempo real
  - Gestão visual de configurações de modelo
  - Performance comparisons entre modelos
  - Alertas de sobrecarga de sistema
  - Interface para instalação/remoção de modelos
- Exportação (JSON, CSV, Markdown)
- Gestão de configurações runtime

**Critérios de conclusão:**
- [ ] Dashboard CLI funcional
- [ ] Visualização completa de dados da BD
- [ ] **Interface visual de modelos operacional**
- [ ] **Monitorização de recursos em tempo real**
- [ ] Filtros e pesquisa implementados
- [ ] Exportação em múltiplos formatos
- [ ] Gestão de configurações operacional
- [ ] **Performance comparisons entre modelos funcionais**

**Exemplo de commit:**
```
feat: Dashboard com gestão visual de modelos locais

- Interface CLI para visualização de histórico e logs
- Dashboard visual para gestão de modelos Ollama
- Monitorização de recursos em tempo real
- Performance comparisons entre modelos
- Filtros avançados por data, provider, agente
- Exportação em JSON, CSV e Markdown
- Gestão de configurações runtime
- Alertas de sobrecarga de sistema
```

---

### **Fase 8 — Dashboard Avançado & Expansões**
**Duração estimada:** 6-8 dias  
**Dependências:** Todas as fases anteriores concluídas  

**Objetivos:**
- Dashboard Web avançado (opcional)
- Análise preditiva, alertas, plugins
- Internacionalização básica
- Integração futura com APIs externas

**Outputs opcionais:**
- Dashboard Web com visualizações avançadas
- Sistema de alertas e notificações
- Plugin system básico
- REST API pública (opcional)

**Critérios de conclusão:**
- [ ] Funcionalidades avançadas implementadas conforme prioridade
- [ ] Sistema estável e robusto
- [ ] Documentação completa
- [ ] Roadmap futuro definido

**Exemplo de commit:**
```
feat: Dashboard avançado com análise preditiva e alertas

- Dashboard Web com visualizações interativas
- Sistema de alertas para quotas e performance
- Plugin system básico implementado
- REST API pública para integração externa
- Documentação completa das funcionalidades
```

---

## 3. Matriz de Dependências Técnicas

| Fase | Depende de | Outputs Críticos | Bloqueia Fases |
|------|------------|------------------|----------------|
| 0 | - | Compliance, estrutura, logging básico | 1, 2, 3, 4, 5, 6, 7, 8 |
| 1 | Fase 0 | BD funcional, logging persistente | 2, 3, 4, 5, 6, 7, 8 |
| 2 | Fases 0-1 | Provider Gemini MVP, CLI básica | 3, 4, 5, 6, 7, 8 |
| 3 | Fases 0-2 | Arquitetura modular, interfaces | 4, 5, 6, 7, 8 |
| 4 | Fases 0-3 | Multi-provider, fallback | 5, 6, 7, 8 |
| 5 | Fases 0-4 | Menu interativo | 6, 7, 8 |
| 6 | Fases 0-5 | Modelos locais, fallback local | 7, 8 |
| 7 | Fases 0-6 | Dashboard básico | 8 |
| 8 | Todas anteriores | Features avançadas | - |

---

## 4. Gates de Qualidade e Critérios de Avanço

### 4.1. Critérios Obrigatórios para Avançar de Fase

**Cada fase só pode avançar se:**
- [ ] **Todos os testes passam** (unit + integration + manual)
- [ ] **CHANGELOG.md atualizado** com entry detalhado da fase
- [ ] **Log técnico da fase criado** seguindo template do AGENTS.md
- [ ] **BD com dados da fase populada** e validada
- [ ] **Documentação atualizada** (README, AGENTS, ou docs/)
- [ ] **Compliance mantido** (atribuição, licenças, headers)
- [ ] **Rollback plan documentado** para a fase

### 4.2. Definição de "Concluído" por Fase

**Fase 0:** Build limpo, compliance validado, estrutura criada  
**Fase 1:** BD operacional, logging persistente, backup funcional  
**Fase 2:** Provider Gemini 100% funcional, CLI operacional  
**Fase 3:** Arquitetura modular, interface base implementada  
**Fase 4:** Mínimo 3 providers externos funcionais  
**Fase 5:** Menu interativo completo e validado  
**Fase 6:** Modelos locais funcionais com fallback  
**Fase 7:** Dashboard básico operacional  
**Fase 8:** Funcionalidades avançadas estáveis  

### 4.3. Critérios de Rollback

**Rollback obrigatório se:**
- Falha crítica em provider default (Gemini)
- Perda de compliance legal ou atribuição
- Corrupção de BD ou perda de logs críticos
- Breaking changes sem migração documentada
- Performance degradada > 50% face ao baseline
- Falhas de segurança identificadas

---

## 5. Funcionalidades Must-Have vs. Nice-to-Have

### 5.1. Must-Have (Obrigatório MVP/Core)

**Fases 0-7 são obrigatórias e definem o MVP:**
- Provider Gemini como default (compliance Google, atribuição visível)
- Base de dados local com logging robusto
- Modularidade para providers extra e seleção dinâmica
- Menu inicial interativo para todas as opções críticas
- Integração básica de modelos locais com fallback
- Dashboard básico para consulta e exportação
- Licenciamento, README, AGENTS, CHANGELOG obrigatórios e auditáveis

### 5.2. Nice-to-Have (Fase 8 e Futuro)

**Expansões opcionais:**
- Dashboard Web avançado com análise preditiva
- Plugin system para extensões terceiros
- REST API pública para integração externa
- Suporte a múltiplas BDs (Postgres, MongoDB, etc.)
- Runtime switching de provider sem restart
- Internacionalização completa (múltiplas línguas)
- Integração com automação externa (webhooks, CI/CD)
- Sistema de autenticação e RBAC multi-utilizador

---

## 6. Estimativas e Timeline

### 6.1. Timeline Realista

**Total estimado:** 30-40 dias de desenvolvimento  

| Fase | Duração | Acumulado | Milestone |
|------|---------|-----------|-----------|
| 0 | 1-2 dias | 2 dias | Bootstrap completo |
| 1 | 2-3 dias | 5 dias | BD operacional |
| 2 | 3-4 dias | 9 dias | Gemini MVP |
| 3 | 3-4 dias | 13 dias | Arquitetura modular |
| 4 | 4-5 dias | 18 dias | Multi-provider |
| 5 | 3-4 dias | 22 dias | Menu interativo |
| 6 | 4-5 dias | 27 dias | Modelos locais |
| 7 | 5-6 dias | 33 dias | Dashboard básico |
| 8 | 6-8 dias | 41 dias | Features avançadas |

### 6.2. Milestones Críticos

**Semana 1:** Fases 0-1 (Bootstrap + BD)  
**Semana 2:** Fases 2-3 (Gemini + Modularidade)  
**Semana 3:** Fases 4-5 (Multi-provider + Menu)  
**Semana 4:** Fases 6-7 (Local + Dashboard)  
**Semana 5-6:** Fase 8 (Expansões)  

---

## 7. Gestão de Riscos e Contingências

### 7.1. Riscos Identificados

**Alto Impacto:**
- Mudanças na API do Gemini (Google) → Contingência: Fallback local obrigatório
- Problemas de compliance legal → Contingência: Review legal imediato
- Corrupção de BD durante desenvolvimento → Contingência: Backup incremental

**Médio Impacto:**
- Performance degradada em providers externos → Contingência: Otimização ou remoção
- Dificuldades técnicas com menu interativo → Contingência: CLI simples como fallback

### 7.2. Planos de Contingência

**Se Fase 1 (BD) falhar:** Implementar logging em ficheiros como fallback temporário  
**Se Fase 4 (Providers) falhar:** Continuar só com Gemini até resolução  
**Se Fase 5 (Menu) falhar:** CLI simples com argumentos command-line  

---

## 8. Governança e Decisões Técnicas

### 8.1. Alterações ao Roadmap

**Alterações permitidas:**
- Ajustes de timeline dentro da mesma fase
- Adição de providers na Fase 4
- Funcionalidades nice-to-have na Fase 8

**Alterações proibidas sem aprovação:**
- Remoção do provider Gemini default
- Alteração da sequência de dependências (Fases 0-7)
- Mudanças de compliance ou licenciamento
- Remoção de funcionalidades obrigatórias (BD, logging, menu)

### 8.2. Processo de Decisão

**Decisões técnicas menores:** Implementador/agente responsável  
**Decisões de arquitetura:** Review obrigatório via issue/PR  
**Decisões de compliance:** Aprovação obrigatória do maintainer  
**Alterações ao roadmap:** Justificação escrita + aprovação  

---

## 9. Documentação e Onboarding

### 9.1. Documentação Obrigatória por Fase

**Cada fase deve atualizar:**
- CHANGELOG.md com entry detalhado
- Log técnico específico da fase
- README.md se funcionalidades públicas alterarem
- AGENTS.md se processo de desenvolvimento mudar

### 9.2. Onboarding de Novos Agentes

**Leitura obrigatória:**
1. LICENSE (compliance legal)
2. README.md (visão geral e instalação)
3. AGENTS.md (processo técnico)
4. ROADMAP.md (este documento)
5. CHANGELOG.md (histórico de alterações)

**Validação de onboarding:**
- [ ] Agente consegue fazer build local
- [ ] Agente consegue executar testes
- [ ] Agente entende processo de logging
- [ ] Agente entende compliance obrigatório

---

## 10. Métricas e Indicadores de Sucesso

### 10.1. KPIs por Fase

**Fase 0:** Build success rate = 100%  
**Fase 1:** BD operations success rate > 99%  
**Fase 2:** Gemini response time < 2s (baseline)  
**Fase 3:** Provider switching time < 1s  
**Fase 4:** Multi-provider availability > 95%  
**Fase 5:** Menu interaction success rate > 98%  
**Fase 6:** Local fallback activation time < 5s  
**Fase 7:** Dashboard load time < 3s  
**Fase 8:** System stability > 99.5% uptime  

### 10.2. Critérios de Sucesso do Projeto

**MVP (Fases 0-7) considerado sucesso se:**
- Todos os providers obrigatórios funcionais
- BD com 100% dos logs preservados
- Menu interativo totalmente operacional
- Dashboard básico permite gestão completa
- Compliance legal 100% mantido
- Performance equivalente ou superior ao original

---

**Nota Final:** Este roadmap é vinculativo para as Fases 0-7 (MVP) e flexível para a Fase 8 (expansões). Qualquer alteração às dependências críticas requer justificação escrita e aprovação do maintainer do projeto.