// Tests automatiques du site (npm test). Lancés aussi par GitHub Actions sur chaque PR.
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "tests",
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://127.0.0.1:4173/firas_bouricha/",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node tests/server.js",
    url: "http://127.0.0.1:4173/firas_bouricha/",
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
