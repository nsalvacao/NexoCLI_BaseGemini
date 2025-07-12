/**
 * @license
 * Criado por Claude-Code, 2025
 * Testes unitários para OpenRouterProvider
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { OpenRouterProvider } from '../../src/providers/openrouter.js';

describe('OpenRouterProvider Tests', () => {
  let provider;

  beforeEach(() => {
    provider = new OpenRouterProvider({
      apiKey: 'sk-or-test-key',
      model: 'meta-llama/llama-3.1-8b-instruct:free'
    });
  });

  afterEach(async () => {
    if (provider) {
      await provider.cleanup();
    }
  });

  describe('Inicialização', () => {
    it('deve criar instância com configuração correta', () => {
      expect(provider).toBeInstanceOf(OpenRouterProvider);
      expect(provider.name).toBe('openrouter');
      expect(provider.apiKey).toBe('sk-or-test-key');
      expect(provider.defaultModel).toBe('meta-llama/llama-3.1-8b-instruct:free');
      expect(provider.baseUrl).toBe('https://openrouter.ai/api/v1');
    });

    it('deve usar configurações padrão quando não fornecidas', () => {
      const defaultProvider = new OpenRouterProvider();
      
      expect(defaultProvider.name).toBe('openrouter');
      expect(defaultProvider.baseUrl).toBe('https://openrouter.ai/api/v1');
      expect(defaultProvider.defaultModel).toBe('meta-llama/llama-3.1-8b-instruct:free');
      expect(defaultProvider.siteUrl).toBe('https://nexocli-basegemini.app');
      expect(defaultProvider.siteName).toBe('NexoCLI_BaseGemini');
    });

    it('deve permitir configuração customizada', () => {
      const customProvider = new OpenRouterProvider({
        apiKey: 'custom-key',
        baseUrl: 'https://custom.openrouter.ai/api/v1',
        model: 'gpt-4',
        siteUrl: 'https://custom-site.com',
        siteName: 'Custom App'
      });

      expect(customProvider.apiKey).toBe('custom-key');
      expect(customProvider.baseUrl).toBe('https://custom.openrouter.ai/api/v1');
      expect(customProvider.defaultModel).toBe('gpt-4');
      expect(customProvider.siteUrl).toBe('https://custom-site.com');
      expect(customProvider.siteName).toBe('Custom App');
    });
  });

  describe('Validação de Credenciais', () => {
    it('deve falhar sem API key', async () => {
      const noKeyProvider = new OpenRouterProvider();
      const result = await noKeyProvider.validateCredentials();
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('OpenRouter API key is required');
    });

    it('deve validar formato da API key', async () => {
      const invalidProvider = new OpenRouterProvider({
        apiKey: 'invalid-key-format'
      });
      
      const result = await invalidProvider.validateCredentials();
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('should start with "sk-or-"');
    });

    it('deve aceitar formato correto de API key', async () => {
      // Mock axios para simular resposta da API
      vi.doMock('axios', () => ({
        default: vi.fn().mockResolvedValue({
          data: { data: [{ id: 'test-model' }] }
        })
      }));

      const result = await provider.validateCredentials();
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Configuração e Validação', () => {
    it('deve validar configuração corretamente', () => {
      const validConfig = {
        apiKey: 'sk-or-valid-key',
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1000
      };

      const result = provider.validateConfig(validConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve detectar configuração inválida', () => {
      const invalidConfig = {
        temperature: 3, // Muito alto
        maxTokens: -100 // Negativo
      };

      const result = provider.validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('deve obter requisitos de configuração', () => {
      const requirements = provider.getConfigRequirements();
      
      expect(requirements.authTypes).toContain('api-key');
      expect(requirements.required).toContain('apiKey');
      expect(requirements.optional).toContain('model');
      expect(requirements.optional).toContain('temperature');
      expect(requirements.description).toContain('OpenRouter');
      expect(requirements.website).toBe('https://openrouter.ai');
    });

    it('deve sanitizar configuração sensível', () => {
      const config = provider.getSanitizedConfig();
      expect(config.apiKey).toBe('[REDACTED]');
      expect(config.model).toBeDefined();
    });
  });

  describe('Capacidades e Modelos', () => {
    it('deve obter capabilities do provider', () => {
      const capabilities = provider.getCapabilities();
      
      expect(capabilities).toContain('multi-model-gateway');
      expect(capabilities).toContain('pay-per-use');
      expect(capabilities).toContain('real-time-pricing');
      expect(capabilities).toContain('model-comparison');
    });

    it('deve parsing capabilities de modelos', () => {
      const gptModel = { id: 'gpt-3.5-turbo' };
      const claudeModel = { id: 'claude-3-sonnet' };
      const llamaModel = { id: 'meta-llama/llama-3.1-8b-instruct' };

      const gptCaps = provider.parseModelCapabilities(gptModel);
      expect(gptCaps).toContain('chat');
      expect(gptCaps).toContain('completion');

      const claudeCaps = provider.parseModelCapabilities(claudeModel);
      expect(claudeCaps).toContain('chat');
      expect(claudeCaps).toContain('long-context');

      const llamaCaps = provider.parseModelCapabilities(llamaModel);
      expect(llamaCaps).toContain('chat');
      expect(llamaCaps).toContain('instruct');
    });

    it('deve retornar modelos padrão em caso de erro', async () => {
      // Mock axios para simular erro de rede
      vi.doMock('axios', () => ({
        default: vi.fn().mockRejectedValue(new Error('Network error'))
      }));

      const models = await provider.listModels();
      
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
      
      // Deve ter pelo menos os modelos de fallback
      const freeModel = models.find(m => m.id.includes('free'));
      expect(freeModel).toBeDefined();
    });
  });

  describe('Gerenciamento de Modelos', () => {
    it('deve alterar modelo corretamente', async () => {
      // Mock listModels para simular modelos disponíveis
      provider.listModels = vi.fn().mockResolvedValue([
        { id: 'gpt-4', name: 'GPT-4' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
      ]);

      const result = await provider.changeModel('gpt-4');
      expect(result).toBe(true);
      expect(provider.defaultModel).toBe('gpt-4');
      expect(provider.config.model).toBe('gpt-4');
    });

    it('deve falhar ao alterar para modelo inexistente', async () => {
      provider.listModels = vi.fn().mockResolvedValue([
        { id: 'gpt-4', name: 'GPT-4' }
      ]);

      await expect(provider.changeModel('nonexistent-model'))
        .rejects.toThrow('not available in OpenRouter');
    });
  });

  describe('Estimativa de Custos', () => {
    it('deve estimar custos corretamente', () => {
      const usage = {
        prompt_tokens: 1000,
        completion_tokens: 500,
        total_tokens: 1500
      };

      const cost = provider.estimateCost(usage);
      
      expect(typeof cost).toBe('number');
      expect(cost).toBeGreaterThan(0);
      expect(cost).toBeLessThan(1); // Deve ser pequeno para teste
    });

    it('deve retornar zero para usage nulo', () => {
      const cost = provider.estimateCost(null);
      expect(cost).toBe(0);
    });

    it('deve retornar zero para usage vazio', () => {
      const cost = provider.estimateCost({});
      expect(cost).toBe(0);
    });
  });

  describe('Informações de Quota', () => {
    it('deve obter informações de quota', async () => {
      provider.listModels = vi.fn().mockResolvedValue([
        { id: 'model1' }, { id: 'model2' }
      ]);

      const quotaInfo = await provider.getQuotaInfo();
      
      expect(quotaInfo.provider).toBe('openrouter');
      expect(quotaInfo.quotaType).toBe('pay-per-use');
      expect(quotaInfo.remainingRequests).toBe('unlimited');
      expect(quotaInfo.models).toBe(2);
    });

    it('deve tratar erro ao obter quota', async () => {
      provider.listModels = vi.fn().mockRejectedValue(new Error('API Error'));

      const quotaInfo = await provider.getQuotaInfo();
      
      expect(quotaInfo.provider).toBe('openrouter');
      expect(quotaInfo.error).toBeDefined();
    });
  });

  describe('Health Check', () => {
    it('deve executar health check com sucesso', async () => {
      // Mock makeRequest para simular sucesso
      provider.makeRequest = vi.fn().mockResolvedValue({ data: [] });

      const health = await provider.healthCheck();
      
      expect(health.healthy).toBe(true);
      expect(health.responseTime).toBeGreaterThan(0);
      expect(health.timestamp).toBeDefined();
    });

    it('deve detectar problema no health check', async () => {
      // Mock makeRequest para simular erro
      provider.makeRequest = vi.fn().mockRejectedValue(new Error('Connection failed'));

      const health = await provider.healthCheck();
      
      expect(health.healthy).toBe(false);
      expect(health.error).toBe('Connection failed');
      expect(health.timestamp).toBeDefined();
    });
  });

  describe('Processamento de Opções', () => {
    it('deve processar opções corretamente', () => {
      const options = provider.processOptions({
        temperature: 0.8,
        maxTokens: 2000,
        newOption: 'test'
      });

      expect(options.temperature).toBe(0.8);
      expect(options.maxTokens).toBe(2000);
      expect(options.newOption).toBe('test');
      expect(options.topP).toBe(1); // Valor padrão preservado
    });

    it('deve usar valores padrão quando não fornecidos', () => {
      const options = provider.processOptions({});

      expect(options.temperature).toBe(0);
      expect(options.topP).toBe(1);
      expect(options.maxTokens).toBe(1000);
    });
  });

  describe('Cleanup', () => {
    it('deve fazer cleanup corretamente', async () => {
      provider.initialized = true;
      provider.authenticated = true;
      provider.availableModels = ['model1', 'model2'];

      await provider.cleanup();

      expect(provider.initialized).toBe(false);
      expect(provider.authenticated).toBe(false);
      expect(provider.availableModels).toBe(null);
    });
  });
});

console.log('✅ Testes OpenRouterProvider configurados');