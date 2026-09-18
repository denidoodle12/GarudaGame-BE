const tables = ['threads', 'comments', 'replies'];

export const up = (pgm) => {
  for (const table of tables) {
    pgm.sql(`ALTER TABLE "${table}" ALTER COLUMN "date" TYPE TIMESTAMPTZ USING "date" AT TIME ZONE 'UTC'`);
  }
};

export const down = (pgm) => {
  for (const table of [...tables].reverse()) {
    pgm.sql(`ALTER TABLE "${table}" ALTER COLUMN "date" TYPE TIMESTAMP USING "date" AT TIME ZONE 'UTC'`);
  }
};
