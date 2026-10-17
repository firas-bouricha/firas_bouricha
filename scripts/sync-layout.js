/*
 * Recopie les blocs communs de index.html dans les autres pages.
 * Les blocs sont délimités par des commentaires :
 *   <!-- layout:meta … -->   … <!-- /layout:meta -->    (balises communes du <head>)
 *   <!-- layout:header -->   … <!-- /layout:header -->  (lien d'évitement + menu)
 *   <!-- layout:footer -->   … <!-- /layout:footer -->  (pied de page, palette, scripts)
 * Usage : npm run sync   (après avoir modifié le menu, le pied de page ou le <head> dans index.html)
 *         node scripts/sync-layout.js --check   (vérifie seulement, code de sortie 1 si une page diffère)
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BLOCKS = ["meta", "header", "footer"];
const PAGES = ["profil.html", "projets.html", "parcours.html"];
const check = process.argv.includes("--check");

const pattern = (name) => new RegExp(`<!-- layout:${name}\\b[^>]*-->[\\s\\S]*?<!-- /layout:${name} -->`);
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");

const source = read("index.html");
const blocks = Object.fromEntries(BLOCKS.map((name) => {
  const match = source.match(pattern(name));
  if (!match) throw new Error(`Bloc « ${name} » introuvable dans index.html`);
  return [name, match[0]];
}));

let differs = false;
for (const page of PAGES) {
  const before = read(page);
  let after = before;
  for (const name of BLOCKS) {
    if (!pattern(name).test(after)) throw new Error(`Bloc « ${name} » introuvable dans ${page}`);
    after = after.replace(pattern(name), () => blocks[name]);
  }
  if (after !== before) {
    differs = true;
    if (!check) fs.writeFileSync(path.join(ROOT, page), after);
    console.log(`${check ? "À synchroniser" : "Synchronisé"} : ${page}`);
  }
}
if (!differs) console.log("Toutes les pages sont à jour.");
if (check && differs) process.exit(1);
