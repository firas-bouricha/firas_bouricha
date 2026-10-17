// Référencement, partage, sécurité et cohérence des fichiers (vérifications sans navigateur quand c'est possible).
const { test, expect } = require("@playwright/test");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { ROOT, read, preparePage } = require("./helpers");

const SITE = "https://firas-bouricha.github.io/firas_bouricha/";
const html = read("index.html");
const meta = (attr, name) => (html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`)) || [])[1];

/** Empreintes SHA-256 des scripts intégrés (hors JSON-LD), au format CSP. */
function inlineHashes(source) {
  return [...source.matchAll(/<script(\b[^>]*)>([\s\S]*?)<\/script>/g)]
    .filter(([, attrs]) => !/\bsrc=/.test(attrs) && !/ld\+json/.test(attrs))
    .map(([, , body]) => `'sha256-${crypto.createHash("sha256").update(body).digest("base64")}'`);
}

test("CSP : les empreintes correspondent aux scripts intégrés", () => {
  for (const file of ["index.html", "404.html"]) {
    const source = read(file);
    const csp = (source.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/) || [])[1];
    expect(csp, `CSP absente de ${file}`).toBeTruthy();
    for (const hash of inlineHashes(source)) expect(csp, `${file} : empreinte manquante (script intégré modifié ?)`).toContain(hash);
    expect(csp, `${file} : plugins (object-src) non bloqués`).toMatch(/object-src 'none'|default-src 'none'/);
  }
});

test("version identique partout (scripts/bump-version.sh)", () => {
  const version = meta("name", "site-version");
  expect(JSON.parse(read("version.json")).version).toBe(version);
  const tags = [...html.matchAll(/\?v=([\w-]+)/g)].map((m) => m[1]);
  expect(tags.length).toBeGreaterThan(5);
  expect(new Set(tags)).toEqual(new Set([version]));
});

test("tous les fichiers locaux référencés existent", () => {
  const refs = [...html.matchAll(/(?:href|src)="([^"#:]+?)(?:\?[^"]*)?"/g)].map((m) => m[1]).filter((r) => !r.startsWith("//"));
  const data = read("data/projects.js");
  refs.push(...[...data.matchAll(/image:\s*"([^"]+)"/g)].map((m) => m[1]));
  const manifest = JSON.parse(read("site.webmanifest"));
  refs.push(...manifest.icons.map((i) => i.src));
  const missing = [...new Set(refs)].filter((r) => !fs.existsSync(path.join(ROOT, r)));
  expect(missing).toEqual([]);
});

test("partage : Open Graph, Twitter/X, image 1200 × 630", async ({ page }) => {
  expect(meta("property", "og:image")).toBe(`${SITE}assets/og-image.jpg`);
  expect(meta("property", "og:image:width")).toBe("1200");
  expect(meta("property", "og:image:height")).toBe("630");
  expect(meta("name", "twitter:card")).toBe("summary_large_image");
  expect(meta("property", "og:image:alt")).toBeTruthy();
  await page.goto("./assets/og-image.jpg");
  const size = await page.evaluate(() => { const img = document.querySelector("img"); return [img.naturalWidth, img.naturalHeight]; });
  expect(size).toEqual([1200, 630]);
});

test("référencement : canonical, hreflang, sitemap, JSON-LD", () => {
  expect(html).toContain(`<link rel="canonical" href="${SITE}">`);
  for (const lang of ["fr", "en", "x-default"]) expect(html).toContain(`hreflang="${lang}"`);
  const sitemap = read("sitemap.xml");
  expect(sitemap).toContain(`<loc>${SITE}</loc>`);
  expect(sitemap).toContain(`<loc>${SITE}?lang=en</loc>`);
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  expect(ld["@type"]).toBe("Person");
  expect((html.match(/<h1\b/g) || []).length).toBe(1);
});

test("liens externes protégés (noopener)", () => {
  const blank = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map((m) => m[0]);
  expect(blank.filter((a) => !/rel="[^"]*noopener/.test(a))).toEqual([]);
});

test("page 404 façon terminal", async ({ page }) => {
  const problems = await preparePage(page);
  const response = await page.goto("./cette/page/nexiste/pas");
  expect(response.status()).toBe(404);
  await expect(page.locator("#path")).toHaveText("/cette/page/nexiste/pas");
  await expect(page.locator("#home")).toHaveAttribute("href", "/firas_bouricha/");
  expect(await page.evaluate(() => window.__csp)).toEqual([]);
  expect(problems.filter((p) => !p.startsWith("HTTP 404") && !/status of 404/.test(p))).toEqual([]);
});
