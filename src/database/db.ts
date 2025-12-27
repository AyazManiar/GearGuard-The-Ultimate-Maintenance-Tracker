import db from './sqlite';

// Helper to execute SELECT queries
export function query(sql: string, params: any[] = []) {
  try {
    const stmt = db.prepare(sql);
    const rows = params && params.length > 0 ? stmt.all(...params) : stmt.all();
    return {
      rows,
      rowCount: rows.length
    };
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

// Helper to execute INSERT/UPDATE/DELETE
export function execute(sql: string, params: any[] = []) {
  try {
    const stmt = db.prepare(sql);
    const result = params && params.length > 0 ? stmt.run(...params) : stmt.run();
    return {
      changes: result.changes,
      lastID: result.lastInsertRowid
    };
  } catch (error) {
    console.error('Execute error:', error);
    throw error;
  }
}

// Transaction helper
export function transaction(callback: () => void) {
  const trans = db.transaction(callback);
  return trans();
}

export default db;
