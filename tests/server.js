/*
 * Serveur statique de test : reproduit GitHub Pages.
 * - le site est servi sous /firas_bouricha/ (comme en ligne) ;
 * - une adresse inconnue renvoie 404.html avec le statut 404.
 * Usage : npm run serve  →  http://127.0.0.1:4173/firas_bouricha/
 */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BASE = "/firas_bouricha/";
const PORT = Number(process.env.PORT) || 4173;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json", ".webmanifest": "application/manifest+json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2",
};

function send(res, status, file) {
  res.writeHead(status, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(file).pipe(res);
}

http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (url === "/" || url === "/firas_bouricha") { res.writeHead(302, { Location: BASE }); return res.end(); }
  if (url.startsWith(BASE)) {
    let file = path.join(ROOT, url.slice(BASE.length));
    if (!file.startsWith(ROOT)) return send(res, 404, path.join(ROOT, "404.html")); // pas de sortie du dossier
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return send(res, 200, file);
  }
  send(res, 404, path.join(ROOT, "404.html"));
}).listen(PORT, "127.0.0.1", () => console.log(`Site servi sur http://127.0.0.1:${PORT}${BASE}`));
