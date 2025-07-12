/**
 * @license
 * Modificado por Claude-Code, 2025
 * Baseado em código de gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
 * Ficheiro original: packages/cli/src/config/settings.ts
 */

import path from 'path';
import os from 'os';
import { logger } from '../utils/logger-adapter.js';

/**
 * Configurações padrão do sistema
 */
export const DEFAULT_SETTINGS = {
  // Modelos
  DEFAULT_MODEL: 'gemini-1.5-flash',
  DEFAULT_EMBEDDING_MODEL: 'text-embedding-004',
  
  // Limites
  MAX_TOKENS: 1000000,
  DEFAULT_TEMPERATURE: 0,
  DEFAULT_TOP_P: 1,
  
  // Timeouts
  REQUEST_TIMEOUT: 30000, // 30 segundos
  OAUTH_TIMEOUT: 60000,   // 60 segundos
  
  // Caminhos
  CONFIG_DIR: path.join(os.homedir(), '.nexocli'),
  CACHE_DIR: path.join(os.homedir(), '.nexocli', 'cache'),
  
  // Logging
  LOG_LEVEL: 'info',
  LOG_RETENTION_DAYS: 30,
};

/**
 * Carrega variáveis de ambiente
 * Suporte para .env files
 */
export const loadEnvironment = async () => {
  // Tentar carregar dotenv se disponível
  try {
    const { default: dotenv } = await import('dotenv');
    dotenv.config();
  } catch (error) {
    // dotenv não é obrigatório, continua sem ele
  }
};

/**
 * Classe para gestão de configurações
 */
