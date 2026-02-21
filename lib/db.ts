import { neon, neonConfig } from '@neondatabase/serverless';

// This allows the driver to work correctly in serverless environments like Netlify
neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// We export the standard 'neon' function for simple queries
export const sql = neon(process.env.DATABASE_URL);
