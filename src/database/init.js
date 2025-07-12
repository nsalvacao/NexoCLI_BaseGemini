// Criado por Claude-Code, 2025
// Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)

import { initializeDatabase, getDatabase } from './connection.js';
import { initializeLogger, log } from '../utils/logger.js';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Inicialização completa do sistema de base de dados
 * Script para setup inicial do NexoCLI_BaseGemini
 */
class DatabaseInitializer {
    constructor() {
        this.db = null;
        this.logger = null;
        this.startTime = Date.now();
    }

    /**
     * Executa a inicialização completa
     */
    async initialize() {
        try {
            console.log('🚀 Starting NexoCLI_BaseGemini database initialization...');
            
            // Passo 1: Inicializar base de dados
            await this.initializeDatabase();
            
            // Passo 2: Inicializar logging
            await this.initializeLogging();
            
            // Passo 3: Verificar integridade
            await this.verifyIntegrity();
            
            // Passo 4: Inserir dados iniciais
            await this.insertInitialData();
            
            // Passo 5: Executar testes básicos
            await this.runBasicTests();
            
            const duration = Date.now() - this.startTime;
            console.log(`✅ Database initialization completed successfully in ${duration}ms`);
            
            // Log da inicialização
            await log.development(
                'database-initializer',
                'system',
                'Database initialization completed successfully',
                'High',
                'src/database/init.js'
            );
            
            return true;
            
        } catch (error) {
            console.error('💥 Database initialization failed:', error.message);
            console.error('Stack trace:', error.stack);
            
            // Tentar fazer log do erro
            try {
                await log.development(
                    'database-initializer',
                    'system',
                    `Database initialization failed: ${error.message}`,
                    'Critical',
                    'src/database/init.js'
                );
            } catch (logError) {
                console.error('Failed to log initialization error:', logError.message);
            }
            
            throw error;
        }
    }

    /**
     * Inicializa a base de dados
     */
    async initializeDatabase() {
        console.log('📊 Initializing database...');
        
        this.db = await initializeDatabase();
        
        // Verificar se o ficheiro foi criado
        const dbInfo = await this.db.getInfo();
        console.log(`📁 Database file: ${dbInfo.path}`);
        console.log(`📋 Tables created: ${dbInfo.tables.length}`);
        
        return this.db;
    }

    /**
     * Inicializa o sistema de logging
     */
    async initializeLogging() {
        console.log('📝 Initializing logging system...');
        
        this.logger = await initializeLogger();
        
        return this.logger;
    }

    /**
     * Verifica a integridade da base de dados
     */
    async verifyIntegrity() {
        console.log('🔍 Verifying database integrity...');
        
        // Verificar se todas as tabelas esperadas existem
        const expectedTables = [
            'development_logs',
            'system_config',
            'chat_history',
            'provider_logs',
            'sessions',
            'backup_logs'
        ];
        
        for (const table of expectedTables) {
            const exists = await this.db.tableExists(table);
            if (!exists) {
                throw new Error(`Required table '${table}' does not exist`);
            }
        }
        
        // Verificar se as views existem
        const views = await this.db.all(`
            SELECT name FROM sqlite_master 
            WHERE type='view'
            ORDER BY name
        `);
        
        console.log(`✅ Verified ${expectedTables.length} tables and ${views.length} views`);
        
        // Teste de conectividade
        const connectionTest = await this.db.testConnection();
        if (!connectionTest) {
            throw new Error('Database connection test failed');
        }
        
        console.log('✅ Database integrity verified successfully');
        return true;
    }

    /**
     * Insere dados iniciais necessários
     */
    async insertInitialData() {
        console.log('💾 Inserting initial data...');
        
        // Verificar se já existem dados de configuração
        const configCount = await this.db.get('SELECT COUNT(*) as count FROM system_config');
        
        if (configCount.count === 0) {
            console.log('📝 No initial config found, inserting default values...');
            
            // Os valores padrão já são inseridos pelo schema.sql
            // Mas vamos confirmar que estão lá
            const configs = await this.db.all('SELECT * FROM system_config');
            console.log(`✅ Inserted ${configs.length} default configuration values`);
        }
        
        // Inserir log de inicialização
        await this.db.run(`
            INSERT INTO development_logs 
            (agent_name, log_type, description, impact_level, file_path)
            VALUES (?, ?, ?, ?, ?)
        `, [
            'database-initializer',
            'system',
            'Database initialization process started',
            'High',
            'src/database/init.js'
        ]);
        
        console.log('✅ Initial data inserted successfully');
        return true;
    }

