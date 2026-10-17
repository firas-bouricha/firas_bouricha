/*
 * Outils communs aux tests : collecte des erreurs, simulation de l'API GitHub, défilement.
 */
"use strict";
const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const FIXTURE = fs.readFileSync(path.join(__dirname, "fixtures", "contributions.json"), "utf8");

/**
 * Prépare une page : thème, API des contributions simulée (tests sans réseau),
 * et collecte des erreurs JS, des violations de CSP et des réponses HTTP en échec.
 */
async function preparePage(page, { theme = "dark", lang } = {}) {
  const problems = [];
  await page.addInitScript(({ theme, lang }) => {
    try {
      localStorage.setItem("theme", theme);
      if (lang) localStorage.setItem("lang", lang);
    } catch { /* stockage indisponible */ }
    window.__csp = [];
    document.addEventListener("securitypolicyviolation", (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  }, { theme, lang });
  await page.route("https://github-contributions-api.jogruber.de/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: FIXTURE, headers: { "Access-Control-Allow-Origin": "*" } }));
  page.on("pageerror", (e) => problems.push(`JS : ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") problems.push(`console : ${m.text()}`); });
  page.on("response", (r) => { if (r.status() >= 400) problems.push(`HTTP ${r.status()} : ${r.url()}`); });
  return problems;
}

/** Ouvre le site et attend la fin du démarrage des modules. */
async function openSite(page, query = "") {
  await page.goto(`./${query}`);
  await page.waitForSelector("html[data-ready]");
}

/** Fait défiler toute la page (déclenche les animations et les chargements différés). */
async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
  });
}

/** Problèmes collectés + violations de CSP signalées par la page. */
async function allProblems(page, problems) {
  const csp = await page.evaluate(() => window.__csp || []);
  return [...problems, ...csp.map((v) => `CSP : ${v}`)];
}

module.exports = { ROOT, read, preparePage, openSite, scrollThrough, allProblems };
