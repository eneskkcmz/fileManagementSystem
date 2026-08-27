import { randomUUID } from 'node:crypto';

/**
 * Prefixed IDs (spec madde 8) — a readable prefix + uuid so logs stay debuggable.
 * IDs are always generated server-side, never trusted from the client.
 */
export function generateId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
