/* Workflow QA harness. Run: node qa.mjs
 * Covers mobile layout, keyboard navigation, hostile input, network failure,
 * persistence and empty states against the built bundle. No external network.
 */
import http from 'node:http';
import fs from 'node:fs';
import { chromium } from 'playwright';

let pass = 0, fail = 0;
const ok = (cond, msg) => {
  if (cond) { pass++; console.log('  PASS ' + msg); }
  else { fail++; console.log('  FAIL ' + msg); }
};

const html = fs.readFileSync('dist/index.html');
const server = http.createServer((_, res) => { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html); });
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  console.log('QA — workflows');

  // Mobile layout and drawer geometry.
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const mp = await m.newPage(); const mErr = [];
  mp.on('pageerror', e => mErr.push(String(e)));
  await mp.goto(base + '/#app', { waitUntil: 'load' });
  const mobSkip = mp.locator('button[data-act="obskip"]'); if (await mobSkip.count()) await mobSkip.first().click();
  await mp.goto(base + '/#ask', { waitUntil: 'load' });
  await mp.locator('[data-act="ask"][data-qa="d-metformin"]').first().click();
  await mp.locator('section[data-turn] .cite').first().waitFor({ state: 'visible', timeout: 10000 });
  const ov = await mp.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  ok(ov.sw <= ov.cw + 1, 'mobile: no horizontal overflow (' + ov.sw + ' <= ' + ov.cw + ')');
  await mp.locator('section[data-turn] .cite').first().click();
  await mp.waitForTimeout(350);
  const box = await mp.locator('.drawer').boundingBox();
  ok(!!box && box.x >= -1 && box.x + box.width <= 391, 'mobile: citation drawer fits viewport');
  ok(mErr.length === 0, 'mobile: zero page errors');
  await m.close();

  const d = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await d.newPage();
  const errs = [], dialogs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + String(e)));
  p.on('console', msg => { if (msg.type() === 'error' && !/Failed to load resource/.test(msg.text())) errs.push('console: ' + msg.text()); });
  p.on('dialog', async dlg => { dialogs.push(dlg.message()); await dlg.dismiss(); });
  await p.goto(base + '/#app', { waitUntil: 'load' });
  const skip = p.locator('button[data-act="obskip"]'); if (await skip.count()) await skip.first().click();

  await p.keyboard.press('Control+k');
  await p.locator('#qs-in').waitFor({ state: 'visible' });
  const sel0 = await p.locator('[role="option"][aria-selected="true"]').getAttribute('id');
  await p.keyboard.press('ArrowDown');
  const sel1 = await p.locator('[role="option"][aria-selected="true"]').getAttribute('id');
  ok(sel0 !== sel1, 'quick find: ArrowDown moves selection');
  ok(await p.locator('#qs-in').getAttribute('aria-activedescendant') === sel1, 'quick find: aria-activedescendant follows selection');
  const focusable = await p.evaluate(() => document.querySelectorAll('#ov button, #ov input, #ov [href]').length);
  ok(focusable > 1, 'quick find: overlay exposes focusable controls (' + focusable + ')');
  await p.keyboard.press('Escape');
  ok(await p.locator('#qs-in').count() === 0, 'quick find: Escape closes');

  await p.evaluate(() => { location.hash = '#gaps'; }); await p.waitForTimeout(120);
  const tab = p.locator('#gap-tab-open');
  if (await tab.count()) {
    await tab.focus(); await p.keyboard.press('ArrowRight');
    ok(await p.locator('#gap-tab-resolved[aria-selected="true"]').count() === 1, 'gap tabs: ArrowRight changes tab');
    ok(await p.locator('#gap-panel[aria-labelledby="gap-tab-resolved"]').count() === 1, 'gap tabs: tabpanel follows selection');
  }

  await p.evaluate(() => { location.hash = '#ask'; }); await p.waitForTimeout(120);
  const input = p.locator('#ask-in');
  await input.fill(''); await input.press('Enter');
  ok(await p.locator('section[data-turn]').count() === 0, 'empty question: no turn created');
  await input.fill('<script>window.__xss=1</script> & "quoted"'.slice(0, 400)); await input.press('Enter');
  await p.waitForTimeout(1500);
  ok(await p.evaluate(() => window.__xss === undefined), 'hostile input: script tag not executed');
  ok(dialogs.length === 0, 'hostile input: no browser dialogs');
  await p.locator('#ask-in').fill('x'.repeat(5000)); await p.locator('#ask-in').press('Enter');
  await p.waitForTimeout(1500);
  ok(await p.evaluate(() => document.body.innerText.includes('x'.repeat(200))), 'long question: app remains responsive');

  await p.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('altheia.state') || '{}');
    s.settings = { ...(s.settings || {}), endpoint: 'https://unreachable.invalid/api/ask' };
    localStorage.setItem('altheia.state', JSON.stringify(s));
  });
  await p.reload({ waitUntil: 'load' });
  await p.locator('#ask-in').fill('What is the metformin dose?'); await p.locator('#ask-in').press('Enter');
  await p.waitForTimeout(2500);
  ok(await p.locator('.callout.warn').count() > 0, 'network failure: visible error callout, no crash');
  const st = await p.evaluate(() => JSON.parse(localStorage.getItem('altheia.state') || '{}'));
  ok(Array.isArray(st.history) && st.history.length > 0, 'persistence: history written to localStorage');
  ok(!('liveTop' in st), 'persistence: no fabricated analytics field');
  await p.reload({ waitUntil: 'load' });
  ok(await p.locator('.panel .list button').count() > 0, 'persistence: history visible after reload');
  ok(errs.length === 0, 'no JS exceptions across hostile input and network failure' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await d.close();

  // Focus restoration after closing a citation drawer.
  const f = await browser.newContext(); const fp = await f.newPage();
  await fp.goto(base + '/#app', { waitUntil: 'load' });
  const fskip = fp.locator('button[data-act="obskip"]'); if (await fskip.count()) await fskip.first().click();
  await fp.evaluate(() => { location.hash = '#ask'; }); await fp.waitForTimeout(120);
  await fp.locator('[data-act="ask"][data-qa="d-metformin"]').first().click();
  await fp.locator('section[data-turn] .cite').first().waitFor({ state: 'visible', timeout: 10000 });
  await fp.locator('section[data-turn] .cite').first().click();
  await fp.locator('#drawer-x').waitFor({ state: 'visible' });
  await fp.locator('#drawer-x').click();
  const restored = await fp.evaluate(() => document.activeElement && document.activeElement.getAttribute('data-act'));
  ok(restored === 'src', 'focus restoration: closing citation drawer returns focus to its trigger');
  await f.close();

  const e = await browser.newContext(); const ep = await e.newPage(); const ee = [];
  ep.on('pageerror', x => ee.push(String(x)));
  await ep.goto(base + '/#app', { waitUntil: 'load' });
  const es = ep.locator('button[data-act="obskip"]'); if (await es.count()) await es.first().click();
  for (const [route, marker] of [['#gaps', '.empty'], ['#analytics', '.stat'], ['#docs', '.drop'], ['#al-settings', '#endpoint']]) {
    await ep.evaluate(h => { location.hash = h; }, route); await ep.waitForTimeout(120);
    ok(await ep.locator(marker).count() > 0, 'empty state ' + route + ': renders ' + marker);
  }
  ok(ee.length === 0, 'empty states: zero page errors');
  await e.close();
} catch (e) {
  fail++; console.log('  FAIL harness threw: ' + (e && e.message || e));
} finally {
  if (browser) await browser.close();
  server.close();
}
console.log('QA ' + (fail ? 'FAILED' : 'PASSED') + ' — ' + pass + ' passed, ' + fail + ' failed');
if (fail) process.exit(1);
