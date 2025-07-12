// Criado por Claude-Code, 2025
// Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)

import winston from 'winston';
import { getDatabase } from '../database/connection.js';
import path from 'path';
import { promises as fs } from 'fs';

/**
 * Sistema de Logging Persistente para NexoCLI_BaseGemini
 * Integra Winston com SQLite para logging robusto
 */
class DatabaseLogger {
    constructor() {
        this.winston = null;
        this.db = null;
        this.isInitialized = false;
        
        // Configurações padrão
        this.config = {
            level: process.env.LOG_LEVEL || 'info',
            logToDatabase: process.env.LOG_TO_DATABASE === 'true',
            logToFiles: process.env.LOG_TO_FILES === 'true',
            maxRetentionDays: parseInt(process.env.MAX_LOG_RETENTION_DAYS) || 30,
            logDirectory: './logs'
        };
    }

    /**
     * Inicializa o sistema de logging
     */
    async initialize() {
        try {
            // Inicializar conexão com a BD
            this.db = getDatabase();
            
            // Garantir que o diretório de logs existe
            await this.ensureLogDirectory();
            
            // Configurar Winston
            await this.setupWinston();
            
            this.isInitialized = true;
            console.log('✅ Logging system initialized successfully');
            
            // Log inicial de teste
            await this.logDevelopment('logger', 'system', 'Logger system initialized', 'Medium');
            
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize logging system:', error.message);
            throw error;
        }
    }

    /**
     * Garante que o diretório de logs existe
     */
    async ensureLogDirectory() {
        try {
            await fs.access(this.config.logDirectory);
        } catch {
            console.log(`📁 Creating logs directory: ${this.config.logDirectory}`);
            await fs.mkdir(this.config.logDirectory, { recursive: true });
        }
    }

