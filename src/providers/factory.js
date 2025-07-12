/**
 * @license
 * Modificado por Claude-Code, 2025
 * Baseado em código de gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
 * Factory para criação de providers
 */

import { GeminiProvider } from './gemini.js';
import { OpenRouterProvider } from './openrouter.js';
import { AnthropicProvider } from './anthropic.js';
import { TogetherProvider } from './together.js';
import { logger } from '../utils/logger-adapter.js';
import { envManager } from '../config/env-manager.js';
import { CredentialValidator } from './validation.js';

/**
 * Tipos de providers disponíveis
 */
export const PROVIDER_TYPES = {
  GEMINI: 'gemini',
  OPENROUTER: 'openrouter',
  ANTHROPIC: 'anthropic',
  TOGETHER: 'together',
  OPENAI: 'openai', // Reservado para implementação futura
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
    // Registrar providers implementados
    this.registerProvider(PROVIDER_TYPES.GEMINI, GeminiProvider);
    this.registerProvider(PROVIDER_TYPES.OPENROUTER, OpenRouterProvider);
    this.registerProvider(PROVIDER_TYPES.ANTHROPIC, AnthropicProvider);
    this.registerProvider(PROVIDER_TYPES.TOGETHER, TogetherProvider);
    
    // Sistema de fallback
    this.fallbackChain = [];
    this.setupFallbackChain();
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
   * Configura cadeia de fallback baseada em prioridades e disponibilidade
   */
  setupFallbackChain() {
    const availableProviders = envManager.getAvailableProviders();
    
    // Ordem de prioridade conforme ROADMAP.md
    const priorityOrder = [
      PROVIDER_TYPES.GEMINI,      // Prioridade 1 - Sempre disponível (OAuth gratuito)
      PROVIDER_TYPES.OPENROUTER,  // Prioridade 2 - Gateway universal
      PROVIDER_TYPES.ANTHROPIC,   // Prioridade 3 - Claude especializado
      PROVIDER_TYPES.TOGETHER,    // Prioridade 4 - Open-source rápido
      PROVIDER_TYPES.OPENAI       // Prioridade 5 - Reservado
    ];

    this.fallbackChain = priorityOrder.filter(provider => 
      availableProviders.includes(provider) && this.registeredProviders.has(provider)
    );

    logger.logDevelopment(
      'ProviderFactory',
      'fallback_chain_setup',
      `Fallback chain configured: ${this.fallbackChain.join(' → ')} (${this.fallbackChain.length} providers)`,
      'Medium'
    );
  }

  /**
   * Cria provider com fallback automático
   * @param {string} preferredProvider - Provider preferido (opcional)
   * @param {Object} config - Configuração (opcional)
   * @returns {BaseProvider} Provider criado
   */
  async createProviderWithFallback(preferredProvider = null, config = null) {
    const startTime = Date.now();
    
    // Configurar cadeia de tentativas
    const attemptChain = preferredProvider 
      ? [preferredProvider, ...this.fallbackChain.filter(p => p !== preferredProvider)]
      : [...this.fallbackChain];

    if (attemptChain.length === 0) {
      throw new Error('No providers available for fallback');
    }

    let lastError = null;
    const attempts = [];

    for (const providerName of attemptChain) {
      const attemptStart = Date.now();
      
      try {
        await logger.logDevelopment(
          'ProviderFactory',
          'fallback_attempt',
          `Attempting to create provider: ${providerName}`,
          'Medium'
        );

        const provider = await this.createProvider(providerName, config);
        
        // CORREÇÃO CRÍTICA: Garantir inicialização completa antes de health check
        await provider.initialize();
        await provider.authenticate();
        
        // Testar conectividade básica
        const healthCheck = await provider.healthCheck();
        
        if (healthCheck.healthy) {
          const totalTime = Date.now() - startTime;
          
          console.log(`✅ Provider fallback successful: ${providerName} (${totalTime}ms)`);
          
          // Log sucesso na BD
          await logger.logDevelopment(
            'ProviderFactory',
            'fallback_success',
            `Provider ${providerName} selected via fallback (attempts: ${attempts.length + 1}, total_time: ${totalTime}ms)`,
            'Medium'
          );

          // Log na BD específico para fallback
          if (provider.logger) {
            await provider.logger.logProviderAction({
              provider: 'factory',
              action: 'fallback_sequence',
              status: 'success',
              metadata: JSON.stringify({
                attempted: attempts.map(a => a.provider),
                successful: providerName,
                fallback_reason: preferredProvider ? `${preferredProvider}_failed` : 'auto_selection',
                total_attempts: attempts.length + 1,
                total_time_ms: totalTime
              })
            });
          }

          return provider;
        } else {
          throw new Error(`Provider ${providerName} health check failed: ${healthCheck.error}`);
        }

      } catch (error) {
        const attemptTime = Date.now() - attemptStart;
        lastError = error;
        
        attempts.push({
          provider: providerName,
          error: error.message,
          time_ms: attemptTime
        });

        console.warn(`⚠️ Provider ${providerName} failed: ${error.message} (${attemptTime}ms)`);
        
        // Log tentativa falhada
        await logger.logDevelopment(
          'ProviderFactory',
          'fallback_attempt_failed',
          `Provider ${providerName} failed: ${error.message} (${attemptTime}ms)`,
          'Medium'
        );

        continue; // Tentar próximo provider
      }
    }

    // Se chegou aqui, todos os providers falharam
    const totalTime = Date.now() - startTime;
    
    await logger.logDevelopment(
      'ProviderFactory',
      'fallback_complete_failure',
      `All providers failed. Attempts: ${JSON.stringify(attempts)} (total_time: ${totalTime}ms)`,
      'High'
    );

    throw new Error(`All providers failed. Last error: ${lastError?.message}. Attempted: ${attemptChain.join(', ')}`);
  }

  /**
   * Obtém cadeia de fallback atual
   * @returns {Array} Lista de providers na ordem de fallback
   */
  getFallbackChain() {
    return [...this.fallbackChain];
  }

  /**
   * Recarrega cadeia de fallback (útil após mudanças no .env)
   */
  async reloadFallbackChain() {
    await envManager.reload();
    this.setupFallbackChain();
    
    await logger.logDevelopment(
      'ProviderFactory',
      'fallback_chain_reloaded',
      `Fallback chain reloaded: ${this.fallbackChain.join(' → ')}`,
      'Medium'
    );
  }

  /**
   * Cria uma instância de provider
   * @param {string} type - Tipo do provider
   * @param {Object} config - Configuração do provider (sobrescreve configuração do env)
   * @returns {BaseProvider} Instância do provider
   */
  async createProvider(type, config = null) {
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
        throw new Error(`Provider type '${type}' not found in registered providers`);
      }

      // Obter configuração do environment se não fornecida
      let providerConfig = config;
      if (!providerConfig) {
        const envConfig = envManager.getProviderConfig(type);
        if (!envConfig) {
          throw new Error(`No configuration found for provider ${type}. Check your .env file or provide explicit config.`);
        }
        
        if (!envConfig.available) {
          throw new Error(`Provider ${type} is not available. Missing required credentials.`);
        }

        // Converter configuração do envManager para formato do provider
        providerConfig = this.convertEnvConfigToProviderConfig(envConfig);
      }

      // Validar credenciais antes de criar o provider
      await logger.logDevelopment(
        'ProviderFactory',
        'validate_credentials',
        `Validating credentials for provider: ${type}`,
        'Medium'
      );

      const validation = await CredentialValidator.validateProvider(type, providerConfig);
      if (!validation.valid) {
        throw new Error(`Credential validation failed for ${type}: ${validation.errors.join(', ')}`);
      }

      // Log warnings se existirem
      if (validation.warnings.length > 0) {
        await logger.logDevelopment(
          'ProviderFactory',
          'validation_warnings',
          `Validation warnings for ${type}: ${validation.warnings.join(', ')}`,
          'Low'
        );
      }

      // Criar instância
      const provider = new ProviderClass(providerConfig);

      // Adicionar à coleção de providers ativos
      const instanceId = this.generateInstanceId(type);
      this.providers.set(instanceId, provider);

      await logger.logDevelopment(
        'ProviderFactory',
        'create_provider_success',
        `Provider ${type} created with ID: ${instanceId} (auth: ${providerConfig.authType})`,
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
   * Lista tipos de providers disponíveis (baseado em environment)
   * @returns {Array} Lista de tipos
   */
  listAvailableProviders() {
    const envProviders = envManager.getAvailableProviders();
    const registeredTypes = Array.from(this.registeredProviders.keys());
    
    return registeredTypes.map(type => {
      const isAvailable = envProviders.includes(type);
      const envConfig = envManager.getProviderConfig(type);
      
      return {
        type,
        available: isAvailable,
        description: this.getProviderDescription(type),
        authType: envConfig?.authType || 'unknown',
        models: envConfig?.models || [],
        capabilities: envConfig?.capabilities || [],
        priority: envConfig?.priority || 999
      };
    }).sort((a, b) => a.priority - b.priority);
  }

  /**
   * Lista todos os providers registrados (incluindo não disponíveis)
   * @returns {Array} Lista completa de providers
   */
  listAllProviders() {
    const envProviders = envManager.getAllProviders();
    const registeredTypes = Array.from(this.registeredProviders.keys());
    
    // Combinar providers registrados com configurações do env
    const combined = registeredTypes.map(type => {
      const envConfig = envProviders.find(p => p.name === type) || { available: false };
      
      return {
        type,
        registered: true,
        available: envConfig.available,
        description: this.getProviderDescription(type),
        authType: envConfig.authType || 'unknown',
        models: envConfig.models || [],
        capabilities: envConfig.capabilities || [],
        priority: envConfig.priority || 999,
        credentials: envConfig.available ? 'configured' : 'missing'
      };
    });

    // Adicionar providers do env que não estão registrados (preparação para Fase 4)
    envProviders.forEach(envConfig => {
      if (!registeredTypes.includes(envConfig.name)) {
        combined.push({
          type: envConfig.name,
          registered: false,
          available: false,
          description: `${envConfig.name} (not implemented yet)`,
          authType: envConfig.authType,
          models: envConfig.models || [],
          capabilities: envConfig.capabilities || [],
          priority: envConfig.priority || 999,
          credentials: 'ready for implementation'
        });
      }
    });

    return combined.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Obtém descrição de um provider
   * @param {string} type - Tipo do provider
   * @returns {string} Descrição
   */
  getProviderDescription(type) {
    const descriptions = {
      [PROVIDER_TYPES.GEMINI]: 'Google Gemini - Modelo de linguagem avançado da Google',
      [PROVIDER_TYPES.OPENROUTER]: 'OpenRouter - Gateway para 100+ modelos de IA',
      [PROVIDER_TYPES.ANTHROPIC]: 'Anthropic Claude - Assistente IA seguro e útil',
      [PROVIDER_TYPES.TOGETHER]: 'Together AI - Modelos open-source com inferência rápida',
      [PROVIDER_TYPES.OPENAI]: 'OpenAI GPT - Modelos de linguagem da OpenAI',
    };

    return descriptions[type] || `Provider ${type}`;
  }

  /**
   * Converte configuração do EnvManager para formato do provider
   * @param {Object} envConfig - Configuração do environment
   * @returns {Object} Configuração formatada para o provider
   */
  convertEnvConfigToProviderConfig(envConfig) {
    const baseConfig = {
      authType: envConfig.authType,
      model: envConfig.models?.[0] || 'default', // Usar primeiro modelo como padrão
      temperature: 0,
      topP: 1,
      maxTokens: 1000
    };

    // Adicionar credenciais baseado no tipo de auth
    switch (envConfig.authType) {
      case 'api-key':
        baseConfig.apiKey = envConfig.credentials.apiKey;
        break;
      
      case 'oauth':
        baseConfig.projectId = envConfig.credentials.projectId;
        baseConfig.location = envConfig.credentials.location;
        break;
      
      case 'oauth-personal':
        baseConfig.personal = true;
        break;
      
      default:
        // Copiar todas as credenciais se tipo desconhecido
        Object.assign(baseConfig, envConfig.credentials);
    }

    return baseConfig;
  }

  /**
   * Obtém provider padrão baseado na configuração do environment
   * @returns {string|null} Tipo do provider padrão
   */
  getDefaultProviderType() {
    return envManager.getDefaultProvider();
  }

  /**
   * Cria provider padrão automaticamente
   * @param {Object} config - Configuração opcional para sobrescrever
   * @returns {BaseProvider} Provider padrão criado
   */
  async createDefaultProvider(config = null) {
    const defaultType = this.getDefaultProviderType();
    
    if (!defaultType) {
      throw new Error('No default provider available. Check your .env configuration.');
    }

    await logger.logDevelopment(
      'ProviderFactory',
      'create_default_provider',
      `Creating default provider: ${defaultType}`,
      'Medium'
    );

    return await this.createProvider(defaultType, config);
  }

  /**
   * Verifica se um provider está disponível
   * @param {string} type - Tipo do provider
   * @returns {boolean} True se disponível
   */
  isProviderAvailable(type) {
    return envManager.isProviderAvailable(type) && this.registeredProviders.has(type);
  }

  /**
   * Executa diagnóstico de um provider específico
   * @param {string} type - Tipo do provider
   * @returns {Object} Resultado do diagnóstico
   */
  async diagnoseProvider(type) {
    const result = {
      provider: type,
      timestamp: new Date().toISOString(),
      registered: this.registeredProviders.has(type),
      envAvailable: envManager.isProviderAvailable(type),
      envConfig: null,
      validation: null,
      canCreate: false,
      errors: [],
      warnings: []
    };

    try {
      // Verificar se está registrado
      if (!result.registered) {
        result.errors.push(`Provider ${type} is not registered in factory`);
      }

      // Verificar configuração do environment
      const envConfig = envManager.getProviderConfig(type);
      if (envConfig) {
        result.envConfig = {
          available: envConfig.available,
          authType: envConfig.authType,
          models: envConfig.models?.length || 0,
          capabilities: envConfig.capabilities?.length || 0
        };

        if (!envConfig.available) {
          result.errors.push(`Provider ${type} has no valid credentials in environment`);
        } else {
          // Validar credenciais
          const providerConfig = this.convertEnvConfigToProviderConfig(envConfig);
          result.validation = await CredentialValidator.validateProvider(type, providerConfig);
          
          if (!result.validation.valid) {
            result.errors.push(...result.validation.errors);
          }
          
          if (result.validation.warnings.length > 0) {
            result.warnings.push(...result.validation.warnings);
          }
        }
      } else {
        result.errors.push(`No environment configuration found for provider ${type}`);
      }

      // Determinar se pode criar o provider
      result.canCreate = result.registered && 
                        result.envAvailable && 
                        (!result.validation || result.validation.valid);

    } catch (error) {
      result.errors.push(`Diagnosis error: ${error.message}`);
    }

    await logger.logDevelopment(
      'ProviderFactory',
      'provider_diagnosis',
      `Diagnosis for ${type}: canCreate=${result.canCreate}, errors=${result.errors.length}, warnings=${result.warnings.length}`,
      'Medium'
    );

    return result;
  }

  /**
   * Executa diagnóstico completo de todos os providers
   * @returns {Object} Resultados consolidados
   */
  async diagnoseAllProviders() {
    const allTypes = [...new Set([
      ...Array.from(this.registeredProviders.keys()),
      ...envManager.getAllProviders().map(p => p.name)
    ])];

    const results = {
      timestamp: new Date().toISOString(),
      totalProviders: allTypes.length,
      summary: {
        available: 0,
        unavailable: 0,
        errors: 0,
        warnings: 0
      },
      providers: {}
    };

    // Executar diagnósticos em paralelo
    const diagnostics = await Promise.all(
      allTypes.map(type => this.diagnoseProvider(type))
    );

    // Processar resultados
    for (const diagnosis of diagnostics) {
      results.providers[diagnosis.provider] = diagnosis;
      
      if (diagnosis.canCreate) {
        results.summary.available++;
      } else {
        results.summary.unavailable++;
      }
      
      results.summary.errors += diagnosis.errors.length;
      results.summary.warnings += diagnosis.warnings.length;
    }

    await logger.logDevelopment(
      'ProviderFactory',
      'full_diagnosis',
      `Full diagnosis: ${results.summary.available}/${results.totalProviders} providers available`,
      'Medium'
    );

    return results;
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