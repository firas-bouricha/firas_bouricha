// Accessibilité : aucune alerte axe-core (WCAG 2.1 AA + bonnes pratiques), sur chaque page, thèmes sombre et clair.
const { test, expect } = require("@playwright/test");
const { PAGES, preparePage, openSite, scrollThrough } = require("./helpers");
const AXE = require.resolve("axe-core/axe.min.js");

test.use({ bypassCSP: true }); // permet d'injecter axe-core malgré la CSP du site

for (const { file, id } of PAGES) {
  for (const theme of ["dark", "light"]) {
    for (const width of [1440, 390]) {
      test(`axe ${id} ${theme} ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await preparePage(page, { theme });
        await openSite(page, file);
        await scrollThrough(page);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(1200);
        await page.addScriptTag({ path: AXE });
        const violations = await page.evaluate(async () => {
          const result = await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] });
          return result.violations.map((v) => `${v.id} (${v.nodes.length}) : ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
        });
        expect(violations).toEqual([]);
      });
    }
  }
}
