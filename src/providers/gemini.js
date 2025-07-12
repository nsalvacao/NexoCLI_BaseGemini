/**
 * @license
 * Modificado por Claude-Code, 2025
 * Baseado em código de gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
 * Provider Gemini para NexoCLI_BaseGemini
 */

import { BaseProvider } from './base.js';
import { GeminiClient } from '../gemini/client.js';
import { oauth, AuthType } from '../auth/oauth.js';
import { settings } from '../config/settings.js';

/**
 * Provider Gemini
 * Implementa interface BaseProvider para Google Gemini
 */
export class GeminiProvider extends BaseProvider {
  constructor(config = {}) {
    super('gemini', {
      model: config.model || 'gemini-1.5-flash',
      temperature: config.temperature || 0,
      topP: config.topP || 1,
      maxTokens: config.maxTokens || 1000,
      authType: config.authType || AuthType.LOGIN_WITH_GOOGLE,
      ...config,
    });
    
    this.authType = this.config.authType;
    this.oauthManager = oauth;
  }

  /**
   * Inicializa o provider Gemini
   * @returns {Promise<boolean>} True se inicialização foi bem-sucedida
   */
  async initialize() {
    try {
      await this.logDevelopment(
        'initialize_start',
        `Initializing Gemini provider with auth type: ${this.authType}`,
        'Medium'
      );

      // Inicializar configurações se necessário
      if (!settings.loaded) {
        await settings.initialize();
      }

      // Aplicar configurações do settings apenas se não estão definidas
      const geminiConfig = settings.getGeminiConfig();
      this.config = {
        ...geminiConfig,
        ...this.config, // Preservar configurações já definidas
      };

      this.initialized = true;

      await this.logDevelopment(
        'initialize_success',
        'Gemini provider initialized successfully',
        'Medium'
      );

      return true;
    } catch (error) {
      await this.logDevelopment(
        'initialize_error',
        `Failed to initialize Gemini provider: ${error.message}`,
        'High'
      );
      throw this.handleError(error, 'initialize');
    }
  }

  /**
   * Autentica o provider Gemini
   * @returns {Promise<boolean>} True se autenticação foi bem-sucedida
   */
  async authenticate() {
    try {
      if (!this.initialized) {
        throw new Error('Provider not initialized. Call initialize() first.');
      }

      await this.logDevelopment(
        'authenticate_start',
        `Authenticating with ${this.authType}`,
        'Medium'
      );

      // Autenticar usando OAuth manager
      await this.oauthManager.initialize(this.authType);
      
      if (!this.oauthManager.isAuthenticated()) {
        throw new Error('OAuth authentication failed');
      }

      // Obter credenciais
      const credentials = this.oauthManager.getCredentials();
      
      // Criar cliente Gemini
      this.client = new GeminiClient(credentials, this.config);
      await this.client.initialize();

      this.authenticated = true;

      await this.logDevelopment(
        'authenticate_success',
        'Gemini authentication successful',
        'High'
      );

      await this.logAction('authentication', 'success', {
        authType: this.authType,
        model: this.config.model,
      });

      return true;
    } catch (error) {
      await this.logDevelopment(
        'authenticate_error',
        `Authentication failed: ${error.message}`,
        'High'
      );

      await this.logAction('authentication', 'error', {
        authType: this.authType,
        error_message: error.message,
      });

      throw this.handleError(error, 'authenticate');
    }
  }

  /**
   * Envia mensagem para o Gemini
   * @param {string} message - Mensagem a enviar
   * @param {Object} options - Opções adicionais
   * @returns {Promise<Object>} Resposta do Gemini
   */
  async sendMessage(message, options = {}) {
    try {
      if (!this.isReady()) {
        throw new Error('Provider not ready. Call initialize() and authenticate() first.');
      }

      // Validar mensagem
      if (!this.validateMessage(message)) {
        throw new Error('Invalid message format or content');
      }

      await this.logDevelopment(
        'send_message_start',
        `Sending message to Gemini (${message.length} chars)`,
        'Medium'
      );

      // Processar opções
      const processedOptions = this.processOptions(options);

      // Enviar mensagem usando cliente
      const response = await this.client.sendMessage(message, processedOptions);

      await this.logDevelopment(
        'send_message_success',
        `Message sent successfully, response: ${response.text.length} chars`,
        'Medium'
      );

      // Retornar resposta padronizada
      return {
        success: true,
        response: response.text,
        model: response.model,
        tokensUsed: response.tokensUsed,
        sessionId: response.sessionId,
        messageCount: response.messageCount,
        provider: 'gemini',
        timestamp: new Date().toISOString(),
      };

    } catch (error) {
      await this.logDevelopment(
        'send_message_error',
        `Failed to send message: ${error.message}`,
        'High'
      );

      throw this.handleError(error, 'sendMessage');
    }
  }

