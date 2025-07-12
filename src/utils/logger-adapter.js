/**
 * @license
 * Modificado por Claude-Code, 2025
 * Adaptador para compatibilidade com logger da Fase 1
 */

import DatabaseLogger, { log } from './logger.js';

/**
 * Classe adaptadora para manter compatibilidade
 */
class LoggerAdapter {
  constructor() {
    this.dbLogger = new DatabaseLogger();
    this.initialized = false;
  }

  /**
   * Inicializa o logger se necessário
   */
  async ensureInitialized() {
    if (!this.initialized) {
      try {
        await this.dbLogger.initialize();
        this.initialized = true;
      } catch (error) {
        console.warn('Logger initialization failed, using fallback:', error.message);
        this.initialized = false;
      }
    }
  }

  /**
   * Log de desenvolvimento
   */
  async logDevelopment(agent, type, description, impact = 'Medium', filePath = null) {
    await this.ensureInitialized();
    
    if (this.initialized) {
      return await this.dbLogger.logDevelopment(agent, type, description, impact, filePath);
    } else {
      // Fallback para console
      console.log(`[DEV] ${agent} - ${type}: ${description} (${impact})`);
      return true;
    }
  }

  /**
   * Log de chat
   */
  async logChatHistory(data) {
    await this.ensureInitialized();
    
    if (this.initialized) {
      return await this.dbLogger.logChat(
        data.session_id,
        data.provider,
        data.model,
        data.user_input,
        data.agent_response,
        data.response_time_ms,
        data.tokens_used
      );
    } else {
      // Fallback para console
      console.log(`[CHAT] ${data.provider}: ${data.user_input} -> ${data.agent_response}`);
      return true;
    }
  }

  /**
   * Log de provider
   */
  async logProviderAction(data) {
    await this.ensureInitialized();
    
    if (this.initialized) {
      return await this.dbLogger.logProvider(
        data.provider,
        data.model,
        data.action,
        data.status,
        data.response_time_ms,
        data.error_message
      );
    } else {
      // Fallback para console
      console.log(`[PROVIDER] ${data.provider} - ${data.action}: ${data.status}`);
      return true;
    }
  }

  /**
   * Log de backup
   */
  async logBackup(backupType, backupPath, status, fileSize = null, errorMessage = null) {
    await this.ensureInitialized();
    
    if (this.initialized) {
      return await this.dbLogger.logBackup(backupType, backupPath, status, fileSize, errorMessage);
    } else {
      // Fallback para console
      console.log(`[BACKUP] ${backupType}: ${status}`);
      return true;
    }
  }

  /**
   * Logs winston padrão
   */
  async info(message, meta = {}) {
    await this.ensureInitialized();
    
    if (this.initialized) {
      return this.dbLogger.info(message, meta);
    } else {
      console.log(`[INFO] ${message}`);
    }
  }

  async warn(message, meta = {}) {
    await this.ensureInitialized();
    
    if (this.initialized) {
      return this.dbLogger.warn(message, meta);
    } else {
      console.warn(`[WARN] ${message}`);
    }
  }

  async error(message, meta = {}) {
    await this.ensureInitialized();
    
    if (this.initialized) {
      return this.dbLogger.error(message, meta);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  }

  async debug(message, meta = {}) {
    await this.ensureInitialized();
    
    if (this.initialized) {
      return this.dbLogger.debug(message, meta);
    } else {
      console.debug(`[DEBUG] ${message}`);
    }
  }

  /**
   * Obtém estatísticas do logger
   */
  async getStats() {
    await this.ensureInitialized();
    
    if (this.initialized) {
      return await this.dbLogger.getStats();
    } else {
      return { initialized: false, fallback: true };
    }
  }

  /**
   * Cleanup do logger
   */
  async cleanup() {
    if (this.initialized) {
      await this.dbLogger.cleanup();
    }
  }
}

// Instância singleton
const logger = new LoggerAdapter();

export { logger };
export default logger;