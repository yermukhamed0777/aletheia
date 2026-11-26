/* Reproducible demonstration capture. Run: node demo.mjs
 * Uses only the fictional built-in corpus (synthetic, non-sensitive data).
 * Writes fixed-viewport screenshots and a content-free event snapshot to
 * artifacts/demo/, so a video can be made later without re-running the app.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const html = fs.readFileSync('dist/index.html');
const server = http.createServer((_, res) => {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(html);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
const out = path.join('artifacts', 'demo');
fs.mkdirSync(out, { recursive: true });
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-GB', timezoneId: 'UTC', deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  // Freeze wall-clock time so relative timestamps in analytics are reproducible.
  await page.clock.install({ time: new Date('2026-11-26T04:00:00Z') });
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  const route = async (hash, ms = 150) => { await page.evaluate(h => { location.hash = h; }, hash); await page.waitForTimeout(ms); };
  const shot = async (n, label) => {
    const p = path.join(out, n + '-' + label + '.png');
    await page.screenshot({ path: p });
    const sz = fs.statSync(p).size;
    if (sz < 10000) throw new Error('screenshot too small: ' + p);
    console.log('  PASS ' + p + ' (' + sz + ' bytes)');
  };

  console.log('DEMO — deterministic capture from synthetic corpus');
  await shot('01', 'landing');

  await route('#app');
  const skip = page.locator('button[data-act="obskip"]');
  if (await skip.count()) await skip.first().click();
  await shot('02', 'dashboard');

  await route('#ask');
  await page.locator('[data-act="ask"][data-qa="d-metformin"]').first().click();
  await page.locator('section[data-turn] .cite').first().waitFor({ state: 'visible', timeout: 10000 });
  await shot('03', 'answer');

  await page.locator('section[data-turn] .cite').first().click();
  await page.locator('.drawer').waitFor({ state: 'visible' });
  await page.waitForTimeout(250);
  await shot('04', 'citation');
  await page.locator('#drawer-x').click();

  await route('#gaps');
  await shot('05', 'gaps');
  await route('#analytics');
  await shot('06', 'analytics');

  const events = await page.evaluate(() => EVENT_SNAPSHOT());
  fs.writeFileSync(path.join(out, 'events.json'), JSON.stringify(events, null, 2) + '\n');
  const values = Object.values(events);
  if (!values.length || !values.every(Number.isInteger)) throw new Error('event snapshot is not integer-only');
  console.log('  PASS ' + path.join(out, 'events.json') + ' — ' + JSON.stringify(events));
  if (errors.length) throw new Error('browser errors: ' + errors.join(' | '));
  console.log('  PASS zero browser page errors');
  console.log('DEMO PASSED — 6 screenshots + content-free event snapshot');
  await ctx.close();
} catch (e) {
  console.log('DEMO FAILED — ' + (e && e.message || e));
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  server.close();
}
