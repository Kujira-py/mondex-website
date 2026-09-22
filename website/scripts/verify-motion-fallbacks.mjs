import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const out = 'qa/motion-final';
await mkdir(out, { recursive: true });
const report = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [name, width, height, reduced, webgl] of [
    ['reduced-desktop', 1440, 900, true, true],
    ['reduced-mobile', 390, 844, true, true],
    ['no-webgl', 390, 844, false, false],
  ]) {
    const ctx = await browser.newContext({
      viewport: { width, height },
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    });
    const page = await ctx.newPage();
    if (!webgl)
      await page.addInitScript(() => {
        const get = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          return /webgl/.test(type) ? null : get.call(this, type, ...args);
        };
      });
    await page.goto('http://127.0.0.1:3101');
    await page.waitForSelector('.showcase.is-static');
    await expect(page.locator('.story-chapter')).toHaveCount(4);
    await expect(page.locator('.scene-canvas')).toHaveCount(0);
    await page.locator('.feature-binder').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    if (!webgl) await expect(page.locator('.binder-fallback')).toBeVisible();
    await page.screenshot({ path: `${out}/${name}.png` });
    report.push({
      name,
      staticStory: true,
      binderWorks: true,
      overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    });
    await ctx.close();
  }
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__draws = 0;
    for (const name of ['drawElements', 'drawArrays']) {
      const f = WebGL2RenderingContext.prototype[name];
      WebGL2RenderingContext.prototype[name] = function (...args) {
        window.__draws++;
        return f.apply(this, args);
      };
    }
  });
  await page.goto('http://127.0.0.1:3101');
  await page.waitForSelector('.scene-ready');
  await page.waitForTimeout(2000);
  let a = await page.evaluate(() => window.__draws);
  await page.waitForTimeout(500);
  let b = await page.evaluate(() => window.__draws);
  if (a !== b) throw Error('WebGL does not settle');
  await page.evaluate(() => (window.__oldCanvas = document.querySelector('.scene-canvas canvas')));
  await page.locator('.motion-control button').click();
  await page.waitForTimeout(250);
  a = await page.evaluate(() => window.__draws);
  await page.waitForTimeout(300);
  b = await page.evaluate(() => window.__draws);
  if (a !== b) throw Error('Paused WebGL renders');
  await page.locator('.motion-control button').click();
  if (
    !(await page.evaluate(
      () => window.__oldCanvas === document.querySelector('.scene-canvas canvas'),
    ))
  )
    throw Error('Canvas remounted');
  await page.locator('.portfolio-preview').scrollIntoViewIfNeeded();
  await page.waitForTimeout(2400);
  a = await page.evaluate(() => window.__draws);
  await page.waitForTimeout(500);
  b = await page.evaluate(() => window.__draws);
  if (a !== b) throw Error('Offscreen WebGL renders');
  report.push({
    name: 'performance',
    idleDraws: 0,
    pausedDraws: 0,
    offscreenDraws: 0,
    sameCanvas: true,
  });
  await ctx.close();
} finally {
  await writeFile(`${out}/fallbacks.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
