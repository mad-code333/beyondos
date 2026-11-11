import fs from "fs";
import http from "http";
import { spawn } from "child_process";
import WebSocket from "ws";

const PORT = 9335;
const chrome = spawn(
  "google-chrome-stable",
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    `--remote-debugging-port=${PORT}`,
    "--remote-allow-origins=*",
    "--window-size=1440,900",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (url) =>
  new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(d));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });

await sleep(1500);
const tabs = await getJSON(`http://127.0.0.1:${PORT}/json/list`);
const pageTab = tabs.find((t) => t.type === "page") || tabs[0];
const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.once("open", res);
  ws.once("error", rej);
});

let id = 0;
const pending = new Map();
let loadResolve = null;
ws.on("message", (raw) => {
  const msg = JSON.parse(String(raw));
  if (msg.method === "Page.loadEventFired" && loadResolve) {
    loadResolve();
    loadResolve = null;
  }
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
});

function send(method, params = {}) {
  const i = ++id;
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout ${method}`)), 45000);
    pending.set(i, (msg) => {
      clearTimeout(t);
      resolve(msg);
    });
    ws.send(JSON.stringify({ id: i, method, params }));
  });
}

await send("Page.enable");
await send("Runtime.enable");
const loaded = new Promise((r) => {
  loadResolve = r;
});
await send("Page.navigate", { url: "http://127.0.0.1:3000/?shot=2" });
await Promise.race([loaded, sleep(20000)]);

for (let i = 0; i < 60; i++) {
  await sleep(250);
  const ready = await send("Runtime.evaluate", {
    expression: `({
      ready: document.readyState,
      title: document.title,
      hasCanvas: !!document.querySelector('.footer-particles-canvas'),
      h: document.body ? document.body.scrollHeight : -1
    })`,
    returnByValue: true,
  });
  const val = ready.result?.result?.value;
  if (i % 8 === 0) console.log("wait", val);
  if (val?.hasCanvas && val?.h > 1000) break;
}

await sleep(1200);
await send("Runtime.evaluate", {
  expression: "window.scrollTo(0, document.body.scrollHeight); true",
  returnByValue: true,
});
await sleep(1000);

const info = await send("Runtime.evaluate", {
  expression: `(() => {
    const img = document.querySelector('.footer-banner img');
    const c = document.querySelector('.footer-particles-canvas');
    const b = document.querySelector('.footer-banner');
    const p = document.querySelector('.footer-particles');
    return {
      title: document.title,
      scrollH: document.body.scrollHeight,
      scrollY: window.scrollY,
      img: img && {nw:img.naturalWidth,nh:img.naturalHeight,w:img.getBoundingClientRect().width,h:img.getBoundingClientRect().height,top:img.getBoundingClientRect().top},
      banner: b && {w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height},
      particles: p && {w:p.getBoundingClientRect().width,h:p.getBoundingClientRect().height,top:p.getBoundingClientRect().top},
      canvas: c && {w:c.width,h:c.height,cssW:c.clientWidth,cssH:c.clientHeight},
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    };
  })()`,
  returnByValue: true,
});
console.log(JSON.stringify(info.result?.result?.value, null, 2));

const shot = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
fs.mkdirSync("tmp", { recursive: true });
fs.writeFileSync("tmp/footer-scrolled-desk.png", Buffer.from(shot.result.data, "base64"));

await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  mobile: true,
});
await send("Runtime.evaluate", {
  expression: "window.scrollTo(0, document.body.scrollHeight); true",
  returnByValue: true,
});
await sleep(1000);
const shotM = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
fs.writeFileSync("tmp/footer-scrolled-mobile.png", Buffer.from(shotM.result.data, "base64"));
console.log("saved");
ws.close();
chrome.kill("SIGKILL");
process.exit(0);
