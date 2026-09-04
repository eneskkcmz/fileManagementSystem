import type {Factory, Person} from '@fms/shared';
import { db } from '../db/connection';

const COLS = 'id , name , email , phone , createdAt , updatedAt , deletedAt';

export const personRepository = {
    list(limit: number, offset: number): Person[] {
        return db
            .prepare(`SELECT ${COLS} FROM persons WHERE deletedAt IS NULL ORDER BY createdAt DESC LIMIT ? OFFSET ?`)
            .all(limit, offset) as Person[];
    },

    count(): number {
    const row = db.prepare(`SELECT COUNT(*) AS c FROM persons WHERE deletedAt IS NULL`).get() as { c: number };
    return row.c;
    },

    getById(id: string): Person| undefined {
    return db
        .prepare(`SELECT ${COLS} FROM persons WHERE id = ? AND deletedAt IS NULL`)
        .get(id) as Person | undefined;
    },

    existsByEmail(email: string, excludeId?: string): boolean {
        const row = db
            .prepare(`SELECT 1 FROM persons WHERE email = ? AND deletedAt IS NULL AND id != ? LIMIT 1`)
            .get(email, excludeId ?? '') as unknown;
        return row !== undefined;
    },

    insert(f: Person): void {
        db.prepare(
            `INSERT INTO persons (id , name , email , phone , createdAt , updatedAt , deletedAt)
       VALUES (@id , @name , @email , @phone , @createdAt , @updatedAt , @deletedAt)`,
        ).run(f);
    },
    update(f: Person): void {
        db.prepare(
            `UPDATE persons SET name=@name, email=@email, phone=@phone , updatedAt=@updatedAt
       WHERE id=@id AND deletedAt IS NULL`,
        ).run(f);
    },

    softDelete(id: string, when: string): void {
        db.prepare(`UPDATE persons SET deletedAt = ?, updatedAt = ? WHERE id = ?`).run(when, when, id);
    },
};
