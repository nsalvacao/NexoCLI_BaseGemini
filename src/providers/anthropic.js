/**
 * @license
 * Copyright 2025 Nuno Salvação
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * Created by Claude-Code, 2025
 * Anthropic Provider - Claude models integration
 */

import { BaseProvider } from './base.js';
import axios from 'axios';

export class AnthropicProvider extends BaseProvider {
  constructor(config = {}) {
    super('anthropic', config);
    
    this.apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
    this.baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
    this.defaultModel = config.model || 'claude-3-haiku-20240307';
    this.maxTokens = config.maxTokens || 1000;
    this.anthropicVersion = '2023-06-01';
    
    // Modelos disponíveis na Anthropic
    this.knownModels = [
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        description: 'Fast and efficient model for everyday tasks',
        maxTokens: 4096,
        costPer1K: { input: 0.00025, output: 0.00125 }
      },
      {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        description: 'Balanced performance for complex tasks',
        maxTokens: 4096,
        costPer1K: { input: 0.003, output: 0.015 }
      },
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        description: 'Most capable model for highly complex tasks',
        maxTokens: 4096,
        costPer1K: { input: 0.015, output: 0.075 }
      }
    ];

    // Rate limiting - Anthropic tem limites conservadores
    this.rateLimits = {
      'claude-3-haiku-20240307': 100, // requests per minute
      'claude-3-sonnet-20240229': 50,
      'claude-3-opus-20240229': 20
    };
  }

  async initialize() {
    try {
      if (!this.apiKey) {
        throw new Error('Anthropic API key is required');
      }

      // Validar formato da chave
      if (!this.apiKey.startsWith('sk-ant-')) {
        throw new Error('Anthropic API key should start with "sk-ant-"');
      }

      // Testar conectividade inicial
      await this.testConnection();
      
      this.initialized = true;
      console.log(`✅ Anthropic provider initialized with model: ${this.defaultModel}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Anthropic initialization failed: ${error.message}`);
      throw error;
    }
  }

  async authenticate() {
    if (!this.apiKey) {
      throw new Error('Anthropic API key not provided');
    }

    // Anthropic usa header x-api-key
    this.authenticated = true;
    return true;
  }

  async validateCredentials() {
    try {
      if (!this.apiKey) {
        return {
          valid: false,
          errors: ['Anthropic API key is required'],
          warnings: []
        };
      }

      // Validar formato da chave
      if (!this.apiKey.startsWith('sk-ant-')) {
        return {
          valid: false,
          errors: ['Anthropic API key should start with "sk-ant-"'],
          warnings: []
        };
      }

      // Teste simples de validação com message mínima
      const testResult = await this.sendMessage('Hi', { 
        maxTokens: 10,
        model: 'claude-3-haiku-20240307' // Modelo mais barato para teste
      });

      if (testResult && testResult.length > 0) {
        return {
          valid: true,
          errors: [],
          warnings: []
        };
      }

      return {
        valid: false,
        errors: ['No response received from Anthropic API'],
        warnings: []
      };

    } catch (error) {
      // Verificar tipos de erro específicos
      if (error.message.includes('401') || error.message.includes('authentication')) {
        return {
          valid: false,
          errors: ['Invalid Anthropic API key'],
          warnings: []
        };
      }

      if (error.message.includes('rate_limit') || error.message.includes('429')) {
        return {
          valid: true,
          errors: [],
          warnings: ['API key valid but rate limited']
        };
      }

      // Defensive programming - problemas de rede
      if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
        return {
          valid: true,
          errors: [],
          warnings: ['Could not verify credentials due to network issues']
        };
      }

      return {
        valid: false,
        errors: [`Anthropic API validation failed: ${error.message}`],
        warnings: []
      };
    }
  }

  async testConnection() {
    try {
      const startTime = Date.now();
      
      const response = await this.sendMessage('Test', {
        model: 'claude-3-haiku-20240307',
        maxTokens: 10
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        success: true,
        responseTime,
        model: 'claude-3-haiku-20240307',
        response: response.substring(0, 50) + '...',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async sendMessage(message, options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.authenticated) {
      await this.authenticate();
    }

    const requestOptions = this.processOptions(options);
    const model = requestOptions.model || this.defaultModel;
    const maxTokens = requestOptions.maxTokens || this.maxTokens;
    
    const payload = {
      model: model,
      max_tokens: maxTokens,
      messages: [
        {
          role: 'user',
          content: message
        }
      ],
      temperature: requestOptions.temperature || 0
    };

    // Adicionar system message se fornecido
    if (requestOptions.systemMessage || this.config.systemMessage) {
      payload.system = requestOptions.systemMessage || this.config.systemMessage;
    }

    try {
      const startTime = Date.now();
      
      const response = await this.makeRequest('/messages', {
        method: 'POST',
        data: payload,
        timeout: 60000 // Anthropic pode ser mais lento
      });

      const responseTime = Date.now() - startTime;

      if (!response.content || response.content.length === 0) {
        throw new Error('No content received from Anthropic');
      }

      const responseText = response.content[0].text;
      const usage = response.usage || {};

      // Log na BD via logger
      if (this.logger) {
        await this.logger.logProviderAction({
          provider: 'anthropic',
          model: model,
          action: 'sendMessage',
          status: 'success',
          response_time_ms: responseTime,
          tokens_used: usage.output_tokens || 0,
          cost_estimate: this.estimateCost(usage, model),
          user_input: message.substring(0, 100),
          agent_response: responseText.substring(0, 100)
        });
      }

      return responseText;

    } catch (error) {
      // Log erro na BD
      if (this.logger) {
        await this.logger.logProviderAction({
          provider: 'anthropic',
          model: model,
          action: 'sendMessage',
          status: 'error',
          error_message: error.message,
          user_input: message.substring(0, 100)
        });
      }

      // Tratamento específico de erros Anthropic
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 429) {
          throw new Error(`Anthropic rate limit exceeded: ${errorData.error?.message || 'Too many requests'}`);
        }
        
        if (status === 401) {
          throw new Error('Invalid Anthropic API key');
        }
        
        if (status === 400) {
          throw new Error(`Invalid request: ${errorData.error?.message || 'Bad request'}`);
        }
      }

      throw new Error(`Anthropic request failed: ${error.message}`);
    }
  }

  async listModels() {
    // Anthropic não tem endpoint público de models
    // Retornar modelos conhecidos
    return this.knownModels.map(model => ({
      id: model.id,
      name: model.name,
      description: model.description,
      context_length: model.maxTokens,
      capabilities: this.getModelCapabilities(model.id),
      pricing: model.costPer1K
    }));
  }

  getModelCapabilities(modelId) {
    const baseCapabilities = ['chat', 'reasoning', 'analysis', 'writing'];
    
    if (modelId.includes('opus')) {
      return [...baseCapabilities, 'complex-reasoning', 'creative-writing', 'code-generation'];
    }
    
    if (modelId.includes('sonnet')) {
      return [...baseCapabilities, 'balanced-performance', 'code-assistance'];
    }
    
    if (modelId.includes('haiku')) {
      return [...baseCapabilities, 'fast-response', 'efficient'];
    }
    
    return baseCapabilities;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'anthropic-version': this.anthropicVersion,
      ...options.headers
    };

    const requestConfig = {
      url,
      method: options.method || 'GET',
      headers,
      timeout: options.timeout || 60000,
      ...options
    };

    const response = await axios(requestConfig);
    return response.data;
  }

  estimateCost(usage, model) {
    if (!usage) return 0;
    
    const modelInfo = this.knownModels.find(m => m.id === model);
    if (!modelInfo) return 0;
    
    const inputCost = (usage.input_tokens || 0) / 1000 * modelInfo.costPer1K.input;
    const outputCost = (usage.output_tokens || 0) / 1000 * modelInfo.costPer1K.output;
    
    return Math.round((inputCost + outputCost) * 100000) / 100000; // 5 decimal places
  }

  async changeModel(newModel) {
    const availableModels = this.knownModels.map(m => m.id);
    
    if (!availableModels.includes(newModel)) {
      throw new Error(`Model ${newModel} not available. Available: ${availableModels.join(', ')}`);
    }

    this.defaultModel = newModel;
    this.config.model = newModel;
    
    console.log(`Anthropic model changed to: ${newModel}`);
    return true;
  }

  async getQuotaInfo() {
    try {
      // Anthropic não tem endpoint de quota pública
      return {
        provider: 'anthropic',
        quotaType: 'pay-per-use',
        remainingRequests: 'Variable by model',
        resetTime: null,
        rateLimits: this.rateLimits,
        models: this.knownModels.length,
        note: 'Rate limits vary by model tier'
      };
    } catch (error) {
      return {
        provider: 'anthropic',
        error: error.message
      };
    }
  }

  async healthCheck() {
    try {
      const start = Date.now();
      
      // Health check com message mínima
      await this.sendMessage('ping', { 
        maxTokens: 5,
        model: 'claude-3-haiku-20240307' 
      });
      
      const responseTime = Date.now() - start;
      
      return {
        healthy: true,
        responseTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  getConfigRequirements() {
    return {
      authTypes: ['api-key'],
      models: this.knownModels.map(m => m.id),
      required: ['apiKey'],
      optional: ['model', 'maxTokens', 'temperature', 'systemMessage'],
      description: 'Anthropic Claude - Advanced AI assistant',
      website: 'https://anthropic.com',
      documentation: 'https://docs.anthropic.com/claude/reference'
    };
  }

  getCapabilities() {
    return [
      'advanced-reasoning',
      'long-context',
      'code-generation',
      'analysis',
      'creative-writing',
      'multilingual',
      'ethical-ai'
    ];
  }

  validateConfig(config = this.config) {
    const result = super.validateConfig(config);
    
    // Validações específicas Anthropic
    if (!config.apiKey && !process.env.ANTHROPIC_API_KEY) {
      result.errors.push('Anthropic API key is required');
      result.valid = false;
    }

    if (config.apiKey && !config.apiKey.startsWith('sk-ant-')) {
      result.warnings.push('Anthropic API key should start with "sk-ant-"');
    }

    if (config.maxTokens && config.maxTokens > 4096) {
      result.warnings.push('Anthropic models currently support max 4096 tokens');
    }

    if (config.model && !this.knownModels.some(m => m.id === config.model)) {
      result.warnings.push(`Unknown Anthropic model: ${config.model}`);
    }

    return result;
  }

  getSanitizedConfig() {
    const config = super.getSanitizedConfig();
    
    // Sanitizar configurações específicas
    if (config.apiKey) {
      config.apiKey = '[REDACTED]';
    }

    return config;
  }

  async cleanup() {
    this.initialized = false;
    this.authenticated = false;
    
    console.log('Anthropic provider cleaned up');
  }
}