  /**
   * Lista modelos disponíveis
   * @returns {Promise<Array>} Lista de modelos
   */
  async listModels() {
    try {
      if (!this.isReady()) {
        throw new Error('Provider not ready. Call initialize() and authenticate() first.');
      }

      await this.logDevelopment(
        'list_models_start',
        'Listing available models',
        'Low'
      );

      const models = await this.client.listModels();

      await this.logDevelopment(
        'list_models_success',
        `Found ${models.length} models`,
        'Low'
      );

      return models;
    } catch (error) {
      await this.logDevelopment(
        'list_models_error',
        `Failed to list models: ${error.message}`,
        'Medium'
      );

      throw this.handleError(error, 'listModels');
    }
  }

  /**
   * Obtém informações do modelo atual
   * @returns {Object} Informações do modelo
   */
  getModelInfo() {
    const baseInfo = super.getModelInfo();
    
    if (this.client) {
      const clientInfo = this.client.getModelInfo();
      return {
        ...baseInfo,
        ...clientInfo,
        authType: this.authType,
        sessionStats: this.client.getSessionStats(),
      };
    }
    
    return {
      ...baseInfo,
      authType: this.authType,
    };
  }

  /**
   * Obtém capacidades específicas do Gemini
   * @returns {Array} Lista de capacidades
   */
  getCapabilities() {
    const baseCaps = super.getCapabilities();
    return [
      ...baseCaps,
      'multimodal-input',
      'code-generation',
      'reasoning',
      'creative-writing',
      'analysis',
      'oauth-authentication',
      'api-key-authentication',
      'vertex-ai-integration',
    ];
  }

  /**
   * Obtém estatísticas específicas do Gemini
   * @returns {Object} Estatísticas do provider
   */
  getStats() {
    const baseStats = super.getStats();
    
    return {
      ...baseStats,
      authType: this.authType,
      isOAuthAuthenticated: this.oauthManager.isAuthenticated(),
      clientStats: this.client ? this.client.getSessionStats() : null,
    };
  }

  /**
   * Altera o modelo usado
   * @param {string} model - Novo modelo
   * @returns {Promise<boolean>} True se alteração foi bem-sucedida
   */
  async changeModel(model) {
    try {
      await this.logDevelopment(
        'change_model_start',
        `Changing model from ${this.config.model} to ${model}`,
        'Medium'
      );

      // Atualizar configuração
      this.config.model = model;

      // Reinicializar cliente se necessário
      if (this.client) {
        this.client.config.model = model;
      }

      await this.logDevelopment(
        'change_model_success',
        `Model changed to ${model}`,
        'Medium'
      );

      await this.logAction('model_change', 'success', {
        newModel: model,
      });

      return true;
    } catch (error) {
      await this.logDevelopment(
        'change_model_error',
        `Failed to change model: ${error.message}`,
        'High'
      );

      throw this.handleError(error, 'changeModel');
    }
  }

  /**
   * Limpa a sessão atual
   * @returns {Promise<boolean>} True se limpeza foi bem-sucedida
   */
  async clearSession() {
    try {
      if (this.client) {
        await this.client.clearSession();
      }

      await this.logDevelopment(
        'session_cleared',
        'Session cleared successfully',
        'Medium'
      );

      return true;
    } catch (error) {
      await this.logDevelopment(
        'clear_session_error',
        `Failed to clear session: ${error.message}`,
        'Medium'
      );

      throw this.handleError(error, 'clearSession');
    }
  }

  /**
   * Executa limpeza específica do Gemini
   */
  async cleanup() {
    try {
      // Limpeza do OAuth
      if (this.oauthManager && this.oauthManager.isAuthenticated()) {
        await this.oauthManager.logout();
      }

      // Limpeza base
      await super.cleanup();

      await this.logDevelopment(
        'cleanup_complete',
        'Gemini provider cleanup completed',
        'Medium'
      );
    } catch (error) {
      await this.logDevelopment(
        'cleanup_error',
        `Cleanup failed: ${error.message}`,
        'Medium'
      );
    }
  }

