import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const out = 'qa/shared-stage';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { screens: [], errors: [], checks: [] };
try {
  for (const [width, height] of [
    [1440, 900],
    [1280, 800],
    [1001, 900],
    [842, 837],
    [390, 844],
    [360, 800],
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
    await p.evaluate(() => {
      window.__bounds = () => {
        const { scene, camera } = window.__scene;
        const logo = scene.getObjectByName('brand-orbit');
        const Vector = logo.position.constructor;
        scene.updateMatrixWorld(true);
        const canvas = document.querySelector('.scene-canvas').getBoundingClientRect();
        function bounds(g, points) {
          const ps = points.map((v) =>
            new Vector(...v).applyMatrix4(g.matrixWorld).project(camera),
          );
          return {
            left: canvas.left + ((Math.min(...ps.map((v) => v.x)) + 1) * canvas.width) / 2,
            right: canvas.left + ((Math.max(...ps.map((v) => v.x)) + 1) * canvas.width) / 2,
            top: canvas.top + ((1 - Math.max(...ps.map((v) => v.y))) * canvas.height) / 2,
            bottom: canvas.top + ((1 - Math.min(...ps.map((v) => v.y))) * canvas.height) / 2,
          };
        }
        const vertices = [];
        logo.children.forEach((m) => {
          const a = m.geometry.attributes.position;
          for (let i = 0; i < a.count; i++) vertices.push([a.getX(i), a.getY(i), a.getZ(i)]);
        });
        const orbit = bounds(logo, vertices);
        const cards = Array.from({ length: 5 }, (_, i) =>
          bounds(
            scene.getObjectByName(`product-card-${i}`),
            [-1.18, 1.18].flatMap((x) => [-1.645, 1.645].map((y) => [x, y, 0.03])),
          ),
        );
        const chapter = Number(document.querySelector('.showcase').dataset.chapter);
        const copy = document
          .querySelector(`.chapter-${chapter} .chapter-copy`)
          .getBoundingClientRect()
          .toJSON();
        const clearance = Math.min(
          ...cards.map((c) =>
            Math.max(
              orbit.left - c.right,
              c.left - orbit.right,
              orbit.top - c.bottom,
              c.top - orbit.bottom,
            ),
          ),
        );
        return {
          orbit,
          cards,
          clearance,
          chapter,
          copy,
          progress: window.__controller.current.progress,
        };
      };
      window.__depth = { frames: 0, minGap: Infinity, violations: 0 };
      window.__sample = true;
      function tick() {
        if (!window.__sample) return;
        const scene = window.__scene.scene;
        scene.updateMatrixWorld(true);
        const boxes = Array.from({ length: 5 }, (_, i) => {
          const m = scene.getObjectByName(`product-card-${i}`).matrixWorld.elements;
          const half =
            (Math.abs(m[2]) * 2.355) / 2 +
            (Math.abs(m[6]) * 3.29) / 2 +
            (Math.abs(m[10]) * 0.06) / 2;
          return { min: m[14] - half, max: m[14] + half };
        });
        const order = [0, 4, 1, 3, 2];
        for (let i = 1; i < 5; i++) {
          const gap = boxes[order[i]].min - boxes[order[i - 1]].max;
          window.__depth.minGap = Math.min(window.__depth.minGap, gap);
          if (gap < 0.1199) window.__depth.violations++;
        }
        window.__depth.frames++;
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
    const entry = {
      width,
      height,
      chapters: [],
      initial: await p.evaluate(() => window.__bounds()),
    };
    report.screens.push(entry);
    entry.scrollSpan = await p.locator('.showcase').evaluate((el) => el.offsetHeight - innerHeight);
    for (let chapter = 1; chapter <= 3; chapter++) {
      if (width < 760)
        await p.evaluate(
          (hash) => {
            location.hash = hash;
          },
          ['#reise', '#ankommen', '#ueberblick'][chapter - 1],
        );
      else await p.locator('.story-stations a').nth(chapter).click();
      await p.waitForTimeout(1700);
      const state = await p.evaluate(() => window.__bounds());
      entry.chapters.push(state);
      await p.screenshot({ path: `${out}/${width}-chapter-${chapter}.png` });
      expect(state.chapter, 'native anchor selects matching chapter').toBe(chapter);
    }
    for (const f of [0.8, 0.6, 0.4, 0.2, 0, 0.25, 0.55, 0.2, 0.8, 1]) {
      await p.evaluate(
        (y) => window.scrollTo({ top: y, behavior: 'instant' }),
        entry.scrollSpan * f,
      );
      await p.waitForTimeout(140);
    }
    await p.waitForTimeout(700);
    entry.depth = await p.evaluate(() => {
      window.__sample = false;
      return window.__depth;
    });
    expect(entry.depth.violations).toBe(0);
    entry.overflow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(entry.overflow).toBe(false);
    if (width === 1440) {
      await p.setViewportSize({ width: 390, height: 844 });
      await p.waitForTimeout(700);
      await p.evaluate(() => {
        location.hash = '#ankommen';
      });
      await p.waitForTimeout(1600);
      entry.resizedChapter = await p.locator('.showcase').getAttribute('data-chapter');
      expect(entry.resizedChapter).toBe('2');
    }
    console.log(
      JSON.stringify({
        width,
        span: entry.scrollSpan,
        clearance: entry.chapters.map((c) => c.clearance),
        depth: entry.depth,
      }),
    );
    await ctx.close();
  }
  const fallback = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  await fallback.goto('http://127.0.0.1:3101/');
  await expect(fallback.locator('.showcase')).toHaveClass(/is-static/);
  await expect(fallback.locator('.scene-canvas')).toHaveCount(0);
  report.checks.push('Reduced motion: four static chapters, no WebGL canvas');
  await expect(fallback.locator('.story-chapter')).toHaveCount(4);
  expect(report.errors).toEqual([]);
} finally {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
