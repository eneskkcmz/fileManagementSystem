import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config';
import { runMigrations } from './schema';

fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });

export const db = new Database(config.dbPath);

// WAL gives us safe concurrent reads and atomic commits — this is exactly the
// concurrency/atomicity headache that hand-rolled db.json writes would create.
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

runMigrations(db);
