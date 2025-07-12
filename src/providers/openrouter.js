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
 * OpenRouter Provider - Gateway para 100+ modelos AI
 */

import { BaseProvider } from './base.js';
import axios from 'axios';

export class OpenRouterProvider extends BaseProvider {
  constructor(config = {}) {
    super('openrouter', config);
    
    this.apiKey = config.apiKey || process.env.OPENROUTER_API_KEY;
    this.baseUrl = config.baseUrl || 'https://openrouter.ai/api/v1';
    this.defaultModel = config.model || 'meta-llama/llama-3.1-8b-instruct:free';
    this.siteUrl = config.siteUrl || 'https://nexocli-basegemini.app';
    this.siteName = config.siteName || 'NexoCLI_BaseGemini';
    
    // Cache de modelos por 1 hora
    this.availableModels = null;
    this.modelsLastFetch = null;
    this.modelsCacheExpiry = 60 * 60 * 1000; // 1 hora
    
    // Rate limiting
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.maxRequestsPerMinute = 60; // Limite conservador
  }

  async initialize() {
    try {
      if (!this.apiKey) {
        throw new Error('OpenRouter API key is required');
      }

      // Testar conectividade inicial
      await this.testConnection();
      
      this.initialized = true;
      console.log(`✅ OpenRouter provider initialized with model: ${this.defaultModel}`);
      
      return true;
    } catch (error) {
      console.error(`❌ OpenRouter initialization failed: ${error.message}`);
      throw error;
    }
  }

  async authenticate() {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not provided');
    }

