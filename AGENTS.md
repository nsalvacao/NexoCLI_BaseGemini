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
├── models/                 # Configurações de modelos locais
│   ├── configs/            # Configurações específicas por modelo
│   ├── prompts/            # Prompts customizados
│   ├── scripts/            # Scripts de gestão
│   └── benchmarks/         # Testes de performance (não versionado)
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
- **Gestão de Modelos Locais:** CLI para Ollama (Fase 5+)
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

## 6. Segurança, Gestão e Autenticação

### 6.1. Autenticação Principal - OAuth (Sem Chaves API)

**O NexoCLI_BaseGemini mantém o método de autenticação original do Gemini-CLI:**
- **OAuth com conta Google** (método principal e gratuito)
- **60 requests/minuto + 1000/dia** sem qualquer custo
- **Autenticação via browser** na primeira execução
- **Credenciais armazenadas localmente** pelo próprio Gemini-CLI

### 6.2. Gestão de API Keys (Apenas para Providers Externos)

**É estritamente proibido incluir qualquer chave de API** diretamente no código-fonte, exemplos de código, testes ou logs.

**Chaves API são OPCIONAIS e apenas para:**
- Providers externos (OpenRouter, Anthropic, OpenAI, etc.)
- Quotas maiores no Gemini (via Google AI Studio)

**Exemplo de configuração segura em Node.js:**
```js
// OAuth é o método principal - SEM chaves necessárias
const useOAuth = !process.env.GEMINI_API_KEY;

// Apenas para providers externos opcionais
const openRouterKey = process.env.OPENROUTER_API_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;
```

### 6.3. Setup de Desenvolvimento

**Antes de iniciar o desenvolvimento:**
1. **Testar OAuth primeiro** - executar `npm start` e verificar login Google
2. **Verificar `.env.example`** existe e está atualizado
3. **Confirmar `.env` está no `.gitignore`**
4. **SÓ configurar `.env`** se precisar de providers externos

**Nunca escreva, partilhe ou exponha chaves reais** fora do ambiente local seguro.
Em caso de dúvida, consulte imediatamente o maintainer do projeto.

### 6.4. Gestão de Modelos Locais (Ollama) - Guidelines Técnicas

### **Arquitetura Obrigatória**

**Localização dos Componentes:**
- **Ollama:** Instalação global do sistema (`ollama`)
- **Modelos binários:** `~/.ollama/models/` (managed pelo Ollama)
- **Configurações projeto:** `models/configs/` (versionado)
- **Prompts customizados:** `models/prompts/` (versionado)
- **Benchmarks:** `models/benchmarks/` (local, não versionado)

### **Verificações Obrigatórias no Código**

**Todas as implementações devem incluir:**
```javascript
// src/providers/local.js - Exemplo obrigatório
async checkSystemRequirements() {
    const system = await getSystemInfo();
    
    // Verificação obrigatória de recursos
    if (system.ram < 2048) {
        throw new Error('Mínimo 2GB RAM requerido para modelos locais');
    }
    
    // Verificação de Ollama
    const ollamaAvailable = await checkOllamaInstalled();
    if (!ollamaAvailable) {
        throw new Error('Ollama não instalado. Instale de https://ollama.com/');
    }
    
    // Verificação de serviço
    const serviceRunning = await checkOllamaService();
    if (!serviceRunning) {
        throw new Error('Serviço Ollama não está a correr. Execute: ollama serve');
    }
}

async getModelRecommendations(systemInfo) {
    if (systemInfo.ram < 4096) {
        return ['phi3:mini', 'tinyllama:1.1b'];
    } else if (systemInfo.ram < 8192) {
        return ['deepseek-coder:6.7b', 'mistral:7b'];
    } else {
        return ['llama3:8b', 'deepseek-coder:14b', 'codellama:13b'];
    }
}
```

### **Implementação de CLI de Gestão (Fase 5)**

**Comandos Obrigatórios:**
```javascript
// src/cli/models-commands.js
export const modelCommands = {
    'models list': listInstalledModels,
    'models check-system': checkSystemResources,
    'models recommend': recommendModels,
    'models install <model>': installModel,
    'models test <model>': testModel,
    'models info <model>': getModelInfo,
    'models benchmark <model>': benchmarkModel
};

async function checkSystemResources() {
    const system = await getSystemInfo();
    console.log(`💻 Sistema:`);
    console.log(`   RAM: ${system.ram}MB (${system.ramFree}MB livre)`);
    console.log(`   CPU: ${system.cpu.cores} cores, ${system.cpu.model}`);
    console.log(`   Disco: ${system.disk.free}GB livres`);
    
    const recommended = await getModelRecommendations(system);
    console.log(`🎯 Modelos recomendados: ${recommended.join(', ')}`);
}
```

