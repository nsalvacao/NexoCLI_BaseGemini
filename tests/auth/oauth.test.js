/**
 * @license
 * Modificado por Claude-Code, 2025
 * Testes para o sistema OAuth
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OAuthManager, AuthType, validateAuthMethod } from '../../src/auth/oauth.js';

describe('validateAuthMethod', () => {
  it('deve validar métodos válidos', () => {
    expect(validateAuthMethod(AuthType.LOGIN_WITH_GOOGLE)).toBeNull();
    expect(validateAuthMethod(AuthType.CLOUD_SHELL)).toBeNull();
  });

  it('deve rejeitar métodos inválidos', () => {
    expect(validateAuthMethod('invalid')).toContain('Invalid auth method');
  });

  it('deve rejeitar USE_GEMINI sem API key', () => {
    const result = validateAuthMethod(AuthType.USE_GEMINI);
    expect(result).not.toBeNull();
    expect(result).toContain('GEMINI_API_KEY');
  });

  it('deve rejeitar USE_VERTEX_AI sem configuração', () => {
    const result = validateAuthMethod(AuthType.USE_VERTEX_AI);
    expect(result).toContain('GOOGLE_CLOUD_PROJECT');
  });
});

describe('OAuthManager', () => {
  let oauthManager;

  beforeEach(() => {
    oauthManager = new OAuthManager();
  });

  afterEach(async () => {
    if (oauthManager && oauthManager.isAuthenticated()) {
      await oauthManager.logout();
    }
  });

  describe('Inicialização', () => {
    it('deve ser criado com estado inicial correto', () => {
      expect(oauthManager.authType).toBeNull();
      expect(oauthManager.credentials).toBeNull();
      expect(oauthManager.authenticated).toBe(false);
    });

    it('deve inicializar com LOGIN_WITH_GOOGLE', async () => {
      const result = await oauthManager.initialize(AuthType.LOGIN_WITH_GOOGLE);
      expect(result).toBe(true);
      expect(oauthManager.isAuthenticated()).toBe(true);
      expect(oauthManager.getAuthType()).toBe(AuthType.LOGIN_WITH_GOOGLE);
    });

    it('deve inicializar com CLOUD_SHELL', async () => {
      const result = await oauthManager.initialize(AuthType.CLOUD_SHELL);
      expect(result).toBe(true);
      expect(oauthManager.isAuthenticated()).toBe(true);
      expect(oauthManager.getAuthType()).toBe(AuthType.CLOUD_SHELL);
    });

    it('deve falhar com método inválido', async () => {
      await expect(oauthManager.initialize('invalid')).rejects.toThrow('Invalid auth method');
    });
  });

  describe('Credenciais', () => {
    it('deve retornar credenciais após autenticação', async () => {
      await oauthManager.initialize(AuthType.LOGIN_WITH_GOOGLE);
      const credentials = oauthManager.getCredentials();
      
      expect(credentials).toBeDefined();
      expect(credentials.type).toBe('oauth');
      expect(credentials.access_token).toBeDefined();
      expect(credentials.refresh_token).toBeDefined();
    });

    it('deve retornar null antes da autenticação', () => {
      expect(oauthManager.getCredentials()).toBeNull();
    });
  });

  describe('Logout', () => {
    it('deve fazer logout corretamente', async () => {
      await oauthManager.initialize(AuthType.LOGIN_WITH_GOOGLE);
      expect(oauthManager.isAuthenticated()).toBe(true);
      
      await oauthManager.logout();
      
      expect(oauthManager.isAuthenticated()).toBe(false);
      expect(oauthManager.getCredentials()).toBeNull();
      expect(oauthManager.getAuthType()).toBeNull();
    });
  });

  describe('Estados', () => {
    it('deve reportar estado correto antes da autenticação', () => {
      expect(oauthManager.isAuthenticated()).toBe(false);
      expect(oauthManager.getAuthType()).toBeNull();
    });

    it('deve reportar estado correto após autenticação', async () => {
      await oauthManager.initialize(AuthType.LOGIN_WITH_GOOGLE);
      expect(oauthManager.isAuthenticated()).toBe(true);
      expect(oauthManager.getAuthType()).toBe(AuthType.LOGIN_WITH_GOOGLE);
    });
  });
});

describe('AuthType', () => {
  it('deve ter todos os tipos definidos', () => {
    expect(AuthType.LOGIN_WITH_GOOGLE).toBe('oauth-personal');
    expect(AuthType.USE_GEMINI).toBe('gemini-api-key');
    expect(AuthType.USE_VERTEX_AI).toBe('vertex-ai');
    expect(AuthType.CLOUD_SHELL).toBe('cloud-shell');
  });
});