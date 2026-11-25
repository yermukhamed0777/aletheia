/* Core: icons, helpers, persisted state, derived data and the ask() pipeline. */
const REMOTE_DOCS = new Map();
const GLYPH = {
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  chart:'<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  sliders:'<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  dash:'<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  check:'<path d="M20 6 9 17l-5-5"/>', x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  copy:'<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  share:'<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/>',
  up:'<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
  down:'<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>',
  flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  trash:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  refresh:'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  right:'<path d="m9 18 6-6-6-6"/>', left:'<path d="m15 18-6-6 6-6"/>', arrow:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', send:'<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  warn:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  cmd:'<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>',
  play:'<polygon points="6 3 20 12 6 21 6 3"/>', book:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  layers:'<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  db:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  lock:'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  plus:'<path d="M5 12h14"/><path d="M12 5v14"/>', menu:'<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>', cols:'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/>',
  circ:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>', eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>', spark:'<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
  gap:'<circle cx="12" cy="12" r="10" stroke-dasharray="3 3"/><path d="M12 8v4"/><path d="M12 16h.01"/>', home:'<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  filter:'<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>', link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
};
const ic = (n, c = '') => `<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true">${GLYPH[n] || ''}</svg>`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const LANGS = [['en', 'EN', 'English'], ['ru', 'RU', 'Русский'], ['kk', 'ҚАЗ', 'Қазақша']];
const LOCALES = ['en-GB', 'ru-RU', 'kk-KZ'];

const ROUTE_HASH = { '/': 'home', '/app': 'app', '/app/ask': 'ask', '/app/docs': 'docs', '/app/analytics': 'analytics', '/app/gaps': 'gaps', '/app/settings': 'al-settings' };
const HASH2ROUTE = Object.fromEntries(Object.entries(ROUTE_HASH).map(([r, h]) => [h, r]));
const hashOf = r => '#' + (ROUTE_HASH[r] || 'home');
let LANG = 0;
function t(key, ...a) {
  const v = (TEXT[key] || [key, key, key])[LANG] ?? TEXT[key]?.[0] ?? key;
  return a.length ? v.replace(/\{(\d)\}/g, (_, i) => a[+i] ?? '') : v;
}
const pick = arr => arr[LANG];
const fmtDate = ts => new Date(ts).toLocaleDateString(LOCALES[LANG], { day: 'numeric', month: 'short', year: 'numeric' });
const fmtTime = ts => new Date(ts).toLocaleTimeString(LOCALES[LANG], { hour: '2-digit', minute: '2-digit' });
const fmtNum = n => Number(n).toLocaleString(LOCALES[LANG]);
const fmtSize = b => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
function rel(ts) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return t('rel.now'); if (m < 60) return t('rel.m', m);
  const h = Math.round(m / 60); if (h < 24) return t('rel.h', h);
  return t('rel.d', Math.round(h / 24));
}

/* ---------- persisted state ---------- */
const DAY = 864e5;
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};
// no fabricated usage data: history, unanswered questions and analytics start empty and fill only from real use
function seedHistory() { return []; }
function seedGaps() { return []; }
const SEED_DAYS = { ans: new Array(14).fill(0), gap: new Array(14).fill(0) };
const SEED_TOP = {};

const DEFAULT_SETTINGS = { threshold: 0.6, maxSources: 3, details: true, endpoint: '', useDemo: true, scripted: false, ai: false, semThr: 0.86 };
let STATE = Object.assign({
  lang: 0, theme: 'system', onboarded: false,
  history: seedHistory(), gaps: seedGaps(), feedback: {}, removed: [], uploads: [], liveTop: {},
  settings: DEFAULT_SETTINGS,
}, LS.get('altheia.state', {}));
STATE.settings = Object.assign({}, DEFAULT_SETTINGS, STATE.settings);
function save() { return LS.set('altheia.state', STATE); }
LANG = STATE.lang;

