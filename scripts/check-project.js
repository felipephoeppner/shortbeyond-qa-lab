import { readdir, readFile, access } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import YAML from "yaml";
import { projectRoot, csvPath } from "../support/config.js";
import { readUsers } from "../support/csv.js";

async function filesIn(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", "reports"].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await filesIn(path));
    else result.push(path);
  }
  return result;
}
const files = await filesIn(projectRoot);
for (const file of files) {
  if (file.endsWith(".js")) {
    const check = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (check.status !== 0) throw new Error(check.stderr);
  }
  if (/\.ya?ml$/.test(file)) {
    const document = YAML.parse(await readFile(file, "utf8"));
    if (document.config?.payload) await access(resolve(dirname(file), document.config.payload.path));
  }
  if (file.endsWith(".md")) {
    const markdown = await readFile(file, "utf8");
    for (const match of markdown.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1].split("#")[0];
      if (!target || /^[a-z]+:/i.test(target)) continue;
      await access(resolve(dirname(file), decodeURIComponent(target)));
    }
  }
}
const users = await readUsers(csvPath);
console.log(`Estrutura válida: JavaScript, YAML, links locais da documentação, payloads e ${users.length} usuários únicos no CSV.`);
