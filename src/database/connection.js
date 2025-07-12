// Criado por Claude-Code, 2025
// Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)

import sqlite3 from 'sqlite3';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * SQLite Database Connection Manager
 * Gestão centralizada de conexões à base de dados
 */
class DatabaseConnection {
    constructor() {
        this.db = null;
        this.dbPath = null;
        this.isConnected = false;
        
        // Configurações padrão
        this.config = {
            dbPath: process.env.DATABASE_PATH || './db/nexocli.db',
            timeout: 30000, // 30 segundos
            verbose: process.env.NODE_ENV === 'development'
        };
        
        // Ativar modo verbose se em desenvolvimento
        if (this.config.verbose) {
            sqlite3.verbose();
        }
    }

    /**
     * Inicializa a conexão com a base de dados
     */
    async initialize() {
        try {
            // Garantir que o diretório da BD existe
            await this.ensureDbDirectory();
            
            // Estabelecer conexão
            await this.connect();
            
            // Aplicar configurações de performance
            await this.applyPragmaSettings();
            
            console.log('✅ Database connection initialized successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize database connection:', error.message);
            throw error;
        }
    }

    /**
     * Conecta à base de dados SQLite
     */
    async connect() {
        return new Promise((resolve, reject) => {
            const absolutePath = path.resolve(this.config.dbPath);
            this.dbPath = absolutePath;
            
            this.db = new sqlite3.Database(absolutePath, (err) => {
                if (err) {
                    console.error('Database connection error:', err.message);
                    reject(err);
                    return;
                }
                
                this.isConnected = true;
                console.log(`📊 Connected to SQLite database: ${absolutePath}`);
                resolve();
            });
        });
    }

    /**
     * Garante que o diretório da base de dados existe
     */
    async ensureDbDirectory() {
        const dbDir = path.dirname(this.config.dbPath);
        
        try {
            await fs.access(dbDir);
        } catch {
            console.log(`📁 Creating database directory: ${dbDir}`);
            await fs.mkdir(dbDir, { recursive: true });
        }
    }

    /**
     * Aplica configurações PRAGMA para melhor performance
     */
    async applyPragmaSettings() {
        const pragmaSettings = [
            'PRAGMA journal_mode = WAL',
            'PRAGMA synchronous = NORMAL',
            'PRAGMA cache_size = 10000',
            'PRAGMA temp_store = MEMORY',
            'PRAGMA mmap_size = 268435456', // 256MB
            'PRAGMA foreign_keys = ON'
        ];

        for (const pragma of pragmaSettings) {
            await this.run(pragma);
        }
        
        console.log('⚡ Database performance settings applied');
    }

    /**
     * Executa uma query que não retorna resultados
     */
    async run(query, params = []) {
        if (!this.isConnected) {
            throw new Error('Database not connected');
        }

        return new Promise((resolve, reject) => {
            this.db.run(query, params, function(err) {
                if (err) {
                    console.error('Database run error:', err.message);
                    console.error('Query:', query);
                    reject(err);
                    return;
                }
                resolve({
                    lastID: this.lastID,
                    changes: this.changes
                });
            });
        });
    }

    /**
     * Executa uma query que retorna uma única linha
     */
    async get(query, params = []) {
        if (!this.isConnected) {
            throw new Error('Database not connected');
        }

        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err) {
                    console.error('Database get error:', err.message);
                    console.error('Query:', query);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }

