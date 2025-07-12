
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../db/nexocli.db');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        return;
    }
    console.log('Connected to the nexocli.db database for reading.');
});

db.all("SELECT id, description FROM development_logs;", [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach(row => {
        console.log(`ID: ${row.id}, Description: ${row.description}`);
    });
    db.close();
});
