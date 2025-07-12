
import sqlite3 from 'sqlite3';
import fs from 'fs';
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
    console.log('Connected to the nexocli.db database for document store population.');
});

const documentsToStore = [
    { name: 'AGENTS.md', path: '../AGENTS.md' },
    { name: 'ROADMAP.md', path: '../ROADMAP.md' },
    { name: 'CHANGELOG.md', path: '../CHANGELOG.md' }
];

db.serialize(() => {
    const stmt = db.prepare("INSERT OR REPLACE INTO document_store (doc_name, content, version, last_updated) VALUES (?, ?, ?, ?)");

    documentsToStore.forEach(doc => {
        const filePath = path.resolve(__dirname, doc.path);
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            // Extrair versão (se aplicável) - simplificado para este exemplo
            const versionMatch = content.match(/versao: "(v[0-9]+\.[0-9]+)"/);
            const version = versionMatch ? versionMatch[1] : 'N/A';

            stmt.run(doc.name, content, version, new Date().toISOString(), (err) => {
                if (err) {
                    console.error(`Error inserting ${doc.name}:`, err.message);
                } else {
                    console.log(`${doc.name} inserted/updated successfully.`);
                }
            });
        } catch (readErr) {
            console.error(`Error reading ${doc.name}:`, readErr.message);
        }
    });

    stmt.finalize(() => {
        console.log("Document store population complete.");
        db.close((err) => {
            if (err) {
                return console.error('Error closing database', err.message);
            }
            console.log('Database connection closed.');
        });
    });
});
