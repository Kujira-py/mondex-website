import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const openingOnly = process.env.OPENING_ONLY === '1';
const origin = process.env.REVIEW_ORIGIN || 'http://127.0.0.1:3101';
const out = openingOnly ? 'qa/opening-float' : 'qa/orbit-loop';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = [];
try {
  for (const [width, height] of [
    [1440, 900],
    [842, 837],
    [390, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const record = { width, height, errors: [], chapters: [] };
    report.push(record);
    page.on('pageerror', (e) => record.errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') record.errors.push(m.text());
    });
    await page.addInitScript(() => {
      window.__roots = [];
      window.__draws = 0;
      for (const key of ['drawElements', 'drawArrays']) {
        const draw = WebGL2RenderingContext.prototype[key];
        WebGL2RenderingContext.prototype[key] = function (...args) {
          window.__draws++;
          return draw.apply(this, args);
        };
      }
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        supportsFiber: true,
        renderers: new Map(),
        inject(r) {
          const n = this.renderers.size + 1;
          this.renderers.set(n, r);
          return n;
        },
        onCommitFiberRoot(i, r) {
          if (!window.__roots.includes(r)) window.__roots.push(r);
        },
        onCommitFiberUnmount() {},
      };
    });
    await page.goto(origin);
    await page.waitForSelector('.scene-ready');
    await page.waitForTimeout(800);
    await page.evaluate(() => {
      const seen = new Set();
      function walk(f) {
        if (!f || seen.has(f)) return;
        seen.add(f);
        const s = f.memoizedProps?.value?.getState?.();
        if (s?.scene?.getObjectByName('brand-orbit') && s.camera) window.__scene = s;
        walk(f.child);
        walk(f.sibling);
      }
      window.__roots.forEach((r) => walk(r.current));
      window.__snapshot = () => {
        const { scene, camera } = window.__scene;
        const logo = scene.getObjectByName('brand-orbit');
        scene.updateMatrixWorld(true);
        const canvas = document.querySelector('.scene-canvas').getBoundingClientRect();
        const Vector = logo.position.constructor;
        function bounds(g, points) {
          const ps = points.map((v) =>
            new Vector(...v).applyMatrix4(g.matrixWorld).project(camera),
          );
          return {
            left: canvas.left + ((Math.min(...ps.map((p) => p.x)) + 1) * canvas.width) / 2,
            right: canvas.left + ((Math.max(...ps.map((p) => p.x)) + 1) * canvas.width) / 2,
            top: canvas.top + ((1 - Math.max(...ps.map((p) => p.y))) * canvas.height) / 2,
            bottom: canvas.top + ((1 - Math.min(...ps.map((p) => p.y))) * canvas.height) / 2,
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
        const models = Array.from({ length: 5 }, (_, i) =>
          scene.getObjectByName(`product-card-${i}`),
        );
        const depth = models.map((card) => {
          const m = card.matrixWorld.elements;
          const half =
            (Math.abs(m[2]) * 2.355) / 2 +
            (Math.abs(m[6]) * 3.29) / 2 +
            (Math.abs(m[10]) * 0.06) / 2;
          return { min: m[14] - half, max: m[14] + half };
        });
        const order = [0, 4, 1, 3, 2];
        return {
          orbit,
          cardY: models.map((card) => card.position.y),
          cardTop: Math.min(...cards.map((card) => card.top)),
          copyBottom: document.querySelector('.chapter-0 .chapter-copy').getBoundingClientRect()
            .bottom,
          depthGap: Math.min(...order.slice(1).map((id, i) => depth[id].min - depth[order[i]].max)),
          rotation: logo.rotation.toArray().slice(0, 3),
          y: logo.position.y,
          clearance: Math.min(
            ...cards.map((c) =>
              Math.max(
                orbit.left - c.right,
                c.left - orbit.right,
                orbit.top - c.bottom,
                c.top - orbit.bottom,
              ),
            ),
          ),
          draws: window.__draws,
        };
      };
    });
    const opening = [];
    for (let n = 0; n < 25; n++) {
      opening.push(await page.evaluate(() => window.__snapshot()));
      if (n === 0 || n === 12 || n === 24)
        await page.screenshot({ path: `${out}/${width}-opening-${n}.png` });
      await page.waitForTimeout(500);
    }
    const range = (values) => Math.max(...values) - Math.min(...values);
    record.openingFloat = {
      logoPixels: range(opening.map((s) => s.orbit.top)),
      cardPixels: range(opening.map((s) => s.cardTop)),
      minimumDepthGap: Math.min(...opening.map((s) => s.depthGap)),
      textGap: Math.min(...opening.map((s) => s.cardTop - s.copyBottom)),
    };
    expect(record.openingFloat.logoPixels).toBeGreaterThan(2);
    expect(record.openingFloat.logoPixels).toBeLessThan(25);
    expect(record.openingFloat.cardPixels).toBeGreaterThan(2);
    expect(record.openingFloat.cardPixels).toBeLessThan(20);
    expect(record.openingFloat.minimumDepthGap).toBeGreaterThanOrEqual(0.1199);
    expect(record.openingFloat.textGap).toBeGreaterThan(10);
    // The fan follows the same vertical rhythm as the logo, rather than unrelated bobbing.
    const logo = opening.map((s) => s.y),
      card = opening.map((s) => s.cardY[2]);
    const mean = (list) => list.reduce((a, b) => a + b, 0) / list.length;
    const a = logo.map((v) => v - mean(logo)),
      b = card.map((v) => v - mean(card));
    const correlation =
      a.reduce((sum, v, i) => sum + v * b[i], 0) /
      Math.sqrt(a.reduce((sum, v) => sum + v * v, 0) * b.reduce((sum, v) => sum + v * v, 0));
    expect(correlation).toBeGreaterThan(0.98);
    record.openingFloat.correlation = correlation;
    for (const [i, target] of (openingOnly
      ? []
      : ['#reise', '#ankommen', '#ueberblick']
    ).entries()) {
      await page.evaluate((hash) => {
        location.hash = hash;
      }, target);
      await page.waitForTimeout(1400);
      const samples = [];
      // Full 12-second cycle in every settled chapter, including its wrap.
      for (let n = 0; n < 27; n++) {
        samples.push(await page.evaluate(() => window.__snapshot()));
        if (n === 0 || n === 12 || n === 26)
          await page.screenshot({ path: `${out}/${width}-chapter-${i + 1}-${n}.png` });
        await page.waitForTimeout(500);
      }
      const angles = samples.map((s) => s.rotation[1]);
      const entry = {
        chapter: i + 1,
        samples,
        minClearance: Math.min(...samples.map((s) => s.clearance)),
        yawRange: Math.max(...angles) - Math.min(...angles),
      };
      record.chapters.push(entry);
      expect(entry.yawRange, 'clearly measurable 3D motion while no scroll input').toBeGreaterThan(
        0.4,
      );
      expect(entry.minClearance, 'logo stays clear of all cards').toBeGreaterThan(0);
      expect(Math.min(...samples.map((s) => s.orbit.left))).toBeGreaterThan(0);
      expect(Math.max(...samples.map((s) => s.orbit.right))).toBeLessThan(width);
    }
    await page.locator('.motion-control button').click();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(150);
    const paused = await page.evaluate(() => window.__snapshot());
    await page.waitForTimeout(600);
    expect(await page.evaluate(() => window.__snapshot())).toEqual(paused);
    record.pauseFreezes = true;
    await page.locator('.motion-control button').click();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(700);
    expect((await page.evaluate(() => window.__snapshot())).draws).toBeGreaterThan(paused.draws);
    record.resumes = true;
    await page
      .locator('#portfolio')
      .evaluate((el) => window.scrollTo({ top: el.offsetTop - 300, behavior: 'instant' }));
    await page.waitForTimeout(600);
    const off = await page.evaluate(() => window.__draws);
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => window.__draws)).toBe(off);
    record.offscreenStops = true;
    record.gap = await page.evaluate(
      () =>
        document.querySelector('.portfolio-heading').getBoundingClientRect().top -
        document.querySelector('.set-window').getBoundingClientRect().bottom,
    );
    expect(record.gap).toBeLessThan(width < 760 ? 85 : 120);
    await page.screenshot({ path: `${out}/${width}-portfolio-gap.png` });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    expect(record.errors).toEqual([]);
    console.log(
      JSON.stringify({
        width,
        opening: record.openingFloat,
        gap: record.gap,
        clearance: record.chapters.map((c) => c.minClearance),
        yawRange: record.chapters.map((c) => c.yawRange),
        pause: record.pauseFreezes,
        offscreen: record.offscreenStops,
        errors: record.errors,
      }),
    );
    await page.close();
  }
  const reduced = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  await reduced.goto(origin);
  await expect(reduced.locator('.showcase')).toHaveClass(/is-static/);
  await expect(reduced.locator('.scene-canvas')).toHaveCount(0);
  report.push({ reducedMotionStatic: true });
} finally {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