    /**
     * Executa uma query que retorna múltiplas linhas
     */
    async all(query, params = []) {
        if (!this.isConnected) {
            throw new Error('Database not connected');
        }

        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    console.error('Database all error:', err.message);
                    console.error('Query:', query);
                    reject(err);
                    return;
                }
                resolve(rows || []);
            });
        });
    }

    /**
     * Executa múltiplas queries numa transação
     */
    async transaction(queries) {
        if (!this.isConnected) {
            throw new Error('Database not connected');
        }

        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run('BEGIN TRANSACTION');
                
                let completed = 0;
                let hasError = false;
                
                const results = [];
                
                for (let i = 0; i < queries.length; i++) {
                    const { query, params = [] } = queries[i];
                    
                    this.db.run(query, params, function(err) {
                        if (err && !hasError) {
                            hasError = true;
                            console.error('Transaction error:', err.message);
                            this.db.run('ROLLBACK');
                            reject(err);
                            return;
                        }
                        
                        if (!hasError) {
                            results.push({
                                lastID: this.lastID,
                                changes: this.changes
                            });
                            
                            completed++;
                            
                            if (completed === queries.length) {
                                this.db.run('COMMIT', (err) => {
                                    if (err) {
                                        console.error('Commit error:', err.message);
                                        reject(err);
                                        return;
                                    }
                                    resolve(results);
                                });
                            }
                        }
                    });
                }
            });
        });
    }

    /**
     * Executa o schema inicial da base de dados
     */
    async executeSchema() {
        try {
            const schemaPath = path.join(__dirname, 'schema.sql');
            const schemaSQL = await fs.readFile(schemaPath, 'utf8');
            
            // Separar as queries do schema
            const queries = schemaSQL
                .split(';')
                .map(q => q.trim())
                .filter(q => q.length > 0 && !q.startsWith('--'));
            
            console.log(`📋 Executing schema with ${queries.length} queries...`);
            
            // Executar cada query do schema
            for (const query of queries) {
                try {
                    await this.run(query);
                } catch (error) {
                    console.error(`❌ Failed to execute query: ${query.substring(0, 100)}...`);
                    throw error;
                }
            }
            
            console.log('✅ Database schema executed successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to execute schema:', error.message);
            throw error;
        }
    }

    /**
     * Verifica se uma tabela existe
     */
    async tableExists(tableName) {
        const query = `
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name=?
        `;
        
        const result = await this.get(query, [tableName]);
        return !!result;
    }

    /**
     * Obtém informações sobre a base de dados
     */
    async getInfo() {
        const info = {
            path: this.dbPath,
            connected: this.isConnected,
            tables: [],
            size: null,
            pragma: {}
        };
        
        if (this.isConnected) {
            // Listar tabelas
            const tables = await this.all(`
                SELECT name FROM sqlite_master 
                WHERE type='table' 
                ORDER BY name
            `);
            info.tables = tables.map(t => t.name);
            
            // Obter tamanho do ficheiro
            try {
                const stats = await fs.stat(this.dbPath);
                info.size = stats.size;
            } catch (error) {
                console.warn('Could not get database file size:', error.message);
            }
            
            // Obter configurações PRAGMA
            const pragmaQueries = [
                'PRAGMA journal_mode',
                'PRAGMA synchronous',
                'PRAGMA cache_size',
                'PRAGMA temp_store'
            ];
            
            for (const pragma of pragmaQueries) {
                try {
                    const result = await this.get(pragma);
                    const key = pragma.replace('PRAGMA ', '');
                    info.pragma[key] = result ? Object.values(result)[0] : null;
                } catch (error) {
                    console.warn(`Could not get ${pragma}:`, error.message);
                }
            }
        }
        
        return info;
    }

    /**
     * Fecha a conexão com a base de dados
     */
    async close() {
        if (this.db && this.isConnected) {
            return new Promise((resolve, reject) => {
                this.db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                        reject(err);
                        return;
                    }
                    
                    this.isConnected = false;
                    console.log('🔒 Database connection closed');
                    resolve();
                });
            });
        }
    }

    /**
     * Executa uma query de teste para verificar conectividade
     */
    async testConnection() {
        try {
            const result = await this.get('SELECT 1 as test');
            return result && result.test === 1;
        } catch (error) {
            console.error('Connection test failed:', error.message);
            return false;
        }
    }
}

// Singleton instance
let dbInstance = null;

/**
 * Obtém a instância singleton da conexão de base de dados
 */
export function getDatabase() {
    if (!dbInstance) {
        dbInstance = new DatabaseConnection();
    }
    return dbInstance;
}

/**
 * Inicializa a base de dados (conexão + schema)
 */
export async function initializeDatabase() {
    const db = getDatabase();
    
    try {
        await db.initialize();
        await db.executeSchema();
        
        console.log('🎉 Database fully initialized and ready');
        return db;
        
    } catch (error) {
        console.error('💥 Database initialization failed:', error.message);
        throw error;
    }
}

/**
 * Fecha a conexão da base de dados
 */
export async function closeDatabase() {
    if (dbInstance) {
        await dbInstance.close();
        dbInstance = null;
    }
}

export default DatabaseConnection;