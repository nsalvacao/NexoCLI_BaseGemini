/**
 * @license
 * Modificado por Claude-Code, 2025
 * Configuração do Vitest para NexoCLI_BaseGemini
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Configurações globais
    globals: true,
    environment: 'node',
    
    // Diretórios
    include: ['tests/**/*.test.js'],
    exclude: ['node_modules', 'dist', 'build'],
    
    // Timeout
    testTimeout: 30000,
    hookTimeout: 30000,
    
    // Reporters
    reporter: ['verbose', 'json'],
    outputFile: {
      json: './test-results.json',
    },
    
    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.js'],
      exclude: [
        'src/**/*.test.js',
        'src/database/**/*', // Fase 1 já testada
        'src/utils/logger.js', // Fase 1 já testada
        'src/utils/logger-adapter.js', // Adaptador simples
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    
    // Setup
    setupFiles: ['./tests/setup.js'],
    
    // Configurações específicas do Node.js
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});