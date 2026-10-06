// npm run qa:scroll [-- url cpu-rate]  (needs Google Chrome and `npm run build:pages` + a static server)
// Scroll the whole page like a thumb would, on a throttled CPU (4x ~ mid-range phone),
// and report frame times. Frames over 20 ms are visible stutter at 60 Hz.
import { chromium } from '@playwright/test';
const [, , url = 'http://localhost:3100/', rate = '4'] = process.argv;
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: +rate });
const result = await page.evaluate(async () => {
  document.documentElement.style.scrollBehavior = 'auto';
  const total = document.documentElement.scrollHeight - innerHeight;
  const frames = [];
  let last = performance.now();
  const speed = 1.6; // px per ms (~ a steady flick)
  await new Promise((done) => {
    const start = performance.now();
    const step = (now) => {
      frames.push([now - last, scrollY]);
      last = now;
      const y = Math.min(total, (now - start) * speed);
      window.scrollTo(0, y);
      if (y < total) requestAnimationFrame(step);
      else done();
    };
    requestAnimationFrame(step);
  });
  // Attribute slow frames to the section at that scroll position.
  const marks = [...document.querySelectorAll('main > section, footer')].map((s) => [s.className.split(' ')[0] || s.id, s.offsetTop]);
  const where = (y) => (marks.filter(([, t]) => t <= y + innerHeight / 2).pop() || ['?'])[0];
  const slow = {};
  for (const [dt, y] of frames.slice(1)) if (dt > 20) slow[where(y)] = (slow[where(y)] || 0) + 1;
  const times = frames.slice(1).map(([dt]) => dt).sort((a, b) => a - b);
  const pct = (q) => times[Math.floor(times.length * q)].toFixed(1);
  return { frames: times.length, median: pct(0.5), p95: pct(0.95), p99: pct(0.99), over20: times.filter((t) => t > 20).length, over33: times.filter((t) => t > 33).length, slow };
});
console.log(JSON.stringify(result));
await browser.close();
