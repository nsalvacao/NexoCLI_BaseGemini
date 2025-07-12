
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../db/nexocli.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        return;
    }
    console.log('Connected to the nexocli.db database for data population.');
});

db.serialize(() => {
    // Inserir marcos do roadmap
    const roadmapMilestones = [
        { milestone_id: 'Fase0', phase_name: 'Fase 0', description: 'Bootstrap & Compliance', status: 'Completed', start_date: '2025-07-10 00:00:00', completion_date: '2025-07-10 23:59:59' },
        { milestone_id: 'Fase1', phase_name: 'Fase 1', description: 'Base de Dados & Logging Core', status: 'Completed', start_date: '2025-07-11 00:00:00', completion_date: '2025-07-11 14:13:35' },
        { milestone_id: 'Fase2', phase_name: 'Fase 2', description: 'Provider Gemini MVP', status: 'Completed', start_date: '2025-07-11 14:13:36', completion_date: '2025-07-11 18:09:00' },
        { milestone_id: 'Fase3', phase_name: 'Fase 3', description: 'Modularidade de Providers', status: 'Pending' },
        { milestone_id: 'Fase4', phase_name: 'Fase 4', description: 'Providers Externos', status: 'Pending' },
        { milestone_id: 'Fase5', phase_name: 'Fase 5', description: 'Menu Interativo + CLI Modelos', status: 'Pending' },
        { milestone_id: 'Fase6', phase_name: 'Fase 6', description: 'Modelos Locais (LLM) + Configurações', status: 'Pending' },
        { milestone_id: 'Fase7', phase_name: 'Fase 7', description: 'Dashboard Básico + Gestão Visual de Modelos', status: 'Pending' },
        { milestone_id: 'Fase8', phase_name: 'Fase 8', description: 'Dashboard Avançado & Expansões', status: 'Pending' }
    ];

    const stmtMilestones = db.prepare("INSERT OR IGNORE INTO roadmap_milestones (milestone_id, phase_name, description, status, start_date, completion_date) VALUES (?, ?, ?, ?, ?, ?)");
    roadmapMilestones.forEach(m => {
        stmtMilestones.run(m.milestone_id, m.phase_name, m.description, m.status, m.start_date, m.completion_date, (err) => {
            if (err) console.error("Error inserting milestone:", err.message);
        });
    });
    stmtMilestones.finalize(() => console.log("Roadmap milestones inserted/updated."));

    // Inserir sessões de agente
    const agentSessions = [
        { session_id: 'claude_dev_20250711_141335', agent_name: 'Claude-Code', start_time: '2025-07-11 14:13:35', end_time: '2025-07-11 14:13:35', objective: 'Estruturação inicial do projeto, configuração da base de dados e planeamento do roadmap.' },
        { session_id: 'claude_dev_20250711_180900', agent_name: 'Claude-Code', start_time: '2025-07-11 18:09:00', end_time: '2025-07-11 18:09:00', objective: 'Implementação do provider Gemini, testes e sistema de logging.' },
        { session_id: 'gemini_dev_20250711_192248', agent_name: 'Gemini-Tool', start_time: '2025-07-11 19:22:48', end_time: null, objective: 'Consolidação, Validação e Preenchimento de Histórico no NexoCLI_BaseGemini.' }
    ];

    const stmtSessions = db.prepare("INSERT OR IGNORE INTO agent_sessions (session_id, agent_name, start_time, end_time, session_objective) VALUES (?, ?, ?, ?, ?)");
    agentSessions.forEach(s => {
        stmtSessions.run(s.session_id, s.agent_name, s.start_time, s.end_time, s.objective, (err) => {
            if (err) console.error("Error inserting agent session:", err.message);
        });
    });
    stmtSessions.finalize(() => console.log("Agent sessions inserted/updated."));

    // Inserir logs do Gemini-Tool
    const geminiLogs = [
        { agent: 'Gemini-Tool', type: 'desenvolvimento', path: 'logs/log_validacao_gemini_*.md', description: 'Relatório de validação gerado com sucesso.', impact: 'Low', session_id: 'gemini_dev_20250711_192248', milestone_id: 'Fase2' },
        { agent: 'Gemini-Tool', type: 'desenvolvimento', path: 'scripts/consolidate_history.js', description: 'Todos os registos de desenvolvimento do Claude-Code foram inseridos com sucesso na base de dados.', impact: 'Medium', session_id: 'gemini_dev_20250711_192248', milestone_id: 'Fase2' },
        { agent: 'Gemini-Tool', type: 'bugfix', path: 'scripts/consolidate_history.js', description: 'Corrigido erro de escopo de Módulo ES (require vs import) no script consolidate_history.js.', impact: 'High', session_id: 'gemini_dev_20250711_192248', milestone_id: 'Fase2' },
        { agent: 'Gemini-Tool', type: 'bugfix', path: 'node_modules/sqlite3', description: 'Reconstruído o módulo sqlite3 para resolver erro de incompatibilidade Win32 application.', impact: 'High', session_id: 'gemini_dev_20250711_192248', milestone_id: 'Fase2' },
        { agent: 'Gemini-Tool', type: 'bugfix', path: 'scripts/consolidate_history.js', description: 'Corrigido erro de escopo de Módulo ES (__dirname) no script consolidate_history.js.', impact: 'High', session_id: 'gemini_dev_20250711_192248', milestone_id: 'Fase2' },
        { agent: 'Gemini-Tool', type: 'bugfix', path: 'scripts/consolidate_history.js', description: 'Corrigido erro SQLITE_CONSTRAINT para log_type "milestone" mapeando para "desenvolvimento".', impact: 'Medium', session_id: 'gemini_dev_20250711_192248', milestone_id: 'Fase2' },
        { agent: 'Gemini-Tool', type: 'feature', path: 'src/database/schema.sql', description: 'Migração do schema da base de dados para v2.0, adicionando agent_sessions, roadmap_milestones e atualizando development_logs.', impact: 'Critical', session_id: 'gemini_dev_20250711_192248', milestone_id: 'Fase2' },
        { agent: 'Gemini-Tool', type: 'deployment', path: 'db/nexocli.db', description: 'Backup da base de dados antes da repopulação.', impact: 'Low', session_id: 'gemini_dev_20250711_192248', milestone_id: 'Fase2' },
        { agent: 'Gemini-Tool', type: 'deployment', path: 'db/nexocli.db', description: 'Limpeza da tabela development_logs para repopulação.', impact: 'Low', session_id: 'gemini_dev_20250711_192248', milestone_id: 'Fase2' },
        { agent: 'Gemini-Tool', type: 'deployment', path: 'db/nexocli.db', description: 'Re-inserção dos logs do Claude-Code na tabela development_logs.', impact: 'Low', session_id: 'gemini_dev_20250711_192248', milestone_id: 'Fase2' },
        { agent: 'Gemini-Tool', type: 'desenvolvimento', path: 'scripts/populate_context_data.js', description: 'Atualização do script populate_context_data.js para incluir logs do Gemini-Tool e usar IDs para atualização.', impact: 'Medium', session_id: 'gemini_dev_20250711_192248', milestone_id: 'Fase2' },
    ];

    const stmtGeminiLogs = db.prepare("INSERT INTO development_logs (agent_name, log_type, file_path, description, impact_level, session_id, milestone_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
    geminiLogs.forEach(log => {
        stmtGeminiLogs.run(log.agent, log.type, log.path, log.description, log.impact, log.session_id, log.milestone_id, (err) => {
            if (err) console.error("Error inserting Gemini log:", err.message);
        });
    });
    stmtGeminiLogs.finalize(() => console.log("Gemini-Tool logs inserted."));

    // Atualizar development_logs com session_id e milestone_id para logs do Claude-Code
    const claudeLogUpdates = [
        { id: 53, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' }, // Criação da estrutura de pastas e ficheiros iniciais.
        { id: 54, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' },
        { id: 55, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' },
        { id: 56, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' },
        { id: 57, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' },
        { id: 58, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' },
        { id: 59, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' },
        { id: 60, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' },
        { id: 61, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' },
        { id: 62, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' },
        { id: 63, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' },
        { id: 64, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' },
        { id: 65, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' }, // Desenvolvimento de scripts para inicializar e gerir a base de dados.
        { id: 66, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' }, // Desenvolvimento de scripts para futuras migrações de schema.
        { id: 67, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' }, // Desenvolvimento de scripts para realizar backups da base de dados.
        { id: 68, session_id: 'claude_dev_20250711_141335', milestone_id: 'Fase1' }, // Fase 1 do Roadmap concluída: Estrutura do projeto definida, base de dados desenhada e ambiente de desenvolvimento configurado.

        { id: 69, session_id: 'claude_dev_20250711_180900', milestone_id: 'Fase2' }, // Implementação da classe GeminiProvider.
        { id: 70, session_id: 'claude_dev_20250711_180900', milestone_id: 'Fase2' }, // Adicionada lógica para instanciar GeminiProvider.
        { id: 71, session_id: 'claude_dev_20250711_180900', milestone_id: 'Fase2' }, // Testes unitários para GeminiProvider.
        { id: 72, session_id: 'claude_dev_20250711_180900', milestone_id: 'Fase2' }, // Testes para o fluxo de autenticação OAuth.
        { id: 73, session_id: 'claude_dev_20250711_180900', milestone_id: 'Fase2' }, // Teste de integração para verificar a conexão com a BD.
        { id: 74, session_id: 'claude_dev_20250711_180900', milestone_id: 'Fase2' }, // Configuração do Vitest.
        { id: 75, session_id: 'claude_dev_20250711_180900', milestone_id: 'Fase2' }, // Adaptador para que o logger possa escrever em ficheiro e na base de dados.
        { id: 76, session_id: 'claude_dev_20250711_180900', milestone_id: 'Fase2' }, // Adicionada função para inserir logs na tabela development_logs.
        { id: 77, session_id: 'claude_dev_20250711_180900', milestone_id: 'Fase2' }, // Execução do script init.js para criar a base de dados.
        { id: 78, session_id: 'claude_dev_20250711_180900', milestone_id: 'Fase2' }, // Primeiro Log Inserido na BD: Um registo de teste foi inserido na development_logs para validar o sistema.
        { id: 79, session_id: 'claude_dev_20250711_180900', milestone_id: 'Fase2' }, // Fase 2 do Roadmap concluída: Provider Gemini implementado, sistema de logging funcional e base de dados inicializada e validada.
    ];

    const stmtUpdateClaudeLogs = db.prepare("UPDATE development_logs SET session_id = ?, milestone_id = ? WHERE id = ?");
    claudeLogUpdates.forEach(update => {
        stmtUpdateClaudeLogs.run(update.session_id, update.milestone_id, update.id, (err) => {
            if (err) console.error("Error updating Claude log:", err.message);
        });
    });
    stmtUpdateClaudeLogs.finalize(() => console.log("Claude-Code logs updated with session and milestone IDs."));

    db.close((err) => {
        if (err) {
            return console.error('Error closing database', err.message);
        }
        console.log('Database connection closed.');
    });
});
