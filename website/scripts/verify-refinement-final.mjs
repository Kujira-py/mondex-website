import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const out = 'qa/refinement-final';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = {
  tests: [],
  errors: [],
  warnings: [],
  axe: [],
  screens: [],
  geometry: [],
  fallbacks: [],
};
try {
  for (const [width, height] of [
    [1440, 900],
    [1280, 800],
    [768, 1024],
    [390, 844],
    [360, 800],
  ]) {
    console.log('Final checks', width);
    const context = await browser.newContext({
      viewport: { width, height },
      isMobile: width < 500,
      hasTouch: width < 500,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    page.on('pageerror', (e) => report.errors.push({ width, error: e.message }));
    page.on('console', (m) => {
      if (m.type() === 'error') report.errors.push({ width, error: m.text() });
      if (m.type() === 'warning') report.warnings.push({ width, message: m.text() });
    });
    let n = 0;
    const shot = async (name, sel) => {
      const path = `${width}-${String(++n).padStart(2, '0')}-${name}.png`;
      await (sel ? page.locator(sel) : page).screenshot({ path: `${out}/${path}` });
      report.screens.push(path);
    };
    const scroll = async (selector) => {
      await page
        .locator(selector)
        .evaluate((n) =>
          window.scrollTo({
            top: n.getBoundingClientRect().top + scrollY - 100,
            behavior: 'instant',
          }),
        );
      await page.waitForTimeout(250);
    };
    await page.goto('http://127.0.0.1:3101');
    await page.waitForSelector('.scene-ready');
    await page.waitForTimeout(900);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await shot('hero');
    for (const i of [0, 4]) {
      await page.locator('.card-selector button').nth(i).click();
      await page.waitForTimeout(750);
      await shot(`hero-focus-${i}`);
    }
    await page.evaluate(() => (window.__heldCanvas = document.querySelector('canvas')));
    for (let i = 0; i < 2; i++) {
      await page.getByRole('button', { name: /Pause motion/ }).click();
      await expect(page.locator('.showcase')).toHaveAttribute('data-motion', 'paused');
      await page.getByRole('button', { name: /Resume motion/ }).click();
    }
    if (!(await page.evaluate(() => window.__heldCanvas === document.querySelector('canvas'))))
      throw Error('Canvas replaced');
    report.tests.push(`${width}: repeat Pause/Resume keeps Canvas`);
    const showcase = await page.locator('.showcase').boundingBox();
    for (const [chapter, progress] of [
      ['capture', 0.37],
      ['collect', 0.63],
      ['understand', 0.91],
      ['reverse-collect', 0.63],
    ]) {
      await page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: 'instant' }),
        (showcase.height - height) * progress,
      );
      await page.waitForTimeout(1100);
      await shot(`story-${chapter}`);
    }
    // Scanner starts only after the viewport trigger; capture its line while moving.
    await expect(page.locator('.scan-light')).toHaveCSS('opacity', '0');
    await scroll('.scan-art');
    await shot('scan-capture-start');
    await page.waitForTimeout(280);
    await shot('scan-capture-middle');
    await page.waitForTimeout(1000);
    await shot('scan-capture-end');
    for (const step of [1, 2]) {
      await page.locator('.scan-steps > button').nth(step).click();
      await page.waitForTimeout(220);
      await shot(`scan-${step}-middle`);
      await page.waitForTimeout(750);
      await scroll('.scan-art');
      await shot(`scan-${step}-end`);
    }
    const landing = await page.evaluate(() => {
      const card = document.querySelector('.scan-target').getBoundingClientRect(),
        slot = document.querySelector('.incoming-card-space').getBoundingClientRect(),
        row = document.querySelector('.new-row').getBoundingClientRect();
      return {
        x: card.x + card.width / 2 - (slot.x + slot.width / 2),
        y: card.y + card.height / 2 - (row.y + row.height / 2),
        width: card.width,
      };
    });
    report.geometry.push({ viewportWidth: width, phase: 'scan-landing', ...landing });
    if (Math.abs(landing.x) > 2 || Math.abs(landing.y) > 2 || Math.abs(landing.width - 40) > 2)
      throw Error(`Scanner landing mismatch ${JSON.stringify(landing)}`);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(150);
    await page.mouse.wheel(0, -600);
    await page.waitForTimeout(300);
    await expect(page.locator('.scan-demo')).toHaveAttribute('data-step', '2');
    await page.locator('.scan-steps > button').nth(1).click();
    await page.waitForTimeout(850);
    await page.locator('.app-confirm').click();
    await page.waitForTimeout(900);
    await expect(page.locator('.scan-status')).toContainText('Added');
    report.tests.push(
      `${width}: scanner arrival, three states, landing, reverse scroll and confirmation`,
    );
    await scroll('.collection-tabs');
    for (let a = 0; a < 4; a++)
      for (let b = 0; b < 4; b++) {
        if (a === b) continue;
        await page.locator('.collection-tabs button').nth(a).click();
        await page.waitForTimeout(70);
        await page.locator('.collection-tabs button').nth(b).click();
        await page.waitForTimeout(90);
      }
    await page.locator('.collection-tabs button').nth(0).click();
    await page.waitForTimeout(850);
    await shot('collection-cards');
    await page.locator('.collection-tabs button').nth(3).click();
    await page.waitForTimeout(850);
    await shot('collection-lists');
    await page.locator('.collection-tabs button').nth(2).click();
    await page.waitForTimeout(850);
    await shot('binder-start');
    const eevee = page.locator('[data-card-id="eevee"]');
    await expect(eevee).toBeVisible();
    if (Number(await eevee.evaluate((n) => getComputedStyle(n).zIndex)) < 1)
      throw Error('Eevee behind binder');
    for (let i = 0; i < 2; i++) {
      await page.getByRole('button', { name: 'Add card', exact: true }).click();
      await page.waitForTimeout(280);
      if (!i) await shot('binder-middle');
      await page.waitForTimeout(650);
      await expect(page.locator('.binder-controls strong')).toHaveText('9 / 9');
      if (!i) await shot('binder-end');
      await page.getByRole('button', { name: 'Replay', exact: true }).click();
      await page.waitForTimeout(850);
      await expect(page.locator('.binder-controls strong')).toHaveText('8 / 9');
    }
    report.tests.push(
      `${width}: all twelve directed collection transitions, binder completion/reset twice`,
    );
    await scroll('.discovery-heading');
    await shot('rail');
    if (width >= 760) {
      for (const i of [1, 3, 5]) {
        await page.locator('.discovery-item').nth(i).hover({ force: true });
        await page.waitForTimeout(300);
        const a = await page
          .locator('.discovery-track')
          .evaluate((n) => getComputedStyle(n).transform);
        await page.waitForTimeout(150);
        if (
          a ===
          (await page.locator('.discovery-track').evaluate((n) => getComputedStyle(n).transform))
        )
          throw Error('loop stopped on hover');
        if (i === 3) await shot('rail-hover');
        await page.mouse.move(5, 100);
        await page.waitForTimeout(200);
      }
      await page.locator('.discovery-item').first().getByRole('button').focus();
      for (let i = 0; i < 11; i++) await page.keyboard.press('Tab');
      await page.waitForTimeout(300);
      await shot('rail-keyboard-last');
    } else {
      await scroll('.discovery-window');
      const box = await page.locator('.discovery-window').boundingBox();
      const cdp = await context.newCDPSession(page);
      let y = box.y + 150;
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: width - 35, y }],
      });
      for (let i = 1; i <= 8; i++) {
        await cdp.send('Input.dispatchTouchEvent', {
          type: 'touchMove',
          touchPoints: [{ x: width - 35 - 30 * i, y }],
        });
        await page.waitForTimeout(15);
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForTimeout(500);
      if ((await page.locator('.discovery-window').evaluate((n) => n.scrollLeft)) < 40)
        throw Error('Swipe did not scroll');
      await page.locator('.discovery-item').nth(3).getByRole('button').click();
      await page.waitForTimeout(300);
      await shot('rail-swipe-selected');
    }
    report.tests.push(`${width}: rail hover/focus or native swipe/selection`);
    await page.mouse.move(5, 100);
    await scroll('.portfolio-preview');
    await shot('portfolio-chart-start');
    await page.waitForTimeout(280);
    await shot('portfolio-chart-middle');
    await page.waitForTimeout(950);
    await shot('portfolio-chart-end');
    const line = page.locator('.portfolio-chart path[stroke="#b19af9"]');
    await expect(line).toHaveCSS('stroke-dashoffset', '0px');
    const cb = await page.locator('.portfolio-chart').boundingBox();
    if (width >= 760) await page.mouse.move(cb.x + cb.width * 0.4, cb.y + cb.height * 0.5);
    else {
      const cdp = await context.newCDPSession(page);
      const y = cb.y + cb.height * 0.5;
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: cb.x + cb.width * 0.1, y }],
      });
      for (let i = 1; i <= 6; i++) {
        await cdp.send('Input.dispatchTouchEvent', {
          type: 'touchMove',
          touchPoints: [{ x: cb.x + cb.width * (0.1 + i * 0.1), y }],
        });
        await page.waitForTimeout(30);
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    }
    const value = Number(await page.locator('.portfolio-chart').getAttribute('aria-valuenow'));
    if (value === 11 || value === 0) throw Error(`Chart scrub failed: ${value}`);
    await shot('portfolio-chart-inspect');
    await page.locator('.portfolio-chart').focus();
    await page.keyboard.press('Home');
    await expect(page.locator('.chart-readout')).toContainText('$160.00');
    await page.keyboard.press('End');
    await expect(page.locator('.chart-readout')).toContainText('$200.00');
    report.tests.push(`${width}: chart once, mouse/touch drag, keyboard and consistent endpoints`);
    await scroll('.dex-grid');
    await page.getByRole('button', { name: 'Missing', exact: true }).click();
    await page.getByRole('button', { name: 'View Mew — missing', exact: true }).click();
    await page.waitForTimeout(750);
    await shot('dex');
    await scroll('.closing');
    await shot('cta');
    await page.locator('.closing .button').click();
    await page.waitForTimeout(450);
    if (!page.url().endsWith('#sammlung')) throw Error('CTA destination');
    if (width < 500) {
      await page.getByRole('button', { name: 'Open menu', exact: true }).click();
      await shot('mobile-menu');
      await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Portfolio', exact: true })
        .click();
      await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    }
    await page.getByRole('button', { name: 'Deutsch', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await scroll('.scan-art');
    await page.locator('.scan-steps > button').nth(1).click();
    await page.waitForTimeout(850);
    await shot('scanner-de');
    await scroll('.portfolio-preview');
    await shot('portfolio-de');
    await page.getByRole('button', { name: 'English', exact: true }).click();
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
      throw Error('Document overflow');
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    report.axe.push({
      width,
      violations: axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    });
    await context.close();
    await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  }
  for (const [name, options] of [
    ['reduced', { reducedMotion: 'reduce' }],
    ['unavailable', {}],
    ['context-loss', {}],
    ['no-js', { javaScriptEnabled: false }],
  ]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ...options });
    const page = await context.newPage();
    if (name === 'unavailable')
      await page.addInitScript(() => {
        const get = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          return type.includes('webgl') ? null : get.call(this, type, ...args);
        };
      });
    await page.goto('http://127.0.0.1:3101');
    if (name === 'context-loss') {
      await page.waitForSelector('.scene-ready');
      await page.evaluate(() =>
        document
          .querySelector('canvas')
          .getContext('webgl2')
          .getExtension('WEBGL_lose_context')
          .loseContext(),
      );
    }
    if (name !== 'no-js') await page.waitForSelector('.is-static');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/390-${name}.png` });
    const data = await page
      .locator('.story-chapter')
      .evaluateAll((nodes) =>
        nodes.map((n) => ({
          visible: getComputedStyle(n).visibility,
          opacity: getComputedStyle(n).opacity,
          inert: n.inert,
        })),
      );
    if (data.some((n) => n.visible !== 'visible' || n.opacity !== '1' || n.inert))
      throw Error(`Unreadable fallback ${name}`);
    if (await page.locator('canvas').count()) throw Error(`Fallback canvas ${name}`);
    report.fallbacks.push({ name, chapters: data });
    await context.close();
  }
} finally {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(
  JSON.stringify(
    {
      errors: report.errors,
      axe: report.axe,
      tests: report.tests,
      fallbacks: report.fallbacks.map((f) => f.name),
    },
    null,
    2,
  ),
);
if (report.errors.length || report.axe.some((a) => a.violations.length)) process.exitCode = 1;
