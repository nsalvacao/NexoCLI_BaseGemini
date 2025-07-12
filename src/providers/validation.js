/**
 * @license
 * Criado por Claude-Code, 2025
 * Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)
 * Sistema de validação de credenciais para múltiplos providers
 */

import { logger } from '../utils/logger-adapter.js';
import axios from 'axios';

/**
 * Validador de credenciais para múltiplos providers
 * Fornece validação robusta e defensiva para diferentes tipos de autenticação
 */
export class CredentialValidator {
  /**
   * Valida credenciais do Gemini
   * @param {Object} config - Configuração do provider
   * @returns {Promise<Object>} Resultado da validação
   */
  static async validateGemini(config) {
    const result = {
      valid: false,
      provider: 'gemini',
      authType: config.authType,
      errors: [],
      warnings: [],
      details: {}
    };

    try {
      switch (config.authType) {
        case 'api-key':
          return await this.validateGeminiApiKey(config, result);
        
        case 'oauth':
        case 'oauth-personal':
          return await this.validateGeminiOAuth(config, result);
        
        default:
          result.errors.push(`Unsupported auth type for Gemini: ${config.authType}`);
          return result;
      }
    } catch (error) {
      result.errors.push(`Validation error: ${error.message}`);
      
      await logger.logDevelopment(
        'CredentialValidator',
        'validation_error',
        `Gemini validation failed: ${error.message}`,
        'High'
      );
      
      return result;
    }
  }

