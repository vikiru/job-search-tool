import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/job_search_tool',
  },
});

// 1. npx drizzle-kit push
// OR
// 1. npx drizzle-kit generate --name <migration_name>
// 2. npx drizzle-kit migrate
// 3. npx drizzle-kit push

// npx drizzle-kit studio OR npm run studio
