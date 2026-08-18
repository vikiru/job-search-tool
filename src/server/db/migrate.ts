/* oxlint-disable import/no-unassigned-import -- migration CLI loads documented environment configuration for Drizzle. */

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
