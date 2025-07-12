#!/usr/bin/env node

/**
 * @license
 * Modificado por Claude-Code, 2025
 * Baseado em código de gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
 * CLI principal do NexoCLI_BaseGemini
 */

import { GeminiProvider } from '../providers/gemini.js';
import { AuthType } from '../auth/oauth.js';
import { settings } from '../config/settings.js';
import { logger } from '../utils/logger-adapter.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Classe principal da CLI
 */
class NexoCLI {
  constructor() {
    this.provider = null;
    this.args = process.argv.slice(2);
    this.version = this.getVersion();
  }

  /**
   * Obtém versão do package.json
   * @returns {string} Versão
   */
  getVersion() {
    try {
      const packagePath = join(__dirname, '..', '..', 'package.json');
      const packageData = JSON.parse(readFileSync(packagePath, 'utf8'));
      return packageData.version || '1.0.0';
    } catch (error) {
      return '1.0.0';
    }
  }

  /**
   * Inicializa a CLI
   */
  async initialize() {
    try {
      console.log('🚀 NexoCLI_BaseGemini - Fase 2 MVP');
      console.log(`📦 Versão: ${this.version}`);
      console.log();

      // Inicializar configurações
      await settings.initialize();

      // Log de inicialização
      await logger.logDevelopment(
        'NexoCLI_Main',
        'cli_startup',
        `CLI started with args: ${this.args.join(' ')}`,
        'Medium'
      );

      return true;
    } catch (error) {
      console.error('❌ Erro ao inicializar CLI:', error.message);
      process.exit(1);
    }
  }

  /**
   * Processa argumentos da linha de comando
   */
  processArguments() {
    // Verificar comandos especiais
    if (this.args.includes('--help') || this.args.includes('-h')) {
      this.showHelp();
      return { action: 'help' };
    }

    if (this.args.includes('--version') || this.args.includes('-v')) {
      this.showVersion();
      return { action: 'version' };
    }

    if (this.args.includes('--test')) {
      return { action: 'test' };
    }

    // Detectar auth type
    let authType = AuthType.LOGIN_WITH_GOOGLE;
    if (this.args.includes('--api-key')) {
      authType = AuthType.USE_GEMINI;
    } else if (this.args.includes('--vertex')) {
      authType = AuthType.USE_VERTEX_AI;
    } else if (this.args.includes('--cloud-shell')) {
      authType = AuthType.CLOUD_SHELL;
    }

    // Detectar modelo
    let model = null;
    const modelIndex = this.args.indexOf('--model');
    if (modelIndex !== -1 && this.args[modelIndex + 1]) {
      model = this.args[modelIndex + 1];
    }

    // Obter mensagem
    const message = this.args.filter(arg => 
      !arg.startsWith('--') && 
      !this.args[this.args.indexOf(arg) - 1]?.startsWith('--')
    ).join(' ');

    return {
      action: 'chat',
      message,
      authType,
      model,
    };
  }

  /**
   * Mostra ajuda
   */
  showHelp() {
    console.log(`NexoCLI_BaseGemini v${this.version}`);
    console.log('Fork do Gemini-CLI com suporte multi-provider');
    console.log();
    console.log('Uso:');
    console.log('  nexocli "sua mensagem aqui"');
    console.log('  nexocli --test');
    console.log();
    console.log('Opções:');
    console.log('  --help, -h           Mostra esta ajuda');
    console.log('  --version, -v        Mostra a versão');
    console.log('  --test               Executa teste de conexão');
    console.log('  --api-key            Usa Gemini API Key');
    console.log('  --vertex             Usa Vertex AI');
    console.log('  --cloud-shell        Usa Cloud Shell');
    console.log('  --model <modelo>     Especifica modelo a usar');
    console.log();
    console.log('Exemplos:');
    console.log('  nexocli "Olá, como estás?"');
    console.log('  nexocli --test');
    console.log('  nexocli --api-key "Explica JavaScript"');
    console.log('  nexocli --model gemini-1.5-pro "Código complexo"');
    console.log();
    console.log('Variáveis de ambiente:');
    console.log('  GEMINI_API_KEY       Chave API do Gemini');
    console.log('  GOOGLE_API_KEY       Chave API do Google');
    console.log('  GOOGLE_CLOUD_PROJECT Projeto Google Cloud');
    console.log('  GOOGLE_CLOUD_LOCATION Localização Google Cloud');
    console.log();
    console.log('Mais informações: https://github.com/user/NexoCLI_BaseGemini');
  }

  /**
   * Mostra versão
   */
  showVersion() {
    console.log(`NexoCLI_BaseGemini v${this.version}`);
    console.log('Baseado em Gemini-CLI (Google LLC, Apache 2.0)');
    console.log('Fase 2 MVP - Provider Gemini');
  }

