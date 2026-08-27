import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Consume the shared contract as source so there is one type/schema origin.
      '@fms/shared': path.resolve(dir, '../shared/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Dev proxy → no CORS juggling; prod can point VITE_API_URL elsewhere.
      '/api': 'http://localhost:5050',
    },
  },
});
