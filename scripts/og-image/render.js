/*
 * Régénère l'image de partage (assets/og-image.jpg, 1200 x 630) et les icônes PNG
 * à partir de scripts/og-image/og.html et assets/icons/favicon.svg.
 * Usage : npm install puis npm run og-image
 */
"use strict";
const { chromium } = require("@playwright/test");
const { spawn } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const BASE = "http://127.0.0.1:4173/firas_bouricha/";

(async () => {
  const server = spawn(process.execPath, [path.join(ROOT, "tests", "server.js")], { stdio: "ignore" });
  await new Promise((r) => setTimeout(r, 600));
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.goto(`${BASE}scripts/og-image/og.html`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(ROOT, "assets", "og-image.jpg"), type: "jpeg", quality: 86 });

    for (const [size, name] of [[32, "favicon-32.png"], [180, "apple-touch-icon.png"], [192, "icon-192.png"], [512, "icon-512.png"]]) {
      // Fond plein (iOS arrondit lui-même les icônes) ; favicon 32 px à fond transparent
      const icon = await browser.newPage({ viewport: { width: size, height: size } });
      const background = size === 32 ? "transparent" : "#111117";
      await icon.setContent(`<body style="margin:0;background:${background}"><img src="${BASE}assets/icons/favicon.svg" width="${size}" height="${size}" style="display:block"></body>`);
      await icon.waitForLoadState("networkidle");
      await icon.screenshot({ path: path.join(ROOT, "assets", "icons", name), omitBackground: size === 32 });
      await icon.close();
    }
    console.log("Image de partage et icônes régénérées.");
  } finally {
    await browser.close();
    server.kill();
  }
})();