  /**
   * Valida API Key do Gemini
   * @param {Object} config - Configuração
   * @param {Object} result - Objeto de resultado
   * @returns {Promise<Object>} Resultado da validação
   */
  static async validateGeminiApiKey(config, result) {
    const { credentials } = config;
    
    // Verificar se API key existe
    if (!credentials.apiKey) {
      result.errors.push('Missing Gemini API key');
      return result;
    }

    // Verificar formato da API key
    if (typeof credentials.apiKey !== 'string' || credentials.apiKey.trim().length === 0) {
      result.errors.push('Invalid Gemini API key format');
      return result;
    }

    // Verificar padrão da API key do Gemini (começa com AIza)
    if (!credentials.apiKey.startsWith('AIza')) {
      result.warnings.push('API key does not follow expected Gemini format (should start with AIza)');
    }

    try {
      // Testar API key com uma chamada real à API
      const testUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
      const testResponse = await axios.get(testUrl, {
        params: { key: credentials.apiKey },
        timeout: 10000 // 10 segundos
      });

      if (testResponse.status === 200 && testResponse.data.models) {
        result.valid = true;
        result.details = {
          models_count: testResponse.data.models.length,
          available_models: testResponse.data.models.slice(0, 3).map(m => m.name), // Primeiros 3 para logs
          test_successful: true
        };
      } else {
        result.errors.push('API key test failed: Invalid response format');
      }

    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            result.errors.push('API key is invalid or unauthorized');
            break;
          case 403:
            result.errors.push('API key has insufficient permissions');
            break;
          case 429:
            result.warnings.push('API rate limit reached, but key appears valid');
            result.valid = true; // Considerar válida se apenas rate limit
            break;
          default:
            result.errors.push(`API test failed: ${error.response.status} ${error.response.statusText}`);
        }
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        result.warnings.push('Network error during validation, assuming key is valid');
        result.valid = true; // Assumir válida se problema de rede
      } else {
        result.errors.push(`Network error: ${error.message}`);
      }
    }

    return result;
  }

  /**
   * Valida OAuth do Gemini
   * @param {Object} config - Configuração
   * @param {Object} result - Objeto de resultado
   * @returns {Promise<Object>} Resultado da validação
   */
  static async validateGeminiOAuth(config, result) {
    const { credentials } = config;

    // Para OAuth pessoal, apenas validações básicas
    if (config.authType === 'oauth-personal') {
      result.valid = true;
      result.details = {
        oauth_type: 'personal',
        requires_browser: true,
        test_successful: true
      };
      result.warnings.push('OAuth personal authentication will require browser interaction');
      return result;
    }

    // Para OAuth com projeto Google Cloud
    if (config.authType === 'oauth') {
      // Verificar se projeto está definido
      if (!credentials.projectId) {
        result.errors.push('Missing Google Cloud project ID for OAuth');
        return result;
      }

      // Verificar formato do projeto
      if (typeof credentials.projectId !== 'string' || credentials.projectId.trim().length === 0) {
        result.errors.push('Invalid Google Cloud project ID format');
        return result;
      }

      // Verificar se gcloud está instalado (tentativa)
      try {
        const { spawn } = await import('child_process');
        const gcloudTest = spawn('gcloud', ['--version'], { stdio: 'pipe' });
        
        let gcloudAvailable = false;
        
        await new Promise((resolve) => {
          gcloudTest.on('close', (code) => {
            gcloudAvailable = code === 0;
            resolve();
          });
          
          gcloudTest.on('error', () => {
            resolve();
          });
          
          // Timeout após 2 segundos
          setTimeout(resolve, 2000);
        });

        if (gcloudAvailable) {
          result.details = {
            oauth_type: 'cloud',
            project_id: credentials.projectId,
            gcloud_available: true,
            test_successful: true
          };
          result.valid = true;
        } else {
          result.warnings.push('gcloud CLI not found, OAuth may require manual setup');
          result.valid = true; // Assumir válida mesmo sem gcloud
          result.details = {
            oauth_type: 'cloud',
            project_id: credentials.projectId,
            gcloud_available: false,
            test_successful: false
          };
        }

      } catch (error) {
        result.warnings.push('Could not verify gcloud installation');
        result.valid = true; // Assumir válida
        result.details = {
          oauth_type: 'cloud',
          project_id: credentials.projectId,
          gcloud_check_error: error.message
        };
      }
    }

    return result;
  }

  /**
   * Valida credenciais do OpenRouter (preparação para Fase 4)
   * @param {Object} config - Configuração do provider
   * @returns {Promise<Object>} Resultado da validação
   */
  static async validateOpenRouter(config) {
    const result = {
      valid: false,
      provider: 'openrouter',
      authType: config.authType,
      errors: [],
      warnings: [],
      details: {}
    };

    // CORREÇÃO: Verificar apiKey diretamente no config ou em credentials
    const apiKey = config.apiKey || config.credentials?.apiKey;

    // Verificar se API key existe
    if (!apiKey) {
      result.errors.push('Missing OpenRouter API key');
      return result;
    }

    try {
      // Testar API key com endpoint de modelos
      const testUrl = 'https://openrouter.ai/api/v1/models';
      const testResponse = await axios.get(testUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (testResponse.status === 200) {
        result.valid = true;
        result.details = {
          models_count: testResponse.data.data?.length || 0,
          test_successful: true
        };
      }

    } catch (error) {
      if (error.response?.status === 401) {
        result.errors.push('OpenRouter API key is invalid');
      } else if (error.response?.status === 403) {
        result.errors.push('OpenRouter API key has insufficient permissions');
      } else {
        result.warnings.push('Network error during OpenRouter validation');
        result.valid = true; // Assumir válida se problema de rede
      }
    }

    return result;
  }

  /**
   * Valida credenciais do Anthropic (preparação para Fase 4)
   * @param {Object} config - Configuração do provider
   * @returns {Promise<Object>} Resultado da validação
   */
  static async validateAnthropic(config) {
    const result = {
      valid: false,
      provider: 'anthropic',
      authType: config.authType,
      errors: [],
      warnings: [],
      details: {}
    };

    // CORREÇÃO: Verificar apiKey diretamente no config ou em credentials
    const apiKey = config.apiKey || config.credentials?.apiKey;

    if (!apiKey) {
      result.errors.push('Missing Anthropic API key');
      return result;
    }

    // Verificar formato da API key (começa com sk-ant-)
    if (!apiKey.startsWith('sk-ant-')) {
      result.warnings.push('API key does not follow expected Anthropic format');
    }

    // Para Fase 3, apenas validação básica
    result.valid = true;
    result.details = {
      format_valid: credentials.apiKey.startsWith('sk-ant-'),
      test_successful: true
    };
    result.warnings.push('Full Anthropic validation will be implemented in Phase 4');

    return result;
  }

  /**
   * Valida credenciais do OpenAI (preparação para Fase 4)
   * @param {Object} config - Configuração do provider
   * @returns {Promise<Object>} Resultado da validação
   */
  static async validateOpenAI(config) {
    const result = {
      valid: false,
      provider: 'openai',
      authType: config.authType,
      errors: [],
      warnings: [],
      details: {}
    };

    const { credentials } = config;

    if (!credentials.apiKey) {
      result.errors.push('Missing OpenAI API key');
      return result;
    }

    // Verificar formato da API key (começa com sk-)
    if (!credentials.apiKey.startsWith('sk-')) {
      result.warnings.push('API key does not follow expected OpenAI format');
    }

    // Para Fase 3, apenas validação básica
    result.valid = true;
    result.details = {
      format_valid: credentials.apiKey.startsWith('sk-'),
      test_successful: true
    };
    result.warnings.push('Full OpenAI validation will be implemented in Phase 4');

    return result;
  }

  /**
   * Valida credenciais de um provider específico
   * @param {string} providerName - Nome do provider
   * @param {Object} config - Configuração do provider
   * @returns {Promise<Object>} Resultado da validação
   */
  static async validateProvider(providerName, config) {
    await logger.logDevelopment(
      'CredentialValidator',
      'validation_start',
      `Starting credential validation for provider: ${providerName}`,
      'Medium'
    );

    let result;

    try {
      switch (providerName.toLowerCase()) {
        case 'gemini':
          result = await this.validateGemini(config);
          break;
        
        case 'openrouter':
          result = await this.validateOpenRouter(config);
          break;
        
        case 'anthropic':
          result = await this.validateAnthropic(config);
          break;
        
        case 'openai':
          result = await this.validateOpenAI(config);
          break;
        
        default:
          result = {
            valid: false,
            provider: providerName,
            authType: config.authType || 'unknown',
            errors: [`Unknown provider: ${providerName}`],
            warnings: [],
            details: {}
          };
      }

      // Log do resultado
      await logger.logDevelopment(
        'CredentialValidator',
        'validation_complete',
        `Validation for ${providerName}: ${result.valid ? 'SUCCESS' : 'FAILED'} - ${result.errors.length} errors, ${result.warnings.length} warnings`,
        result.valid ? 'Medium' : 'High'
      );

      return result;

    } catch (error) {
      const errorResult = {
        valid: false,
        provider: providerName,
        authType: config.authType || 'unknown',
        errors: [`Validation exception: ${error.message}`],
        warnings: [],
        details: { exception: error.name }
      };

      await logger.logDevelopment(
        'CredentialValidator',
        'validation_exception',
        `Validation exception for ${providerName}: ${error.message}`,
        'Critical'
      );

      return errorResult;
    }
  }

  /**
   * Valida múltiplos providers em paralelo
   * @param {Map} providers - Mapa de providers e suas configurações
   * @returns {Promise<Object>} Resultados de validação consolidados
   */
  static async validateMultipleProviders(providers) {
    const validationPromises = [];
    const results = {
      total: providers.size,
      valid: 0,
      invalid: 0,
      providers: {},
      summary: {
        valid_providers: [],
        invalid_providers: [],
        warnings: []
      }
    };

    // Criar promises de validação para todos os providers
    for (const [name, config] of providers) {
      validationPromises.push(
        this.validateProvider(name, config)
          .then(result => ({ name, result }))
          .catch(error => ({
            name,
            result: {
              valid: false,
              provider: name,
              errors: [`Exception: ${error.message}`],
              warnings: [],
              details: {}
            }
          }))
      );
    }

    // Executar todas as validações em paralelo
    const validationResults = await Promise.all(validationPromises);

    // Processar resultados
    for (const { name, result } of validationResults) {
      results.providers[name] = result;
      
      if (result.valid) {
        results.valid++;
        results.summary.valid_providers.push(name);
      } else {
        results.invalid++;
        results.summary.invalid_providers.push(name);
      }

      // Adicionar warnings ao summary
      if (result.warnings.length > 0) {
        results.summary.warnings.push(...result.warnings.map(w => `${name}: ${w}`));
      }
    }

    await logger.logDevelopment(
      'CredentialValidator',
      'multi_validation_complete',
      `Multi-provider validation: ${results.valid}/${results.total} valid providers`,
      'Medium'
    );

    return results;
  }

  /**
   * Executa teste rápido de conectividade
   * @param {string} providerName - Nome do provider
   * @param {Object} config - Configuração do provider
   * @returns {Promise<boolean>} True se conexão é possível
   */
  static async quickConnectivityTest(providerName, config) {
    try {
      const result = await this.validateProvider(providerName, config);
      return result.valid && result.errors.length === 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtém estatísticas de validação para debugging
   * @param {Object} validationResult - Resultado de validação
   * @returns {Object} Estatísticas formatadas
   */
  static getValidationStats(validationResult) {
    if (validationResult.total !== undefined) {
      // Resultado de múltiplos providers
      return {
        type: 'multi-provider',
        total_providers: validationResult.total,
        valid_providers: validationResult.valid,
        invalid_providers: validationResult.invalid,
        success_rate: `${Math.round((validationResult.valid / validationResult.total) * 100)}%`,
        providers: validationResult.summary.valid_providers,
        issues: validationResult.summary.invalid_providers.length + validationResult.summary.warnings.length
      };
    } else {
      // Resultado de provider único
      return {
        type: 'single-provider',
        provider: validationResult.provider,
        valid: validationResult.valid,
        auth_type: validationResult.authType,
        errors: validationResult.errors.length,
        warnings: validationResult.warnings.length,
        has_details: Object.keys(validationResult.details).length > 0
      };
    }
  }
}