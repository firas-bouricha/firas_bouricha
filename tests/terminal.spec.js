// Terminal interactif : commandes, complétion, historique, langue, thème, navigation, sécurité de l'affichage.
const { test, expect } = require("@playwright/test");
const { preparePage, openSite, allProblems } = require("./helpers");

for (const mobile of [false, true]) {
  test.describe(mobile ? "mobile" : "ordinateur", () => {
    test.use(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 } });

    test("commandes du terminal", async ({ page, context }) => {
      await context.route("https://github.com/**", (route) => route.fulfill({ status: 200, body: "ok" }));
      const problems = await preparePage(page);
      await openSite(page);
      const out = page.locator("#term-out");
      const input = page.locator("#term-input");
      const run = async (command) => { await input.fill(command); await input.press("Enter"); };

      // Ouvert par défaut, accueil avec neofetch
      await expect(page.locator("#pane-term")).toBeVisible();
      await page.locator("#editor").scrollIntoViewIfNeeded();
      await expect(out).toContainText("help");
      await expect(out).toContainText("Portfolio OS");

      await run("help");
      await expect(out).toContainText("neofetch");
      await run("clear");
      await run("ls");
      await expect(out).toContainText("about.md");
      await expect(out).not.toContainText(".mystere");
      await run("ls -la");
      await expect(out).toContainText("-rw-------");
      await expect(out).toContainText(".mystere");
      await run("cat .mystere");
      await expect(out).toContainText("Tunisie");
      await run("cat main.tf");
      await expect(out).toContainText("proxmox_virtual_environment_vm");
      await run("cat nope");
      await expect(out).toContainText("aucun fichier");
      await run("foo");
      await expect(out).toContainText("commande introuvable");
      // Le texte tapé est affiché, jamais interprété comme du HTML
      await run('<img src=x onerror="window.__pwned=1">');
      await expect(out.locator("img")).toHaveCount(0);
      expect(await page.evaluate(() => window.__pwned)).toBeUndefined();
      await run("projets");
      await expect(out).toContainText("VM as a Service");

      // Complétion et historique
      await input.fill("neo");
      await input.press("Tab");
      await expect(input).toHaveValue("neofetch ");
      await input.fill("cat .my");
      await input.press("Tab");
      await expect(input).toHaveValue("cat .mystere ");
      await input.fill("");
      await input.press("ArrowUp");
      await expect(input).toHaveValue("projets");
      await input.fill("");

      // Langue et thème
      await run("lang en");
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await run("help");
      await expect(out).toContainText("Available commands");
      await run("lang fr");
      await run("theme light");
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
      await run("theme dark");

      // open : nouvel onglet vers le dépôt
      const popup = context.waitForEvent("page");
      await run("open 1");
      expect((await popup).url()).toContain("github.com/firas-bouricha/");

      // cd : défilement jusqu'à la section
      await run("cd contact");
      await expect.poll(() => page.evaluate(() => document.getElementById("contact").getBoundingClientRect().top), { timeout: 5000 })
        .toBeLessThan(200);

      // exit puis réouverture depuis la barre d'état
      await run("exit");
      await expect(page.locator("#pane-about")).toBeVisible();
      await page.click("[data-open-term]");
      await expect(page.locator("#pane-term")).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.getElementById("editor").getBoundingClientRect().top), { timeout: 5000 })
        .toBeLessThan(300);

      expect(await allProblems(page, problems)).toEqual([]);
    });
  });
}
