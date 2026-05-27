import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
for (const [hash, out] of [
  ["#/9", "/tmp/tu3.png"],
  ["#/11", "/tmp/results.png"],
]) {
  await page.goto(`http://localhost:3535/${hash}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: out });
}
await browser.close();
