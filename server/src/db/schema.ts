import type { Database } from 'better-sqlite3';

/**
 * Idempotent schema setup. For an MVP this "create if not exists" migration is
 * enough; when the model stabilises this can grow into a versioned migration
 * runner without touching the repository layer.
 *
 * Column names deliberately match the TS interfaces 1:1 (camelCase) so a DB row
 * maps to a domain entity with zero translation. Soft delete via `deletedAt`.
 */
export function runMigrations(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS factories (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      code        TEXT NOT NULL,
      description TEXT,
      createdAt   TEXT NOT NULL,
      updatedAt   TEXT NOT NULL,
      deletedAt   TEXT
    );

    CREATE TABLE IF NOT EXISTS projects (
      id            TEXT PRIMARY KEY,
      factoryId     TEXT NOT NULL REFERENCES factories(id),
      name          TEXT NOT NULL,
      description   TEXT,
      status        TEXT NOT NULL DEFAULT 'planning',
      startDate     TEXT,
      targetEndDate TEXT,
      createdAt     TEXT NOT NULL,
      updatedAt     TEXT NOT NULL,
      deletedAt     TEXT
    );

    CREATE TABLE IF NOT EXISTS work_items (
      id          TEXT PRIMARY KEY,
      projectId   TEXT NOT NULL REFERENCES projects(id),
      title       TEXT NOT NULL,
      description TEXT,
      type        TEXT NOT NULL DEFAULT 'task',
      status      TEXT NOT NULL DEFAULT 'backlog',
      priority    TEXT NOT NULL DEFAULT 'medium',
      progress    INTEGER NOT NULL DEFAULT 0,
      startDate   TEXT,
      dueDate     TEXT,
      createdAt   TEXT NOT NULL,
      updatedAt   TEXT NOT NULL,
      deletedAt   TEXT
    );

    CREATE TABLE IF NOT EXISTS activities (
      id          TEXT PRIMARY KEY,
      factoryId   TEXT,
      projectId   TEXT,
      entityType  TEXT NOT NULL,
      entityId    TEXT NOT NULL,
      action      TEXT NOT NULL,
      description TEXT NOT NULL,
      createdAt   TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_projects_factoryId ON projects(factoryId);
    CREATE INDEX IF NOT EXISTS idx_work_items_projectId ON work_items(projectId);
    CREATE INDEX IF NOT EXISTS idx_activities_projectId ON activities(projectId);
    CREATE INDEX IF NOT EXISTS idx_activities_createdAt ON activities(createdAt);
  `);
}
