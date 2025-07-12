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
 * Rate Limiter - Sistema de controle de rate limiting por provider
 */

export class RateLimiter {
  constructor() {
    // Map de limites por provider/model
    this.limits = new Map();
    
    // Map de requests por provider/model com timestamps
    this.requests = new Map();
    
    // Map de costs por provider
    this.costs = new Map();
    
    // Configurações padrão por provider
    this.setupDefaultLimits();
  }

  /**
   * Configura limites padrão conhecidos
   */
  setupDefaultLimits() {
    // Gemini - Limites conhecidos
    this.setLimit('gemini', 'oauth-personal', 60, 1000); // 60/min, 1000/day
    this.setLimit('gemini', 'api-key', 300, 50000); // 300/min, 50k/day
    
    // OpenRouter - Limites generosos
    this.setLimit('openrouter', 'default', 120, 10000); // 120/min, 10k/day
    
    // Anthropic - Conservador
    this.setLimit('anthropic', 'claude-3-haiku-20240307', 100, 1000);
    this.setLimit('anthropic', 'claude-3-sonnet-20240229', 50, 500);
    this.setLimit('anthropic', 'claude-3-opus-20240229', 20, 200);
    
    // Together - Generoso
    this.setLimit('together', 'default', 120, 5000);
    
    console.log('Rate limiter initialized with default limits');
  }

  /**
   * Define limite para provider/model específico
   * @param {string} provider - Nome do provider
   * @param {string} model - Modelo ou 'default'
   * @param {number} requestsPerMinute - Limite por minuto
   * @param {number} requestsPerDay - Limite por dia (opcional)
   */
  setLimit(provider, model, requestsPerMinute, requestsPerDay = null) {
    const key = `${provider}:${model}`;
    
    this.limits.set(key, {
      provider,
      model,
      requestsPerMinute,
      requestsPerDay,
      window: 60000, // 1 minuto em ms
      dayWindow: 24 * 60 * 60 * 1000 // 1 dia em ms
    });
    
    // Inicializar array de requests
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
  }

  /**
   * Verifica se request pode ser feita (rate limiting)
   * @param {string} provider - Nome do provider
   * @param {string} model - Modelo sendo usado
   * @returns {Promise<boolean>} True se pode fazer request
   */
  async checkLimit(provider, model = 'default') {
    const key = `${provider}:${model}`;
    const fallbackKey = `${provider}:default`;
    
    // Buscar limite (específico ou padrão)
    let limit = this.limits.get(key) || this.limits.get(fallbackKey);
    
    if (!limit) {
      // Sem limite definido - permitir
      return true;
    }

    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Limpar requests antigas (> 1 minuto)
    const oneMinuteAgo = now - limit.window;
    const recentRequests = requests.filter(timestamp => timestamp > oneMinuteAgo);
    
    // Verificar limite por minuto
    if (recentRequests.length >= limit.requestsPerMinute) {
      const oldestRequest = Math.min(...recentRequests);
      const waitTime = oldestRequest + limit.window - now;
      
      console.warn(`⏱️ Rate limit reached for ${provider}:${model}. Waiting ${waitTime}ms`);
      
      // Log rate limiting
      if (this.logger) {
        await this.logger.logProviderAction({
          provider: provider,
          model: model,
          action: 'rate_limit_wait',
          status: 'warning',
          metadata: JSON.stringify({
            wait_time_ms: waitTime,
            requests_in_window: recentRequests.length,
            limit_per_minute: limit.requestsPerMinute
          })
        });
      }
      
      // Esperar até poder fazer nova request
      await this.sleep(waitTime);
    }

    // Verificar limite diário se configurado
    if (limit.requestsPerDay) {
      const oneDayAgo = now - limit.dayWindow;
      const dailyRequests = requests.filter(timestamp => timestamp > oneDayAgo);
      
      if (dailyRequests.length >= limit.requestsPerDay) {
        const oldestDailyRequest = Math.min(...dailyRequests);
        const waitTime = oldestDailyRequest + limit.dayWindow - now;
        
        console.warn(`⏱️ Daily rate limit reached for ${provider}:${model}. Wait until tomorrow`);
        
        // Para limite diário, não esperamos - apenas negamos
        throw new Error(`Daily rate limit exceeded for ${provider}:${model}. Try again tomorrow.`);
      }
    }

    // Registrar nova request
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    
    return true;
  }

  /**
   * Registra custo de uma request
   * @param {string} provider - Provider
   * @param {string} model - Modelo
   * @param {number} cost - Custo estimado
   * @param {number} tokens - Tokens usados
   */
  recordCost(provider, model, cost = 0, tokens = 0) {
    const key = `${provider}:${model}`;
    
    if (!this.costs.has(key)) {
      this.costs.set(key, {
        totalCost: 0,
        totalTokens: 0,
        requestCount: 0,
        lastUpdate: Date.now()
      });
    }
    
    const costInfo = this.costs.get(key);
    costInfo.totalCost += cost;
    costInfo.totalTokens += tokens;
    costInfo.requestCount += 1;
    costInfo.lastUpdate = Date.now();
    
    this.costs.set(key, costInfo);
  }