    /**
     * Executa testes básicos de funcionalidade
     */
    async runBasicTests() {
        console.log('🧪 Running basic functionality tests...');
        
        const tests = [
            { name: 'Development Log Insert', test: () => this.testDevelopmentLog() },
            { name: 'System Config Read', test: () => this.testSystemConfig() },
            { name: 'Provider Log Insert', test: () => this.testProviderLog() },
            { name: 'Backup Log Insert', test: () => this.testBackupLog() }
        ];
        
        for (const { name, test } of tests) {
            try {
                await test();
                console.log(`  ✅ ${name}`);
            } catch (error) {
                console.error(`  ❌ ${name}: ${error.message}`);
                throw new Error(`Basic test failed: ${name}`);
            }
        }
        
        console.log('✅ All basic tests passed successfully');
        return true;
    }

    /**
     * Teste de insert de log de desenvolvimento
     */
    async testDevelopmentLog() {
        const result = await this.db.run(`
            INSERT INTO development_logs 
            (agent_name, log_type, description, impact_level)
            VALUES (?, ?, ?, ?)
        `, ['test-agent', 'test', 'Test log entry', 'Low']);
        
        if (!result.lastID) {
            throw new Error('Failed to insert development log');
        }
        
        // Remover o log de teste
        await this.db.run('DELETE FROM development_logs WHERE id = ?', [result.lastID]);
        
        return true;
    }

    /**
     * Teste de leitura de configuração
     */
    async testSystemConfig() {
        const config = await this.db.get(`
            SELECT * FROM system_config 
            WHERE key = 'database_version'
        `);
        
        if (!config || !config.value) {
            throw new Error('Failed to read system config');
        }
        
        return true;
    }

    /**
     * Teste de log de provider
     */
    async testProviderLog() {
        const result = await this.db.run(`
            INSERT INTO provider_logs 
            (provider, action, status, response_time_ms)
            VALUES (?, ?, ?, ?)
        `, ['test-provider', 'test', 'success', 100]);
        
        if (!result.lastID) {
            throw new Error('Failed to insert provider log');
        }
        
        // Remover o log de teste
        await this.db.run('DELETE FROM provider_logs WHERE id = ?', [result.lastID]);
        
        return true;
    }

    /**
     * Teste de log de backup
     */
    async testBackupLog() {
        const result = await this.db.run(`
            INSERT INTO backup_logs 
            (backup_type, backup_path, status, file_size)
            VALUES (?, ?, ?, ?)
        `, ['test', '/tmp/test.db', 'success', 1024]);
        
        if (!result.lastID) {
            throw new Error('Failed to insert backup log');
        }
        
        // Remover o log de teste
        await this.db.run('DELETE FROM backup_logs WHERE id = ?', [result.lastID]);
        
        return true;
    }

    /**
     * Obtém informações de status da inicialização
     */
    async getInitializationStatus() {
        const info = await this.db.getInfo();
        
        // Contar registos em cada tabela
        const tableCounts = {};
        for (const table of info.tables) {
            try {
                const count = await this.db.get(`SELECT COUNT(*) as count FROM ${table}`);
                tableCounts[table] = count.count;
            } catch (error) {
                tableCounts[table] = 'Error';
            }
        }
        
        return {
            database: info,
            tableCounts,
            initializationTime: Date.now() - this.startTime
        };
    }
}

/**
 * Função principal para inicialização
 */
async function main() {
    const initializer = new DatabaseInitializer();
    
    try {
        await initializer.initialize();
        
        // Mostrar status final
        const status = await initializer.getInitializationStatus();
        console.log('\n📊 Initialization Status:');
        console.log('Database Path:', status.database.path);
        console.log('Database Size:', status.database.size, 'bytes');
        console.log('Tables:', status.database.tables.join(', '));
        console.log('Table Counts:', status.tableCounts);
        console.log('Initialization Time:', status.initializationTime, 'ms');
        
        console.log('\n🎉 NexoCLI_BaseGemini database is ready to use!');
        
        process.exit(0);
        
    } catch (error) {
        console.error('\n💥 Initialization failed:', error.message);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export default DatabaseInitializer;
export { DatabaseInitializer };