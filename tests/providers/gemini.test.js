/**
 * @license
 * Modificado por Claude-Code, 2025
 * Testes para o provider Gemini
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GeminiProvider } from '../../src/providers/gemini.js';
import { AuthType } from '../../src/auth/oauth.js';

describe('GeminiProvider', () => {
  let provider;

  beforeEach(() => {
    provider = new GeminiProvider({
      authType: AuthType.LOGIN_WITH_GOOGLE,
      model: 'gemini-1.5-flash',
    });
  });

  afterEach(async () => {
    if (provider) {
      await provider.cleanup();
    }
  });

  describe('Inicialização', () => {
    it('deve ser criado com configurações padrão', () => {
      expect(provider).toBeDefined();
      expect(provider.name).toBe('gemini');
      expect(provider.config.model).toBe('gemini-1.5-flash');
      expect(provider.config.authType).toBe(AuthType.LOGIN_WITH_GOOGLE);
    });

    it('deve inicializar com sucesso', async () => {
      const result = await provider.initialize();
      expect(result).toBe(true);
      expect(provider.initialized).toBe(true);
    });

    it('deve retornar informações corretas', () => {
      const info = provider.getInfo();
      expect(info.name).toBe('gemini');
      expect(info.version).toBe('1.0.0');
      expect(info.capabilities).toContain('text-generation');
      expect(info.capabilities).toContain('oauth-authentication');
    });
  });

  describe('Autenticação', () => {
    it('deve autenticar com sucesso', async () => {
      await provider.initialize();
      const result = await provider.authenticate();
      expect(result).toBe(true);
      expect(provider.authenticated).toBe(true);
    });

    it('deve falhar autenticação sem inicialização', async () => {
      await expect(provider.authenticate()).rejects.toThrow('not initialized');
    });

    it('deve verificar se está pronto', async () => {
      await provider.initialize();
      await provider.authenticate();
      expect(provider.isReady()).toBe(true);
    });
  });

  describe('Envio de mensagens', () => {
    beforeEach(async () => {
      await provider.initialize();
      await provider.authenticate();
    });

    it('deve enviar mensagem com sucesso', async () => {
      const response = await provider.sendMessage('Test message');
      expect(response.success).toBe(true);
      expect(response.response).toBeDefined();
      expect(response.provider).toBe('gemini');
      expect(response.model).toBe('gemini-1.5-flash');
      expect(response.tokensUsed).toBeGreaterThan(0);
    });

    it('deve rejeitar mensagem vazia', async () => {
      await expect(provider.sendMessage('')).rejects.toThrow('Invalid message');
    });

    it('deve rejeitar mensagem null', async () => {
      await expect(provider.sendMessage(null)).rejects.toThrow('Invalid message');
    });

    it('deve rejeitar mensagem muito longa', async () => {
      const longMessage = 'a'.repeat(100001);
      await expect(provider.sendMessage(longMessage)).rejects.toThrow('Invalid message');
    });
  });

  describe('Teste de conexão', () => {
    beforeEach(async () => {
      await provider.initialize();
      await provider.authenticate();
    });

    it('deve passar teste de conexão', async () => {
      const result = await provider.testConnection();
      expect(result.success).toBe(true);
      expect(result.response).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('Gestão de modelos', () => {
    beforeEach(async () => {
      await provider.initialize();
      await provider.authenticate();
    });

    it('deve listar modelos disponíveis', async () => {
      const models = await provider.listModels();
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
      expect(models[0]).toHaveProperty('id');
      expect(models[0]).toHaveProperty('name');
    });

    it('deve retornar informações do modelo', () => {
      const modelInfo = provider.getModelInfo();
      expect(modelInfo.provider).toBe('gemini');
      expect(modelInfo.model).toBe('gemini-1.5-flash');
      expect(modelInfo.authType).toBe(AuthType.LOGIN_WITH_GOOGLE);
    });

    it('deve alterar modelo', async () => {
      const result = await provider.changeModel('gemini-1.5-pro');
      expect(result).toBe(true);
      expect(provider.config.model).toBe('gemini-1.5-pro');
    });
  });

  describe('Estatísticas', () => {
    beforeEach(async () => {
      await provider.initialize();
      await provider.authenticate();
    });

    it('deve retornar estatísticas corretas', () => {
      const stats = provider.getStats();
      expect(stats.provider).toBe('gemini');
      expect(stats.initialized).toBe(true);
      expect(stats.authenticated).toBe(true);
      expect(stats.ready).toBe(true);
      expect(stats.authType).toBe(AuthType.LOGIN_WITH_GOOGLE);
    });
  });

  describe('Cleanup', () => {
    it('deve fazer cleanup corretamente', async () => {
      await provider.initialize();
      await provider.authenticate();
      
      expect(provider.isReady()).toBe(true);
      
      await provider.cleanup();
      
      expect(provider.initialized).toBe(false);
      expect(provider.authenticated).toBe(false);
      expect(provider.isReady()).toBe(false);
    });
  });
});

describe('GeminiProvider - Diferentes tipos de autenticação', () => {
  const authTypes = [
    AuthType.LOGIN_WITH_GOOGLE,
    AuthType.CLOUD_SHELL,
    // AuthType.USE_GEMINI e AuthType.USE_VERTEX_AI requerem env vars
  ];

  authTypes.forEach(authType => {
    describe(`Autenticação ${authType}`, () => {
      let provider;

      beforeEach(() => {
        provider = new GeminiProvider({ authType });
      });

      afterEach(async () => {
        if (provider) {
          await provider.cleanup();
        }
      });

      it(`deve inicializar com ${authType}`, async () => {
        const result = await provider.initialize();
        expect(result).toBe(true);
        expect(provider.authType).toBe(authType);
      });

      it(`deve autenticar com ${authType}`, async () => {
        await provider.initialize();
        const result = await provider.authenticate();
        expect(result).toBe(true);
        expect(provider.authenticated).toBe(true);
      });
    });
  });
});