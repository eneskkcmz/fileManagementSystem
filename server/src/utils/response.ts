import type { Response } from 'express';
import type { ApiSuccess, Paginated } from '@fms/shared';

export function ok<T>(res: Response, data: T, status = 200, message: string | null = null): void {
  const body: ApiSuccess<T> = { success: true, data, message };
  res.status(status).json(body);
}

export function created<T>(res: Response, data: T, message: string | null = null): void {
  ok(res, data, 201, message);
}

export function paginate<T>(items: T[], page: number, pageSize: number, totalCount: number): Paginated<T> {
  return {
    items,
    page,
    pageSize,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
  };
}
