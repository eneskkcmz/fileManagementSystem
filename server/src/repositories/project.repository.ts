import type { Project } from '@fms/shared';
import { db } from '../db/connection';

const COLS = 'id, factoryId, name, description, status, startDate, targetEndDate, createdAt, updatedAt';

export const projectRepository = {
  list(filters: { factoryId?: string }, limit: number, offset: number): Project[] {
    const where = ['deletedAt IS NULL'];
    const params: unknown[] = [];
    if (filters.factoryId) {
      where.push('factoryId = ?');
      params.push(filters.factoryId);
    }
    return db
      .prepare(
        `SELECT ${COLS} FROM projects WHERE ${where.join(' AND ')} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      )
      .all(...params, limit, offset) as Project[];
  },

  count(filters: { factoryId?: string }): number {
    const where = ['deletedAt IS NULL'];
    const params: unknown[] = [];
    if (filters.factoryId) {
      where.push('factoryId = ?');
      params.push(filters.factoryId);
    }
    const row = db
      .prepare(`SELECT COUNT(*) AS c FROM projects WHERE ${where.join(' AND ')}`)
      .get(...params) as { c: number };
    return row.c;
  },

  getById(id: string): Project | undefined {
    return db
      .prepare(`SELECT ${COLS} FROM projects WHERE id = ? AND deletedAt IS NULL`)
      .get(id) as Project | undefined;
  },

  insert(p: Project): void {
    db.prepare(
      `INSERT INTO projects (id, factoryId, name, description, status, startDate, targetEndDate, createdAt, updatedAt)
       VALUES (@id, @factoryId, @name, @description, @status, @startDate, @targetEndDate, @createdAt, @updatedAt)`,
    ).run(p);
  },

  update(p: Project): void {
    db.prepare(
      `UPDATE projects SET name=@name, description=@description, status=@status,
        startDate=@startDate, targetEndDate=@targetEndDate, updatedAt=@updatedAt
       WHERE id=@id AND deletedAt IS NULL`,
    ).run(p);
  },

  softDelete(id: string, when: string): void {
    db.prepare(`UPDATE projects SET deletedAt = ?, updatedAt = ? WHERE id = ?`).run(when, when, id);
  },
};
