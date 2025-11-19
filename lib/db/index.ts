import 'dotenv/config';
import * as schema from './schema';
import { neon } from '@neondatabase/serverless';
console.log(process.env.DATABASE_URL);

// Singleton pattern for Drizzle client
if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

import { drizzle } from 'drizzle-orm/neon-http';
export const db = drizzle(
  process.env.NEXT_PUBLIC_DATABASE_URL,
  {
    schema,
  }
);

export { schema };
