# Contributing to NexoCLI

---

> **NexoCLI** é um fork personalizado do [Gemini-CLI](https://github.com/google-gemini/gemini-cli) da Google LLC (Apache 2.0). Todas as contribuições devem respeitar o licenciamento original e seguir as diretrizes específicas para o ecossistema Nexo.
>
> **🎯 Objetivo:** Personalização mínima do Gemini-CLI mantendo 100% de compatibilidade e preparando integração com solução híbrida.

---

## 📋 **Pré-requisitos para Contribuir**

### **🔍 Leitura Obrigatória**
Antes de qualquer contribuição, deve ler **integralmente**:

1. **[AGENTS.md](AGENTS.md)** - Guia completo para agentes e colaboradores
2. **[README.md](README.md)** - Documentação principal do projeto
3. **[CHANGELOG.md](CHANGELOG.md)** - Histórico de alterações
4. **Este documento** - Workflow de contribuição

### **📚 Contexto do Projeto**
- **Projeto Original:** [Gemini-CLI](https://github.com/google-gemini/gemini-cli) (Google LLC)
- **Licença:** Apache License 2.0 (mantida)
- **Tipo:** Fork personalizado com personalização mínima
- **Foco:** Rebranding `gemini` → `nexocli` + integração solução híbrida

### **🏗️ Arquitetura da Solução**
O NexoCLI faz parte de um ecossistema de 4 subprojetos:
- **NexoCLI** (Este repo) - Personalização Gemini-CLI
- **Ollama** - Modelos LLM locais
- **n8n Orchestrator** - Orquestração visual
- **Interface Unificada** - Menu consolidado

---

## 🚀 **Setup de Desenvolvimento**

### **1. Fork e Clone**
```bash
# Fork no GitHub e clone localmente
git clone https://github.com/YOUR_USERNAME/NexoCLI_BaseGemini
cd NexoCLI_BaseGemini

# Adicionar remote upstream
git remote add upstream https://github.com/nsalvacao/NexoCLI_BaseGemini
```

### **2. Instalação de Dependências**
```bash
# Instalar dependências
npm install

# Verificar instalação
npm run build
./bundle/nexocli.js --version
```

### **3. Ambiente de Desenvolvimento Isolado**
```bash
# ⚠️ IMPORTANTE: Nunca usar npm link
# Sempre executar localmente para não afetar instalação global

# Criar alias para desenvolvimento
echo 'alias nexocli-dev="./bundle/nexocli.js"' >> ~/.bashrc
source ~/.bashrc

# Testar funcionamento
nexocli-dev "Teste de desenvolvimento"
```

---

## 📝 **Workflow de Contribuição**

### **1. Antes de Começar**
```bash
# Sincronizar com upstream
git fetch upstream
git checkout main
git merge upstream/main

# Criar branch para feature/fix
git checkout -b tipo/nome-descritivo

# Exemplos:
git checkout -b feat/arte-ascii-nexo
git checkout -b fix/comando-slash-config
git checkout -b docs/atualizar-readme
```

### **2. Desenvolvimento**

#### **2.1. Checklist Pré-Desenvolvimento**
- [ ] Ler [AGENTS.md](AGENTS.md) para guidelines específicas
- [ ] Verificar se alteração não quebra compatibilidade
- [ ] Planear testes em VM Windows
- [ ] Identificar ficheiros a modificar

#### **2.2. Implementação**
```bash
# Fazer alterações seguindo AGENTS.md
# Adicionar header de atribuição em ficheiros modificados:

# Exemplo para TypeScript:
// Modificado por [Seu Nome], 2025
// Baseado em gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
// Parte do NexoCLI_BaseGemini - Personalização para ecossistema Nexo
```

#### **2.3. Testes Obrigatórios**
```bash
# Testes básicos locais
npm run build                   # Build sem erros
./bundle/nexocli.js --version   # Versão correta
./bundle/nexocli.js "teste"     # Funcionalidade básica
./bundle/nexocli.js --help      # Help funcional

# Verificar rebranding
./bundle/nexocli.js --version | grep -i nexo

# Testar comandos específicos se aplicável
./bundle/nexocli.js /help
./bundle/nexocli.js /clear
```

### **3. Documentação**

#### **3.1. Atualizar Documentação**
- **README.md:** Se adicionar funcionalidades
- **CHANGELOG.md:** OBRIGATÓRIO para todas as alterações
- **AGENTS.md:** Se alterar workflow ou adicionar guidelines

#### **3.2. Log de Desenvolvimento**
Criar log detalhado em `0. Log_Dev_NexoCli_BaseGemini/Dev_Logs/`:

**Formato:** `[Seu Nome]_[acao]_[YYYYMMDD_HHMMSS].md`

**Template:**
```markdown
# Log de Desenvolvimento - [ACAO] - [DATA]

## Contexto
- **Feature/Bug:** [Descrição]
- **Branch:** [nome-branch]
- **Ficheiros Modificados:** [lista]

## Alterações Implementadas
- [Detalhe técnico 1]
- [Detalhe técnico 2]

## Testes Realizados
- [ ] npm run build
- [ ] ./bundle/nexocli.js --version
- [ ] ./bundle/nexocli.js "teste"
- [ ] Teste específico da funcionalidade

## Próximos Passos
- [Se aplicável]
```

### **4. Commit e Push**
```bash
# Adicionar alterações
git add .

# Commit com mensagem estruturada
git commit -m "tipo: descrição breve

- Detalhe 1 da alteração
- Detalhe 2 da alteração
- Log: [nome-do-log-criado].md

Refs: #issue-number (se aplicável)"

# Push para seu fork
git push origin tipo/nome-descritivo
```

### **5. Pull Request**

#### **5.1. Criar PR**
- **Título:** `[TIPO] Descrição clara da alteração`
- **Descrição:** Usar template abaixo

**Template de PR:**
```markdown
## Alterações Implementadas
- [ ] Funcionalidade/fix implementado
- [ ] Testes básicos realizados
- [ ] Documentação atualizada
- [ ] Compliance verificado

## Ficheiros Modificados
- `path/to/file1.ts` - [descrição]
- `path/to/file2.tsx` - [descrição]

## Testes Realizados
- [ ] Build local sem erros
- [ ] Funcionamento básico verificado
- [ ] Compatibilidade mantida
- [ ] Teste em VM Windows (se aplicável)

## Compliance Checklist
- [ ] Header de atribuição adicionado
- [ ] Apache 2.0 respeitada
- [ ] CHANGELOG.md atualizado
- [ ] Log de desenvolvimento criado

## Log de Desenvolvimento
`0. Log_Dev_NexoCli_BaseGemini/Dev_Logs/[nome-do-log].md`

## Observações
[Qualquer informação adicional]
```

---

## ✅ **Guidelines Específicas**

### **🔒 Compliance e Licenciamento**

#### **Obrigatório em TODOS os Commits:**
- [ ] Header de atribuição em ficheiros modificados
- [ ] Nunca incluir credenciais ou chaves API
- [ ] CHANGELOG.md atualizado
- [ ] Log de desenvolvimento criado

#### **Atribuição Legal:**
```typescript
// Modificado por [Seu Nome], 2025
// Baseado em gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
// Parte do NexoCLI_BaseGemini - Personalização para ecossistema Nexo
```

### **🎯 Tipos de Contribuição Aceitas**

#### **✅ Bem-vindas:**
- **Rebranding:** `gemini` → `nexocli`
- **Arte ASCII:** Logo personalizado Nexo
- **Comandos slash:** `/nexo info`, `/nexo status`, etc.
- **Interface:** Mensagens de boas-vindas personalizadas
- **Documentação:** Melhorias e correções
- **Bug fixes:** Correções que mantêm compatibilidade

#### **⚠️ Requerem Discussão:**
- **Arquitetura:** Mudanças significativas
- **Dependências:** Adicionar/remover dependências
- **API:** Alterações em interfaces públicas
- **Integração:** Preparação para n8n/solução híbrida

#### **❌ Não Aceitas:**
- **Breaking changes** sem justificação
- **Funcionalidades** que quebrem compatibilidade original
- **Dependências desnecessárias**
- **Código** sem atribuição adequada

### **🧪 Testes e Validação**

#### **Antes de Submeter PR:**
```bash
# Checklist obrigatório
npm run build                   # ✅ Build success
./bundle/nexocli.js --version   # ✅ Versão OK
./bundle/nexocli.js "teste"     # ✅ Funcionalidade básica
grep -r "API_KEY" .            # ✅ Sem credenciais em código
```

#### **Teste em VM Windows:**
- **Obrigatório** para mudanças significativas
- **Recomendado** para todas as contribuições
- **Documentar** resultados no log de desenvolvimento

---

## 🚨 **Resolução de Problemas**

### **Problemas Comuns**

#### **"Command not found: nexocli"**
```bash
# ✅ Correto: Usar caminho local
./bundle/nexocli.js

# ❌ Incorreto: Tentar usar comando global
nexocli
```

#### **"Build failed"**
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### **"Cannot overwrite global installation"**
```bash
# ⚠️ NUNCA usar npm link
# Sempre desenvolver localmente
cd /path/to/NexoCLI_BaseGemini
./bundle/nexocli.js
```

### **Obter Ajuda**
1. **Consultar [AGENTS.md](AGENTS.md)** - Guia completo
2. **Verificar logs** em `Dev_Logs/` - Histórico detalhado
3. **Abrir issue** - Para dúvidas específicas
4. **Email direto** - [nexo-modeling@outlook.com](mailto:nexo-modeling@outlook.com)

---

## 🎯 **Roadmap de Contribuições**

### **Fase 1: Rebranding Básico** (Atual)
- [ ] Alterar `package.json`: `"bin": {"nexocli": "bundle/nexocli.js"}`
- [ ] Arte ASCII personalizada em `AsciiArt.ts`
- [ ] Mensagens de boas-vindas em `Header.tsx`
- [ ] Build configurado para `nexocli.js`

### **Fase 2: Comandos Personalizados**
- [ ] `/nexo info` - Informações do sistema
- [ ] `/nexo status` - Status de agentes
- [ ] `/nexo config` - Configuração específica
- [ ] Extensão do `slashCommandProcessor.ts`

### **Fase 3: Preparação Integração**
- [ ] Endpoints para n8n
- [ ] APIs de comunicação
- [ ] Configuração modular

### **Fase 4: Interface Unificada**
- [ ] Menu consolidado
- [ ] Integração com outros agentes

---

## 👥 **Comunidade e Suporte**

### **Maintainer Principal**
- **Nome:** Nuno Salvação
- **Email:** [nexo-modeling@outlook.com](mailto:nexo-modeling@outlook.com)
- **GitHub:** [@nsalvacao](https://github.com/nsalvacao)

### **Como Contribuir**
1. **Issues:** Para bugs e sugestões
2. **Discussions:** Para ideias e questões gerais
3. **Pull Requests:** Para contribuições de código
4. **Email:** Para questões de compliance ou arquitetura

### **Código de Conduta**
- **Respeitoso:** Comunicação profissional
- **Colaborativo:** Espírito de equipa
- **Compliance:** Respeitar licenciamento
- **Qualidade:** Código bem testado e documentado

---

## 📄 **Recursos Adicionais**

### **Documentação Oficial**
- **[Gemini-CLI Original](https://github.com/google-gemini/gemini-cli)** - Projeto base
- **[Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)** - Licença
- **[Keep a Changelog](https://keepachangelog.com/)** - Formato changelog
- **[Semantic Versioning](https://semver.org/)** - Versionamento

### **Ferramentas de Desenvolvimento**
- **Node.js 20+** - Runtime necessário
- **npm** - Gestão de dependências
- **TypeScript** - Linguagem principal
- **esbuild** - Sistema de build

---

**Obrigado por contribuir para o NexoCLI! 🚀**

*Desenvolvido por [Nuno Salvação](mailto:nexo-modeling@outlook.com) | Baseado em Gemini-CLI (Google LLC, Apache 2.0) | Parte do ecossistema Nexo*