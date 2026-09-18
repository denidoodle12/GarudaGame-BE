import { runner } from 'node-pg-migrate';

process.env.NODE_ENV = 'test';

const { default: config } = await import('../src/Commons/config.js');
const direction = process.argv[2] ?? 'up';

if (!['up', 'down'].includes(direction)) {
  throw new Error('Arah migrasi harus up atau down');
}

await runner({
  databaseUrl: config.database,
  dir: 'migrations',
  direction,
  migrationsTable: 'pgmigrations',
});