/* ---------- derived data ---------- */
const DEMO_DOCS = CORPUS.DOCS;
let INDEX = null;
function docList() {
  const demo = DEMO_DOCS.filter(d => STATE.settings.useDemo && !STATE.removed.includes(d.id)).map(d => ({
    id: d.id, name: d.name, type: d.type, size: d.size, ts: Date.now() - d.ago * DAY, status: 'processed', progress: 100, demo: true,
    pages: d.pages, sheets: d.sheets, rows: d.rows, category: d.cat, chunks: CORPUS.CHUNKS.filter(c => c.doc === d.id).length }));
  const ups = STATE.uploads.map(u => Object.assign({}, u, { chunks: u.chunks ? u.chunks.length : 0 }));
  return [...ups.slice().reverse(), ...demo];
}
function liveDocs() { return docList(); }
function allChunks() {
  const out = [];
  if (STATE.settings.useDemo) CORPUS.CHUNKS.forEach(c => { if (!STATE.removed.includes(c.doc)) out.push(c); });
  STATE.uploads.forEach(u => u.status === 'processed' && (u.chunks || []).forEach(c => out.push(c)));
  out.forEach(c => { if (c.docName === undefined) { const d = docById(c.doc); c.docName = d ? d.name.replace(/[_.]/g, ' ') + ' ' + (c.loc?.sheet || '') : ''; } });
  return out;
}
function docById(id) {
  const d = DEMO_DOCS.find(x => x.id === id);
  if (d) return { id: d.id, name: d.name, type: d.type, size: d.size, ts: Date.now() - d.ago * DAY, pages: d.pages, sheets: d.sheets, rows: d.rows, demo: true, category: d.cat };
  return REMOTE_DOCS.get(id) || STATE.uploads.find(u => u.id === id);
}
function chunkById(id) { return allChunks().find(c => c.id === id); }
function rebuild() { INDEX = Retrieval.buildIndex(allChunks()); if (typeof Augment !== 'undefined' && STATE.settings.ai && Augment.ready()) Augment.indexChunks(allChunks(), LANG); }
function docChunks(id) { return allChunks().filter(c => c.doc === id); }

function locLabel(loc) {
  if (!loc) return '';
  if (loc.label) return loc.label;
  if (loc.page) return t('loc.page', loc.page);
  if (loc.sheet) return t('loc.sheet', loc.sheet, loc.rows);
  if (loc.section) return t('loc.section', loc.section);
  if (loc.rows) return t('loc.rows', loc.rows);
  if (loc.lines) return t('loc.lines', loc.lines);
  if (loc.para) return t('loc.para', loc.para);
  return '';
}
function citeStr(chunk) { const d = docById(chunk.doc); return `${d ? d.name : '?'} — ${locLabel(chunk.loc)}`; }
const lt = (chunk, i) => Retrieval.lineText(chunk, i, LANG);

/* ---------- ask pipeline ---------- */
function topicOf(q) { return q.topic || 'general'; }
function normKey(q) { return Retrieval.tokens(q).map(t => t.s).sort().join(' '); }

function evidenceFrom(pairs) {
  return pairs.map(([cid, lines]) => ({ chunk: chunkById(cid), lines })).filter(e => e.chunk);
}
function resolveQuestion(q, qaId) {
  const t0 = performance.now();
  const qa = !STATE.settings.scripted ? null : qaId ? CORPUS.QA.find(x => x.id === qaId) : Retrieval.matchCurated(q, CORPUS.QA);
  const hasUploads = STATE.uploads.some(u => u.status === 'processed');
  if (qa) {
    const ev = evidenceFrom(qa.ev || []);
    const intact = ev.length === (qa.ev || []).length;
    const needDocs = (qa.ev || []).every(([cid]) => chunkById(cid));
    if (!qa.abstain && needDocs) {
      return { kind: 'curated', qa, evidence: ev, strength: qa.strength, conflict: qa.conflict, ms: performance.now() - t0, scanned: INDEX.N, coverage: 1, topic: qa.topic };
    }
    if (qa.abstain && !hasUploads) {
      return { kind: 'abstain', qa, reason: 'curated', related: qa.related, evidence: [], ms: performance.now() - t0, scanned: INDEX.N, coverage: 0, topic: qa.topic };
    }
    // else fall through to live retrieval (removed docs or new uploads)
  }
  const r = Retrieval.search(INDEX, q, { threshold: STATE.settings.threshold, maxSources: STATE.settings.maxSources, lang: LANG });
  if (r.status === 'answer') {
    const best = r.hits[0];
    return { kind: 'extractive', q, lineCov: r.lineCov, partial: r.partial, hits: r.hits, evidence: r.hits.map(h => ({ chunk: h.chunk, lines: h.lines })), strength: r.strength, coverage: r.coverage, ms: r.ms, scanned: r.scanned, missing: r.missing, topic: best.chunk.topic };
  }
  const relDocs = [...new Set((r.related || []).map(c => c.doc))];
  return { kind: 'abstain', reason: r.reason, related: qa?.abstain ? qa.related : relDocs, qa: qa && qa.abstain ? qa : null, missing: r.missing, coverage: r.coverage, ms: r.ms, scanned: r.scanned, evidence: [], topic: qa?.topic || 'general' };
}

