import type { ZodTypeAny, infer as ZodInfer } from 'zod';
import { AppError } from '../utils/AppError';

/**
 * Validate & parse an unknown payload with a shared Zod schema (spec madde 53).
 * On failure it throws a 400 AppError carrying per-field messages.
 */
export function parseOrThrow<S extends ZodTypeAny>(schema: S, payload: unknown): ZodInfer<S> {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.') || '(root)',
      message: issue.message,
    }));
    throw AppError.badRequest('Dogrulama hatasi', errors);
  }
  return result.data;
}
