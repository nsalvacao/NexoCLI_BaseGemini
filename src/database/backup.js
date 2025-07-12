// Criado por Claude-Code, 2025
// Parte do NexoCLI_BaseGemini - Fork de gemini-cli (Google LLC, Apache 2.0)

import { getDatabase } from './connection.js';
import { log } from '../utils/logger.js';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Sistema de Backup Automático para NexoCLI_BaseGemini
 * Gestão de backups da base de dados SQLite
 */
class BackupManager {
    constructor() {
        this.db = null;
        this.config = {
            backupDirectory: './db/backups',
            retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS) || 7,
            enabled: process.env.BACKUP_ENABLED !== 'false',
            maxBackups: 50 // Limite máximo de backups
        };
    }

    /**
     * Inicializa o sistema de backup
     */
    async initialize() {
        try {
            this.db = getDatabase();
            
            // Garantir que o diretório de backups existe
            await this.ensureBackupDirectory();
            
            console.log('✅ Backup system initialized successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize backup system:', error.message);
            throw error;
        }
    }

    /**
     * Garante que o diretório de backups existe
     */
    async ensureBackupDirectory() {
        try {
            await fs.access(this.config.backupDirectory);
        } catch {
            console.log(`📁 Creating backup directory: ${this.config.backupDirectory}`);
            await fs.mkdir(this.config.backupDirectory, { recursive: true });
        }
    }

    /**
     * Executa backup manual
     */
    async createBackup(type = 'manual') {
        if (!this.config.enabled) {
            console.log('⚠️  Backup is disabled');
            return false;
        }

        const startTime = Date.now();
        let backupPath = null;
        
        try {
            console.log(`🗄️  Starting ${type} backup...`);
            
            // Gerar nome do ficheiro de backup
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `nexocli-backup-${timestamp}.db`;
            backupPath = path.join(this.config.backupDirectory, filename);
            
            // Executar backup
            await this.performBackup(backupPath);
            
            // Obter informações do backup
            const stats = await fs.stat(backupPath);
            const duration = Date.now() - startTime;
            
            console.log(`✅ Backup completed successfully`);
            console.log(`📁 Backup file: ${backupPath}`);
            console.log(`📊 File size: ${this.formatBytes(stats.size)}`);
            console.log(`⏱️  Duration: ${duration}ms`);
            
            // Registar o backup
            await this.logBackup(type, backupPath, 'success', stats.size, duration);
            
            // Limpeza de backups antigos
            await this.cleanupOldBackups();
            
            return {
                success: true,
                path: backupPath,
                size: stats.size,
                duration
            };
            
        } catch (error) {
            console.error(`❌ Backup failed: ${error.message}`);
            
            // Registar falha
            await this.logBackup(type, backupPath || 'unknown', 'error', null, Date.now() - startTime, error.message);
            
            throw error;
        }
    }

    /**
     * Executa o backup físico da base de dados
     */
    async performBackup(backupPath) {
        // Método 1: Backup usando SQLite BACKUP API (mais seguro)
        if (this.db && this.db.db) {
            return new Promise((resolve, reject) => {
                const sqlite3 = require('sqlite3').verbose();
                const backupDb = new sqlite3.Database(backupPath, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    // Usar backup API do SQLite
                    const backup = this.db.db.backup(backupDb);
                    
                    backup.step(-1, (err) => {
                        backup.finish((err) => {
                            backupDb.close((err) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve();
                            });
                        });
                    });
                });
            });
        }
        
        // Método 2: Fallback - cópia de ficheiro simples
        const dbInfo = await this.db.getInfo();
        if (dbInfo.path) {
            await fs.copyFile(dbInfo.path, backupPath);
        } else {
            throw new Error('Database file path not available');
        }
    }

    /**
     * Programa backup automático
     */
    scheduleAutomaticBackup() {
        if (!this.config.enabled) {
            console.log('⚠️  Automatic backup is disabled');
            return null;
        }

        // Backup diário às 03:00
        const scheduleDaily = () => {
            const now = new Date();
            const scheduledTime = new Date();
            scheduledTime.setHours(3, 0, 0, 0);
            
            // Se já passou das 03:00 hoje, agendar para amanhã
            if (now > scheduledTime) {
                scheduledTime.setDate(scheduledTime.getDate() + 1);
            }
            
            const timeUntilBackup = scheduledTime.getTime() - now.getTime();
            
            console.log(`📅 Next automatic backup scheduled for: ${scheduledTime.toLocaleString()}`);
            
            return setTimeout(async () => {
                try {
                    await this.createBackup('automatic');
                    scheduleDaily(); // Reagendar para o próximo dia
                } catch (error) {
                    console.error('Automatic backup failed:', error.message);
                    scheduleDaily(); // Reagendar mesmo se falhar
                }
            }, timeUntilBackup);
        };
        
        return scheduleDaily();
    }

    /**
     * Remove backups antigos
     */
    async cleanupOldBackups() {
        try {
            const files = await fs.readdir(this.config.backupDirectory);
            const backupFiles = files.filter(file => file.startsWith('nexocli-backup-') && file.endsWith('.db'));
            
            if (backupFiles.length === 0) {
                return;
            }
            
            // Ordenar por data de modificação (mais antigos primeiro)
            const fileStats = await Promise.all(
                backupFiles.map(async file => {
                    const filePath = path.join(this.config.backupDirectory, file);
                    const stats = await fs.stat(filePath);
                    return { file, path: filePath, mtime: stats.mtime };
                })
            );
            
            fileStats.sort((a, b) => a.mtime - b.mtime);
            
            // Remover backups antigos
            const cutoffDate = new Date(Date.now() - (this.config.retentionDays * 24 * 60 * 60 * 1000));
            const filesToDelete = fileStats.filter(f => f.mtime < cutoffDate);
            
            // Também remover se exceder o limite máximo
            if (fileStats.length > this.config.maxBackups) {
                const excess = fileStats.length - this.config.maxBackups;
                filesToDelete.push(...fileStats.slice(0, excess));
            }
            
            if (filesToDelete.length > 0) {
                console.log(`🧹 Cleaning up ${filesToDelete.length} old backups...`);
                
                for (const fileInfo of filesToDelete) {
                    await fs.unlink(fileInfo.path);
                    console.log(`   🗑️  Deleted: ${fileInfo.file}`);
                }
            }
            
        } catch (error) {
            console.error('Failed to cleanup old backups:', error.message);
        }
    }

    /**
     * Lista backups disponíveis
     */
    async listBackups() {
        try {
            const files = await fs.readdir(this.config.backupDirectory);
            const backupFiles = files.filter(file => file.startsWith('nexocli-backup-') && file.endsWith('.db'));
            
            const backups = await Promise.all(
                backupFiles.map(async file => {
                    const filePath = path.join(this.config.backupDirectory, file);
                    const stats = await fs.stat(filePath);
                    
                    return {
                        filename: file,
                        path: filePath,
                        size: stats.size,
                        sizeFormatted: this.formatBytes(stats.size),
                        created: stats.mtime,
                        age: this.formatAge(stats.mtime)
                    };
                })
            );
            
            // Ordenar por data de criação (mais recentes primeiro)
            backups.sort((a, b) => b.created - a.created);
            
            return backups;
            
        } catch (error) {
            console.error('Failed to list backups:', error.message);
            return [];
        }
    }

    /**
     * Restaura backup
     */
    async restoreBackup(backupPath) {
        try {
            console.log(`🔄 Restoring backup from: ${backupPath}`);
            
            // Verificar se o backup existe
            await fs.access(backupPath);
            
            // Obter caminho da BD atual
            const dbInfo = await this.db.getInfo();
            const currentDbPath = dbInfo.path;
            
            // Criar backup da BD atual antes de restaurar
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const currentBackupPath = path.join(
                this.config.backupDirectory,
                `nexocli-backup-pre-restore-${timestamp}.db`
            );
            
            await fs.copyFile(currentDbPath, currentBackupPath);
            console.log(`💾 Current database backed up to: ${currentBackupPath}`);
            
            // Fechar conexão atual
            await this.db.close();
            
            // Restaurar o backup
            await fs.copyFile(backupPath, currentDbPath);
            
            // Reconectar à BD restaurada
            await this.db.initialize();
            
            console.log('✅ Backup restored successfully');
            
            // Registar a restauração
            await this.logBackup('restore', backupPath, 'success', null, null, 'Database restored from backup');
            
            return true;
            
        } catch (error) {
            console.error(`❌ Restore failed: ${error.message}`);
            
            // Registar falha
            await this.logBackup('restore', backupPath, 'error', null, null, error.message);
            
            throw error;
        }
    }

    /**
     * Regista operação de backup
     */
    async logBackup(type, path, status, fileSize = null, duration = null, errorMessage = null) {
        try {
            if (this.db && this.db.isConnected) {
                await this.db.run(`
                    INSERT INTO backup_logs 
                    (backup_type, backup_path, status, file_size, backup_duration_ms, error_message)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [type, path, status, fileSize, duration, errorMessage]);
            }
            
            // Também usar o sistema de logging
            await log.backup(type, path, status, fileSize, errorMessage);
            
        } catch (error) {
            console.error('Failed to log backup operation:', error.message);
        }
    }

    /**
     * Formata tamanho em bytes
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Formata idade do ficheiro
     */
    formatAge(date) {
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            return 'Less than 1 hour ago';
        }
    }
}

/**
 * Função principal para execução via CLI
 */
async function main() {
    const backupManager = new BackupManager();
    
    try {
        await backupManager.initialize();
        
        const args = process.argv.slice(2);
        const command = args[0];
        
        switch (command) {
            case 'create':
            case 'backup':
                await backupManager.createBackup('manual');
                break;
                
            case 'list':
                const backups = await backupManager.listBackups();
                console.log('\n📋 Available backups:');
                if (backups.length === 0) {
                    console.log('   No backups found');
                } else {
                    backups.forEach(backup => {
                        console.log(`   📁 ${backup.filename} (${backup.sizeFormatted}, ${backup.age})`);
                    });
                }
                break;
                
            case 'cleanup':
                await backupManager.cleanupOldBackups();
                break;
                
            case 'restore':
                const backupPath = args[1];
                if (!backupPath) {
                    console.error('Please specify backup path to restore');
                    process.exit(1);
                }
                await backupManager.restoreBackup(backupPath);
                break;
                
            case 'schedule':
                const timer = backupManager.scheduleAutomaticBackup();
                console.log('📅 Automatic backup scheduled');
                // Manter o processo vivo
                process.on('SIGINT', () => {
                    console.log('\n🛑 Stopping automatic backup scheduler...');
                    if (timer) clearTimeout(timer);
                    process.exit(0);
                });
                break;
                
            case 'test':
                console.log('🧪 Testing backup system...');
                const result = await backupManager.createBackup('test');
                console.log('✅ Backup test completed:', result);
                break;
                
            default:
                console.log('Usage: node backup.js [command]');
                console.log('Commands:');
                console.log('  create    - Create manual backup');
                console.log('  list      - List available backups');
                console.log('  cleanup   - Remove old backups');
                console.log('  restore   - Restore from backup');
                console.log('  schedule  - Start automatic backup scheduler');
                console.log('  test      - Test backup functionality');
                break;
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('Backup operation failed:', error.message);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export default BackupManager;
export { BackupManager };