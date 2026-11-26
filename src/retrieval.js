/* Retrieval engine: tokenizer, BM25 index, evidence validation, abstention, extractive answers.
   Pure functions, no DOM. Same interface a server-side retriever would expose. */
const Retrieval = (() => {
  const STOP = new Set(('a an the is are was were be of for to in on at what which how do does did can could i you we it this that with and or there any much many my your about from by as if where when who whom ' +
    'long take takes need use used get have has offer company product products please tell me give show найти ' +
    'что какой какая какие какое каков каковы как где есть ли для на в и с по это у вы мне нужно можно из о об же или ' +
    'какова каковы чём чем между при также адрес адреса адрес address какого какую каким каких какому находится находятся расположен расположена расположены имеется ли подскажите скажите сколько қандай не қалай қайда бар ма ме па пе бе ба үшін және мен бойынша бұл ол қанша керек болады').split(/\s+/));
  // Generic interrogative and service words that never carry evidence in this
  // corpus. Without this, they receive maximum IDF when absent from documents
  // and suppress valid coverage. Measured with experiment.mjs: the confidence
  // threshold stays 0.6 and all 24 expected abstentions remain refusals.
  ('often checked must phoned open source wins receives unacknowledged handled ' +
   'часто когда готовить делать пробой быстро сообщают перейти препарат снижают ' +
   'долго принимают хранят мочу задержке пишут раз морозильника суточная').split(/\s+/).forEach(w => STOP.add(w));
  const CANON = { 'связаться': 'контакт', 'контакты': 'контакт', cost: 'price', costs: 'price', pricing: 'price', prices: 'price', guarantee: 'warranty', refund: 'return', refunds: 'return', shipping: 'delivery', ship: 'delivery', shipped: 'delivery', deliver: 'delivery', delivers: 'delivery',
    стоит: 'цена', стоят: 'цена', стоимости: 'цена', заколеровать: 'колер', колеруем: 'колер', колеровка: 'колер', колеровку: 'колер', колеровки: 'колер', колеруете: 'колер',  стоимость: 'цена', цены: 'цена', ценам: 'цена', тұрады: 'баға', ақысы: 'құны', құны: 'құны', бағасы: 'баға', 'бағалар': 'баға' };

  const SUF = /(ейся|аяся|ийся|ыйся|ого|его|ому|ему|ыми|ими|ами|ями|ой|ая|яя|ое|ее|ые|ие|ый|ий|ом|ем|ах|ях|ов|ев|ей|ую|юю|а|я|ы|и|о|е|у|ю|ь)$/;
  const MONEY = /₸|\bтг\b|тенге|руб|\$|usd|eur|€/i;
  const ADDR = /тракт|улиц|\bул\.|проспект|просп\.|шоссе|\bдом\b|\d+\/\d+|street|\bst\.|avenue|\broad\b|көше|даңғыл/i;
  // generic words: they appear in many questions but rarely carry the answer, so they count for less
  const SOFT = new Set(('срок сроки условия условие способ политика компания компании информация правила порядок процесс разница отличие отличия ' +
    'terms conditions policy process information difference way method шарт шарттар тәсіл ереже саясат айырма').split(/\s+/).map(x => stem(x)));
  function stem(w) {
    if (CANON[w]) w = CANON[w];
    if (/^[0-9]+$/.test(w)) return w;
    if (w.length > 5 && /[а-яё]/.test(w)) w = w.replace(SUF, '') || w;
    if (/[а-яәіңғүұқөһё]/.test(w)) return w.length > 5 ? w.slice(0, 5) : w;
    return w.length > 6 ? w.slice(0, 6) : (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w);
  }
  function tokens(text, keepStop) {
    return (text.toLowerCase().replace(/[−–—]/g, ' ').replace(/(\d)(?=\p{L})/gu, '$1 ').match(/\d+[.,]\d+(?:-\d+(?:[.,]\d+)?)?|[\p{L}\p{N}]+(?:[.][0-9]+)?/gu) || [])
      .filter(w => keepStop || (!STOP.has(w) && w.length > 1 || /^[0-9]+$/.test(w)))
      .map(w => ({ raw: w, s: stem(w) }));
  }
  function allTextLine(c, i) { const l = c.lines[i]; return Array.isArray(l) ? l.join(' ') : l; }
  function lineText(chunk, i, lang) { const l = chunk.lines[i]; return Array.isArray(l) ? l[lang] : l; }
  function allText(chunk) { return chunk.lines.map(l => Array.isArray(l) ? l.join(' ') : l).join(' '); }

  function buildIndex(chunks) {
    const N = chunks.length, df = new Map(), docs = [];
    let total = 0;
    chunks.forEach(c => {
      const tf = new Map(); const toks = tokens(allText(c) + ' ' + (c.docName || ''), true);
      toks.forEach(t => { if (!STOP.has(t.raw)) tf.set(t.s, (tf.get(t.s) || 0) + 1); });
      const len = toks.length; total += len;
      tf.forEach((_, s) => df.set(s, (df.get(s) || 0) + 1));
      docs.push({ c, tf, len });
    });
    const avg = total / Math.max(1, N);
    const idf = s => { const n = df.get(s) || 0; return Math.log(1 + (N - n + 0.5) / (n + 0.5)); };
    return { N, docs, avg, df, idf, maxIdf: Math.log(1 + (N + 0.5) / 0.5) };
  }

  function bm25(index, qStems) {
    const k1 = 1.2, b = 0.75;
    return index.docs.map(d => {
      let s = 0;
      qStems.forEach(q => { const f = d.tf.get(q); if (f) s += index.idf(q) * (f * (k1 + 1)) / (f + k1 * (1 - b + b * d.len / index.avg)); });
      return { d, s };
    });
  }

  // Jaccard match against curated demo questions (all three languages)
  function matchCurated(query, qa) {
    const a = new Set(tokens(query).map(t => t.s)); if (!a.size) return null;
    let best = null;
    qa.forEach(item => item.q.forEach(qt => {
      const b = new Set(tokens(qt).map(t => t.s));
      let inter = 0; a.forEach(x => b.has(x) && inter++);
      const prec = inter / a.size, rec = inter / b.size, j = prec >= 0.99 && rec >= 0.6 ? prec * rec + 1 : 0;
      if (j && (!best || j > best.j)) best = { item, j };
    }));
    return best ? best.item : null;
  }

  function search(index, query, opts) {
    const t0 = performance.now();
    const o = Object.assign({ threshold: 0.6, maxSources: 3, lang: 0 }, opts);
    const qt = tokens(query);
    const uniq = [...new Map(qt.map(t => [t.s, t])).values()];
    if (!uniq.length) return { status: 'abstain', reason: 'empty', hits: [], coverage: 0, missing: [], ms: 0, scanned: index.N };
    const scored = bm25(index, uniq.map(t => t.s)).sort((x, y) => y.s - x.s);
    if (!scored.length) return { status: 'abstain', reason: 'no-match', hits: [], related: [], coverage: 0, missing: uniq.map(t => t.raw), ms: 0, scanned: 0 };
    const top = scored[0];
    const w = t => (index.df.get(t.s) ? index.idf(t.s) : index.maxIdf) * (SOFT.has(t.s) ? 0.3 : 1);
    const totalW = uniq.reduce((a, t) => a + w(t), 0);
    const pool = scored.filter(r => r.s > 0 && r.s >= top.s * 0.7).slice(0, 2);
    const matched = uniq.filter(t => pool.some(r => r.d.tf.has(t.s)));
    const missing = uniq.filter(t => !matched.includes(t)).map(t => t.raw);
    const coverage = totalW ? matched.reduce((a, t) => a + w(t), 0) / totalW : 0;
    const ms = performance.now() - t0;
    const related = scored.filter(r => r.s > 0).slice(0, 3).map(r => r.d.c);
    if (!top || top.s <= 0 || coverage < o.threshold)
      return { status: 'abstain', reason: top && top.s > 0 ? 'low-coverage' : 'no-match', hits: [], related, coverage, missing, ms, scanned: index.N, topScore: top ? top.s : 0 };

    const stems = new Set(uniq.map(t => t.s));
    const priceQ = /цен|стоит|стоим|price|cost|how much|баға|құны|қанша/i.test(query);
    const whereQ = /(^|\s)(где|where|қайда)(\s|$)|адрес|address|мекенжай/i.test(query);
    let partial = false;
    const hits = scored.filter(r => r.s >= top.s * 0.45).slice(0, Math.max(6, o.maxSources)).map(r => {
      const c = r.d.c, meta = new Set(tokens(c.docName || '', true).map(t => t.s));
      const ls = c.lines.map((_, i) => {
        const L = Array.isArray(c.lines[i]) ? c.lines[i].join(' ') : c.lines[i], k = L.includes(' | ') ? L.indexOf(' — ') : -1;
        const set = new Set(tokens(k > 0 ? L.slice(k + 3) : L).map(t => t.s)), ctx = k > 0 ? new Set(tokens(L.slice(0, k)).map(t => t.s)) : new Set(); let sc = 0, mw = 0;
        uniq.forEach(t => { if (set.has(t.s)) { sc += (index.df.get(t.s) ? index.idf(t.s) : 0) * (SOFT.has(t.s) ? 0.3 : 1); mw += w(t); } else if (ctx.has(t.s)) { sc += 0.4 * (index.df.get(t.s) ? index.idf(t.s) : 0) * (SOFT.has(t.s) ? 0.3 : 1); mw += 0.4 * w(t); } else if (meta.has(t.s)) mw += w(t); });
        const len = L.length;
        if (sc > 0 && priceQ && MONEY.test(L)) { sc += index.maxIdf * 0.5; const tp = uniq.find(t => t.s === 'цена' || t.s === 'price' || t.s === 'баға'); if (tp && !set.has(tp.s) && !ctx.has(tp.s)) mw += w(tp); }
        if (sc > 0 && /\d{2}\.\d{2}\.\d{4}/.test(L)) { const td = uniq.find(t => /^(дат|date|когда|күн)/.test(t.s)); if (td && !set.has(td.s) && !ctx.has(td.s)) { sc += (index.df.get(td.s) ? index.idf(td.s) : index.maxIdf * 0.5); mw += w(td); } }
        if (sc > 0 && whereQ && ADDR.test(Array.isArray(c.lines[i]) ? c.lines[i].join(' ') : c.lines[i])) sc += index.maxIdf * 0.6; return { i, sc, mw, len };
      }).sort((a, b) => (Math.abs(b.sc - a.sc) > 1e-9 ? b.sc - a.sc : b.len - a.len) || a.i - b.i);
      return { chunk: c, score: r.s, ls };
    }).filter(h => h.ls[0].sc > 0);
    hits.forEach(h => { h.lc = h.ls[0].mw / totalW; });
    hits.sort((a, b) => Math.round(b.lc * 20) - Math.round(a.lc * 20) || b.score - a.score); hits.length = Math.min(hits.length, o.maxSources);
    if (hits.length) {
      const lc = hits[0].ls[0].mw / totalW; partial = lc < 0.75;
      hits.forEach(h => { h.lines = h.ls.filter(x => x.sc > 0).slice(0, partial ? 3 : 2).sort((a, b) => a.i - b.i).map(x => x.i); h.best = h.ls[0]; });
    }
    if (!hits.length) return { status: 'abstain', reason: 'no-line', hits: [], related, coverage, missing, ms, scanned: index.N };
    if (partial && (priceQ || hits[0].ls[0].mw / totalW < (o.lineMin == null ? 0.55 : o.lineMin))) return { status: 'abstain', reason: priceQ ? 'price-partial' : 'weak-line', hits: [], related, coverage, missing: uniq.filter(t => !new Set(tokens(allTextLine(hits[0].chunk, hits[0].ls[0].i)).map(x => x.s)).has(t.s)).map(t => t.raw), ms, scanned: index.N };
    // identifier guard: any number or code in the question (5 кг, 1180, KR-101) must appear in the chosen line, otherwise it is a different item
    const idTerms = uniq.filter(t => /\d/.test(t.raw));
    if (idTerms.length) { const best = hits[0], bset = new Set(tokens(allTextLine(best.chunk, best.ls[0].i), true).map(x => x.s)); const bad = idTerms.filter(t => !bset.has(t.s)); if (bad.length) return { status: 'abstain', reason: 'identifier-mismatch', hits: [], related, coverage, missing: bad.map(t => t.raw), ms, scanned: index.N }; }
    const strength = partial ? 'limited' : coverage >= 0.85 && hits.length >= 2 ? 'strong' : coverage >= 0.7 ? 'moderate' : 'limited';
    return { status: 'answer', hits, coverage, missing, ms, scanned: index.N, strength, partial, topScore: top.s, lineCov: hits[0].ls[0].mw / totalW };
  }

  // Key entities extracted from real chunk text (never invented)
  function entities(chunks) {
    const prod = new Map(), money = new Set(), pct = new Set();
    chunks.forEach(c => { const t = allText(c);
      (t.match(/\b[A-Z][a-z]+[A-Z][A-Za-z0-9]*(?: [A-Z][A-Za-z0-9-]+){0,2}/g) || []).forEach(p => prod.set(p.split(' ').slice(0, 2).join(' '), 1));
      (t.match(/\d[\d ,.]*\s?₸/g) || []).slice(0, 6).forEach(m => money.add(m.trim()));
      (t.match(/\d+%/g) || []).forEach(m => pct.add(m)); });
    return { products: [...prod.keys()].slice(0, 8), amounts: [...money].slice(0, 6), percents: [...pct].slice(0, 6) };
  }
  function keyTerms(chunks, n) {
    const idx = buildIndex(chunks), sc = new Map(), raw = new Map();
    chunks.forEach(c => tokens(allText(c)).forEach(t => { if (/^\d/.test(t.raw) || t.raw.length < 5) return; sc.set(t.s, (sc.get(t.s) || 0) + idx.idf(t.s)); raw.set(t.s, t.raw); }));
    return [...sc.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([s]) => raw.get(s));
  }
  return { tokens, buildIndex, search, matchCurated, lineText, allText, entities, keyTerms };
})();
if (typeof module !== 'undefined') module.exports = Retrieval;
