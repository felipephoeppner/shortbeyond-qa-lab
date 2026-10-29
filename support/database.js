import { Pool } from "pg";
import { databaseConfig } from "./config.js";

export function createPool() {
  return new Pool(databaseConfig());
}

/** Remove somente os e-mails recebidos, incluindo seus links, em uma transação. */
export async function deleteUsersByEmail(emails) {
  if (!emails.length) return { users: 0, links: 0 };
  const pool = createPool();
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const links = await client.query(
      "DELETE FROM links WHERE user_id IN (SELECT id FROM users WHERE email = ANY($1::text[]))",
      [emails],
    );
    const users = await client.query("DELETE FROM users WHERE email = ANY($1::text[])", [emails]);
    await client.query("COMMIT");
    return { users: users.rowCount, links: links.rowCount };
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    throw error;
  } finally {
    client?.release();
    await pool.end();
  }
}
