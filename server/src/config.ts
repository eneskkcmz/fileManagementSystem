import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '..');

function resolveFromRoot(p: string): string {
  return path.isAbsolute(p) ? p : path.resolve(serverRoot, p);
}

export const config = {
  port: Number(process.env.PORT ?? 5050),
  dbPath: resolveFromRoot(process.env.DB_PATH ?? './data/app.db'),
  storagePath: resolveFromRoot(process.env.STORAGE_PATH ?? './storage'),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
} as const;
