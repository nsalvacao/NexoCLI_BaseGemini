# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - Fase 3 (Modularidade de Providers)

### Added (Fase 3 - Multi-Provider Architecture)

- [ARCHITECTURE] **BaseProvider Interface Expandida**
  - Interface abstrata completa para todos os providers
  - Métodos obrigatórios: `initialize()`, `authenticate()`, `sendMessage()`, `listModels()`, `validateCredentials()`, `testConnection()`
  - Métodos opcionais com implementação padrão: `changeModel()`, `getQuotaInfo()`, `healthCheck()`, `reconfigure()`
  - Sistema de validação de configuração integrado
  - Sanitização automática de credenciais sensíveis

- [CONFIG] **Sistema de Gestão de Environment (.env)**
  - `EnvManager` para detecção automática de providers disponíveis
  - Suporte multi-provider: Gemini, OpenRouter, Anthropic, OpenAI
  - Detecção inteligente de tipos de autenticação (API key, OAuth, Vertex AI)
  - Configuração por prioridade e fallbacks automáticos
  - Geração de ficheiros .env exemplo

- [VALIDATION] **Sistema de Validação de Credenciais Robusto**
  - `CredentialValidator` com validação real de APIs
  - Validação específica por provider e tipo de autenticação
  - Testes de conectividade e saúde de credenciais
  - Validação em paralelo para múltiplos providers
  - Tratamento defensivo de erros de rede e rate limiting

- [FACTORY] **ProviderFactory Expandido**
  - Criação automática de providers baseada em configuração .env
  - Integração com `EnvManager` e `CredentialValidator`
  - Sistema de diagnóstico completo para troubleshooting
  - Conversão automática de configurações entre formatos
  - Suporte a providers dinâmicos e lazy loading

- [DIAGNOSTIC] **Sistema de Diagnóstico Avançado**
  - Comando `npm run diagnose` para diagnóstico completo
  - Verificação de sistema, environment, base de dados e providers
  - Recomendações automáticas para resolução de problemas
  - Modos: full, quick, health, ready
  - Relatórios estruturados com sumários e estatísticas

- [GEMINI] **Provider Gemini Refatorado**
  - Implementação completa da interface `BaseProvider`
  - Método `validateCredentials()` com testes reais de API
  - Validação específica por tipo de autenticação
  - Requisitos de configuração estruturados
  - Compatibilidade total com Fase 2 mantida

- [TESTS] **Testes de Arquitetura**
  - Suite completa de testes para validar modularidade
  - Testes de interface `BaseProvider` e implementações
  - Testes de `ProviderFactory` e padrões de design
  - Testes de `EnvManager` e configurações
  - Comando `npm run test:architecture`

- [CLI] **Comandos de Diagnóstico**
  - `npm run diagnose` - Diagnóstico completo do sistema
  - `npm run diagnose:quick` - Verificação rápida de providers
  - `npm run diagnose:health` - Status de saúde em formato API
  - Integração com sistema de troubleshooting

### Enhanced (Melhorias na Fase 3)

- [COMPATIBILITY] **Compatibilidade Mantida**
  - Todos os comandos da Fase 2 continuam funcionais
  - OAuth gratuito do Gemini preservado
  - Base de dados e logging mantêm funcionalidade completa
  - Zero breaking changes na interface existente

- [EXTENSIBILITY] **Preparação para Fase 4**
  - Arquitetura pronta para OpenRouter, Anthropic, OpenAI
  - Sistema de configuração escalável para novos providers
  - Factory pattern extensível com registro dinâmico
  - Validação de credenciais preparada para APIs externas

### Technical Details (Detalhes Técnicos)

- **Arquitetura**: Padrão Strategy + Factory + Singleton para providers
- **Configuração**: Sistema hierárquico .env > config > defaults
- **Validação**: Defensiva com fallbacks e rate limit handling
- **Logging**: Integração completa com sistema existente
- **Testes**: Cobertura de arquitetura e integração

### Migration Notes (Notas de Migração)

- ✅ **Sem migração necessária** - Compatibilidade total com Fase 2
- ✅ **Configuração opcional** - Sistema detecta automaticamente providers
- ✅ **Comandos antigos** - Continuam funcionando normalmente
- 💡 **Recomendado**: Execute `npm run diagnose` para verificar configuração

## [1.0.0] - 2025-07-11

