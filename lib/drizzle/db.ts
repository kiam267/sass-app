import 'dotenv/config';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Singleton pattern for Drizzle client
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema });
