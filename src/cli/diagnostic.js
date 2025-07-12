/**
 * @license
 * Criado por Claude-Code, 2025
 * Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)
 * Sistema de diagnóstico para troubleshooting
 */

import { providerFactory } from '../providers/factory.js';
import { envManager } from '../config/env-manager.js';
import { getDatabase, initializeDatabase } from '../database/connection.js';
import { logger } from '../utils/logger-adapter.js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Sistema de diagnóstico completo para NexoCLI_BaseGemini
 */
export class DiagnosticSystem {
  constructor() {
    this.startTime = Date.now();
    this.results = {
      timestamp: new Date().toISOString(),
      system: {},
      environment: {},
      database: {},
      providers: {},
      summary: {
        status: 'unknown',
        errors: 0,
        warnings: 0,
        recommendations: []
      }
    };
  }

  /**
   * Executa diagnóstico completo do sistema
   */
  async runFullDiagnostic() {
    console.log('🔍 NexoCLI_BaseGemini - Sistema de Diagnóstico');
    console.log('=' .repeat(50));
    console.log();

    try {
      // Diagnósticos em paralelo quando possível
      await this.checkSystemInfo();
      await this.checkEnvironmentConfig();
      await this.checkDatabase();
      await this.checkProviders();
      
      // Gerar sumário e recomendações
      this.generateSummary();
      
      // Mostrar resultados
      this.displayResults();
      
      return this.results;

    } catch (error) {
      console.error('❌ Erro durante diagnóstico:', error.message);
      this.results.summary.status = 'error';
      this.results.summary.errors++;
      throw error;
    }
  }

  /**
   * Verifica informações do sistema
   */
  async checkSystemInfo() {
    console.log('📊 Verificando informações do sistema...');
    
    try {
      const packagePath = join(__dirname, '..', '..', 'package.json');
      const packageData = existsSync(packagePath) 
        ? JSON.parse(readFileSync(packagePath, 'utf8'))
        : { version: 'unknown' };

      this.results.system = {
        version: packageData.version,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        workingDirectory: process.cwd(),
        nodeEnv: process.env.NODE_ENV || 'production',
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      };

      console.log(`  ✅ NexoCLI v${this.results.system.version}`);
      console.log(`  ✅ Node.js ${this.results.system.nodeVersion}`);
      console.log(`  ✅ Platform: ${this.results.system.platform}/${this.results.system.arch}`);

    } catch (error) {
      console.log('  ❌ Erro ao verificar sistema:', error.message);
      this.results.summary.errors++;
    }
  }

  /**
   * Verifica configuração do environment
   */
  async checkEnvironmentConfig() {
    console.log('\n🌍 Verificando configuração do environment...');
    
    try {
      const envStats = envManager.getStats();
      
      this.results.environment = {
        configPath: envManager.configPath,
        loadedFromEnv: envManager.loadedFromEnv,
        totalProviders: envStats.total_providers,
        availableProviders: envStats.available_providers,
        defaultProvider: envStats.default_provider,
        providers: envStats.providers
      };

      console.log(`  📁 Config: ${this.results.environment.configPath}`);
      console.log(`  📋 Loaded from .env: ${this.results.environment.loadedFromEnv ? 'Yes' : 'No'}`);
      console.log(`  🔌 Providers: ${this.results.environment.availableProviders}/${this.results.environment.totalProviders} disponíveis`);
      
      if (this.results.environment.defaultProvider) {
        console.log(`  ⭐ Default: ${this.results.environment.defaultProvider}`);
      } else {
        console.log('  ⚠️ Nenhum provider padrão disponível');
        this.results.summary.warnings++;
      }

      if (this.results.environment.availableProviders === 0) {
        console.log('  ❌ Nenhum provider configurado');
        this.results.summary.errors++;
        this.results.summary.recommendations.push('Configure pelo menos um provider no ficheiro .env');
      }

    } catch (error) {
      console.log('  ❌ Erro ao verificar environment:', error.message);
      this.results.summary.errors++;
    }
  }