### Added (Fase 1 - Base de Dados & Logging Core)

- [BD] SQLite database system with complete schema implementation
- [BD] Database connection manager with singleton pattern and performance optimization
- [BD] Comprehensive schema with tables: development_logs, system_config, chat_history, provider_logs, sessions, backup_logs
- [BD] Database views for common queries (provider_stats, active_sessions, recent_dev_logs)
- [BD] PRAGMA settings for optimal SQLite performance (WAL mode, memory temp_store)
- [LOGGING] Winston-based logging system with SQLite persistence
- [LOGGING] Multi-level logging (development, chat, provider, backup)
- [LOGGING] Automatic log rotation and cleanup system
- [BACKUP] Comprehensive backup system with automated scheduling
- [BACKUP] Backup retention policies and cleanup
- [BACKUP] Backup validation and restore functionality
- [MIGRATIONS] Migration system with version control
- [MIGRATIONS] Database schema versioning and integrity checks
- [MIGRATIONS] Rollback capabilities for safe schema changes
- [TESTS] Complete test suite for database persistence
- [TESTS] Performance tests for bulk operations
- [TESTS] Integrity validation tests
- [WINDOWS] Multi-platform alias creation scripts (PowerShell, Batch, Bash)
- [WINDOWS] Windows-native compatibility validation
- [CONFIG] Environment configuration with .env support
- [CONFIG] Project structure following ROADMAP.md specifications

### Technical

- [ARCH] Modular architecture with separation of concerns
- [ARCH] Singleton pattern for database connections
- [ARCH] Factory pattern for component initialization
- [ARCH] Transaction support for atomic operations
- [PERF] Optimized SQLite configuration for better performance
- [PERF] Efficient indexing strategy for common queries
- [PERF] Memory-based temporary storage
- [SECURITY] Input validation and SQL injection prevention
- [SECURITY] Secure credential handling
- [COMPAT] Cross-platform path handling
- [COMPAT] Windows PowerShell and Command Prompt support
- [COMPAT] Unix/Linux/macOS shell compatibility

### Infrastructure

- [BUILD] Complete package.json with all dependencies
- [BUILD] ESLint and Prettier configuration
- [BUILD] TypeScript configuration for type checking
- [BUILD] Comprehensive .gitignore for project-specific files
- [BUILD] Multi-platform alias setup scripts
- [BUILD] Database initialization and testing scripts

### Compliance

- [LEGAL] Apache 2.0 license compliance maintained
- [LEGAL] Proper attribution to Gemini-CLI (Google LLC) in all files
- [LEGAL] Copyright notices in all created files
- [DOCS] AGENTS.md compliance with logging requirements
- [DOCS] Technical documentation for all components

## [2.0.0] - 2025-07-11

### Added (Fase 2 - Provider Gemini MVP)

- [OAUTH] Complete OAuth system adapted from Gemini-CLI original
- [OAUTH] Support for multiple authentication types (OAuth, API Key, Vertex AI, Cloud Shell)
- [OAUTH] Simulated OAuth flow with 60 req/min + 1000/day free quota compatibility
- [CLIENT] Gemini client adapted from original with full API compatibility
- [CLIENT] Multi-client support (OAuth, API Key, Vertex AI, Cloud Shell)
- [CLIENT] Session management with unique session IDs
- [CLIENT] Token usage tracking and response time monitoring
- [PROVIDER] Base provider interface for future multi-provider support
- [PROVIDER] Complete Gemini provider implementation with logging integration
- [PROVIDER] Provider factory pattern for extensible architecture
- [PROVIDER] Support for model switching and configuration management
- [CLI] Functional CLI with command-line argument processing
- [CLI] Interactive help system and version information
- [CLI] Test mode for connection validation
- [CLI] Message sending with real-time logging
- [CLI] Cross-platform compatibility (Windows, Linux, macOS)
- [CONFIG] Advanced settings management with environment variable support
- [CONFIG] Configurable timeouts, models, and authentication methods
- [CONFIG] Cross-platform path handling and directory management
- [LOGGING] Full integration with Phase 1 logging system
- [LOGGING] Real-time chat history logging to SQLite database
- [LOGGING] Provider action logging with performance metrics
- [LOGGING] Development logging for debugging and monitoring
- [TESTS] Comprehensive test suite with 51 unit and integration tests
- [TESTS] 100% test success rate with automated validation
- [TESTS] OAuth authentication testing
- [TESTS] Provider functionality testing
- [TESTS] CLI integration testing
- [TESTS] Cross-platform compatibility testing