async function resolveQuestionAsync(q, qaId) {
  const r = resolveQuestion(q, qaId);
  if (!(STATE.settings.ai && Augment.ready())) return r;
  if (r.kind !== 'abstain' || r.reason === 'curated') return r;
  const t0 = performance.now(), thr = STATE.settings.semThr;
  const chunks = allChunks(); await Augment.indexChunks(chunks, LANG);
  const top = await Augment.search(q, chunks, LANG, 3);
  if (!top.length) return r;
  r.sem = { sim: top[0].sim, thr };
  const good = top.filter(x => x.sim >= thr && x.lines && x.lines.length);
  if (!good.length) { r.ms += performance.now() - t0; return r; }
  const hits = good.map(x => ({ chunk: x.chunk, lines: x.lines, score: x.sim, best: { i: x.bestLine ?? x.lines[0] } }));
  return { kind: 'extractive', q, partial: true, semantic: true, hits, evidence: hits.map(h => ({ chunk: h.chunk, lines: h.lines })), strength: 'limited', coverage: top[0].sim, ms: r.ms + performance.now() - t0, scanned: chunks.length, missing: [], topic: good[0].chunk.topic, sem: r.sem };
}

function logResult(turn) {
  const r = turn.result, abst = r.kind === 'abstain';
  const entry = { id: 'h' + Date.now() + Math.random().toString(36).slice(2, 5), ts: Date.now(), q: turn.q, qa: r.qa ? r.qa.id : null, status: abst ? 'abstain' : 'answer', ms: Math.round(r.ms * 10) / 10 };
  STATE.history.unshift(entry); STATE.history = STATE.history.slice(0, 200);
  const key = r.qa ? r.qa.id : normKey(turn.q);
  if (!abst) STATE.liveTop[key] = { n: ((STATE.liveTop[key] || {}).n || 0) + 1, q: turn.q, qa: r.qa ? r.qa.id : null };
  if (abst) {
    const g = STATE.gaps.find(x => (x.qa && x.qa === entry.qa) || (!x.qa && x.key === key));
    if (g) { g.count++; g.ts = Date.now(); g.missing = r.missing; g.reasonKind = r.reason; g.related = r.related; if (g.status === 'resolved') g.status = 'open'; }
    else STATE.gaps.unshift({ id: 'g' + Date.now(), qa: entry.qa, key, q: entry.qa ? null : turn.q, ts: Date.now(), count: 1, status: 'open', missing: r.missing, reasonKind: r.reason, related: r.related });
  }
  save();
}

