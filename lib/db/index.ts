import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Singleton pattern for Drizzle client
let db: ReturnType<typeof drizzle>;

export function getDb() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }
    db = drizzle({
      connection: process.env.DATABASE_URL,
      schema,
    });
  }
  return db;
}

export { schema };
