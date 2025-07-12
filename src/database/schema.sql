-- NexoCLI_BaseGemini Database Schema
-- Criado por Claude-Code, 2025
-- Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)

-- =============================================================================
-- DEVELOPMENT LOGS TABLE
-- =============================================================================
-- Logs técnicos de desenvolvimento conforme AGENTS.md
CREATE TABLE IF NOT EXISTS development_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    agent_name VARCHAR(100) NOT NULL,
    log_type VARCHAR(50) NOT NULL CHECK (log_type IN ('desenvolvimento', 'bugfix', 'feature', 'refactor', 'test', 'deployment')),
    file_path TEXT,
    description TEXT NOT NULL,
    impact_level VARCHAR(20) NOT NULL CHECK (impact_level IN ('Critical', 'High', 'Medium', 'Low')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index para pesquisas por agente e tipo
CREATE INDEX IF NOT EXISTS idx_dev_logs_agent_type ON development_logs(agent_name, log_type);
CREATE INDEX IF NOT EXISTS idx_dev_logs_timestamp ON development_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_dev_logs_impact ON development_logs(impact_level);

-- =============================================================================
-- SYSTEM CONFIGURATION TABLE
-- =============================================================================
-- Configurações e estado do sistema
CREATE TABLE IF NOT EXISTS system_config (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    is_sensitive BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Configurações iniciais do sistema
INSERT OR IGNORE INTO system_config (key, value, description, category) VALUES
('database_version', '1.0.0', 'Database schema version', 'system'),
('logging_enabled', 'true', 'Enable logging to database', 'logging'),
('backup_enabled', 'true', 'Enable automatic backups', 'backup'),
('default_provider', 'gemini', 'Default AI provider', 'providers'),
('fallback_enabled', 'true', 'Enable provider fallback', 'providers'),
('max_log_retention_days', '30', 'Maximum days to retain logs', 'logging'),
('backup_retention_days', '7', 'Maximum days to retain backups', 'backup');

-- =============================================================================
-- CHAT HISTORY TABLE
-- =============================================================================
-- Histórico de interações com providers (preparação para fases seguintes)
CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    user_input TEXT NOT NULL,
    agent_response TEXT NOT NULL,
    response_time_ms INTEGER,
    tokens_used INTEGER,
    cost_estimate DECIMAL(10,6),
    status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'error', 'timeout', 'cancelled')),
    error_message TEXT,
    metadata TEXT, -- JSON string para dados adicionais
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes para pesquisas eficientes
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_provider ON chat_history(provider);
CREATE INDEX IF NOT EXISTS idx_chat_timestamp ON chat_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_chat_status ON chat_history(status);

-- =============================================================================
-- PROVIDER LOGS TABLE
-- =============================================================================
-- Monitorização de performance e estado dos providers
CREATE TABLE IF NOT EXISTS provider_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    action VARCHAR(50) NOT NULL, -- 'authenticate', 'request', 'fallback', 'error'
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'error', 'timeout', 'rate_limit', 'unauthorized')),
    response_time_ms INTEGER,
    request_size INTEGER,
    response_size INTEGER,
    error_message TEXT,
    error_code VARCHAR(50),
    retry_count INTEGER DEFAULT 0,
    metadata TEXT, -- JSON string para dados específicos do provider
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes para análise de performance
CREATE INDEX IF NOT EXISTS idx_provider_logs_provider ON provider_logs(provider);
CREATE INDEX IF NOT EXISTS idx_provider_logs_status ON provider_logs(status);
CREATE INDEX IF NOT EXISTS idx_provider_logs_timestamp ON provider_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_provider_logs_action ON provider_logs(action);

-- =============================================================================
-- DOCUMENT STORE TABLE
-- =============================================================================
-- Armazenamento de documentos críticos do projeto (AGENTS.md, ROADMAP.md, CHANGELOG.md)
CREATE TABLE IF NOT EXISTS document_store (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doc_name VARCHAR(100) UNIQUE NOT NULL,
    version VARCHAR(50),
    content TEXT NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index para pesquisas por nome do documento
CREATE INDEX IF NOT EXISTS idx_document_store_doc_name ON document_store(doc_name);

-- =============================================================================
-- AGENT SESSIONS TABLE
-- =============================================================================
-- Gestão de sessões de utilizador
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    user_id VARCHAR(100),
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    total_messages INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    total_cost DECIMAL(10,6) DEFAULT 0,
    session_name VARCHAR(200),
    session_status VARCHAR(20) DEFAULT 'active' CHECK (session_status IN ('active', 'completed', 'error', 'cancelled')),
    metadata TEXT, -- JSON string para configurações da sessão
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes para gestão de sessões
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_provider ON sessions(provider);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(session_status);
CREATE INDEX IF NOT EXISTS idx_sessions_started ON sessions(started_at);

-- =============================================================================
-- BACKUP LOGS TABLE
-- =============================================================================
-- Histórico de backups realizados
CREATE TABLE IF NOT EXISTS backup_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    backup_type VARCHAR(50) NOT NULL CHECK (backup_type IN ('manual', 'automatic', 'migration')),
    backup_path TEXT NOT NULL,
    file_size INTEGER,
    compression_ratio DECIMAL(5,2),
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'error', 'partial')),
    error_message TEXT,
    backup_duration_ms INTEGER,
    tables_backed_up TEXT, -- JSON array of table names
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index para gestão de backups
CREATE INDEX IF NOT EXISTS idx_backup_logs_timestamp ON backup_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_backup_logs_type ON backup_logs(backup_type);
CREATE INDEX IF NOT EXISTS idx_backup_logs_status ON backup_logs(status);

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- =============================================================================
-- Trigger para atualizar updated_at automaticamente para system_config
CREATE TRIGGER IF NOT EXISTS update_system_config_timestamp
    AFTER UPDATE ON system_config
    FOR EACH ROW
