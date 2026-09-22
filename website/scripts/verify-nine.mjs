import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const out = 'qa/nine';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { sizes: [], errors: [] };
try {
  for (const [width, height] of [
    [1440, 900],
    [842, 837],
    [390, 844],
    [360, 800],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      isMobile: width < 500,
      hasTouch: width < 500,
    });
    const page = await context.newPage();
    page.on('pageerror', (e) => report.errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') report.errors.push(m.text());
    });
    await page.goto('http://127.0.0.1:3101');
    await page.waitForSelector('.scene-ready');
    const result = { width, height };
    report.sizes.push(result);
    await page.screenshot({ path: `${out}/${width}-hero.png` });
    const scroll = async (selector) => {
      await page
        .locator(selector)
        .evaluate((el) =>
          window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY - 130,
            behavior: 'instant',
          }),
        );
      await page.waitForTimeout(800);
    };
    await scroll('.feature-scan');
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${out}/${width}-scan.png` });
    result.scanRunning = await page.locator('.phone-scan').getAttribute('data-running');
    if (width === 1440) {
      const samples = [];
      for (let i = 0; i < 17; i++) {
        samples.push(
          await page
            .locator('.scan-cycle-card')
            .evaluateAll((es) =>
              es.map((e) => ({ src: e.getAttribute('src'), opacity: getComputedStyle(e).opacity })),
            ),
        );
        await page.waitForTimeout(2000);
      }
      result.scanIdentities = [
        ...new Set(samples.flatMap((s) => s.filter((x) => +x.opacity > 0.5).map((x) => x.src))),
      ];
      expect(result.scanIdentities).toHaveLength(4);
    }
    await scroll('.feature-dex');
    const before = await page
      .locator('.phone-dex-track')
      .evaluate((e) => getComputedStyle(e).transform);
    await page.waitForTimeout(1800);
    const after = await page
      .locator('.phone-dex-track')
      .evaluate((e) => getComputedStyle(e).transform);
    expect(after).not.toBe(before);
    result.dexMoves = before !== after;
    result.pokemon = await page.locator('.phone-dex-grid').first().locator('img').count();
    await page.screenshot({ path: `${out}/${width}-dex.png` });
    await scroll('.feature-binder');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${out}/${width}-binder-open.png` });
    if (width === 1440) {
      for (let i = 0; i < 7; i++) {
        await page.waitForTimeout(3100);
        await page.screenshot({ path: `${out}/${width}-binder-${i}.png` });
      }
    }
    await page.locator('.feature-motion-toggle').click();
    expect(await page.locator('.phone-scan').getAttribute('data-running')).toBe('false');
    result.manualPause = true;
    await scroll('.collection-caption');
    await page.screenshot({ path: `${out}/${width}-collection.png` });
    await page.getByRole('button', { name: 'Explore sets ↗', exact: true }).click();
    await expect(page.getByRole('tab', { name: 'Sets', exact: true })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    result.collectionCaptionAction = true;
    await scroll('.discovery-window');
    const railBefore = await page
      .locator('.discovery-track')
      .evaluate((e) => getComputedStyle(e).transform);
    if (width >= 760) {
      const box = await page.locator('.discovery-window').boundingBox();
      await page.mouse.move(width / 2, box.y + 140);
      await page.waitForTimeout(1300);
      const railAfter = await page
        .locator('.discovery-track')
        .evaluate((e) => getComputedStyle(e).transform);
      expect(railAfter).not.toBe(railBefore);
      result.hoverKeepsMoving = true;
    }
    await scroll('.set-discovery');
    const s1 = await page
      .locator('.set-track')
      .evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41);
    await page.waitForTimeout(1200);
    const s2 = await page
      .locator('.set-track')
      .evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41);
    expect(s2).toBeGreaterThan(s1);
    result.setsMoveRight = true;
    result.setCount = await page.locator('.set-group').first().locator('.set-item').count();
    await page.screenshot({ path: `${out}/${width}-sets.png` });
    await scroll('.portfolio-preview');
    await page.screenshot({ path: `${out}/${width}-portfolio.png` });
    const chart = page.locator('.portfolio-chart');
    await chart.press('Home');
    await expect(page.locator('.portfolio-total')).toHaveText('$345.67');
    await chart.press('End');
    await expect(page.locator('.portfolio-total')).toHaveText('$448.46');
    result.chartKeys = true;
    await scroll('.portfolio-chart');
    const b = await chart.boundingBox();
    await page.mouse.move(b.x + b.width * 0.49, b.y + b.height * 0.5);
    if (width >= 760) {
      expect(await page.locator('.portfolio-total').textContent()).not.toBe('$448.46');
      result.chartHover = true;
    }
    if (width === 390) {
      await chart.dispatchEvent('pointerdown', {
        pointerType: 'touch',
        pointerId: 1,
        clientX: b.x + b.width * 0.04,
        clientY: b.y + b.height * 0.5,
        buttons: 1,
      });
      await expect(page.locator('.portfolio-total')).toHaveText('$345.67');
      result.chartTouch = true;
    }
    result.overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(result.overflow).toBe(false);
    if (width === 1440)
      result.axe = (
        await new AxeBuilder({ page })
          .include('#features')
          .include('#discovery')
          .include('#portfolio')
          .analyze()
      ).violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }));
    await page.getByRole('button', { name: 'Deutsch', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page.locator('.portfolio-price-source')).toContainText('ungegradet');
    result.german = true;
    await context.close();
    console.log(`Checked ${width} × ${height}`);
  }
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:3101/#features');
  await page.waitForTimeout(1500);
  report.reduced = {
    dexAnimation: await page
      .locator('.phone-dex-track')
      .evaluate((e) => getComputedStyle(e).animationName),
    scan: await page.locator('.phone-scan').getAttribute('data-running'),
  };
  expect(report.reduced.dexAnimation).toBe('none');
  expect(report.reduced.scan).toBe('false');
  await context.close();
} finally {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
