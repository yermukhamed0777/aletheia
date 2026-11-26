/* Read-only retrieval benchmark diagnostic. Run: node benchmark.mjs
 * Scores every frozen validation case and writes exact per-case evidence to
 * artifacts/benchmark/results.json. It never edits validation files or
 * thresholds, and is not used by the CI gate (eval.mjs remains the gate).
 */
import fs from 'node:fs';
import vm from 'node:vm';

const ctx = vm.createContext({ performance, console });
for (const f of ['corpus.js', 'retrieval.js', 'strings.js'])
  vm.runInContext(fs.readFileSync('src/' + f, 'utf8'), ctx);
const CORPUS = vm.runInContext('CORPUS', ctx);
const Retrieval = vm.runInContext('Retrieval', ctx);
const index = Retrieval.buildIndex(CORPUS.CHUNKS);
const THRESHOLD = 0.6;

const answerText = r => r.status !== 'answer' ? ''
  : r.hits.flatMap(h => h.lines.map(i => h.chunk.lines[i]?.join(' ') || '')).join(' ').toLowerCase();
const short = (s, n = 220) => s.length > n ? s.slice(0, n) + '…' : s;

const report = { threshold: THRESHOLD, generated: new Date().toISOString(), sets: {}, totals: { ansOk: 0, ansN: 0, idkOk: 0, idkN: 0 } };
for (const file of fs.readdirSync('validation').filter(f => f.endsWith('.json')).sort()) {
  const set = JSON.parse(fs.readFileSync('validation/' + file, 'utf8'));
  const ans = set.ans.map(([q, expected], i) => {
    const r = Retrieval.search(index, q, { threshold: THRESHOLD });
    const text = answerText(r);
    return {
      id: file.replace('.json', '') + ':ans' + (i + 1), q, expected, pass: text.includes(String(expected).toLowerCase()),
      status: r.status, reason: r.reason || null, coverage: r.coverage, missing: r.missing || [],
      topScore: r.topScore ?? null, answer: short(text),
      hits: (r.hits || []).map(h => ({ doc: h.chunk.doc, id: h.chunk.id, loc: h.chunk.loc, best: h.best?.i ?? null })),
    };
  });
  const idk = set.idk.map((q, i) => {
    const r = Retrieval.search(index, q, { threshold: THRESHOLD });
    const curated = Retrieval.matchCurated(q, CORPUS.QA.filter(x => x.abstain));
    return { id: file.replace('.json', '') + ':idk' + (i + 1), q, pass: r.status === 'abstain', appPass: r.status === 'abstain' || !!curated, status: r.status, reason: r.reason || null, coverage: r.coverage, curated: curated ? curated.id : null };
  });
  const a = ans.filter(x => x.pass).length, k = idk.filter(x => x.pass).length;
  const appK = idk.filter(x => x.appPass).length;
  report.sets[file] = { ans, idk, ansOk: a, idkOk: k, appIdkOk: appK, totalOk: a + k, totalN: ans.length + idk.length };
  report.totals.ansOk += a; report.totals.ansN += ans.length;
  report.totals.idkOk += k; report.totals.idkN += idk.length;
  report.totals.appIdkOk = (report.totals.appIdkOk || 0) + appK;
  console.log(file + ': ans ' + a + '/' + ans.length + ', idk ' + k + '/' + idk.length + ', total ' + (a + k) + '/' + (ans.length + idk.length));
}
console.log('ANSWERS ' + report.totals.ansOk + '/' + report.totals.ansN + ', ABSTENTIONS ' + report.totals.idkOk + '/' + report.totals.idkN +
  ', OVERALL ' + (report.totals.ansOk + report.totals.idkOk) + '/' + (report.totals.ansN + report.totals.idkN));

// Separate held-out EN/RU/KK research set, excluded from the CI-scored totals.
const research = { ansOk: 0, ansN: 0, idkOk: 0, appIdkOk: 0, idkN: 0, rows: [] };
for (const file of fs.readdirSync('evaluation').filter(f => f.endsWith('.json'))) {
  const set = JSON.parse(fs.readFileSync('evaluation/' + file, 'utf8'));
  for (const [q, e] of set.ans) {
    const r = Retrieval.search(index, q, { threshold: THRESHOLD });
    const pass = answerText(r).includes(String(e).toLowerCase());
    research.ansN++; if (pass) research.ansOk++;
    research.rows.push({ q, expected: e, pass, status: r.status, reason: r.reason || null });
  }
  for (const q of set.idk) {
    const r = Retrieval.search(index, q, { threshold: THRESHOLD });
    const curated = Retrieval.matchCurated(q, CORPUS.QA.filter(x => x.abstain));
    research.idkN++; if (r.status === 'abstain') research.idkOk++;
    if (r.status === 'abstain' || curated) research.appIdkOk++;
  }
}
report.research = research;
console.log('HELD-OUT EN/RU/KK: ans ' + research.ansOk + '/' + research.ansN + ', raw abstentions ' + research.idkOk + '/' + research.idkN + ', app-level abstentions ' + research.appIdkOk + '/' + research.idkN);

console.log('\nFailed answerable cases (individual evidence):');
for (const [file, s] of Object.entries(report.sets))
  for (const c of s.ans.filter(x => !x.pass))
    console.log([c.id, JSON.stringify(c.q), 'expected=' + JSON.stringify(c.expected), 'status=' + c.status + (c.reason ? '/' + c.reason : ''),
      'cov=' + Number(c.coverage).toFixed(3), 'missing=' + JSON.stringify(c.missing), 'hit=' + (c.hits[0] ? c.hits[0].doc : '-'),
      'answer=' + JSON.stringify(c.answer)].join(' | '));

fs.mkdirSync('artifacts/benchmark', { recursive: true });
fs.writeFileSync('artifacts/benchmark/results.json', JSON.stringify(report, null, 2) + '\n');
console.log('\nWrote artifacts/benchmark/results.json');
