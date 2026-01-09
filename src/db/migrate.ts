import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1, // Only need one connection for migrations
  });

  const db = drizzle(pool);

  console.log('Running migrations...');

  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
