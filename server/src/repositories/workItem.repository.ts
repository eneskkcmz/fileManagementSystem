import type { WorkItem, WorkItemFilter } from '@fms/shared';
import { db } from '../db/connection';

const COLS =
  'id, projectId, title, description, type, status, priority, progress, startDate, dueDate, createdAt, updatedAt';

function buildWhere(filters: WorkItemFilter): { clause: string; params: unknown[] } {
  const where = ['deletedAt IS NULL'];
  const params: unknown[] = [];
  if (filters.projectId) {
    where.push('projectId = ?');
    params.push(filters.projectId);
  }
  if (filters.status) {
    where.push('status = ?');
    params.push(filters.status);
  }
  if (filters.type) {
    where.push('type = ?');
    params.push(filters.type);
  }
  if (filters.priority) {
    where.push('priority = ?');
    params.push(filters.priority);
  }
  if (filters.search) {
    where.push('(title LIKE ? OR description LIKE ?)');
    const like = `%${filters.search}%`;
    params.push(like, like);
  }
  return { clause: where.join(' AND '), params };
}

export const workItemRepository = {
  list(filters: WorkItemFilter, limit: number, offset: number): WorkItem[] {
    const { clause, params } = buildWhere(filters);
    return db
      .prepare(`SELECT ${COLS} FROM work_items WHERE ${clause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset) as WorkItem[];
  },

  count(filters: WorkItemFilter): number {
    const { clause, params } = buildWhere(filters);
    const row = db.prepare(`SELECT COUNT(*) AS c FROM work_items WHERE ${clause}`).get(...params) as {
      c: number;
    };
    return row.c;
  },

  getById(id: string): WorkItem | undefined {
    return db
      .prepare(`SELECT ${COLS} FROM work_items WHERE id = ? AND deletedAt IS NULL`)
      .get(id) as WorkItem | undefined;
  },

  /** All (non-deleted) items of a project — used for dashboard rollups. */
  listByProject(projectId: string): WorkItem[] {
    return db
      .prepare(`SELECT ${COLS} FROM work_items WHERE projectId = ? AND deletedAt IS NULL`)
      .all(projectId) as WorkItem[];
  },

  insert(w: WorkItem): void {
    db.prepare(
      `INSERT INTO work_items (id, projectId, title, description, type, status, priority, progress, startDate, dueDate, createdAt, updatedAt)
       VALUES (@id, @projectId, @title, @description, @type, @status, @priority, @progress, @startDate, @dueDate, @createdAt, @updatedAt)`,
    ).run(w);
  },

  update(w: WorkItem): void {
    db.prepare(
      `UPDATE work_items SET title=@title, description=@description, type=@type, status=@status,
        priority=@priority, progress=@progress, startDate=@startDate, dueDate=@dueDate, updatedAt=@updatedAt
       WHERE id=@id AND deletedAt IS NULL`,
    ).run(w);
  },

  softDelete(id: string, when: string): void {
    db.prepare(`UPDATE work_items SET deletedAt = ?, updatedAt = ? WHERE id = ?`).run(when, when, id);
  },
};
