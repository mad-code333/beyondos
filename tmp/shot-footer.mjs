import puppeteer from "puppeteer-core";
import fs from "fs";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1440,900"],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});

const page = await browser.newPage();
page.on("pageerror", (e) => console.log("pageerror", e.message));
page.on("console", (m) => {
  if (m.type() === "error") console.log("console", m.text());
});

await page.goto("http://127.0.0.1:3000/", {
  waitUntil: "networkidle2",
  timeout: 90000,
});
await page.waitForSelector(".footer-particles-canvas", { timeout: 30000 });
await new Promise((r) => setTimeout(r, 1500));
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await new Promise((r) => setTimeout(r, 900));

const info = await page.evaluate(() => {
  const img = document.querySelector(".footer-banner img");
  const c = document.querySelector(".footer-particles-canvas");
  const b = document.querySelector(".footer-banner");
  const stage = document.querySelector(".footer-stage");
  return {
    imgNatural: img
      ? { w: img.naturalWidth, h: img.naturalHeight }
      : null,
    imgRect: img
      ? (() => {
          const r = img.getBoundingClientRect();
          return { w: r.width, h: r.height, top: r.top, bottom: r.bottom };
        })()
      : null,
    bannerRect: b
      ? (() => {
          const r = b.getBoundingClientRect();
          return { w: r.width, h: r.height };
        })()
      : null,
    stageRect: stage
      ? (() => {
          const r = stage.getBoundingClientRect();
          return { w: r.width, h: r.height, top: r.top };
        })()
      : null,
    canvas: c
      ? {
          w: c.width,
          h: c.height,
          cssW: c.clientWidth,
          cssH: c.clientHeight,
        }
      : null,
    overflowX:
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth + 1,
  };
});

console.log(JSON.stringify(info, null, 2));
fs.mkdirSync("tmp", { recursive: true });
await page.screenshot({ path: "tmp/footer-desktop.png", fullPage: false });

await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: "tmp/footer-mobile.png", fullPage: false });

await browser.close();
console.log("done");
