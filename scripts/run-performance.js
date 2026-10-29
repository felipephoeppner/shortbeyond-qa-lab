import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import YAML from "yaml";
import { baseURL, projectRoot } from "../support/config.js";

const name = process.argv[2];
const allowed = ["health", "register", "login", "spike", "seed", "smoke"];
if (!allowed.includes(name)) throw new Error(`Escolha: ${allowed.join(", ")}.`);
const require = createRequire(import.meta.url);
const artilleryBin = join(dirname(require.resolve("artillery/package.json")), "bin/run");
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const outputDir = resolve(projectRoot, "reports/performance", runId);
await mkdir(outputDir, { recursive: true });

async function runScenario(name, scenarioIndex = null) {
  const source = resolve(projectRoot, name === "seed" ? "scripts/seed-users-api.yaml" : `performance/scenarios/${name}.yaml`);
  const definition = YAML.parse(await readFile(source, "utf8"));
  definition.config.target = baseURL.replace(/\/$/, "") + (name === "health" ? "" : "/api");
  if (definition.config.payload) {
    definition.config.payload.path = resolve(dirname(source), definition.config.payload.path);
  }
  const smoke = scenarioIndex !== null;
  if (smoke) {
    definition.config.phases = [{ name: "smoke", duration: 1, arrivalCount: 1 }];
    definition.scenarios = [definition.scenarios[scenarioIndex]];
    delete definition.scenarios[0].weight;
  }
  const label = `${name}${smoke ? "-" + scenarioIndex : ""}`;
  const input = join(outputDir, `${label}.yaml`);
  const report = join(outputDir, `${label}.json`);
  await writeFile(input, YAML.stringify(definition));
  await new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, [artilleryBin, "run", input, "--output", report], {
      cwd: projectRoot, stdio: "inherit",
    });
    child.on("error", reject);
    child.on("exit", code => code === 0 ? resolvePromise() : reject(new Error(`Artillery terminou com código ${code}.`)));
  });
  // O Artillery pode terminar com código zero mesmo com erros HTTP/expect.
  const result = JSON.parse(await readFile(report, "utf8"));
  const counters = result.aggregate?.counters;
  if (!counters || !(counters["http.responses"] > 0)) throw new Error("Nenhuma resposta HTTP no relatório.");
  const failures = Object.entries(counters).filter(([key, value]) =>
    value > 0 && (key === "vusers.failed" || key === "plugins.expect.failed" || key.startsWith("errors.")));
  if (failures.length) throw new Error(`Falhas em ${label}: ${JSON.stringify(failures)}. Consulte ${report}`);
  console.log(`Relatório: ${report}`);
}

if (name === "smoke") {
  // Executa cada fluxo exatamente uma vez; pesos não deixam cenários de fora.
  for (const scenarioName of ["health", "register", "login", "spike"]) {
    const file = resolve(projectRoot, `performance/scenarios/${scenarioName}.yaml`);
    const definition = YAML.parse(await readFile(file, "utf8"));
    for (let index = 0; index < definition.scenarios.length; index++) {
      await runScenario(scenarioName, index);
    }
  }
} else {
  await runScenario(name);
}
