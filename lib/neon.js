import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let sql = null;

if (DATABASE_URL) {
  try {
    sql = neon(DATABASE_URL);
  } catch (err) {
    console.warn('Neon connection initialization warning:', err.message);
  }
}

export { sql };
