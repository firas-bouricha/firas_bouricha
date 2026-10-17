// Fonctionnalités : palette ⌘K, thème, filtres de projets, photos, frise, menu mobile, copie de l'e-mail.
const { test, expect } = require("@playwright/test");
const { preparePage, openSite, allProblems } = require("./helpers");

test.describe("ordinateur", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("palette de commandes : recherche et changement de page", async ({ page }) => {
    const problems = await preparePage(page);
    await openSite(page);
    await page.keyboard.press("Control+k");
    await expect(page.locator("#cmdk")).toBeVisible();
    await page.keyboard.type("terminal");
    await expect(page.locator(".cmdk__item").first()).toContainText("Ouvrir le terminal");
    await page.keyboard.press("Escape");
    await expect(page.locator("#cmdk")).toBeHidden();
    expect(await allProblems(page, problems)).toEqual([]);
    // Une section d'une autre page : la palette ouvre cette page
    await page.keyboard.press("Control+k");
    await page.keyboard.type("compétences");
    await page.keyboard.press("Enter");
    await page.waitForURL(/profil\.html#skills$/);
  });

  test("menu : une page par lien, lien actif et chemin du prompt", async ({ page }) => {
    await preparePage(page);
    await openSite(page);
    for (const [label, file, path] of [["Profil", "profil.html", "~/profil"], ["Projets", "projets.html", "~/projets"], ["Parcours", "parcours.html", "~/parcours"], ["Accueil", "index.html", "~"]]) {
      await page.click(`#nav-links a:text-is("${label}")`);
      await page.waitForURL(new RegExp(`${file.replace(".", "\\.")}$`));
      await page.waitForSelector("html[data-ready]");
      await expect(page.locator("#nav-links a.is-active")).toHaveText(label);
      await expect(page.locator("#prompt-path")).toHaveText(path);
    }
    // Contact : ancre sur la page Parcours, puis lien actif « Contact »
    await page.click('#nav-links a:text-is("Contact")');
    await page.waitForURL(/parcours\.html#contact$/);
    await expect(page.locator("#nav-links a.is-active")).toHaveText("Contact", { timeout: 5000 });
  });

  test("anciens liens de la version une page (#projects, #contact) redirigés", async ({ page }) => {
    await preparePage(page);
    await page.goto("./#projects");
    await page.waitForURL(/projets\.html$/);
    await page.goto("./#contact");
    await page.waitForURL(/parcours\.html#contact$/);
  });

  test("accueil : cartes vers les autres pages", async ({ page }) => {
    await preparePage(page);
    await openSite(page);
    await expect(page.locator(".explore__card")).toHaveCount(3);
    await page.click('.explore__card[href="projets.html"]');
    await page.waitForURL(/projets\.html$/);
    await expect(page.locator(".project").first()).toBeVisible();
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
    await openSite(page, "projets.html");
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
    await openSite(page, "parcours.html");
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
    await openSite(page, "parcours.html");
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
    expect(await allProblems(page, problems)).toEqual([]);
    await page.click('#nav-links a[href="projets.html"]');
    await page.waitForURL(/projets\.html$/);
    await page.waitForSelector("html[data-ready]");
    await expect(page.locator("#nav-links")).not.toHaveClass(/is-open/);
  });
});
