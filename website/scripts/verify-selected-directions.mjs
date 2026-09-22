import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const out = 'qa/selected-directions';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { screens: [], errors: [], checks: [] };
try {
  for (const [width, height] of [
    [1440, 900],
    [842, 837],
    [390, 844],
  ]) {
    const ctx = await browser.newContext({
      viewport: { width, height },
      isMobile: width < 500,
      hasTouch: width < 500,
    });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => report.errors.push(e.message));
    p.on('console', (m) => {
      if (m.type() === 'error') report.errors.push(m.text());
    });
    await p.addInitScript(() => {
      window.__roots = [];
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        supportsFiber: true,
        renderers: new Map(),
        inject(r) {
          const id = this.renderers.size + 1;
          this.renderers.set(id, r);
          return id;
        },
        onCommitFiberRoot(id, root) {
          if (!window.__roots.includes(root)) window.__roots.push(root);
        },
        onCommitFiberUnmount() {},
      };
    });
    let release;
    const gate = new Promise((r) => (release = r));
    await p.route('**/*.js', async (r) => {
      await gate;
      await r.continue();
    });
    await p.goto('http://127.0.0.1:3101/', { waitUntil: 'commit' });
    await p.waitForSelector('h1');
    await p.evaluate(() => document.fonts.ready);
    const before = await p.locator('h1').boundingBox();
    expect(await p.evaluate(() => document.fonts.check('550 64px Onest'))).toBe(true);
    await p.screenshot({ path: `${out}/${width}-cold.png` });
    release();
    await p.waitForSelector('.scene-ready');
    await p.waitForTimeout(700);
    const after = await p.locator('h1').boundingBox();
    expect(
      Math.max(...Object.keys(before).map((k) => Math.abs(after[k] - before[k]))),
    ).toBeLessThan(1);
    await p.screenshot({ path: `${out}/${width}-ready.png` });
    report.checks.push(`${width}: cold headline has identical font and geometry`);
    await p.evaluate(() => {
      const seen = new Set();
      function walk(f) {
        if (!f || seen.has(f)) return;
        seen.add(f);
        const s = f.memoizedProps?.value?.getState?.();
        if (s?.scene?.getObjectByName('brand-orbit') && s?.camera) window.__scene = s;
        const c = f.memoizedProps?.controller;
        if (c?.current?.invalidate) window.__controller = c;
        walk(f.child);
        walk(f.sibling);
      }
      for (const r of window.__roots) walk(r.current);
    });
    for (const progress of [0.5, 1.59, 2.5]) {
      await p.evaluate((progress) => {
        window.__controller.current.progress = progress;
        window.__controller.current.invalidate();
      }, progress);
      await p.waitForTimeout(1300);
      await p.screenshot({ path: `${out}/${width}-reveal-${progress}.png` });
      const clearance = await p.evaluate(() => {
        const { scene, camera } = window.__scene;
        const logo = scene.getObjectByName('brand-orbit');
        const Vector = logo.position.constructor;
        scene.updateMatrixWorld(true);
        function bounds(g, points) {
          const projected = points.map(([x, y, z]) =>
            new Vector(x, y, z).applyMatrix4(g.matrixWorld).project(camera),
          );
          return {
            left: Math.min(...projected.map((v) => v.x)),
            right: Math.max(...projected.map((v) => v.x)),
            top: Math.max(...projected.map((v) => v.y)),
            bottom: Math.min(...projected.map((v) => v.y)),
          };
        }
        const vertices = [];
        logo.children.forEach((mesh) => {
          const a = mesh.geometry.attributes.position;
          for (let i = 0; i < a.count; i++) vertices.push([a.getX(i), a.getY(i), a.getZ(i)]);
        });
        const lb = bounds(logo, vertices);
        return Array.from({ length: 5 }, (_, i) => {
          const g = scene.getObjectByName(`product-card-${i}`);
          const cb = bounds(
            g,
            [-1.18, 1.18].flatMap((x) => [-1.645, 1.645].map((y) => [x, y, 0.03])),
          );
          return Math.max(
            lb.left - cb.right,
            cb.left - lb.right,
            lb.bottom - cb.top,
            cb.bottom - lb.top,
          );
        });
      });
      expect(
        Math.min(...clearance),
        'all cards clear the complete icon at the reveal',
      ).toBeGreaterThan(0);
    }
    await p.locator('.feature-offline').scrollIntoViewIfNeeded();
    await p.waitForTimeout(5600);
    await p.screenshot({ path: `${out}/${width}-windows.png` });
    await expect(p.locator('.pocket-collection')).toHaveAttribute('data-running', 'true');
    await expect(p.locator('.offline-collection')).toHaveAttribute('data-running', 'true');
    if (width === 1440) {
      const states = [];
      for (let n = 0; n < 6; n++) {
        states.push(
          await p
            .locator('.pocket-theme')
            .evaluateAll((a) =>
              a.map((el) => ({
                opacity: getComputedStyle(el).opacity,
                incoming: [...el.querySelectorAll('.pocket-incoming')].map((c) => ({
                  opacity: getComputedStyle(c).opacity,
                  transform: getComputedStyle(c).transform,
                })),
              })),
            ),
        );
        await p.waitForTimeout(4100);
      }
      report.pocketCycle = states;
      expect(states.some((s) => Number(s[0].opacity) > 0.9)).toBe(true);
      expect(states.some((s) => Number(s[1].opacity) > 0.9)).toBe(true);
      await p.locator('.feature-motion-toggle').click();
      await expect(p.locator('.pocket-collection')).toHaveAttribute('data-running', 'false');
      const paused = await p
        .locator('.pocket-theme')
        .evaluateAll((a) => a.map((x) => x.getAttribute('style')));
      await p.waitForTimeout(400);
      expect(
        await p.locator('.pocket-theme').evaluateAll((a) => a.map((x) => x.getAttribute('style'))),
      ).toEqual(paused);
      await p.locator('.feature-motion-toggle').click();
      await p.screenshot({ path: `${out}/${width}-windows-cycle.png` });
    }
    await p.locator('.living-dex').scrollIntoViewIfNeeded();
    await expect(p.locator('.living-grid button')).toHaveCount(24);
    const dexViolations = await new AxeBuilder({ page: p }).include('.living-dex').analyze();
    report.dexAccessibility = dexViolations.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.length,
    }));
    expect(dexViolations.violations).toHaveLength(0);
    for (const index of [5, 17, 23]) {
      await p.locator('.living-grid button').nth(index).click();
      await expect(p.locator('.living-grid button').nth(index)).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(p.locator('.living-portrait')).toBeVisible();
      await expect(p.locator('.living-matching-card')).toBeVisible();
    }
    await p.screenshot({ path: `${out}/${width}-living-dex.png` });
    await p.locator('.living-dex .dex-filter button').nth(2).click();
    await expect(p.locator('.living-grid button')).toHaveCount(8);
    await p.locator('.living-grid button').last().click();
    const layout = await p.evaluate(() => ({
      grid: document.querySelector('.living-grid').getBoundingClientRect().toJSON(),
      detail: document.querySelector('.living-detail').getBoundingClientRect().toJSON(),
    }));
    expect(
      width < 760 ? layout.detail.y >= layout.grid.bottom : layout.detail.x >= layout.grid.right,
    ).toBe(true);
    await p.locator('.living-dex .dex-filter button').nth(1).click();
    await expect(p.locator('.living-grid button')).toHaveCount(16);
    await p.locator('.living-dex .dex-filter button').first().click();
    await p.getByRole('button', { name: 'Deutsch', exact: true }).click();
    await expect(p.locator('.living-grid button').first()).toContainText('Bisasam');
    await p.locator('.living-grid button').first().focus();
    await p.keyboard.press('Enter');
    await expect(p.locator('.living-detail h3')).toHaveText('Bisasam');
    expect(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const missing = await p
      .locator('.living-dex img')
      .evaluateAll((imgs) =>
        imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      );
    expect(missing).toEqual([]);
    await p.screenshot({ path: `${out}/${width}-living-de.png` });
    report.checks.push(
      `${width}: reveal separation, animated windows, 24 Pokémon, ownership filters, matching details, German, no overflow`,
    );
    await ctx.close();
  }
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const p = await context.newPage();
  await p.goto('http://127.0.0.1:3101/');
  await p.locator('.feature-binder').scrollIntoViewIfNeeded();
  await expect(p.locator('.pocket-collection')).toHaveAttribute('data-running', 'false');
  await expect(p.locator('.offline-collection')).toHaveAttribute('data-running', 'false');
  await expect(p.locator('.pocket-theme').first()).toBeVisible();
  await p.screenshot({ path: `out/reduced.png`.replace('out/', `${out}/`) });
  report.checks.push('Reduced motion: stable pocket sheet and offline match');
  expect(report.errors).toEqual([]);
} finally {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
