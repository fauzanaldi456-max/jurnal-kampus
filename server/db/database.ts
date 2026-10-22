import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import fs from 'fs';
import path from 'path';

let dbInstance: Database | null = null;
let SQL: SqlJsStatic | null = null;
const DATA_DIR = process.env.VERCEL
  ? path.resolve('/tmp', 'cendraloka_data')
  : path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'cendraloka.sqlite');

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    console.warn('Could not create data dir:', e);
  }

  if (!SQL) {
    try {
      SQL = await initSqlJs();
    } catch (sqlInitErr) {
      console.warn('initSqlJs failed, will run with empty/in-memory fallback:', sqlInitErr);
      return null as any;
    }
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const fileBuffer = fs.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(fileBuffer);
    } else {
      dbInstance = new SQL.Database();
    }
    dbInstance.run('PRAGMA foreign_keys = ON;');
  } catch (err) {
    console.warn('Error loading DB file, fallback to new in-memory instance:', err);
    if (SQL) {
      dbInstance = new SQL.Database();
    }
  }

  return dbInstance as Database;
}

export function saveDb(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.warn('Failed to save SQLite database to disk:', err);
  }
}

export function query<T = any>(sql: string, params: any[] = []): T[] {
  if (!dbInstance) {
    console.warn('Query called before database ready, returning empty array.');
    return [];
  }

  try {
    const stmt = dbInstance.prepare(sql);
    stmt.bind(params);

    const results: T[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject() as unknown as T);
    }
    stmt.free();
    return results;
  } catch (err) {
    console.error('SQL query error:', err, 'SQL:', sql);
    return [];
  }
}

export function queryOne<T = any>(sql: string, params: any[] = []): T | null {
  if (!dbInstance) {
    return null;
  }
  const results = query<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}

export function run(sql: string, params: any[] = []): { changes: number; lastInsertRowid: number } {
  if (!dbInstance) {
    console.warn('run called before database ready.');
    return { changes: 0, lastInsertRowid: 0 };
  }

  try {
    dbInstance.run(sql, params);
    saveDb();

    const info = dbInstance.exec('SELECT changes() as changes, last_insert_rowid() as id;');
    if (info.length > 0 && info[0].values.length > 0) {
      const [changes, id] = info[0].values[0];
      return { changes: changes as number, lastInsertRowid: id as number };
    }
  } catch (err) {
    console.error('SQL run error:', err, 'SQL:', sql);
  }
  return { changes: 1, lastInsertRowid: 0 };
}

export function exec(sql: string): void {
  if (!dbInstance) {
    console.warn('exec called before database ready.');
    return;
  }
  try {
    dbInstance.exec(sql);
    saveDb();
  } catch (err) {
    console.error('SQL exec error:', err);
  }
}
