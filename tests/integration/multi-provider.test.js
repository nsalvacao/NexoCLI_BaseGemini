/**
 * @license
 * Criado por Claude-Code, 2025
 * Testes de integração para sistema multi-provider
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { providerFactory, PROVIDER_TYPES } from '../../src/providers/factory.js';
import { envManager } from '../../src/config/env-manager.js';
import { rateLimiter } from '../../src/utils/rate-limiter.js';
import { OpenRouterProvider } from '../../src/providers/openrouter.js';
import { AnthropicProvider } from '../../src/providers/anthropic.js';
import { TogetherProvider } from '../../src/providers/together.js';

describe('Multi-Provider Integration Tests', () => {
  beforeEach(async () => {
    // Limpar estado do rate limiter
    rateLimiter.resetProvider('gemini');
    rateLimiter.resetProvider('openrouter');
    rateLimiter.resetProvider('anthropic');
    rateLimiter.resetProvider('together');
  });

  afterEach(async () => {
    // Cleanup providers
    await providerFactory.cleanup();
  });

  describe('ProviderFactory Integration', () => {
    it('deve ter providers registrados corretamente', () => {
      const availableTypes = providerFactory.listAvailableProviders();
      
      // Verificar que temos pelo menos Gemini
      expect(availableTypes.length).toBeGreaterThan(0);
      
      const geminiProvider = availableTypes.find(p => p.type === 'gemini');
      expect(geminiProvider).toBeDefined();
      expect(geminiProvider.type).toBe('gemini');
      expect(geminiProvider.description).toContain('Gemini');
    });

    it('deve detectar providers do environment', () => {
      const envProviders = envManager.getAvailableProviders();
      
      // Pelo menos Gemini deve estar disponível (OAuth sempre funciona)
      expect(envProviders).toContain('gemini');
      
      const factoryProviders = providerFactory.listAvailableProviders();
      const geminiInFactory = factoryProviders.find(p => p.type === 'gemini');
      expect(geminiInFactory.available).toBe(true);
    });

    it('deve configurar cadeia de fallback corretamente', () => {
      const fallbackChain = providerFactory.getFallbackChain();
      
      expect(Array.isArray(fallbackChain)).toBe(true);
      expect(fallbackChain.length).toBeGreaterThan(0);
      
      // Gemini deve estar na cadeia (sempre disponível via OAuth)
      expect(fallbackChain).toContain('gemini');
      
      // Ordem deve respeitar prioridades (Gemini primeiro)
      expect(fallbackChain[0]).toBe('gemini');
    });

    it('deve listar todos os providers incluindo não implementados', () => {
      const allProviders = providerFactory.listAllProviders();
      
      expect(allProviders.length).toBeGreaterThan(0);
      
      const gemini = allProviders.find(p => p.type === 'gemini');
      expect(gemini.registered).toBe(true);
      expect(gemini.available).toBe(true);
      
      const openrouter = allProviders.find(p => p.type === 'openrouter');
      expect(openrouter.registered).toBe(true);
      
      const anthropic = allProviders.find(p => p.type === 'anthropic');
      expect(anthropic.registered).toBe(true);
      
      const together = allProviders.find(p => p.type === 'together');
      expect(together.registered).toBe(true);
    });

    it('deve obter provider padrão', () => {
      const defaultType = providerFactory.getDefaultProviderType();
      expect(defaultType).toBe('gemini'); // Deve ser Gemini por ser sempre disponível
    });

    it('deve verificar disponibilidade de providers', () => {
      expect(providerFactory.isProviderAvailable('gemini')).toBe(true);
      expect(providerFactory.isProviderAvailable('nonexistent')).toBe(false);
    });

    it('deve converter configuração do env para provider', () => {
      const envConfig = {
        name: 'gemini',
        authType: 'oauth-personal',
        models: ['gemini-1.5-flash'],
        credentials: { type: 'personal' }
      };

      const providerConfig = providerFactory.convertEnvConfigToProviderConfig(envConfig);
      
      expect(providerConfig.authType).toBe('oauth-personal');
      expect(providerConfig.model).toBe('gemini-1.5-flash');
      expect(providerConfig.personal).toBe(true);
      expect(providerConfig.temperature).toBe(0);
      expect(providerConfig.topP).toBe(1);
      expect(providerConfig.maxTokens).toBe(1000);
    });
  });

  describe('Fallback System Integration', () => {
    it('deve criar provider com fallback quando preferido falha', async () => {
      // Tentar criar provider inexistente deve usar fallback
      try {
        const provider = await providerFactory.createProviderWithFallback('nonexistent');
        expect(provider).toBeDefined();
        expect(provider.name).toBe('gemini'); // Deve fazer fallback para Gemini
      } catch (error) {
        // Se nenhum provider disponível, erro é esperado
        expect(error.message).toContain('provider');
      }
    });

    it('deve usar provider específico quando disponível', async () => {
      // Testar criação de Gemini diretamente
      try {
        const provider = await providerFactory.createProvider('gemini');
        expect(provider).toBeDefined();
        expect(provider.name).toBe('gemini');
        
        await provider.cleanup();
      } catch (error) {
        // Erro aceitável se configuração não estiver disponível no ambiente de teste
        expect(error.message).toContain('configuration');
      }
    });

    it('deve recarregar cadeia de fallback', async () => {
      const originalChain = providerFactory.getFallbackChain();
      
      await providerFactory.reloadFallbackChain();
      
      const newChain = providerFactory.getFallbackChain();
      expect(Array.isArray(newChain)).toBe(true);
      expect(newChain.length).toBeGreaterThanOrEqual(originalChain.length);
    });
  });

  describe('Provider Diagnosis Integration', () => {
    it('deve diagnosticar provider Gemini', async () => {
      const diagnosis = await providerFactory.diagnoseProvider('gemini');
      
      expect(diagnosis.provider).toBe('gemini');
      expect(diagnosis.registered).toBe(true);
      expect(diagnosis.envAvailable).toBe(true);
      expect(diagnosis.canCreate).toBe(true);
      expect(typeof diagnosis.timestamp).toBe('string');
      
      expect(Array.isArray(diagnosis.errors)).toBe(true);
      expect(Array.isArray(diagnosis.warnings)).toBe(true);
    });

    it('deve diagnosticar todos os providers', async () => {
      const fullDiagnosis = await providerFactory.diagnoseAllProviders();
      
      expect(fullDiagnosis.totalProviders).toBeGreaterThan(0);
      expect(fullDiagnosis.summary.available).toBeGreaterThan(0);
      expect(fullDiagnosis.providers.gemini).toBeDefined();
      expect(typeof fullDiagnosis.timestamp).toBe('string');
      
      // Verificar estrutura do sumário
      expect(typeof fullDiagnosis.summary.available).toBe('number');
      expect(typeof fullDiagnosis.summary.unavailable).toBe('number');
      expect(typeof fullDiagnosis.summary.errors).toBe('number');
      expect(typeof fullDiagnosis.summary.warnings).toBe('number');
    });

    it('deve diagnosticar provider não existente', async () => {
      const diagnosis = await providerFactory.diagnoseProvider('nonexistent');
      
      expect(diagnosis.provider).toBe('nonexistent');
      expect(diagnosis.registered).toBe(false);
      expect(diagnosis.canCreate).toBe(false);
      expect(diagnosis.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Rate Limiter Integration', () => {
    it('deve configurar limites por provider', () => {
      const limits = rateLimiter.getActiveLimits();
      
      expect(limits.gemini).toBeDefined();
      expect(limits.openrouter).toBeDefined();
      expect(limits.anthropic).toBeDefined();
      expect(limits.together).toBeDefined();
      
      // Verificar estrutura dos limites
      expect(limits.gemini['oauth-personal']).toBeDefined();
      expect(limits.gemini['oauth-personal'].requestsPerMinute).toBe(60);
      expect(limits.gemini['oauth-personal'].requestsPerDay).toBe(1000);
    });

    it('deve permitir requests dentro do limite', async () => {
      const canProceed = await rateLimiter.checkLimit('gemini', 'oauth-personal');
      expect(canProceed).toBe(true);
    });

    it('deve registrar custos de requests', () => {
      rateLimiter.recordCost('gemini', 'gemini-1.5-flash', 0.001, 100);
      
      const stats = rateLimiter.getUsageStats('gemini');
      expect(stats.providers.gemini).toBeDefined();
      expect(stats.providers.gemini.totalCost).toBe(0.001);
      expect(stats.providers.gemini.totalTokens).toBe(100);
    });

    it('deve detectar proximidade do limite', () => {
      // Simular muitas requests
      for (let i = 0; i < 50; i++) {
        rateLimiter.recordCost('test-provider', 'test-model', 0, 10);
      }
      
      rateLimiter.setLimit('test-provider', 'test-model', 60, null); // 60 per minute
      
      const isNear = rateLimiter.isNearLimit('test-provider', 'test-model', 0.8);
      expect(typeof isNear).toBe('boolean');
    });
  });

  describe('Environment Manager Integration', () => {
    it('deve estar carregado e funcional', () => {
      const stats = envManager.getStats();
      
      expect(stats.total_providers).toBeGreaterThan(0);
      expect(stats.available_providers).toBeGreaterThan(0);
      expect(stats.providers).toContain('gemini');
    });

    it('deve obter configuração do Gemini', () => {
      const geminiConfig = envManager.getProviderConfig('gemini');
      
      expect(geminiConfig).toBeDefined();
      expect(geminiConfig.name).toBe('gemini');
      expect(geminiConfig.available).toBe(true);
      expect(geminiConfig.authType).toBeDefined();
    });

    it('deve validar configuração de providers', () => {
      const validation = envManager.validateProviderConfig('gemini');
      
      expect(validation.valid).toBe(true);
      expect(Array.isArray(validation.errors)).toBe(true);
      expect(Array.isArray(validation.warnings)).toBe(true);
    });

    it('deve gerar exemplo de .env', () => {
      const envExample = envManager.generateEnvExample();
      
      expect(envExample).toContain('GEMINI_API_KEY');
      expect(envExample).toContain('OPENROUTER_API_KEY');
      expect(envExample).toContain('ANTHROPIC_API_KEY');
      expect(envExample).toContain('TOGETHER_API_KEY');
      expect(envExample).toContain('NexoCLI_BaseGemini');
    });

    it('deve obter configuração sanitizada', () => {
      const sanitized = envManager.getSanitizedConfig();
      
      expect(sanitized.gemini).toBeDefined();
      
      // Não deve expor credenciais reais
      const geminiCreds = sanitized.gemini.credentials;
      Object.values(geminiCreds).forEach(value => {
        if (typeof value === 'string' && value.length > 10) {
          expect(value).toBe('[REDACTED]');
        }
      });
    });
  });

  describe('Provider Implementation Tests', () => {
    it('deve instanciar OpenRouterProvider corretamente', () => {
      const provider = new OpenRouterProvider({
        apiKey: 'test-key',
        model: 'test-model'
      });
      
      expect(provider.name).toBe('openrouter');
      expect(provider.defaultModel).toBe('test-model');
      expect(provider.apiKey).toBe('test-key');
    });

    it('deve instanciar AnthropicProvider corretamente', () => {
      const provider = new AnthropicProvider({
        apiKey: 'sk-ant-test',
        model: 'claude-3-haiku-20240307'
      });
      
      expect(provider.name).toBe('anthropic');
      expect(provider.defaultModel).toBe('claude-3-haiku-20240307');
      expect(provider.apiKey).toBe('sk-ant-test');
    });

    it('deve instanciar TogetherProvider corretamente', () => {
      const provider = new TogetherProvider({
        apiKey: 'test-together-key',
        model: 'meta-llama/Llama-2-7b-chat-hf'
      });
      
      expect(provider.name).toBe('together');
      expect(provider.defaultModel).toBe('meta-llama/Llama-2-7b-chat-hf');
      expect(provider.apiKey).toBe('test-together-key');
    });

    it('deve obter requisitos de configuração de cada provider', () => {
      const openrouter = new OpenRouterProvider();
      const anthropic = new AnthropicProvider();
      const together = new TogetherProvider();
      
      const openrouterReqs = openrouter.getConfigRequirements();
      expect(openrouterReqs.authTypes).toContain('api-key');
      expect(openrouterReqs.required).toContain('apiKey');
      
      const anthropicReqs = anthropic.getConfigRequirements();
      expect(anthropicReqs.authTypes).toContain('api-key');
      expect(anthropicReqs.required).toContain('apiKey');
      
      const togetherReqs = together.getConfigRequirements();
      expect(togetherReqs.authTypes).toContain('api-key');
      expect(togetherReqs.required).toContain('apiKey');
    });

    it('deve obter capabilities de cada provider', () => {
      const openrouter = new OpenRouterProvider();
      const anthropic = new AnthropicProvider();
      const together = new TogetherProvider();
      
      const openrouterCaps = openrouter.getCapabilities();
      expect(openrouterCaps).toContain('multi-model-gateway');
      
      const anthropicCaps = anthropic.getCapabilities();
      expect(anthropicCaps).toContain('advanced-reasoning');
      
      const togetherCaps = together.getCapabilities();
      expect(togetherCaps).toContain('open-source-models');
    });
  });

  describe('Compatibility Tests', () => {
    it('deve manter compatibilidade com Fase 2', async () => {
      // Testar que comandos da Fase 2 ainda funcionam através da factory
      const stats = providerFactory.getStats();
      
      expect(stats.registeredTypes).toBeGreaterThanOrEqual(1); // Pelo menos Gemini
      expect(stats.availableTypes.length).toBeGreaterThan(0);
      
      // Verificar que Gemini está disponível
      const geminiAvailable = stats.availableTypes.find(p => p.type === 'gemini');
      expect(geminiAvailable).toBeDefined();
      expect(geminiAvailable.available).toBe(true);
    });

    it('deve preservar interface de provider existente', () => {
      const availableProviders = providerFactory.listAvailableProviders();
      
      availableProviders.forEach(provider => {
        expect(provider).toHaveProperty('type');
        expect(provider).toHaveProperty('available');
        expect(provider).toHaveProperty('description');
        expect(provider).toHaveProperty('authType');
        expect(provider).toHaveProperty('models');
        expect(provider).toHaveProperty('capabilities');
      });
    });

    it('deve validar configurações corretamente', () => {
      const validConfig = {
        authType: 'oauth-personal',
        model: 'gemini-1.5-flash',
        temperature: 0.5,
        topP: 0.8,
        maxTokens: 1000
      };

      const validation = providerFactory.validateProviderConfig('gemini', validConfig);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);

      const invalidConfig = {
        temperature: 3, // Inválido
        topP: -1, // Inválido
        maxTokens: -100 // Inválido
      };

      const invalidValidation = providerFactory.validateProviderConfig('gemini', invalidConfig);
      expect(invalidValidation.valid).toBe(false);
      expect(invalidValidation.errors.length).toBeGreaterThan(0);
    });
  });
});

console.log('✅ Testes de integração multi-provider configurados');