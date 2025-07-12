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
 * Together AI Provider - Open-source models with fast inference
 */

import { BaseProvider } from './base.js';
import axios from 'axios';

export class TogetherProvider extends BaseProvider {
  constructor(config = {}) {
    super('together', config);
    
    this.apiKey = config.apiKey || process.env.TOGETHER_API_KEY;
    this.baseUrl = config.baseUrl || 'https://api.together.xyz/v1';
    this.defaultModel = config.model || 'meta-llama/Llama-2-7b-chat-hf';
    
    // Cache de modelos por 2 horas
    this.availableModels = null;
    this.modelsLastFetch = null;
    this.modelsCacheExpiry = 2 * 60 * 60 * 1000; // 2 horas
    
    // Modelos populares conhecidos
    this.knownModels = [
      {
        id: 'meta-llama/Llama-2-7b-chat-hf',
        name: 'Llama 2 7B Chat',
        description: 'Fast and efficient chat model',
        maxTokens: 4096,
        type: 'chat'
      },
      {
        id: 'meta-llama/Llama-2-13b-chat-hf',
        name: 'Llama 2 13B Chat',
        description: 'Larger Llama model with better performance',
        maxTokens: 4096,
        type: 'chat'
      },
      {
        id: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
        name: 'Nous Hermes 2 Mixtral',
        description: 'High-performance mixture of experts model',
        maxTokens: 32768,
        type: 'chat'
      },
      {
        id: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        name: 'Mixtral 8x7B Instruct',
        description: 'Mistral mixture of experts model',
        maxTokens: 32768,
        type: 'chat'
      },
      {
        id: 'togethercomputer/RedPajama-INCITE-Chat-3B-v1',
        name: 'RedPajama Chat 3B',
        description: 'Small but capable chat model',
        maxTokens: 2048,
        type: 'chat'
      }
    ];

    // Rate limiting - Together tem limites generosos
    this.maxRequestsPerMinute = 120;
  }

  async initialize() {
    try {
      if (!this.apiKey) {
        throw new Error('Together API key is required');
      }

      // Testar conectividade inicial
      await this.testConnection();
      
      this.initialized = true;
      console.log(`✅ Together provider initialized with model: ${this.defaultModel}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Together initialization failed: ${error.message}`);
      throw error;
    }
  }

  async authenticate() {
    if (!this.apiKey) {
      throw new Error('Together API key not provided');
    }

    // Together usa Bearer token
    this.authenticated = true;
    return true;
  }