### **Testing Strategy para Modelos Locais**

**Estrutura de Testes Obrigatória:**
```javascript
// tests/providers/local.test.js
describe('LocalProvider', () => {
    beforeAll(async () => {
        // Verificar se Ollama está disponível para testes
        const available = await checkOllamaInstalled();
        if (!available) {
            console.warn('Ollama não disponível, usando mocks');
            mockOllama = true;
        }
    });
    
    test('should check system requirements', async () => {
        const provider = new LocalProvider();
        const requirements = await provider.checkSystemRequirements();
        expect(requirements.sufficient).toBeDefined();
    });
    
    test('should recommend models based on resources', async () => {
        const provider = new LocalProvider();
        const recommendations = await provider.getModelRecommendations({
            ram: 8192, cpu: { cores: 4 }
        });
        expect(recommendations).toContain('deepseek-coder:6.7b');
    });
    
    test('should handle model installation', async () => {
        if (mockOllama) return; // Skip se não tem Ollama real
        
        const provider = new LocalProvider();
        const result = await provider.installModel('phi3:mini');
        expect(result.success).toBe(true);
    });
});
```

### **Configurações de Modelo - Estrutura Obrigatória**

**Exemplo: models/configs/deepseek-coding.json**
```json
{
    "model": "deepseek-coder:6.7b",
    "name": "DeepSeek Coder",
    "purpose": "coding",
    "requirements": {
        "ram_mb": 4096,
        "disk_mb": 4000,
        "cpu_cores": 2
    },
    "parameters": {
        "temperature": 0.1,
        "top_p": 0.95,
        "max_tokens": 4096,
        "stop_sequences": ["```", "###"]
    },
    "prompt_template": "coding-assistant",
    "fallback_models": ["phi3:mini", "tinyllama:1.1b"],
    "use_cases": ["code_generation", "code_review", "debugging"],
    "performance": {
        "avg_response_time_ms": 3000,
        "tokens_per_second": 25
    }
}
```

### **Error Handling Defensivo**

**Implementação Obrigatória:**
```javascript
async function safeModelExecution(modelName, prompt, options = {}) {
    try {
        // 1. Verificar recursos antes da execução
        const systemCheck = await checkSystemResources();
        if (!systemCheck.sufficient) {
            const lighter = await suggestLighterModel(modelName);
            throw new Error(`Recursos insuficientes. Sugestão: ${lighter}`);
        }
        
        // 2. Verificar se modelo existe
        const modelExists = await checkModelExists(modelName);
        if (!modelExists) {
            throw new Error(`Modelo ${modelName} não instalado. Use: nexocli models install ${modelName}`);
        }
        
        // 3. Executar com timeout
        const timeout = options.timeout || 30000;
        const response = await Promise.race([
            executeModel(modelName, prompt, options),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), timeout)
            )
        ]);
        
        return response;
        
    } catch (error) {
        // 4. Log error na BD
        await logger.logProviderAction({
            provider: 'local',
            model: modelName,
            action: 'execution',
            status: 'error',
            error_message: error.message
        });
        
        // 5. Sugerir fallback
        if (error.message.includes('Recursos insuficientes')) {
            const fallback = await suggestFallbackProvider();
            throw new Error(`${error.message}\n💡 Tente: ${fallback}`);
        }
        
        throw error;
    }
}
```

### **Performance Monitoring Obrigatório**

**Implementação para Dashboard:**
```javascript
// src/utils/model-monitor.js
export class ModelMonitor {
    async trackModelUsage(modelName, startTime, endTime, tokens) {
        const usage = {
            model: modelName,
            response_time_ms: endTime - startTime,
            tokens_generated: tokens,
            timestamp: new Date(),
            system_resources: await getCurrentSystemUsage()
        };
        
        // Gravar na BD para dashboard
        await logger.logModelPerformance(usage);
        
        // Alertar se performance degradada
        if (usage.response_time_ms > 10000) {
            console.warn(`⚠️ Modelo ${modelName} demorou ${usage.response_time_ms}ms`);
            console.warn(`💡 Considere modelo mais leve ou verificar recursos`);
        }
    }
}
```

### **Guidelines de Desenvolvimento**

**Verificações Obrigatórias ANTES de implementar:**
- [ ] Sistema tem Ollama instalado globalmente
- [ ] Modelo de teste leve disponível (`phi3:mini`)
- [ ] Verificações de recursos implementadas
- [ ] Error handling defensivo implementado
- [ ] Logging de performance implementado
- [ ] Testes com mocks para CI/CD

**Durante Desenvolvimento:**
- [ ] Testar sempre com modelo leve primeiro
- [ ] Verificar recursos antes de modelos pesados
- [ ] Implementar timeouts em todas as chamadas
- [ ] Log todas as operações na BD
- [ ] Providenciar fallbacks inteligentes

**Validação Final:**
- [ ] CLI de gestão completamente funcional
- [ ] Verificações de sistema robustas
- [ ] Performance monitoring operacional
- [ ] Error handling defensivo testado
- [ ] Documentação atualizada (README + este ficheiro)

---

## 7. Dashboard e Monitorização

### 7.1. Funcionalidades Mínimas do Dashboard

**Visualização:**
- Histórico de chats filtrado por data, provider, sessão
- Logs técnicos com pesquisa e filtros
- Métricas de performance por provider
- **Gestão visual de modelos locais** (Fase 7)
- Estado atual do sistema e configurações

**Gestão:**
- Exportação de dados (JSON, CSV, markdown)
- Configuração de providers em runtime
- **Interface visual para modelos Ollama**
- Gestão de logs (archive, cleanup, backup)
- Help/documentação integrada

**Monitorização:**
- Consumo de recursos (API calls, quotas)
- **Recursos de sistema para modelos locais**
- Alertas de falhas ou degradação
- Performance benchmarks por provider

### 7.2. Acesso à Base de Dados

**Queries padronizadas:**
- Logs por agente e período
- Performance média por provider
- **Performance de modelos locais**
- Sessões de chat por utilizador
- Alertas de sistema e erros

**Exportação e Backup:**
- Backup automático semanal da BD
- Exportação selectiva por filtros
- Migração de dados entre versões

---

## 8. Incident Response e Manutenção

### 8.1. Procedimentos de Emergência

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

**Sobrecarga de Sistema (Modelos Locais):**
1. Parar execução de modelos pesados
2. Sugerir modelos mais leves
3. Verificar recursos disponíveis
4. Registar incident para análise

### 8.2. Backup e Recovery

**Backup Automático:**
- BD local: backup diário incremental
- Logs críticos: backup semanal completo
- Configurações: backup antes de alterações

**Recovery Testing:**
- Testar restore mensalmente
- Validar integridade de dados
- Documentar procedimentos de recovery

---

## 9. Templates e Recursos

### 9.1. Template de Feature Branch

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

### 9.2. Template de Issue/Bug Report

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

### 9.3. Recursos de Referência

- **Apache License 2.0:** http://www.apache.org/licenses/LICENSE-2.0
- **Gemini-CLI Original:** https://github.com/google-gemini/gemini-cli
- **Node.js Best Practices:** https://github.com/goldbergyoni/nodebestpractices
- **Jest Testing Framework:** https://jestjs.io/docs/getting-started
- **SQLite Documentation:** https://www.sqlite.org/docs.html
- **Ollama Documentation:** https://ollama.com/docs

---

## 10. Contactos e Suporte

**Maintainer Principal:** [Nuno Salvação](mailto:nexo-modeling@outlook.com)

**Para Agentes IA:** Seguir rigorosamente este documento. Em caso de dúvida sobre compliance ou arquitetura, referir às secções relevantes antes de proceder.

**Para Contribuidores Humanos:** Ler integralmente este documento, LICENSE, README.md e ROADMAP.md antes da primeira contribuição.

---

**Nota Final de Compliance:**
Este documento é **obrigatório** para qualquer pessoa ou agente automatizado que colabore neste projeto. O não cumprimento destas regras pode levar à rejeição de contribuições ou exclusão do histórico do projeto. A conformidade legal com a Apache License 2.0 e a atribuição ao Gemini-CLI (Google LLC) são inegociáveis.