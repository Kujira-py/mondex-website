import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const out = process.env.QA_CONFIRM ? 'qa/twelve-confirm' : 'qa/twelve';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { viewports: [], errors: [] };
try {
  for (const [width, height] of [
    [1440, 900],
    [842, 837],
    [390, 844],
    [1280, 720],
  ]) {
    const ctx = await browser.newContext({
      viewport: { width, height },
      isMobile: width < 500,
      hasTouch: width < 500,
    });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => report.errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') report.errors.push(m.text());
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
    await page.goto('http://127.0.0.1:3101');
    await page.waitForSelector('.scene-ready');
    await page.waitForTimeout(500);
    const item = { width, height, chapters: [] };
    report.viewports.push(item);
    const scenes = () => {
      const seen = new Set(),
        found = [];
      function walk(f) {
        if (!f || seen.has(f)) return;
        seen.add(f);
        const v = f.memoizedProps?.value;
        if (v?.getState) {
          const s = v.getState();
          if (s?.scene && s.camera && !found.includes(s)) found.push(s);
        }
        walk(f.child);
        walk(f.sibling);
      }
      for (const r of window.__qaRoots) walk(r.current);
      return found;
    };
    await page.evaluate(`window.__getScenes = ${scenes.toString()}`);
    const scroll = async (sel, offset = 130) => {
      await page
        .locator(sel)
        .evaluate(
          (el, off) =>
            window.scrollTo({
              top: el.getBoundingClientRect().top + scrollY - off,
              behavior: 'instant',
            }),
          offset,
        );
      await page.waitForTimeout(1000);
    };
    for (const chapter of [0, 1, 2, 3]) {
      if (chapter) {
        if (width < 500)
          await scroll(['#produkt', '#reise', '#ankommen', '#ueberblick'][chapter], 0);
        else await page.locator('.story-stations a').nth(chapter).click();
        await page.waitForTimeout(1400);
      }
      await page.screenshot({ path: `${out}/${width}-hero-${chapter}.png` });
      item.chapters.push(
        await page.evaluate((ch) => {
          const s = window.__getScenes().find((s) => s.scene.getObjectByName('product-card-0'));
          const canvas = document.querySelector('.scene-canvas').getBoundingClientRect();
          const cta = document
            .querySelector(`.chapter-${ch} .chapter-copy a`)
            .getBoundingClientRect();
          const cards = Array.from({ length: 5 }, (_, i) => {
            const g = s.scene.getObjectByName(`product-card-${i}`),
              Vector = g.position.constructor;
            g.updateWorldMatrix(true, true);
            const pts = [];
            for (const x of [-1.175, 1.175])
              for (const y of [-1.6425, 1.6425]) {
                const p = new Vector(x, y, 0.027).applyMatrix4(g.matrixWorld).project(s.camera);
                pts.push({
                  x: canvas.x + ((p.x + 1) * canvas.width) / 2,
                  y: canvas.y + ((1 - p.y) * canvas.height) / 2,
                });
              }
            return {
              left: Math.min(...pts.map((p) => p.x)),
              right: Math.max(...pts.map((p) => p.x)),
              top: Math.min(...pts.map((p) => p.y)),
              bottom: Math.max(...pts.map((p) => p.y)),
            };
          });
          return {
            chapter: ch,
            cta: { left: cta.left, right: cta.right, bottom: cta.bottom },
            gap: Math.min(
              ...cards
                .filter((c) => c.left < cta.right && c.right > cta.left)
                .map((c) => c.top - cta.bottom),
            ),
            cards,
          };
        }, chapter),
      );
    }
    for (const c of item.chapters) {
      if (Number.isFinite(c.gap))
        expect(c.gap, `chapter ${c.chapter} spacing at ${width}`).toBeGreaterThan(28);
    }
    await scroll('.features-section', height / 2);
    await page.screenshot({ path: `${out}/${width}-hero-fade.png` });
    await scroll('.phone-viewfinder', 200);
    await page.waitForTimeout(2200);
    await page.screenshot({ path: `${out}/${width}-phone-scan.png` });
    if (width === 1440 && !process.env.QA_CONFIRM) {
      item.scan = await page.evaluate(async () => {
        const beam = document.querySelector('.phone-scan-beam'),
          frame = beam.parentElement,
          begin = performance.now(),
          samples = [];
        return await new Promise((resolve) => {
          function tick() {
            const s = getComputedStyle(beam);
            samples.push({
              t: performance.now() - begin,
              top: parseFloat(s.top) / frame.clientHeight,
              alpha: +s.opacity,
            });
            if (performance.now() - begin < 33500) requestAnimationFrame(tick);
            else resolve(samples);
          }
          tick();
        });
      });
      const jumps = item.scan.filter(
        (s, i, a) => i && s.top < a[i - 1].top - 0.1 && s.alpha > 0.02,
      );
      item.scanVisibleJumps = jumps;
      expect(jumps).toHaveLength(0);
    }
    await scroll('.feature-binder', 125);
    if (width === 1440 && !process.env.QA_CONFIRM) {
      item.binder = [];
      for (let k = 0; k < 12; k++) {
        await page.waitForTimeout(3000);
        await page.screenshot({ path: `${out}/binder-${k}.png` });
        item.binder.push(
          await page.evaluate(() => {
            const s = window.__getScenes().find((s) => s.scene.getObjectByName('binder-book'));
            return s?.scene
              .getObjectByName('binder-book')
              .children.filter((g) => g.name.startsWith('binder-leaf'))
              .map((g) => {
                const pos = g.children[0].geometry.attributes.position;
                return { name: g.name, tip: [pos.getX(48), pos.getZ(48)] };
              });
          }),
        );
      }
    } else {
      await page.waitForTimeout(7000);
      await page.screenshot({ path: `${out}/${width}-binder.png` });
    }
    await scroll('.scan-art', 160);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${out}/${width}-large-scan.png` });
    await scroll('.collection-tabs');
    item.tabs = [];
    for (const mode of [1, 2, 3, 0]) {
      for (const k of [2, 1, 3, 2, 0, mode]) {
        await page.locator(`#collection-tab-${k}`).click({ force: true });
        await page.waitForTimeout(65);
      }
      await page.waitForTimeout(1600);
      const first = await page
        .locator('.collection-card-layout')
        .evaluateAll((es) => es.map((e) => e.style.transform));
      await page.waitForTimeout(500);
      const last = await page
        .locator('.collection-card-layout')
        .evaluateAll((es) => es.map((e) => e.style.transform));
      expect(last).toEqual(first);
      item.tabs.push({ mode, stable: true, transforms: last });
      await page.screenshot({ path: `${out}/${width}-tabs-${mode}.png` });
    }
    await page.locator('#collection-tab-2').click();
    await page.waitForTimeout(850);
    await page.locator('.binder-add').click();
    await page.waitForTimeout(120);
    await page.locator('#collection-tab-0').click();
    await page.waitForTimeout(1300);
    expect(await page.locator('.collection-stage').getAttribute('data-complete')).toBe('false');
    item.interruptedInsertion = true;
    await scroll('.portfolio-section', height / 2);
    await page.screenshot({ path: `${out}/${width}-portfolio-fade.png` });
    await scroll('.portfolio-chart', 220);
    await page.locator('.portfolio-chart').press('Home');
    expect(await page.locator('.portfolio-total').innerText()).toBe('$345');
    await page.locator('.portfolio-chart').press('End');
    expect(await page.locator('.portfolio-total').innerText()).toBe('$450');
    expect(await page.locator('.portfolio-holdings a').count()).toBe(0);
    expect(await page.locator('.discovery-hint').count()).toBe(0);
    item.cleanCopy = true;
    await page.locator('button[aria-label="Deutsch"]').click();
    await page.screenshot({ path: `${out}/${width}-german.png` });
    await ctx.close();
    console.log(
      JSON.stringify({
        width,
        chapters: item.chapters.map((c) => ({ chapter: c.chapter, gap: c.gap })),
        tabs: item.tabs.length,
        errors: report.errors,
      }),
    );
  }
} finally {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
