// node scripts/make-og.mjs [server]  (needs Google Chrome, `npm run build:pages` and a static server on out/)
// The link previews (Open Graph) for / and /de/: public/og.jpg and public/og-de.jpg, 1200 × 630.
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
const server = process.argv[2] || 'http://127.0.0.1:3199';
const copy = {
  en: { file: 'public/og.jpg', size: 66, lines: ['Scan your cards.', 'Complete your Pokédex.'], sub: ['Instantly recognised · English & Japanese', 'Coming to iPhone first'] },
  de: { file: 'public/og-de.jpg', size: 56, lines: ['Scanne deine Karten.', 'Vervollständige', 'deinen Pokédex.'], sub: ['Sofort erkannt · Englisch & Japanisch', 'Bald zuerst fürs iPhone'] },
};
// Embedded: a page from setContent may not load a font from another origin.
const font = `data:font/woff2;base64,${(await readFile('public/fonts/onest-latin.woff2')).toString('base64')}`;
const fan = ['umbreon', 'mew', 'charizard', 'gengar', 'pikachu'];
const page = (c) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Onest;src:url(${font}) format('woff2');font-weight:100 900}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;font-family:Onest,sans-serif;color:#17161d;
 background:radial-gradient(60% 80% at 82% 70%,rgba(177,154,249,.55),rgba(177,154,249,0) 70%),#f5f4f8}
.brand{position:absolute;left:72px;top:64px;display:flex;align-items:center;font-size:40px;font-weight:700;letter-spacing:-.03em}
.brand img{width:36px;height:36px;margin:0 1px}.brand .d{color:#7554bd}
main{position:absolute;left:72px;top:168px;width:540px}
h1{font-size:${c.size}px;line-height:1.02;font-weight:650;letter-spacing:-.05em}
h1 span{display:block}h1 span+span{background:linear-gradient(100deg,#5d3db8,#8564e0 55%,#b19af9);-webkit-background-clip:text;background-clip:text;color:transparent}
p{margin-top:30px;font-size:22px;line-height:1.4;color:#6b6676;font-weight:500}
.fan{position:absolute;left:950px;top:258px;width:0;height:0}
.fan img{position:absolute;width:236px;left:-118px;top:-140px;border-radius:12px/9px;transform-origin:50% 160%;
 box-shadow:0 2px 4px rgba(20,10,40,.2),0 30px 50px -20px rgba(30,14,70,.55)}
.url{position:absolute;right:56px;bottom:40px;font-size:20px;font-weight:600;color:#7554bd}
</style></head><body>
<div class="brand"><span>M</span><img src="${server}/assets/orbit.svg"><span>n<span class="d">Dex</span></span></div>
<main><h1>${c.lines.map((l) => `<span>${l}</span>`).join('')}</h1>
<p>${c.sub.join('<br>')}</p></main>
<div class="fan">${fan.map((a, i) => `<img src="${server}/assets/card-${a}-460.webp" style="transform:rotate(${(i - 2) * 13}deg) translateY(${Math.abs(i - 2) * 10}px);z-index:${i === 2 ? 9 : 5 - Math.abs(i - 2)}">`).join('')}</div>
<span class="url">mondextcg.com</span>
</body></html>`;
const browser = await chromium.launch({ channel: 'chrome' });
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const c of Object.values(copy)) {
  await tab.setContent(page(c), { waitUntil: 'networkidle' });
  await tab.evaluate(() => document.fonts.ready);
  const png = await tab.screenshot({ type: 'png' });
  await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(c.file);
  console.log(c.file);
}
await browser.close();
