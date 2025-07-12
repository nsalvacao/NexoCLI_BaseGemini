/**
 * @license
 * Modificado por Claude-Code, 2025
 * Baseado em código de gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
 * Interface base para todos os providers
 */

import { logger } from '../utils/logger-adapter.js';

/**
 * Interface base para todos os providers
 * Define a estrutura comum que todos os providers devem implementar
 */
export class BaseProvider {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.initialized = false;
    this.authenticated = false;
    this.client = null;
    this.logger = logger;
  }

  /**
   * Inicializa o provider
   * Deve ser implementado por cada provider específico
   * @returns {Promise<boolean>} True se inicialização foi bem-sucedida
   */
  async initialize() {
    throw new Error(`${this.name} provider must implement initialize() method`);
  }

  /**
   * Autentica o provider
   * Deve ser implementado por cada provider específico
   * @returns {Promise<boolean>} True se autenticação foi bem-sucedida
   */
  async authenticate() {
    throw new Error(`${this.name} provider must implement authenticate() method`);
  }

  /**
   * Envia mensagem para o provider
   * Deve ser implementado por cada provider específico
   * @param {string} message - Mensagem a enviar
   * @param {Object} options - Opções adicionais
   * @returns {Promise<Object>} Resposta do provider
   */
  async sendMessage(message, options = {}) {
    throw new Error(`${this.name} provider must implement sendMessage() method`);
  }

  /**
   * Lista modelos disponíveis
   * Deve ser implementado por cada provider específico
   * @returns {Promise<Array>} Lista de modelos
   */
  async listModels() {
    throw new Error(`${this.name} provider must implement listModels() method`);
  }

  /**
   * Valida credenciais do provider
   * Deve ser implementado por cada provider específico
   * @returns {Promise<boolean>} True se credenciais são válidas
   */
  async validateCredentials() {
    throw new Error(`${this.name} provider must implement validateCredentials() method`);
  }

  /**
   * Testa conexão com o provider
   * Deve ser implementado por cada provider específico
   * @returns {Promise<Object>} Resultado do teste
   */
  async testConnection() {
    throw new Error(`${this.name} provider must implement testConnection() method`);
  }

  /**
   * Altera modelo do provider
   * Implementação padrão que pode ser sobrescrita
   * @param {string} model - Novo modelo
   * @returns {Promise<boolean>} True se alteração foi bem-sucedida
   */
  async changeModel(model) {
    if (!model || typeof model !== 'string') {
      throw new Error('Invalid model specified');
    }

    await this.logDevelopment(
      'change_model_start',
      `Changing model from ${this.config.model} to ${model}`,
      'Medium'
    );

    this.config.model = model;

    await this.logDevelopment(
      'change_model_success',
      `Model changed to ${model}`,
      'Medium'
    );

    await this.logAction('model_change', 'success', { model });

    return true;
  }

  /**
   * Obtém informações de quota/uso do provider
   * Implementação padrão que pode ser sobrescrita
   * @returns {Promise<Object|null>} Informações de quota ou null se não disponível
   */
  async getQuotaInfo() {
    return null; // Implementação padrão retorna null
  }

  /**
   * Executa verificação de saúde do provider
   * Implementação padrão que pode ser sobrescrita
   * @returns {Promise<boolean>} True se provider está saudável
   */
  async healthCheck() {
    try {
      return this.isReady() && await this.validateCredentials();
    } catch (error) {
      await this.logDevelopment(
        'health_check_error',
        `Health check failed: ${error.message}`,
        'High'
      );
      return false;
    }
  }

  /**
   * Obtém informações do modelo atual
   * Implementação padrão que pode ser sobrescrita
   * @returns {Object} Informações do modelo
   */
  getModelInfo() {
    return {
      provider: this.name,
      model: this.config.model || 'unknown',
      initialized: this.initialized,
      authenticated: this.authenticated,
    };
  }

  /**
   * Valida se o provider está pronto para uso
   * @returns {boolean} True se pronto
   */
  isReady() {
    return this.initialized && this.authenticated;
  }

  /**
   * Valida uma mensagem antes de enviar
   * Implementação padrão que pode ser sobrescrita
   * @param {string} message - Mensagem a validar
   * @returns {boolean} True se válida
   */
  validateMessage(message) {
    if (!message || typeof message !== 'string') {
      return false;
    }
    
    if (message.trim().length === 0) {
      return false;
    }
    
    // Verificar tamanho máximo (100KB por padrão)
    if (message.length > 100000) {
      return false;
    }
    
    return true;
  }

  /**
   * Processa opções de configuração
   * Implementação padrão que pode ser sobrescrita
   * @param {Object} options - Opções a processar
   * @returns {Object} Opções processadas
   */
  processOptions(options = {}) {
    return {
      temperature: options.temperature || this.config.temperature || 0,
      topP: options.topP || this.config.topP || 1,
      maxTokens: options.maxTokens || this.config.maxTokens || 1000,
      model: options.model || this.config.model,
      ...options,
    };
  }

  /**
   * Logs uma ação do provider
   * Método auxiliar para logging consistente
   * @param {string} action - Ação realizada
   * @param {string} status - Status da ação
   * @param {Object} details - Detalhes adicionais
   */
  async logAction(action, status, details = {}) {
    await this.logger.logProviderAction({
      provider: this.name,
      action,
      status,
      ...details,
    });
  }

  /**
   * Logs uma mensagem de desenvolvimento
   * Método auxiliar para logging de desenvolvimento
   * @param {string} logType - Tipo de log
   * @param {string} description - Descrição
   * @param {string} impactLevel - Nível de impacto
   */
  async logDevelopment(logType, description, impactLevel = 'Medium') {
    await this.logger.logDevelopment(
      `${this.name}Provider`,
      logType,
      description,
      impactLevel
    );
  }

  /**
   * Trata erros do provider
   * Implementação padrão que pode ser sobrescrita
   * @param {Error} error - Erro a tratar
   * @param {string} context - Contexto do erro
   * @returns {Error} Erro processado
   */
  handleError(error, context = '') {
    const enhancedError = new Error(
      `${this.name} Provider Error${context ? ` (${context})` : ''}: ${error.message}`
    );
    
    enhancedError.provider = this.name;
    enhancedError.context = context;
    enhancedError.originalError = error;
    
    return enhancedError;
  }

  /**
   * Obtém estatísticas do provider
   * Implementação padrão que pode ser sobrescrita
   * @returns {Object} Estatísticas do provider
   */
  getStats() {
    return {
      provider: this.name,
      initialized: this.initialized,
      authenticated: this.authenticated,
      ready: this.isReady(),
      config: {
        model: this.config.model,
        temperature: this.config.temperature,
        topP: this.config.topP,
        maxTokens: this.config.maxTokens,
      },
    };
  }

  /**
   * Executa limpeza do provider
   * Implementação padrão que pode ser sobrescrita
   */
  async cleanup() {
    await this.logDevelopment(
      'cleanup',
      `Provider ${this.name} cleanup initiated`,
      'Medium'
    );

    if (this.client && typeof this.client.close === 'function') {
      await this.client.close();
    }
    
    this.initialized = false;
    this.authenticated = false;
    this.client = null;
    
    await this.logDevelopment(
      'cleanup_complete',
      `Provider ${this.name} cleanup completed`,
      'Medium'
    );
  }

  /**
   * Obtém informações sobre o provider
   * @returns {Object} Informações do provider
   */
  getInfo() {
    return {
      name: this.name,
      version: '1.0.0',
      description: `${this.name} provider for NexoCLI_BaseGemini`,
      capabilities: this.getCapabilities(),
      status: {
        initialized: this.initialized,
        authenticated: this.authenticated,
        ready: this.isReady(),
      },
    };
  }

  /**
   * Obtém capacidades do provider
   * Implementação padrão que pode ser sobrescrita
   * @returns {Array} Lista de capacidades
   */
  getCapabilities() {
    return [
      'text-generation',
      'message-sending',
      'model-listing',
    ];
  }

  /**
   * Obtém tipo de autenticação do provider
   * Deve ser implementado por cada provider específico
   * @returns {string} Tipo de autenticação (oauth, api-key, etc.)
   */
  getAuthType() {
    return this.config.authType || 'unknown';
  }

  /**
   * Valida configuração do provider
   * Implementação padrão que pode ser sobrescrita
   * @param {Object} config - Configuração a validar
   * @returns {Object} Resultado da validação
   */
  validateConfig(config = this.config) {
    const result = {
      valid: true,
      errors: [],
      warnings: []
    };

    // Validação básica
    if (!config.authType) {
      result.errors.push('Missing authType in configuration');
      result.valid = false;
    }

    if (!config.model) {
      result.warnings.push('No default model specified');
    }

    // Validação de temperatura
    if (config.temperature !== undefined) {
      if (typeof config.temperature !== 'number' || config.temperature < 0 || config.temperature > 2) {
        result.errors.push('Temperature must be a number between 0 and 2');
        result.valid = false;
      }
    }

    // Validação de topP
    if (config.topP !== undefined) {
      if (typeof config.topP !== 'number' || config.topP < 0 || config.topP > 1) {
        result.errors.push('TopP must be a number between 0 and 1');
        result.valid = false;
      }
    }

    // Validação de maxTokens
    if (config.maxTokens !== undefined) {
      if (typeof config.maxTokens !== 'number' || config.maxTokens < 1) {
        result.errors.push('MaxTokens must be a positive number');
        result.valid = false;
      }
    }

    return result;
  }

  /**
   * Obtém configuração sanitizada para log/debug
   * Remove informações sensíveis como chaves API
   * @returns {Object} Configuração sanitizada
   */
  getSanitizedConfig() {
    const sanitized = { ...this.config };
    
    // Remover informações sensíveis
    const sensitiveKeys = ['apiKey', 'clientSecret', 'privateKey', 'token', 'refreshToken'];
    
    for (const key of sensitiveKeys) {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Obtém requisitos de configuração do provider
   * Implementação padrão que pode ser sobrescrita
   * @returns {Object} Requisitos de configuração
   */
  getConfigRequirements() {
    return {
      required: ['authType'],
      optional: ['model', 'temperature', 'topP', 'maxTokens'],
      authTypes: ['oauth', 'api-key'],
      description: `Configuration requirements for ${this.name} provider`
    };
  }

  /**
   * Redefine configuração do provider
   * @param {Object} newConfig - Nova configuração
   * @returns {Promise<boolean>} True se redefinição foi bem-sucedida
   */
  async reconfigure(newConfig) {
    await this.logDevelopment(
      'reconfigure_start',
      'Provider reconfiguration initiated',
      'Medium'
    );

    // Validar nova configuração
    const validation = this.validateConfig(newConfig);
    if (!validation.valid) {
      const errorMessage = `Configuration validation failed: ${validation.errors.join(', ')}`;
      await this.logDevelopment(
        'reconfigure_error',
        errorMessage,
        'High'
      );
      throw new Error(errorMessage);
    }

    // Fazer backup da configuração antiga
    const oldConfig = { ...this.config };

    try {
      // Aplicar nova configuração
      this.config = { ...this.config, ...newConfig };

      // Reinicializar se necessário
      if (this.initialized) {
        await this.cleanup();
        await this.initialize();
        
        if (this.authenticated) {
          await this.authenticate();
        }
      }

      await this.logDevelopment(
        'reconfigure_success',
        'Provider reconfiguration completed successfully',
        'Medium'
      );

      return true;

    } catch (error) {
      // Restaurar configuração antiga em caso de erro
      this.config = oldConfig;
      
      await this.logDevelopment(
        'reconfigure_error',
        `Reconfiguration failed, restored old config: ${error.message}`,
        'High'
      );
      
      throw error;
    }
  }
}