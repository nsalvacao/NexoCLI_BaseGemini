/**
 * @license
 * Criado por Claude-Code, 2025
 * Testes de arquitetura para validar modularidade de providers
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BaseProvider } from '../../src/providers/base.js';
import { GeminiProvider } from '../../src/providers/gemini.js';
import { providerFactory } from '../../src/providers/factory.js';
import { envManager } from '../../src/config/env-manager.js';
import { CredentialValidator } from '../../src/providers/validation.js';

describe('Arquitetura de Providers - Interface BaseProvider', () => {
  describe('BaseProvider Interface', () => {
    it('deve definir métodos abstratos obrigatórios', () => {
      const provider = new BaseProvider('test');
      
      // Métodos que devem lançar erro se não implementados
      expect(() => provider.initialize()).rejects.toThrow('test provider must implement initialize() method');
      expect(() => provider.authenticate()).rejects.toThrow('test provider must implement authenticate() method');
      expect(() => provider.sendMessage('test')).rejects.toThrow('test provider must implement sendMessage() method');
      expect(() => provider.listModels()).rejects.toThrow('test provider must implement listModels() method');
      expect(() => provider.validateCredentials()).rejects.toThrow('test provider must implement validateCredentials() method');
      expect(() => provider.testConnection()).rejects.toThrow('test provider must implement testConnection() method');
    });

    it('deve fornecer implementações padrão para métodos auxiliares', () => {
      const provider = new BaseProvider('test', {
        model: 'test-model',
        temperature: 0.5
      });

      // Métodos com implementação padrão
      expect(provider.getModelInfo()).toEqual(
        expect.objectContaining({
          provider: 'test',
          model: 'test-model',
          initialized: false,
          authenticated: false
        })
      );

      expect(provider.isReady()).toBe(false);
      expect(provider.validateMessage('test message')).toBe(true);
      expect(provider.validateMessage('')).toBe(false);
      expect(provider.validateMessage(null)).toBe(false);
    });

    it('deve processar opções corretamente', () => {
      const provider = new BaseProvider('test', {
        temperature: 0.7,
        topP: 0.9,
        maxTokens: 1500
      });

      const options = provider.processOptions({
        temperature: 0.5,
        newOption: 'test'
      });

      expect(options).toEqual(
        expect.objectContaining({
          temperature: 0.5, // Sobrescrito
          topP: 0.9, // Da configuração
          maxTokens: 1500, // Da configuração
          newOption: 'test' // Novo
        })
      );
    });

    it('deve validar configuração corretamente', () => {
      const provider = new BaseProvider('test');
      
      const validConfig = {
        authType: 'api-key',
        model: 'test-model',
        temperature: 0.5,
        topP: 0.8,
        maxTokens: 1000
      };

      const result = provider.validateConfig(validConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);

      const invalidConfig = {
        temperature: 3, // Inválido
        topP: -1, // Inválido
        maxTokens: -100 // Inválido
      };

      const invalidResult = provider.validateConfig(invalidConfig);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });

    it('deve sanitizar configuração sensível', () => {
      const provider = new BaseProvider('test', {
        authType: 'api-key',
        apiKey: 'sensitive-key',
        model: 'test-model'
      });

      const sanitized = provider.getSanitizedConfig();
      expect(sanitized.apiKey).toBe('[REDACTED]');
      expect(sanitized.model).toBe('test-model');
      expect(sanitized.authType).toBe('api-key');
    });
  });

  describe('GeminiProvider Implementation', () => {
    let provider;

    beforeEach(() => {
      provider = new GeminiProvider({
        authType: 'oauth-personal',
        model: 'gemini-1.5-flash'
      });
    });

    afterEach(async () => {
      if (provider) {
        await provider.cleanup();
      }
    });

    it('deve herdar corretamente de BaseProvider', () => {
      expect(provider).toBeInstanceOf(BaseProvider);
      expect(provider).toBeInstanceOf(GeminiProvider);
      expect(provider.name).toBe('gemini');
    });

    it('deve implementar todos os métodos obrigatórios', () => {
      // Verificar que métodos existem e são funções
      expect(typeof provider.initialize).toBe('function');
      expect(typeof provider.authenticate).toBe('function');
      expect(typeof provider.sendMessage).toBe('function');
      expect(typeof provider.listModels).toBe('function');
      expect(typeof provider.validateCredentials).toBe('function');
      expect(typeof provider.testConnection).toBe('function');
    });

    it('deve ter configuração específica do Gemini', () => {
      const modelInfo = provider.getModelInfo();
      expect(modelInfo.provider).toBe('gemini');
      expect(modelInfo.model).toBe('gemini-1.5-flash');
      expect(modelInfo.authType).toBeDefined();

      const capabilities = provider.getCapabilities();
      expect(capabilities).toContain('multimodal-input');
      expect(capabilities).toContain('oauth-authentication');
    });

    it('deve validar configuração específica do Gemini', () => {
      const validConfig = {
        authType: 'oauth-personal',
        model: 'gemini-1.5-flash',
        temperature: 0.7
      };

      const result = provider.validateConfig(validConfig);
      expect(result.valid).toBe(true);

      const invalidConfig = {
        authType: 'api-key'
        // Falta apiKey
      };

      const invalidResult = provider.validateConfig(invalidConfig);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.some(e => e.includes('API key'))).toBe(true);
    });

    it('deve obter requisitos de configuração', () => {
      const requirements = provider.getConfigRequirements();
      
      expect(requirements.authTypes).toContain('oauth-personal');
      expect(requirements.authTypes).toContain('api-key');
      expect(requirements.models).toContain('gemini-1.5-flash');
      expect(requirements.description).toContain('Gemini');
    });
  });
});

describe('Arquitetura de Providers - Factory Pattern', () => {
  describe('ProviderFactory', () => {
    it('deve estar inicializado com provider Gemini', () => {
      const availableTypes = providerFactory.listAvailableProviders();
      const geminiProvider = availableTypes.find(p => p.type === 'gemini');
      
      expect(geminiProvider).toBeDefined();
      expect(geminiProvider.type).toBe('gemini');
      expect(geminiProvider.description).toContain('Gemini');
    });

    it('deve detectar providers disponíveis do environment', () => {
      const envProviders = envManager.getAvailableProviders();
      const factoryProviders = providerFactory.listAvailableProviders();
      
      // Pelo menos Gemini deve estar disponível (OAuth sempre funciona)
      expect(envProviders).toContain('gemini');
      
      const geminiInFactory = factoryProviders.find(p => p.type === 'gemini');
      expect(geminiInFactory.available).toBe(true);
    });

    it('deve listar todos os providers incluindo não implementados', () => {
      const allProviders = providerFactory.listAllProviders();
      
      expect(allProviders.length).toBeGreaterThan(0);
      
      const gemini = allProviders.find(p => p.type === 'gemini');
      expect(gemini.registered).toBe(true);
      expect(gemini.available).toBe(true);
    });

    it('deve obter provider padrão', () => {
      const defaultType = providerFactory.getDefaultProviderType();
      expect(defaultType).toBe('gemini'); // Deve ser Gemini por ser o único implementado
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
    });
  });

  describe('Diagnóstico de Providers', () => {
    it('deve diagnosticar provider Gemini', async () => {
      const diagnosis = await providerFactory.diagnoseProvider('gemini');
      
      expect(diagnosis.provider).toBe('gemini');
      expect(diagnosis.registered).toBe(true);
      expect(diagnosis.envAvailable).toBe(true);
      expect(diagnosis.canCreate).toBe(true);
      expect(typeof diagnosis.timestamp).toBe('string');
    });

    it('deve diagnosticar todos os providers', async () => {
      const fullDiagnosis = await providerFactory.diagnoseAllProviders();
      
      expect(fullDiagnosis.totalProviders).toBeGreaterThan(0);
      expect(fullDiagnosis.summary.available).toBeGreaterThan(0);
      expect(fullDiagnosis.providers.gemini).toBeDefined();
      expect(typeof fullDiagnosis.timestamp).toBe('string');
    });
  });
});

describe('Arquitetura de Providers - Environment Manager', () => {
  describe('EnvManager', () => {
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
      expect(envExample).toContain('GOOGLE_CLOUD_PROJECT');
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
});

describe('Arquitetura de Providers - Credential Validator', () => {
  describe('CredentialValidator', () => {
    it('deve validar credenciais do Gemini', async () => {
      const config = {
        authType: 'oauth-personal',
        credentials: { type: 'personal' }
      };

      const result = await CredentialValidator.validateGemini(config);
      
      expect(result.provider).toBe('gemini');
      expect(result.authType).toBe('oauth-personal');
      expect(typeof result.valid).toBe('boolean');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    it('deve validar provider por nome', async () => {
      const config = {
        authType: 'oauth-personal',
        credentials: { type: 'personal' }
      };

      const result = await CredentialValidator.validateProvider('gemini', config);
      
      expect(result.provider).toBe('gemini');
      expect(typeof result.valid).toBe('boolean');
    });

    it('deve retornar erro para provider desconhecido', async () => {
      const result = await CredentialValidator.validateProvider('unknown', {});
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Unknown provider'))).toBe(true);
    });

    it('deve obter estatísticas de validação', () => {
      const validationResult = {
        valid: true,
        provider: 'gemini',
        authType: 'oauth-personal',
        errors: [],
        warnings: ['test warning'],
        details: { test: true }
      };

      const stats = CredentialValidator.getValidationStats(validationResult);
      
      expect(stats.type).toBe('single-provider');
      expect(stats.provider).toBe('gemini');
      expect(stats.valid).toBe(true);
      expect(stats.warnings).toBe(1);
    });

    it('deve executar teste rápido de conectividade', async () => {
      const config = {
        authType: 'oauth-personal',
        credentials: { type: 'personal' }
      };

      const canConnect = await CredentialValidator.quickConnectivityTest('gemini', config);
      
      expect(typeof canConnect).toBe('boolean');
    });
  });
});

console.log('✅ Testes de arquitetura configurados - validando modularidade de providers');