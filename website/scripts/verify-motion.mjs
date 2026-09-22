import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const out = 'qa/motion-final';
await mkdir(out, { recursive: true });
const report = { viewports: [], errors: [], warnings: [] };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [width, height] of [
    [1440, 900],
    [1280, 800],
    [768, 1024],
    [390, 844],
    [360, 800],
  ]) {
    const ctx = await browser.newContext({
      viewport: { width, height },
      isMobile: width < 500,
      hasTouch: width < 500,
    });
    const page = await ctx.newPage();
    page.setDefaultTimeout(15000);
    page.on('pageerror', (e) => report.errors.push({ width, message: e.message }));
    page.on('console', (m) => {
      if (m.type() === 'error') report.errors.push({ width, message: m.text() });
      if (m.type() === 'warning') report.warnings.push(m.text());
    });
    await page.addInitScript(() => {
      window.__qaRoots = [];
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        supportsFiber: true,
        renderers: new Map(),
        inject(r) {
          const id = this.renderers.size + 1;
          this.renderers.set(id, r);
          return id;
        },
        onCommitFiberRoot(id, root) {
          if (!window.__qaRoots.includes(root)) window.__qaRoots.push(root);
        },
        onCommitFiberUnmount() {},
      };
    });
    let release;
    const gate = new Promise((r) => (release = r));
    await page.route('**/*.js', async (route) => {
      await gate;
      await route.continue();
    });
    await page.goto('http://127.0.0.1:3101', { waitUntil: 'commit' });
    await page.waitForSelector('.poster-2', { state: 'attached' });
    await page.waitForTimeout(600);
    const poster = await page.locator('.poster-card').evaluateAll((nodes) =>
      nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      }),
    );
    await page.screenshot({ path: `${out}/${width}-01-cold-poster.png` });
    release();
    await page.waitForSelector('.scene-ready');
    await page.waitForTimeout(650);
    await page.screenshot({ path: `${out}/${width}-02-ready.png` });
    const init = await page.evaluate(() => {
      const seen = new Set();
      let found;
      const walk = (f) => {
        if (!f || seen.has(f) || found) return;
        seen.add(f);
        const v = f.memoizedProps?.value;
        if (v?.getState) {
          const s = v.getState();
          if (s?.scene && s?.camera) {
            found = s;
            return;
          }
        }
        walk(f.child);
        walk(f.sibling);
      };
      for (const r of window.__qaRoots) walk(r.current);
      if (!found) return { roots: window.__qaRoots.length, found: false };
      window.__scene = found;
      return { found: true };
    });
    const record = { width, height, poster, scene: init, checks: [] };
    report.viewports.push(record);
    if (!init.found) throw Error('Could not inspect actual R3F scene');
    if (init.found) {
      record.projected = await page.evaluate(() => {
        const { scene, camera } = window.__scene;
        const canvas = document.querySelector('.scene-canvas').getBoundingClientRect();
        return Array.from({ length: 5 }, (_, i) => {
          const g = scene.getObjectByName(`product-card-${i}`);
          g.updateWorldMatrix(true, true);
          const pts = [];
          const Vector = g.position.constructor;
          for (const x of [-1.175, 1.175])
            for (const y of [-1.6425, 1.6425]) {
              const p = new Vector(x, y, 0.027).applyMatrix4(g.matrixWorld).project(camera);
              pts.push({
                x: canvas.x + ((p.x + 1) * canvas.width) / 2,
                y: canvas.y + ((1 - p.y) * canvas.height) / 2,
              });
            }
          const xs = pts.map((p) => p.x),
            ys = pts.map((p) => p.y);
          return {
            x: Math.min(...xs),
            y: Math.min(...ys),
            width: Math.max(...xs) - Math.min(...xs),
            height: Math.max(...ys) - Math.min(...ys),
          };
        });
      });
      record.posterError = Math.max(
        ...record.projected.map((p, i) =>
          Math.max(...Object.keys(p).map((k) => Math.abs(p[k] - poster[i][k]))),
        ),
      );
      if (record.posterError > 1) throw Error('Loading poster mismatch');
      // Actual rendered volumes are sampled on every animation frame during input and scroll.
      await page.evaluate(() => {
        window.__depth = { frames: 0, minGap: Infinity, violations: 0 };
        window.__sample = true;
        function tick() {
          if (!window.__sample) return;
          const s = window.__scene?.scene;
          const cs = Array.from({ length: 5 }, (_, i) => s?.getObjectByName(`product-card-${i}`));
          if (cs.every(Boolean)) {
            const bounds = cs.map((g) => {
              g.updateWorldMatrix(true, false);
              const m = g.matrixWorld.elements;
              const half =
                (Math.abs(m[2]) * 2.355) / 2 +
                (Math.abs(m[6]) * 3.29) / 2 +
                (Math.abs(m[10]) * 0.06) / 2;
              return { min: m[14] - half, max: m[14] + half };
            });
            const order = [0, 4, 1, 3, 2];
            for (let i = 1; i < 5; i++) {
              const gap = bounds[order[i]].min - bounds[order[i - 1]].max;
              window.__depth.minGap = Math.min(window.__depth.minGap, gap);
              if (gap < 0.1199) window.__depth.violations++;
            }
            window.__depth.frames++;
          }
          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }
    for (const i of [0, 4, 1, 3, 2, 0, 4, 2]) {
      await page.locator('.card-selector button').nth(i).click();
      await page.waitForTimeout(80);
    }
    await page.mouse.move(25, 400);
    await page.waitForTimeout(750);
    await page.screenshot({ path: `${out}/${width}-03-selected.png` });
    const span = await page.locator('.showcase').evaluate((n) => n.offsetHeight - innerHeight);
    for (const progress of [
      ...Array.from({ length: 31 }, (_, i) => i / 30),
      ...Array.from({ length: 31 }, (_, i) => (30 - i) / 30),
      0.37,
    ]) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), span * progress);
      await page.waitForTimeout(progress === 0.37 ? 700 : 100);
    }
    await page.screenshot({ path: `${out}/${width}-04-capture.png` });
    if (init.found) {
      record.depth = await page.evaluate(() => {
        window.__sample = false;
        return window.__depth;
      });
      if (record.depth.violations) throw Error('Card volume intersection');
    }
    const view = async (sel, offset = 125) => {
      await page.locator(sel).evaluate(
        (n, offset) =>
          window.scrollTo({
            top: n.getBoundingClientRect().top + scrollY - offset,
            behavior: 'instant',
          }),
        offset,
      );
    };
    await view('.feature-scan');
    await page.waitForTimeout(1200);
    await expect(page.locator('.phone-scan')).toHaveAttribute('data-running', 'true');
    await view('.feature-binder');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/${width}-binder.png` });
    await page.locator('.feature-motion-toggle').click();
    await expect(page.locator('.feature-motion-toggle')).toHaveAttribute('aria-pressed', 'true');
    record.checks.push('new feature loops separately verified by verify-nine.mjs');
    await expect(page.locator('.feature-flyer')).toHaveCount(0);
    record.axe = (await new AxeBuilder({ page }).include('#features').analyze()).violations.map(
      (v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) }),
    );
    record.overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    await page.getByRole('button', { name: 'Deutsch', exact: true }).click();
    await page.waitForTimeout(200);
    await expect(page.locator('#features-title')).toContainText('Gemacht');
    await page.locator('#features').screenshot({ path: `${out}/${width}-08-feature-de.png` });
    await view('.discovery-window');
    await page.waitForTimeout(350);
    const track = page.locator('.discovery-track');
    if (width >= 760) {
      await page.locator('.discovery-item').nth(2).hover({ force: true });
      const x = await track.evaluate((n) => new DOMMatrix(getComputedStyle(n).transform).m41);
      await page.waitForTimeout(700);
      const nx = await track.evaluate((n) => new DOMMatrix(getComputedStyle(n).transform).m41);
      record.railHoverDistance = nx - x;
      if (Math.abs(nx - x) < 15) throw Error('Rail stopped on hover');
      await page.locator('.discovery-item').nth(2).getByRole('button').click({ force: true });
      await expect(page.locator('#discovery')).toHaveAttribute('data-running', 'true');
      await page.locator('.rail-pause').click();
      await expect(page.locator('#discovery')).toHaveAttribute('data-running', 'false');
      const paused = await track.getAttribute('style');
      await page.waitForTimeout(250);
      await expect(track).toHaveAttribute('style', paused);
      await page.locator('.rail-pause').click();
      await expect(page.locator('#discovery')).toHaveAttribute('data-running', 'true');
      await page.keyboard.press('Tab');
      await expect(page.locator('#discovery')).toHaveAttribute('data-running', 'false');
      record.checks.push(
        'rail moves during hover and mouse click; explicit pause/resume and keyboard stability',
      );
    }
    if (record.axe.length) throw Error('Accessibility defects');
    if (record.overflow) throw Error('Horizontal page overflow');
    record.checks.push(
      'cold poster',
      'rapid selection',
      'forward/reverse full story',
      'feature loop controls',
      'EN/DE',
      'axe',
    );
    await ctx.close();
    console.log(
      'Checked',
      width,
      JSON.stringify({
        posterError: record.posterError,
        depth: record.depth,
        axe: record.axe,
        overflow: record.overflow,
        railHoverDistance: record.railHoverDistance,
      }),
    );
  }
} finally {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
