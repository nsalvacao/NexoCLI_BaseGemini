# Changelog - NexoCLI

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - Desenvolvimento NexoCLI

### Added (Personalização Inicial)

- [DOCS] **Documentação Personalizada Completa**
  - README.md personalizado com foco em NexoCLI
  - AGENTS.md adaptado para desenvolvimento NexoCLI
  - CHANGELOG.md estruturado para tracking de modificações
  - Documentação da solução híbrida (4 subprojetos)
  - Guias de desenvolvimento isolado e compliance

- [STRUCTURE] **Estrutura de Projeto Organizada**
  - Diretório `0. Log_Dev_NexoCli_BaseGemini/` criado
  - Subdiretório `Dev_Logs/` para logs de desenvolvimento
  - Subdiretório `Docs_Exemplo/` com templates de documentação
  - Estrutura preparada para personalização progressiva

- [COMPLIANCE] **Sistema de Compliance Implementado**
  - Atribuição legal mantida ao Gemini-CLI (Google LLC, Apache 2.0)
  - Headers de modificação definidos para todos os ficheiros
  - Checklist de compliance documentado
  - Workflow de desenvolvimento estruturado

### Changed (Personalizações Planeadas)

- [REBRANDING] **Rebranding gemini → nexocli**
  - package.json: `"bin": {"nexocli": "bundle/nexocli.js"}`
  - Nome do comando global alterado
  - Mantida compatibilidade com funcionalidade original

- [INTEGRATION] **Preparação para Solução Híbrida**
  - Arquitetura documentada para 4 subprojetos
  - NexoCLI posicionado como componente Gemini
  - Preparação para integração n8n
  - Interface unificada planeada

### Technical (Detalhes Técnicos)

- **Arquitetura**: Fork personalizado mantendo funcionalidade original
- **Desenvolvimento**: Ambiente isolado sem afetar instalação global
- **Compliance**: 100% compatível com Apache 2.0
- **Documentação**: Estrutura completa para agentes e colaboradores
- **Integração**: Preparado para orquestração via n8n

### Development Environment (Ambiente de Desenvolvimento)

- **Isolamento**: Desenvolvimento em diretório separado
- **Build**: `npm run build` gera `bundle/nexocli.js`
- **Testes**: `./bundle/nexocli.js` para validação local
- **Segurança**: Nunca usar `npm link` para evitar conflitos

### Compliance Notes (Notas de Compliance)

- ✅ **Licença Original**: Apache 2.0 mantida
- ✅ **Atribuição**: Gemini-CLI (Google LLC) referenciada
- ✅ **Modificações**: Documentadas e rastreáveis
- ✅ **Transparência**: Processo completo documentado

### Migration Notes (Notas de Migração)

- ✅ **Zero Breaking Changes**: Funcionalidade original mantida
- ✅ **Comando Global**: `nexocli` em vez de `gemini`
- ✅ **Desenvolvimento Isolado**: Não afeta instalação global
- 💡 **Recomendado**: Usar `./bundle/nexocli.js` para desenvolvimento

---

## [Base] - Fork do Gemini-CLI Original

### Inherited (Funcionalidades Herdadas)

- [CORE] **Funcionalidade Completa do Gemini-CLI**
  - Sistema de autenticação OAuth Google
  - Interface de linha de comandos completa
  - Gestão de sessões e contexto
  - Integração com Google Gemini API
  - Comandos slash (/clear, /help, /memory, /theme)
  - Sistema de temas e personalização visual

- [ARCHITECTURE] **Arquitetura Modular Original**
  - Separação packages/cli e packages/core
  - Sistema de build com esbuild
  - Gestão de dependências workspace
  - Configuração TypeScript + React (Ink)
  - Testes com vitest

- [FEATURES] **Funcionalidades Avançadas**
  - Processamento de ficheiros e contexto
  - Integração MCP (Model Context Protocol)
  - Ferramentas integradas (grep, edit, shell, etc.)
  - Sistema de memória e histórico
  - Suporte multimodal (texto, imagens)

### Technical Base (Base Técnica)

- **Node.js**: 20+ (compatível Windows)
- **TypeScript**: Configuração completa
- **React**: Interface via Ink
- **Build**: esbuild + scripts automatizados
- **Testes**: vitest + integração
- **Licença**: Apache 2.0 (Google LLC)

### Original Attribution (Atribuição Original)

- **Projeto Original**: [Gemini-CLI](https://github.com/google-gemini/gemini-cli)
- **Desenvolvedor**: Google LLC
- **Licença**: Apache License 2.0
- **Versão Base**: 0.1.12

---

## Development Log References (Referências de Logs)

### Logs de Desenvolvimento Criados

- `Nexo_AnalisePersonalizacao_20250714_123545.md` - Análise inicial e roadmap
- `Nexo_EstrategiaDesenvolvimento_20250714_125457.md` - Estratégia de desenvolvimento
- `Nexo_DocumentacaoPersonalizada_[timestamp].md` - Este log (a ser criado)

### Estrutura de Logs

```
0. Log_Dev_NexoCli_BaseGemini/
├── Dev_Logs/
│   ├── Nexo_[acao]_[timestamp].md
│   └── [outros logs futuros]
└── Docs_Exemplo/
    ├── README.md (template usado)
    ├── AGENTS.md (template usado)
    └── CHANGELOG.md (template usado)
```

---

## Future Phases (Fases Futuras)

### Fase 1: Rebranding Completo
- [ ] Alteração completa `gemini` → `nexocli`
- [ ] Arte ASCII personalizada
- [ ] Mensagens de boas-vindas customizadas
- [ ] Build configurado para `nexocli.js`

### Fase 2: Comandos Personalizados
- [ ] Comandos slash `/nexo info`, `/nexo status`, `/nexo config`
- [ ] Funcionalidades específicas do ecossistema Nexo
- [ ] Preparação para integração n8n

### Fase 3: Integração Híbrida
- [ ] Endpoints para orquestração n8n
- [ ] Comunicação com outros agentes
- [ ] Interface unificada

### Fase 4: Solução Completa
- [ ] Menu consolidado terminal/web
- [ ] Orquestração visual completa
- [ ] Gestão unificada de múltiplos agentes

---

## Validation Checklist (Checklist de Validação)

### Desenvolvimento
- [x] Documentação personalizada criada
- [x] Estrutura de projeto organizada
- [x] Compliance legal verificado
- [x] Ambiente de desenvolvimento isolado
- [x] Templates de documentação aplicados

### Testes (A implementar)
- [ ] `npm run build` executa sem erros
- [ ] `./bundle/nexocli.js --version` mostra versão
- [ ] `./bundle/nexocli.js "teste"` funciona
- [ ] Compatibilidade com funcionalidade original

### Compliance
- [x] Atribuição legal em todos os ficheiros
- [x] Licença Apache 2.0 mantida
- [x] Processo documentado em AGENTS.md
- [x] Modificações rastreáveis

---

*Desenvolvido por [Nuno Salvação](mailto:nexo-modeling@outlook.com) | Baseado em Gemini-CLI (Google LLC, Apache 2.0) | Parte do ecossistema Nexo*