import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const BASE = "http://localhost:3535";

async function resetActivity() {
  await fetch(`${BASE}/api/icebreaker`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "reset" }),
  });
}

async function startActivity() {
  await fetch(`${BASE}/api/icebreaker/start`, { method: "POST" });
}

async function uploadSample(name) {
  // Use the reference image itself as a fake submission for the test.
  const fd = new FormData();
  const file = new File(
    [readFileSync("./public/icebreaker/reference.png")],
    "sample.png",
    { type: "image/png" }
  );
  fd.append("file", file);
  fd.append("name", name);
  const r = await fetch(`${BASE}/api/icebreaker/upload`, {
    method: "POST",
    body: fd,
  });
  if (!r.ok) console.log("upload err", r.status, await r.text());
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("[pageerror]", e.message));

// Slide 5 is the icebreaker now.
const SLIDE_URL = `${BASE}/#/5`;

// 1. IDLE state
await resetActivity();
await page.goto(SLIDE_URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: "/tmp/ice-idle.png" });

// 2. REVEALING state
await startActivity();
await page.waitForTimeout(2000);
await page.screenshot({ path: "/tmp/ice-reveal.png" });

// 3. UPLOADING state — fast-forward by setting reveal start time to past
// Easiest: force-reset and skip by waiting 31s. But for screenshot, we can
// just advance by waiting. To save time we mock by uploading samples.
// First force into uploading by calling start then immediately running until reveal expires.
// We'll wait 31s.
console.log("waiting for upload phase…");
await page.waitForTimeout(31000);
await uploadSample("Ana");
await uploadSample("Diego");
await uploadSample("Sofía");
await page.waitForTimeout(2500);
await page.screenshot({ path: "/tmp/ice-upload.png" });

// 4. Vote/upload mobile page
await ctx.close();
const mctx = await browser.newContext({
  viewport: { width: 414, height: 896 },
  deviceScaleFactor: 1,
});
const mp = await mctx.newPage();
await mp.goto(`${BASE}/icebreaker`, { waitUntil: "networkidle" });
await mp.waitForTimeout(800);
await mp.screenshot({ path: "/tmp/ice-mobile.png" });

await browser.close();
console.log("done");
