import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const base = 'http://127.0.0.1:3101';
const out = 'qa/languages';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { viewports: [], errors: [], persistence: [], statePreserved: false, axe: [] };
try {
  for (const [width, height] of [
    [1440, 900],
    [1280, 800],
    [768, 1024],
    [390, 844],
    [360, 800],
  ]) {
    // A German browser must still start in English until a preference is chosen.
    const context = await browser.newContext({
      viewport: { width, height },
      locale: 'de-DE',
      isMobile: width < 500,
      hasTouch: width < 500,
    });
    const page = await context.newPage();
    page.on('pageerror', (error) => report.errors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(base);
    await page.waitForSelector('.scene-ready');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('h1')).toHaveText('The joy ofcollecting.');
    await expect(page.getByRole('tab', { name: 'Cards', exact: true })).toBeAttached();
    await expect(page.locator('.dex-grid strong').first()).toHaveText('Bulbasaur');
    await expect(page).toHaveTitle('MonDex – The joy of collecting.');
    for (const locale of ['en', 'de']) {
      await page
        .getByRole('button', { name: locale === 'en' ? 'English' : 'Deutsch', exact: true })
        .click();
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(
        page.getByRole('button', { name: locale === 'en' ? 'English' : 'Deutsch', exact: true }),
      ).toHaveAttribute('aria-pressed', 'true');
      if (width === 1440 || width === 390) {
        await page.screenshot({ path: `${out}/${width}-${locale}-hero.png` });
        const axe = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();
        report.axe.push({
          width,
          locale,
          violations: axe.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
        });
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      const controls = await page
        .locator('.language-switch button, .menu-toggle:visible')
        .evaluateAll((buttons) =>
          buttons.map((button) => {
            const r = button.getBoundingClientRect();
            return { width: r.width, height: r.height, right: r.right };
          }),
        );
      assert(!overflow, `${width}/${locale}: no horizontal overflow`);
      assert(
        controls.every((r) => r.width >= 44 && r.height >= 44 && r.right <= width),
        `${width}/${locale}: reachable language controls`,
      );
      report.viewports.push({ width, height, locale, overflow, controls });
    }
    if (width === 1440) {
      await expect(page.locator('h1')).toHaveText('So fühlt sichSammeln an.');
      await expect(page.locator('.dex-grid strong').first()).toHaveText('Bisasam');
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('lang', 'de');
      await expect(page).toHaveTitle('MonDex – So fühlt sich Sammeln an.');
      report.persistence.push('German survives reload');
      await page.waitForSelector('.scene-ready');
      await page.getByRole('button', { name: 'Mew ex ansehen', exact: true }).click();
      await page.getByRole('tab', { name: 'Listen', exact: true }).click();
      await page.getByRole('button', { name: /02 Prüfen/ }).click();
      await page.getByRole('button', { name: 'Entwicklung einordnen', exact: true }).click();
      await page.getByRole('button', { name: 'Noch offen', exact: true }).click();
      await page.getByRole('button', { name: 'Mew noch offen – ansehen', exact: true }).click();
      const before = await page.evaluate(() => {
        window.__languageCanvas = document.querySelector('canvas');
        return scrollY;
      });
      await page.getByRole('button', { name: 'English', exact: true }).click();
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      assert.equal(
        await page.evaluate(() => window.__languageCanvas === document.querySelector('canvas')),
        true,
        '3D canvas stays mounted',
      );
      assert(
        Math.abs((await page.evaluate(() => scrollY)) - before) < 100,
        'Scroll position retained',
      );
      await expect(page.locator('.card-selector button[aria-label="View Mew ex"]')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(page.getByRole('tab', { name: 'Lists', exact: true })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      await expect(page.locator('.scan-demo')).toHaveAttribute('data-step', '1');
      await expect(
        page.getByRole('button', { name: 'Put changes in perspective', exact: true }),
      ).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('.dex-grid > button')).toHaveCount(2);
      await expect(
        page.getByRole('button', { name: 'View Mew — missing', exact: true }),
      ).toHaveAttribute('aria-pressed', 'true');
      await expect(
        page.getByRole('button', { name: 'View Mew — missing', exact: true }),
      ).not.toHaveClass('is-missing');
      report.statePreserved = true;
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      report.persistence.push('English survives reload');
    }
    if (width === 390) {
      await page.getByRole('button', { name: 'Menü öffnen', exact: true }).click();
      await page.getByRole('button', { name: 'English', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Close menu', exact: true })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      await page
        .getByRole('navigation')
        .getByRole('link', { name: 'Collection', exact: true })
        .click();
      await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    }
    if (width === 1440 || width === 390) {
      await page.getByRole('button', { name: 'English', exact: true }).click();
      for (const id of ['scanner', 'sammlung', 'portfolio', 'entdecken']) {
        await page.locator(`#${id}`).screenshot({
          path: `${out}/${width}-en-${id}.png`,
          style: '.site-header,.skip-link{visibility:hidden!important}',
        });
      }
    }
    await context.close();
  }
  for (const [value, expected] of [
    [undefined, 'en'],
    ['de', 'en'],
    ['invalid', 'en'],
  ]) {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      locale: 'de-DE',
      viewport: { width: 390, height: 844 },
    });
    if (value) await context.addCookies([{ name: 'mondex-language', value, url: base }]);
    const page = await context.newPage();
    await page.goto(base);
    await expect(page.locator('html')).toHaveAttribute('lang', expected);
    await expect(page.locator('h1')).toHaveText(
      expected === 'en' ? 'The joy ofcollecting.' : 'So fühlt sichSammeln an.',
    );
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    report.persistence.push(`Server render, cookie ${value ?? 'absent'}: ${expected}`);
    await context.close();
  }
  assert.equal(report.errors.length, 0);
  assert(report.axe.every((entry) => entry.violations.length === 0));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile(`${out}/verification.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
