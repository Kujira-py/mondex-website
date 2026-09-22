import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const directory = 'qa/content';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { checks: [], errors: [], a11y: [], screenshots: [], legalDrafts: [] };
const routes = [
  '/',
  '/kontakt/',
  '/impressum/',
  '/datenschutz/',
  '/pokemon-tcg-scanner/',
  '/digital-pokemon-card-binder/',
  '/pokemon-card-collection-tracker/',
];
const titles = [
  'MonDex',
  'Contact',
  'Legal Notice',
  'Privacy Policy',
  'Pokémon TCG scanner',
  'Digital Pokémon binders',
  'Pokémon collection tracker',
];
const base = 'http://127.0.0.1:3101';
async function check(name, task) {
  try {
    await task();
    report.checks.push({ name, pass: true });
  } catch (error) {
    report.checks.push({ name, pass: false, error: error.message });
  }
}
try {
  for (const [width, height] of [
    [1440, 900],
    [842, 837],
    [390, 844],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    page.on('pageerror', (error) => report.errors.push({ width, message: error.message }));
    page.on('response', (response) => {
      if (response.status() >= 400)
        report.errors.push({ width, status: response.status(), url: response.url() });
    });
    for (const [i, route] of routes.entries()) {
      const response = await page.goto(base + route);
      await check(`${width} ${route} direct load`, async () => expect(response.status()).toBe(200));
      await page.getByRole('button', { name: 'English', exact: true }).click();
      await check(`${width} ${route} English metadata`, async () => {
        await expect(page).toHaveTitle(new RegExp(titles[i]));
        expect(await page.locator('head title').count()).toBe(1);
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      });
      await check(`${width} ${route} links and width`, async () => {
        const broken = await page.evaluate(() =>
          [...document.querySelectorAll('a[href]')]
            .map((a) => a.getAttribute('href'))
            .filter(
              (href) =>
                href.startsWith('#') && href.length > 1 && !document.getElementById(href.slice(1)),
            ),
        );
        expect(broken).toEqual([]);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        ).toBe(true);
        const nav = await page
          .locator('.nav-shell')
          .evaluate((el) => ({ scroll: el.scrollWidth, width: el.clientWidth }));
        expect(nav.scroll).toBeLessThanOrEqual(nav.width + 1);
      });
      if (width === 1440 && route !== '/') {
        const axe = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();
        report.a11y.push({
          route,
          violations: axe.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => n.target),
          })),
        });
      }
      if (['/impressum/', '/datenschutz/'].includes(route) && width === 1440)
        report.legalDrafts.push({
          route,
          pending: await page.locator('[data-legal-pending]').count(),
          notice: await page.locator('[data-legal-draft]').count(),
        });
      if (width !== 842 && route !== '/') {
        const name = `${width}-${route.split('/')[1]}-en.png`;
        await page.screenshot({ path: `${directory}/${name}` });
        report.screenshots.push(name);
      }
      await page.getByRole('button', { name: 'Deutsch', exact: true }).click();
      await check(`${width} ${route} German and width`, async () => {
        await expect(page.locator('html')).toHaveAttribute('lang', 'de');
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        ).toBe(true);
      });
      if (route === '/kontakt/') {
        await check(`${width} contact topics`, async () => {
          const links = await page
            .locator('.topic-subject')
            .evaluateAll((els) => els.map((el) => el.getAttribute('href')));
          expect(links).toHaveLength(5);
          for (const link of links)
            expect(link).toMatch(/^mailto:contact@mondextcg\.com\?subject=.+/);
        });
        await page.reload();
        await expect(page.locator('html')).toHaveAttribute('lang', 'de');
        await expect(page).toHaveTitle('Kontakt · MonDex');
      }
    }
    await page.goto(base + '/#faq');
    await page.getByRole('button', { name: 'English', exact: true }).click();
    await page.locator('.faq-list summary').first().focus();
    await page.keyboard.press('Enter');
    await check(`${width} keyboard FAQ`, async () =>
      expect(await page.locator('.faq-list details').first().getAttribute('open')).not.toBeNull(),
    );
    await page.locator('#faq').scrollIntoViewIfNeeded();
    const faqShot = `${width}-faq.png`;
    await page.screenshot({ path: `${directory}/${faqShot}` });
    report.screenshots.push(faqShot);
    await page.locator('#vormerken').scrollIntoViewIfNeeded();
    await check(`${width} registration target`, async () => {
      await expect(page.locator('#vormerken .primary')).toHaveAttribute(
        'href',
        'https://mondextcg.com/#vormerken',
      );
      await page.getByRole('button', { name: 'Deutsch', exact: true }).click();
      await expect(page.locator('#vormerken .primary')).toHaveAttribute(
        'href',
        'https://mondextcg.com/de/#vormerken',
      );
    });
    const launchShot = `${width}-launch-de.png`;
    await page.screenshot({ path: `${directory}/${launchShot}` });
    report.screenshots.push(launchShot);
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    const footerShot = `${width}-footer.png`;
    await page.screenshot({ path: `${directory}/${footerShot}` });
    report.screenshots.push(footerShot);
    if (width === 390) {
      await page.locator('.menu-toggle').click();
      await check('Mobile registration/contact navigation', async () => {
        await expect(page.locator('.mobile-waitlist-link')).toBeVisible();
        await expect(page.locator('.mobile-contact-link')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.locator('.menu-toggle')).toBeFocused();
        await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'false');
      });
    }
    const axe = await new AxeBuilder({ page })
      .include('.faq-section')
      .include('.launch-section')
      .include('.site-footer')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    report.a11y.push({
      route: '/',
      width,
      violations: axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    });
    await context.close();
  }
  const noJS = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await noJS.newPage();
  await page.goto(base + '/kontakt/');
  await check('Contact without JavaScript', () =>
    expect(page.locator('.contact-email')).toHaveText('contact@mondextcg.com'),
  );
  await page.goto(base + '/#vormerken');
  await check('Registration available without JavaScript', () =>
    expect(page.locator('#vormerken .primary')).toHaveAttribute(
      'href',
      'https://mondextcg.com/#vormerken',
    ),
  );
  await noJS.close();
} finally {
  await browser.close();
  await writeFile(`${directory}/report.json`, JSON.stringify(report, null, 2));
}
console.log(
  JSON.stringify(
    {
      checks: report.checks.length,
      failures: report.checks.filter((c) => !c.pass),
      errors: report.errors,
      accessibility: report.a11y.filter((a) => a.violations.length),
      legalDrafts: report.legalDrafts,
    },
    null,
    2,
  ),
);
if (
  report.errors.length ||
  report.checks.some((c) => !c.pass) ||
  report.a11y.some((a) => a.violations.length)
)
  process.exitCode = 1;
