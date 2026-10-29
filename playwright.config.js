import { defineConfig } from "@playwright/test";
import { baseURL } from "./support/config.js";

export default defineConfig({
  testDir: "./tests/api",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  outputDir: "reports/test-results",
  reporter: [["list"], ["html", { outputFolder: "reports/playwright", open: "never" }]],
  use: { baseURL, trace: "retain-on-failure" },
  projects: [{ name: "api-tests" }],
});
