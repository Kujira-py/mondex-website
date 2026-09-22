import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const out = 'qa/redesign';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = [];
for (const [name, width, height] of [
  ['desktop', 1440, 900],
  ['laptop', 1280, 800],
  ['tablet', 768, 1024],
  ['mobile', 390, 844],
  ['narrow', 360, 800],
]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://127.0.0.1:3100');
  await page.waitForSelector('.scene-ready', { timeout: 45000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${out}/${name}-hero.png` });
  const story = await page.locator('.showcase').boundingBox();
  for (const [chapter, p] of [
    ['scan', 0.34],
    ['collect', 0.61],
    ['portfolio', 0.89],
  ]) {
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: 'instant' }),
      (story.height - height) * p,
    );
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${out}/${name}-story-${chapter}.png` });
  }
  if (name === 'desktop' || name === 'mobile') {
    for (const id of ['scanner', 'sammlung', 'portfolio', 'entdecken']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
      await page.locator(`#${id}`).screenshot({ path: `${out}/${name}-${id}.png` });
    }
    await page.getByRole('tab', { name: 'Binder', exact: true }).click();
    await page.waitForTimeout(1000);
    await page.locator('#sammlung').screenshot({ path: `${out}/${name}-binder.png` });
  }
  report.push({
    name,
    errors,
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  });
  await page.close();
}
const variant = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await variant.goto('http://127.0.0.1:3100/?composition=editorial');
await variant.waitForSelector('.scene-ready');
await variant.waitForTimeout(700);
await variant.screenshot({ path: `${out}/desktop-variant-editorial.png` });
await writeFile(`${out}/capture.json`, JSON.stringify(report, null, 2));
console.log(report);
await browser.close();
