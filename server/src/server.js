import { app } from './app.js';
import { pool } from './config/db.js';
import { env } from './config/env.js';

const server = app.listen(env.port, () => {
  console.log(`ShopSphere API running on http://localhost:${env.port}/api`);
});

function shutdown(signal) {
  console.log(`${signal} received, closing server...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
