
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
    console.log('Connected to the nexocli.db database for migration.');
});

db.serialize(() => {
    db.run("PRAGMA foreign_keys = OFF;"); // Desativar chaves estrangeiras temporariamente

    // 1. Criar a nova tabela document_store
    db.run(`
        CREATE TABLE IF NOT EXISTS document_store (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doc_name VARCHAR(100) UNIQUE NOT NULL,
            version VARCHAR(50),
            content TEXT NOT NULL,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `, (err) => {
        if (err) { console.error("Error creating document_store:", err.message); return; }
        console.log("Table document_store created.");

        // 2. Recriar views para incluir a nova development_activity_summary
        db.run(`
            DROP VIEW IF EXISTS provider_stats;
            CREATE VIEW IF NOT EXISTS provider_stats AS
            SELECT 
                provider,
                COUNT(*) as total_requests,
                AVG(response_time_ms) as avg_response_time,
                COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_requests,
                COUNT(CASE WHEN status = 'error' THEN 1 END) as failed_requests,
                ROUND(COUNT(CASE WHEN status = 'success' THEN 1 END) * 100.0 / COUNT(*), 2) as success_rate,
                DATE(timestamp) as date
            FROM provider_logs
            GROUP BY provider, DATE(timestamp)
            ORDER BY date DESC, provider;
        `, (err) => { if (err) console.error("Error recreating provider_stats view:", err.message); });

        db.run(`
            DROP VIEW IF EXISTS active_sessions;
            CREATE VIEW IF NOT EXISTS active_sessions AS
            SELECT 
                s.session_id,
                s.provider,
                s.model,
                s.started_at,
                s.total_messages,
                s.total_tokens,
                s.session_name,
                COUNT(ch.id) as message_count,
                MAX(ch.timestamp) as last_activity
            FROM sessions s
            LEFT JOIN chat_history ch ON s.session_id = ch.session_id
            WHERE s.session_status = 'active'
            GROUP BY s.session_id
            ORDER BY last_activity DESC;
        `, (err) => { if (err) console.error("Error recreating active_sessions view:", err.message); });

        db.run(`
            DROP VIEW IF EXISTS recent_dev_logs;
            CREATE VIEW IF NOT EXISTS recent_dev_logs AS
            SELECT 
                timestamp,
                agent_name,
                log_type,
                impact_level,
                SUBSTR(description, 1, 100) as description_preview,
                file_path,
                session_id,
                milestone_id,
                commit_hash
            FROM development_logs
            WHERE timestamp >= datetime('now', '-7 days')
            ORDER BY timestamp DESC;
        `, (err) => { if (err) console.error("Error recreating recent_dev_logs view:", err.message); });

        db.run(`
            DROP VIEW IF EXISTS agent_session_summary;
            CREATE VIEW IF NOT EXISTS agent_session_summary AS
            SELECT
                session_id,
                agent_name,
                start_time,
                end_time,
                session_objective,
                (JULIANDAY(end_time) - JULIANDAY(start_time)) * 24 * 60 * 60 AS duration_seconds
            FROM agent_sessions
            ORDER BY start_time DESC;
        `, (err) => { if (err) console.error("Error recreating agent_session_summary view:", err.message); });

        db.run(`
            DROP VIEW IF EXISTS roadmap_progress;
            CREATE VIEW IF NOT EXISTS roadmap_progress AS
            SELECT
                milestone_id,
                phase_name,
                description,
                status,
                start_date,
                completion_date
            FROM roadmap_milestones
            ORDER BY start_date ASC;
        `, (err) => { if (err) console.error("Error recreating roadmap_progress view:", err.message); });

        db.run(`
            DROP VIEW IF EXISTS development_activity_summary;
            CREATE VIEW IF NOT EXISTS development_activity_summary AS
            SELECT
                dl.id AS log_id,
                dl.timestamp,
                dl.agent_name,
                dl.log_type,
                dl.file_path,
                dl.description AS log_description,
                dl.impact_level,
                dl.commit_hash,
                asess.session_id,
                asess.session_objective,
                rm.milestone_id,
                rm.phase_name,
                rm.description AS milestone_description,
                rm.status AS milestone_status
            FROM development_logs dl
            LEFT JOIN agent_sessions asess ON dl.session_id = asess.session_id
            LEFT JOIN roadmap_milestones rm ON dl.milestone_id = rm.milestone_id
            ORDER BY dl.timestamp DESC;
        `, (err) => { if (err) console.error("Error recreating development_activity_summary view:", err.message); });
        console.log("Views recreated.");

        db.run("PRAGMA foreign_keys = ON;"); // Reativar chaves estrangeiras
        console.log("Migration to schema v3.0 completed successfully.");
        db.close();
    });
});
