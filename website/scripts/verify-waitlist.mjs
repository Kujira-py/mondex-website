import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const origin = process.env.REVIEW_ORIGIN || 'http://127.0.0.1:3102';
const endpoint = 'https://mondex-api.onrender.com/api/v1/waitlist';
const report = [];
await mkdir('qa/waitlist', { recursive: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const requests = [];
  await page.route(endpoint, async (route) => {
    requests.push(route.request().postDataJSON());
    await new Promise((resolve) => setTimeout(resolve, 400));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ detail: "You're on the list. We'll email you when MonDex is ready." }),
    });
  });
  await page.goto(`${origin}/?utm_campaign=launch-review`);
  await page.locator('a[href="#vormerken"]:visible').first().click();
  const form = page.locator('.waitlist-form');
  const submit = form.getByRole('button', { name: 'Join the waitlist', exact: true });
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(form.getByRole('alert')).toContainText('valid email');
  expect(requests.length).toBe(0);
  await form.getByLabel('Email address', { exact: true }).fill('review@example.com');
  await form.getByLabel('First name', { exact: false }).fill('Review');
  await form.getByRole('radio', { name: 'iPhone', exact: true }).check();
  await page.screenshot({ path: 'qa/waitlist/desktop-form.png' });
  const axe = await new AxeBuilder({ page }).include('.launch-section').analyze();
  expect(axe.violations).toEqual([]);
  await submit.dblclick();
  await expect(page.locator('.waitlist-confirmation')).toContainText('You’re on the list.');
  expect(requests).toHaveLength(1);
  expect(requests[0]).toEqual({
    email: 'review@example.com',
    name: 'Review',
    platform: 'ios',
    source: 'launch-review',
    locale: 'en',
    website: '',
  });
  await expect(page.locator('.waitlist-confirmation')).toBeFocused();
  expect(page.url()).not.toContain('review@example.com');
  expect(errors).toEqual([]);
  report.push(
    'Desktop CTA, email validation, exact API payload, duplicate prevention, accessible confirmation and form accessibility passed (mocked response).',
  );
  await page.close();

  for (const [scenario, status, message] of [
    ['invalid', 422, 'valid email'],
    ['rate', 429, 'Too many attempts'],
    ['server', 503, 'couldn’t confirm'],
    ['network', 0, 'couldn’t confirm'],
    ['timeout', -1, 'couldn’t confirm'],
  ]) {
    const p = await browser.newPage({ reducedMotion: 'reduce' });
    await p.route(endpoint, (route) =>
      status === 0
        ? route.abort()
        : status === -1
          ? new Promise(() => {})
          : route.fulfill({ status, contentType: 'application/json', body: '{}' }),
    );
    await p.goto(`${origin}/#vormerken`);
    await p.getByLabel('Email address', { exact: true }).fill('review@example.com');
    await p.locator('.waitlist-form button').click();
    await expect(p.locator('.waitlist-error')).toContainText(message, { timeout: 18000 });
    await expect(p.getByLabel('Email address', { exact: true })).toHaveValue('review@example.com');
    await expect(p.locator('.waitlist-confirmation')).toHaveCount(0);
    report.push(
      `${scenario}: visible error, input retained, no false confirmation (mocked response).`,
    );
    await p.close();
  }

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  let payload;
  await mobile.route(endpoint, (route) => {
    payload = route.request().postDataJSON();
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"detail":"ok"}' });
  });
  await mobile.goto(`${origin}/de/?utm_campaign=altseite#vormerken`);
  await expect(mobile.locator('html')).toHaveAttribute('lang', 'de');
  await expect(mobile.locator('.waitlist-form')).toBeVisible();
  expect(mobile.url()).toContain('utm_campaign=altseite');
  expect(mobile.url()).toContain('#vormerken');
  expect(mobile.url()).not.toContain('lang=');
  await mobile.reload();
  await expect(mobile.locator('html')).toHaveAttribute('lang', 'de');
  await mobile.getByLabel('E-Mail-Adresse', { exact: true }).fill('review@example.com');
  await mobile.locator('.waitlist-form').scrollIntoViewIfNeeded();
  expect(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
    true,
  );
  await mobile.screenshot({ path: 'qa/waitlist/mobile-form.png' });
  await mobile.locator('.waitlist-form button').click();
  await expect(mobile.locator('.waitlist-confirmation')).toContainText('Du stehst auf der Liste.');
  expect(payload).toEqual({
    email: 'review@example.com',
    source: 'altseite',
    locale: 'de',
    website: '',
  });
  await mobile.goto(`${origin}/de/datenschutz/#website`);
  await expect(mobile.locator('html')).toHaveAttribute('lang', 'de');
  await expect(mobile.locator('#website')).toContainText('GitHub Pages');
  await mobile.getByRole('button', { name: 'English', exact: true }).click();
  await expect(mobile.locator('html')).toHaveAttribute('lang', 'en');
  await expect(mobile.locator('#website')).not.toContainText('OpenAI');
  report.push(
    '390px mobile, German legacy URLs, campaign/hash preservation, language persistence/switching, optional fields and hosting privacy text passed.',
  );
  await mobile.close();

  const nojs = await browser.newPage({ javaScriptEnabled: false });
  await nojs.goto(origin + '/#vormerken');
  await expect(nojs.locator('.waitlist-form button')).toBeDisabled();
  await expect(nojs.locator('.waitlist-form input[name=email]')).toBeDisabled();
  await expect(
    nojs.locator('.launch-section noscript p'),
  ).toBeVisible();
  report.push(
    'Without JavaScript, form controls stay disabled and a contact alternative is visible.',
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile('qa/waitlist/report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
