import { createApp } from './app';
import { config } from './config';
import './db/connection'; // opens DB + runs migrations on boot

const app = createApp();

app.listen(config.port, () => {
  console.log(`[server] API listening on http://localhost:${config.port}/api`);
  console.log(`[server] DB: ${config.dbPath}`);
});
