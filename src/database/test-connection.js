// Criado por Claude-Code, 2025
// Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)

import { initializeDatabase, getDatabase, closeDatabase } from './connection.js';
import { initializeLogger, log } from '../utils/logger.js';
import { BackupManager } from './backup.js';
import { MigrationManager } from './migrate.js';

/**
 * Testes de Persistência para NexoCLI_BaseGemini
 * Validação completa do sistema de base de dados
 */
class DatabaseTester {
    constructor() {
        this.db = null;
        this.logger = null;
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }

    /**
     * Executa todos os testes
     */
    async runAllTests() {
        console.log('🧪 Starting NexoCLI_BaseGemini Database Tests...\n');
        
        try {
            // Inicializar sistema
            await this.initialize();
            
            // Executar testes
            await this.runTests();
            
            // Mostrar resultados
            await this.showResults();
            
            return this.results.failed === 0;
            
        } catch (error) {
            console.error('💥 Test execution failed:', error.message);
            return false;
        } finally {
            await this.cleanup();
        }
    }

    /**
     * Inicializa o sistema para testes
     */
    async initialize() {
        console.log('🔧 Initializing test environment...');
        
        // Inicializar BD
        this.db = await initializeDatabase();
        
        // Inicializar logging
        this.logger = await initializeLogger();
        
        console.log('✅ Test environment ready\n');
    }

    /**
     * Executa todos os testes
     */
    async runTests() {
        const testSuites = [
            { name: 'Database Connection', tests: this.getConnectionTests() },
            { name: 'Schema Validation', tests: this.getSchemaTests() },
            { name: 'CRUD Operations', tests: this.getCrudTests() },
            { name: 'Logging System', tests: this.getLoggingTests() },
            { name: 'Backup System', tests: this.getBackupTests() },
            { name: 'Migration System', tests: this.getMigrationTests() },
            { name: 'Performance Tests', tests: this.getPerformanceTests() }
        ];
        
        for (const suite of testSuites) {
            console.log(`📋 Running ${suite.name} tests...`);
            
            for (const test of suite.tests) {
                await this.runTest(test);
            }
            
            console.log(''); // Linha em branco
        }
    }

    /**
     * Executa um teste individual
     */
    async runTest(test) {
        this.results.total++;
        
        try {
            const startTime = Date.now();
            await test.fn();
            const duration = Date.now() - startTime;
            
            this.results.passed++;
            console.log(`  ✅ ${test.name} (${duration}ms)`);
            
        } catch (error) {
            this.results.failed++;
            console.log(`  ❌ ${test.name}: ${error.message}`);
            
            // Log detalhado do erro
            if (this.logger) {
                await log.development(
                    'database-tester',
                    'test',
                    `Test failed: ${test.name} - ${error.message}`,
                    'Medium',
                    'src/database/test-connection.js'
                );
            }
        }
    }

    /**
     * Testes de conexão
     */
    getConnectionTests() {
        return [
            {
                name: 'Database Connection',
                fn: async () => {
                    const connected = await this.db.testConnection();
                    if (!connected) throw new Error('Database connection failed');
                }
            },
            {
                name: 'Database Info',
                fn: async () => {
                    const info = await this.db.getInfo();
                    if (!info.path) throw new Error('Database path not available');
                    if (!info.connected) throw new Error('Database not connected');
                }
            },
            {
                name: 'PRAGMA Settings',
                fn: async () => {
                    const journalMode = await this.db.get('PRAGMA journal_mode');
                    if (!journalMode) throw new Error('PRAGMA settings not applied');
                }
            }
        ];
    }

    /**
     * Testes de schema
     */
    getSchemaTests() {
        return [
            {
                name: 'Required Tables Exist',
                fn: async () => {
                    const tables = ['development_logs', 'system_config', 'chat_history', 'provider_logs', 'sessions', 'backup_logs'];
                    for (const table of tables) {
                        const exists = await this.db.tableExists(table);
                        if (!exists) throw new Error(`Table ${table} does not exist`);
                    }
                }
            },
            {
                name: 'Views Exist',
                fn: async () => {
                    const views = await this.db.all("SELECT name FROM sqlite_master WHERE type='view'");
                    const expectedViews = ['provider_stats', 'active_sessions', 'recent_dev_logs'];
                    for (const view of expectedViews) {
                        if (!views.find(v => v.name === view)) {
                            throw new Error(`View ${view} does not exist`);
                        }
                    }
                }
            },
            {
                name: 'Indexes Exist',
                fn: async () => {
                    const indexes = await this.db.all("SELECT name FROM sqlite_master WHERE type='index'");
                    if (indexes.length === 0) throw new Error('No indexes found');
                }
            }
        ];
    }

    /**
     * Testes CRUD
     */
    getCrudTests() {
        return [
            {
                name: 'Insert Development Log',
                fn: async () => {
                    const result = await this.db.run(`
                        INSERT INTO development_logs (agent_name, log_type, description, impact_level)
                        VALUES (?, ?, ?, ?)
                    `, ['test-agent', 'test', 'Test log entry', 'Low']);
                    
                    if (!result.lastID) throw new Error('Failed to insert development log');
                }
            },
            {
                name: 'Read Development Log',
                fn: async () => {
                    const log = await this.db.get(`
                        SELECT * FROM development_logs 
                        WHERE agent_name = 'test-agent' 
                        ORDER BY id DESC LIMIT 1
                    `);
                    
                    if (!log) throw new Error('Failed to read development log');
                    if (log.log_type !== 'test') throw new Error('Data corruption detected');
                }
            },
            {
                name: 'Update System Config',
                fn: async () => {
                    const result = await this.db.run(`
                        UPDATE system_config 
                        SET value = ? 
                        WHERE key = 'database_version'
                    `, ['1.0.0-test']);
                    
                    if (result.changes === 0) throw new Error('Failed to update system config');
                }
            },
            {
                name: 'Delete Test Data',
                fn: async () => {
                    await this.db.run("DELETE FROM development_logs WHERE agent_name = 'test-agent'");
                    await this.db.run("UPDATE system_config SET value = '1.0.0' WHERE key = 'database_version'");
                }
            }
        ];
    }

