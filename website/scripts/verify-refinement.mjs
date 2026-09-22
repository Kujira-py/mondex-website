import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const out = 'qa/refinement';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = {
  viewports: [],
  failures: [],
  errors: [],
  warnings: [],
  metrics: [],
  screens: [],
  tests: [],
};
async function check(name, fn) {
  try {
    await fn();
    report.tests.push({ name, pass: true });
  } catch (e) {
    report.failures.push({ name, error: e.message });
    report.tests.push({ name, pass: false });
  }
}
try {
  for (const [width, height] of [
    [1440, 900],
    [1280, 800],
    [768, 1024],
    [390, 844],
    [360, 800],
  ]) {
    console.log('Testing', width, height);
    const context = await browser.newContext({
      viewport: { width, height },
      isMobile: width < 500,
      hasTouch: width < 500,
    });
    await context.addInitScript(() => {
      window.__review = { draws: 0, lost: 0, longtasks: [], shifts: [] };
      for (const type of ['longtask', 'layout-shift'])
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (type === 'longtask')
                window.__review.longtasks.push({ at: entry.startTime, duration: entry.duration });
              else if (!entry.hadRecentInput)
                window.__review.shifts.push({
                  at: entry.startTime,
                  value: entry.value,
                  sources: entry.sources?.map((s) => s.node?.className),
                });
            }
          }).observe({ type, buffered: true });
        } catch {}
      for (const C of [WebGLRenderingContext, WebGL2RenderingContext])
        for (const key of ['drawElements', 'drawArrays']) {
          const original = C.prototype[key];
          C.prototype[key] = function (...args) {
            window.__review.draws++;
            return original.apply(this, args);
          };
        }
      document.addEventListener('webglcontextlost', () => window.__review.lost++, true);
    });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    page.on('pageerror', (e) => report.errors.push({ width, error: e.message }));
    page.on('console', (m) => {
      if (m.type() === 'error') report.errors.push({ width, error: m.text() });
      if (m.type() === 'warning') report.warnings.push({ width, message: m.text() });
    });
    page.on('response', (r) => {
      if (r.status() >= 400) report.errors.push({ width, status: r.status(), url: r.url() });
    });
    await page.goto('http://127.0.0.1:3101');
    await page.waitForSelector('.scene-ready');
    await page.waitForTimeout(1200);
    let sequence = 0;
    const shot = async (name, locator) => {
      const file = `${width}-${String(++sequence).padStart(2, '0')}-${name}.png`;
      await (locator ?? page).screenshot({ path: `${out}/${file}` });
      report.screens.push(file);
    };
    const view = async (selector) => {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(850);
    };
    await shot('hero');
    await page.evaluate(() => (window.__canvas = document.querySelector('canvas')));
    for (let i = 0; i < 5; i++) {
      await page.locator('.card-selector button').nth(i).click();
      await page.waitForTimeout(900);
      await check(`${width} hero selection ${i}`, () =>
        expect(page.locator('.card-selector button').nth(i)).toHaveAttribute(
          'aria-pressed',
          'true',
        ),
      );
      if (width === 1440 || width === 390 || i === 0 || i === 4) await shot(`hero-selected-${i}`);
    }
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /Pause motion/ }).click();
      await page.waitForTimeout(120);
      await check(`${width} pause ${i}`, async () => {
        await expect(page.getByRole('button', { name: /Resume motion/ })).toBeVisible();
        if (
          !(await page.evaluate(
            () =>
              window.__canvas === document.querySelector('canvas') && window.__review.lost === 0,
          ))
        )
          throw Error('canvas changed or context lost');
      });
      const before = await page.evaluate(() => window.__review.draws);
      await page.waitForTimeout(200);
      const after = await page.evaluate(() => window.__review.draws);
      report.metrics.push({ width, phase: 'paused', draws: after - before });
      await page.getByRole('button', { name: /Resume motion/ }).click();
      await page.waitForTimeout(600);
    }
    if (width === 1440 || width === 390) {
      await shot('hero-resumed');
    }
    const idleBefore = await page.evaluate(() => window.__review.draws);
    await page.waitForTimeout(1500);
    report.metrics.push({
      width,
      phase: 'heroIdle',
      draws: (await page.evaluate(() => window.__review.draws)) - idleBefore,
    });
    // Arrive at scanner without clicking a step: first visibility must start the scan.
    await view('.scan-art');
    await shot('scanner-capture');
    for (let step = 1; step < 3; step++) {
      await page.locator('.scan-steps > button').nth(step).click();
      if (width === 1440 || width === 390) {
        await page.waitForTimeout(180);
        await shot(`scanner-${step}-middle`);
      }
      await page.waitForTimeout(900);
      await shot(`scanner-${step}-end`);
    }
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(200);
    await page.mouse.wheel(0, -500);
    await page.waitForTimeout(700);
    await check(`${width} scanner reverse consistent`, () =>
      expect(page.locator('.scan-demo')).toHaveAttribute('data-step', '2'),
    );
    await page.locator('.scan-steps > button').nth(1).click();
    await page.waitForTimeout(900);
    await page.locator('.app-confirm').click();
    await page.waitForTimeout(900);
    await check(`${width} scanner confirmation`, () =>
      expect(page.locator('.scan-status')).toContainText('Added to Collection'),
    );
    await view('.collection-stage');
    await shot('collection-cards');
    for (let repeat = 0; repeat < 2; repeat++)
      for (const i of [0, 1, 2, 3, 0, 3, 2]) {
        // Physical clicks without waiting for the moving cards to settle.
        await page.locator('.collection-tabs button').nth(i).click();
        await page.waitForTimeout(90);
        await check(`${width} stable card width ${repeat}-${i}`, async () => {
          if (
            !(await page
              .locator('.collection-card-layout')
              .evaluateAll((nodes) => nodes.every((n) => n.offsetWidth === 190)))
          )
            throw Error('layout width changed');
        });
      }
    await page.waitForTimeout(900);
    await shot('collection-binder-start');
    for (let repeat = 0; repeat < 2; repeat++) {
      await page.getByRole('button', { name: 'Add card', exact: true }).click();
      if (!repeat && (width === 1440 || width === 390)) {
        await page.waitForTimeout(260);
        await shot('binder-middle');
      }
      await page.waitForTimeout(950);
      await check(`${width} binder ${repeat}`, () =>
        expect(page.locator('.binder-controls strong')).toHaveText('9 / 9'),
      );
      if (!repeat) await shot('binder-complete');
      await page.getByRole('button', { name: 'Replay', exact: true }).click();
      await page.waitForTimeout(900);
      await check(`${width} binder reset ${repeat}`, () =>
        expect(page.locator('.binder-controls strong')).toHaveText('8 / 9'),
      );
    }
    await view('.discovery-window');
    await shot('discovery');
    if (width >= 760) {
      await page.locator('.discovery-item').nth(2).hover({ force: true });
      await page.waitForTimeout(600);
      const before = await page
        .locator('.discovery-track')
        .evaluate((n) => getComputedStyle(n).transform);
      await page.waitForTimeout(500);
      await check(`${width} rail continues on hover`, async () => {
        if (
          before ===
          (await page.locator('.discovery-track').evaluate((n) => getComputedStyle(n).transform))
        )
          throw Error('loop stopped on hover');
      });
      await shot('discovery-hover');
      await page.mouse.move(10, 100);
      for (let repeat = 0; repeat < 2; repeat++) {
        await page.getByRole('button', { name: /Pause cards/ }).click();
        await page.waitForTimeout(150);
        await page.getByRole('button', { name: /Resume cards/ }).click();
      }
      if (width === 1440) {
        // Cross the seam in real time at the actual production speed, >30s.
        const duration = await page
          .locator('.discovery-group')
          .first()
          .evaluate((n) => n.offsetWidth / 30);
        console.log('Rail real-time seam run', duration.toFixed(2), 'seconds');
        const samples = [];
        const start = Date.now();
        for (let i = 0; i < Math.ceil(duration) + 2; i++) {
          samples.push(
            await page
              .locator('.discovery-track')
              .evaluate((n) => ({
                time: performance.now(),
                x: new DOMMatrix(getComputedStyle(n).transform).m41,
              })),
          );
          await page.waitForTimeout(1000);
          if (i === Math.floor(duration) - 1) await shot('rail-seam-before');
        }
        await shot('rail-seam-after');
        report.rail = { duration: (Date.now() - start) / 1000, samples };
      }
    } else {
      const box = await page.locator('.discovery-window').boundingBox();
      const cdp = await context.newCDPSession(page);
      const y = box.y + 150;
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: width - 40, y }],
      });
      for (let i = 1; i <= 8; i++)
        await cdp.send('Input.dispatchTouchEvent', {
          type: 'touchMove',
          touchPoints: [{ x: width - 40 - i * 30, y }],
        });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForTimeout(700);
      report.metrics.push({
        width,
        phase: 'railSwipe',
        scrollLeft: await page.locator('.discovery-window').evaluate((n) => n.scrollLeft),
      });
      const card = page.locator('.discovery-item').nth(2).getByRole('button');
      await card.click();
      await page.waitForTimeout(400);
      await shot('rail-selected');
      await check(`${width} rail native static`, () =>
        expect(page.locator('.discovery-section')).toHaveAttribute('data-running', 'false'),
      );
    }
    await view('.portfolio-preview');
    await shot('portfolio');
    const cb = await page.locator('.portfolio-chart').boundingBox();
    if (width >= 760) {
      await page.mouse.move(cb.x + cb.width * 0.2, cb.y + cb.height * 0.5);
      await page.waitForTimeout(150);
    } else {
      await page.touchscreen.tap(cb.x + cb.width * 0.25, cb.y + cb.height * 0.5);
    }
    await check(`${width} chart input`, async () => {
      if ((await page.locator('.portfolio-chart').getAttribute('aria-valuenow')) === '11')
        throw Error('marker unchanged');
    });
    await shot('portfolio-inspect');
    await page.locator('.portfolio-chart').focus();
    await page.keyboard.press('Home');
    await check(`${width} chart keyboard`, () =>
      expect(page.locator('.portfolio-chart')).toHaveAttribute('aria-valuenow', '0'),
    );
    await view('.dex-grid');
    await page.getByRole('button', { name: 'Missing', exact: true }).click();
    await page.getByRole('button', { name: 'View Mew — missing', exact: true }).click();
    await page.waitForTimeout(750);
    await shot('dex-reveal');
    await check(`${width} dex filter`, () =>
      expect(page.locator('.dex-grid > button')).toHaveCount(2),
    );
    await view('.closing');
    await shot('closing');
    await check(`${width} CTA`, () =>
      expect(page.locator('.closing .button')).toHaveAttribute('href', '#sammlung'),
    );
    const offBefore = await page.evaluate(() => window.__review.draws);
    await page.waitForTimeout(1500);
    report.metrics.push({
      width,
      phase: 'offscreenCanvas',
      draws: (await page.evaluate(() => window.__review.draws)) - offBefore,
    });
    await page.locator('.closing .button').click();
    await page.waitForTimeout(1000);
    await check(`${width} CTA navigation`, async () => {
      if (!page.url().endsWith('#sammlung')) throw Error('wrong target');
    });
    await page.getByRole('button', { name: 'Deutsch', exact: true }).click();
    await page.waitForTimeout(300);
    await shot('collection-de');
    await page.getByRole('button', { name: 'English', exact: true }).click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow) report.failures.push({ width, error: 'horizontal overflow' });
    const metrics = await page.evaluate(() => window.__review);
    report.viewports.push({ width, height, overflow, ...metrics });
    if (width === 1440 || width === 390) {
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      report.metrics.push({
        width,
        phase: 'axe',
        violations: axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      });
    }
    await context.close();
    await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  }
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 1440 ? 900 : 844 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:3101');
    await page.waitForSelector('.is-static');
    await page.screenshot({ path: `${out}/${width}-reduced-hero.png` });
    await check(`${width} reduced`, async () => {
      await expect(page.locator('canvas')).toHaveCount(0);
      await expect(page.locator('.story-chapter')).toHaveCount(4);
    });
    await context.close();
  }
} finally {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(
  JSON.stringify(
    { failures: report.failures, errors: report.errors, tests: report.tests.length },
    null,
    2,
  ),
);
if (report.failures.length || report.errors.length) process.exitCode = 1;
