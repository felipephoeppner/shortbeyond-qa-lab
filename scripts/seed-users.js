import { readFile } from "node:fs/promises";
import { generateULID } from "../support/utils.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { Pool } from "pg";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { parse } from "csv-parse/sync";

const defaultCsvPath = fileURLToPath(new URL("../data/users.csv", import.meta.url));

/** Importa o CSV sem cabeçalho: name,email,password. Preserva contas existentes. */
export async function importarUsuarios(pool, csvPath = defaultCsvPath) {
  const users = parse(await readFile(csvPath, "utf8"), {
    columns: ["name", "email", "password"],
    bom: true,
    skip_empty_lines: true,
  });
  if (users.length === 0) throw new Error("O CSV está vazio.");

  const emails = new Set();
  for (const [index, user] of users.entries()) {
    if (!user.name.trim() || !user.email.trim() || !user.password) {
      throw new Error(`Registro ${index + 1}: nome, e-mail e senha são obrigatórios.`);
    }
    if (user.name.length > 255 || user.email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      throw new Error(`Registro ${index + 1}: nome ou e-mail inválido.`);
    }
    if (Buffer.byteLength(user.password, "utf8") > 72) {
      throw new Error(`Registro ${index + 1}: a senha excede o limite de 72 bytes do bcrypt.`);
    }
    if (emails.has(user.email)) throw new Error(`Registro ${index + 1}: e-mail repetido no CSV.`);
    emails.add(user.email);
  }

  const client = await pool.connect();
  let inserted = 0;
  try {
    await client.query("BEGIN");
    const existing = await client.query(
      "SELECT email FROM users WHERE email = ANY($1::text[])",
      [[...emails]],
    );
    const existingEmails = new Set(existing.rows.map(user => user.email));
    const pending = users.filter(user => !existingEmails.has(user.email));

    for (let offset = 0; offset < pending.length; offset += 100) {
      const values = [];
      const placeholders = [];
      for (const user of pending.slice(offset, offset + 100)) {
        const hash = await bcrypt.hash(user.password, 10);
        const start = values.length;
        values.push(generateULID(), user.name, user.email, hash);
        placeholders.push(`($${start + 1}, $${start + 2}, $${start + 3}, $${start + 4})`);
      }
      const result = await client.query(
        `INSERT INTO users (id, name, email, password)
         VALUES ${placeholders.join(", ")}
         ON CONFLICT (email) DO NOTHING`,
        values,
      );
      inserted += result.rowCount;
      console.log(`[Importação] ${Math.min(offset + 100, pending.length)}/${pending.length} novos registros processados; aguardando commit.`);
    }
    await client.query("COMMIT");
    const summary = { total: users.length, inserted, skipped: users.length - inserted };
    console.log(`[Importação] Concluída: ${summary.total} no CSV, ${summary.inserted} inseridos, ${summary.skipped} já existentes.`);
    return summary;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)), quiet: true });
  for (const key of ["DB_HOST", "DB_PORT", "DB_USER", "DB_PWD", "DB_NAME"]) {
    if (!process.env[key]) throw new Error(`Variável ${key} não configurada no .env.`);
  }
  const port = Number(process.env.DB_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("DB_PORT inválida.");
  const pool = new Pool({
    host: process.env.DB_HOST,
    port,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    connectionTimeoutMillis: 10000,
  });
  try {
    await importarUsuarios(pool, process.argv[2] ? resolve(process.argv[2]) : defaultCsvPath);
  } finally {
    await pool.end();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => {
    console.error("[Importação] Falha:", error.message);
    process.exitCode = 1;
  });
}
