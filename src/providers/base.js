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
}