/* Measured retrieval experiments. Run: node experiment.mjs
 * Applies candidate patches to src/retrieval.js in memory only — no source or
 * validation file is modified. dev.json is the development set; fresh.json and
 * heldout1.json are held out from tuning. Threshold stays 0.6 throughout.
 */
import fs from 'node:fs';
import vm from 'node:vm';

const SOURCE = fs.readFileSync('src/retrieval.js', 'utf8').replace(/\r\n/g, '\n');
// Reconstruct the pre-change engine by removing the measured stopword block,
// so this script can still compare old vs new after implementation.
const ORIGINAL = SOURCE.replace(/  \/\/ Generic interrogative[\s\S]*?STOP\.add\(w\)\);\n/, '');
const THRESHOLD = 0.6;
const EXTRA_STOP = 'often checked must phoned open source wins receives unacknowledged handled часто когда готовить делать пробой быстро сообщают перейти препарат снижают долго принимают хранят мочу задержке пишут связаться раз морозильника суточная';
const CANON_ADD = "'суточную':'сутки', 'суточной':'сутки', 'суточная':'сутки', 'готовить':'приготов', 'сообщают':'уведом', 'уведомляют':'уведом', 'холодной':'холод', 'цепи':'цепь', ";
const EXTRA_STOP2 = EXTRA_STOP.replace(' связаться', '');
const CANON_CONTACT = "'связаться':'контакт', 'контакты':'контакт', ";

const variants = {
  V0_baseline: s => s,
  V1_stopwords: s => s.replace('  const CANON = {', "  ('" + EXTRA_STOP + "').split(/\\s+/).forEach(w => STOP.add(w));\n  const CANON = {"),
  V2_synonyms: s => s.replace('  const CANON = {', '  const CANON = { ' + CANON_ADD),
  V3_both: s => s.replace('  const CANON = {', "  ('" + EXTRA_STOP + "').split(/\\s+/).forEach(w => STOP.add(w));\n  const CANON = { " + CANON_ADD),
  // Principled alternative: a query term absent from the whole corpus cannot
  // be supported by any passage, so it must not count against coverage.
  V4_unknown_terms: s => s.replace(
    "    const totalW = uniq.reduce((a, t) => a + w(t), 0);\n    const pool = scored.filter(r => r.s > 0 && r.s >= top.s * 0.7).slice(0, 2);\n    const matched = uniq.filter(t => pool.some(r => r.d.tf.has(t.s)));",
    "    const known = uniq.filter(t => index.df.has(t.s));\n    const totalW = known.reduce((a, t) => a + w(t), 0);\n    const pool = scored.filter(r => r.s > 0 && r.s >= top.s * 0.7).slice(0, 2);\n    const matched = known.filter(t => pool.some(r => r.d.tf.has(t.s)));"
  ),
  V5_unknown_plus_synonyms: s => s.replace('  const CANON = {', '  const CANON = { ' + CANON_ADD).replace(
    "    const totalW = uniq.reduce((a, t) => a + w(t), 0);\n    const pool = scored.filter(r => r.s > 0 && r.s >= top.s * 0.7).slice(0, 2);\n    const matched = uniq.filter(t => pool.some(r => r.d.tf.has(t.s)));",
    "    const known = uniq.filter(t => index.df.has(t.s));\n    const totalW = known.reduce((a, t) => a + w(t), 0);\n    const pool = scored.filter(r => r.s > 0 && r.s >= top.s * 0.7).slice(0, 2);\n    const matched = known.filter(t => pool.some(r => r.d.tf.has(t.s)));"
  ),
  // V6 keeps the contact term and maps it to the corpus vocabulary so the
  // contact line (not just opening hours) is selected.
  V6_contact_safe: s => s.replace('  const CANON = {', "  ('" + EXTRA_STOP2 + "').split(/\\s+/).forEach(w => STOP.add(w));\n  const CANON = { " + CANON_CONTACT),
};

