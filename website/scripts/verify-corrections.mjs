import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { axe: [], fallbacks: [], anchors: [], errors: [] };
for (const [name, width, height] of [
  ['desktop', 1440, 900],
  ['mobile', 390, 844],
]) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  page.on('pageerror', (e) => report.errors.push(e.message));
  await page.goto('http://127.0.0.1:3101');
  await page.waitForSelector('.scene-ready');
  await page.waitForTimeout(700);
  report.axe.push({
    name,
    violations: (
      await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    ).violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
    })),
  });
  await page.screenshot({ path: `qa/redesign-final/${name}-hero.png` });
  report.anchors = await page.locator('a[href^="#"]').evaluateAll((as) =>
    as.map((a) => ({
      href: a.getAttribute('href'),
      resolves: !!document.getElementById(a.getAttribute('href').slice(1)),
    })),
  );
  await context.close();
}
for (const [name, options, url] of [
  ['reduced', { reducedMotion: 'reduce' }, ''],
  ['no-webgl', {}, ''],
  ['no-js', { javaScriptEnabled: false }, ''],
]) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ...options });
  const page = await context.newPage();
  if (name === 'no-webgl')
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        return type.includes('webgl') ? null : original.call(this, type, ...args);
      };
    });
  await page.goto(`http://127.0.0.1:3101/${url}`);
  await page.waitForTimeout(350);
  await page.screenshot({ path: `qa/redesign-final/${name}-hero.png` });
  const data = {
    name,
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    canvas: await page.locator('canvas').count(),
    chapters: await page.locator('.story-chapter').evaluateAll((ps) =>
      ps.map((p) => ({
        visible: getComputedStyle(p).visibility,
        opacity: getComputedStyle(p).opacity,
        inert: p.inert,
      })),
    ),
  };
  await page.evaluate(() =>
    window.scrollTo({
      top: document.querySelector('.chapter-2').getBoundingClientRect().top + scrollY,
      behavior: 'instant',
    }),
  );
  await page.waitForTimeout(100);
  await page.screenshot({ path: `qa/redesign-final/${name}-chapter2.png` });
  report.fallbacks.push(data);
  await context.close();
}
await writeFile('qa/redesign-final/corrections.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
assert(
  report.axe.every((v) => v.violations.length === 0),
  'No axe violations',
);
assert(
  report.fallbacks.every(
    (f) =>
      !f.overflow &&
      f.canvas === 0 &&
      f.chapters.every((c) => c.visible === 'visible' && c.opacity === '1'),
  ),
  'Fallback content visible without overflow',
);
assert(
  report.anchors.every((a) => a.resolves),
  'All anchors resolve',
);
assert.equal(report.errors.length, 0);
const verification = JSON.parse(await readFile('qa/redesign-final/verification.json', 'utf8'));
verification.axe = report.axe;
verification.fallbacks = report.fallbacks;
verification.finalCorrectionsVerified = true;
await writeFile('qa/redesign-final/verification.json', JSON.stringify(verification, null, 2));