  /**
   * Verifica estado da base de dados
   */
  async checkDatabase() {
    console.log('\n💾 Verificando base de dados...');
    
    try {
      let db = null;
      let dbExists = false;
      
      try {
        db = await getDatabase();
        dbExists = true;
      } catch (error) {
        // BD não existe, tentar criar
        console.log('  📝 Base de dados não encontrada, tentando criar...');
        db = await initializeDatabase();
        dbExists = true;
      }

      if (db && dbExists) {
        const info = await db.getInfo();
        const connectionTest = await db.testConnection();
        
        this.results.database = {
          exists: true,
          path: info.path,
          size: info.size,
          tables: info.tables,
          connectionOk: connectionTest,
          accessible: true
        };

        console.log(`  ✅ Base de dados: ${info.path}`);
        console.log(`  ✅ Tamanho: ${Math.round(info.size / 1024)} KB`);
        console.log(`  ✅ Tabelas: ${info.tables.length}`);
        console.log(`  ✅ Conexão: ${connectionTest ? 'OK' : 'Falhou'}`);

        if (!connectionTest) {
          this.results.summary.errors++;
        }

      } else {
        this.results.database = {
          exists: false,
          accessible: false,
          error: 'Could not create or access database'
        };
        
        console.log('  ❌ Base de dados inacessível');
        this.results.summary.errors++;
        this.results.summary.recommendations.push('Execute: npm run db:init');
      }

    } catch (error) {
      console.log('  ❌ Erro na base de dados:', error.message);
      this.results.database = {
        exists: false,
        accessible: false,
        error: error.message
      };
      this.results.summary.errors++;
    }
  }

  /**
   * Verifica providers disponíveis
   */
  async checkProviders() {
    console.log('\n🤖 Verificando providers...');
    
    try {
      const providerDiagnosis = await providerFactory.diagnoseAllProviders();
      
      this.results.providers = {
        totalProviders: providerDiagnosis.totalProviders,
        availableProviders: providerDiagnosis.summary.available,
        unavailableProviders: providerDiagnosis.summary.unavailable,
        totalErrors: providerDiagnosis.summary.errors,
        totalWarnings: providerDiagnosis.summary.warnings,
        details: providerDiagnosis.providers
      };

      console.log(`  📊 Total: ${this.results.providers.totalProviders} providers`);
      console.log(`  ✅ Disponíveis: ${this.results.providers.availableProviders}`);
      console.log(`  ❌ Indisponíveis: ${this.results.providers.unavailableProviders}`);

      // Mostrar detalhes de cada provider
      for (const [providerName, diagnosis] of Object.entries(this.results.providers.details)) {
        const status = diagnosis.canCreate ? '✅' : '❌';
        const authInfo = diagnosis.envConfig?.authType || 'N/A';
        console.log(`    ${status} ${providerName}: ${authInfo}`);
        
        if (diagnosis.errors.length > 0) {
          diagnosis.errors.forEach(error => {
            console.log(`      ⚠️ ${error}`);
          });
        }
      }

      // Adicionar recomendações baseadas nos providers
      this.addProviderRecommendations();

    } catch (error) {
      console.log('  ❌ Erro ao verificar providers:', error.message);
      this.results.summary.errors++;
    }
  }

  /**
   * Adiciona recomendações baseadas no estado dos providers
   */
  addProviderRecommendations() {
    const { availableProviders, details } = this.results.providers;
    
    if (availableProviders === 0) {
      this.results.summary.recommendations.push(
        'Configure credenciais para pelo menos um provider (recomendado: Gemini OAuth)'
      );
      this.results.summary.recommendations.push(
        'Execute: npm start -- --help para ver opções de configuração'
      );
    }

    // Verificar providers específicos
    for (const [providerName, diagnosis] of Object.entries(details)) {
      if (!diagnosis.canCreate && diagnosis.registered) {
        if (diagnosis.errors.some(e => e.includes('credentials'))) {
          this.results.summary.recommendations.push(
            `Configure credenciais para ${providerName} no ficheiro .env`
          );
        }
      }
    }
  }

  /**
   * Gera sumário geral do diagnóstico
   */
  generateSummary() {
    const { errors, warnings } = this.results.summary;
    
    if (errors === 0 && warnings === 0) {
      this.results.summary.status = 'healthy';
    } else if (errors === 0) {
      this.results.summary.status = 'warning';
    } else {
      this.results.summary.status = 'error';
    }

    // Adicionar recomendações gerais
    if (this.results.summary.status === 'healthy') {
      this.results.summary.recommendations.push('Sistema está funcionando corretamente!');
    }

    if (!this.results.environment.loadedFromEnv && this.results.environment.availableProviders === 0) {
      this.results.summary.recommendations.push('Crie um ficheiro .env com suas credenciais de providers');
    }
  }

