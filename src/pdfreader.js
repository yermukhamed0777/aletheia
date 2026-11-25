/* ---------- PDF reading with an embedded pdf.js (works offline) + table reconstruction ---------- */
let PDFJS = null;
async function pdfjsLoad() {
  if (PDFJS) return PDFJS;
  const mk = id => {
    const el = document.getElementById(id); if (!el) throw new Error('pdfjs-missing');
    const bin = atob(el.textContent.trim()), u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([u8], { type: 'text/javascript' }));
  };
  const lib = await import(mk('pdfjs-main'));
  lib.GlobalWorkerOptions.workerSrc = mk('pdfjs-worker');
  return (PDFJS = lib);
}

const NUMRE = /^\d[\d\s.,\-–]*$/;
function joinItems(its, H) {
  let out = '';
  its.forEach((it, k) => {
    const prev = its[k - 1];
    if (prev && !/\s$/.test(prev.s) && !/^[\s.,;:)%!?]/.test(it.s) && (Math.abs(prev.y - it.y) > H * 0.5 || it.x - (prev.x + prev.w) > H * 0.12)) out += ' ';
    out += it.s;
  });
  return out.replace(/\s+/g, ' ').trim();
}

// One page: items -> {kind, recs, paras}
function layoutPage(items) {
  items = items.filter(i => i.s.trim());
  if (!items.length) return { kind: 'text', recs: [], paras: [] };
  const hs = items.map(i => i.h).filter(h => h > 0).sort((a, b) => a - b), H = hs[hs.length >> 1] || 8;
  const sorted = items.slice().sort((a, b) => b.y - a.y || a.x - b.x), lines = [];
  for (const it of sorted) { const L = lines[lines.length - 1]; if (L && Math.abs(L.y - it.y) <= H * 0.5) L.items.push(it); else lines.push({ y: it.y, items: [it] }); }
  lines.forEach(L => L.items.sort((a, b) => a.x - b.x));
  // group lines into blocks by vertical gap (used for ordinary text)
  const groups = []; let g = null;
  lines.forEach((L, k) => { if (!g || lines[k - 1].y - L.y > H * 2) { g = { lines: [] }; groups.push(g); } g.lines.push(L); });
  // table detection: lines that start with a row number
  const isIdx = L => L.items.length > 1 && /^\d{1,3}$/.test(L.items[0].s.trim()) && L.items[1].x - (L.items[0].x + L.items[0].w) < H * 4;
  const idxLines = lines.filter(isIdx);
  if (idxLines.length >= 6) {
    const firstY = idxLines[0].y;
    const headerItems = lines.filter(L => L.y > firstY + H * 2.3).flatMap(L => L.items);
    const cells = [];
    idxLines.forEach((L, gi) => L.items.forEach((it, k) => { if (k > 0 && NUMRE.test(it.s.trim())) cells.push({ c: it.x + it.w / 2, gi, it }); }));
    cells.sort((a, b) => a.c - b.c);
    const cols = []; cells.forEach(cl => { const k = cols[cols.length - 1]; if (k && Math.abs(cl.c - k.mean) <= 6) { k.cells.push(cl); k.mean = k.cells.reduce((a, x) => a + x.c, 0) / k.cells.length; } else cols.push({ mean: cl.c, cells: [cl] }); });
    const need = Math.max(3, Math.round(idxLines.length * 0.35));
    const keep = cols.filter(k => new Set(k.cells.map(x => x.gi)).size >= need);
    keep.forEach(k => { k.head = []; });
    const isHead = new Set();
    headerItems.forEach(it => { const c = it.x + it.w / 2; let best = null, bd = 22; keep.forEach(k => { const d = Math.abs(c - k.mean); if (d < bd) { bd = d; best = k; } }); if (best) { best.head.push(it); isHead.add(it); } });
    keep.forEach(k => { k.label = joinItems(k.head.sort((a, b) => b.y - a.y || a.x - b.x), H).split(/[,(]/)[0].trim(); });
    const recsBy = idxLines.map(L => ({ idxLine: L, lines: [], section: '' }));
    let section = '';
    // last plain text line above the table (no column header cells on it) can be the first section title
    lines.filter(L => L.y > firstY + H * 2.3 && !L.items.some(i => isHead.has(i))).forEach(L => { const tx = joinItems(L.items, H); if (tx.length > 8 && tx.length <= 120 && !/^\d/.test(tx)) section = tx; });
    const lastTitleY = null;
    lines.forEach(L => {
      if (L.y > firstY + H * 2.3) return;
      let best = null, bd = 1e9; recsBy.forEach(r => { const d = Math.abs(r.idxLine.y - L.y); if (d < bd) { bd = d; best = r; } });
      if (bd <= H * 1.6) { if (!best.lines.length) best.section = section; best.lines.push(L); }
      else { const tx = joinItems(L.items, H); if (tx.length > 2 && tx.length <= 120) section = tx; }
    });
    const recs = [];
    recsBy.forEach(r => {
      const vals = [], nameIts = [];
      r.lines.forEach(L => L.items.forEach(it => {
        if (it === r.idxLine.items[0]) return;
        const c = it.x + it.w / 2, col = NUMRE.test(it.s.trim()) ? keep.find(k => Math.abs(c - k.mean) <= 6) : null;
        if (col) vals.push([col, it.s.trim()]); else nameIts.push(it);
      }));
      const name = joinItems(nameIts, H); if (!name) return;
      const cellsTxt = keep.map(k => { const v = vals.find(x => x[0] === k); return v && v[1] ? `${k.label || ('#' + (keep.indexOf(k) + 1))}: ${v[1]}` : ''; }).filter(Boolean);
      recs.push((r.section ? r.section + ' — ' : '') + [name, ...cellsTxt].join(' | '));
    });
    if (recs.length >= 6) return { kind: 'table', recs, paras: [] };
  }
  const paras = [];
  groups.forEach(gr => {
    const segs = gr.lines.map(L => { const out = []; let cur = []; L.items.forEach((it, k) => { const prev = L.items[k - 1]; if (prev && it.x - (prev.x + prev.w) > H * 3) { out.push(cur); cur = []; } cur.push(it); }); out.push(cur); return out; });
    if (segs.every(sg => sg.length === 1)) { const tx = joinItems(gr.lines.flatMap(L => L.items), H); if (tx.length > 1) paras.push(tx); return; }
    const cl = []; // columns by x start
    segs.forEach(sg => sg.forEach(items => { const x = items[0].x; let c = cl.find(k => Math.abs(k.x - x) <= 14); if (!c) { c = { x, parts: [] }; cl.push(c); } c.parts.push(items); }));
    cl.sort((a, b) => a.x - b.x).forEach(c => { const tx = joinItems(c.parts.flat(), H); if (tx.length > 1) paras.push(tx); });
  });
  const isStat = x => /^[\d+%\s]{1,8}$/.test(x) && /\d/.test(x);
  for (let i = 0; i < paras.length; i++) {
    if (!isStat(paras[i])) continue;
    let j = i; while (j < paras.length && isStat(paras[j])) j++;
    const n = j - i, lab = []; for (let k = j; k < paras.length && lab.length < n && !isStat(paras[k]) && paras[k].length < 45; k++) lab.push(k);
    if (lab.length === n) { for (let k = 0; k < n; k++) { paras[lab[k]] = paras[i + k].trim() + ' ' + paras[lab[k]]; paras[i + k] = ''; } }
    i = j - 1;
  }
  return { kind: 'text', recs: [], paras: paras.filter(Boolean) };
}

async function pdfExtract(buf) {
  const lib = await pdfjsLoad();
  const doc = await lib.getDocument({ data: new Uint8Array(buf), verbosity: 0, isEvalSupported: false, useSystemFonts: false }).promise;
  const pages = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const tc = await (await doc.getPage(n)).getTextContent();
    pages.push(Object.assign({ n }, layoutPage(tc.items.map(i => ({ s: i.str, x: i.transform[4], y: i.transform[5], w: i.width, h: Math.abs(i.height || i.transform[3] || 0) })))));
  }
  return { pages, pageCount: doc.numPages };
}
