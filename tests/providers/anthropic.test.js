/**
 * @license
 * Criado por Claude-Code, 2025
 * Testes unitários para AnthropicProvider
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AnthropicProvider } from '../../src/providers/anthropic.js';

describe('AnthropicProvider Tests', () => {
  let provider;

  beforeEach(() => {
    provider = new AnthropicProvider({
      apiKey: 'sk-ant-test-key',
      model: 'claude-3-haiku-20240307'
    });
  });

  afterEach(async () => {
    if (provider) {
      await provider.cleanup();
    }
  });

  describe('Inicialização', () => {
    it('deve criar instância com configuração correta', () => {
      expect(provider).toBeInstanceOf(AnthropicProvider);
      expect(provider.name).toBe('anthropic');
      expect(provider.apiKey).toBe('sk-ant-test-key');
      expect(provider.defaultModel).toBe('claude-3-haiku-20240307');
      expect(provider.baseUrl).toBe('https://api.anthropic.com/v1');
      expect(provider.anthropicVersion).toBe('2023-06-01');
    });

    it('deve usar configurações padrão', () => {
      const defaultProvider = new AnthropicProvider();
      
      expect(defaultProvider.name).toBe('anthropic');
      expect(defaultProvider.baseUrl).toBe('https://api.anthropic.com/v1');
      expect(defaultProvider.defaultModel).toBe('claude-3-haiku-20240307');
      expect(defaultProvider.maxTokens).toBe(1000);
    });

    it('deve ter modelos conhecidos configurados', () => {
      expect(provider.knownModels).toBeDefined();
      expect(Array.isArray(provider.knownModels)).toBe(true);
      expect(provider.knownModels.length).toBeGreaterThan(0);
      
      const haiku = provider.knownModels.find(m => m.id.includes('haiku'));
      expect(haiku).toBeDefined();
      expect(haiku.name).toContain('Haiku');
      expect(haiku.maxTokens).toBe(4096);
      
      const opus = provider.knownModels.find(m => m.id.includes('opus'));
      expect(opus).toBeDefined();
      expect(opus.costPer1K.output).toBeGreaterThan(haiku.costPer1K.output);
    });

    it('deve configurar rate limits por modelo', () => {
      expect(provider.rateLimits).toBeDefined();
      expect(provider.rateLimits['claude-3-haiku-20240307']).toBe(100);
      expect(provider.rateLimits['claude-3-sonnet-20240229']).toBe(50);
      expect(provider.rateLimits['claude-3-opus-20240229']).toBe(20);
    });
  });

  describe('Validação de Credenciais', () => {
    it('deve falhar sem API key', async () => {
      const noKeyProvider = new AnthropicProvider();
      const result = await noKeyProvider.validateCredentials();
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Anthropic API key is required');
    });

    it('deve validar formato da API key', async () => {
      const invalidProvider = new AnthropicProvider({
        apiKey: 'invalid-key-format'
      });
      
      const result = await invalidProvider.validateCredentials();
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('should start with "sk-ant-"');
    });

    it('deve detectar API key inválida via erro 401', async () => {
      // Mock sendMessage para simular erro de autenticação
      provider.sendMessage = vi.fn().mockRejectedValue({
        message: '401 authentication failed'
      });

      const result = await provider.validateCredentials();
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Invalid Anthropic API key');
    });

    it('deve detectar rate limiting como chave válida', async () => {
      // Mock sendMessage para simular rate limit
      provider.sendMessage = vi.fn().mockRejectedValue({
        message: 'rate_limit exceeded'
      });

      const result = await provider.validateCredentials();
      expect(result.valid).toBe(true);
      expect(result.warnings[0]).toContain('rate limited');
    });
  });

  describe('Configuração e Validação', () => {
    it('deve validar configuração corretamente', () => {
      const validConfig = {
        apiKey: 'sk-ant-valid-key',
        model: 'claude-3-haiku-20240307',
        maxTokens: 1000,
        temperature: 0
      };

      const result = provider.validateConfig(validConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve detectar configuração inválida', () => {
      const invalidConfig = {
        maxTokens: 5000, // Muito alto para Anthropic
        temperature: 3 // Muito alto
      };

      const result = provider.validateConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('deve avisar sobre formato de API key incorreto', () => {
      const configWithBadKey = {
        apiKey: 'wrong-format-key'
      };

      const result = provider.validateConfig(configWithBadKey);
      expect(result.warnings.some(w => w.includes('should start with "sk-ant-"'))).toBe(true);
    });

    it('deve avisar sobre modelo desconhecido', () => {
      const configWithUnknownModel = {
        model: 'unknown-claude-model'
      };

      const result = provider.validateConfig(configWithUnknownModel);
      expect(result.warnings.some(w => w.includes('Unknown Anthropic model'))).toBe(true);
    });

    it('deve obter requisitos de configuração', () => {
      const requirements = provider.getConfigRequirements();
      
      expect(requirements.authTypes).toContain('api-key');
      expect(requirements.required).toContain('apiKey');
      expect(requirements.optional).toContain('model');
      expect(requirements.optional).toContain('maxTokens');
      expect(requirements.optional).toContain('systemMessage');
      expect(requirements.description).toContain('Anthropic Claude');
      expect(requirements.website).toBe('https://anthropic.com');
    });
  });

  describe('Capacidades e Modelos', () => {
    it('deve obter capabilities do provider', () => {
      const capabilities = provider.getCapabilities();
      
      expect(capabilities).toContain('advanced-reasoning');
      expect(capabilities).toContain('long-context');
      expect(capabilities).toContain('code-generation');
      expect(capabilities).toContain('ethical-ai');
    });

    it('deve obter capabilities específicas por modelo', () => {
      const opusCaps = provider.getModelCapabilities('claude-3-opus-20240229');
      expect(opusCaps).toContain('chat');
      expect(opusCaps).toContain('complex-reasoning');
      expect(opusCaps).toContain('creative-writing');

      const haikuCaps = provider.getModelCapabilities('claude-3-haiku-20240307');
      expect(haikuCaps).toContain('chat');
      expect(haikuCaps).toContain('fast-response');
      expect(haikuCaps).toContain('efficient');

      const sonnetCaps = provider.getModelCapabilities('claude-3-sonnet-20240229');
      expect(sonnetCaps).toContain('chat');
      expect(sonnetCaps).toContain('balanced-performance');
    });

    it('deve listar modelos conhecidos', async () => {
      const models = await provider.listModels();
      
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBe(provider.knownModels.length);
      
      const haiku = models.find(m => m.id.includes('haiku'));
      expect(haiku).toBeDefined();
      expect(haiku.name).toContain('Haiku');
      expect(haiku.capabilities).toContain('fast-response');
    });
  });

  describe('Gerenciamento de Modelos', () => {
    it('deve alterar modelo para modelo disponível', async () => {
      const result = await provider.changeModel('claude-3-sonnet-20240229');
      
      expect(result).toBe(true);
      expect(provider.defaultModel).toBe('claude-3-sonnet-20240229');
      expect(provider.config.model).toBe('claude-3-sonnet-20240229');
    });

    it('deve falhar ao alterar para modelo indisponível', async () => {
      await expect(provider.changeModel('gpt-4'))
        .rejects.toThrow('not available');
    });
  });

  describe('Estimativa de Custos', () => {
    it('deve estimar custos por modelo corretamente', () => {
      const usage = {
        input_tokens: 1000,
        output_tokens: 500
      };

      const haikuCost = provider.estimateCost(usage, 'claude-3-haiku-20240307');
      const opusCost = provider.estimateCost(usage, 'claude-3-opus-20240229');
      
      expect(typeof haikuCost).toBe('number');
      expect(typeof opusCost).toBe('number');
      expect(opusCost).toBeGreaterThan(haikuCost); // Opus mais caro que Haiku
    });

    it('deve retornar zero para modelo desconhecido', () => {
      const usage = { input_tokens: 100, output_tokens: 50 };
      const cost = provider.estimateCost(usage, 'unknown-model');
      
      expect(cost).toBe(0);
    });

    it('deve retornar zero para usage nulo', () => {
      const cost = provider.estimateCost(null, 'claude-3-haiku-20240307');
      expect(cost).toBe(0);
    });
  });

  describe('Informações de Quota', () => {
    it('deve obter informações de quota', async () => {
      const quotaInfo = await provider.getQuotaInfo();
      
      expect(quotaInfo.provider).toBe('anthropic');
      expect(quotaInfo.quotaType).toBe('pay-per-use');
      expect(quotaInfo.rateLimits).toBeDefined();
      expect(quotaInfo.models).toBe(provider.knownModels.length);
      expect(quotaInfo.note).toContain('Rate limits vary');
    });
  });

  describe('Health Check', () => {
    it('deve executar health check com sucesso', async () => {
      // Mock sendMessage para simular sucesso
      provider.sendMessage = vi.fn().mockResolvedValue('pong');

      const health = await provider.healthCheck();
      
      expect(health.healthy).toBe(true);
      expect(health.responseTime).toBeGreaterThan(0);
      expect(health.timestamp).toBeDefined();
    });

    it('deve detectar problema no health check', async () => {
      // Mock sendMessage para simular erro
      provider.sendMessage = vi.fn().mockRejectedValue(new Error('API unavailable'));

      const health = await provider.healthCheck();
      
      expect(health.healthy).toBe(false);
      expect(health.error).toBe('API unavailable');
      expect(health.timestamp).toBeDefined();
    });
  });

  describe('Processamento de Headers', () => {
    it('deve configurar headers corretamente', async () => {
      const mockAxios = vi.fn().mockResolvedValue({
        data: { content: [{ text: 'response' }] }
      });
      
      // Mock axios
      provider.makeRequest = vi.fn().mockImplementation(async (endpoint, options) => {
        expect(options.headers['Content-Type']).toBe('application/json');
        expect(options.headers['x-api-key']).toBe('sk-ant-test-key');
        expect(options.headers['anthropic-version']).toBe('2023-06-01');
        
        return { content: [{ text: 'test response' }] };
      });

      // Simular uma request
      await provider.makeRequest('/messages', {
        method: 'POST',
        data: { model: 'claude-3-haiku-20240307', messages: [] }
      });

      expect(provider.makeRequest).toHaveBeenCalled();
    });
  });

  describe('Tratamento de System Messages', () => {
    it('deve processar system message corretamente', () => {
      const providerWithSystem = new AnthropicProvider({
        apiKey: 'sk-ant-test',
        systemMessage: 'You are a helpful assistant'
      });

      expect(providerWithSystem.config.systemMessage).toBe('You are a helpful assistant');
    });
  });

  describe('Cleanup', () => {
    it('deve fazer cleanup corretamente', async () => {
      provider.initialized = true;
      provider.authenticated = true;

      await provider.cleanup();

      expect(provider.initialized).toBe(false);
      expect(provider.authenticated).toBe(false);
    });
  });
});

console.log('✅ Testes AnthropicProvider configurados');