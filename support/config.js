import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

export const projectRoot = fileURLToPath(new URL("../", import.meta.url));
dotenv.config({ path: new URL("../.env", import.meta.url), quiet: true });
export const baseURL = process.env.BASE_API || "http://127.0.0.1:3433";
export const csvPath = fileURLToPath(new URL("../data/users.csv", import.meta.url));

export function databaseConfig() {
  for (const key of ["DB_HOST", "DB_PORT", "DB_USER", "DB_PWD", "DB_NAME"]) {
    if (!process.env[key]) throw new Error(`Configure ${key} no .env; execute npm run setup.`);
  }
  const port = Number(process.env.DB_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("DB_PORT inválida.");
  return {
    host: process.env.DB_HOST, port, user: process.env.DB_USER,
    password: process.env.DB_PWD, database: process.env.DB_NAME,
    connectionTimeoutMillis: 10000,
  };
}