  /**
   * Inicializa o provider
   * @param {Object} config - Configuração do provider
   */
  async initializeProvider(config = {}) {
    try {
      console.log('🔧 Inicializando provider Gemini...');
      
      // Preservar configurações customizadas
      const providerConfig = {
        authType: config.authType || AuthType.LOGIN_WITH_GOOGLE,
        model: config.model || 'gemini-1.5-flash',
        temperature: config.temperature || 0,
        topP: config.topP || 1,
        maxTokens: config.maxTokens || 1000,
        ...config, // Permitir override completo
      };
      
      this.provider = new GeminiProvider(providerConfig);
      
      // Inicializar e autenticar
      await this.provider.initialize();
      await this.provider.authenticate();
      
      console.log('✅ Provider Gemini inicializado com sucesso');
      
      // Mostrar informações do modelo
      const modelInfo = this.provider.getModelInfo();
      console.log(`📊 Modelo: ${modelInfo.model}`);
      console.log(`🔐 Autenticação: ${modelInfo.authType}`);
      console.log();
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao inicializar provider:', error.message);
      
      // Mostrar dicas de troubleshooting
      this.showTroubleshootingTips(error);
      
      throw error;
    }
  }

  /**
   * Executa teste de conexão
   */
  async runTest() {
    try {
      console.log('🧪 Executando teste de conexão...');
      
      const result = await this.provider.testConnection();
      
      if (result.success) {
        console.log('✅ Teste de conexão passou!');
        console.log(`📝 Resposta: ${result.response}`);
        console.log(`🔢 Tokens usados: ${result.tokensUsed}`);
        console.log(`⏱️ Timestamp: ${result.timestamp}`);
      } else {
        console.log('❌ Teste de conexão falhou!');
        console.log(`📝 Erro: ${result.error}`);
      }
      
      return result.success;
    } catch (error) {
      console.error('❌ Erro durante teste:', error.message);
      return false;
    }
  }

  /**
   * Envia mensagem para o provider
   * @param {string} message - Mensagem a enviar
   */
  async sendMessage(message) {
    try {
      if (!message || message.trim().length === 0) {
        console.log('❌ Mensagem vazia. Use --help para ver exemplos.');
        return;
      }

      console.log(`💬 Enviando mensagem: "${message}"`);
      console.log('⏳ Aguarde...');
      console.log();

      const response = await this.provider.sendMessage(message);

      if (response.success) {
        console.log('🤖 Resposta:');
        console.log('─'.repeat(50));
        console.log(response.response);
        console.log('─'.repeat(50));
        console.log();
        console.log(`📊 Modelo: ${response.model}`);
        console.log(`🔢 Tokens: ${response.tokensUsed}`);
        console.log(`📅 Timestamp: ${response.timestamp}`);
      } else {
        console.log('❌ Erro na resposta:', response.error);
      }

      return response;
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error.message);
      throw error;
    }
  }

  /**
   * Mostra dicas de troubleshooting
   * @param {Error} error - Erro ocorrido
   */
  showTroubleshootingTips(error) {
    console.log();
    console.log('💡 Dicas de troubleshooting:');
    console.log();
    
    if (error.message.includes('GEMINI_API_KEY')) {
      console.log('🔑 Configure sua API Key:');
      console.log('   export GEMINI_API_KEY="sua-chave-aqui"');
      console.log('   ou crie um arquivo .env com:');
      console.log('   GEMINI_API_KEY=sua-chave-aqui');
    }
    
    if (error.message.includes('GOOGLE_CLOUD_PROJECT')) {
      console.log('☁️ Configure Vertex AI:');
      console.log('   export GOOGLE_CLOUD_PROJECT="seu-projeto"');
      console.log('   export GOOGLE_CLOUD_LOCATION="us-central1"');
    }
    
    if (error.message.includes('OAuth') || error.message.includes('authentication')) {
      console.log('🔐 Problemas de autenticação:');
      console.log('   - Verifique suas credenciais');
      console.log('   - Tente usar --api-key se tiver chave API');
      console.log('   - Verifique conexão com internet');
    }
    
    console.log();
    console.log('📖 Para mais ajuda: nexocli --help');
  }

  /**
   * Executa a CLI
   */
  async run() {
    try {
      // Inicializar CLI
      await this.initialize();

      // Processar argumentos
      const { action, message, authType, model } = this.processArguments();

      // Executar ação
      switch (action) {
        case 'help':
        case 'version':
          // Já processado
          break;

        case 'test':
          await this.initializeProvider({ authType, model });
          await this.runTest();
          break;

        case 'chat':
          await this.initializeProvider({ authType, model });
          await this.sendMessage(message);
          break;

        default:
          console.log('❌ Ação inválida. Use --help para ver opções.');
          process.exit(1);
      }

      // Cleanup
      if (this.provider) {
        await this.provider.cleanup();
      }

      console.log();
      console.log('✅ Sessão terminada com sucesso');

    } catch (error) {
      console.error('❌ Erro fatal:', error.message);
      
      // Log do erro
      await logger.logDevelopment(
        'NexoCLI_Main',
        'fatal_error',
        `Fatal error: ${error.message}`,
        'High'
      );

      process.exit(1);
    }
  }
}

// Executar CLI se este ficheiro foi chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new NexoCLI();
  cli.run();
}

export { NexoCLI };