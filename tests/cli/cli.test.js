/**
 * @license
 * Modificado por Claude-Code, 2025
 * Testes para a CLI
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NexoCLI } from '../../src/cli/index.js';

describe('NexoCLI', () => {
  let cli;

  beforeEach(() => {
    cli = new NexoCLI();
  });

  afterEach(async () => {
    if (cli && cli.provider) {
      await cli.provider.cleanup();
    }
  });

  describe('Inicialização', () => {
    it('deve ser criado com estado inicial correto', () => {
      expect(cli).toBeDefined();
      expect(cli.provider).toBeNull();
      expect(cli.version).toBeDefined();
    });

    it('deve obter versão correta', () => {
      const version = cli.getVersion();
      expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('deve inicializar com sucesso', async () => {
      const result = await cli.initialize();
      expect(result).toBe(true);
    });
  });

  describe('Processamento de argumentos', () => {
    it('deve processar --help', () => {
      cli.args = ['--help'];
      const result = cli.processArguments();
      expect(result.action).toBe('help');
    });

    it('deve processar --version', () => {
      cli.args = ['--version'];
      const result = cli.processArguments();
      expect(result.action).toBe('version');
    });

    it('deve processar --test', () => {
      cli.args = ['--test'];
      const result = cli.processArguments();
      expect(result.action).toBe('test');
    });

    it('deve processar mensagem de chat', () => {
      cli.args = ['Hello', 'world'];
      const result = cli.processArguments();
      expect(result.action).toBe('chat');
      expect(result.message).toBe('Hello world');
    });

    it('deve detectar auth type', () => {
      cli.args = ['--api-key', 'test message'];
      const result = cli.processArguments();
      expect(result.authType).toBe('gemini-api-key');
    });

    it('deve detectar modelo', () => {
      cli.args = ['--model', 'gemini-1.5-pro', 'test message'];
      const result = cli.processArguments();
      expect(result.model).toBe('gemini-1.5-pro');
    });
  });

  describe('Inicialização do Provider', () => {
    beforeEach(async () => {
      await cli.initialize();
    });

    it('deve inicializar provider com sucesso', async () => {
      const result = await cli.initializeProvider();
      expect(result).toBe(true);
      expect(cli.provider).toBeDefined();
      expect(cli.provider.isReady()).toBe(true);
    });

    it('deve inicializar provider com configuração customizada', async () => {
      const result = await cli.initializeProvider({
        model: 'gemini-1.5-pro',
        temperature: 0.5,
      });
      expect(result).toBe(true);
      expect(cli.provider.config.model).toBe('gemini-1.5-pro');
      expect(cli.provider.config.temperature).toBe(0.5);
    });
  });

  describe('Teste de conexão', () => {
    beforeEach(async () => {
      await cli.initialize();
      await cli.initializeProvider();
    });

    it('deve executar teste de conexão', async () => {
      const result = await cli.runTest();
      expect(result).toBe(true);
    });
  });

  describe('Envio de mensagens', () => {
    beforeEach(async () => {
      await cli.initialize();
      await cli.initializeProvider();
    });

    it('deve enviar mensagem com sucesso', async () => {
      const response = await cli.sendMessage('Test message');
      expect(response).toBeDefined();
      expect(response.success).toBe(true);
      expect(response.response).toBeDefined();
    });

    it('deve rejeitar mensagem vazia', async () => {
      const response = await cli.sendMessage('');
      expect(response).toBeUndefined();
    });

    it('deve rejeitar mensagem null', async () => {
      const response = await cli.sendMessage(null);
      expect(response).toBeUndefined();
    });
  });
});

describe('NexoCLI - Integração', () => {
  let cli;

  beforeEach(() => {
    cli = new NexoCLI();
  });

  afterEach(async () => {
    if (cli && cli.provider) {
      await cli.provider.cleanup();
    }
  });

  it('deve completar fluxo completo de chat', async () => {
    // Simular args
    cli.args = ['Test', 'message'];
    
    // Inicializar
    await cli.initialize();
    
    // Processar args
    const { action, message } = cli.processArguments();
    expect(action).toBe('chat');
    expect(message).toBe('Test message');
    
    // Inicializar provider
    await cli.initializeProvider();
    expect(cli.provider.isReady()).toBe(true);
    
    // Enviar mensagem
    const response = await cli.sendMessage(message);
    expect(response.success).toBe(true);
    expect(response.response).toBeDefined();
    
    // Cleanup
    await cli.provider.cleanup();
    expect(cli.provider.isReady()).toBe(false);
  });

  it('deve completar fluxo de teste', async () => {
    // Simular args
    cli.args = ['--test'];
    
    // Inicializar
    await cli.initialize();
    
    // Processar args
    const { action } = cli.processArguments();
    expect(action).toBe('test');
    
    // Inicializar provider
    await cli.initializeProvider();
    
    // Executar teste
    const result = await cli.runTest();
    expect(result).toBe(true);
    
    // Cleanup
    await cli.provider.cleanup();
  });
});