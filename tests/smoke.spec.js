// Le site s'affiche sans erreur, sans débordement horizontal, à toutes les largeurs et dans les deux thèmes.
const { test, expect } = require("@playwright/test");
const { preparePage, openSite, scrollThrough, allProblems } = require("./helpers");

const WIDTHS = [320, 390, 768, 1024, 1280, 1440];

for (const theme of ["dark", "light"]) {
  for (const width of WIDTHS) {
    test(`affichage ${theme} ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const problems = await preparePage(page, { theme });
      await openSite(page);
      await scrollThrough(page);

      const layout = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const visible = [...document.querySelectorAll(".prompt, .nav__pill, .nav__tools > *")]
          .filter((el) => el.offsetParent && getComputedStyle(el).position !== "fixed")
          .map((el) => el.getBoundingClientRect())
          .filter((r) => r.width)
          .sort((a, b) => a.left - b.left);
        const overlap = visible.some((r, i) => i && visible[i - 1].right > r.left + 1);
        return { overflow: document.documentElement.scrollWidth - vw, navRight: Math.max(...visible.map((r) => r.right)) - vw, overlap };
      });
      expect(layout.overflow, "débordement horizontal de la page").toBeLessThanOrEqual(0);
      expect(layout.navRight, "le menu sort de l'écran").toBeLessThanOrEqual(0);
      expect(layout.overlap, "éléments du menu qui se chevauchent").toBe(false);
      await expect(page.locator(".project").first()).toBeVisible();
      expect(await allProblems(page, problems)).toEqual([]);
    });
  }
}
