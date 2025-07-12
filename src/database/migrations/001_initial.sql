-- Migração Inicial - NexoCLI_BaseGemini
-- Criado por Claude-Code, 2025
-- Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)

-- =============================================================================
-- MIGRATION 001: Initial Database Setup
-- =============================================================================
-- Esta migração cria a estrutura inicial da base de dados
-- Versão: 1.0.0
-- Data: 2025-07-11

-- Criar tabela de controlo de migrações
CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    rollback_sql TEXT
);

-- Registar esta migração
INSERT OR IGNORE INTO migrations (version, name, description, rollback_sql) VALUES
('001', 'initial', 'Initial database setup with core tables', 
'DROP TABLE IF EXISTS development_logs;
DROP TABLE IF EXISTS system_config;
DROP TABLE IF EXISTS chat_history;
DROP TABLE IF EXISTS provider_logs;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS backup_logs;
DROP VIEW IF EXISTS provider_stats;
DROP VIEW IF EXISTS active_sessions;
DROP VIEW IF EXISTS recent_dev_logs;');