  async validateCredentials() {
    try {
      if (!this.apiKey) {
        return {
          valid: false,
          errors: ['Together API key is required'],
          warnings: []
        };
      }

      // Teste real da API com request de modelos
      const response = await this.makeRequest('/models', {
        method: 'GET',
        timeout: 10000
      });

      if (response && Array.isArray(response)) {
        return {
          valid: true,
          errors: [],
          warnings: response.length === 0 ? ['No models available'] : []
        };
      }

      return {
        valid: false,
        errors: ['Invalid response from Together API'],
        warnings: []
      };

    } catch (error) {
      // Verificar tipos de erro específicos
      if (error.response && error.response.status === 401) {
        return {
          valid: false,
          errors: ['Invalid Together API key'],
          warnings: []
        };
      }

      // Defensive programming - assumir válida se erro de rede
      if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
        return {
          valid: true,
          errors: [],
          warnings: ['Could not verify credentials due to network issues']
        };
      }

      return {
        valid: false,
        errors: [`Together API validation failed: ${error.message}`],
        warnings: []
      };
    }
  }

  async testConnection() {
    try {
      const startTime = Date.now();
      
      const response = await this.sendMessage('Hello', {
        model: this.defaultModel,
        maxTokens: 10
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        success: true,
        responseTime,
        model: this.defaultModel,
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
    
    const payload = {
      model: model,
      messages: [
        {
          role: 'user',
          content: message
        }
      ],
      temperature: requestOptions.temperature || 0.7,
      max_tokens: requestOptions.maxTokens || 512,
      top_p: requestOptions.topP || 0.9,
      stream: false
    };

    // Adicionar system message se disponível
    if (requestOptions.systemMessage || this.config.systemMessage) {
      payload.messages.unshift({
        role: 'system',
        content: requestOptions.systemMessage || this.config.systemMessage
      });
    }

    try {
      const startTime = Date.now();
      
      const response = await this.makeRequest('/chat/completions', {
        method: 'POST',
        data: payload,
        timeout: 45000
      });

      const responseTime = Date.now() - startTime;

      if (!response.choices || response.choices.length === 0) {
        throw new Error('No response choices received from Together');
      }

      const responseText = response.choices[0].message.content;
      const usage = response.usage || {};

      // Log na BD via logger
      if (this.logger) {
        await this.logger.logProviderAction({
          provider: 'together',
          model: model,
          action: 'sendMessage',
          status: 'success',
          response_time_ms: responseTime,
          tokens_used: usage.total_tokens || 0,
          cost_estimate: this.estimateCost(usage),
          user_input: message.substring(0, 100),
          agent_response: responseText.substring(0, 100)
        });
      }

      return responseText;

    } catch (error) {
      // Log erro na BD
      if (this.logger) {
        await this.logger.logProviderAction({
          provider: 'together',
          model: model,
          action: 'sendMessage',
          status: 'error',
          error_message: error.message,
          user_input: message.substring(0, 100)
        });
      }

      // Tratamento específico de erros Together
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 429) {
          throw new Error(`Together rate limit exceeded: ${errorData.error || 'Too many requests'}`);
        }
        
        if (status === 401) {
          throw new Error('Invalid Together API key');
        }
        
        if (status === 400) {
          throw new Error(`Invalid request: ${errorData.error || 'Bad request'}`);
        }
      }

      throw new Error(`Together request failed: ${error.message}`);
    }
  }

  async listModels() {
    try {
      // Verificar cache
      if (this.availableModels && this.modelsLastFetch && 
          (Date.now() - this.modelsLastFetch < this.modelsCacheExpiry)) {
        return this.availableModels;
      }

      const response = await this.makeRequest('/models', {
        method: 'GET',
        timeout: 15000
      });

      if (response && Array.isArray(response)) {
        this.availableModels = response
          .filter(model => model.type === 'chat') // Apenas modelos de chat
          .map(model => ({
            id: model.id,
            name: model.display_name || model.id,
            description: model.description || '',
            context_length: model.context_length || 2048,
            capabilities: this.getModelCapabilities(model),
            pricing: model.pricing || {}
          }));
        
        this.modelsLastFetch = Date.now();
        return this.availableModels;
      }

      // Fallback para modelos conhecidos
      return this.knownModels;

    } catch (error) {
      console.warn(`Together: Could not fetch models - ${error.message}`);
      
      // Retornar modelos conhecidos
      return this.knownModels.map(model => ({
        id: model.id,
        name: model.name,
        description: model.description,
        context_length: model.maxTokens,
        capabilities: this.getModelCapabilities(model)
      }));
    }
  }

  getModelCapabilities(model) {
    const capabilities = ['chat']; // Base capability
    
    const modelId = model.id || model;
    
    if (modelId.includes('llama') || modelId.includes('Llama')) {
      capabilities.push('instruct', 'reasoning', 'open-source');
    }
    
    if (modelId.includes('mixtral') || modelId.includes('Mixtral')) {
      capabilities.push('mixture-of-experts', 'high-performance', 'long-context');
    }
    
    if (modelId.includes('nous') || modelId.includes('Nous')) {
      capabilities.push('fine-tuned', 'high-quality');
    }
    
    if (modelId.includes('redpajama') || modelId.includes('RedPajama')) {
      capabilities.push('efficient', 'small-model');
    }

    return capabilities;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const requestConfig = {
      url,
      method: options.method || 'GET',
      headers,
      timeout: options.timeout || 30000,
      ...options
    };

    const response = await axios(requestConfig);
    return response.data;
  }

  estimateCost(usage) {
    if (!usage) return 0;
    
    // Together tem preços muito competitivos
    const costPer1K = 0.0001; // Estimativa conservadora
    const totalTokens = usage.total_tokens || 0;
    
    return Math.round((totalTokens / 1000 * costPer1K) * 100000) / 100000; // 5 decimal places
  }

  async changeModel(newModel) {
    const models = await this.listModels();
    const modelExists = models.some(m => m.id === newModel);
    
    if (!modelExists) {
      throw new Error(`Model ${newModel} not available in Together`);
    }

    this.defaultModel = newModel;
    this.config.model = newModel;
    
    console.log(`Together model changed to: ${newModel}`);
    return true;
  }

  async getQuotaInfo() {
    try {
      // Together não tem endpoint específico de quota
      return {
        provider: 'together',
        quotaType: 'pay-per-use',
        remainingRequests: 'generous limits',
        resetTime: null,
        maxRequestsPerMinute: this.maxRequestsPerMinute,
        models: (await this.listModels()).length,
        note: 'Open-source models with competitive pricing'
      };
    } catch (error) {
      return {
        provider: 'together',
        error: error.message
      };
    }
  }

  async healthCheck() {
    try {
      const start = Date.now();
      await this.makeRequest('/models', { method: 'GET', timeout: 5000 });
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
      optional: ['model', 'temperature', 'maxTokens', 'topP', 'systemMessage'],
      description: 'Together AI - Open-source models with fast inference',
      website: 'https://together.ai',
      documentation: 'https://docs.together.ai'
    };
  }

  getCapabilities() {
    return [
      'open-source-models',
      'fast-inference',
      'competitive-pricing',
      'mixture-of-experts',
      'long-context',
      'fine-tuned-models'
    ];
  }

  validateConfig(config = this.config) {
    const result = super.validateConfig(config);
    
    // Validações específicas Together
    if (!config.apiKey && !process.env.TOGETHER_API_KEY) {
      result.errors.push('Together API key is required');
      result.valid = false;
    }

    if (config.maxTokens && config.maxTokens > 32768) {
      result.warnings.push('Some Together models may not support > 32k tokens');
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
    this.availableModels = null;
    this.modelsLastFetch = null;
    
    console.log('Together provider cleaned up');
  }
}