#!/usr/bin/env node

/**
 * @license
 * Modificado por Claude-Code, 2025
 * Baseado em código de gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
 * CLI principal do NexoCLI_BaseGemini
 */

import { GeminiProvider } from '../providers/gemini.js';
import { providerFactory, PROVIDER_TYPES } from '../providers/factory.js';
import { envManager } from '../config/env-manager.js';
import { rateLimiter } from '../utils/rate-limiter.js';
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
      console.log('🚀 NexoCLI_BaseGemini - Fase 4 Multi-Provider');
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

    if (this.args.includes('--list-providers')) {
      return { action: 'list-providers' };
    }

    if (this.args.includes('--diagnose')) {
      return { action: 'diagnose' };
    }

    // Detectar provider específico
    let provider = null;
    const providerIndex = this.args.indexOf('--provider');
    if (providerIndex !== -1 && this.args[providerIndex + 1]) {
      provider = this.args[providerIndex + 1];
    }

    // Detectar se deve usar fallback (padrão: true)
    const noFallback = this.args.includes('--no-fallback');
    const fallback = !noFallback;

    // Detectar auth type (para compatibilidade com Fase 2)
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

    // Detectar temperatura
    let temperature = null;
    const tempIndex = this.args.indexOf('--temperature');
    if (tempIndex !== -1 && this.args[tempIndex + 1]) {
      temperature = parseFloat(this.args[tempIndex + 1]);
    }

    // Detectar max tokens
    let maxTokens = null;
    const tokensIndex = this.args.indexOf('--max-tokens');
    if (tokensIndex !== -1 && this.args[tokensIndex + 1]) {
      maxTokens = parseInt(this.args[tokensIndex + 1]);
    }

    // Obter mensagem (filtrar argumentos)
    const filteredArgs = ['--help', '-h', '--version', '-v', '--test', '--list-providers', 
                         '--diagnose', '--provider', '--no-fallback', '--api-key', 
                         '--vertex', '--cloud-shell', '--model', '--temperature', '--max-tokens'];
    
    const message = this.args.filter((arg, index) => {
      // Se é um argumento filtrado, pular
      if (filteredArgs.includes(arg)) return false;
      
      // Se é um valor de argumento (vem depois de --), pular
      const prevArg = this.args[index - 1];
      if (prevArg && prevArg.startsWith('--')) return false;
      
      return true;
    }).join(' ');

    return {
      action: 'chat',
      message,
      provider,
      fallback,
      authType,
      model,
      temperature,
      maxTokens
    };
  }

  /**
   * Mostra ajuda
   */
  showHelp() {
    console.log(`NexoCLI_BaseGemini v${this.version}`);
    console.log('Fork do Gemini-CLI com suporte multi-provider e fallback automático');
    console.log();
    console.log('Uso:');
    console.log('  nexocli "sua mensagem aqui"');
    console.log('  nexocli --provider openrouter "Explica IA"');
    console.log('  nexocli --test');
    console.log();
    console.log('Opções Gerais:');
    console.log('  --help, -h              Mostra esta ajuda');
    console.log('  --version, -v           Mostra a versão');
    console.log('  --test                  Executa teste de conexão');
    console.log('  --list-providers        Lista providers disponíveis');
    console.log('  --diagnose              Executa diagnóstico completo');
    console.log();
    console.log('Providers Multi-Provider:');
    console.log('  --provider <provider>   Usa provider específico (gemini, openrouter, anthropic, together)');
    console.log('  --no-fallback          Desativa fallback automático');
    console.log('  --model <modelo>       Especifica modelo a usar');
    console.log('  --temperature <0-2>    Define temperatura do modelo');
    console.log('  --max-tokens <num>     Define máximo de tokens');
    console.log();
    console.log('Compatibilidade Gemini (Fase 2):');
    console.log('  --api-key              Usa Gemini API Key');
    console.log('  --vertex               Usa Vertex AI');
    console.log('  --cloud-shell          Usa Cloud Shell');
    console.log();
    console.log('Exemplos Multi-Provider:');
    console.log('  nexocli "Olá, como estás?"                                   # Fallback automático');
    console.log('  nexocli --provider openrouter "Explica machine learning"    # OpenRouter específico');
    console.log('  nexocli --provider anthropic "Analisa este código"          # Claude específico');
    console.log('  nexocli --provider together "História da IA"                # Together AI específico');
    console.log('  nexocli --list-providers                                     # Ver providers disponíveis');
    console.log('  nexocli --test                                               # Testar conectividade');
    console.log();
    console.log('Exemplos Avançados:');
    console.log('  nexocli --provider openrouter --model gpt-4 "Análise complexa"');
    console.log('  nexocli --provider anthropic --temperature 0.3 "Código Python"');
    console.log('  nexocli --provider gemini --no-fallback "Só Gemini"');
    console.log();
    console.log('Variáveis de Ambiente:');
    console.log('  # Gemini');
    console.log('  GEMINI_API_KEY          Chave API do Gemini');
    console.log('  GOOGLE_API_KEY          Chave API do Google');
    console.log('  GOOGLE_CLOUD_PROJECT    Projeto Google Cloud');
    console.log('  GOOGLE_CLOUD_LOCATION   Localização Google Cloud');
    console.log();
    console.log('  # Providers Externos');
    console.log('  OPENROUTER_API_KEY      Chave OpenRouter (gateway)');
    console.log('  ANTHROPIC_API_KEY       Chave Anthropic (Claude)');
    console.log('  TOGETHER_API_KEY        Chave Together AI');
    console.log();
    console.log('Mais informações: https://github.com/user/NexoCLI_BaseGemini');
  }

  /**
   * Mostra versão
   */
  showVersion() {
    console.log(`NexoCLI_BaseGemini v${this.version}`);
    console.log('Baseado em Gemini-CLI (Google LLC, Apache 2.0)');
    console.log('Fase 4 - Multi-Provider com Fallback Automático');
    console.log();
    console.log('Providers implementados:');
    console.log('  ✅ Gemini (Google) - OAuth gratuito + API Key');
    console.log('  ✅ OpenRouter - Gateway para 100+ modelos');
    console.log('  ✅ Anthropic Claude - Assistant especializado');
    console.log('  ✅ Together AI - Modelos open-source rápidos');
  }

  /**
   * Lista providers disponíveis
   */
  async listProviders() {
    try {
      console.log('📋 Providers Disponíveis:');
      console.log();

      const available = providerFactory.listAvailableProviders();
      const fallbackChain = providerFactory.getFallbackChain();

      available.forEach((provider, index) => {
        const status = provider.available ? '✅' : '❌';
        const priority = fallbackChain.indexOf(provider.type) + 1;
        const priorityText = priority > 0 ? ` (prioridade ${priority})` : '';
        
        console.log(`${status} ${provider.type.toUpperCase()}${priorityText}`);
        console.log(`   ${provider.description}`);
        console.log(`   Auth: ${provider.authType}`);
        console.log(`   Modelos: ${provider.models.length > 0 ? provider.models.slice(0, 3).join(', ') : 'detectar automaticamente'}`);
        
        if (!provider.available) {
          console.log(`   ⚠️ Configure: ${provider.type.toUpperCase()}_API_KEY`);
        }
        
        console.log();
      });

      console.log('🔄 Cadeia de Fallback:');
      if (fallbackChain.length > 0) {
        console.log(`   ${fallbackChain.join(' → ')}`);
      } else {
        console.log('   Nenhum provider disponível');
      }
      
      console.log();
      console.log('💡 Use --provider <nome> para forçar um provider específico');
      console.log('💡 Use --diagnose para verificação detalhada');

    } catch (error) {
      console.error('❌ Erro ao listar providers:', error.message);
    }
  }

  /**
   * Executa diagnóstico simplificado
   */
  async runSimpleDiagnose() {
    try {
      console.log('🔍 Diagnóstico Rápido:');
      console.log();

      const diagnosis = await providerFactory.diagnoseAllProviders();
      
      console.log(`📊 Status: ${diagnosis.summary.available}/${diagnosis.totalProviders} providers disponíveis`);
      console.log(`⚠️ Avisos: ${diagnosis.summary.warnings}`);
      console.log(`❌ Erros: ${diagnosis.summary.errors}`);
      console.log();

      Object.entries(diagnosis.providers).forEach(([name, diag]) => {
        const status = diag.canCreate ? '✅' : '❌';
        console.log(`${status} ${name.toUpperCase()}: ${diag.canCreate ? 'Pronto' : 'Indisponível'}`);
        
        if (diag.errors.length > 0) {
          diag.errors.forEach(error => console.log(`     ❌ ${error}`));
        }
        
        if (diag.warnings.length > 0) {
          diag.warnings.forEach(warning => console.log(`     ⚠️ ${warning}`));
        }
      });

      console.log();
      console.log('💡 Use npm run diagnose para diagnóstico completo');

    } catch (error) {
      console.error('❌ Erro durante diagnóstico:', error.message);
    }
  }

  /**
   * Inicializa provider com sistema multi-provider
   * @param {Object} options - Opções de configuração
   */
  async initializeProvider(options = {}) {
    try {
      const { provider: preferredProvider, fallback, authType, model, temperature, maxTokens } = options;
      
      // Configurar rate limiter
      rateLimiter.setLogger(logger);
      
      // Modo de compatibilidade com Fase 2 (Gemini específico)
      if (authType && !preferredProvider) {
        console.log('🔧 Modo compatibilidade Fase 2: Inicializando provider Gemini...');
        
        const geminiConfig = {
          authType: authType,
          model: model || 'gemini-1.5-flash',
          temperature: temperature || 0,
          maxTokens: maxTokens || 1000
        };
        
        this.provider = await providerFactory.createProvider('gemini', geminiConfig);
        
        console.log('✅ Provider Gemini inicializado (compatibilidade Fase 2)');
        this.showProviderInfo();
        return true;
      }
      
      // Modo multi-provider (Fase 4)
      if (preferredProvider) {
        console.log(`🔧 Inicializando provider específico: ${preferredProvider}...`);
        
        const providerConfig = {
          model: model,
          temperature: temperature,
          maxTokens: maxTokens
        };
        
        try {
          this.provider = await providerFactory.createProvider(preferredProvider, providerConfig);
          
          console.log(`✅ Provider ${preferredProvider} inicializado com sucesso`);
          this.showProviderInfo();
          return true;
          
        } catch (error) {
          console.error(`❌ Erro ao inicializar ${preferredProvider}: ${error.message}`);
          
          if (fallback) {
            console.log('🔄 Tentando fallback automático...');
            // Continuar para fallback
          } else {
            throw error;
          }
        }
      }
      
      // Fallback automático ou criação padrão
      console.log('🔄 Usando fallback automático de providers...');
      
      const providerConfig = {
        model: model,
        temperature: temperature,
        maxTokens: maxTokens
      };
      
      this.provider = await providerFactory.createProviderWithFallback(preferredProvider, providerConfig);
      
      console.log('✅ Provider inicializado via fallback automático');
      this.showProviderInfo();
      return true;
      
    } catch (error) {
      console.error('❌ Erro ao inicializar provider:', error.message);
      this.showTroubleshootingTips(error);
      throw error;
    }
  }

  /**
   * Mostra informações do provider ativo
   */
  showProviderInfo() {
    if (!this.provider) return;
    
    const modelInfo = this.provider.getModelInfo();
    console.log(`📊 Provider: ${modelInfo.provider}`);
    console.log(`🤖 Modelo: ${modelInfo.model}`);
    console.log(`🔐 Auth: ${modelInfo.authType || 'default'}`);
    console.log(`⚡ Status: ${modelInfo.ready ? 'Pronto' : 'Iniciando...'}`);
    console.log();
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
      const args = this.processArguments();
      const { action, message, provider, fallback, authType, model, temperature, maxTokens } = args;

      // Executar ação
      switch (action) {
        case 'help':
        case 'version':
          // Já processado
          break;

        case 'list-providers':
          await this.listProviders();
          break;

        case 'diagnose':
          await this.runSimpleDiagnose();
          break;

        case 'test':
          await this.initializeProvider({ provider, fallback, authType, model, temperature, maxTokens });
          await this.runTest();
          break;

        case 'chat':
          await this.initializeProvider({ provider, fallback, authType, model, temperature, maxTokens });
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