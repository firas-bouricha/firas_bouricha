// Référencement, partage, sécurité et cohérence des fichiers (vérifications sans navigateur quand c'est possible).
const { test, expect } = require("@playwright/test");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { ROOT, PAGES, read, preparePage } = require("./helpers");

const SITE = "https://firas-bouricha.github.io/firas_bouricha/";
const pages = PAGES.map((p) => ({ ...p, html: read(p.file), url: p.file === "index.html" ? SITE : SITE + p.file }));
const metaOf = (html, attr, name) => (html.match(new RegExp(`<meta ${attr}="${name}"\\s+content="([^"]*)"`)) || [])[1];

/** Empreintes SHA-256 des scripts intégrés (hors JSON-LD), au format CSP. */
function inlineHashes(source) {
  return [...source.matchAll(/<script(\b[^>]*)>([\s\S]*?)<\/script>/g)]
    .filter(([, attrs]) => !/\bsrc=/.test(attrs) && !/ld\+json/.test(attrs))
    .map(([, , body]) => `'sha256-${crypto.createHash("sha256").update(body).digest("base64")}'`);
}

test("CSP : les empreintes correspondent aux scripts intégrés", () => {
  for (const file of [...PAGES.map((p) => p.file), "404.html"]) {
    const source = read(file);
    const csp = (source.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/) || [])[1];
    expect(csp, `CSP absente de ${file}`).toBeTruthy();
    for (const hash of inlineHashes(source)) expect(csp, `${file} : empreinte manquante (script intégré modifié ?)`).toContain(hash);
    expect(csp, `${file} : plugins (object-src) non bloqués`).toMatch(/object-src 'none'|default-src 'none'/);
  }
});

test("blocs communs identiques sur toutes les pages (npm run sync)", () => {
  const { execFileSync } = require("child_process");
  expect(() => execFileSync(process.execPath, [path.join(ROOT, "scripts", "sync-layout.js"), "--check"], { stdio: "pipe" }),
    "une page n'est plus synchronisée avec index.html : lancer « npm run sync »").not.toThrow();
});

test("version identique partout (scripts/bump-version.sh)", () => {
  const version = metaOf(pages[0].html, "name", "site-version");
  expect(JSON.parse(read("version.json")).version).toBe(version);
  for (const { file, html } of pages) {
    const tags = [...html.matchAll(/\?v=([\w-]+)/g)].map((m) => m[1]);
    expect(tags.length, file).toBeGreaterThan(5);
    expect(new Set(tags), file).toEqual(new Set([version]));
    expect(metaOf(html, "name", "site-version"), file).toBe(version);
  }
});

test("tous les fichiers locaux référencés existent", () => {
  const refs = [];
  for (const { html } of pages) refs.push(...[...html.matchAll(/(?:href|src)="([^"#:]+?)(?:[?#][^"]*)?"/g)].map((m) => m[1]).filter((r) => !r.startsWith("//")));
  refs.push(...[...read("data/projects.js").matchAll(/image:\s*"([^"]+)"/g)].map((m) => m[1]));
  refs.push(...JSON.parse(read("site.webmanifest")).icons.map((i) => i.src));
  const missing = [...new Set(refs)].filter((r) => !fs.existsSync(path.join(ROOT, r)));
  expect(missing).toEqual([]);
});

test("chaque page : titre, description, canonical, hreflang, Open Graph et h1 propres", () => {
  const titles = new Set();
  for (const { file, html, url } of pages) {
    const title = html.match(/<title>([^<]+)<\/title>/)[1];
    titles.add(title);
    expect(metaOf(html, "name", "description"), file).toBeTruthy();
    expect(html, file).toContain(`<link rel="canonical" href="${url}">`);
    expect(metaOf(html, "property", "og:url"), file).toBe(url);
    for (const lang of ["fr", "en", "x-default"]) expect(html, file).toContain(`hreflang="${lang}"`);
    expect(html, file).toContain(`hreflang="en" href="${url}?lang=en"`);
    expect((html.match(/<h1\b/g) || []).length, `${file} : un seul h1`).toBe(1);
  }
  expect(titles.size, "titres tous différents").toBe(pages.length);
  expect(pages[0].html).toContain('"@type": "Person"');
});

test("partage : Open Graph, Twitter/X, image 1200 × 630", async ({ page }) => {
  for (const { file, html } of pages) {
    expect(metaOf(html, "property", "og:image"), file).toBe(`${SITE}assets/og-image.jpg`);
    expect(metaOf(html, "name", "twitter:card"), file).toBe("summary_large_image");
  }
  await page.goto("./assets/og-image.jpg");
  const size = await page.evaluate(() => { const img = document.querySelector("img"); return [img.naturalWidth, img.naturalHeight]; });
  expect(size).toEqual([1200, 630]);
});

test("sitemap : les 4 pages en français et en anglais", () => {
  const sitemap = read("sitemap.xml");
  for (const { url } of pages) {
    expect(sitemap).toContain(`<loc>${url}</loc>`);
    expect(sitemap).toContain(`<loc>${url}?lang=en</loc>`);
  }
});

test("liens externes protégés (noopener)", () => {
  for (const { file, html } of pages) {
    const blank = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map((m) => m[0]);
    expect(blank.filter((a) => !/rel="[^"]*noopener/.test(a)), file).toEqual([]);
  }
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
