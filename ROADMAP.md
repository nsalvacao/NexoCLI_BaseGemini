# Roadmap - NexoCLI

---

> **NexoCLI** é um fork personalizado do [Gemini-CLI](https://github.com/google-gemini/gemini-cli) da Google LLC (Apache 2.0). Este roadmap detalha o desenvolvimento progressivo de personalização mínima e preparação para integração com solução híbrida.
>
> **🎯 Metodologia:** Desenvolvimento → Testes VM Windows → Commit GitHub → Nova Fase
>
> **Projeto mantido por** [Nuno Salvação](mailto:nexo-modeling@outlook.com) | **Licenciado sob** Apache License 2.0

---

## 📋 **Visão Geral do Projeto**

### **Contexto da Solução Híbrida**
O NexoCLI é parte de um ecossistema de 4 subprojetos:

1. **🔧 NexoCLI** (Este roadmap) - Personalização Gemini-CLI
2. **🤖 Ollama** - Modelos LLM locais (solução original)
3. **🎛️ n8n Orchestrator** - Orquestração visual de agentes
4. **🖥️ Interface Unificada** - Menu consolidado (terminal/web)

### **Objetivos Específicos NexoCLI**
- **Personalização mínima:** Manter 100% compatibilidade funcional
- **Rebranding:** `gemini` → `nexocli` sem breaking changes
- **Preparação integração:** APIs para orquestração n8n
- **Desenvolvimento iterativo:** Pequenas vitórias → testes → commit

---

## 🚀 **Metodologia de Desenvolvimento**

### **Ciclo de Desenvolvimento Standard**
```
📝 PLANEAMENTO
    ↓
💻 DESENVOLVIMENTO
    ↓
🧪 TESTES LOCAIS
    ↓
🖥️ TESTES VM WINDOWS
    ↓
📊 VALIDAÇÃO FUNCIONAL
    ↓
📋 DOCUMENTAÇÃO
    ↓
💾 COMMIT GITHUB
    ↓
🎯 PRÓXIMA FASE
```

### **Critérios de Sucesso por Fase**
- **✅ Build sem erros:** `npm run build`
- **✅ Funcionalidade básica:** `./bundle/nexocli.js "teste"`
- **✅ Compatibilidade:** Comandos originais funcionam
- **✅ VM Windows:** Teste em ambiente real
- **✅ Documentação:** Logs e changelog atualizados

---

## 📊 **Status Atual do Projeto**

### **✅ Fase 0: Preparação e Documentação** (COMPLETA)
**Data:** 2025-07-14  
**Duração:** 1 dia  
**Status:** ✅ Concluída  

#### **Objetivos Alcançados:**
- [x] Análise completa da arquitetura Gemini-CLI
- [x] Estrutura de projeto organizada
- [x] Documentação personalizada (README, AGENTS, CHANGELOG, CONTRIBUTING)
- [x] Ambiente de desenvolvimento isolado configurado
- [x] Compliance legal verificado (Apache 2.0)

#### **Entregáveis:**
- **README.md** - Documentação principal personalizada
- **AGENTS.md** - Guia para agentes com contexto completo
- **CHANGELOG.md** - Tracking de modificações
- **CONTRIBUTING.md** - Workflow de contribuição
- **Estrutura logs** - `0. Log_Dev_NexoCli_BaseGemini/Dev_Logs/`

#### **Validação:**
- ✅ Documentação completa e estruturada
- ✅ Compliance legal verificado
- ✅ Ambiente isolado funcional
- ✅ Templates para desenvolvimento futuro

---

## 🎯 **Fases de Desenvolvimento**

### **📋 Fase 1: Rebranding Básico**
**Início:** 2025-07-14  
**Duração Estimada:** 2-3 dias  
**Status:** 🔄 Em Desenvolvimento  
**Prioridade:** 🔴 Crítica

#### **1.1. Objetivos da Fase**
- Alterar comando global de `gemini` para `nexocli`
- Personalizar arte ASCII com logo Nexo
- Customizar mensagens de boas-vindas
- Configurar build para gerar `nexocli.js`

#### **1.2. Tasks Específicas**

##### **Task 1.1: Configuração package.json**
```json
// Modificar package.json
{
  "name": "nexocli",
  "bin": {
    "nexocli": "bundle/nexocli.js"
  }
}
```
- **Ficheiro:** `package.json`
- **Estimativa:** 0.5h
- **Testes:** `npm run build && ./bundle/nexocli.js --version`

##### **Task 1.2: Arte ASCII Personalizada**
- **Ficheiro:** `packages/cli/src/ui/components/AsciiArt.ts`
- **Objetivo:** Logo "NEXOCLI" em ASCII art
- **Estimativa:** 1h
- **Testes:** Verificar visual no terminal

##### **Task 1.3: Mensagens de Boas-vindas**
- **Ficheiro:** `packages/cli/src/ui/components/Header.tsx`
- **Objetivo:** Personalizar texto de entrada
- **Estimativa:** 0.5h
- **Testes:** Verificar mensagem inicial

##### **Task 1.4: Build Configuration**
- **Ficheiros:** Scripts de build
- **Objetivo:** Output `nexocli.js` em vez de `gemini.js`
- **Estimativa:** 1h
- **Testes:** Verificar bundle gerado

#### **1.3. Testes da Fase 1**
```bash
# Testes obrigatórios
npm run build                   # Build success
./bundle/nexocli.js --version   # Versão com "nexocli"
./bundle/nexocli.js "teste"     # Funcionalidade básica
./bundle/nexocli.js --help      # Help funcional

# Testes específicos rebranding
./bundle/nexocli.js --version | grep -i nexo
./bundle/nexocli.js | head -10  # Verificar arte ASCII
```

#### **1.4. VM Windows - Teste Obrigatório**
- **Ambiente:** VM Windows sem WSL
- **Testes:** Todos os comandos básicos
- **Documentação:** Resultados no log de desenvolvimento

#### **1.5. Critérios de Conclusão Fase 1**
- [ ] `package.json` configurado para `nexocli`
- [ ] Arte ASCII personalizada implementada
- [ ] Mensagens de boas-vindas customizadas
- [ ] Build gera `bundle/nexocli.js`
- [ ] Testes locais 100% funcionais
- [ ] Teste VM Windows bem-sucedido
- [ ] Documentação atualizada (CHANGELOG.md)
- [ ] Log de desenvolvimento criado
- [ ] Commit no GitHub realizado

---

### **📋 Fase 2: Comandos Personalizados**
**Início:** Após conclusão Fase 1  
**Duração Estimada:** 3-4 dias  
**Status:** 📋 Planeada  
**Prioridade:** 🟡 Alta

#### **2.1. Objetivos da Fase**
- Implementar comandos slash personalizados
- Adicionar funcionalidades específicas do ecossistema Nexo
- Manter compatibilidade total com comandos originais

#### **2.2. Tasks Específicas**

##### **Task 2.1: Comando /nexo info**
```bash
nexocli /nexo info
# Output:
# 🔧 NexoCLI - Personalização do Gemini-CLI
# ├── Versão: [versão]
# ├── Provider: Google Gemini (OAuth)
# ├── Integração: n8n ready
# └── Maintainer: Nuno Salvação
```
- **Ficheiro:** `packages/cli/src/ui/hooks/slashCommandProcessor.ts`
- **Estimativa:** 2h
- **Testes:** Comando funcional e informativo

##### **Task 2.2: Comando /nexo status**
```bash
nexocli /nexo status
# Output:
# 📊 Status dos Agentes Nexo:
# ├── 🔧 NexoCLI: ✅ Ativo
# ├── 🤖 Ollama: ⚠️ Não instalado
# ├── 🎛️ n8n: 📋 Planeado
# └── 🖥️ Interface: 📋 Planeado
```
- **Ficheiro:** `packages/cli/src/ui/hooks/slashCommandProcessor.ts`
- **Estimativa:** 3h
- **Testes:** Status accurate dos componentes

##### **Task 2.3: Comando /nexo config**
```bash
nexocli /nexo config
# Interface de configuração específica Nexo
```
- **Ficheiro:** `packages/cli/src/ui/hooks/slashCommandProcessor.ts`
- **Estimativa:** 4h
- **Testes:** Configuração persiste e funciona

#### **2.3. Testes da Fase 2**
```bash
# Testes comandos originais (compatibilidade)
./bundle/nexocli.js /help
./bundle/nexocli.js /clear
./bundle/nexocli.js /memory
./bundle/nexocli.js /theme

# Testes comandos novos
./bundle/nexocli.js /nexo info
./bundle/nexocli.js /nexo status
./bundle/nexocli.js /nexo config
```

#### **2.4. Critérios de Conclusão Fase 2**
- [ ] `/nexo info` implementado e funcional
- [ ] `/nexo status` mostra status accurate
- [ ] `/nexo config` permite configuração
- [ ] Comandos originais mantêm funcionalidade
- [ ] Testes VM Windows bem-sucedidos
- [ ] Documentação atualizada
- [ ] Commit no GitHub realizado

---

### **📋 Fase 3: Preparação para Integração**
**Início:** Após conclusão Fase 2  
**Duração Estimada:** 4-5 dias  
**Status:** 📋 Planeada  
**Prioridade:** 🟡 Alta

#### **3.1. Objetivos da Fase**
- Preparar APIs para comunicação com n8n
- Implementar endpoints básicos de orquestração
- Configuração modular para integração híbrida

#### **3.2. Tasks Específicas**

##### **Task 3.1: API Mode**
```bash
nexocli --api-mode
# Inicia em modo API para comunicação externa
```
- **Estimativa:** 6h
- **Testes:** Endpoint responde corretamente

##### **Task 3.2: Webhook Configuration**
```bash
nexocli --webhook-url=http://localhost:5678/webhook/nexo
# Configura URL para receber comandos via webhook
```
- **Estimativa:** 4h
- **Testes:** Recebe e processa webhooks

##### **Task 3.3: Configuration Module**
- **Ficheiro:** Novo módulo de configuração
- **Objetivo:** Settings específicos para integração
- **Estimativa:** 6h
- **Testes:** Configuração persiste entre sessões

#### **3.3. Critérios de Conclusão Fase 3**
- [ ] Modo API implementado
- [ ] Webhook system funcional
- [ ] Configuração modular operacional
- [ ] Comunicação com sistemas externos testada
- [ ] Testes VM Windows bem-sucedidos
- [ ] Documentação de APIs criada
- [ ] Commit no GitHub realizado

---

### **📋 Fase 4: Interface Unificada (Base)**
**Início:** Após conclusão Fase 3  
**Duração Estimada:** 5-6 dias  
**Status:** 📋 Planeada  
**Prioridade:** 🟢 Média

#### **4.1. Objetivos da Fase**
- Criar base para menu unificado
- Preparar comunicação com outros agentes
- Interface básica para gestão multi-agente

#### **4.2. Tasks Específicas**

##### **Task 4.1: Menu Base**
```bash
nexo-menu
# Menu consolidado para todos os agentes
```
- **Estimativa:** 8h
- **Testes:** Menu funcional e navegável

##### **Task 4.2: Agent Communication**
- **Objetivo:** Protocolo básico de comunicação
- **Estimativa:** 10h
- **Testes:** Comunicação entre agentes

#### **4.3. Critérios de Conclusão Fase 4**
- [ ] Menu unificado base implementado
- [ ] Comunicação multi-agente funcional
- [ ] Interface responsive (terminal/web)
- [ ] Testes VM Windows bem-sucedidos
- [ ] Documentação completa
- [ ] Commit no GitHub realizado

---

## 📊 **Cronograma Estimado**

### **Timeline Geral**
```
Fase 0: ✅ Completa (1 dia)
│
├── Fase 1: 🔄 Em desenvolvimento (2-3 dias)
│   ├── Rebranding básico
│   └── Testes VM Windows
│
├── Fase 2: 📋 Planeada (3-4 dias)
│   ├── Comandos personalizados
│   └── Testes compatibilidade
│
├── Fase 3: 📋 Planeada (4-5 dias)
│   ├── APIs integração
│   └── Comunicação externa
│
└── Fase 4: 📋 Planeada (5-6 dias)
    ├── Interface unificada
    └── Multi-agente base
```

### **Marcos Importantes**
- **✅ 2025-07-14:** Documentação completa
- **🎯 2025-07-16:** Fase 1 - Rebranding concluído
- **🎯 2025-07-20:** Fase 2 - Comandos personalizados
- **🎯 2025-07-25:** Fase 3 - APIs integração
- **🎯 2025-07-31:** Fase 4 - Interface unificada base

---

## 🧪 **Estratégia de Testes**

### **Testes por Fase**

#### **Testes Obrigatórios (Todas as Fases):**
```bash
# Build e funcionamento básico
npm run build
./bundle/nexocli.js --version
./bundle/nexocli.js "Teste de funcionamento"
./bundle/nexocli.js --help

# Compatibilidade com comandos originais
./bundle/nexocli.js /help
./bundle/nexocli.js /clear
./bundle/nexocli.js /memory
./bundle/nexocli.js /theme
```

#### **VM Windows - Teste Crítico:**
- **Ambiente:** Windows sem WSL
- **Frequência:** Cada fase
- **Documentação:** Obrigatória em log
- **Critério:** 100% funcionamento

### **Teste de Regressão**
```bash
# Script de teste automático (futuro)
npm run test:regression
# Valida todas as funcionalidades das fases anteriores
```

---

## 📋 **Gestão de Riscos**

### **Riscos Identificados**

#### **🔴 Alto Risco**
- **Breaking changes:** Alterar funcionalidade original
- **Conflito instalação:** Sobrescrever instalação global
- **Compliance:** Violação de licenciamento Apache 2.0

#### **🟡 Médio Risco**
- **VM Windows:** Incompatibilidades específicas
- **Performance:** Degradação após modificações
- **Dependências:** Conflitos com versões

#### **🟢 Baixo Risco**
- **Arte ASCII:** Problemas visuais menores
- **Documentação:** Inconsistências não críticas

### **Planos de Mitigação**

#### **Para Breaking Changes:**
- Testes de regressão obrigatórios
- Validação de compatibilidade em cada commit
- Rollback plan documentado

#### **Para Conflitos de Instalação:**
- Desenvolvimento sempre isolado
- Nunca usar `npm link`
- Documentação clara sobre ambiente

#### **Para Compliance:**
- Header de atribuição obrigatório
- Review de licenciamento em cada PR
- Documentação legal atualizada

---

## 📊 **Métricas de Sucesso**

### **KPIs por Fase**

#### **Fase 1: Rebranding**
- **✅ Funcionalidade:** 100% comandos originais funcionam
- **✅ Visual:** Arte ASCII personalizada visível
- **✅ Comando:** `nexocli` responde corretamente
- **✅ VM:** Teste Windows bem-sucedido

#### **Fase 2: Comandos**
- **✅ Novos comandos:** 3 comandos `/nexo` implementados
- **✅ Compatibilidade:** Comandos originais intactos
- **✅ Funcionalidade:** Informações accurate e úteis

#### **Fase 3: Integração**
- **✅ APIs:** Endpoints funcionais
- **✅ Comunicação:** Webhook system operacional
- **✅ Configuração:** Settings persistem

#### **Fase 4: Interface**
- **✅ Menu:** Interface unificada funcional
- **✅ Multi-agente:** Comunicação básica implementada

### **Métricas de Qualidade**
- **Build success rate:** 100%
- **Teste VM Windows:** 100% sucesso
- **Compatibilidade:** 0 breaking changes
- **Documentação:** Todos os logs criados

---

## 🔄 **Processo de Iteração**

### **Revisão de Fase**
Ao final de cada fase:
1. **Validação completa** de todos os critérios
2. **Teste VM Windows** obrigatório
3. **Atualização documentação** (CHANGELOG, logs)
4. **Review de código** e compliance
5. **Commit GitHub** com tag de fase
6. **Planeamento** da próxima fase

### **Feedback Loop**
- **Testes contínuos** durante desenvolvimento
- **Validação incremental** de funcionalidades
- **Ajustes** baseados em resultados VM Windows
- **Documentação** em tempo real

---

## 📞 **Contactos e Suporte**

### **Maintainer Principal**
- **Nome:** Nuno Salvação
- **Email:** [nexo-modeling@outlook.com](mailto:nexo-modeling@outlook.com)
- **GitHub:** [@nsalvacao](https://github.com/nsalvacao)

### **Para Issues e Contribuições**
- **Issues:** Para bugs e sugestões específicas
- **Discussions:** Para ideias e questões gerais
- **Email:** Para questões de roadmap ou arquitetura

---

## 📄 **Recursos e Referências**

### **Documentação do Projeto**
- **[README.md](README.md)** - Documentação principal
- **[AGENTS.md](AGENTS.md)** - Guia para agentes
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Workflow de contribuição
- **[CHANGELOG.md](CHANGELOG.md)** - Histórico de alterações

### **Projeto Original**
- **[Gemini-CLI](https://github.com/google-gemini/gemini-cli)** - Código base
- **[Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)** - Licenciamento

### **Ferramentas de Desenvolvimento**
- **Node.js 20+** - Runtime
- **TypeScript** - Linguagem principal
- **esbuild** - Sistema de build
- **VM Windows** - Ambiente de teste

---

**Este roadmap é um documento vivo e será atualizado conforme o progresso do desenvolvimento.**

*Desenvolvido por [Nuno Salvação](mailto:nexo-modeling@outlook.com) | Baseado em Gemini-CLI (Google LLC, Apache 2.0) | Parte do ecossistema Nexo*