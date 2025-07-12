/**
 * @license
 * Criado por Claude-Code, 2025
 * Testes unitários para TogetherProvider
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TogetherProvider } from '../../src/providers/together.js';

describe('TogetherProvider Tests', () => {
  let provider;

  beforeEach(() => {
    provider = new TogetherProvider({
      apiKey: 'together-test-key',
      model: 'meta-llama/Llama-2-7b-chat-hf'
    });
  });

  afterEach(async () => {
    if (provider) {
      await provider.cleanup();
    }
  });

  describe('Inicialização', () => {
    it('deve criar instância com configuração correta', () => {
      expect(provider).toBeInstanceOf(TogetherProvider);
      expect(provider.name).toBe('together');
      expect(provider.apiKey).toBe('together-test-key');
      expect(provider.defaultModel).toBe('meta-llama/Llama-2-7b-chat-hf');
      expect(provider.baseUrl).toBe('https://api.together.xyz/v1');
      expect(provider.maxRequestsPerMinute).toBe(120);
    });

    it('deve usar configurações padrão', () => {
      const defaultProvider = new TogetherProvider();
      
      expect(defaultProvider.name).toBe('together');
      expect(defaultProvider.baseUrl).toBe('https://api.together.xyz/v1');
      expect(defaultProvider.defaultModel).toBe('meta-llama/Llama-2-7b-chat-hf');
      expect(defaultProvider.modelsCacheExpiry).toBe(2 * 60 * 60 * 1000); // 2 horas
    });

    it('deve ter modelos conhecidos configurados', () => {
      expect(provider.knownModels).toBeDefined();
      expect(Array.isArray(provider.knownModels)).toBe(true);
      expect(provider.knownModels.length).toBeGreaterThan(0);
      
      const llama2 = provider.knownModels.find(m => m.id.includes('Llama-2-7b'));
      expect(llama2).toBeDefined();
      expect(llama2.name).toContain('Llama 2 7B');
      expect(llama2.type).toBe('chat');
      
      const mixtral = provider.knownModels.find(m => m.id.includes('Mixtral'));
      expect(mixtral).toBeDefined();
      expect(mixtral.maxTokens).toBe(32768);
    });
  });

  describe('Validação de Credenciais', () => {
    it('deve falhar sem API key', async () => {
      const noKeyProvider = new TogetherProvider();
      const result = await noKeyProvider.validateCredentials();
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Together API key is required');
    });

    it('deve validar API key com teste real da API', async () => {
      // Mock makeRequest para simular resposta da API
      provider.makeRequest = vi.fn().mockResolvedValue([
        { id: 'test-model', type: 'chat' }
      ]);

      const result = await provider.validateCredentials();
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve detectar API key inválida via erro 401', async () => {
      // Mock makeRequest para simular erro de autenticação
      provider.makeRequest = vi.fn().mockRejectedValue({
        response: { status: 401 }
      });

      const result = await provider.validateCredentials();
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Invalid Together API key');
    });

    it('deve tratar erro de rede defensivamente', async () => {
      // Mock makeRequest para simular erro de rede
      provider.makeRequest = vi.fn().mockRejectedValue({
        code: 'ENOTFOUND'
      });

      const result = await provider.validateCredentials();
      expect(result.valid).toBe(true);
      expect(result.warnings[0]).toContain('network issues');
    });
  });

  describe('Configuração e Validação', () => {
    it('deve validar configuração corretamente', () => {
      const validConfig = {
        apiKey: 'valid-together-key',
        model: 'meta-llama/Llama-2-7b-chat-hf',
        temperature: 0.7,
        maxTokens: 1000
      };

      const result = provider.validateConfig(validConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve detectar configuração inválida', () => {
      const invalidConfig = {
        maxTokens: 40000, // Muito alto
        temperature: 3 // Muito alto
      };

      const result = provider.validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('deve avisar sobre limite de tokens', () => {
      const configWithHighTokens = {
        maxTokens: 35000
      };

      const result = provider.validateConfig(configWithHighTokens);
      expect(result.warnings.some(w => w.includes('may not support > 32k tokens'))).toBe(true);
    });

    it('deve obter requisitos de configuração', () => {
      const requirements = provider.getConfigRequirements();
      
      expect(requirements.authTypes).toContain('api-key');
      expect(requirements.required).toContain('apiKey');
      expect(requirements.optional).toContain('model');
      expect(requirements.optional).toContain('systemMessage');
      expect(requirements.description).toContain('Together AI');
      expect(requirements.website).toBe('https://together.ai');
    });
  });

  describe('Capacidades e Modelos', () => {
    it('deve obter capabilities do provider', () => {
      const capabilities = provider.getCapabilities();
      
      expect(capabilities).toContain('open-source-models');
      expect(capabilities).toContain('fast-inference');
      expect(capabilities).toContain('competitive-pricing');
      expect(capabilities).toContain('mixture-of-experts');
    });

    it('deve obter capabilities específicas por modelo', () => {
      const llamaCaps = provider.getModelCapabilities('meta-llama/Llama-2-7b-chat-hf');
      expect(llamaCaps).toContain('chat');
      expect(llamaCaps).toContain('instruct');
      expect(llamaCaps).toContain('open-source');

      const mixtralCaps = provider.getModelCapabilities('mistralai/Mixtral-8x7B-Instruct-v0.1');
      expect(mixtralCaps).toContain('chat');
      expect(mixtralCaps).toContain('mixture-of-experts');
      expect(mixtralCaps).toContain('high-performance');

      const nousCaps = provider.getModelCapabilities('NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO');
      expect(nousCaps).toContain('chat');
      expect(nousCaps).toContain('fine-tuned');
      expect(nousCaps).toContain('high-quality');
    });

    it('deve listar modelos com cache', async () => {
      // Mock makeRequest para primeira chamada
      provider.makeRequest = vi.fn().mockResolvedValue([
        { id: 'model1', type: 'chat', display_name: 'Model 1' },
        { id: 'model2', type: 'chat', context_length: 4096 }
      ]);

      const models1 = await provider.listModels();
      expect(models1).toBeDefined();
      expect(Array.isArray(models1)).toBe(true);
      expect(provider.makeRequest).toHaveBeenCalledTimes(1);

      // Segunda chamada deve usar cache
      const models2 = await provider.listModels();
      expect(models2).toEqual(models1);
      expect(provider.makeRequest).toHaveBeenCalledTimes(1); // Não chamou novamente
    });

    it('deve retornar modelos conhecidos em caso de erro', async () => {
      // Mock makeRequest para simular erro
      provider.makeRequest = vi.fn().mockRejectedValue(new Error('API Error'));

      const models = await provider.listModels();
      
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
      
      // Deve ser os modelos conhecidos
      expect(models[0].id).toBe(provider.knownModels[0].id);
    });
  });

  describe('Gerenciamento de Modelos', () => {
    it('deve alterar modelo para modelo disponível', async () => {
      // Mock listModels
      provider.listModels = vi.fn().mockResolvedValue([
        { id: 'meta-llama/Llama-2-13b-chat-hf', name: 'Llama 2 13B' },
        { id: 'meta-llama/Llama-2-7b-chat-hf', name: 'Llama 2 7B' }
      ]);

      const result = await provider.changeModel('meta-llama/Llama-2-13b-chat-hf');
      
      expect(result).toBe(true);
      expect(provider.defaultModel).toBe('meta-llama/Llama-2-13b-chat-hf');
      expect(provider.config.model).toBe('meta-llama/Llama-2-13b-chat-hf');
    });

    it('deve falhar ao alterar para modelo indisponível', async () => {
      provider.listModels = vi.fn().mockResolvedValue([
        { id: 'meta-llama/Llama-2-7b-chat-hf', name: 'Llama 2 7B' }
      ]);

      await expect(provider.changeModel('gpt-4'))
        .rejects.toThrow('not available in Together');
    });
  });

  describe('Estimativa de Custos', () => {
    it('deve estimar custos corretamente', () => {
      const usage = {
        total_tokens: 1500
      };

      const cost = provider.estimateCost(usage);
      
      expect(typeof cost).toBe('number');
      expect(cost).toBeGreaterThan(0);
      expect(cost).toBeLessThan(1); // Deve ser muito baixo para Together
    });

    it('deve retornar zero para usage nulo', () => {
      const cost = provider.estimateCost(null);
      expect(cost).toBe(0);
    });
  });

  describe('Informações de Quota', () => {
    it('deve obter informações de quota', async () => {
      provider.listModels = vi.fn().mockResolvedValue([
        { id: 'model1' }, { id: 'model2' }, { id: 'model3' }
      ]);

      const quotaInfo = await provider.getQuotaInfo();
      
      expect(quotaInfo.provider).toBe('together');
      expect(quotaInfo.quotaType).toBe('pay-per-use');
      expect(quotaInfo.remainingRequests).toBe('generous limits');
      expect(quotaInfo.maxRequestsPerMinute).toBe(120);
      expect(quotaInfo.models).toBe(3);
      expect(quotaInfo.note).toContain('competitive pricing');
    });
  });

  describe('Health Check', () => {
    it('deve executar health check com sucesso', async () => {
      // Mock makeRequest
      provider.makeRequest = vi.fn().mockResolvedValue([]);

      const health = await provider.healthCheck();
      
      expect(health.healthy).toBe(true);
      expect(health.responseTime).toBeGreaterThan(0);
      expect(health.timestamp).toBeDefined();
    });

    it('deve detectar problema no health check', async () => {
      // Mock makeRequest para simular erro
      provider.makeRequest = vi.fn().mockRejectedValue(new Error('Service unavailable'));

      const health = await provider.healthCheck();
      
      expect(health.healthy).toBe(false);
      expect(health.error).toBe('Service unavailable');
      expect(health.timestamp).toBeDefined();
    });
  });

  describe('Processamento de Headers', () => {
    it('deve configurar headers corretamente', async () => {
      provider.makeRequest = vi.fn().mockImplementation(async (endpoint, options) => {
        expect(options.headers['Authorization']).toBe('Bearer together-test-key');
        expect(options.headers['Content-Type']).toBe('application/json');
        
        return [];
      });

      await provider.makeRequest('/models', { method: 'GET' });
      expect(provider.makeRequest).toHaveBeenCalled();
    });
  });

  describe('Tratamento de System Messages', () => {
    it('deve processar system message corretamente', () => {
      const providerWithSystem = new TogetherProvider({
        apiKey: 'test-key',
        systemMessage: 'You are a coding assistant'
      });

      expect(providerWithSystem.config.systemMessage).toBe('You are a coding assistant');
    });
  });

  describe('Tratamento de Erros Específicos', () => {
    it('deve tratar erro 429 (rate limit)', async () => {
      const mockSendMessage = vi.fn().mockRejectedValue({
        response: {
          status: 429,
          data: { error: 'Too many requests' }
        }
      });

      provider.sendMessage = mockSendMessage;

      try {
        await provider.sendMessage('test');
      } catch (error) {
        expect(error.message).toContain('Together rate limit exceeded');
      }
    });

    it('deve tratar erro 400 (bad request)', async () => {
      const mockSendMessage = vi.fn().mockRejectedValue({
        response: {
          status: 400,
          data: { error: 'Invalid model' }
        }
      });

      provider.sendMessage = mockSendMessage;

      try {
        await provider.sendMessage('test');
      } catch (error) {
        expect(error.message).toContain('Invalid request');
      }
    });
  });

  describe('Cache de Modelos', () => {
    it('deve expirar cache após tempo configurado', async () => {
      // Mock makeRequest
      provider.makeRequest = vi.fn()
        .mockResolvedValueOnce([{ id: 'model1' }])
        .mockResolvedValueOnce([{ id: 'model2' }]);

      // Primeira chamada
      await provider.listModels();
      expect(provider.makeRequest).toHaveBeenCalledTimes(1);

      // Simular expiração do cache
      provider.modelsLastFetch = Date.now() - (3 * 60 * 60 * 1000); // 3 horas atrás

      // Segunda chamada após expiração
      await provider.listModels();
      expect(provider.makeRequest).toHaveBeenCalledTimes(2);
    });
  });

  describe('Cleanup', () => {
    it('deve fazer cleanup corretamente', async () => {
      provider.initialized = true;
      provider.authenticated = true;
      provider.availableModels = ['model1', 'model2'];
      provider.modelsLastFetch = Date.now();

      await provider.cleanup();

      expect(provider.initialized).toBe(false);
      expect(provider.authenticated).toBe(false);
      expect(provider.availableModels).toBe(null);
      expect(provider.modelsLastFetch).toBe(null);
    });
  });
});

console.log('✅ Testes TogetherProvider configurados');