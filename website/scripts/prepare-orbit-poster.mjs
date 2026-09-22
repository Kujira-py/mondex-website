// Render the initial Orbit material itself. These alpha posters bridge HTML → WebGL.
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const dimensions = {};
try {
  for (const [label, width, height] of [
    ['desktop', 1440, 900],
    ['mobile', 842, 837],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.addInitScript(() => {
      window.__roots = [];
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        supportsFiber: true,
        renderers: new Map(),
        inject(r) {
          const i = this.renderers.size + 1;
          this.renderers.set(i, r);
          return i;
        },
        onCommitFiberRoot(i, r) {
          if (!window.__roots.includes(r)) window.__roots.push(r);
        },
        onCommitFiberUnmount() {},
      };
    });
    await page.goto('http://127.0.0.1:3101/');
    await page.waitForSelector('.scene-ready');
    await page.waitForTimeout(400);
    const data = await page.evaluate(() => {
      let found;
      const seen = new Set();
      function walk(f) {
        if (!f || seen.has(f) || found) return;
        seen.add(f);
        const s = f.memoizedProps?.value?.getState?.();
        if (s?.scene && s?.camera) {
          found = s;
          return;
        }
        walk(f.child);
        walk(f.sibling);
      }
      for (const root of window.__roots) walk(root.current);
      if (!found) throw Error('No scene');
      const { scene, camera, gl } = found;
      for (let i = 0; i < 5; i++) scene.getObjectByName(`product-card-${i}`).visible = false;
      gl.render(scene, camera);
      return gl.domElement.toDataURL('image/png');
    });
    const input = Buffer.from(data.split(',')[1], 'base64');
    const { data: pixels, info } = await sharp(input)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    let left = info.width,
      top = info.height,
      right = 0,
      bottom = 0;
    for (let y = 0; y < info.height; y++)
      for (let x = 0; x < info.width; x++)
        if (pixels[(y * info.width + x) * 4 + 3] > 1) {
          left = Math.min(left, x);
          top = Math.min(top, y);
          right = Math.max(right, x);
          bottom = Math.max(bottom, y);
        }
    const box = {
      left: Math.max(0, left - 2),
      top: Math.max(0, top - 2),
      width: right - left + 5,
      height: bottom - top + 5,
    };
    await sharp(input)
      .extract(box)
      .webp({ lossless: true })
      .toFile(`public/assets/orbit-first-${label}.webp`);
    dimensions[label] = {
      left: (100 * (box.left - info.width / 2)) / info.height,
      top: (100 * box.top) / info.height,
      width: (100 * box.width) / info.height,
      height: (100 * box.height) / info.height,
    };
    await page.close();
  }
  await writeFile('src/lib/orbit-poster.json', JSON.stringify(dimensions, null, 2) + '\n');
  console.log(dimensions);
} finally {
  await browser.close();
}