function score(patched) {
  const ctx = vm.createContext({ performance, console });
  vm.runInContext(fs.readFileSync('src/corpus.js', 'utf8'), ctx);
  vm.runInContext(patched, ctx);
  vm.runInContext(fs.readFileSync('src/strings.js', 'utf8'), ctx);
  if (typeof vm.runInContext('typeof Retrieval', ctx) !== 'string' || vm.runInContext('typeof Retrieval', ctx) !== 'object')
    throw new Error('Retrieval binding missing after patch');
  const C = vm.runInContext('CORPUS', ctx), R = vm.runInContext('Retrieval', ctx);
  const idx = R.buildIndex(C.CHUNKS);
  const answerText = r => r.status !== 'answer' ? '' : r.hits.flatMap(h => h.lines.map(i => h.chunk.lines[i]?.join(' ') || '')).join(' ').toLowerCase();
  const out = {}, details = {};
  for (const file of fs.readdirSync('validation').filter(f => f.endsWith('.json')).sort()) {
    const set = JSON.parse(fs.readFileSync('validation/' + file, 'utf8'));
    const rows = set.ans.map(([q, e], i) => {
      const r = R.search(idx, q, { threshold: THRESHOLD });
      const t = answerText(r);
      return { id: file + ':ans' + (i + 1), q, pass: t.includes(String(e).toLowerCase()), status: r.status, reason: r.reason || null, covered: r.coverage, hits: (r.hits || []).map(h => h.chunk.id) };
    });
    const idk = set.idk.map(q => R.search(idx, q, { threshold: THRESHOLD }).status === 'abstain');
    out[file] = { ansOk: rows.filter(r => r.pass).length, ansN: rows.length, idkOk: idk.filter(Boolean).length, idkN: idk.length, rows };
    details[file] = rows;
  }
  // Separate held-out research set (EN/RU/KK), excluded from validation totals.
  const research = { ansOk: 0, ansN: 0, idkOk: 0, idkN: 0, rows: [] };
  for (const file of fs.readdirSync('evaluation').filter(f => f.endsWith('.json'))) {
    const set = JSON.parse(fs.readFileSync('evaluation/' + file, 'utf8'));
    set.ans.forEach(([q, e], i) => {
      const r = R.search(idx, q, { threshold: THRESHOLD });
      const t = answerText(r);
      const pass = t.includes(String(e).toLowerCase());
      research.ansN++; if (pass) research.ansOk++;
      research.rows.push({ id: file + ':ans' + (i + 1), q, pass, status: r.status, reason: r.reason || null, hits: (r.hits || []).map(h => h.chunk.id) });
    });
    set.idk.forEach((q, i) => { const ok = R.search(idx, q, { threshold: THRESHOLD }).status === 'abstain'; research.idkN++; if (ok) research.idkOk++; });
  }
  return { out, details, research, R, C, idx };
}

const base = score(ORIGINAL);
console.log('Variant           dev ans/idk      fresh ans/idk    heldout1 ans/idk   total   abstentions');
for (const [name, patch] of Object.entries(variants)) {
  const s = score(patch(ORIGINAL));
  const v = s.out, b = base.out;
  const fmt = k => v[k].ansOk + '/' + v[k].ansN + ' ' + v[k].idkOk + '/' + v[k].idkN;
  const keys = Object.keys(v);
  const tot = keys.reduce((a, k) => a + v[k].ansOk + v[k].idkOk, 0);
  const idkTot = keys.reduce((a, k) => a + v[k].idkOk, 0);
  const idkN = keys.reduce((a, k) => a + v[k].idkN, 0);
  console.log(name.padEnd(17) + fmt('dev.json').padEnd(17) + fmt('fresh.json').padEnd(17) + fmt('heldout1.json').padEnd(19) + String(tot).padEnd(8) + idkTot + '/' + idkN);
  console.log('  held-out EN/RU/KK: ans ' + s.research.ansOk + '/' + s.research.ansN + ', idk ' + s.research.idkOk + '/' + s.research.idkN);
  for (const id of ['fresh.json:ans12', 'heldout1.json:ans13', 'heldout1.json:ans14']) {
    const row = Object.values(v).flatMap(x => x.rows).find(r => r.id === id);
    console.log('  ' + id + ': ' + row.status + (row.reason ? '/' + row.reason : '') + ' pass=' + row.pass);
  }
  const newly = [];
  for (const k of keys) v[k].rows.forEach((r, i) => { if (r.pass && !b[k].rows[i].pass) newly.push({ id: r.id, q: r.q, status: r.status, hits: r.hits, expectedFound: true }); });
  const lost = [];
  for (const k of keys) v[k].rows.forEach((r, i) => { if (!r.pass && b[k].rows[i].pass) lost.push(r.id); });
  console.log('  new passes: ' + (newly.length ? newly.map(x => x.id).join(', ') : 'none'));
  console.log('  lost passes: ' + (lost.length ? lost.join(', ') : 'none'));
  if (newly.length) {
    const ctx = vm.createContext({ performance, console });
    vm.runInContext(fs.readFileSync('src/corpus.js', 'utf8'), ctx);
    vm.runInContext(patch(SOURCE), ctx); vm.runInContext(fs.readFileSync('src/strings.js', 'utf8'), ctx);
    const R = vm.runInContext('Retrieval', ctx), C = vm.runInContext('CORPUS', ctx);
    for (const n of newly) {
      const row = [...Object.values(v).flatMap(x => x.rows)].find(r => r.id === n.id);
      const expected = JSON.parse(fs.readFileSync('validation/' + n.id.split(':')[0], 'utf8')).ans.find(([q]) => q === n.q)[1];
      const txt = R.search(R.buildIndex(C.CHUNKS), n.q, { threshold: THRESHOLD });
      const answer = txt.hits.flatMap(h => h.lines.map(i => h.chunk.lines[i]?.join(' ') || '')).join(' ').toLowerCase();
      console.log('    ' + n.id + ' => ' + JSON.stringify(expected) + ' found=' + answer.includes(String(expected).toLowerCase()) + ' evidence=' + JSON.stringify(n.hits));
    }
  }
}
