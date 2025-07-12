
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../db/nexocli.db');
const logsPath = path.resolve(__dirname, '../logs');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        return;
    }
    console.log('Connected to the nexocli.db database.');
});

const developmentLogs = [
    // From log_desenvolvimento_claude_20250711-141335.md
    { agent: 'Claude-Code', type: 'feature', path: 'src/auth/oauth.js', description: 'Criação da estrutura de pastas e ficheiros iniciais.', impact: 'High' },
    { agent: 'Claude-Code', type: 'feature', path: 'src/providers/base.js', description: 'Criação da estrutura de pastas e ficheiros iniciais.', impact: 'High' },
    { agent: 'Claude-Code', type: 'feature', path: 'src/providers/factory.js', description: 'Criação da estrutura de pastas e ficheiros iniciais.', impact: 'High' },
    { agent: 'Claude-Code', type: 'feature', path: 'src/database/connection.js', description: 'Criação da estrutura de pastas e ficheiros iniciais.', impact: 'High' },
    { agent: 'Claude-Code', type: 'feature', path: 'src/database/schema.sql', description: 'Criação da estrutura de pastas e ficheiros iniciais.', impact: 'High' },
    { agent: 'Claude-Code', type: 'feature', path: 'src/cli/index.js', description: 'Criação da estrutura de pastas e ficheiros iniciais.', impact: 'High' },
    { agent: 'Claude-Code', type: 'feature', path: 'src/utils/logger.js', description: 'Criação da estrutura de pastas e ficheiros iniciais.', impact: 'High' },
    { agent: 'Claude-Code', type: 'feature', path: '.env.example', description: 'Criação da estrutura de pastas e ficheiros iniciais.', impact: 'Medium' },
    { agent: 'Claude-Code', type: 'feature', path: 'package.json', description: 'Criação da estrutura de pastas e ficheiros iniciais.', impact: 'High' },
    { agent: 'Claude-Code', type: 'feature', path: 'README.md', description: 'Criação da estrutura de pastas e ficheiros iniciais.', impact: 'Low' },
    { agent: 'Claude-Code', type: 'feature', path: 'AGENTS.md', description: 'Criação da estrutura de pastas e ficheiros iniciais.', impact: 'Medium' },
    { agent: 'Claude-Code', type: 'feature', path: 'ROADMAP.md', description: 'Criação da estrutura de pastas e ficheiros iniciais.', impact: 'Medium' },
    { agent: 'Claude-Code', type: 'feature', path: 'src/database/init.js', description: 'Desenvolvimento de scripts para inicializar e gerir a base de dados.', impact: 'High' },
    { agent: 'Claude-Code', type: 'feature', path: 'src/database/migrate.js', description: 'Desenvolvimento de scripts para futuras migrações de schema.', impact: 'Medium' },
    { agent: 'Claude-Code', type: 'feature', path: 'src/database/backup.js', description: 'Desenvolvimento de scripts para realizar backups da base de dados.', impact: 'Medium' },
    { agent: 'Claude-Code', type: 'desenvolvimento', path: null, description: 'Fase 1 do Roadmap concluída: Estrutura do projeto definida, base de dados desenhada e ambiente de desenvolvimento configurado.', impact: 'High' },

    // From log_desenvolvimento_claude_20250711-180900.md
    { agent: 'Claude-Code', type: 'feature', path: 'src/providers/gemini.js', description: 'Implementação da classe GeminiProvider.', impact: 'High' },
    { agent: 'Claude-Code', type: 'refactor', path: 'src/providers/factory.js', description: 'Adicionada lógica para instanciar GeminiProvider.', impact: 'Medium' },
    { agent: 'Claude-Code', type: 'test', path: 'tests/providers/gemini.test.js', description: 'Testes unitários para GeminiProvider.', impact: 'Medium' },
    { agent: 'Claude-Code', type: 'test', path: 'tests/auth/oauth.test.js', description: 'Testes para o fluxo de autenticação OAuth.', impact: 'Medium' },
    { agent: 'Claude-Code', type: 'test', path: 'tests/database/connection.test.js', description: 'Teste de integração para verificar a conexão com a BD.', impact: 'Medium' },
    { agent: 'Claude-Code', type: 'feature', path: 'vitest.config.js', description: 'Configuração do Vitest.', impact: 'Low' },
    { agent: 'Claude-Code', type: 'feature', path: 'src/utils/logger-adapter.js', description: 'Adaptador para que o logger possa escrever em ficheiro e na base de dados.', impact: 'High' },
    { agent: 'Claude-Code', type: 'refactor', path: 'src/database/connection.js', description: 'Adicionada função para inserir logs na tabela development_logs.', impact: 'Medium' },
    { agent: 'Claude-Code', type: 'deployment', path: 'db/nexocli.db', description: 'Execução do script init.js para criar a base de dados.', impact: 'Critical' },
    { agent: 'Claude-Code', type: 'test', path: 'db/nexocli.db', description: 'Primeiro Log Inserido na BD: Um registo de teste foi inserido na development_logs para validar o sistema.', impact: 'High' },
    { agent: 'Claude-Code', type: 'desenvolvimento', path: null, description: 'Fase 2 do Roadmap concluída: Provider Gemini implementado, sistema de logging funcional e base de dados inicializada e validada.', impact: 'High' }
];

db.serialize(() => {
    const stmt = db.prepare("INSERT INTO development_logs (agent_name, log_type, file_path, description, impact_level) VALUES (?, ?, ?, ?, ?)");

    developmentLogs.forEach(log => {
        stmt.run(log.agent, log.type, log.path, log.description, log.impact, (err) => {
            if (err) {
                return console.error('Error inserting log:', err.message);
            }
        });
    });

    stmt.finalize((err) => {
        if (err) {
            return console.error('Error finalizing statement:', err.message);
        }
        console.log('All development logs have been inserted successfully.');
    });
});

db.close((err) => {
    if (err) {
        return console.error('Error closing database', err.message);
    }
    console.log('Database connection closed.');
});
