/**
 * @license
 * Modificado por Claude-Code, 2025
 * Baseado em código de gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
 * Ficheiro original: packages/cli/src/config/auth.ts
 */

import { logger } from '../utils/logger-adapter.js';

/**
 * Tipos de autenticação disponíveis
 */
export const AuthType = {
  LOGIN_WITH_GOOGLE: 'oauth-personal',
  USE_GEMINI: 'gemini-api-key',
  USE_VERTEX_AI: 'vertex-ai',
  CLOUD_SHELL: 'cloud-shell',
};

/**
 * Valida o método de autenticação selecionado
 * @param {string} authMethod - Método de autenticação a validar
 * @returns {string|null} Mensagem de erro ou null se válido
 */
export const validateAuthMethod = (authMethod) => {
  // Tentar carregar dotenv se disponível (síncrono)
  try {
    if (typeof process !== 'undefined' && process.env && !process.env.DOTENV_LOADED) {
      // Marcar como carregado para evitar múltiplas tentativas
      process.env.DOTENV_LOADED = 'true';
    }
  } catch (error) {
    // Ignorar erro de dotenv
  }

  if (
    authMethod === AuthType.LOGIN_WITH_GOOGLE ||
    authMethod === AuthType.CLOUD_SHELL
  ) {
    return null;
  }

  if (authMethod === AuthType.USE_GEMINI) {
    if (!process.env.GEMINI_API_KEY) {
      return 'GEMINI_API_KEY environment variable not found. Add that to your environment and try again (no reload needed if using .env)!';
    }
    return null;
  }

  if (authMethod === AuthType.USE_VERTEX_AI) {
    const hasVertexProjectLocationConfig =
      !!process.env.GOOGLE_CLOUD_PROJECT && !!process.env.GOOGLE_CLOUD_LOCATION;
    const hasGoogleApiKey = !!process.env.GOOGLE_API_KEY;
    
    if (!hasVertexProjectLocationConfig && !hasGoogleApiKey) {
      return (
        'When using Vertex AI, you must specify either:\n' +
        '• GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION environment variables.\n' +
        '• GOOGLE_API_KEY environment variable (if using express mode).\n' +
        'Update your environment and try again (no reload needed if using .env)!'
      );
    }
    return null;
  }

  return 'Invalid auth method selected.';
};

/**
 * Classe para gestão de autenticação OAuth
 */
export class OAuthManager {
  constructor() {
    this.authType = null;
    this.credentials = null;
    this.authenticated = false;
  }

  /**
   * Inicializa o sistema de autenticação
   * @param {string} authType - Tipo de autenticação a usar
   * @returns {Promise<boolean>} True se autenticação foi bem-sucedida
   */
  async initialize(authType = AuthType.LOGIN_WITH_GOOGLE) {
    try {
      // Validar método de autenticação
      const validationError = validateAuthMethod(authType);
      if (validationError) {
        throw new Error(validationError);
      }

      this.authType = authType;

      // Log da tentativa de autenticação
      await logger.logDevelopment(
        'NexoCLI_OAuth',
        'authentication_attempt',
        `Attempting authentication with method: ${authType}`,
        'Medium'
      );

      // Processar autenticação baseada no tipo
      switch (authType) {
        case AuthType.LOGIN_WITH_GOOGLE:
          await this.handleGoogleOAuth();
          break;
        case AuthType.USE_GEMINI:
          await this.handleGeminiApiKey();
          break;
        case AuthType.USE_VERTEX_AI:
          await this.handleVertexAI();
          break;
        case AuthType.CLOUD_SHELL:
          await this.handleCloudShell();
          break;
        default:
          throw new Error(`Unsupported authentication type: ${authType}`);
      }

      this.authenticated = true;

      // Log de sucesso
      await logger.logDevelopment(
        'NexoCLI_OAuth',
        'authentication_success',
        `Successfully authenticated with method: ${authType}`,
        'High'
      );

      return true;

    } catch (error) {
      // Log do erro
      await logger.logDevelopment(
        'NexoCLI_OAuth',
        'authentication_error',
        `Authentication failed: ${error.message}`,
        'High'
      );

      throw error;
    }
  }

  /**
   * Processa autenticação OAuth com Google
   * @private
   */
  async handleGoogleOAuth() {
    // Esta implementação será expandida na fase de integração
    // Por agora, simula processo OAuth
    console.log('🔐 Iniciando OAuth com Google...');
    
    // Simulação do processo OAuth
    // Em produção, isto abriria browser e processaria callback
    this.credentials = {
      type: 'oauth',
      access_token: 'simulated_oauth_token',
      refresh_token: 'simulated_refresh_token',
      expires_in: 3600,
      scope: 'https://www.googleapis.com/auth/cloud-platform'
    };

    console.log('✅ OAuth Google configurado (modo simulação)');
  }

  /**
   * Processa autenticação com Gemini API Key
   * @private
   */
  async handleGeminiApiKey() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    this.credentials = {
      type: 'api_key',
      api_key: apiKey
    };

    console.log('✅ Gemini API Key configurado');
  }

  /**
   * Processa autenticação com Vertex AI
   * @private
   */
  async handleVertexAI() {
    const project = process.env.GOOGLE_CLOUD_PROJECT;
    const location = process.env.GOOGLE_CLOUD_LOCATION;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (apiKey) {
      this.credentials = {
        type: 'vertex_api_key',
        api_key: apiKey,
        project,
        location
      };
    } else if (project && location) {
      this.credentials = {
        type: 'vertex_project',
        project,
        location
      };
    } else {
      throw new Error('Invalid Vertex AI configuration');
    }

    console.log('✅ Vertex AI configurado');
  }

  /**
   * Processa autenticação com Cloud Shell
   * @private
   */
  async handleCloudShell() {
    this.credentials = {
      type: 'cloud_shell'
    };

    console.log('✅ Cloud Shell configurado');
  }

  /**
   * Obtém as credenciais atuais
   * @returns {Object|null} Credenciais ou null se não autenticado
   */
  getCredentials() {
    return this.credentials;
  }

  /**
   * Verifica se está autenticado
   * @returns {boolean} True se autenticado
   */
  isAuthenticated() {
    return this.authenticated;
  }

  /**
   * Obtém o tipo de autenticação ativo
   * @returns {string|null} Tipo de autenticação ou null
   */
  getAuthType() {
    return this.authType;
  }

  /**
   * Limpa a autenticação
   */
  async logout() {
    this.authType = null;
    this.credentials = null;
    this.authenticated = false;

    await logger.logDevelopment(
      'NexoCLI_OAuth',
      'logout',
      'User logged out successfully',
      'Medium'
    );

    console.log('✅ Logout realizado com sucesso');
  }
}

// Instância singleton para uso global
export const oauth = new OAuthManager();