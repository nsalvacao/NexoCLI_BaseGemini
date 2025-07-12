
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

    // 1. Criar a nova tabela development_logs_new com o schema atualizado
    db.run(`
        CREATE TABLE development_logs_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            agent_name VARCHAR(100) NOT NULL,
            log_type VARCHAR(50) NOT NULL CHECK (log_type IN ('desenvolvimento', 'bugfix', 'feature', 'refactor', 'test', 'deployment', 'milestone')),
            file_path TEXT,
            description TEXT NOT NULL,
                        impact_level VARCHAR(20) NOT NULL CHECK (impact_level IN ('Critical', 'High', 'Medium', 'Low')),
            session_id VARCHAR(100), -- Foreign Key para agent_sessions.session_id
            milestone_id VARCHAR(50), -- Foreign Key para roadmap_milestones.milestone_id
            commit_hash VARCHAR(40), -- Hash do commit do Git
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES agent_sessions(session_id),
            FOREIGN KEY (milestone_id) REFERENCES roadmap_milestones(milestone_id)
        );
    `, (err) => {
        if (err) { console.error("Error creating development_logs_new:", err.message); return; }
        console.log("Table development_logs_new created.");

        // 2. Copiar dados da tabela antiga para a nova
        db.run(`
            INSERT INTO development_logs_new (id, timestamp, agent_name, log_type, file_path, description, impact_level, created_at, updated_at)
            SELECT id, timestamp, agent_name, log_type, file_path, description, impact_level, created_at, updated_at
            FROM development_logs;
        `, (err) => {
            if (err) { console.error("Error copying data to development_logs_new:", err.message); return; }
            console.log("Data copied to development_logs_new.");

            // 3. Remover a tabela antiga
            db.run("DROP TABLE development_logs;", (err) => {
                if (err) { console.error("Error dropping old development_logs:", err.message); return; }
                console.log("Old development_logs table dropped.");

                // 4. Renomear a nova tabela
                db.run("ALTER TABLE development_logs_new RENAME TO development_logs;", (err) => {
                    if (err) { console.error("Error renaming development_logs_new:", err.message); return; }
                    console.log("development_logs_new renamed to development_logs.");

                    // 5. Criar as novas tabelas agent_sessions e roadmap_milestones
                    db.run(`
                        CREATE TABLE IF NOT EXISTS agent_sessions (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            session_id VARCHAR(100) UNIQUE NOT NULL,
                            agent_name VARCHAR(100) NOT NULL,
                            start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                            end_time DATETIME,
                            session_objective TEXT NOT NULL,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                        );
                    `, (err) => {
                        if (err) { console.error("Error creating agent_sessions:", err.message); return; }
                        console.log("Table agent_sessions created.");

                        db.run(`
                            CREATE TABLE IF NOT EXISTS roadmap_milestones (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                milestone_id VARCHAR(50) UNIQUE NOT NULL,
                                phase_name VARCHAR(100) NOT NULL,
                                description TEXT NOT NULL,
                                status VARCHAR(20) NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Completed', 'On Hold')),
                                start_date DATETIME,
                                completion_date DATETIME,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                            );
                        `, (err) => {
                            if (err) { console.error("Error creating roadmap_milestones:", err.message); return; }
                            console.log("Table roadmap_milestones created.");

                            // 6. Recriar índices para development_logs
                            db.run("CREATE INDEX IF NOT EXISTS idx_dev_logs_agent_type ON development_logs(agent_name, log_type);", (err) => { if (err) console.error("Error creating index:", err.message); });
                            db.run("CREATE INDEX IF NOT EXISTS idx_dev_logs_timestamp ON development_logs(timestamp);", (err) => { if (err) console.error("Error creating index:", err.message); });
                            db.run("CREATE INDEX IF NOT EXISTS idx_dev_logs_impact ON development_logs(impact_level);", (err) => { if (err) console.error("Error creating index:", err.message); });
                            db.run("CREATE INDEX IF NOT EXISTS idx_dev_logs_session_id ON development_logs(session_id);", (err) => { if (err) console.error("Error creating index:", err.message); });
                            db.run("CREATE INDEX IF NOT EXISTS idx_dev_logs_milestone_id ON development_logs(milestone_id);", (err) => { if (err) console.error("Error creating index:", err.message); });
                            console.log("Indexes for development_logs recreated.");

                            // 7. Recriar índices para as novas tabelas
                            db.run("CREATE INDEX IF NOT EXISTS idx_agent_sessions_agent_name ON agent_sessions(agent_name);", (err) => { if (err) console.error("Error creating index:", err.message); });
                            db.run("CREATE INDEX IF NOT EXISTS idx_agent_sessions_start_time ON agent_sessions(start_time);", (err) => { if (err) console.error("Error creating index:", err.message); });
                            db.run("CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_phase_name ON roadmap_milestones(phase_name);", (err) => { if (err) console.error("Error creating index:", err.message); });
                            db.run("CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_status ON roadmap_milestones(status);", (err) => { if (err) console.error("Error creating index:", err.message); });
                            console.log("Indexes for new tables created.");

                            // 8. Recriar triggers
                            db.run(`
                                DROP TRIGGER IF EXISTS update_system_config_timestamp;
                                CREATE TRIGGER IF NOT EXISTS update_system_config_timestamp
                                    AFTER UPDATE ON system_config
                                    FOR EACH ROW
                                BEGIN
                                    UPDATE system_config 
                                    SET updated_at = CURRENT_TIMESTAMP 
                                    WHERE key = NEW.key;
                                END;
                            `, (err) => { if (err) console.error("Error recreating system_config trigger:", err.message); });

                            db.run(`
                                DROP TRIGGER IF EXISTS update_development_logs_timestamp;
                                CREATE TRIGGER IF NOT EXISTS update_development_logs_timestamp
                                    AFTER UPDATE ON development_logs
                                    FOR EACH ROW
                                BEGIN
                                    UPDATE development_logs 
                                    SET updated_at = CURRENT_TIMESTAMP 
                                    WHERE id = NEW.id;
                                END;
                            `, (err) => { if (err) console.error("Error recreating development_logs trigger:", err.message); });

                            db.run(`
                                DROP TRIGGER IF EXISTS update_agent_sessions_timestamp;
                                CREATE TRIGGER IF NOT EXISTS update_agent_sessions_timestamp
                                    AFTER UPDATE ON agent_sessions
                                    FOR EACH ROW
                                BEGIN
                                    UPDATE agent_sessions 
                                    SET updated_at = CURRENT_TIMESTAMP 
                                    WHERE id = NEW.id;
                                END;
                            `, (err) => { if (err) console.error("Error recreating agent_sessions trigger:", err.message); });

                            db.run(`
                                DROP TRIGGER IF EXISTS update_roadmap_milestones_timestamp;
                                CREATE TRIGGER IF NOT EXISTS update_roadmap_milestones_timestamp
                                    AFTER UPDATE ON roadmap_milestones
                                    FOR EACH ROW
                                BEGIN
                                    UPDATE roadmap_milestones 
                                    SET updated_at = CURRENT_TIMESTAMP 
                                    WHERE id = NEW.id;
                                END;
                            `, (err) => { if (err) console.error("Error recreating roadmap_milestones trigger:", err.message); });

                            db.run(`
                                DROP TRIGGER IF EXISTS update_sessions_timestamp;
                                CREATE TRIGGER IF NOT EXISTS update_sessions_timestamp
                                    AFTER UPDATE ON sessions
                                    FOR EACH ROW
                                BEGIN
                                    UPDATE sessions 
                                    SET updated_at = CURRENT_TIMESTAMP 
                                    WHERE id = NEW.id;
                                END;
                            `, (err) => { if (err) console.error("Error recreating sessions trigger:", err.message); });
                            console.log("Triggers recreated.");

                            // 9. Recriar views
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
                            console.log("Views recreated.");

                            db.run("PRAGMA foreign_keys = ON;"); // Reativar chaves estrangeiras
                            console.log("Migration to schema v2.0 completed successfully.");
                            db.close();
                        });
                    });
                });
            });
        });
    });
});
