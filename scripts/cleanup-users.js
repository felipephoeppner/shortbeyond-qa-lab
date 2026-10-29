import { readUsers } from "../support/csv.js";
import { createPool, deleteUsersByEmail } from "../support/database.js";

const scope = process.argv[2] || "performance";
if (!["performance", "api"].includes(scope)) throw new Error("Use performance ou api.");
const pool = createPool();
let emails;
try {
  if (scope === "api") {
    const result = await pool.query("SELECT email FROM users WHERE email LIKE $1", ["%@qa.example.test"]);
    emails = result.rows.map(user => user.email);
  } else {
    const users = await readUsers();
    const result = await pool.query("SELECT email FROM users WHERE email LIKE $1", ["%@load.example.test"]);
    emails = [...new Set([...users.map(user => user.email), ...result.rows.map(user => user.email)])];
  }
} finally { await pool.end(); }
const result = await deleteUsersByEmail(emails);
console.log(`Limpeza ${scope}: ${result.users} usuários e ${result.links} links removidos.`);
