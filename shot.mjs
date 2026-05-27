import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto("http://localhost:3535/#/14", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await page.screenshot({ path: "/tmp/figma-config.png" });
await browser.close();
console.log("ok");