/* ---------- uploads (real client-side parsing) ---------- */
const MAX_BYTES = 30 * 1048576;
async function inflate(u8, raw) {
  const ds = new DecompressionStream(raw ? 'deflate-raw' : 'deflate');
  const buf = await new Response(new Blob([u8]).stream().pipeThrough(ds)).arrayBuffer();
  return new Uint8Array(buf);
}
async function unzip(buf) {
  const v = new DataView(buf), u8 = new Uint8Array(buf); let e = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 66000); i--) if (v.getUint32(i, true) === 0x06054b50) { e = i; break; }
  if (e < 0) throw new Error('zip');
  const n = v.getUint16(e + 10, true); let p = v.getUint32(e + 16, true); const files = {};
  for (let i = 0; i < n; i++) {
    const method = v.getUint16(p + 10, true), csize = v.getUint32(p + 20, true), nl = v.getUint16(p + 28, true), xl = v.getUint16(p + 30, true), cl = v.getUint16(p + 32, true), off = v.getUint32(p + 42, true);
    const name = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nl));
    files[name] = async () => { const lnl = v.getUint16(off + 26, true), lxl = v.getUint16(off + 28, true); const data = u8.subarray(off + 30 + lnl + lxl, off + 30 + lnl + lxl + csize); return new TextDecoder().decode(method === 0 ? data : await inflate(data, true)); };
    p += 46 + nl + xl + cl;
  }
  return files;
}
const xmlText = s => s.replace(/<[^>]+>/g, '').replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
function parseCSV(text) {
  const rows = []; let row = [], cur = '', q = false; const d = (text.split('\n')[0].match(/;/g) || []).length > (text.split('\n')[0].match(/,/g) || []).length ? ';' : ',';
  for (let i = 0; i < text.length; i++) { const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true; else if (c === d) { row.push(cur); cur = ''; } else if (c === '\n') { row.push(cur.replace(/\r$/, '')); rows.push(row); row = []; cur = ''; } else cur += c; }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim()));
}
function tableChunks(rows, base, sheet) {
  if (!rows.length) return []; const head = rows[0], out = [];
  for (let i = 1; i < rows.length; i += 8) {
    const grp = rows.slice(i, i + 8), a = i + 1, b = i + grp.length;
    out.push({ loc: sheet ? { sheet, rows: `${a}–${b}` } : { rows: `${a}–${b}` }, lines: grp.map(r => head.map((h, j) => r[j] ? `${h.trim()}: ${r[j].trim()}` : '').filter(Boolean).join(' | ')).filter(Boolean) });
  }
  return out;
}
// ---- Excel: real row numbers, sheets via workbook rels, merged cells, dates, header detection, section rows ----
const colIdx = ref => ref.split('').reduce((a, ch) => a * 26 + ch.charCodeAt(0) - 64, 0) - 1;
function xlDate(v) { const d = new Date(Math.round((+v - 25569) * 864e5)); if (isNaN(d)) return String(v); const p = n => String(n).padStart(2, '0');
  const dt = `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`; return (+v % 1) ? `${dt} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}` : dt; }
