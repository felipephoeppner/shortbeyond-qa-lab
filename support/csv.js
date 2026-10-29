import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import { csvPath } from "./config.js";

export async function readUsers(path = csvPath) {
  const users = parse(await readFile(path, "utf8"), {
    columns: ["name", "email", "password"], bom: true, skip_empty_lines: true,
  });
  if (!users.length) throw new Error("CSV vazio.");
  const emails = new Set();
  for (const [index, user] of users.entries()) {
    if (!user.name.trim() || user.name.length > 255 || user.email.length > 255 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) || !user.password ||
        Buffer.byteLength(user.password) > 72 || emails.has(user.email)) {
      throw new Error(`Registro ${index + 1}: dados inválidos ou e-mail repetido.`);
    }
    emails.add(user.email);
  }
  return users;
}
