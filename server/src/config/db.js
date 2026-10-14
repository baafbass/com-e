import pg from 'pg';
import { env } from './env.js';

// Return NUMERIC and BIGINT (e.g. COUNT) columns as JavaScript numbers instead of strings.
pg.types.setTypeParser(pg.types.builtins.NUMERIC, Number.parseFloat);
pg.types.setTypeParser(pg.types.builtins.INT8, (value) => Number.parseInt(value, 10));

// Neon requires SSL; it is enabled by `sslmode=require` in the connection string.
export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  max: env.dbPoolMax,
  idleTimeoutMillis: 30_000,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error.message);
});

const toCamelCase = (key) => key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const camelizeRow = (row) =>
  Object.fromEntries(Object.entries(row).map(([key, value]) => [toCamelCase(key), value]));

/** Builds a query function that returns rows with camelCase keys. */
const createExecutor = (client) => async (text, params) => {
  const { rows } = await client.query(text, params);
  return rows.map(camelizeRow);
};

export const query = createExecutor(pool);

/** Runs `callback` inside a transaction; it receives a query function bound to the transaction. */
export async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(createExecutor(client));
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