async function parseXlsx(buf) {
  const z = await unzip(buf); if (!z['xl/workbook.xml']) throw new Error('xlsx');
  const rd = async n => z[n] ? await z[n]() : '';
  const ss = [...(await rd('xl/sharedStrings.xml')).matchAll(/<si>([\s\VIEW]*?)<\/si>/g)].map(x => xmlText(x[1].replace(/<rPh[\s\VIEW]*?<\/rPh>/g, '')));
  // date styles
  const sty = await rd('xl/styles.xml'), custom = {}; [...sty.matchAll(/<numFmt [^>]*numFmtId="(\d+)"[^>]*formatCode="([^"]*)"/g)].forEach(m => custom[m[1]] = xmlText(m[2]));
  const xfBlock = (sty.match(/<cellXfs[^>]*>([\s\VIEW]*?)<\/cellXfs>/) || [])[1] || '';
  const dateXf = [...xfBlock.matchAll(/<xf [^>]*?numFmtId="(\d+)"/g)].map(m => { const id = +m[1]; if ((id >= 14 && id <= 22) || (id >= 45 && id <= 47)) return true; const f = custom[id]; return !!f && /[dmyh]/i.test(f.replace(/"[^"]*"|\[[^\]]*\]|\\./g, '')); });
  // sheets by relationship id
  const wb = await rd('xl/workbook.xml'), rels = {};
  [...(await rd('xl/_rels/workbook.xml.rels')).matchAll(/<Relationship [^>]*>/g)].forEach(m => { const id = (m[0].match(/Id="([^"]*)"/) || [])[1], tg = (m[0].match(/Target="([^"]*)"/) || [])[1]; if (id && tg) rels[id] = tg.replace(/^\/?(xl\/)?/, 'xl/'); });
  const sheets = [...wb.matchAll(/<sheet [^>]*>/g)].map((m, i) => ({ name: xmlText((m[0].match(/name="([^"]*)"/) || [])[1] || 'Sheet' + (i + 1)), path: rels[(m[0].match(/r:id="([^"]*)"/) || [])[1]] || `xl/worksheets/sheet${i + 1}.xml` }));
  let chunks = [], total = 0;
  for (const sh of sheets) {
    const xml = await rd(sh.path); if (!xml) continue; const grid = new Map(); // rowNum -> cells[]
    for (const r of xml.matchAll(/<row ([^>]*?)(?:\/>|>([\s\VIEW]*?)<\/row>)/g)) {
      const rn = +((r[1].match(/\br="(\d+)"/) || [])[1] || 0) || grid.size + 1, cells = grid.get(rn) || [];
      for (const c of (r[2] || '').matchAll(/<c ([^>]*?)(?:\/>|>([\s\VIEW]*?)<\/c>)/g)) {
        const ref = (c[1].match(/\br="([A-Z]+)/) || [])[1] || 'A', col = colIdx(ref), tp = (c[1].match(/\bt="(\w+)"/) || [])[1], st = +((c[1].match(/\bs="(\d+)"/) || [])[1] || 0), body = c[2] || '';
        let val = ''; const v = (body.match(/<v>([^<]*)/) || [])[1];
        if (tp === 's') val = ss[+v] ?? ''; else if (tp === 'inlineStr') val = xmlText(body); else if (tp === 'b') val = v === '1' ? 'TRUE' : 'FALSE'; else if (tp === 'e') val = ''; else if (tp === 'str') val = xmlText(v || '');
        else if (v !== undefined && v !== '') val = dateXf[st] && isFinite(+v) ? xlDate(v) : (isFinite(+v) ? String(+(+v).toFixed(10)) : xmlText(v));
        cells[col] = String(val).replace(/\s+/g, ' ').trim(); }
      grid.set(rn, cells);
    }
    // vertical merges: fill the value down
    for (const m of xml.matchAll(/<mergeCell ref="([A-Z]+)(\d+):([A-Z]+)(\d+)"/g)) { const c0 = colIdx(m[1]), r0 = +m[2], c1 = colIdx(m[3]), r1 = +m[4]; if (r1 <= r0) continue;
      const val = (grid.get(r0) || [])[c0]; if (!val) continue;
      for (let r = r0 + 1; r <= r1; r++) for (let c = c0; c <= c1; c++) { const row = grid.get(r) || []; if (!row[c]) row[c] = val; grid.set(r, row); } }
    const rows = [...grid.entries()].sort((a, b) => a[0] - b[0]).map(([n, cells]) => ({ n, cells: Array.from(cells, x => x ?? '') })).filter(r => r.cells.some(x => x));
    total += rows.length; chunks = chunks.concat(sheetChunks(rows, sh.name));
  }
  return { chunks, info: { sheets: sheets.length, rows: total } };
}
// header = first row (of the first 15) that is mostly text and nearly as wide as the widest row; single-cell rows after it are section titles
function sheetChunks(rows, sheet) {
  const cnt = r => r.cells.filter(Boolean).length, head15 = rows.slice(0, 15), maxc = Math.max(0, ...head15.map(cnt));
  const hi = head15.findIndex(r => cnt(r) >= Math.max(2, Math.ceil(0.6 * maxc)) && r.cells.filter(x => x && isNaN(+x.replace(',', '.'))).length >= 0.6 * cnt(r));
  if (hi < 0) return [];
  const head = rows[hi].cells.map((h, j) => h || 'Col' + (j + 1)), recs = []; let sec = '';
  rows.slice(0, hi).forEach(r => { const t = r.cells.filter(Boolean).join(' '); if (t) recs.push({ n: r.n, text: t }); }); // titles above the table
  rows.slice(hi + 1).forEach(r => {
    if (cnt(r) === 1 && head.length >= 3) { sec = r.cells.find(Boolean); return; }
    const body = head.map((h, j) => r.cells[j] ? `${h}: ${r.cells[j]}` : '').filter(Boolean);
    r.cells.slice(head.length).forEach(x => x && body.push(x));
    if (body.length) recs.push({ n: r.n, text: (sec ? sec + ' — ' : '') + (body.length > 1 ? body.join(' | ') : body[0] + ' | ') });
  });
  const out = []; for (let i = 0; i < recs.length; i += 8) { const g = recs.slice(i, i + 8), a = g[0].n, b = g[g.length - 1].n;
    out.push({ loc: { sheet, rows: a === b ? String(a) : `${a}–${b}` }, lines: g.map(x => x.text) }); }
  return out;
}
function textChunks(paras, kind) {
  const out = []; let buf = [], len = 0, start = 1;
  const flush = end => { if (!buf.length) return; const lines = buf.flatMap(p => p.split(/(?<=[.!?。])\s+/).map(s => s.trim()).filter(Boolean).map(s => s.slice(0, 500)));
    out.push({ loc: kind === 'lines' ? { lines: `${start}–${end}` } : { para: `${start}–${end}` }, lines }); buf = []; len = 0; };
  paras.forEach((p, i) => { if (len + p.length > 650 && buf.length) { flush(i); start = i + 1; } buf.push(p); len += p.length; });
  flush(paras.length); return out;
}
function a85(str) {
  str = str.replace(/\s+/g, '').replace(/^<~/, ''); const e = str.indexOf('~>'); if (e >= 0) str = str.slice(0, e);
  const out = []; let grp = [];
  for (const ch of str) { if (ch === 'z' && !grp.length) { out.push(0, 0, 0, 0); continue; } grp.push(ch.charCodeAt(0) - 33);
    if (grp.length === 5) { let v = 0; grp.forEach(x => v = v * 85 + x); out.push((v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255); grp = []; } }
  if (grp.length > 1) { const n = grp.length; while (grp.length < 5) grp.push(84); let v = 0; grp.forEach(x => v = v * 85 + x); const b = [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255]; out.push(...b.slice(0, n - 1)); }
  return Uint8Array.from(out);
}
async function extractPDF(buf) {
  const s = new TextDecoder('latin1').decode(buf), texts = [];
  const re = /<<([^>]*?)>>\s*stream\r?\n/g; let m;
  while ((m = re.exec(s))) {
    const start = m.index + m[0].length, end = s.indexOf('endstream', start); if (end < 0) continue;
    let raw = s.slice(start, end), txt;
    try {
      let data;
      if (/ASCII85Decode/.test(m[1])) data = a85(raw); else data = Uint8Array.from(raw, c => c.charCodeAt(0));
      txt = /FlateDecode/.test(m[1]) ? new TextDecoder('latin1').decode(await inflate(data, false)) : new TextDecoder('latin1').decode(data);
    } catch { continue; }
    if (!/BT[\s\VIEW]*ET/.test(txt)) continue;
    const parts = []; const rx = /\[((?:[^\]\\]|\\.)*)\]\s*TJ|\(((?:[^()\\]|\\.)*)\)\s*(?:Tj|'|")|(TEXT\*|\sT[dD]\s)/g; let k;
    const unesc = x => x.replace(/\\([nrtbf()\\]|[0-7]{1,3})/g, (_, g) => ({ n: '\n', r: '', t: ' ', b: '', f: '', '(': '(', ')': ')', '\\': '\\' }[g] ?? String.fromCharCode(parseInt(g, 8))));
    while ((k = rx.exec(txt))) { if (k[1] != null) parts.push([...k[1].matchAll(/\(((?:[^()\\]|\\.)*)\)|(-?\d+\.?\d*)/g)].map(z => z[1] != null ? unesc(z[1]) : (+z[2] < -200 ? ' ' : '')).join('')); else if (k[2] != null) parts.push(unesc(k[2])); else parts.push('\n'); }
    const page = parts.join('').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim(); if (page) texts.push(page);
  }
  const all = texts.join('\n'); const good = (all.match(/[\p{L}\p{N}\s.,;:()%₸€$/\-–]/gu) || []).length;
  if (all.length < 30 || good / all.length < 0.85) throw new Error('pdf-text');
  const pageCount = (s.match(/\/Type\s*\/Page(?![s\w])/g) || []).length;
  return { texts, pageCount };
}
async function extractFile(file, type) {
  if (type === 'txt') { const tx = await file.text(); return { kind: 'lines', chunks: textChunks(tx.split(/\n\s*\n|\r\n\s*\r\n/).map(x => x.replace(/\s+/g, ' ').trim()).filter(Boolean), 'lines'), info: {} }; }
  if (type === 'csv') { const rows = parseCSV(await file.text()); return { chunks: tableChunks(rows, 'csv'), info: { rows: rows.length } }; }
  if (type === 'docx') {
    const z = await unzip(await file.arrayBuffer()); if (!z['word/document.xml']) throw new Error('docx');
    const xml = await z['word/document.xml']();
    const paras = [...xml.matchAll(/<w:p[ >][\s\VIEW]*?<\/w:p>/g)].map(p => xmlText(p[0].replace(/<w:tab\/>/g, ' ').replace(/<\/w:t>/g, '</w:t> '))).map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
    return { chunks: textChunks(paras, 'para'), info: {} };
  }
  if (type === 'xlsx') return parseXlsx(await file.arrayBuffer());
  if (type === 'img') throw new Error('pdf-text');
  if (type === 'pdf') {
    const buf = await file.arrayBuffer();
    try {
      const { pages, pageCount } = await pdfExtract(buf.slice(0));
      const chunks = [];
      pages.forEach(pg => {
        if (pg.kind === 'table') { for (let i = 0; i < pg.recs.length; i += 6) chunks.push({ loc: { page: pg.n }, lines: pg.recs.slice(i, i + 6).map(x => x.slice(0, 600)) }); }
        else textChunks(pg.paras, 'para').forEach(c => { c.loc = { page: pg.n }; chunks.push(c); });
      });
      const chars = chunks.reduce((a, c) => a + c.lines.join(' ').length, 0);
      if (chars >= 30) return { chunks, info: { pages: pageCount || undefined } };
    } catch (e) { /* fall back to the lightweight parser below */ }
    const { texts, pageCount } = await extractPDF(buf);
    const perPage = texts.length === pageCount;
    let chunks = [];
    texts.forEach((tx, i) => { const paras = tx.split(/\n{2,}|\n/).map(x => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
      textChunks(paras, 'para').forEach(c => { c.loc = perPage ? { page: i + 1 } : { section: String(i + 1) + '.' + (chunks.length + 1) }; chunks.push(c); }); });
    return { chunks, info: { pages: pageCount || undefined } };
  }
  throw new Error('type');
}
const EXT = { pdf: 'pdf', docx: 'docx', txt: 'txt', csv: 'csv', xlsx: 'xlsx', md: 'txt', png: 'img', jpg: 'img', jpeg: 'img', webp: 'img' };
function pagesToChunks(texts, perPage) {
  const chunks = [];
  texts.forEach((tx, i) => { const paras = tx.split(/\n{2,}|\n/).map(x => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
    textChunks(paras, 'para').forEach(c => { c.loc = perPage ? { page: i + 1 } : { section: String(i + 1) + '.' + (chunks.length + 1) }; chunks.push(c); }); });
  return chunks;
}
async function ocrExtract(file, type, onPage) {
  if (type === 'img') { const tx = await Augment.ocrImage(file); const chunks = pagesToChunks([tx], true); if (!chunks.length) throw new Error('ocr-empty'); return { chunks, info: { ocr: true, pages: 1 } }; }
  const { texts, pageCount } = await Augment.ocrPDF(await file.arrayBuffer(), onPage);
  const chunks = pagesToChunks(texts, true); if (!chunks.length) throw new Error('ocr-empty');
  return { chunks, info: { ocr: true, pages: pageCount } };
}
const FILES = new Map();
async function processUpload(file, existingId) {
  const ext = (file.name.split('.').pop() || '').toLowerCase(), type = EXT[ext];
  let doc = existingId && STATE.uploads.find(u => u.id === existingId);
  if (!doc) { doc = { id: 'u' + Date.now() + Math.random().toString(36).slice(2, 5), name: file.name, type: type || ext || 'file', size: file.size, ts: Date.now(), status: 'processing', progress: 5, stage: 'validate', demo: false, category: [t('lib.uploaded'), t('lib.uploaded'), t('lib.uploaded')], chunks: [] }; STATE.uploads.push(doc); }
  Object.assign(doc, { status: 'processing', progress: 5, stage: 'validate', error: null }); FILES.set(doc.id, file); UI.refresh();
  const step = async (p, stage) => { doc.progress = p; doc.stage = stage; UI.refresh(); await sleep(260); };
  try {
    await step(12, 'validate');
    if (!type) throw { code: 'unsupported' };
    if (!file.size) throw { code: 'empty' };
    if (file.size > MAX_BYTES) throw { code: 'toobig' };
    await step(35, 'extract');
    let res;
    try { res = await extractFile(file, type); }
    catch (e) {
      if (e.message !== 'pdf-text') throw { code: 'parse' };
      if (!STATE.settings.ai) throw { code: type === 'img' ? 'needocr' : 'pdftext' };
      doc.stage = 'ocr'; UI.refresh();
      try { res = await ocrExtract(file, type, (p, n) => { doc.progress = 35 + Math.round(25 * p / n); UI.refresh(); }); }
      catch (e2) { throw { code: e2.message === 'ocr-empty' ? 'ocrempty' : 'ocrfail' }; }
    }
    await step(65, 'chunk');
    if (!res.chunks.length) throw { code: 'nochunks' };
    doc.chunks = res.chunks.map((c, i) => Object.assign(c, { id: `${doc.id}-${i + 1}`, doc: doc.id, topic: 'uploaded' }));
    Object.assign(doc, res.info); doc.chars = doc.chunks.reduce((a, c) => a + c.lines.join(' ').length, 0);
    await step(88, 'index');
    doc.status = 'processed'; doc.progress = 100; doc.stage = 'done'; rebuild();
    UI.toast(t('toast.processed', doc.name, doc.chunks.length));
  } catch (e) {
    doc.status = 'failed'; doc.progress = 100; doc.error = e.code || 'parse'; doc.chunks = [];
    UI.toast(t('toast.failed', doc.name), 'err');
  }
  if (!save()) { UI.toast(t('toast.storage'), 'err'); }
  UI.refresh();
}

const SAMPLE_DOC = [
  'Paediatric dosing. Asklepia Diagnostics publishes adult doses only. A weight-based metformin table for children is being prepared by the pharmacy committee and is not yet approved.',
  'Педиатрические дозы. Asklepia Diagnostics публикует только дозы для взрослых. Таблица метформина по массе тела для детей готовится фармацевтическим комитетом и ещё не утверждена.',
  'Балалар дозалары. Asklepia Diagnostics тек ересектер дозаларын жариялайды. Балаларға арналған салмаққа негізделген метформин кестесі фармация комитетінде дайындалуда, әлі бекітілген жоқ.',
].join('\n\n');
function addSample() { processUpload(new File([SAMPLE_DOC], 'Sample_Paediatric_Dosing.txt', { type: 'text/plain' })); }

function genSuggestions() {
  const ups = allChunks().filter(c => c.topic === 'uploaded'); if (!ups.length) return [];
  const hdr = new Set(); ups.forEach(c => (c.lines || []).forEach(l => { const x = Array.isArray(l) ? l.join(' ') : l; (x.match(/(?:^|\| )([^:|]{2,30}):/g) || []).forEach(m => m.replace(/[|:]/g, '').toLowerCase().split(/[^\p{L}\d]+/u).forEach(w => w && hdr.add(w))); }));
  return Retrieval.keyTerms(ups, 14).filter(w => !hdr.has(String(w).toLowerCase())).slice(0, 4).map(w => t('sug.about', w));
}
