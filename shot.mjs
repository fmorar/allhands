import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("[pageerror]", e.message));

const shots = [
  ["#/1", "/tmp/v2-cover.png"],
  ["#/2", "/tmp/v2-mood.png"],
  ["#/3", "/tmp/v2-index.png"],
  ["#/5", "/tmp/v2-icebreaker.png"],
  ["#/6", "/tmp/v2-tu-divider.png"],
  ["#/7", "/tmp/v2-tu-1.png"],
  ["#/10", "/tmp/v2-quote.png"],
  ["#/11", "/tmp/v2-results.png"],
  ["#/12", "/tmp/v2-alejandra.png"],
  ["#/14", "/tmp/v2-figma.png"],
  ["#/15", "/tmp/v2-closing.png"],
];
for (const [hash, out] of shots) {
  await page.goto(`http://localhost:3535/${hash}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: out });
  console.log(hash, "ok");
}
await browser.close();
