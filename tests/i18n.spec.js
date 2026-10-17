// Traduction FR / EN : dictionnaire complet, bouton, paramètre ?lang=en, mémorisation.
const { test, expect } = require("@playwright/test");
const { read, preparePage, openSite } = require("./helpers");

test("chaque texte traduisible a sa version anglaise", () => {
  const html = read("index.html");
  const dict = read("js/i18n.js");
  const keys = new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]));
  for (const [, attrs] of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
    for (const [, key] of attrs.matchAll(/:\s*([\w.]+)/g)) keys.add(key);
  }
  const english = new Set([...dict.matchAll(/^\s*"([\w.]+)":/gm)].map((m) => m[1]));
  expect([...keys].filter((k) => !english.has(k))).toEqual([]);
});

test("bouton FR / EN et mémorisation", async ({ page }) => {
  await preparePage(page);
  await openSite(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator(".hero__role")).toHaveText("Ingénieur Cloud & Infrastructure");
  await page.click("#lang-toggle");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".hero__role")).toHaveText("Cloud & Infrastructure Engineer");
  await expect(page.locator(".project").first()).toContainText("A GLPI request");
  await page.reload();
  await page.waitForSelector("html[data-ready]");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("lien direct ?lang=en", async ({ page }) => {
  await preparePage(page);
  await openSite(page, "?lang=en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(/Cloud & Infrastructure Engineer/);
});