  /**
   * Mostra resultados formatados
   */
  displayResults() {
    const duration = Date.now() - this.startTime;
    const { status, errors, warnings } = this.results.summary;
    
    console.log('\n' + '='.repeat(50));
    console.log('📋 SUMÁRIO DO DIAGNÓSTICO');
    console.log('='.repeat(50));
    
    // Status geral
    const statusIcon = status === 'healthy' ? '✅' : 
                      status === 'warning' ? '⚠️' : '❌';
    console.log(`\n${statusIcon} Status geral: ${status.toUpperCase()}`);
    console.log(`⏱️ Tempo de execução: ${duration}ms`);
    
    if (errors > 0) {
      console.log(`❌ Erros encontrados: ${errors}`);
    }
    
    if (warnings > 0) {
      console.log(`⚠️ Avisos: ${warnings}`);
    }

    // Recomendações
    if (this.results.summary.recommendations.length > 0) {
      console.log('\n💡 RECOMENDAÇÕES:');
      this.results.summary.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    }

    console.log('\n🔧 COMANDOS ÚTEIS:');
    console.log('  npm run db:init         - Inicializar base de dados');
    console.log('  npm start -- --test     - Testar provider padrão');
    console.log('  npm start -- --help     - Ver todas as opções');
    console.log('  npm start "mensagem"    - Enviar mensagem');
    
    console.log('\n' + '='.repeat(50));
  }

  /**
   * Executa diagnóstico rápido (apenas providers)
   */
  async runQuickDiagnostic() {
    console.log('⚡ Diagnóstico rápido...');
    
    const envStats = envManager.getStats();
    const available = envStats.available_providers;
    const total = envStats.total_providers;
    
    console.log(`📊 Providers: ${available}/${total} disponíveis`);
    
    if (available > 0) {
      console.log(`⭐ Padrão: ${envStats.default_provider}`);
      console.log('✅ Sistema pronto para uso');
    } else {
      console.log('❌ Nenhum provider configurado');
      console.log('💡 Configure credenciais no ficheiro .env');
    }
    
    return { available, total, ready: available > 0 };
  }

  /**
   * Verifica se sistema está pronto para uso
   */
  async isSystemReady() {
    try {
      const envStats = envManager.getStats();
      const hasProviders = envStats.available_providers > 0;
      
      let hasDatabase = false;
      try {
        const db = await getDatabase();
        hasDatabase = await db.testConnection();
      } catch {
        hasDatabase = false;
      }

      return {
        ready: hasProviders && hasDatabase,
        hasProviders,
        hasDatabase,
        defaultProvider: envStats.default_provider
      };
    } catch {
      return {
        ready: false,
        hasProviders: false,
        hasDatabase: false,
        defaultProvider: null
      };
    }
  }

  /**
   * Obtém informações de saúde do sistema para APIs
   */
  async getHealthInfo() {
    const systemReady = await this.isSystemReady();
    const envStats = envManager.getStats();
    
    return {
      status: systemReady.ready ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: this.results.system?.version || 'unknown',
      providers: {
        available: envStats.available_providers,
        total: envStats.total_providers,
        default: envStats.default_provider
      },
      database: systemReady.hasDatabase,
      ready: systemReady.ready
    };
  }
}

/**
 * Executa diagnóstico via CLI
 */
export async function runDiagnostic(type = 'full') {
  const diagnostic = new DiagnosticSystem();
  
  try {
    switch (type) {
      case 'quick':
        return await diagnostic.runQuickDiagnostic();
      
      case 'health':
        return await diagnostic.getHealthInfo();
      
      case 'ready':
        return await diagnostic.isSystemReady();
      
      default:
        return await diagnostic.runFullDiagnostic();
    }
  } catch (error) {
    console.error('💥 Diagnóstico falhou:', error.message);
    throw error;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const type = process.argv[2] || 'full';
  runDiagnostic(type).catch(console.error);
}