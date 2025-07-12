/**
 * @license
 * Modificado por Claude-Code, 2025
 * Setup para testes do NexoCLI_BaseGemini
 */

import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';

// Configurar ambiente de teste
beforeAll(() => {
  // Limpar variáveis de ambiente que podem afetar os testes
  delete process.env.GEMINI_API_KEY;
  delete process.env.GOOGLE_API_KEY;
  delete process.env.GOOGLE_CLOUD_PROJECT;
  delete process.env.GOOGLE_CLOUD_LOCATION;
  
  // Definir variáveis de ambiente para testes
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'error'; // Reduzir logs durante testes
  process.env.LOG_TO_DATABASE = 'false'; // Não usar BD nos testes
  process.env.LOG_TO_FILES = 'false'; // Não criar arquivos de log
  
  // Timeout para operações assíncronas
  process.env.NEXOCLI_REQUEST_TIMEOUT = '5000';
  
  // Configurações de teste
  process.env.DOTENV_LOADED = 'true'; // Evitar tentativas de carregar .env
  
  console.log('🧪 Ambiente de testes configurado');
});

// CORREÇÃO: Mock axios globalmente
vi.mock('axios', () => {
  const mockAxios = {
    get: vi.fn(),
    post: vi.fn(),
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    })),
    defaults: { timeout: 10000 }
  };
  
  return { default: mockAxios, ...mockAxios };
});

// CORREÇÃO: Setup mocks por teste
beforeEach(() => {
  // Mock credenciais para testes
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key-for-testing';
  process.env.TOGETHER_API_KEY = 'test-together-key-for-testing';
  process.env.OPENROUTER_API_KEY = 'sk-or-test-key-for-testing';
  
  // Reset all mocks
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

// Cleanup após todos os testes
afterAll(() => {
  console.log('✅ Testes concluídos');
});

// CORREÇÃO: Helpers para mocks HTTP
export const mockSuccessfulResponse = (data = {}) => ({
  status: 200,
  data: data,
  headers: { 'content-type': 'application/json' }
});

export const mockProviderResponses = {
  openrouter: {
    models: { data: [{ id: 'gpt-4' }, { id: 'claude-3-haiku' }] },
    chat: { choices: [{ message: { content: 'Test response' } }] }
  },
  anthropic: {
    message: { content: [{ text: 'Test response from Anthropic' }] }
  }
};