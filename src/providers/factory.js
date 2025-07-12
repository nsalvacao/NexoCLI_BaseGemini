/**
 * @license
 * Modificado por Claude-Code, 2025
 * Baseado em código de gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
 * Factory para criação de providers
 */

import { GeminiProvider } from './gemini.js';
import { logger } from '../utils/logger-adapter.js';

/**
 * Tipos de providers disponíveis
 */
export const PROVIDER_TYPES = {
  GEMINI: 'gemini',
  // Futuros providers serão adicionados aqui
  // OPENAI: 'openai',
  // ANTHROPIC: 'anthropic',
  // OLLAMA: 'ollama',
};

/**
 * Factory para criação de providers
 */
export class ProviderFactory {
  constructor() {
    this.providers = new Map();
    this.registeredProviders = new Map();
    this.initialize();
  }

  /**
   * Inicializa a factory com providers padrão
   */
  initialize() {
    // Registrar provider Gemini
    this.registerProvider(PROVIDER_TYPES.GEMINI, GeminiProvider);
  }

  /**
   * Registra um novo provider
   * @param {string} type - Tipo do provider
   * @param {class} ProviderClass - Classe do provider
   */
  registerProvider(type, ProviderClass) {
    this.registeredProviders.set(type, ProviderClass);
  }

  /**
   * Cria uma instância de provider
   * @param {string} type - Tipo do provider
   * @param {Object} config - Configuração do provider
   * @returns {BaseProvider} Instância do provider
   */
  async createProvider(type, config = {}) {
    try {
      await logger.logDevelopment(
        'ProviderFactory',
        'create_provider_start',
        `Creating provider: ${type}`,
        'Medium'
      );

      // Verificar se provider está registrado
      const ProviderClass = this.registeredProviders.get(type);
      if (!ProviderClass) {
        throw new Error(`Provider type '${type}' not found`);
      }

      // Criar instância
      const provider = new ProviderClass(config);

      // Adicionar à coleção de providers ativos
      const instanceId = this.generateInstanceId(type);
      this.providers.set(instanceId, provider);

      await logger.logDevelopment(
        'ProviderFactory',
        'create_provider_success',
        `Provider ${type} created with ID: ${instanceId}`,
        'Medium'
      );

      return provider;
    } catch (error) {
      await logger.logDevelopment(
        'ProviderFactory',
        'create_provider_error',
        `Failed to create provider ${type}: ${error.message}`,
        'High'
      );
      throw error;
    }
  }

  /**
   * Obtém provider existente
   * @param {string} instanceId - ID da instância
   * @returns {BaseProvider|null} Provider ou null
   */
  getProvider(instanceId) {
    return this.providers.get(instanceId) || null;
  }

  /**
   * Lista todos os providers ativos
   * @returns {Array} Lista de providers
   */
  listActiveProviders() {
    return Array.from(this.providers.entries()).map(([id, provider]) => ({
      id,
      type: provider.name,
      initialized: provider.initialized,
      authenticated: provider.authenticated,
      ready: provider.isReady(),
    }));
  }

  /**
   * Lista tipos de providers disponíveis
   * @returns {Array} Lista de tipos
   */
  listAvailableProviders() {
    return Array.from(this.registeredProviders.keys()).map(type => ({
      type,
      available: true,
      description: this.getProviderDescription(type),
    }));
  }

  /**
   * Obtém descrição de um provider
   * @param {string} type - Tipo do provider
   * @returns {string} Descrição
   */
  getProviderDescription(type) {
    const descriptions = {
      [PROVIDER_TYPES.GEMINI]: 'Google Gemini - Modelo de linguagem avançado da Google',
      // Futuros providers
    };

    return descriptions[type] || `Provider ${type}`;
  }

  /**
   * Remove provider da coleção
   * @param {string} instanceId - ID da instância
   * @returns {boolean} True se removido com sucesso
   */
  async removeProvider(instanceId) {
    try {
      const provider = this.providers.get(instanceId);
      if (!provider) {
        return false;
      }

      // Cleanup do provider
      await provider.cleanup();

      // Remover da coleção
      this.providers.delete(instanceId);

      await logger.logDevelopment(
        'ProviderFactory',
        'remove_provider',
        `Provider ${instanceId} removed`,
        'Medium'
      );

      return true;
    } catch (error) {
      await logger.logDevelopment(
        'ProviderFactory',
        'remove_provider_error',
        `Failed to remove provider ${instanceId}: ${error.message}`,
        'Medium'
      );
      return false;
    }
  }

  /**
   * Executa cleanup de todos os providers
   */
  async cleanup() {
    try {
      await logger.logDevelopment(
        'ProviderFactory',
        'cleanup_start',
        'Cleaning up all providers',
        'Medium'
      );

      const cleanupPromises = Array.from(this.providers.values()).map(
        provider => provider.cleanup()
      );

      await Promise.all(cleanupPromises);
      this.providers.clear();

      await logger.logDevelopment(
        'ProviderFactory',
        'cleanup_complete',
        'All providers cleaned up',
        'Medium'
      );
    } catch (error) {
      await logger.logDevelopment(
        'ProviderFactory',
        'cleanup_error',
        `Cleanup failed: ${error.message}`,
        'High'
      );
    }
  }

  /**
   * Gera ID único para instância
   * @param {string} type - Tipo do provider
   * @returns {string} ID único
   */
  generateInstanceId(type) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `${type}-${timestamp}-${random}`;
  }

  /**
   * Valida configuração de provider
   * @param {string} type - Tipo do provider
   * @param {Object} config - Configuração a validar
   * @returns {Object} Resultado da validação
   */
  validateProviderConfig(type, config) {
    const errors = [];
    const warnings = [];

    // Validações específicas por tipo
    switch (type) {
      case PROVIDER_TYPES.GEMINI:
        if (!config.authType) {
          warnings.push('authType not specified, using default');
        }
        
        if (config.temperature !== undefined && (config.temperature < 0 || config.temperature > 2)) {
          errors.push('temperature must be between 0 and 2');
        }
        
        if (config.topP !== undefined && (config.topP < 0 || config.topP > 1)) {
          errors.push('topP must be between 0 and 1');
        }
        break;

      default:
        warnings.push(`Unknown provider type: ${type}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Cria provider com validação
   * @param {string} type - Tipo do provider
   * @param {Object} config - Configuração do provider
   * @returns {BaseProvider} Provider criado
   */
  async createProviderWithValidation(type, config = {}) {
    // Validar configuração
    const validation = this.validateProviderConfig(type, config);
    
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
    }

    // Mostrar warnings
    if (validation.warnings.length > 0) {
      console.warn('⚠️ Configuration warnings:');
      validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }

    // Criar provider
    return await this.createProvider(type, config);
  }

  /**
   * Obtém estatísticas da factory
   * @returns {Object} Estatísticas
   */
  getStats() {
    return {
      totalProviders: this.providers.size,
      registeredTypes: this.registeredProviders.size,
      activeProviders: this.listActiveProviders(),
      availableTypes: this.listAvailableProviders(),
    };
  }
}

// Instância singleton
export const providerFactory = new ProviderFactory();