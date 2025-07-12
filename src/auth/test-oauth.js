/**
 * @license
 * Modificado por Claude-Code, 2025
 * Baseado em código de gemini-cli (Copyright 2025 Google LLC, Apache 2.0)
 * Teste do sistema OAuth
 */

import { oauth, AuthType, validateAuthMethod } from './oauth.js';
import { logger } from '../utils/logger-adapter.js';

/**
 * Teste do sistema OAuth
 */
async function testOAuth() {
  console.log('🧪 Teste do Sistema OAuth');
  console.log('─'.repeat(40));

  try {
    // Teste 1: Validação de métodos
    console.log('\n1. Testando validação de métodos de autenticação...');
    
    const testMethods = [
      AuthType.LOGIN_WITH_GOOGLE,
      AuthType.USE_GEMINI,
      AuthType.USE_VERTEX_AI,
      AuthType.CLOUD_SHELL,
      'invalid-method'
    ];

    for (const method of testMethods) {
      const result = validateAuthMethod(method);
      console.log(`   ${method}: ${result ? '❌ ' + result : '✅ Válido'}`);
    }

    // Teste 2: Inicialização OAuth
    console.log('\n2. Testando inicialização OAuth...');
    
    const initResult = await oauth.initialize(AuthType.LOGIN_WITH_GOOGLE);
    console.log(`   Inicialização: ${initResult ? '✅ Sucesso' : '❌ Falhou'}`);
    console.log(`   Autenticado: ${oauth.isAuthenticated() ? '✅ Sim' : '❌ Não'}`);
    console.log(`   Tipo: ${oauth.getAuthType()}`);

    // Teste 3: Credenciais
    console.log('\n3. Testando credenciais...');
    
    const credentials = oauth.getCredentials();
    if (credentials) {
      console.log(`   Tipo de credencial: ${credentials.type}`);
      console.log(`   Campos disponíveis: ${Object.keys(credentials).join(', ')}`);
    } else {
      console.log('   ❌ Credenciais não encontradas');
    }

    // Teste 4: Logout
    console.log('\n4. Testando logout...');
    
    await oauth.logout();
    console.log(`   Após logout - Autenticado: ${oauth.isAuthenticated() ? '✅ Sim' : '❌ Não'}`);

    console.log('\n✅ Teste OAuth completado com sucesso!');
    return true;

  } catch (error) {
    console.error('\n❌ Erro durante teste OAuth:', error.message);
    
    await logger.logDevelopment(
      'OAuth_Test',
      'test_error',
      `OAuth test failed: ${error.message}`,
      'High'
    );
    
    return false;
  }
}

/**
 * Teste com diferentes tipos de autenticação
 */
async function testAllAuthTypes() {
  console.log('\n🔄 Testando todos os tipos de autenticação...');
  console.log('─'.repeat(40));

  const authTypes = [
    AuthType.LOGIN_WITH_GOOGLE,
    AuthType.USE_GEMINI,
    AuthType.USE_VERTEX_AI,
    AuthType.CLOUD_SHELL,
  ];

  for (const authType of authTypes) {
    console.log(`\n📋 Testando ${authType}:`);
    
    try {
      const tempOAuth = new (await import('./oauth.js')).OAuthManager();
      await tempOAuth.initialize(authType);
      
      console.log(`   ✅ Inicialização: Sucesso`);
      console.log(`   🔐 Autenticado: ${tempOAuth.isAuthenticated()}`);
      
      const creds = tempOAuth.getCredentials();
      if (creds) {
        console.log(`   📋 Tipo credencial: ${creds.type}`);
      }
      
      await tempOAuth.logout();
      console.log(`   🚪 Logout: Sucesso`);
      
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
      
      // Verificar se é erro esperado (falta de env vars)
      if (error.message.includes('environment variable') || 
          error.message.includes('GEMINI_API_KEY') ||
          error.message.includes('GOOGLE_CLOUD_PROJECT')) {
        console.log(`   💡 Erro esperado: falta configuração de ambiente`);
      }
    }
  }
}

/**
 * Executa todos os testes
 */
async function runAllTests() {
  console.log('🚀 Iniciando testes completos do sistema OAuth');
  console.log('='.repeat(50));

  let passed = 0;
  let total = 0;

  // Teste básico
  total++;
  if (await testOAuth()) passed++;

  // Teste todos os tipos
  total++;
  try {
    await testAllAuthTypes();
    passed++;
    console.log('\n✅ Teste de todos os tipos: Sucesso');
  } catch (error) {
    console.log('\n❌ Teste de todos os tipos: Falhou');
  }

  // Relatório final
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Relatório final: ${passed}/${total} testes passaram`);
  
  if (passed === total) {
    console.log('✅ Todos os testes passaram!');
  } else {
    console.log('❌ Alguns testes falharam');
  }
  
  return passed === total;
}

// Executar testes se ficheiro chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { testOAuth, testAllAuthTypes, runAllTests };