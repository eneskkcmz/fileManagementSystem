import { z } from 'zod';

/**
 * Shared building blocks used across every entity contract.
 * Backend validation, backend types and frontend types all derive from here.
 */

// Standard API response envelope (spec madde 39).
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message: string | null;
}

export interface ApiError {
  success: false;
  data: null;
  message: string;
  errors: FieldError[];
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface FieldError {
  field: string;
  message: string;
}

// Pagination (spec madde 38) — always present, even while data is small.
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

// Fields every persisted entity carries.
export const auditFields = {
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
};
