/**
 * @license
 * Criado por Claude-Code, 2025
 * Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)
 * Sistema de gestão de configuração .env para multi-provider
 */

import { config } from 'dotenv';
import { logger } from '../utils/logger-adapter.js';

/**
 * Gestor de configurações de environment para múltiplos providers
 * Centraliza a detecção e gestão de credenciais de providers
 */
export class EnvManager {
  constructor() {
    this.providers = new Map();
    this.loadedFromEnv = false;
    this.configPath = process.env.ENV_PATH || '.env';
    
    // Carregar configurações .env
    this.loadEnvironment();
    
    // Carregar configurações de providers
    this.loadProviderConfigs();
  }

  /**
   * Carrega variáveis de ambiente do ficheiro .env
   */
  loadEnvironment() {
    try {
      const result = config({ path: this.configPath });
      
      if (!result.error) {
        this.loadedFromEnv = true;
        console.log(`✅ Environment loaded from ${this.configPath}`);
      } else if (result.error.code !== 'ENOENT') {
        console.warn(`⚠️ Error loading .env: ${result.error.message}`);
      }
    } catch (error) {
      console.warn(`⚠️ Failed to load environment: ${error.message}`);
    }
  }

  /**
   * Carrega configurações de todos os providers disponíveis
   */
  loadProviderConfigs() {
    // Limpar configurações existentes
    this.providers.clear();

    // Carregar configuração do Gemini
    this.loadGeminiConfig();

    // Preparar para outros providers (implementação futura)
    this.loadOpenRouterConfig();
    this.loadAnthropicConfig();
    this.loadOpenAIConfig();

    console.log(`📊 Loaded configurations for ${this.providers.size} providers`);
  }

  /**
   * Carrega configuração específica do Gemini
   */
  loadGeminiConfig() {
    const config = {
      name: 'gemini',
      available: false,
      authType: null,
      credentials: {},
      models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'],
      capabilities: ['text-generation', 'multi-modal'],
      priority: 1
    };

    // Verificar API Key
    if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
      config.available = true;
      config.authType = 'api-key';
      config.credentials = {
        apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
      };
    }
    // Verificar OAuth/Cloud Shell
    else if (process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT) {
      config.available = true;
      config.authType = 'oauth';
      config.credentials = {
        projectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT,
        location: process.env.GOOGLE_CLOUD_LOCATION || process.env.GCLOUD_LOCATION || 'us-central1'
      };
    }
    // OAuth pessoal como fallback (sempre disponível)
    else {
      config.available = true;
      config.authType = 'oauth-personal';
      config.credentials = {
        type: 'personal'
      };
    }

