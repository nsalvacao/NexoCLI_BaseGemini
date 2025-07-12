// Criado por Claude-Code, 2025
// Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)

import { getDatabase } from './connection.js';
import { log } from '../utils/logger.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Sistema de Migrações para NexoCLI_BaseGemini
 * Gestão de versões da estrutura da base de dados
 */
class MigrationManager {
    constructor() {
        this.db = null;
        this.migrationsPath = path.join(__dirname, 'migrations');
    }

    /**
     * Inicializa o sistema de migrações
     */
    async initialize() {
        try {
            this.db = getDatabase();
            
            // Garantir que a tabela de migrações existe
            await this.createMigrationsTable();
            
            console.log('✅ Migration system initialized');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize migration system:', error.message);
            throw error;
        }
    }

    /**
     * Cria a tabela de controlo de migrações
     */
    async createMigrationsTable() {
        await this.db.run(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                version VARCHAR(20) NOT NULL UNIQUE,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                rollback_sql TEXT,
                checksum TEXT
            )
        `);
    }

    /**
     * Obtém lista de migrações disponíveis
     */
    async getAvailableMigrations() {
        try {
            const files = await fs.readdir(this.migrationsPath);
            const migrationFiles = files
                .filter(file => file.endsWith('.sql'))
                .sort();
            
            const migrations = [];
            
            for (const file of migrationFiles) {
                const filePath = path.join(this.migrationsPath, file);
                const content = await fs.readFile(filePath, 'utf8');
                
                // Extrair metadados do ficheiro
                const versionMatch = file.match(/^(\d+)_(.+)\.sql$/);
                if (versionMatch) {
                    const version = versionMatch[1];
                    const name = versionMatch[2];
                    
                    // Extrair descrição do comentário
                    const descriptionMatch = content.match(/-- (.+)/);
                    const description = descriptionMatch ? descriptionMatch[1] : name;
                    
                    migrations.push({
                        version,
                        name,
                        description,
                        filename: file,
                        path: filePath,
                        content,
                        checksum: this.calculateChecksum(content)
                    });
                }
            }
            
            return migrations;
            
        } catch (error) {
            console.error('Failed to get available migrations:', error.message);
            return [];
        }
    }

    /**
     * Obtém lista de migrações já aplicadas
     */
    async getAppliedMigrations() {
        try {
            const migrations = await this.db.all(`
                SELECT * FROM migrations 
                ORDER BY version
            `);
            
            return migrations || [];
            
        } catch (error) {
            console.error('Failed to get applied migrations:', error.message);
            return [];
        }
    }

    /**
     * Obtém migrações pendentes
     */
    async getPendingMigrations() {
        const available = await this.getAvailableMigrations();
        const applied = await this.getAppliedMigrations();
        
        const appliedVersions = new Set(applied.map(m => m.version));
        
        return available.filter(migration => !appliedVersions.has(migration.version));
    }

    /**
     * Executa uma migração específica
     */
    async runMigration(migration) {
        const startTime = Date.now();
        
        try {
            console.log(`📦 Running migration ${migration.version}: ${migration.name}`);
            
            // Verificar se a migração já foi aplicada
            const existing = await this.db.get(`
                SELECT * FROM migrations WHERE version = ?
            `, [migration.version]);
            
            if (existing) {
                console.log(`⚠️  Migration ${migration.version} already applied`);
                return false;
            }
            
            // Executar migração numa transação
            await this.db.run('BEGIN TRANSACTION');
            
            try {
                // Dividir o SQL em statements individuais
                const statements = migration.content
                    .split(';')
                    .map(stmt => stmt.trim())
                    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
                
                // Executar cada statement
                for (const statement of statements) {
                    if (statement.toLowerCase().includes('insert') && 
                        statement.toLowerCase().includes('migrations')) {
                        // Pular INSERTs na tabela migrations (serão feitos depois)
                        continue;
                    }
                    
                    await this.db.run(statement);
                }
                
                // Registar a migração como aplicada
                await this.db.run(`
                    INSERT INTO migrations (version, name, description, checksum)
                    VALUES (?, ?, ?, ?)
                `, [migration.version, migration.name, migration.description, migration.checksum]);
                
                await this.db.run('COMMIT');
                
                const duration = Date.now() - startTime;
                console.log(`✅ Migration ${migration.version} completed in ${duration}ms`);
                
                // Log da migração
                await log.development(
                    'migration-manager',
                    'migration',
                    `Migration ${migration.version} applied: ${migration.name}`,
                    'Medium',
                    migration.path
                );
                
                return true;
                
            } catch (error) {
                await this.db.run('ROLLBACK');
                throw error;
            }
            
        } catch (error) {
            console.error(`❌ Migration ${migration.version} failed:`, error.message);
            
            // Log da falha
            await log.development(
                'migration-manager',
                'migration',
                `Migration ${migration.version} failed: ${error.message}`,
                'Critical',
                migration.path
            );
            
            throw error;
        }
    }

    /**
     * Executa todas as migrações pendentes
     */
    async runPendingMigrations() {
        const pending = await this.getPendingMigrations();
        
        if (pending.length === 0) {
            console.log('✅ No pending migrations');
            return true;
        }
        
        console.log(`📦 Found ${pending.length} pending migrations`);
        
        let applied = 0;
        
        for (const migration of pending) {
            try {
                const result = await this.runMigration(migration);
                if (result) {
                    applied++;
                }
            } catch (error) {
                console.error(`💥 Migration failed, stopping: ${error.message}`);
                break;
            }
        }
        
        console.log(`✅ Applied ${applied}/${pending.length} migrations`);
        return applied === pending.length;
    }

    /**
     * Faz rollback de uma migração
     */
    async rollbackMigration(version) {
        try {
            console.log(`🔄 Rolling back migration ${version}`);
            
            // Obter informações da migração
            const migration = await this.db.get(`
                SELECT * FROM migrations WHERE version = ?
            `, [version]);
            
            if (!migration) {
                console.log(`⚠️  Migration ${version} not found`);
                return false;
            }
            
            if (!migration.rollback_sql) {
                console.log(`⚠️  No rollback SQL defined for migration ${version}`);
                return false;
            }
            
            // Executar rollback numa transação
            await this.db.run('BEGIN TRANSACTION');
            
            try {
                // Executar SQL de rollback
                const statements = migration.rollback_sql
                    .split(';')
                    .map(stmt => stmt.trim())
                    .filter(stmt => stmt.length > 0);
                
                for (const statement of statements) {
                    await this.db.run(statement);
                }
                
                // Remover registo da migração
                await this.db.run(`
                    DELETE FROM migrations WHERE version = ?
                `, [version]);
                
                await this.db.run('COMMIT');
                
                console.log(`✅ Migration ${version} rolled back successfully`);
                
                // Log do rollback
                await log.development(
                    'migration-manager',
                    'rollback',
                    `Migration ${version} rolled back: ${migration.name}`,
                    'High',
                    null
                );
                
                return true;
                
            } catch (error) {
                await this.db.run('ROLLBACK');
                throw error;
            }
            
        } catch (error) {
            console.error(`❌ Rollback failed:`, error.message);
            throw error;
        }
    }

    /**
     * Obtém estado atual das migrações
     */
    async getStatus() {
        const available = await this.getAvailableMigrations();
        const applied = await this.getAppliedMigrations();
        const pending = await this.getPendingMigrations();
        
        return {
            available: available.length,
            applied: applied.length,
            pending: pending.length,
            migrations: {
                available,
                applied,
                pending
            }
        };
    }

    /**
     * Calcula checksum de uma migração
     */
    calculateChecksum(content) {
        // Implementação simples de hash
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(16);
    }

    /**
     * Verifica integridade das migrações
     */
    async verifyIntegrity() {
        const applied = await this.getAppliedMigrations();
        const available = await this.getAvailableMigrations();
        
        const issues = [];
        
        for (const appliedMigration of applied) {
            const availableMigration = available.find(m => m.version === appliedMigration.version);
            
            if (!availableMigration) {
                issues.push({
                    type: 'missing_file',
                    version: appliedMigration.version,
                    message: `Migration ${appliedMigration.version} is applied but file not found`
                });
                continue;
            }
            
            if (appliedMigration.checksum && 
                availableMigration.checksum !== appliedMigration.checksum) {
                issues.push({
                    type: 'checksum_mismatch',
                    version: appliedMigration.version,
                    message: `Migration ${appliedMigration.version} checksum mismatch`
                });
            }
        }
        
        return {
            valid: issues.length === 0,
            issues
        };
    }
}

/**
 * Função principal para execução via CLI
 */
async function main() {
    const migrationManager = new MigrationManager();
    
    try {
        await migrationManager.initialize();
        
        const args = process.argv.slice(2);
        const command = args[0];
        
        switch (command) {
            case 'run':
            case 'up':
                await migrationManager.runPendingMigrations();
                break;
                
            case 'status':
                const status = await migrationManager.getStatus();
                console.log('\n📊 Migration Status:');
                console.log(`Available: ${status.available}`);
                console.log(`Applied: ${status.applied}`);
                console.log(`Pending: ${status.pending}`);
                
                if (status.migrations.pending.length > 0) {
                    console.log('\n📋 Pending Migrations:');
                    status.migrations.pending.forEach(m => {
                        console.log(`  • ${m.version}: ${m.name}`);
                    });
                }
                break;
                
            case 'rollback':
                const version = args[1];
                if (!version) {
                    console.error('Please specify migration version to rollback');
                    process.exit(1);
                }
                await migrationManager.rollbackMigration(version);
                break;
                
            case 'verify':
                const integrity = await migrationManager.verifyIntegrity();
                if (integrity.valid) {
                    console.log('✅ All migrations are valid');
                } else {
                    console.log('❌ Migration integrity issues found:');
                    integrity.issues.forEach(issue => {
                        console.log(`  • ${issue.type}: ${issue.message}`);
                    });
                }
                break;
                
            default:
                console.log('Usage: node migrate.js [command]');
                console.log('Commands:');
                console.log('  run       - Run pending migrations');
                console.log('  status    - Show migration status');
                console.log('  rollback  - Rollback specific migration');
                console.log('  verify    - Verify migration integrity');
                break;
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('Migration operation failed:', error.message);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export default MigrationManager;
export { MigrationManager };