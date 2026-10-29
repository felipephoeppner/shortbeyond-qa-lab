import { writeFile } from "node:fs/promises";
import { csvPath } from "../support/config.js";

const count = Number(process.argv[2] ?? 2000);
if (!Number.isInteger(count) || count < 1 || count > 100000) throw new Error("Informe uma quantidade inteira de 1 a 100000.");
const rows = Array.from({ length: count }, (_, i) => {
  const id = String(i + 1).padStart(2, "0");
  return `Usuario Performance ${id},performance${id}@teste.com,senha123`;
});
await writeFile(csvPath, rows.join("\n") + "\n");
console.log(`${count} usuários fictícios gravados em data/users.csv (sem cabeçalho).`);
