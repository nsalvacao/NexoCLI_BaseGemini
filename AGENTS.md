---
titulo: "AGENTS.md - NexoCLI"
versao: "v1.0"
data_criacao: 2025-07-14
ultima_atualizacao: 2025-07-14
node: ["NexoCLI"]
proposito: ["Guia de agentes", "Compliance de licenciamento", "Workflow estruturado", "Context para desenvolvimento"]
origem: ["Nuno Salvação", "Fork gemini-cli da Google LLC"]
reutilizavel: true
status: "ativo"
dependencias: ["LICENSE", "README.md", "CHANGELOG.md", "ROADMAP.md"]
tags: ["@compliance", "@agentes", "@logging", "@licenciamento", "@workflow", "@nexocli"]
----------------------------------------------------------------------------------------------------------------------

# AGENTS.md — Guia Oficial para Agentes NexoCLI

## 1. Contexto do Projeto NexoCLI

### 1.1. Visão Geral
**NexoCLI** é um fork personalizado do [Gemini-CLI](https://github.com/google-gemini/gemini-cli) da Google LLC (Apache 2.0), focado em **personalização mínima** e **integração com solução híbrida** de múltiplos agentes.

### 1.2. Arquitetura da Solução Completa
O projeto faz parte de um ecossistema de 4 subprojetos:

1. **🔧 NexoCLI** (Este repositório) - Personalização Gemini-CLI
2. **🤖 Ollama** - Modelos LLM locais (solução original)
3. **🎛️ n8n Orchestrator** - Orquestração visual de agentes
4. **🖥️ Interface Unificada** - Menu consolidado (terminal/web)

### 1.3. Objetivos Específicos NexoCLI
- **Personalização mínima:** Rebranding `gemini` → `nexocli`
- **Manter funcionalidade:** 100% compatível com Gemini-CLI original
- **Preparar integração:** APIs para orquestração n8n
- **Desenvolvimento isolado:** Sem afetar instalação global

---

## 2. Regras de Compliance e Licenciamento

### 2.1. Atribuição Legal Obrigatória
**CRÍTICO:** Todos os ficheiros modificados devem incluir:

```typescript
// Modificado por [Nome do Agente], 2025
// Baseado em gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
// Parte do NexoCLI_BaseGemini - Personalização para ecossistema Nexo
```

### 2.2. Checklist de Compliance
Antes de qualquer alteração:
- [ ] Cabeçalho de atribuição nos ficheiros modificados
- [ ] Nenhuma chave API ou credencial em código
- [ ] `package.json` configurado com `"bin": {"nexocli": "bundle/nexocli.js"}`
- [ ] Testes de build e funcionamento realizados
- [ ] Documentação atualizada conforme necessário
- [ ] Log de desenvolvimento criado

### 2.3. Documentação Obrigatória
- **README.md** - Documentação principal (personalizada)
- **AGENTS.md** - Este ficheiro (instruções para agentes)
- **CHANGELOG.md** - Histórico de alterações
- **LICENSE** - Apache 2.0 (mantida original)
- **ROADMAP.md** - Planeamento futuro

---

## 3. Personalização Atual e Planeada

### 3.1. ✅ Implementado
- **Rebranding:** `gemini` → `nexocli` em package.json
- **Documentação:** README.md e AGENTS.md personalizados
- **Estrutura:** Diretório de desenvolvimento isolado
- **Compliance:** Atribuição legal documentada

### 3.2. 🔄 Em Desenvolvimento
- **Arte ASCII:** Logo personalizado Nexo em `AsciiArt.ts`
- **Comandos slash:** `/nexo info`, `/nexo status`, `/nexo config`
- **Mensagens boas-vindas:** Interface personalizada em `Header.tsx`
- **Build personalizado:** Output `nexocli.js` em vez de `gemini.js`

### 3.3. 📋 Planeado
- **Integração n8n:** Endpoints para orquestração
- **Interface unificada:** Menu consolidado
- **Configuração modular:** Settings específicos Nexo

---

## 4. Estrutura do Projeto

### 4.1. Diretórios Principais
```
NexoCLI_BaseGemini/
├── packages/
│   ├── cli/                    # Interface CLI
│   │   ├── src/ui/components/
│   │   │   ├── AsciiArt.ts    # 🎯 PERSONALIZAR: Logo Nexo
│   │   │   ├── Header.tsx     # 🎯 PERSONALIZAR: Boas-vindas
│   │   │   └── ...
│   │   └── src/ui/hooks/
│   │       └── slashCommandProcessor.ts # 🎯 PERSONALIZAR: Comandos
│   └── core/                   # Lógica core (MANTER)
├── 0. Log_Dev_NexoCli_BaseGemini/
│   ├── Dev_Logs/              # Logs de desenvolvimento
│   └── Docs_Exemplo/          # Templates usados
├── bundle/                    # 🎯 OUTPUT: nexocli.js
├── package.json               # 🎯 PERSONALIZAR: bin nexocli
└── [documentação]             # README, AGENTS, etc.
```

### 4.2. Ficheiros-Chave para Personalização
- `package.json` - Configuração principal (bin, nome, versão)
- `packages/cli/src/ui/components/AsciiArt.ts` - Arte ASCII
- `packages/cli/src/ui/components/Header.tsx` - Cabeçalho
- `packages/cli/src/ui/hooks/slashCommandProcessor.ts` - Comandos slash

---

## 5. Workflow de Desenvolvimento

### 5.1. Ambiente de Desenvolvimento Isolado
```bash
# Setup inicial
git clone https://github.com/nsalvacao/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini
npm install

# Desenvolvimento seguro (não afeta instalação global)
npm run build
./bundle/nexocli.js --version
./bundle/nexocli.js "teste de funcionalidade"

# Alias para desenvolvimento
alias nexocli-dev="./bundle/nexocli.js"
```

### 5.2. Processo de Modificação
1. **Identificar ficheiro** a modificar
2. **Adicionar header** de atribuição
3. **Implementar alteração** mínima
4. **Testar localmente:** `npm run build && ./bundle/nexocli.js`
5. **Validar funcionamento** básico
6. **Documentar alteração** em log

### 5.3. Testes Obrigatórios
```bash
# Testes básicos
npm run build                   # Build success
./bundle/nexocli.js --version   # Versão OK
./bundle/nexocli.js "teste"     # Funcionalidade básica

# Testes de personalização
./bundle/nexocli.js --version | grep -i nexo
./bundle/nexocli.js /help      # Comandos disponíveis
```

---

## 6. Implementação de Personalizações

### 6.1. Rebranding Básico
**Ficheiro:** `package.json`
```json
{
  "name": "nexocli",
  "bin": {
    "nexocli": "bundle/nexocli.js"
  }
}
```

### 6.2. Arte ASCII Personalizada
**Ficheiro:** `packages/cli/src/ui/components/AsciiArt.ts`
```typescript
// Modificado por [Agente], 2025
// Baseado em gemini-cli (Copyright 2025 Google LLC, Apache 2.0)

export const shortAsciiLogo = `
 ███   ██ ███████ ██   ██  ██████  
 ████  ██ ██       ██ ██  ██    ██ 
 ██ ██ ██ █████     ███   ██    ██ 
 ██  ████ ██       ██ ██  ██    ██ 
 ██   ███ ███████ ██   ██  ██████  
`;

export const longAsciiLogo = `
 ███   ██ ███████ ██   ██  ██████   ██████ ██      ██ 
 ████  ██ ██       ██ ██  ██    ██ ██      ██      ██ 
 ██ ██ ██ █████     ███   ██    ██ ██      ██      ██ 
 ██  ████ ██       ██ ██  ██    ██ ██      ██      ██ 
 ██   ███ ███████ ██   ██  ██████   ██████ ███████ ██ 
`;
```

### 6.3. Comandos Slash Personalizados
**Ficheiro:** `packages/cli/src/ui/hooks/slashCommandProcessor.ts`
```typescript
// Modificado por [Agente], 2025
// Baseado em gemini-cli (Copyright 2025 Google LLC, Apache 2.0)

// Adicionar comandos Nexo
export const nexoCommands = {
  '/nexo info': () => showNexoInfo(),
  '/nexo status': () => showNexoStatus(),
  '/nexo config': () => showNexoConfig(),
  '/nexo orchestrate': () => showNexoOrchestration(),
};

function showNexoInfo() {
  return `
🔧 NexoCLI - Personalização do Gemini-CLI
├── Versão: ${getVersion()}
├── Provider: Google Gemini (OAuth)
├── Integração: n8n ready
└── Maintainer: Nuno Salvação
  `;
}
```

### 6.4. Mensagens de Boas-vindas
**Ficheiro:** `packages/cli/src/ui/components/Header.tsx`
```typescript
// Modificado por [Agente], 2025
// Baseado em gemini-cli (Copyright 2025 Google LLC, Apache 2.0)

// Personalizar mensagem de boas-vindas
const welcomeMessage = `
🚀 Bem-vindo ao NexoCLI
Personalização do Gemini-CLI para o ecossistema Nexo
Digite /nexo info para mais informações
`;
```

---

## 7. Segurança e Boas Práticas

### 7.1. Desenvolvimento Seguro
- **Nunca usar `npm link`** - Sobrescreve instalação global
- **Sempre executar localmente:** `./bundle/nexocli.js`
- **Testar antes de commit:** Build e funcionalidade básica
- **Manter OAuth:** Usar autenticação Google original

### 7.2. Gestão de Credenciais
- **OAuth Google:** Método principal (gratuito)
- **API Keys:** Apenas para quotas maiores (opcional)
- **Nunca commitar:** Credenciais em código
- **Ambiente local:** Todas as configurações

### 7.3. Validação de Alterações
```bash
# Checklist de segurança
npm run build                   # Build sem erros
./bundle/nexocli.js --version   # Output correto
./bundle/nexocli.js "teste"     # Funcionalidade OK
grep -r "GEMINI_API_KEY" .      # Sem credenciais em código
```

---

## 8. Integração com Solução Híbrida

### 8.1. Preparação para n8n
**Futuros endpoints para orquestração:**
```typescript
// Modo API para n8n
nexocli --api-mode
nexocli --webhook-url=http://localhost:5678/webhook/nexo
```

### 8.2. Interface Unificada Futura
```bash
# Menu consolidado (planeado)
nexo                            # Comando principal
├── 🤖 NexoCLI (Google Gemini)
├── 🦾 Ollama (Modelos Locais)
├── 🎛️ n8n (Orquestração)
└── ⚙️ Configurações
```

### 8.3. Arquitectura de Comunicação
- **NexoCLI:** Endpoints REST para n8n
- **n8n:** Orquestração visual de workflows
- **Interface:** Menu único para todos os agentes
- **Comunicação:** JSON via HTTP/WebSocket

---

## 9. Logging e Documentação

### 9.1. Log de Desenvolvimento
**Padrão de nome:** `Nexo_[acao]_[timestamp].md`

**Template:**
```markdown
# Log de Desenvolvimento NexoCLI - [ACAO] - [DATA]

## Prompt Original
[Prompt completo do utilizador]

## Raciocínio
[Análise técnica e decisões]

## Alterações Implementadas
- **Ficheiro:** `path/to/file.ts`
- **Mudança:** Descrição específica
- **Impacto:** Funcionalidade afetada

## Testes Realizados
- [ ] npm run build
- [ ] ./bundle/nexocli.js --version
- [ ] ./bundle/nexocli.js "teste"
- [ ] Funcionalidade específica

## Próximos Passos
[Recomendações para continuação]
```

### 9.2. Documentação Automática
- **README.md:** Atualizado com novas funcionalidades
- **AGENTS.md:** Instruções para agentes futuros
- **CHANGELOG.md:** Histórico de alterações
- **Código:** Comentários em alterações significativas

---

## 10. Troubleshooting Comum

### 10.1. Problemas de Build
```bash
# Erro: Command not found
# Solução: Usar caminho completo
./bundle/nexocli.js em vez de nexocli

# Erro: Module not found
# Solução: Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### 10.2. Conflitos com Instalação Global
```bash
# Verificar se gemini global existe
which gemini

# Desenvolvimento isolado
cd /path/to/NexoCLI_BaseGemini
./bundle/nexocli.js "$@"
```

### 10.3. Problemas de Autenticação
```bash
# Usar OAuth Google (padrão)
# Sem configuração necessária
./bundle/nexocli.js "teste de auth"
```

---

## 11. Contacto e Suporte

### 11.1. Maintainer
- **Nome:** Nuno Salvação
- **Email:** [nexo-modeling@outlook.com](mailto:nexo-modeling@outlook.com)
- **Função:** Arquitetura e desenvolvimento

### 11.2. Para Agentes IA
- **Seguir rigorosamente** este documento
- **Consultar secções relevantes** antes de alterações
- **Validar compliance** em cada modificação
- **Documentar todas as alterações** em logs

### 11.3. Recursos de Referência
- **Gemini-CLI Original:** https://github.com/google-gemini/gemini-cli
- **Apache License 2.0:** http://www.apache.org/licenses/LICENSE-2.0
- **Node.js Documentation:** https://nodejs.org/docs/
- **n8n Documentation:** https://docs.n8n.io/

---

## 12. Contexto para Prompts Futuros

### 12.1. Informação Essencial
**Sempre incluir em prompts relacionados com NexoCLI:**

```
CONTEXTO NEXOCLI:
- Projeto: Fork personalizado do Gemini-CLI (Google LLC, Apache 2.0)
- Objetivo: Personalização mínima + integração solução híbrida
- Foco: Rebranding gemini→nexocli, comandos personalizados
- Desenvolvimento: Isolado, sem afetar instalação global
- Estrutura: 4 subprojetos (NexoCLI, Ollama, n8n, Interface)
- Compliance: Atribuição obrigatória, documentação completa
- Testes: npm run build && ./bundle/nexocli.js
```

### 12.2. Ficheiros-Chave para Referência
- `package.json` - Configuração principal
- `packages/cli/src/ui/components/AsciiArt.ts` - Arte ASCII
- `packages/cli/src/ui/components/Header.tsx` - Interface
- `packages/cli/src/ui/hooks/slashCommandProcessor.ts` - Comandos

### 12.3. Comandos Essenciais
```bash
# Desenvolvimento
npm run build
./bundle/nexocli.js --version
./bundle/nexocli.js "teste"

# Validação
npm run build && ./bundle/nexocli.js --version
```

---

**Nota Final:** Este documento é **obrigatório** para qualquer colaboração no NexoCLI. Seguir rigorosamente as instruções garante conformidade legal, arquitetural e funcional do projeto.

---

*Criado por Nuno Salvação | Baseado em Gemini-CLI (Google LLC, Apache 2.0) | Parte do ecossistema Nexo*