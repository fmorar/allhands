import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const BASE = "http://localhost:3535";

async function postJSON(path, body) {
  await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
}
async function uploadSample(name) {
  const fd = new FormData();
  fd.append(
    "file",
    new File(
      [readFileSync("./public/icebreaker/reference.png")],
      "sample.png",
      { type: "image/png" }
    )
  );
  fd.append("name", name);
  const r = await fetch(`${BASE}/api/icebreaker/upload`, {
    method: "POST",
    body: fd,
  });
  if (!r.ok) console.log("upload err", r.status, await r.text());
}

// reset + start + advance to uploading
await postJSON("/api/icebreaker", { action: "reset" });
await postJSON("/api/icebreaker/start");
console.log("waiting 31s for upload phase...");
await new Promise((r) => setTimeout(r, 31000));

// Upload 18 samples
const names = [
  "Ana", "Diego", "Sofía", "Lucas", "Mar", "Pablo",
  "Cami", "Lola", "Jero", "Vale", "Mati", "Tomi",
  "Nico", "Bel", "Lía", "Igna", "Caro", "Mike",
];
for (const n of names) {
  await uploadSample(n);
}
console.log("uploaded", names.length);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto(`${BASE}/#/5`, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.screenshot({ path: "/tmp/ice-many.png" });

// Click first thumbnail to open lightbox
await page.evaluate(() => {
  const grid = document.querySelector(".overflow-y-auto button");
  if (grid) (grid).click();
});
await page.waitForTimeout(700);
await page.screenshot({ path: "/tmp/ice-lightbox.png" });

await browser.close();
console.log("done");
