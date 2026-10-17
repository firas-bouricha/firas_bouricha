// Fonctionnalités : palette ⌘K, thème, filtres de projets, photos, frise, menu mobile, copie de l'e-mail.
const { test, expect } = require("@playwright/test");
const { preparePage, openSite, allProblems } = require("./helpers");

test.describe("ordinateur", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("palette de commandes", async ({ page }) => {
    const problems = await preparePage(page);
    await openSite(page);
    await page.keyboard.press("Control+k");
    await expect(page.locator("#cmdk")).toBeVisible();
    await page.keyboard.type("terminal");
    await expect(page.locator(".cmdk__item").first()).toContainText("Ouvrir le terminal");
    await page.keyboard.press("Escape");
    await expect(page.locator("#cmdk")).toBeHidden();
    expect(await allProblems(page, problems)).toEqual([]);
  });

  test("thème mémorisé", async ({ page }) => {
    await preparePage(page);
    await openSite(page);
    await page.click("#theme-toggle");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("light");
  });

  test("filtres de projets", async ({ page }) => {
    await preparePage(page);
    await openSite(page);
    const all = await page.locator(".project").count();
    await page.click('.filter[data-filter="DevSecOps"]');
    await expect(page.locator(".project")).toHaveCount(1);
    await page.click('.filter[data-filter=""]');
    await expect(page.locator(".project")).toHaveCount(all);
  });

  test("visionneuse de photos", async ({ page }) => {
    await preparePage(page);
    await openSite(page);
    const front = () => page.locator('.deck__card[data-pos="0"] img').getAttribute("src");
    const first = await front();
    await page.click('[data-deck="next"]');
    await expect.poll(front).not.toBe(first);
    await page.click('[data-deck="prev"]');
    await expect.poll(front).toBe(first);
  });

  test("frise : les étapes s'allument au défilement", async ({ page }) => {
    await preparePage(page);
    await openSite(page);
    const box = await page.evaluate(() => {
      const el = document.getElementById("journey-timeline");
      return { top: el.getBoundingClientRect().top + window.scrollY, height: el.offsetHeight };
    });
    await page.evaluate((y) => window.scrollTo(0, y), box.top + box.height - 900);
    await expect.poll(() => page.locator(".journey__item.is-lit").count(), { timeout: 5000 }).toBe(await page.locator(".journey__item").count());
  });

  test("copie de l'adresse e-mail", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await preparePage(page);
    await openSite(page);
    await page.click("#copy-email");
    await expect(page.locator("#toast")).toContainText("copié");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("firas.bouricha@outlook.fr");
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("menu mobile", async ({ page }) => {
    const problems = await preparePage(page);
    await openSite(page);
    await page.click("#nav-toggle");
    await expect(page.locator("#nav-links")).toHaveClass(/is-open/);
    await page.click('#nav-links a[href="#projects"]');
    await expect(page.locator("#nav-links")).not.toHaveClass(/is-open/);
    expect(await allProblems(page, problems)).toEqual([]);
  });
});
