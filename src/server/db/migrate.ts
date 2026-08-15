import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '@/server/db';

async function runMigrations() {
  await migrate(db, { migrationsFolder: './drizzle' });
}

runMigrations().catch(() => {
  process.exit(1);
});