    this.providers.set('gemini', config);
  }

  /**
   * Carrega configuração do OpenRouter (preparação para Fase 4)
   */
  loadOpenRouterConfig() {
    if (process.env.OPENROUTER_API_KEY) {
      const config = {
        name: 'openrouter',
        available: true,
        authType: 'api-key',
        credentials: {
          apiKey: process.env.OPENROUTER_API_KEY
        },
        models: ['gpt-4', 'gpt-3.5-turbo', 'claude-3-haiku', 'claude-3-sonnet'],
        capabilities: ['text-generation'],
        priority: 2
      };

      this.providers.set('openrouter', config);
    }
  }

  /**
   * Carrega configuração do Anthropic (preparação para Fase 4)
   */
  loadAnthropicConfig() {
    if (process.env.ANTHROPIC_API_KEY) {
      const config = {
        name: 'anthropic',
        available: true,
        authType: 'api-key',
        credentials: {
          apiKey: process.env.ANTHROPIC_API_KEY
        },
        models: ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229'],
        capabilities: ['text-generation'],
        priority: 3
      };

      this.providers.set('anthropic', config);
    }
  }

  /**
   * Carrega configuração do OpenAI (preparação para Fase 4)
   */
  loadOpenAIConfig() {
    if (process.env.OPENAI_API_KEY) {
      const config = {
        name: 'openai',
        available: true,
        authType: 'api-key',
        credentials: {
          apiKey: process.env.OPENAI_API_KEY
        },
        models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        capabilities: ['text-generation'],
        priority: 4
      };

      this.providers.set('openai', config);
    }
  }

  /**
   * Obtém lista de providers disponíveis
   * @returns {Array} Lista de nomes de providers disponíveis
   */
  getAvailableProviders() {
    return Array.from(this.providers.values())
      .filter(config => config.available)
      .sort((a, b) => a.priority - b.priority)
      .map(config => config.name);
  }

  /**
   * Obtém todos os providers (disponíveis e não disponíveis)
   * @returns {Array} Lista de todos os providers
   */
  getAllProviders() {
    return Array.from(this.providers.values())
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Obtém configuração de um provider específico
   * @param {string} name - Nome do provider
   * @returns {Object|null} Configuração do provider ou null se não encontrado
   */
  getProviderConfig(name) {
    return this.providers.get(name) || null;
  }

  /**
   * Verifica se um provider está disponível
   * @param {string} name - Nome do provider
   * @returns {boolean} True se provider está disponível
   */
  isProviderAvailable(name) {
    const config = this.providers.get(name);
    return config ? config.available : false;
  }

  /**
   * Obtém provider padrão (primeiro na lista de prioridades)
   * @returns {string|null} Nome do provider padrão ou null se nenhum disponível
   */
  getDefaultProvider() {
    const available = this.getAvailableProviders();
    return available.length > 0 ? available[0] : null;
  }

  /**
   * Obtém configuração sanitizada para logging
   * Remove informações sensíveis como chaves API
   * @returns {Object} Configuração sanitizada
   */
  getSanitizedConfig() {
    const sanitized = {};
    
    for (const [name, config] of this.providers) {
      sanitized[name] = {
        ...config,
        credentials: this.sanitizeCredentials(config.credentials)
      };
    }

    return sanitized;
  }

  /**
   * Sanitiza credenciais para logging
   * @param {Object} credentials - Credenciais a sanitizar
   * @returns {Object} Credenciais sanitizadas
   */
  sanitizeCredentials(credentials) {
    const sanitized = { ...credentials };
    
    // Lista de chaves sensíveis
    const sensitiveKeys = ['apiKey', 'clientSecret', 'privateKey', 'token', 'refreshToken'];
    
    for (const key of sensitiveKeys) {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Valida configuração de um provider
   * @param {string} name - Nome do provider
   * @returns {Object} Resultado da validação
   */
  validateProviderConfig(name) {
    const config = this.providers.get(name);
    
    if (!config) {
      return {
        valid: false,
        errors: [`Provider ${name} not found`],
        warnings: []
      };
    }

    const result = {
      valid: true,
      errors: [],
      warnings: []
    };

    // Validar se provider está disponível
    if (!config.available) {
      result.errors.push(`Provider ${name} is not available (missing credentials)`);
      result.valid = false;
    }

    // Validar tipo de autenticação
    if (!config.authType) {
      result.errors.push(`Provider ${name} missing authType`);
      result.valid = false;
    }

    // Validar credenciais baseado no tipo de auth
    switch (config.authType) {
      case 'api-key':
        if (!config.credentials.apiKey) {
          result.errors.push(`Provider ${name} missing API key`);
          result.valid = false;
        }
        break;
      
      case 'oauth':
        if (!config.credentials.projectId) {
          result.warnings.push(`Provider ${name} missing project ID for OAuth`);
        }
        break;
      
      case 'oauth-personal':
        // OAuth pessoal não requer validação específica
        break;
      
      default:
        result.warnings.push(`Provider ${name} has unknown auth type: ${config.authType}`);
    }

    // Validar modelos
    if (!config.models || config.models.length === 0) {
      result.warnings.push(`Provider ${name} has no models defined`);
    }

    return result;
  }

  /**
   * Gera ficheiro .env exemplo com todos os providers
   * @returns {string} Conteúdo do ficheiro .env exemplo
   */
  generateEnvExample() {
    const lines = [
      '# NexoCLI_BaseGemini - Environment Configuration',
      '# Configure os providers que pretende utilizar',
      '',
      '# Gemini (Google AI)',
      '# Opção 1: API Key direta',
      'GEMINI_API_KEY=your_gemini_api_key_here',
      '# ou',
      'GOOGLE_API_KEY=your_google_api_key_here',
      '',
      '# Opção 2: Google Cloud / Vertex AI',
      'GOOGLE_CLOUD_PROJECT=your_project_id',
      'GOOGLE_CLOUD_LOCATION=us-central1',
      '',
      '# OpenRouter (Multi-provider API)',
      'OPENROUTER_API_KEY=your_openrouter_api_key_here',
      '',
      '# Anthropic Claude',
      'ANTHROPIC_API_KEY=your_anthropic_api_key_here',
      '',
      '# OpenAI',
      'OPENAI_API_KEY=your_openai_api_key_here',
      '',
      '# Database (opcional)',
      'DATABASE_PATH=./db/nexocli.db',
      '',
      '# Logging (opcional)',
      'NODE_ENV=development',
      ''
    ];

    return lines.join('\n');
  }

  /**
   * Obtém estatísticas do gestor de configuração
   * @returns {Object} Estatísticas
   */
  getStats() {
    const available = this.getAvailableProviders();
    const total = this.providers.size;

    return {
      total_providers: total,
      available_providers: available.length,
      unavailable_providers: total - available.length,
      default_provider: this.getDefaultProvider(),
      loaded_from_env: this.loadedFromEnv,
      config_path: this.configPath,
      providers: available
    };
  }

  /**
   * Recarrega todas as configurações
   */
  reload() {
    console.log('🔄 Reloading environment configuration...');
    
    this.loadEnvironment();
    this.loadProviderConfigs();
    
    const stats = this.getStats();
    console.log(`✅ Reloaded: ${stats.available_providers}/${stats.total_providers} providers available`);
    
    return stats;
  }

  /**
   * Log das configurações carregadas (modo debug)
   */
  async logConfiguration() {
    const sanitized = this.getSanitizedConfig();
    const stats = this.getStats();

    await logger.logDevelopment(
      'EnvManager',
      'configuration_loaded',
      `Loaded ${stats.available_providers}/${stats.total_providers} providers: ${stats.providers.join(', ')}`,
      'Medium'
    );

    // Log detalhado apenas em modo desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Environment Configuration:');
      console.log(`   Total providers: ${stats.total_providers}`);
      console.log(`   Available: ${stats.available_providers}`);
      console.log(`   Default: ${stats.default_provider}`);
      console.log(`   Loaded from .env: ${stats.loaded_from_env}`);
      
      if (stats.available_providers > 0) {
        console.log('   Available providers:');
        for (const name of stats.providers) {
          const config = this.providers.get(name);
          console.log(`     - ${name}: ${config.authType} (${config.models.length} models)`);
        }
      }
    }
  }
}

// Instância singleton para uso global
export const envManager = new EnvManager();