export class SettingsManager {
  constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.loaded = false;
  }

  /**
   * Inicializa as configurações
   */
  async initialize() {
    try {
      // Carregar variáveis de ambiente
      await loadEnvironment();
      
      // Aplicar configurações de ambiente
      await this.applyEnvironmentSettings();
      
      // Criar diretórios necessários
      await this.ensureDirectories();
      
      this.loaded = true;
      
      await logger.logDevelopment(
        'NexoCLI_Settings',
        'settings_loaded',
        'Settings initialized successfully',
        'Medium'
      );
      
      return true;
    } catch (error) {
      await logger.logDevelopment(
        'NexoCLI_Settings',
        'settings_error',
        `Failed to initialize settings: ${error.message}`,
        'High'
      );
      throw error;
    }
  }

  /**
   * Aplica configurações das variáveis de ambiente
   * @private
   */
  async applyEnvironmentSettings() {
    // Modelos
    if (process.env.NEXOCLI_DEFAULT_MODEL) {
      this.settings.DEFAULT_MODEL = process.env.NEXOCLI_DEFAULT_MODEL;
    }
    
    if (process.env.NEXOCLI_EMBEDDING_MODEL) {
      this.settings.DEFAULT_EMBEDDING_MODEL = process.env.NEXOCLI_EMBEDDING_MODEL;
    }
    
    // Limites
    if (process.env.NEXOCLI_MAX_TOKENS) {
      this.settings.MAX_TOKENS = parseInt(process.env.NEXOCLI_MAX_TOKENS, 10);
    }
    
    if (process.env.NEXOCLI_TEMPERATURE) {
      this.settings.DEFAULT_TEMPERATURE = parseFloat(process.env.NEXOCLI_TEMPERATURE);
    }
    
    if (process.env.NEXOCLI_TOP_P) {
      this.settings.DEFAULT_TOP_P = parseFloat(process.env.NEXOCLI_TOP_P);
    }
    
    // Timeouts
    if (process.env.NEXOCLI_REQUEST_TIMEOUT) {
      this.settings.REQUEST_TIMEOUT = parseInt(process.env.NEXOCLI_REQUEST_TIMEOUT, 10);
    }
    
    // Caminhos customizados
    if (process.env.NEXOCLI_CONFIG_DIR) {
      this.settings.CONFIG_DIR = process.env.NEXOCLI_CONFIG_DIR;
      this.settings.CACHE_DIR = path.join(this.settings.CONFIG_DIR, 'cache');
    }
    
    // Logging
    if (process.env.NEXOCLI_LOG_LEVEL) {
      this.settings.LOG_LEVEL = process.env.NEXOCLI_LOG_LEVEL;
    }
    
    if (process.env.NEXOCLI_LOG_RETENTION_DAYS) {
      this.settings.LOG_RETENTION_DAYS = parseInt(process.env.NEXOCLI_LOG_RETENTION_DAYS, 10);
    }
  }

  /**
   * Cria diretórios necessários
   * @private
   */
  async ensureDirectories() {
    const { mkdir } = await import('fs/promises');
    
    try {
      await mkdir(this.settings.CONFIG_DIR, { recursive: true });
      await mkdir(this.settings.CACHE_DIR, { recursive: true });
    } catch (error) {
      // Diretórios podem já existir
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  /**
   * Obtém uma configuração
   * @param {string} key - Chave da configuração
   * @returns {any} Valor da configuração
   */
  get(key) {
    if (!this.loaded) {
      throw new Error('Settings not loaded. Call initialize() first.');
    }
    
    return this.settings[key];
  }

  /**
   * Define uma configuração
   * @param {string} key - Chave da configuração
   * @param {any} value - Valor da configuração
   */
  set(key, value) {
    if (!this.loaded) {
      throw new Error('Settings not loaded. Call initialize() first.');
    }
    
    this.settings[key] = value;
  }

  /**
   * Obtém todas as configurações
   * @returns {Object} Objeto com todas as configurações
   */
  getAll() {
    if (!this.loaded) {
      throw new Error('Settings not loaded. Call initialize() first.');
    }
    
    return { ...this.settings };
  }

  /**
   * Obtém configurações específicas para o cliente Gemini
   * @returns {Object} Configurações do cliente
   */
  getGeminiConfig() {
    return {
      model: this.get('DEFAULT_MODEL'),
      embeddingModel: this.get('DEFAULT_EMBEDDING_MODEL'),
      maxTokens: this.get('MAX_TOKENS'),
      temperature: this.get('DEFAULT_TEMPERATURE'),
      topP: this.get('DEFAULT_TOP_P'),
      timeout: this.get('REQUEST_TIMEOUT'),
    };
  }

  /**
   * Obtém configurações de logging
   * @returns {Object} Configurações de logging
   */
  getLoggingConfig() {
    return {
      level: this.get('LOG_LEVEL'),
      retentionDays: this.get('LOG_RETENTION_DAYS'),
    };
  }

  /**
   * Obtém configurações de caminhos
   * @returns {Object} Configurações de caminhos
   */
  getPathConfig() {
    return {
      configDir: this.get('CONFIG_DIR'),
      cacheDir: this.get('CACHE_DIR'),
    };
  }

  /**
   * Valida as configurações atuais
   * @returns {Object} Resultado da validação
   */
  validate() {
    const errors = [];
    const warnings = [];

    // Validar modelo
    if (!this.get('DEFAULT_MODEL')) {
      errors.push('DEFAULT_MODEL não pode estar vazio');
    }

    // Validar limites
    const maxTokens = this.get('MAX_TOKENS');
    if (maxTokens <= 0 || maxTokens > 2000000) {
      warnings.push('MAX_TOKENS fora do intervalo recomendado (1-2000000)');
    }

    // Validar temperatura
    const temperature = this.get('DEFAULT_TEMPERATURE');
    if (temperature < 0 || temperature > 2) {
      warnings.push('DEFAULT_TEMPERATURE fora do intervalo válido (0-2)');
    }

    // Validar Top P
    const topP = this.get('DEFAULT_TOP_P');
    if (topP < 0 || topP > 1) {
      warnings.push('DEFAULT_TOP_P fora do intervalo válido (0-1)');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

// Instância singleton para uso global
export const settings = new SettingsManager();