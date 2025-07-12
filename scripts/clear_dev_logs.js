
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
    console.log('Connected to the nexocli.db database for clearing development_logs.');
});

db.serialize(() => {
    db.run("DELETE FROM development_logs;", function(err) {
        if (err) {
            return console.error('Error clearing development_logs:', err.message);
        }
        console.log(`Cleared ${this.changes} rows from development_logs.`);
    });

    db.close((err) => {
        if (err) {
            return console.error('Error closing database', err.message);
        }
        console.log('Database connection closed.');
    });
});