  /**
   * Obtém estatísticas de uso por provider
   * @param {string} provider - Provider (opcional)
   * @returns {Object} Estatísticas
   */
  getUsageStats(provider = null) {
    const stats = {
      timestamp: new Date().toISOString(),
      providers: {}
    };

    for (const [key, requests] of this.requests.entries()) {
      const [providerName, model] = key.split(':');
      
      if (provider && providerName !== provider) {
        continue;
      }

      if (!stats.providers[providerName]) {
        stats.providers[providerName] = {
          models: {},
          totalRequests: 0,
          totalCost: 0,
          totalTokens: 0
        };
      }

      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      const oneDayAgo = now - 24 * 60 * 60 * 1000;
      
      const recentRequests = requests.filter(t => t > oneMinuteAgo);
      const dailyRequests = requests.filter(t => t > oneDayAgo);
      
      const costInfo = this.costs.get(key) || { 
        totalCost: 0, 
        totalTokens: 0, 
        requestCount: 0 
      };

      stats.providers[providerName].models[model] = {
        requestsLastMinute: recentRequests.length,
        requestsLast24h: dailyRequests.length,
        totalRequests: costInfo.requestCount,
        totalCost: costInfo.totalCost,
        totalTokens: costInfo.totalTokens,
        limit: this.limits.get(key)
      };

      stats.providers[providerName].totalRequests += costInfo.requestCount;
      stats.providers[providerName].totalCost += costInfo.totalCost;
      stats.providers[providerName].totalTokens += costInfo.totalTokens;
    }

    return stats;
  }

  /**
   * Obtém limites ativos
   * @returns {Object} Todos os limites configurados
   */
  getActiveLimits() {
    const limits = {};
    
    for (const [key, limit] of this.limits.entries()) {
      const [provider, model] = key.split(':');
      
      if (!limits[provider]) {
        limits[provider] = {};
      }
      
      limits[provider][model] = {
        requestsPerMinute: limit.requestsPerMinute,
        requestsPerDay: limit.requestsPerDay,
        window: limit.window,
        dayWindow: limit.dayWindow
      };
    }
    
    return limits;
  }

  /**
   * Verifica se provider está próximo do limite
   * @param {string} provider - Provider
   * @param {string} model - Modelo
   * @param {number} threshold - Percentual de threshold (0.8 = 80%)
   * @returns {boolean} True se próximo do limite
   */
  isNearLimit(provider, model = 'default', threshold = 0.8) {
    const key = `${provider}:${model}`;
    const fallbackKey = `${provider}:default`;
    
    const limit = this.limits.get(key) || this.limits.get(fallbackKey);
    if (!limit) return false;

    const requests = this.requests.get(key) || [];
    const now = Date.now();
    const oneMinuteAgo = now - limit.window;
    const recentRequests = requests.filter(t => t > oneMinuteAgo);
    
    const usagePercentage = recentRequests.length / limit.requestsPerMinute;
    
    return usagePercentage >= threshold;
  }

  /**
   * Limpa estatísticas antigas (cleanup)
   * @param {number} maxAge - Idade máxima em ms (padrão: 7 dias)
   */
  cleanup(maxAge = 7 * 24 * 60 * 60 * 1000) {
    const cutoff = Date.now() - maxAge;
    let cleaned = 0;

    for (const [key, requests] of this.requests.entries()) {
      const filtered = requests.filter(timestamp => timestamp > cutoff);
      
      if (filtered.length !== requests.length) {
        this.requests.set(key, filtered);
        cleaned += requests.length - filtered.length;
      }
    }

    if (cleaned > 0) {
      console.log(`Rate limiter cleaned up ${cleaned} old requests`);
    }
  }

  /**
   * Sleep utility
   * @param {number} ms - Milissegundos para esperar
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Define logger para logging
   * @param {Object} logger - Logger instance
   */
  setLogger(logger) {
    this.logger = logger;
  }

  /**
   * Reseta limits para um provider (útil para testes)
   * @param {string} provider - Provider
   */
  resetProvider(provider) {
    const keysToReset = Array.from(this.requests.keys())
      .filter(key => key.startsWith(`${provider}:`));
    
    keysToReset.forEach(key => {
      this.requests.set(key, []);
    });
    
    console.log(`Rate limiter reset for provider: ${provider}`);
  }
}

// Instância singleton
export const rateLimiter = new RateLimiter();