import { configDotenv } from "dotenv";
import type { Knex } from "knex";

configDotenv({ path: ".env" });
configDotenv({ path: ".env.local", override: true });

if (
  !process.env.DB_HOST ||
  !process.env.DB_NAME ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_PORT
) {
  throw new Error(
    "DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, and DB_PORT must be set"
  );
}

const baseConfig: Knex.Config = {
  client: "postgresql",
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
  },
  migrations: {
    tableName: "knex_migrations",
  },
};

const config: { [key: string]: Knex.Config } = {
  development: baseConfig,
  production: {
    ...baseConfig,
    pool: {
      min: 2,
      max: 10,
    },
  },
};

module.exports = config;
