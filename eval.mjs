/* Validation scoring for Aletheia. Run: node eval.mjs
 * Scores the curated [question, expected_substring] pairs and the deliberately
 * unanswerable questions in validation/*.json against the live BM25 retriever.
 * This is a regression check on small, indicative sets — not a benchmark.
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
// Original regression floor: 0.694 (50/72). After the measured stopword fix the
// same frozen sets score 67/72 = 0.93055… (displayed 93.1%); the floor is raised
// only to that measured value (0.9305), never lowered. Expected answers and the
// 0.6 retrieval threshold are unchanged.
const MIN = Number(process.env.EVAL_MIN || 0.9305);

function answerText(result) {
  if (result.status !== 'answer') return '';
  return result.hits.flatMap(h => h.lines.map(i => h.chunk.lines[i]?.join(' ') || '')).join(' ').toLowerCase();
}

let totalOk = 0, totalN = 0;
for (const file of fs.readdirSync('validation').filter(f => f.endsWith('.json')).sort()) {
  const set = JSON.parse(fs.readFileSync('validation/' + file, 'utf8'));
  const ansOk = set.ans.filter(([q, expected]) => {
    const r = Retrieval.search(index, q, { threshold: THRESHOLD });
    return answerText(r).includes(String(expected).toLowerCase());
  }).length;
  const idkOk = set.idk.filter(q => Retrieval.search(index, q, { threshold: THRESHOLD }).status === 'abstain').length;
  const okN = ansOk + idkOk, n = set.ans.length + set.idk.length;
  totalOk += okN; totalN += n;
  console.log(file + ': ans ' + ansOk + '/' + set.ans.length + ', idk ' + idkOk + '/' + set.idk.length + ', total ' + okN + '/' + n);
}

const accuracy = totalN ? totalOk / totalN : 0;
console.log('EVAL ' + (accuracy >= MIN ? 'PASSED' : 'FAILED') + ' — ' + totalOk + '/' + totalN + ' (' + (accuracy * 100).toFixed(1) + '%) at threshold ' + THRESHOLD + ', minimum ' + MIN);
if (accuracy < MIN) process.exit(1);