    /**
     * Testes do sistema de logging
     */
    getLoggingTests() {
        return [
            {
                name: 'Log Development Entry',
                fn: async () => {
                    const success = await log.development('test-logger', 'test', 'Test log entry', 'Low');
                    if (!success) throw new Error('Failed to log development entry');
                }
            },
            {
                name: 'Log Provider Entry',
                fn: async () => {
                    const success = await log.provider('test-provider', 'test-model', 'test', 'success', 100);
                    if (!success) throw new Error('Failed to log provider entry');
                }
            },
            {
                name: 'Retrieve Recent Logs',
                fn: async () => {
                    const logs = await this.logger.getRecentDevelopmentLogs(1, 10);
                    if (!Array.isArray(logs)) throw new Error('Failed to retrieve recent logs');
                }
            },
            {
                name: 'Provider Statistics',
                fn: async () => {
                    const stats = await this.logger.getProviderStats(1);
                    if (typeof stats !== 'object') throw new Error('Failed to get provider statistics');
                }
            }
        ];
    }

    /**
     * Testes do sistema de backup
     */
    getBackupTests() {
        return [
            {
                name: 'Backup Manager Initialize',
                fn: async () => {
                    const backupManager = new BackupManager();
                    await backupManager.initialize();
                }
            },
            {
                name: 'List Backups',
                fn: async () => {
                    const backupManager = new BackupManager();
                    await backupManager.initialize();
                    const backups = await backupManager.listBackups();
                    if (!Array.isArray(backups)) throw new Error('Failed to list backups');
                }
            },
            {
                name: 'Create Test Backup',
                fn: async () => {
                    const backupManager = new BackupManager();
                    await backupManager.initialize();
                    const result = await backupManager.createBackup('test');
                    if (!result.success) throw new Error('Failed to create backup');
                }
            }
        ];
    }

    /**
     * Testes do sistema de migrações
     */
    getMigrationTests() {
        return [
            {
                name: 'Migration Manager Initialize',
                fn: async () => {
                    const migrationManager = new MigrationManager();
                    await migrationManager.initialize();
                }
            },
            {
                name: 'Get Migration Status',
                fn: async () => {
                    const migrationManager = new MigrationManager();
                    await migrationManager.initialize();
                    const status = await migrationManager.getStatus();
                    if (typeof status.available !== 'number') throw new Error('Invalid migration status');
                }
            },
            {
                name: 'Verify Migration Integrity',
                fn: async () => {
                    const migrationManager = new MigrationManager();
                    await migrationManager.initialize();
                    const integrity = await migrationManager.verifyIntegrity();
                    if (typeof integrity.valid !== 'boolean') throw new Error('Invalid integrity check');
                }
            }
        ];
    }

    /**
     * Testes de performance
     */
    getPerformanceTests() {
        return [
            {
                name: 'Bulk Insert Performance',
                fn: async () => {
                    const startTime = Date.now();
                    const queries = [];
                    
                    for (let i = 0; i < 100; i++) {
                        queries.push({
                            query: `INSERT INTO development_logs (agent_name, log_type, description, impact_level) VALUES (?, ?, ?, ?)`,
                            params: [`perf-test-${i}`, 'performance', `Performance test entry ${i}`, 'Low']
                        });
                    }
                    
                    await this.db.transaction(queries);
                    const duration = Date.now() - startTime;
                    
                    if (duration > 5000) throw new Error(`Bulk insert too slow: ${duration}ms`);
                    
                    // Limpeza
                    await this.db.run("DELETE FROM development_logs WHERE agent_name LIKE 'perf-test-%'");
                }
            },
            {
                name: 'Query Performance',
                fn: async () => {
                    const startTime = Date.now();
                    
                    await this.db.all(`
                        SELECT * FROM development_logs 
                        WHERE timestamp >= datetime('now', '-1 day')
                        ORDER BY timestamp DESC
                        LIMIT 100
                    `);
                    
                    const duration = Date.now() - startTime;
                    if (duration > 1000) throw new Error(`Query too slow: ${duration}ms`);
                }
            }
        ];
    }

    /**
     * Mostra os resultados dos testes
     */
    async showResults() {
        console.log('📊 Test Results:');
        console.log(`Total Tests: ${this.results.total}`);
        console.log(`Passed: ${this.results.passed}`);
        console.log(`Failed: ${this.results.failed}`);
        console.log(`Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
        
        if (this.results.failed === 0) {
            console.log('\n🎉 All tests passed! Database system is ready.');
        } else {
            console.log('\n❌ Some tests failed. Check the logs for details.');
        }
    }

    /**
     * Limpeza após testes
     */
    async cleanup() {
        try {
            await closeDatabase();
            console.log('\n🧹 Test cleanup completed');
        } catch (error) {
            console.error('Cleanup failed:', error.message);
        }
    }
}

/**
 * Função principal
 */
async function main() {
    const tester = new DatabaseTester();
    const success = await tester.runAllTests();
    
    process.exit(success ? 0 : 1);
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export default DatabaseTester;
export { DatabaseTester };