import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema/app';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const db = drizzle(process.env.DATABASE_URL, { schema });