### Technical

- [ARCH] Modular provider architecture ready for Phase 3 expansion
- [ARCH] Singleton pattern for database connections and settings
- [ARCH] Factory pattern for provider instantiation
- [ARCH] Adapter pattern for logging system compatibility
- [PERF] Optimized client initialization and authentication flow
- [PERF] Efficient session management and cleanup
- [PERF] Memory-efficient logging with database persistence
- [COMPAT] Full ES module compatibility with Node.js 20+
- [COMPAT] Cross-platform script support (PowerShell, Batch, Bash)
- [COMPAT] Environment variable handling across platforms
- [SECURITY] Input validation and sanitization
- [SECURITY] Secure credential handling with environment variables
- [SECURITY] No credential exposure in logging

### Infrastructure

- [BUILD] Updated package.json with Phase 2 dependencies
- [BUILD] Vitest configuration for comprehensive testing
- [BUILD] Cross-platform npm scripts for development and testing
- [BUILD] Logger adapter for Phase 1 compatibility
- [BUILD] Automated test execution and reporting

### Compliance

- [LEGAL] Maintained Apache 2.0 license compliance
- [LEGAL] Proper attribution to Gemini-CLI original code
- [LEGAL] Copyright notices in all adapted files
- [DOCS] Complete technical documentation for all components
- [DOCS] Comprehensive changelog with detailed implementation notes

## [3.1.0] - 2025-07-11

### Added (Melhorias de Rastreabilidade e Debug)

- [BD] Nova tabela `document_store` para armazenar o conteúdo de documentos críticos do projeto (`AGENTS.md`, `ROADMAP.md`, `CHANGELOG.md`), tornando a base de dados autosuficiente.
- [BD] Nova view `development_activity_summary` para fornecer uma visão consolidada das atividades de desenvolvimento, ligando logs a sessões de agente e marcos do roadmap.
- [DATA] População da tabela `document_store` com o conteúdo inicial de `AGENTS.md`, `ROADMAP.md` e `CHANGELOG.md`.

### Changed

- [BD] Schema da base de dados (`src/database/schema.sql`) atualizado para a versão 3.0.

### Fixed

- N/A

## [3.0.0] - 2025-07-11

### Added (Fase de Consolidação e Rastreabilidade)

- [BD] Nova tabela `agent_sessions` para registar sessões de trabalho dos agentes.
- [BD] Nova tabela `roadmap_milestones` para digitalizar o `ROADMAP.md` e ligar o trabalho técnico aos objetivos estratégicos.
- [BD] Colunas `session_id`, `milestone_id` e `commit_hash` adicionadas à tabela `development_logs` para rastreabilidade aprimorada.
- [BD] `CHECK constraint` da coluna `log_type` em `development_logs` expandida para incluir o valor `milestone`.
- [BD] Novos triggers para `agent_sessions` e `roadmap_milestones` para atualização automática de `updated_at`.
- [BD] Novas views `agent_session_summary` e `roadmap_progress` para facilitar a consulta e análise dos dados de contexto.
- [DATA] População da base de dados com sessões de agente e marcos do roadmap.
- [DATA] Atualização dos logs de desenvolvimento existentes com `session_id` e `milestone_id`.
- [DATA] Inserção dos logs de desenvolvimento do Gemini-Tool na base de dados.

### Changed

- [BD] Schema da base de dados (`src/database/schema.sql`) atualizado para a versão 2.0.
- [SCRIPTS] Script `scripts/consolidate_history.js` corrigido para compatibilidade com Módulos ES e para lidar com o tipo de log `milestone`.
- [SCRIPTS] Script `scripts/populate_context_data.js` atualizado para popular as novas tabelas e associar os logs de desenvolvimento às sessões e marcos.
- [SCRIPTS] Script `scripts/migrate_schema_v2.js` criado para gerir a migração do schema da base de dados.

### Fixed

- [BUILD] Erro de incompatibilidade do `sqlite3` no Windows resolvido através de `npm rebuild sqlite3`.

## [Unreleased]

### Added

- Initial project setup.
- Forked from [Gemini-CLI by Google LLC](https://github.com/google-gemini/gemini-cli).
- Added `README.md`, `AGENTS.md`, and `LICENSE`.
