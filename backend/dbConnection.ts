import knex from "knex";
import * as config from "./knexfile";

export const dbConnection = knex(
  (config as any).default[process.env.NODE_ENV!]
);
