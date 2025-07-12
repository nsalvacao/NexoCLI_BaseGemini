/**
 * @license
 * Modificado por Claude-Code, 2025
 * Baseado em código de gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
 * Ponto de entrada principal do NexoCLI_BaseGemini
 */

// Exportar componentes principais
export { GeminiProvider } from './providers/gemini.js';
export { BaseProvider } from './providers/base.js';
export { providerFactory, PROVIDER_TYPES } from './providers/factory.js';
export { oauth, AuthType, validateAuthMethod } from './auth/oauth.js';
export { GeminiClient } from './gemini/client.js';
export { settings } from './config/settings.js';
export { logger } from './utils/logger-adapter.js';
export { NexoCLI } from './cli/index.js';

// Informações do pacote
export const PACKAGE_INFO = {
  name: 'NexoCLI_BaseGemini',
  version: '1.0.0',
  description: 'Fork do Gemini-CLI com suporte multi-provider',
  phase: 'Phase 2 - Provider Gemini MVP',
  author: 'Claude-Code',
  basedOn: 'Gemini-CLI (Google LLC, Apache 2.0)',
  license: 'Apache-2.0',
};

// Função de inicialização rápida
export async function initializeNexoCLI(config = {}) {
  const { settings } = await import('./config/settings.js');
  const { providerFactory } = await import('./providers/factory.js');
  
  // Inicializar configurações
  await settings.initialize();
  
  // Criar provider padrão se especificado
  if (config.provider) {
    const provider = await providerFactory.createProvider(config.provider, config);
    await provider.initialize();
    await provider.authenticate();
    return provider;
  }
  
  return null;
}

// Exportar como default também
export default {
  GeminiProvider,
  BaseProvider,
  providerFactory,
  PROVIDER_TYPES,
  oauth,
  AuthType,
  validateAuthMethod,
  GeminiClient,
  settings,
  logger,
  NexoCLI,
  PACKAGE_INFO,
  initializeNexoCLI,
};