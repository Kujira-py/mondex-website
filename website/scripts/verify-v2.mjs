import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const out = 'qa/redesign-final';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { viewports: [], interactions: {}, fallbacks: [], axe: [] };
const base = 'http://127.0.0.1:3101';
for (const [name, width, height] of [
  ['desktop', 1440, 900],
  ['laptop', 1280, 800],
  ['tablet', 768, 1024],
  ['mobile', 390, 844],
  ['narrow', 360, 800],
]) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile: width < 500,
    hasTouch: width < 500,
  });
  const page = await context.newPage();
  const errors = [],
    assetFailures = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (r) => {
    if (r.status() >= 400) assetFailures.push({ url: r.url(), status: r.status() });
  });
  await page.context().addCookies([{ name: 'mondex-language', value: 'de', url: base }]);
  await page.goto(base);
  await page.waitForSelector('.scene-ready');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/${name}-hero.png` });
  const box = await page.locator('.showcase').boundingBox();
  for (const [chapter, p] of [
    ['scan', 0.34],
    ['collect', 0.61],
    ['portfolio', 0.89],
  ]) {
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: 'instant' }),
      (box.height - height) * p,
    );
    await page.waitForTimeout(950);
    await page.screenshot({ path: `${out}/${name}-story-${chapter}.png` });
  }
  if (name === 'desktop' || name === 'mobile') {
    report.axe.push({
      name,
      violations: (
        await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      ).violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
    });
    for (const id of ['scanner', 'sammlung', 'portfolio', 'entdecken']) {
      await page.evaluate(
        (id) =>
          window.scrollTo({ top: document.getElementById(id).offsetTop, behavior: 'instant' }),
        id,
      );
      await page.waitForTimeout(200);
      await page.locator(`#${id}`).screenshot({
        path: `${out}/${name}-${id}.png`,
        style: '.site-header,.skip-link{visibility:hidden!important}',
      });
    }
    for (const name of ['Sets', 'Binder', 'Listen', 'Karten']) {
      await page.getByRole('tab', { name, exact: true }).click();
      await page.waitForTimeout(850);
      await page.locator('.collection-panel').screenshot({
        path: `${out}/${width}-collection-${name}.png`,
        style: '.site-header,.skip-link{visibility:hidden!important}',
      });
    }
  }
  report.viewports.push({
    name,
    errors,
    assetFailures,
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  });
  await context.close();
}
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.context().addCookies([{ name: 'mondex-language', value: 'de', url: base }]);
await page.goto(base);
await page.waitForSelector('.scene-ready');
await page.getByRole('button', { name: 'Mew ex ansehen', exact: true }).click();
report.interactions.selectCard = await page
  .getByRole('button', { name: 'Mew ex ansehen', exact: true })
  .getAttribute('aria-pressed');
await page.mouse.move(800, 550);
await page.waitForTimeout(750);
await page.screenshot({ path: `${out}/desktop-card-focus.png` });
await page.locator('#sammlung').scrollIntoViewIfNeeded();
const tab = page.getByRole('tab', { name: 'Karten', exact: true });
await tab.focus();
await page.keyboard.press('ArrowRight');
report.interactions.keyboardTab = await page
  .getByRole('tab', { name: 'Sets', exact: true })
  .getAttribute('aria-selected');
await page.keyboard.press('End');
report.interactions.keyboardEnd = await page
  .getByRole('tab', { name: 'Listen', exact: true })
  .getAttribute('aria-selected');
await page.locator('#scanner').scrollIntoViewIfNeeded();
await page.getByRole('button', { name: /02 Prüfen/ }).click();
report.interactions.scannerStep = await page.locator('.scan-demo').getAttribute('data-step');
await page.getByRole('button', { name: 'Entwicklung einordnen' }).click();
report.interactions.portfolioExpanded = await page
  .getByRole('button', { name: 'Entwicklung einordnen' })
  .getAttribute('aria-expanded');
await page.getByRole('button', { name: 'Noch offen', exact: true }).click();
report.interactions.dexFiltered = await page.locator('.dex-grid>button').count();
await page.getByRole('button', { name: 'Mew noch offen – ansehen', exact: true }).click();
report.interactions.dexRevealed = await page
  .getByRole('button', { name: 'Mew noch offen – ansehen', exact: true })
  .getAttribute('class');
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(900);
await page.getByRole('button', { name: 'Bewegung pausieren' }).click();
report.interactions.manualPaused = await page.locator('.showcase').getAttribute('data-motion');
await page.getByRole('button', { name: 'Bewegung fortsetzen' }).click();
await page.waitForSelector('.scene-ready');
report.interactions.manualResume = await page.locator('.showcase').getAttribute('class');
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.waitForTimeout(300);
report.interactions.runtimeReduced = await page.locator('.story-chapter').evaluateAll((ps) =>
  ps.map((p) => ({
    visible: getComputedStyle(p).visibility,
    opacity: getComputedStyle(p).opacity,
    inert: p.inert,
  })),
);
await page.close();
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
await mobile.context().addCookies([{ name: 'mondex-language', value: 'de', url: base }]);
await mobile.goto(base);
await mobile.getByRole('button', { name: 'Menü öffnen' }).click();
await mobile.getByRole('navigation').getByRole('link', { name: 'Sammlung', exact: true }).click();
await mobile.waitForTimeout(600);
report.interactions.mobileNav = {
  hash: new URL(mobile.url()).hash,
  open: await mobile.getByRole('button', { name: 'Menü öffnen' }).getAttribute('aria-expanded'),
};
await mobile.getByRole('button', { name: 'Menü öffnen' }).click();
await mobile.keyboard.press('Escape');
report.interactions.menuEscape = await mobile
  .getByRole('button', { name: 'Menü öffnen' })
  .getAttribute('aria-expanded');
await mobile.close();
for (const [name, opts, url] of [
  ['reduced', { reducedMotion: 'reduce' }, base],
  ['no-webgl', {}, base],
  ['no-js', { javaScriptEnabled: false }, base],
]) {
  const p = await browser.newPage({ viewport: { width: 390, height: 844 }, ...opts });
  await p.context().addCookies([{ name: 'mondex-language', value: 'de', url: base }]);
  if (name === 'no-webgl')
    await p.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        return type.includes('webgl') ? null : original.call(this, type, ...args);
      };
    });
  await p.goto(url);
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}/${name}-hero.png` });
  report.fallbacks.push({
    name,
    overflow: await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    chapters: await p.locator('.story-chapter').evaluateAll((ps) =>
      ps.map((p) => ({
        visible: getComputedStyle(p).visibility,
        opacity: getComputedStyle(p).opacity,
      })),
    ),
    canvases: await p.locator('canvas').count(),
  });
  await p.close();
}
await writeFile(`${out}/verification.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
