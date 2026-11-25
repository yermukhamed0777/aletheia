/* Pass/fail smoke test for Aletheia. Run: npm run check */
import fs from 'node:fs';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';

const problems = [];
const ok = (cond, msg) => { if (!cond) problems.push(msg); };

// 1. Build must succeed.
const built = spawnSync(process.execPath, ['bundle.mjs'], { encoding: 'utf8' });
if (built.status !== 0) {
  console.error('CHECK FAILED — bundle.mjs exited ' + built.status);
  console.error(built.stderr);
  process.exit(1);
}
const html = fs.readFileSync('dist/index.html', 'utf8');
ok(html.length > 500000, 'bundle looks too small');
for (const bad of ['KNOWLEDGE BASE', 'Altyn Coatings', 'TerraShield', 'knowledge-base', 'KB_DATA', 'Answers in 5 seconds'])
  ok(!html.includes(bad), 'old identity still present: ' + bad);
for (const good of ['Aletheia', 'Asklepia Diagnostics', 'altheia.state', 'Verified answers'])
  ok(html.includes(good), 'new identity missing: ' + good);

// 2. Load data + pure retriever in a sandbox (no DOM needed).
const ctx = vm.createContext({ performance, console });
const run = f => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx);
run('src/corpus.js'); run('src/retrieval.js'); run('src/strings.js');
const CORPUS = vm.runInContext('CORPUS', ctx);
const Retrieval = vm.runInContext('Retrieval', ctx);
const TEXT = vm.runInContext('TEXT', ctx);

ok(CORPUS.DOCS.length === 7, 'expected 7 demo sources, got ' + CORPUS.DOCS.length);
ok(CORPUS.CHUNKS.length === 22, 'expected 22 passages, got ' + CORPUS.CHUNKS.length);
ok(CORPUS.QA.length === 39, 'expected 39 questions, got ' + CORPUS.QA.length);
const qaIds = new Set();
for (const qa of CORPUS.QA) {
  ok(!qaIds.has(qa.id), 'duplicate question id ' + qa.id);
  qaIds.add(qa.id);
  for (const [cid, lines] of qa.ev || []) {
    const c = CORPUS.CHUNKS.find(x => x.id === cid);
    ok(!!c, qa.id + ' cites unknown passage ' + cid);
    if (c) for (const i of lines) ok(i >= 0 && i < c.lines.length, qa.id + ' cites bad line ' + cid + ':' + i);
  }
  for (const id of qa.follow || []) ok(CORPUS.QA.some(x => x.id === id), qa.id + ' follows unknown question ' + id);
  for (const id of qa.related || []) ok(CORPUS.DOCS.some(x => x.id === id), qa.id + ' points to unknown source ' + id);
  ok(Array.isArray(qa.q) && qa.q.length === 3 && qa.q.every(x => typeof x === 'string' && x.trim()), qa.id + ' needs three non-empty translations');
}
for (const tp of CORPUS.TOPICS) ok(Array.isArray(tp.n) && tp.n.length === 3, 'topic ' + tp.id + ' needs three translations');

// 3. Every t('key') used in the UI must exist in the string table.
const used = new Set();
for (const f of fs.readdirSync('src').filter(x => x.endsWith('.js') && x !== 'strings.js')) {
  const s = fs.readFileSync('src/' + f, 'utf8');
  for (const m of s.matchAll(/\bt\(\s*['"]([^'"]+)['"]/g)) used.add(m[1]);
}
for (const k of used) {
  if (k.endsWith('.')) {
    ok(Object.keys(TEXT).some(x => x.startsWith(k)), 'no translations for dynamic prefix ' + k);
  } else ok(!!TEXT[k], 'missing translation: ' + k);
}
for (const [k, v] of Object.entries(TEXT))
  ok(Array.isArray(v) && v.length === 3 && v.every(x => typeof x === 'string'), 'translation ' + k + ' must be an [en, ru, kk] triple');

// 4. Live retrieval still answers and still abstains.
const index = Retrieval.buildIndex(CORPUS.CHUNKS);
const answerable = Retrieval.search(index, 'What is the maximum daily dose of metformin?', { threshold: 0.6 });
ok(answerable.status === 'answer', 'live retrieval should answer the metformin question, got ' + answerable.status);
const refusal = Retrieval.search(index, 'What is the weather in Paris today?', { threshold: 0.6 });
ok(refusal.status === 'abstain', 'live retrieval must abstain on an unrelated question');

// 5. Validation sets parse.
for (const f of fs.readdirSync('validation').filter(x => x.endsWith('.json'))) {
  const j = JSON.parse(fs.readFileSync('validation/' + f, 'utf8'));
  ok(Array.isArray(j.ans) && Array.isArray(j.idk), f + ' must contain ans and idk arrays');
}

if (problems.length) {
  console.error('CHECK FAILED (' + problems.length + ')');
  for (const p of problems) console.error(' - ' + p);
  process.exit(1);
}
console.log('CHECK PASSED — bundle built, ' + CORPUS.QA.length + ' questions, ' + CORPUS.CHUNKS.length + ' passages, ' + used.size + ' literal t() keys used of ' + Object.keys(TEXT).length + ' defined strings verified');
