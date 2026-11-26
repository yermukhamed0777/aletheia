/* Cheap source lint for Aletheia. Run: node lint.mjs */
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const problems = [];
const ok = (cond, msg) => { if (!cond) problems.push(msg); };
const files = fs.readdirSync('src').filter(f => f.endsWith('.js')).sort();
const bundle = fs.readFileSync('bundle.mjs', 'utf8');

// Every src/*.js file must be syntactically valid and listed in the bundle order.
for (const f of files) {
  const source = fs.readFileSync('src/' + f, 'utf8');
  try { new vm.Script(source, { filename: 'src/' + f }); }
  catch (e) { problems.push('syntax error in src/' + f + ': ' + e.message); }
  ok(bundle.includes(f), 'src/' + f + ' is not referenced in bundle.mjs');
  ok(!/^\s*(?:import|export)\s/m.test(source), 'src/' + f + ' must be a plain global script (no import/export)');
}

// Generated output must be ignored, and no secret-shaped file may be tracked.
const tracked = spawnSync('git', ['ls-files'], { encoding: 'utf8' });
if (tracked.status !== 0) problems.push('git ls-files failed: ' + tracked.stderr);
else for (const p of tracked.stdout.split(/\r?\n/).filter(Boolean)) {
  ok(p !== 'dist/index.html', 'generated dist/index.html is tracked');
  ok(!/(^|\/)\.env(\.|$)/.test(p), 'tracked env file: ' + p);
  ok(!/\.(key|pem|pfx|p12)$/.test(p), 'tracked key file: ' + p);
}

// The app is a single self-contained page: no runtime network dependency in src/.
for (const f of files) {
  const source = fs.readFileSync('src/' + f, 'utf8');
  ok(!/\brequire\s*\(/.test(source), 'require() in src/' + f + ' would break the browser bundle');
}

// Removed fabricated-state and remote-doc globals must never come back.
const LEGACY = ['REMOTE_DOCS', 'SEED_DAYS', 'SEED_TOP', 'liveTop', 'seedHistory', 'seedGaps'];
for (const f of files) {
  const source = fs.readFileSync('src/' + f, 'utf8');
  for (const g of LEGACY) ok(!new RegExp('\\b' + g + '\\b').test(source), 'legacy global ' + g + ' in src/' + f);
}

// All view copy must come from strings.js (CLAUDE.md convention, P0-4).
for (const f of ['interface.js', 'pages.js', 'controller.js']) {
  const source = fs.readFileSync('src/' + f, 'utf8');
  ok(!source.includes('Ctrl K'), 'hard-coded Ctrl K in src/' + f);
  ok(!/'Esc'/.test(source) && !/>Esc</.test(source), 'hard-coded Esc in src/' + f);
  ok(!source.includes(' · OCR'), 'hard-coded OCR badge in src/' + f);
  ok(!/' ms'/.test(source), 'hard-coded ms unit in src/' + f);
}

// Vendored pdf.js blobs are pinned (P1-3). A silent upgrade is a supply-chain change.
const VENDOR_HASH = {
  'pdf.min.mjs': '3f2374cbc1639408d65f517003bb8dd6671775f6592dc9fa2a7b686246d4830e',
  'pdf.worker.min.mjs': '8b855be66d4dbeb4a9e8950656eb0f22d83645febef73818d4e42f4dbe72b64d',
};
for (const [f, hash] of Object.entries(VENDOR_HASH)) {
  const actual = crypto.createHash('sha256').update(fs.readFileSync('vendor/' + f)).digest('hex');
  ok(actual === hash, 'vendor/' + f + ' hash changed: ' + actual);
}

if (problems.length) {
  console.error('LINT FAILED (' + problems.length + ')');
  for (const p of problems) console.error(' - ' + p);
  process.exit(1);
}
console.log('LINT PASSED — ' + files.length + ' source files parsed, bundle order, tracked-file, view-copy, legacy-global and 2 pinned vendor hashes verified');
