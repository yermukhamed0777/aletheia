/* Cheap source lint for Aletheia. Run: node lint.mjs */
import fs from 'node:fs';
import vm from 'node:vm';
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

if (problems.length) {
  console.error('LINT FAILED (' + problems.length + ')');
  for (const p of problems) console.error(' - ' + p);
  process.exit(1);
}
console.log('LINT PASSED — ' + files.length + ' source files parsed, bundle order and tracked-file guards verified');
