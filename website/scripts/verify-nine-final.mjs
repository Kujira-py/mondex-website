import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { errors: [], viewports: [] };
try {
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
  ]) {
    const ctx = await browser.newContext({ viewport: { width, height } });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => report.errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') report.errors.push(m.text());
    });
    await page.goto('http://127.0.0.1:3101');
    await page.waitForSelector('.scene-ready');
    await page
      .locator('.feature-binder')
      .evaluate((e) =>
        window.scrollTo({
          top: e.getBoundingClientRect().top + scrollY - 125,
          behavior: 'instant',
        }),
      );
    await page.waitForTimeout(1200);
    await expect(page.locator('.binder-book-scene canvas')).toBeVisible();
    if (width === 1440)
      for (let i = 0; i < 10; i++) {
        await page.locator('.feature-binder').screenshot({ path: `qa/nine/binder-final-${i}.png` });
        await page.waitForTimeout(2700);
      }
    await page.locator('.feature-motion-toggle').click();
    await expect(page.locator('.feature-motion-toggle')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('.feature-dex').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const dex = page.locator('.phone-dex-track'),
      before = await dex.evaluate((e) => getComputedStyle(e).transform);
    await page.waitForTimeout(600);
    expect(await dex.evaluate((e) => getComputedStyle(e).transform)).toBe(before);
    await page.locator('.set-discovery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const results = (
      await new AxeBuilder({ page })
        .include('#features')
        .include('#discovery')
        .include('#portfolio')
        .analyze()
    ).violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }));
    expect(results).toHaveLength(0);
    if (width === 390) {
      await expect(page.locator('.rail-pause')).toBeVisible();
      await page.locator('.rail-pause').click();
      await page.locator('.set-discovery').scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const set = page.locator('.set-track'),
        s1 = await set.getAttribute('style');
      await page.waitForTimeout(500);
      expect(await set.getAttribute('style')).toBe(s1);
    }
    report.viewports.push({
      width,
      height,
      axe: results,
      featurePause: true,
      mobileSetPause: width === 390,
    });
    await ctx.close();
  }
  expect(report.errors).toHaveLength(0);
} finally {
  await writeFile('qa/nine/final-report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
