// Performance : budget de poids, polices locales, haut de page affiché sans attendre le JavaScript.
const { test, expect } = require("@playwright/test");
const { PAGES, preparePage, openSite, scrollThrough } = require("./helpers");

for (const { file, id } of PAGES) test(`budget ${id} : moins de 700 Ko et aucune ressource externe`, async ({ page }) => {
  await preparePage(page);
  let bytes = 0;
  const external = [];
  page.on("response", async (r) => {
    const url = r.url();
    if (!url.startsWith("http://127.0.0.1")) { if (!/jogruber/.test(url)) external.push(url); return; }
    try { bytes += (await r.body()).length; } catch { /* redirection */ }
  });
  await openSite(page, file);
  await scrollThrough(page);
  await page.waitForLoadState("networkidle");
  expect(external, "ressources chargées hors du site").toEqual([]);
  expect(bytes / 1024, "poids total en Ko").toBeLessThan(700);
});

test("polices hébergées sur le site et chargées", async ({ page }) => {
  await preparePage(page);
  await openSite(page);
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family));
  expect(loaded).toEqual(expect.arrayContaining(["Space Grotesk", "JetBrains Mono"]));
});

test("le haut de page s'affiche même si le JavaScript du site ne charge pas", async ({ page }) => {
  await preparePage(page);
  await page.route(/\/js\/(main|core|modules\/)/, (route) => route.abort());
  await page.goto("./");
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.querySelector(".hero__lead")).opacity), { timeout: 2000 }).toBe("1");
});

test("sans JavaScript : contenu lisible, about.md à la place du terminal", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("./");
  await expect(page.locator("h1")).toContainText("Firas Bouricha");
  await page.goto("./profil.html");
  await expect(page.locator("#pane-about")).toBeVisible();
  await expect(page.locator("#pane-term")).toBeHidden();
  await page.goto("./projets.html");
  await expect(page.getByRole("link", { name: "github.com/firas-bouricha" })).toBeVisible();
  await context.close();
});
