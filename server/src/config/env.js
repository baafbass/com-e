import 'dotenv/config';

const REQUIRED_VARIABLES = ['DATABASE_URL', 'JWT_SECRET'];

const missing = REQUIRED_VARIABLES.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  databaseUrl: process.env.DATABASE_URL,
  dbPoolMax: Number(process.env.DB_POOL_MAX ?? 10),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  clientUrls: (process.env.CLIENT_URL ?? 'http://localhost:5173').split(',').map((url) => url.trim()),
  adminEmail: process.env.ADMIN_EMAIL ?? 'admin@shopsphere.com',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'Admin@1234',
});

export const isProduction = env.nodeEnv === 'production';