    /**
     * Configura Winston para logging em ficheiros
     */
    async setupWinston() {
        const transports = [];
        
        // Console transport (sempre ativo)
        transports.push(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
                    return `${timestamp} [${level}] ${message} ${metaStr}`;
                })
            )
        }));
        
        // File transport (se habilitado)
        if (this.config.logToFiles) {
            transports.push(new winston.transports.File({
                filename: path.join(this.config.logDirectory, 'nexocli.log'),
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                )
            }));
            
            // Ficheiro separado para erros
            transports.push(new winston.transports.File({
                filename: path.join(this.config.logDirectory, 'nexocli-errors.log'),
                level: 'error',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                )
            }));
        }
        
        this.winston = winston.createLogger({
            level: this.config.level,
            transports,
            exitOnError: false
        });
    }

    /**
     * Log de desenvolvimento técnico (conforme AGENTS.md)
     */
    async logDevelopment(agentName, logType, description, impactLevel = 'Medium', filePath = null) {
        const logData = {
            agent_name: agentName,
            log_type: logType,
            description,
            impact_level: impactLevel,
            file_path: filePath,
            timestamp: new Date().toISOString()
        };

        try {
            // Log na base de dados
            if (this.config.logToDatabase && this.db) {
                await this.db.run(`
                    INSERT INTO development_logs 
                    (agent_name, log_type, description, impact_level, file_path)
                    VALUES (?, ?, ?, ?, ?)
                `, [agentName, logType, description, impactLevel, filePath]);
            }
            
            // Log com Winston
            if (this.winston) {
                this.winston.info('DEV_LOG', logData);
            }
            
            return true;
            
        } catch (error) {
            console.error('Failed to log development entry:', error.message);
            return false;
        }
    }

    /**
     * Log de interações de chat
     */
    async logChat(sessionId, provider, model, userInput, agentResponse, responseTime = null, tokensUsed = null) {
        const logData = {
            session_id: sessionId,
            provider,
            model,
            user_input: userInput,
            agent_response: agentResponse,
            response_time_ms: responseTime,
            tokens_used: tokensUsed,
            timestamp: new Date().toISOString()
        };

        try {
            if (this.config.logToDatabase && this.db) {
                await this.db.run(`
                    INSERT INTO chat_history 
                    (session_id, provider, model, user_input, agent_response, response_time_ms, tokens_used)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [sessionId, provider, model, userInput, agentResponse, responseTime, tokensUsed]);
            }
            
            if (this.winston) {
                this.winston.info('CHAT_LOG', logData);
            }
            
            return true;
            
        } catch (error) {
            console.error('Failed to log chat entry:', error.message);
            return false;
        }
    }

    /**
     * Log de monitorização de providers
     */
    async logProvider(provider, model, action, status, responseTime = null, errorMessage = null) {
        const logData = {
            provider,
            model,
            action,
            status,
            response_time_ms: responseTime,
            error_message: errorMessage,
            timestamp: new Date().toISOString()
        };

        try {
            if (this.config.logToDatabase && this.db) {
                await this.db.run(`
                    INSERT INTO provider_logs 
                    (provider, model, action, status, response_time_ms, error_message)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [provider, model, action, status, responseTime, errorMessage]);
            }
            
            if (this.winston) {
                const level = status === 'error' ? 'error' : 'info';
                this.winston[level]('PROVIDER_LOG', logData);
            }
            
            return true;
            
        } catch (error) {
            console.error('Failed to log provider entry:', error.message);
            return false;
        }
    }

    /**
     * Log de backup
     */
    async logBackup(backupType, backupPath, status, fileSize = null, errorMessage = null) {
        const logData = {
            backup_type: backupType,
            backup_path: backupPath,
            status,
            file_size: fileSize,
            error_message: errorMessage,
            timestamp: new Date().toISOString()
        };

        try {
            if (this.config.logToDatabase && this.db) {
                await this.db.run(`
                    INSERT INTO backup_logs 
                    (backup_type, backup_path, status, file_size, error_message)
                    VALUES (?, ?, ?, ?, ?)
                `, [backupType, backupPath, status, fileSize, errorMessage]);
            }
            
            if (this.winston) {
                const level = status === 'error' ? 'error' : 'info';
                this.winston[level]('BACKUP_LOG', logData);
            }
            
            return true;
            
        } catch (error) {
            console.error('Failed to log backup entry:', error.message);
            return false;
        }
    }

    /**
     * Métodos de conveniência para logging Winston
     */
    info(message, meta = {}) {
        if (this.winston) {
            this.winston.info(message, meta);
        }
    }

    warn(message, meta = {}) {
        if (this.winston) {
            this.winston.warn(message, meta);
        }
    }

    error(message, meta = {}) {
        if (this.winston) {
            this.winston.error(message, meta);
        }
    }

    debug(message, meta = {}) {
        if (this.winston) {
            this.winston.debug(message, meta);
        }
    }

    /**
     * Obtém logs de desenvolvimento recentes
     */
    async getRecentDevelopmentLogs(days = 7, limit = 50) {
        if (!this.db) return [];
        
        try {
            const logs = await this.db.all(`
                SELECT * FROM development_logs 
                WHERE timestamp >= datetime('now', '-${days} days')
                ORDER BY timestamp DESC 
                LIMIT ?
            `, [limit]);
            
            return logs;
            
        } catch (error) {
            console.error('Failed to retrieve development logs:', error.message);
            return [];
        }
    }

    /**
     * Obtém estatísticas de providers
     */
    async getProviderStats(days = 7) {
        if (!this.db) return {};
        
        try {
            const stats = await this.db.all(`
                SELECT 
                    provider,
                    COUNT(*) as total_requests,
                    AVG(response_time_ms) as avg_response_time,
                    COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_requests,
                    COUNT(CASE WHEN status = 'error' THEN 1 END) as failed_requests
                FROM provider_logs 
                WHERE timestamp >= datetime('now', '-${days} days')
                GROUP BY provider
            `);
            
            return stats.reduce((acc, stat) => {
                acc[stat.provider] = {
                    totalRequests: stat.total_requests,
                    avgResponseTime: Math.round(stat.avg_response_time || 0),
                    successfulRequests: stat.successful_requests,
                    failedRequests: stat.failed_requests,
                    successRate: stat.total_requests > 0 
                        ? Math.round((stat.successful_requests / stat.total_requests) * 100)
                        : 0
                };
                return acc;
            }, {});
            
        } catch (error) {
            console.error('Failed to retrieve provider stats:', error.message);
            return {};
        }
    }

    /**
     * Limpeza de logs antigos
     */
    async cleanupOldLogs() {
        if (!this.db) return false;
        
        const tables = ['development_logs', 'chat_history', 'provider_logs'];
        const retentionDays = this.config.maxRetentionDays;
        
        try {
            for (const table of tables) {
                const result = await this.db.run(`
                    DELETE FROM ${table} 
                    WHERE timestamp < datetime('now', '-${retentionDays} days')
                `);
                
                if (result.changes > 0) {
                    console.log(`🧹 Cleaned up ${result.changes} old records from ${table}`);
                }
            }
            
            return true;
            
        } catch (error) {
            console.error('Failed to cleanup old logs:', error.message);
            return false;
        }
    }
}

// Singleton instance
let loggerInstance = null;

/**
 * Obtém a instância singleton do logger
 */
export function getLogger() {
    if (!loggerInstance) {
        loggerInstance = new DatabaseLogger();
    }
    return loggerInstance;
}

/**
 * Inicializa o sistema de logging
 */
export async function initializeLogger() {
    const logger = getLogger();
    await logger.initialize();
    return logger;
}

/**
 * Funções de conveniência para logging rápido
 */
export const log = {
    development: async (agent, type, description, impact = 'Medium', filePath = null) => {
        const logger = getLogger();
        return await logger.logDevelopment(agent, type, description, impact, filePath);
    },
    
    chat: async (sessionId, provider, model, userInput, agentResponse, responseTime = null, tokensUsed = null) => {
        const logger = getLogger();
        return await logger.logChat(sessionId, provider, model, userInput, agentResponse, responseTime, tokensUsed);
    },
    
    provider: async (provider, model, action, status, responseTime = null, errorMessage = null) => {
        const logger = getLogger();
        return await logger.logProvider(provider, model, action, status, responseTime, errorMessage);
    },
    
    backup: async (backupType, backupPath, status, fileSize = null, errorMessage = null) => {
        const logger = getLogger();
        return await logger.logBackup(backupType, backupPath, status, fileSize, errorMessage);
    },
    
    info: (message, meta = {}) => getLogger().info(message, meta),
    warn: (message, meta = {}) => getLogger().warn(message, meta),
    error: (message, meta = {}) => getLogger().error(message, meta),
    debug: (message, meta = {}) => getLogger().debug(message, meta)
};

export default DatabaseLogger;