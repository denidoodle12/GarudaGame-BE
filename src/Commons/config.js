import dotenv from 'dotenv';
import path from 'path';

const isTest = process.env.NODE_ENV === 'test';
const testEnv = isTest
  ? dotenv.config({ path: path.resolve(process.cwd(), '.test.env'), override: true })
  : null;

if (!isTest || testEnv.error) {
  dotenv.config();
}

const databaseEnv = isTest
  ? (testEnv.error ? {
    host: process.env.PGHOST_TEST,
    port: process.env.PGPORT_TEST,
    user: process.env.PGUSER_TEST,
    password: process.env.PGPASSWORD_TEST,
    database: process.env.PGDATABASE_TEST,
  } : {
    host: testEnv.parsed.PGHOST,
    port: testEnv.parsed.PGPORT,
    user: testEnv.parsed.PGUSER,
    password: testEnv.parsed.PGPASSWORD,
    database: testEnv.parsed.PGDATABASE,
  })
  : {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  };

if (isTest && Object.values(databaseEnv).some((value) => !value)) {
  throw new Error('Konfigurasi database test belum lengkap');
}

const config = {
  app: {
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: process.env.PORT,
  },
  database: databaseEnv,
  auth: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
  },
};

export default config;
