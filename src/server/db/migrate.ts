import 'dotenv/config';

import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '@/server/db';

async function runMigrations() {
  await migrate(db, { migrationsFolder: './drizzle' });
}

runMigrations().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