  /**
   * Testa a conexão com o Gemini
   * @returns {Promise<Object>} Resultado do teste
   */
  async testConnection() {
    try {
      await this.logDevelopment(
        'test_connection_start',
        'Testing connection to Gemini',
        'Low'
      );

      const testMessage = 'Hello, this is a connection test from NexoCLI_BaseGemini';
      const response = await this.sendMessage(testMessage);

      const result = {
        success: true,
        message: 'Connection test successful',
        response: response.response,
        model: response.model,
        tokensUsed: response.tokensUsed,
        timestamp: new Date().toISOString(),
      };

      await this.logDevelopment(
        'test_connection_success',
        'Connection test passed',
        'Low'
      );

      return result;
    } catch (error) {
      await this.logDevelopment(
        'test_connection_error',
        `Connection test failed: ${error.message}`,
        'Medium'
      );

      return {
        success: false,
        message: 'Connection test failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Valida credenciais do Gemini
   * @returns {Promise<boolean>} True se credenciais são válidas
   */
  async validateCredentials() {
    try {
      await this.logDevelopment(
        'validate_credentials_start',
        `Validating credentials for auth type: ${this.authType}`,
        'Medium'
      );

      let isValid = false;

      switch (this.authType) {
        case AuthType.USE_GEMINI:
          // Validar API key
          if (this.config.apiKey) {
            // Testar com uma chamada simples à API
            try {
              const testUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
              const axios = (await import('axios')).default;
              
              const response = await axios.get(testUrl, {
                params: { key: this.config.apiKey },
                timeout: 10000
              });
              
              isValid = response.status === 200 && response.data.models;
            } catch (error) {
              if (error.response?.status === 429) {
                // Rate limit - assumir que chave é válida
                isValid = true;
              } else {
                isValid = false;
              }
            }
          }
          break;

        case AuthType.LOGIN_WITH_GOOGLE:
        case AuthType.CLOUD_SHELL:
          // Para OAuth, verificar se o manager está configurado
          isValid = this.oauthManager !== null;
          
          // Se já autenticado, verificar se ainda é válido
          if (isValid && this.oauthManager.isAuthenticated()) {
            try {
              const credentials = this.oauthManager.getCredentials();
              isValid = credentials !== null;
            } catch {
              isValid = true; // Assumir válido se não conseguir verificar
            }
          }
          break;

        case AuthType.USE_VERTEX_AI:
          // Para Vertex AI, verificar configuração de projeto
          isValid = !!(this.config.projectId || process.env.GOOGLE_CLOUD_PROJECT);
          break;

        default:
          isValid = false;
      }

      await this.logDevelopment(
        'validate_credentials_complete',
        `Credential validation result: ${isValid}`,
        'Medium'
      );

      return isValid;

    } catch (error) {
      await this.logDevelopment(
        'validate_credentials_error',
        `Credential validation failed: ${error.message}`,
        'High'
      );

      return false;
    }
  }

  /**
   * Obtém requisitos específicos de configuração do Gemini
   * @returns {Object} Requisitos de configuração
   */
  getConfigRequirements() {
    const baseRequirements = super.getConfigRequirements();
    
    return {
      ...baseRequirements,
      authTypes: [
        'oauth-personal',
        'api-key', 
        'oauth',
        'vertex-ai'
      ],
      required: [...baseRequirements.required],
      optional: [
        ...baseRequirements.optional,
        'apiKey',
        'projectId',
        'location'
      ],
      models: [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro',
        'gemini-pro-vision'
      ],
      description: 'Google Gemini provider configuration requirements'
    };
  }

  /**
   * Valida configuração específica do Gemini
   * @param {Object} config - Configuração a validar
   * @returns {Object} Resultado da validação
   */
  validateConfig(config = this.config) {
    const result = super.validateConfig(config);

    // Validações específicas do Gemini
    switch (config.authType) {
      case AuthType.USE_GEMINI:
        if (!config.apiKey) {
          result.errors.push('API key is required for Gemini auth type');
          result.valid = false;
        } else if (!config.apiKey.startsWith('AIza')) {
          result.warnings.push('API key should start with "AIza" for Gemini');
        }
        break;

      case AuthType.USE_VERTEX_AI:
        if (!config.projectId && !process.env.GOOGLE_CLOUD_PROJECT) {
          result.errors.push('Project ID is required for Vertex AI');
          result.valid = false;
        }
        break;

      case AuthType.LOGIN_WITH_GOOGLE:
      case AuthType.CLOUD_SHELL:
        // OAuth não requer validação específica
        break;

      default:
        result.warnings.push(`Unknown auth type for Gemini: ${config.authType}`);
    }

    // Validar modelos específicos do Gemini
    const validModels = this.getConfigRequirements().models;
    if (config.model && !validModels.includes(config.model)) {
      result.warnings.push(`Model ${config.model} may not be supported by Gemini`);
    }

    return result;
  }
}