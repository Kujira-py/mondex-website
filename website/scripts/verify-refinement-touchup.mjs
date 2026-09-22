import { chromium, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const out = 'qa/refinement-final',
  report = { errors: [], screens: [], rail: [] };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
    [360, 800],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      isMobile: width < 500,
      hasTouch: width < 500,
    });
    page.on('pageerror', (e) => report.errors.push(e.message));
    await page.goto('http://127.0.0.1:3101');
    await page.waitForSelector('.scene-ready');
    const b = await page.locator('.showcase').boundingBox();
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: 'instant' }),
      (b.height - height) * 0.91,
    );
    await page.waitForTimeout(1200);
    await expect(page.locator('.story-insight strong')).toContainText('/ 207');
    await page.screenshot({ path: `${out}/${width}-corrected-understand.png` });
    report.screens.push(`${width}-corrected-understand.png`);
    await page
      .locator('.discovery-heading')
      .evaluate((n) =>
        window.scrollTo({
          top: scrollY + n.getBoundingClientRect().top - 100,
          behavior: 'instant',
        }),
      );
    await page.waitForTimeout(350);
    if (width === 1440) {
      await page.locator('.discovery-item').first().getByRole('button').focus();
      for (let i = 0; i < 11; i++) await page.keyboard.press('Tab');
      await page.waitForTimeout(500);
      const bounds = await page
        .locator('.discovery-item')
        .nth(11)
        .getByRole('button')
        .boundingBox();
      if (bounds.x < 8 || bounds.x + bounds.width > width) throw Error('Focused card clipped');
      await page.screenshot({ path: `${out}/1440-corrected-rail-focus.png` });
      report.screens.push('1440-corrected-rail-focus.png');
      await page.locator('.rail-pause').focus();
      await page.mouse.move(10, 100);
      for (let i = 0; i < 12; i++) {
        report.rail.push(
          await page
            .locator('.discovery-track')
            .evaluate((n) => ({
              time: performance.now(),
              x: new DOMMatrix(getComputedStyle(n).transform).m41,
            })),
        );
        if (i === 6 || i === 8)
          await page.screenshot({ path: `${out}/1440-corrected-seam-${i}.png` });
        await page.waitForTimeout(1000);
      }
      if (!report.rail.some((r, i) => i && r.x - report.rail[i - 1].x > 1000))
        throw Error('No real-time seam observed');
    }
    for (const [name, count] of [
      ['All', 6],
      ['Discovered', 4],
      ['Missing', 2],
    ]) {
      await page.getByRole('button', { name, exact: true }).click();
      await expect(page.locator('.dex-grid > button')).toHaveCount(count);
    }
    await page.close();
  }
} finally {
  await writeFile(`${out}/touchup.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
if (report.errors.length) process.exitCode = 1;
