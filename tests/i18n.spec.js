// Traduction FR / EN : dictionnaire complet sur toutes les pages, bouton, paramètre ?lang=en, choix mémorisé d'une page à l'autre.
const { test, expect } = require("@playwright/test");
const { PAGES, read, preparePage, openSite } = require("./helpers");

test("chaque texte traduisible de chaque page a sa version anglaise", () => {
  const dict = read("js/i18n.js");
  const english = new Set([...dict.matchAll(/^\s*"([\w.]+)":/gm)].map((m) => m[1]));
  const missing = [];
  for (const { file, id } of PAGES) {
    const html = read(file);
    const keys = new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]));
    for (const [, attrs] of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
      for (const [, key] of attrs.matchAll(/:\s*([\w.]+)/g)) keys.add(key);
    }
    if (id !== "accueil") keys.add(`meta.title.${id}`).add(`meta.desc.${id}`);
    missing.push(...[...keys].filter((k) => !english.has(k)).map((k) => `${file} : ${k}`));
  }
  expect(missing).toEqual([]);
});

test("bouton FR / EN, mémorisé d'une page à l'autre", async ({ page }) => {
  await preparePage(page);
  await openSite(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator(".hero__role")).toHaveText("Ingénieur Cloud & Infrastructure");
  await page.click("#lang-toggle");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".hero__role")).toHaveText("Cloud & Infrastructure Engineer");
  await page.click('#nav-links a[href="projets.html"]');
  await page.waitForSelector("html[data-ready]");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle("Projects · Firas Bouricha");
  await expect(page.locator(".project").first()).toContainText("A GLPI request");
});

test("lien direct ?lang=en sur chaque page", async ({ page }) => {
  await preparePage(page);
  for (const { file } of PAGES) {
    await openSite(page, `${file}?lang=en`);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(await page.title()).not.toMatch(/Ingénieur|compétences|Parcours/);
  }
});
