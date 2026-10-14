import { readFile } from 'node:fs/promises';
import { pool } from '../config/db.js';

const SCHEMA_FILE = new URL('./schema.sql', import.meta.url);

async function migrate() {
  const schema = await readFile(SCHEMA_FILE, 'utf8');
  await pool.query(schema);
  console.log('Database schema is up to date.');
}

migrate()
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