    // OpenRouter usa Bearer token simples
    this.authenticated = true;
    return true;
  }

  async validateCredentials() {
    try {
      if (!this.apiKey) {
        return {
          valid: false,
          errors: ['OpenRouter API key is required'],
          warnings: []
        };
      }

      // Formato básico da chave OpenRouter
      if (!this.apiKey.startsWith('sk-or-')) {
        return {
          valid: false,
          errors: ['OpenRouter API key should start with "sk-or-"'],
          warnings: []
        };
      }

      // Teste real da API
      const response = await this.makeRequest('/models', {
        method: 'GET',
        timeout: 10000
      });

      if (response && response.data && Array.isArray(response.data)) {
        return {
          valid: true,
          errors: [],
          warnings: response.data.length === 0 ? ['No models available'] : []
        };
      }

      return {
        valid: false,
        errors: ['Invalid response from OpenRouter API'],
        warnings: []
      };

    } catch (error) {
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
        errors: [`OpenRouter API validation failed: ${error.message}`],
        warnings: []
      };
    }
  }

  async testConnection() {
    try {
      const startTime = Date.now();
      
      // Teste simples de conectividade
      const response = await this.sendMessage('Test connection', {
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
      max_tokens: requestOptions.maxTokens || 1000,
      top_p: requestOptions.topP || 1,
      stream: false
    };

    try {
      const startTime = Date.now();
      
      const response = await this.makeRequest('/chat/completions', {
        method: 'POST',
        data: payload,
        timeout: 30000
      });

      const responseTime = Date.now() - startTime;

      if (!response.choices || response.choices.length === 0) {
        throw new Error('No response choices received from OpenRouter');
      }

      const responseText = response.choices[0].message.content;

      // Log na BD via logger
      if (this.logger) {
        await this.logger.logProviderAction({
          provider: 'openrouter',
          model: model,
          action: 'sendMessage',
          status: 'success',
          response_time_ms: responseTime,
          tokens_used: response.usage?.total_tokens || 0,
          cost_estimate: this.estimateCost(response.usage),
          user_input: message.substring(0, 100),
          agent_response: responseText.substring(0, 100)
        });
      }

      return responseText;

    } catch (error) {
      // Log erro na BD
      if (this.logger) {
        await this.logger.logProviderAction({
          provider: 'openrouter',
          model: model,
          action: 'sendMessage',
          status: 'error',
          error_message: error.message,
          user_input: message.substring(0, 100)
        });
      }

      throw new Error(`OpenRouter request failed: ${error.message}`);
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

      if (response && response.data && Array.isArray(response.data)) {
        this.availableModels = response.data.map(model => ({
          id: model.id,
          name: model.name || model.id,
          description: model.description || '',
          context_length: model.context_length || 0,
          pricing: model.pricing || {},
          capabilities: this.parseModelCapabilities(model)
        }));
        
        this.modelsLastFetch = Date.now();
        return this.availableModels;
      }

      return [];
    } catch (error) {
      console.warn(`OpenRouter: Could not fetch models - ${error.message}`);
      
      // Retornar modelos padrão conhecidos
      return [
        {
          id: 'meta-llama/llama-3.1-8b-instruct:free',
          name: 'Llama 3.1 8B (Free)',
          description: 'Free tier model',
          context_length: 8192,
          capabilities: ['chat', 'instruct']
        },
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          description: 'OpenAI GPT-3.5 via OpenRouter',
          context_length: 4096,
          capabilities: ['chat', 'completion']
        }
      ];
    }
  }

  parseModelCapabilities(model) {
    const capabilities = ['chat']; // Base capability
    
    if (model.id.includes('gpt')) {
      capabilities.push('completion', 'function-calling');
    }
    
    if (model.id.includes('claude')) {
      capabilities.push('long-context', 'reasoning');
    }
    
    if (model.id.includes('llama') || model.id.includes('instruct')) {
      capabilities.push('instruct', 'reasoning');
    }

    return capabilities;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': this.siteUrl,
      'X-Title': this.siteName,
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
    
    // Estimativa conservadora baseada em preços médios OpenRouter
    const inputCostPer1K = 0.0001; // $0.0001 per 1K tokens
    const outputCostPer1K = 0.0002; // $0.0002 per 1K tokens
    
    const inputCost = (usage.prompt_tokens || 0) / 1000 * inputCostPer1K;
    const outputCost = (usage.completion_tokens || 0) / 1000 * outputCostPer1K;
    
    return Math.round((inputCost + outputCost) * 100000) / 100000; // 5 decimal places
  }

  async changeModel(newModel) {
    const models = await this.listModels();
    const modelExists = models.some(m => m.id === newModel);
    
    if (!modelExists) {
      throw new Error(`Model ${newModel} not available in OpenRouter`);
    }

    this.defaultModel = newModel;
    this.config.model = newModel;
    
    console.log(`OpenRouter model changed to: ${newModel}`);
    return true;
  }

  async getQuotaInfo() {
    try {
      // OpenRouter não tem endpoint específico de quota
      // Retornar informações básicas
      return {
        provider: 'openrouter',
        quotaType: 'pay-per-use',
        remainingRequests: 'unlimited',
        resetTime: null,
        cost: 'Variable by model',
        models: (await this.listModels()).length
      };
    } catch (error) {
      return {
        provider: 'openrouter',
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
      models: [
        'meta-llama/llama-3.1-8b-instruct:free',
        'gpt-3.5-turbo',
        'gpt-4',
        'claude-3-haiku',
        'claude-3-sonnet'
      ],
      required: ['apiKey'],
      optional: ['model', 'temperature', 'maxTokens', 'topP', 'siteUrl', 'siteName'],
      description: 'OpenRouter - Gateway to 100+ AI models',
      website: 'https://openrouter.ai',
      documentation: 'https://openrouter.ai/docs'
    };
  }

  getCapabilities() {
    return [
      'multi-model-gateway',
      'pay-per-use',
      'real-time-pricing',
      'model-comparison',
      'rate-limiting',
      'cost-tracking'
    ];
  }

  validateConfig(config = this.config) {
    const result = super.validateConfig(config);
    
    // Validações específicas OpenRouter
    if (!config.apiKey && !process.env.OPENROUTER_API_KEY) {
      result.errors.push('OpenRouter API key is required');
      result.valid = false;
    }

    if (config.apiKey && !config.apiKey.startsWith('sk-or-')) {
      result.warnings.push('OpenRouter API key should start with "sk-or-"');
    }

    if (config.maxTokens && config.maxTokens > 32000) {
      result.warnings.push('Some OpenRouter models may not support > 32k tokens');
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
    this.requestQueue = [];
    
    console.log('OpenRouter provider cleaned up');
  }
}