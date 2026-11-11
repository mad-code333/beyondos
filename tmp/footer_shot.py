#!/usr/bin/env python3
import json, os, subprocess, time, urllib.request, base64

PORT = 9333
chrome = subprocess.Popen(
    [
        "google-chrome-stable",
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--remote-debugging-port={PORT}",
        "--window-size=1440,900",
        "about:blank",
    ],
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)

try:
    import websocket  # type: ignore
except ImportError:
    subprocess.check_call(["python3", "-m", "pip", "install", "--quiet", "websocket-client"])
    import websocket  # type: ignore

time.sleep(1.2)
tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/list"))
ws_url = tabs[0]["webSocketDebuggerUrl"]
ws = websocket.create_connection(ws_url, timeout=20)
_id = 0


def send(method, params=None, timeout=20):
    global _id
    _id += 1
    msg = {"id": _id, "method": method}
    if params is not None:
        msg["params"] = params
    ws.send(json.dumps(msg))
    deadline = time.time() + timeout
    while time.time() < deadline:
        raw = ws.recv()
        data = json.loads(raw)
        if data.get("id") == _id:
            return data
    raise TimeoutError(method)


send("Page.enable")
send("Runtime.enable")
send("Page.navigate", {"url": "http://127.0.0.1:3000/?shot=1"})
# wait for load
for _ in range(40):
    time.sleep(0.25)
    ready = send(
        "Runtime.evaluate",
        {
            "expression": "document.readyState + ':' + !!document.querySelector('.footer-particles-canvas')",
            "returnByValue": True,
        },
    )
    val = ready.get("result", {}).get("result", {}).get("value", "")
    if val.startswith("complete") and ":True" in val:
        break

time.sleep(1.5)
info = send(
    "Runtime.evaluate",
    {
        "expression": """(() => {
  window.scrollTo(0, document.body.scrollHeight);
  const img = document.querySelector('.footer-banner img');
  const c = document.querySelector('.footer-particles-canvas');
  const b = document.querySelector('.footer-banner');
  const p = document.querySelector('.footer-particles');
  return {
    scrollH: document.body.scrollHeight,
    img: img && {nw: img.naturalWidth, nh: img.naturalHeight, w: img.getBoundingClientRect().width, h: img.getBoundingClientRect().height},
    banner: b && {w: b.getBoundingClientRect().width, h: b.getBoundingClientRect().height},
    particles: p && {w: p.getBoundingClientRect().width, h: p.getBoundingClientRect().height},
    canvas: c && {w: c.width, h: c.height, cssW: c.clientWidth, cssH: c.clientHeight},
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  };
})()""",
        "returnByValue": True,
    },
)
print(json.dumps(info.get("result", {}).get("result", {}).get("value"), indent=2))
time.sleep(0.8)
shot = send("Page.captureScreenshot", {"format": "png", "fromSurface": True})
os.makedirs("tmp", exist_ok=True)
open("tmp/footer-scrolled-desk.png", "wb").write(base64.b64decode(shot["result"]["data"]))

send(
    "Emulation.setDeviceMetricsOverride",
    {"width": 390, "height": 844, "deviceScaleFactor": 2, "mobile": True},
)
send("Runtime.evaluate", {"expression": "window.scrollTo(0, document.body.scrollHeight)", "returnByValue": True})
time.sleep(0.9)
shot_m = send("Page.captureScreenshot", {"format": "png", "fromSurface": True})
open("tmp/footer-scrolled-mobile.png", "wb").write(base64.b64decode(shot_m["result"]["data"]))
print("saved")
ws.close()
chrome.kill()
