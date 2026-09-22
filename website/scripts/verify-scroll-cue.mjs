import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const result = [];
try {
  for (const [width, height] of [
    [1440, 900],
    [842, 837],
    [390, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('http://127.0.0.1:3101/');
    await page.waitForSelector('.scene-ready');
    for (const [step, target] of ['#reise', '#ankommen', '#ueberblick', '#features'].entries()) {
      await expect(page.locator('.scroll-cue')).toHaveAttribute('href', target);
      await page.locator('.scroll-cue').click();
      await page.waitForTimeout(1300);
      expect(await page.evaluate(() => location.hash)).toBe(target);
      if (step < 3)
        await expect(page.locator('.showcase')).toHaveAttribute('data-chapter', String(step + 1));
      else
        expect(
          await page
            .locator('#features')
            .evaluate((el) =>
              Math.abs(
                el.getBoundingClientRect().top -
                  parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop),
              ),
            ),
        ).toBeLessThan(3);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(800);
    await expect(page.locator('.scroll-cue')).toHaveAttribute('href', '#reise');
    await page.getByRole('button', { name: 'Deutsch', exact: true }).click();
    await page.locator('.scroll-cue').focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1300);
    await expect(page.locator('.scroll-cue')).toHaveAttribute('href', '#ankommen');
    await expect(page.locator('.showcase')).toHaveAttribute('data-chapter', '1');
    expect(errors).toEqual([]);
    result.push({
      width,
      height,
      steps: 4,
      reverseRestoresFirst: true,
      germanKeyboard: true,
      errors,
    });
    console.log(JSON.stringify(result.at(-1)));
    await page.close();
  }
} finally {
  await mkdir('qa/shared-stage', { recursive: true });
  await writeFile('qa/shared-stage/scroll-cue.json', JSON.stringify(result, null, 2));
  await browser.close();
}
