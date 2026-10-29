import { randomBytes } from "node:crypto";

/** ULID válido para testar IDs inexistentes, no formato utilizado pela aplicação. */
export function generateULID() {
  const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  let time = Date.now();
  let prefix = "";
  for (let i = 0; i < 10; i++) {
    prefix = alphabet[time % 32] + prefix;
    time = Math.floor(time / 32);
  }
  return prefix + [...randomBytes(16)].map(byte => alphabet[byte % 32]).join("");
}