BEGIN
    UPDATE system_config 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE key = NEW.key;
END;

-- Trigger para atualizar updated_at automaticamente para development_logs
CREATE TRIGGER IF NOT EXISTS update_development_logs_timestamp
    AFTER UPDATE ON development_logs
    FOR EACH ROW
BEGIN
    UPDATE development_logs 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- Trigger para atualizar updated_at automaticamente para agent_sessions
CREATE TRIGGER IF NOT EXISTS update_agent_sessions_timestamp
    AFTER UPDATE ON agent_sessions
    FOR EACH ROW
BEGIN
    UPDATE agent_sessions 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- Trigger para atualizar updated_at automaticamente para roadmap_milestones
CREATE TRIGGER IF NOT EXISTS update_roadmap_milestones_timestamp
    AFTER UPDATE ON roadmap_milestones
    FOR EACH ROW
BEGIN
    UPDATE roadmap_milestones 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- Trigger para atualizar updated_at automaticamente para sessions
CREATE TRIGGER IF NOT EXISTS update_sessions_timestamp
    AFTER UPDATE ON sessions
    FOR EACH ROW
BEGIN
    UPDATE sessions 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================
-- View para estatísticas de providers
CREATE VIEW IF NOT EXISTS provider_stats AS
SELECT 
    provider,
    COUNT(*) as total_requests,
    AVG(response_time_ms) as avg_response_time,
    COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_requests,
    COUNT(CASE WHEN status = 'error' THEN 1 END) as failed_requests,
    ROUND(COUNT(CASE WHEN status = 'success' THEN 1 END) * 100.0 / COUNT(*), 2) as success_rate,
    DATE(timestamp) as date
FROM provider_logs
GROUP BY provider, DATE(timestamp)
ORDER BY date DESC, provider;

-- View para sessões ativas
CREATE VIEW IF NOT EXISTS active_sessions AS
SELECT 
    s.session_id,
    s.provider,
    s.model,
    s.started_at,
    s.total_messages,
    s.total_tokens,
    s.session_name,
    COUNT(ch.id) as message_count,
    MAX(ch.timestamp) as last_activity
FROM sessions s
LEFT JOIN chat_history ch ON s.session_id = ch.session_id
WHERE s.session_status = 'active'
GROUP BY s.session_id
ORDER BY last_activity DESC;

-- View para logs de desenvolvimento recentes
CREATE VIEW IF NOT EXISTS recent_dev_logs AS
SELECT 
    timestamp,
    agent_name,
    log_type,
    impact_level,
    SUBSTR(description, 1, 100) as description_preview,
    file_path,
    session_id,
    milestone_id,
    commit_hash
FROM development_logs
WHERE timestamp >= datetime('now', '-7 days')
ORDER BY timestamp DESC;

-- View para sessões de agente com seus objetivos
CREATE VIEW IF NOT EXISTS agent_session_summary AS
SELECT
    session_id,
    agent_name,
    start_time,
    end_time,
    session_objective,
    (JULIANDAY(end_time) - JULIANDAY(start_time)) * 24 * 60 * 60 AS duration_seconds
FROM agent_sessions
ORDER BY start_time DESC;

-- View para o progresso do roadmap
CREATE VIEW IF NOT EXISTS roadmap_progress AS
SELECT
    milestone_id,
    phase_name,
    description,
    status,
    start_date,
    completion_date
FROM roadmap_milestones
ORDER BY start_date ASC;

-- View para uma visão consolidada das atividades de desenvolvimento
CREATE VIEW IF NOT EXISTS development_activity_summary AS
SELECT
    dl.id AS log_id,
    dl.timestamp,
    dl.agent_name,
    dl.log_type,
    dl.file_path,
    dl.description AS log_description,
    dl.impact_level,
    dl.commit_hash,
    asess.session_id,
    asess.session_objective,
    rm.milestone_id,
    rm.phase_name,
    rm.description AS milestone_description,
    rm.status AS milestone_status
FROM development_logs dl
LEFT JOIN agent_sessions asess ON dl.session_id = asess.session_id
LEFT JOIN roadmap_milestones rm ON dl.milestone_id = rm.milestone_id
ORDER BY dl.timestamp DESC;

-- =============================================================================
-- PRAGMA SETTINGS FOR PERFORMANCE
-- =============================================================================
-- Configurações para melhor performance
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = 10000;
PRAGMA temp_store = MEMORY;
PRAGMA mmap_size = 268435456; -- 256MB