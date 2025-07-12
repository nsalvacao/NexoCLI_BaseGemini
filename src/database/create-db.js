/**
 * @license
 * Criado por Claude-Code, 2025
 * Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)
 */

import sqlite3 from 'sqlite3';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve('./db/nexocli.db');

async function createDatabase() {
    try {
        // Garantir que o diretório existe
        await fs.mkdir(path.dirname(dbPath), { recursive: true });
        
        console.log('🚀 Creating database manually...');
        
        const db = new sqlite3.Database(dbPath);
        
        // Criar tabelas uma por uma
        const createDevelopmentLogs = `
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
            )
        `;
        
        const createSystemConfig = `
            CREATE TABLE IF NOT EXISTS system_config (
                key VARCHAR(100) PRIMARY KEY,
                value TEXT NOT NULL,
                description TEXT,
                category VARCHAR(50) DEFAULT 'general',
                is_sensitive BOOLEAN DEFAULT FALSE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        const createChatHistory = `
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
                metadata TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        const createProviderLogs = `
            CREATE TABLE IF NOT EXISTS provider_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                provider VARCHAR(50) NOT NULL,
                model VARCHAR(100),
                action VARCHAR(50) NOT NULL,
                status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'error', 'timeout', 'rate_limit', 'unauthorized')),
                response_time_ms INTEGER,
                request_size INTEGER,
                response_size INTEGER,
                error_message TEXT,
                error_code VARCHAR(50),
                retry_count INTEGER DEFAULT 0,
                metadata TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        const createSessions = `
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
                metadata TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        const createBackupLogs = `
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
                tables_backed_up TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run(createDevelopmentLogs, (err) => {
                    if (err) reject(err);
                    else console.log('✅ Created development_logs table');
                });
                
                db.run(createSystemConfig, (err) => {
                    if (err) reject(err);
                    else console.log('✅ Created system_config table');
                });
                
                db.run(createChatHistory, (err) => {
                    if (err) reject(err);
                    else console.log('✅ Created chat_history table');
                });
                
                db.run(createProviderLogs, (err) => {
                    if (err) reject(err);
                    else console.log('✅ Created provider_logs table');
                });
                
                db.run(createSessions, (err) => {
                    if (err) reject(err);
                    else console.log('✅ Created sessions table');
                });
                
                db.run(createBackupLogs, (err) => {
                    if (err) reject(err);
                    else console.log('✅ Created backup_logs table');
                    resolve();
                });
            });
        });
        
        // Criar índices
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('CREATE INDEX IF NOT EXISTS idx_dev_logs_agent_type ON development_logs(agent_name, log_type)');
                db.run('CREATE INDEX IF NOT EXISTS idx_dev_logs_timestamp ON development_logs(timestamp)');
                db.run('CREATE INDEX IF NOT EXISTS idx_dev_logs_impact ON development_logs(impact_level)');
                db.run('CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_history(session_id)');
                db.run('CREATE INDEX IF NOT EXISTS idx_chat_provider ON chat_history(provider)');
                db.run('CREATE INDEX IF NOT EXISTS idx_chat_timestamp ON chat_history(timestamp)');
                db.run('CREATE INDEX IF NOT EXISTS idx_provider_logs_provider ON provider_logs(provider)');
                db.run('CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON sessions(session_id)', (err) => {
                    if (err) reject(err);
                    else {
                        console.log('✅ Created all indexes');
                        resolve();
                    }
                });
            });
        });
        
        // Inserir configurações iniciais
        await new Promise((resolve, reject) => {
            const insertConfigs = `
                INSERT OR IGNORE INTO system_config (key, value, description, category) VALUES
                ('database_version', '1.0.0', 'Database schema version', 'system'),
                ('logging_enabled', 'true', 'Enable logging to database', 'logging'),
                ('backup_enabled', 'true', 'Enable automatic backups', 'backup'),
                ('default_provider', 'gemini', 'Default AI provider', 'providers'),
                ('fallback_enabled', 'true', 'Enable provider fallback', 'providers'),
                ('max_log_retention_days', '30', 'Maximum days to retain logs', 'logging'),
                ('backup_retention_days', '7', 'Maximum days to retain backups', 'backup')
            `;
            
            db.run(insertConfigs, (err) => {
                if (err) reject(err);
                else {
                    console.log('✅ Inserted initial system configurations');
                    resolve();
                }
            });
        });
        
        db.close((err) => {
            if (err) {
                console.error('❌ Error closing database:', err);
            } else {
                console.log('✅ Database created successfully at:', dbPath);
            }
        });
        
    } catch (error) {
        console.error('❌ Error creating database:', error);
        throw error;
    }
}

createDatabase().catch(console.error);