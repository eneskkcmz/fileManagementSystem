import type { Activity } from '@fms/shared';
import { db } from '../db/connection';

const COLS = 'id, factoryId, projectId, entityType, entityId, action, description, createdAt';

export const activityRepository = {
  insert(a: Activity): void {
    db.prepare(
      `INSERT INTO activities (id, factoryId, projectId, entityType, entityId, action, description, createdAt)
       VALUES (@id, @factoryId, @projectId, @entityType, @entityId, @action, @description, @createdAt)`,
    ).run(a);
  },

  list(filters: { projectId?: string }, limit: number, offset: number): Activity[] {
    const where: string[] = [];
    const params: unknown[] = [];
    if (filters.projectId) {
      where.push('projectId = ?');
      params.push(filters.projectId);
    }
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    return db
      .prepare(`SELECT ${COLS} FROM activities ${clause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset) as Activity[];
  },

  count(filters: { projectId?: string }): number {
    const where: string[] = [];
    const params: unknown[] = [];
    if (filters.projectId) {
      where.push('projectId = ?');
      params.push(filters.projectId);
    }
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const row = db.prepare(`SELECT COUNT(*) AS c FROM activities ${clause}`).get(...params) as { c: number };
    return row.c;
  },
};
