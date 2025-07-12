/**
 * @license
 * Modificado por Claude-Code, 2025
 * Setup para testes do NexoCLI_BaseGemini
 */

import { beforeAll, afterAll } from 'vitest';

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

// Cleanup após todos os testes
afterAll(() => {
  console.log('✅ Testes concluídos');
});