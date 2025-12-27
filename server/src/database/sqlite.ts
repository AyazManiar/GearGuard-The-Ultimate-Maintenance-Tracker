import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../gearguard.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('✅ Connected to SQLite database:', dbPath);

export default db;
