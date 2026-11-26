/* Browser smoke test for the built bundle. Run: node e2e.mjs
 * Serves dist/index.html locally (no network), drives ask -> citation -> drawer,
 * checks the subpath deployment variant, and captures a deterministic screenshot.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const failures = [];
const ok = (cond, msg) => {
  if (cond) console.log('  PASS ' + msg);
  else { failures.push(msg); console.log('  FAIL ' + msg); }
};

const html = fs.readFileSync('dist/index.html');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'x-content-type-options': 'nosniff' });
  res.end(html);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:' + server.address().port;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-GB', timezoneId: 'UTC' });
  const page = await ctx.newPage();
  const errors = [], external = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('request', r => { if (!r.url().startsWith(base)) external.push(r.url()); });

  console.log('E2E — browser smoke');
  await page.goto(base + '/', { waitUntil: 'load' });
  ok((await page.title()).includes('Aletheia'), 'landing page loads with the Aletheia title');
  ok(await page.locator('svg.logo, .logo').count() > 0, 'landing page renders its shell');

  // Enter the app, dismiss first-run onboarding, open the assistant.
  await page.goto(base + '/#app', { waitUntil: 'load' });
  const skip = page.locator('[data-act="obskip"]');
  if (await skip.count()) await skip.first().click();
  await page.goto(base + '/#ask', { waitUntil: 'load' });
  ok(await page.locator('input#ask-in').count() > 0, 'assistant composer is present');

  await page.locator('[data-act="ask"][data-qa="d-metformin"]').first().click();
  await page.locator('section[data-turn] .cite').first().waitFor({ state: 'visible', timeout: 10000 });
  ok(await page.locator('section[data-turn] .cite').count() > 0, 'metformin question produces a clickable citation');

  await page.locator('section[data-turn] .cite').first().click();
  await page.locator('.drawer').waitFor({ state: 'visible' });
  const loc = (await page.locator('.drawer .badge.info').first().innerText()).trim();
  const excerpt = (await page.locator('.drawer .excerpt').first().innerText()).trim();
  ok(loc.length > 0 && !/^0?\s*$/.test(loc), 'citation drawer shows a non-empty location: ' + JSON.stringify(loc));
  ok(excerpt.length > 0, 'citation drawer shows the highlighted passage');

  await page.locator('[data-act="cclose"], #drawer-x').first().click();
  ok(await page.locator('.drawer').count() === 0, 'citation drawer closes cleanly');

  await page.keyboard.press('Control+k');
  ok(await page.locator('#qs-in').count() > 0, 'Ctrl+K opens quick find');
  await page.keyboard.press('Escape');
  ok(await page.locator('#qs-in').count() === 0, 'Escape closes quick find');

  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  fs.mkdirSync('artifacts', { recursive: true });
  const shot = path.join('artifacts', 'walkthrough-ask.png');
  await page.screenshot({ path: shot, fullPage: false });
  ok(fs.existsSync(shot) && fs.statSync(shot).size > 10000, 'deterministic screenshot captured: ' + shot);

  // Subpath deployment variant: the same self-contained file must boot at /sub/.
  const sub = await ctx.newPage();
  await sub.goto(base + '/sub/#app', { waitUntil: 'load' });
  ok((await sub.title()).includes('Aletheia'), 'subpath deployment variant boots');
  await sub.close();

  ok(external.length === 0, 'no external network requests during the walkthrough');
  ok(errors.length === 0, 'zero browser console/page errors' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await ctx.close();
} catch (e) {
  failures.push('e2e threw: ' + (e && e.stack || e));
  console.log('  FAIL e2e threw: ' + (e && e.message || e));
} finally {
  if (browser) await browser.close();
  server.close();
}
console.log('E2E ' + (failures.length ? 'FAILED' : 'PASSED') + ' — ' + (failures.length ? failures.length + ' failure(s)' : 'root + subpath, zero console errors'));
if (failures.length) process.exit(1);
