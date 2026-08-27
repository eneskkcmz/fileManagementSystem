import type { Factory } from '@fms/shared';
import { db } from '../db/connection';

const COLS = 'id, name, code, description, createdAt, updatedAt';

export const factoryRepository = {
  list(limit: number, offset: number): Factory[] {
    return db
      .prepare(`SELECT ${COLS} FROM factories WHERE deletedAt IS NULL ORDER BY createdAt DESC LIMIT ? OFFSET ?`)
      .all(limit, offset) as Factory[];
  },

  count(): number {
    const row = db.prepare(`SELECT COUNT(*) AS c FROM factories WHERE deletedAt IS NULL`).get() as { c: number };
    return row.c;
  },

  getById(id: string): Factory | undefined {
    return db
      .prepare(`SELECT ${COLS} FROM factories WHERE id = ? AND deletedAt IS NULL`)
      .get(id) as Factory | undefined;
  },

  existsByCode(code: string, excludeId?: string): boolean {
    const row = db
      .prepare(`SELECT 1 FROM factories WHERE code = ? AND deletedAt IS NULL AND id != ? LIMIT 1`)
      .get(code, excludeId ?? '') as unknown;
    return row !== undefined;
  },

  insert(f: Factory): void {
    db.prepare(
      `INSERT INTO factories (id, name, code, description, createdAt, updatedAt)
       VALUES (@id, @name, @code, @description, @createdAt, @updatedAt)`,
    ).run(f);
  },

  update(f: Factory): void {
    db.prepare(
      `UPDATE factories SET name=@name, code=@code, description=@description, updatedAt=@updatedAt
       WHERE id=@id AND deletedAt IS NULL`,
    ).run(f);
  },

  softDelete(id: string, when: string): void {
    db.prepare(`UPDATE factories SET deletedAt = ?, updatedAt = ? WHERE id = ?`).run(when, when, id);
  },
};
