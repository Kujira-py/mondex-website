import { chromium, webkit, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3101';
const output = 'qa/mobile-hero';
await mkdir(output, { recursive: true });
const errors = [];

async function open(browser, options = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 740 }, isMobile: true, hasTouch: true, ...options });
  // All waitlist traffic stays local to this test, including form submissions.
  await context.route('**/api/v1/waitlist**', (route) => route.fulfill({ json: { count: null } }));
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.hp-phone')).toHaveCSS('opacity', '1');
  if (options.javaScriptEnabled !== false && options.reducedMotion !== 'reduce') {
    // Story initialization confirms hydration and the gesture listeners are ready.
    await expect(page.locator('.hp-slot-name')).toHaveCSS('visibility', 'hidden');
  }
  return { context, page };
}

// WebKit's mobile driver has no swipe API. Send touch events to exercise the
// production gesture handlers; the Chromium pass below also uses native input.
async function touch(page, selector = '.mx-hero-copy', { dx = 0, dy = 70, end = true, count = 1 } = {}) {
  return page.locator(selector).evaluate((target, { dx, dy, end, count }) => {
    const send = (type, x, y) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'touches', { value: type === 'touchend' ? [] : Array.from({ length: count }, (_, i) => ({ clientX: x + i * 30, clientY: y })) });
      target.dispatchEvent(event);
      return event.defaultPrevented;
    };
    send('touchstart', 150, 300);
    const prevented = send('touchmove', 150 + dx, 300 - dy);
    if (end) send('touchend', 150 + dx, 300 - dy);
    return prevented;
  }, { dx, dy, end, count });
}

async function assertAligned(page) {
  await expect.poll(() => page.evaluate(() => Math.abs(document.querySelector('.hp').getBoundingClientRect().top - document.querySelector('.mx-header').getBoundingClientRect().bottom))).toBeLessThan(1.1);
  const bounds = await page.evaluate(() => ({
    phone: document.querySelector('.hp-phone').getBoundingClientRect().toJSON(),
    replay: document.querySelector('.hp-replay').getBoundingClientRect().toJSON(),
    header: document.querySelector('.mx-header').getBoundingClientRect().bottom,
    height: window.innerHeight,
    overflow: document.documentElement.scrollWidth > window.innerWidth,
  }));
  expect(bounds.phone.top).toBeGreaterThanOrEqual(bounds.header);
  expect(bounds.phone.bottom).toBeLessThan(bounds.height);
  expect(bounds.replay.bottom).toBeLessThanOrEqual(bounds.height);
  expect(bounds.overflow).toBe(false);
}

const safari = await webkit.launch();
try {
  for (const [width, height, german] of [[390, 740, false], [375, 667, false], [360, 640, false], [430, 760, true], [768, 1024, false], [844, 390, false]]) {
    const { context, page } = await open(safari, { viewport: { width, height } });
    if (german) {
      await page.getByRole('button', { name: 'Deutsch' }).click();
      await page.waitForURL('**/de/');
      await expect(page.locator('.hp-slot-name')).toHaveCSS('visibility', 'hidden');
    }
    if (width <= 520) {
      const input = await page.locator('.mx-hero input[type=email]').boundingBox();
      expect(input.height).toBe(60);
      await expect(page.locator('.mx-hero input[type=email]')).toHaveCSS('font-size', '16px');
    }
    await expect(page.locator('.hp-card')).toHaveCSS('opacity', '1');
    await expect(page.locator('.hp-receipt')).toHaveCSS('opacity', '0');
    await page.waitForTimeout(250);
    await expect(page.locator('.hp-receipt')).toHaveCSS('opacity', '0');
    await page.screenshot({ path: `${output}/webkit-${width}-landing.png` });
    expect(await touch(page)).toBe(true);
    await assertAligned(page);
    await page.screenshot({ path: `${output}/webkit-${width}-aligned.png` });
    // The phone stays aligned after the initial swipe.
    const alignedY = await page.evaluate(() => scrollY);
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => scrollY)).toBe(alignedY);
    // A later gesture is never captured, even during the story.
    expect(await touch(page, '.hp-stage')).toBe(false);
    await page.evaluate(() => scrollBy({ top: 160, behavior: 'instant' }));
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(alignedY + 150);
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    expect(await touch(page)).toBe(false);
    if (width === 390) {
      await expect(page.locator('.hp-slot-name')).toHaveCSS('opacity', '1', { timeout: 10000 });
      await page.locator('.hp-replay').click();
      await expect(page.locator('.hp-slot-name')).toHaveCSS('opacity', '0');
    }
    await context.close();
    console.log(`PASS WebKit ${width}×${height}${german ? ' German' : ''}: input, visible idle preview, alignment, free scrolling`);
  }

  const { context, page } = await open(safari);
  expect(await touch(page, '.mx-hero input[type=email]')).toBe(false);
  expect(await touch(page, '.mx-hero-copy', { dx: 80, dy: 15 })).toBe(false);
  expect(await touch(page, '.mx-hero-copy', { count: 2 })).toBe(false);
  await page.getByRole('button', { name: 'Open menu' }).click();
  expect(await touch(page)).toBe(false);
  await page.getByRole('button', { name: 'Close menu' }).click();
  expect(await touch(page)).toBe(true);
  await assertAligned(page);
  await context.close();
  console.log('PASS controls, horizontal gestures, pinch and open menu remain native');

  for (const options of [{ javaScriptEnabled: false }, { reducedMotion: 'reduce' }]) {
    const { context, page } = await open(safari, options);
    await expect(page.locator('.hp-phone')).toHaveCSS('opacity', '1');
    expect(await touch(page)).toBe(false);
    expect(await page.evaluate(() => scrollY)).toBe(0);
    await context.close();
  }
  console.log('PASS static preview and reduced motion');
} finally {
  await safari.close();
}

const chrome = await chromium.launch({ channel: 'chrome' });
try {
  const { context, page } = await open(chrome);
  const client = await context.newCDPSession(page);
  const swipe = async (startY, endY) => {
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 180, y: startY }] });
    for (let step = 1; step <= 8; step++) {
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 180, y: startY + (endY - startY) * step / 8 }] });
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  await swipe(320, 220);
  await assertAligned(page);
  const alignedY = await page.evaluate(() => scrollY);
  await swipe(520, 250);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(alignedY + 50);
  await context.close();
  console.log('PASS Chromium native touch: first swipe aligns, second scrolls freely');

  const desktop = await open(chrome, { viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false });
  await expect(desktop.page.locator('.hp-receipt')).toHaveCSS('opacity', '0');
  const phone = await desktop.page.locator('.hp-phone').boundingBox();
  expect(phone.y).toBeGreaterThan(72);
  expect(phone.y + phone.height).toBeLessThan(900);
  await desktop.page.mouse.wheel(0, 450);
  await expect.poll(() => desktop.page.locator('.hp-receipt').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0);
  await desktop.page.screenshot({ path: `${output}/desktop.png` });
  await desktop.context.close();
  console.log('PASS desktop preview and scroll-driven story');
} finally {
  await chrome.close();
}
expect(errors).toEqual([]);
console.log('PASS no browser runtime errors');
