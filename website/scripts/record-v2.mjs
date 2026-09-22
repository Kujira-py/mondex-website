import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const out = 'qa/redesign-final',
  frameDir = `${out}/frames`;
await mkdir(frameDir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
await context.addInitScript(() => {
  window.__qa = { longTasks: [], shifts: [], lcp: 0 };
  new PerformanceObserver((l) => {
    for (const e of l.getEntries())
      window.__qa.longTasks.push({ start: e.startTime, duration: e.duration });
  }).observe({ type: 'longtask', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (!e.hadRecentInput) window.__qa.shifts.push(e.value);
  }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) window.__qa.lcp = e.startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
});
const page = await context.newPage();
await page.goto('http://127.0.0.1:3101', { waitUntil: 'networkidle' });
await page.waitForSelector('.scene-ready');
await page.waitForTimeout(700);
const cdp = await context.newCDPSession(page);
await cdp.send('Tracing.start', {
  categories: 'devtools.timeline,blink.user_timing,toplevel',
  transferMode: 'ReturnAsStream',
});
const frames = [],
  writes = [];
let index = 0;
cdp.on('Page.screencastFrame', (event) => {
  const filename = `frame-${String(index++).padStart(5, '0')}.jpg`;
  frames.push({ filename, time: event.metadata.timestamp });
  writes.push(writeFile(`${frameDir}/${filename}`, Buffer.from(event.data, 'base64')));
  cdp.send('Page.screencastFrameAck', { sessionId: event.sessionId }).catch(() => {});
});
await cdp.send('Page.startScreencast', {
  format: 'jpeg',
  quality: 88,
  maxWidth: 1440,
  maxHeight: 900,
  everyNthFrame: 1,
});
await page.waitForTimeout(500);
await page.mouse.move(100, 430);
await page.mouse.move(485, 610, { steps: 30 });
await page.waitForTimeout(500);
await page.mouse.move(735, 585, { steps: 25 });
await page.waitForTimeout(600);
await page.mouse.move(865, 620, { steps: 25 });
await page.waitForTimeout(600);
await page.mouse.move(80, 400, { steps: 25 });
await page.waitForTimeout(700);
const motion = await page.evaluate(async () => {
  const range = document.querySelector('.showcase').offsetHeight - innerHeight,
    intervals = [],
    start = performance.now();
  const move = (from, to, duration) =>
    new Promise((resolve) => {
      let began, prior;
      const tick = (now) => {
        if (!began) {
          began = now;
          prior = now;
        } else {
          intervals.push(now - prior);
          prior = now;
        }
        const t = Math.min(1, (now - began) / duration),
          e = t * t * (3 - 2 * t);
        scrollTo({ top: range * (from + (to - from) * e), behavior: 'instant' });
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
  const hold = (ms) => new Promise((r) => setTimeout(r, ms));
  await move(0, 0.34, 2200);
  await hold(1050);
  await move(0.34, 0.61, 2000);
  await hold(1050);
  await move(0.61, 0.89, 2200);
  await hold(1050);
  await move(0.89, 0.34, 1800);
  await hold(600);
  await move(0.34, 0, 1400);
  await hold(800);
  const sorted = intervals.sort((a, b) => a - b);
  return {
    duration: performance.now() - start,
    sampledFrames: sorted.length,
    medianRafInterval: sorted[Math.floor(sorted.length * 0.5)],
    p95RafInterval: sorted[Math.floor(sorted.length * 0.95)],
    intervalsOver34ms: sorted.filter((v) => v > 34).length,
    longTasks: window.__qa.longTasks.filter((t) => t.start >= start),
  };
});
await cdp.send('Page.stopScreencast');
await Promise.all(writes);
const traceDone = new Promise((r) => cdp.once('Tracing.tracingComplete', r));
await cdp.send('Tracing.end');
const trace = await traceDone;
let traceText = '';
while (true) {
  const chunk = await cdp.send('IO.read', { handle: trace.stream });
  traceText += chunk.data;
  if (chunk.eof) break;
}
await cdp.send('IO.close', { handle: trace.stream });
await writeFile(`${out}/motion-trace.json`, traceText);
let concat = '';
for (let i = 0; i < frames.length; i++) {
  concat += `file '${frames[i].filename}'\noption framerate 60\n`;
  if (i < frames.length - 1)
    concat += `duration ${Math.max(0.016, frames[i + 1].time - frames[i].time).toFixed(5)}\n`;
}
await writeFile(`${frameDir}/concat.txt`, concat);
const report = {
  date: new Date().toISOString(),
  browser: browser.version(),
  viewport: '1440x900, DPR1',
  ...motion,
  recordedFrames: frames.length,
  initial: await page.evaluate(() => window.__qa),
  resources: await page.evaluate(() => {
    const r = performance.getEntriesByType('resource');
    return {
      totalTransfer: r.reduce((s, r) => s + r.transferSize, 0),
      javascriptTransfer: r
        .filter((r) => r.name.includes('.js'))
        .reduce((s, r) => s + r.transferSize, 0),
    };
  }),
  note: 'Local headless desktop Chrome with CDP recording. rAF scheduling intervals are not a claim of device FPS or hardware compatibility.',
};
await writeFile(`${out}/performance.json`, JSON.stringify(report, null, 2));
console.log(report);
await browser.close();
