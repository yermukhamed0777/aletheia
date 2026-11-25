/* Views: pure render functions returning HTML strings. */
const VIEW = { route: '/', thread: [], drawer: null, qs: null, tour: null, ob: null, libQ: '', libType: 'all', libStatus: 'all', gapTab: 'open', navOpen: false, lp: 0, confirm: null };
const LOGO = `<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="var(--ink)"/><path d="M11 8H9.5a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 9.5 24H11M21 8h1.5A1.5 1.5 0 0 1 24 9.5v13a1.5 1.5 0 0 1-1.5 1.5H21" fill="none" stroke="var(--bg)" stroke-width="2" stroke-linecap="round"/><path d="m12.5 16.2 2.6 2.6 4.6-5.4" fill="none" stroke="var(--mark)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const logo = href => `<a class="logo" href="${href}" aria-label="${esc(t('app.name'))}">${LOGO}<span>${esc(t('app.name'))}</span></a>`;
const langSw = () => `<div class="langsw" role="group" aria-label="${esc(t('lang.label'))}">${LANGS.map((l, i) => `<button data-act="lang" data-i="${i}" aria-pressed="${i === LANG}" title="${l[2]}" lang="${l[0]}">${l[1]}</button>`).join('')}</div>`;
const ficonS = type => `<span class="ficon xs ${esc(type)}" aria-hidden="true">${ic('file', 'sm')}</span>`;
const ficon = type => `<span class="ficon ${esc(type)}" aria-hidden="true">${esc(type.toUpperCase().slice(0, 4))}</span>`;
const questionText = qa => pick(qa.q);
const qaById = id => CORPUS.QA.find(q => q.id === id);
const topicName = id => id === 'other' ? t('gap.other') : pick(CORPUS.TOPICS.find(x => x.id === id)?.n || [id, id, id]);

function hlLines(ev, only) {
  return ev.chunk.lines.map((_, i) => ({ i, tx: lt(ev.chunk, i), on: ev.lines.includes(i) })).filter(l => !only || l.on)
    .map(l => l.on ? `<mark class="hl">${esc(l.tx)}</mark>` : esc(l.tx)).join(only ? ' … ' : ' ');
}
function strengthMeter(s) {
  const n = s === 'strong' ? 3 : s === 'moderate' ? 2 : 1;
  return `<span class="row" style="gap:8px" title="${esc(t('ev.hint'))}"><span class="strength s${n} ${n === 1 ? 'warnc' : ''}"><i></i><i></i><i></i></span><b>${esc(t('ev.' + s))}</b></span>`;
}
function shortRecord(d, q) {
  if (!q || !d.includes(' | ')) return d;
  const parts = d.split(' | ').map(p => { const k = p.indexOf(': '); return k > 0 && k < 40 ? [p.slice(0, k), p.slice(k + 2)] : [null, p]; });
  const ql = q.toLowerCase(), qs = new Set(ql.split(/[^\p{L}\d]+/u).filter(w => w.length > 3).map(w => w.slice(0, 5)));
  const priceQ = /цен|стои|стоим|price|cost|баға|құн/.test(ql);
  const isName = p => p[0] === null || /наимен|назван|name|товар|продукт|артикул/i.test(p[0]);
  const names = parts.filter(isName).map(p => p[0] ? p[1] : p[1]).join(' · '), fields = parts.filter(p => !isName(p));
  const pick2 = fields.filter(([l]) => (priceQ && /цен|розниц|стоим|price|баға|құн/i.test(l)) || l.toLowerCase().split(/[^\p{L}\d]+/u).some(w => w.length > 3 && qs.has(w.slice(0, 5))));
  if (!pick2.length || !names) return d;
  const nm = names.includes(' — ') ? names.split(' — ').slice(1).join(' — ') : names;
  return nm + ' — ' + pick2.map(([l, v]) => l + ': ' + v).join('; ');
}
function composeDirect(r) {
  if (r.kind === 'curated') { const q = r.qa; return { direct: pick(q.direct), details: q.details.map(pick) }; }
  if (r.kind === 'extractive') {
    const h0 = r.hits[0], best = h0.best.i, d = shortRecord(lt(h0.chunk, best), r.q);
    const more = []; r.hits.forEach(h => h.lines.forEach(i => { if (!(h === h0 && i === best) && more.length < 2) more.push(lt(h.chunk, i)); }));
    return { direct: d, details: more };
  }
  if (r.kind === 'remote') return { direct: r.direct, details: r.details || [] };
  return { direct: '', details: [] };
}
function plainAnswer(turn) {
  const r = turn.result, c = composeDirect(r);
  if (r.kind === 'abstain') return `${turn.q}\n\n${t('abst.title')}\n${r.qa ? pick(r.qa.why) : t('abst.generic')}`;
  return `${turn.q}\n\n${c.direct}\n${c.details.map(d => '• ' + d).join('\n')}\n\n${t('ev.title')}:\n${r.evidence.map((e, i) => `[${i + 1}] ${citeStr(e.chunk)}`).join('\n')}`;
}

/* ---------- assistant turn ---------- */
function turnView(turn) {
  const r = turn.result, q = `<div class="q-turn"><span class="badge info" style="margin-top:3px">${esc(t('you'))}</span><h2 class="qb">${esc(turn.q)}</h2></div>`;
  if (turn.state === 'loading') {
    const labels = [t('step.search', docList().filter(d => d.status === 'processed').length, INDEX.N), t('step.rank'), t('step.check'), t('step.compose')];
    return `<section data-turn="${turn.id}" aria-busy="true">${q}<div class="ans" style="margin-top:12px"><div class="steps" role="status">${labels.map((l, i) => `<div class="s ${i < turn.step ? 'done' : i === turn.step ? 'act' : ''}"><span class="dot">${i < turn.step ? ic('check', 'sm') : ''}</span>${esc(l)}</div>`).join('')}</div></div></section>`;
  }
  if (turn.state === 'error') return `<section data-turn="${turn.id}">${q}<div class="ans abst" style="margin-top:12px"><div class="ans-b"><div class="callout warn" style="margin:0">${ic('warn')}<div><b>${esc(t('err.remote'))}</b><div>${esc(turn.error || '')}</div></div></div></div></section>`;
  const abst = r.kind === 'abstain', fb = STATE.feedback[turn.id];
  const prov = r.kind === 'curated' ? t('prov.curated') : r.kind === 'extractive' ? t('prov.extractive') : r.kind === 'remote' ? t('prov.remote') : '';
  let body = '';
  if (abst) {
    const rel = (r.related || []).map(id => docById(id)).filter(Boolean);
    body = `<div class="ans-b"><div class="row" style="align-items:flex-start;gap:12px"><span style="color:var(--warn);margin-top:3px">${ic('warn', 'lg')}</span><div>
      <p class="direct">${esc(t('abst.title'))}</p>
      <p class="dim" style="margin-top:8px">${esc(r.qa ? pick(r.qa.why) : (r.missing && r.missing.length ? t('abst.terms', r.missing.slice(0, 4).join(', ')) : t('abst.generic')))}</p>
      <ul class="det"><li>${esc(r.qa ? pick(r.qa.missing) : t('abst.missing'))}</li><li>${esc(t('abst.rule'))}</li>${r.sem ? `<li>${esc(t('abst.sem', Math.round(r.sem.sim * 100) + '%', Math.round(r.sem.thr * 100) + '%'))}</li>` : ''}</ul></div></div>
      ${rel.length ? `<div class="ev"><div class="eyebrow">${esc(t('abst.related'))}</div><div class="row wrap" style="margin-top:8px">${rel.map(d => `<button class="chip" data-act="doc" data-id="${esc(d.id)}">${ficonS(d.type)}${esc(d.name)}</button>`).join('')}</div></div>` : ''}
      <div class="callout info">${ic('gap')}<div>${esc(t('abst.logged'))} <a href="#gaps" style="font-weight:600">${esc(t('nav.gaps'))}</a></div></div></div>`;
  } else {
    const c = composeDirect(r), cites = r.evidence.map((e, i) => `<button class="cite" data-act="src" data-turn="${turn.id}" data-i="${i}" aria-label="${esc(t('src.open', i + 1))}">${i + 1}</button>`).join('');
    let cmp = '';
    if (r.conflict) { const a = r.conflict.a, b = r.conflict.b, ca = chunkById(a[0]), cb = chunkById(b[0]), cr = chunkById(r.conflict.rule[0]);
      if (ca && cb && cr) cmp = `<div class="callout warn">${ic('cols')}<div><b>${esc(pick(r.conflict.note))}</b> — ${esc(t('cmp.rule'))}</div></div><div class="cmp">
        <div class="win"><div class="eyebrow" style="color:var(--accent)">${esc(t('cmp.used'))}</div><div style="margin:4px 0"><mark class="hl">${esc(lt(ca, a[1]))}</mark></div><div class="muted mono">${esc(citeStr(ca))}</div></div>
        <div><div class="eyebrow">${esc(t('cmp.older'))}</div><div style="margin:4px 0">${esc(lt(cb, b[1]))}</div><div class="muted mono">${esc(citeStr(cb))}</div></div></div>
        <div class="muted" style="font-size:12px;margin-top:8px">${ic('info', 'sm')} ${esc(t('cmp.why'))} <i>${esc(citeStr(cr))}</i></div>`; }
    const part = r.semantic ? `<div class="callout warn">${ic('warn')}<div><b>${esc(t('ans.sem'))}</b> ${esc(t('ans.sem.d', Math.round(r.sem.sim * 100) + '%'))}</div></div>` : r.partial ? `<div class="callout warn">${ic('warn')}<div><b>${esc(t('ans.partial'))}</b> ${esc(t('ans.partial.d'))}</div></div>` : '';
    body = `<div class="ans-b">${part}<p class="direct" ${r.partial ? 'style="margin-top:12px"' : ''}>${esc(c.direct)}${cites}</p>
      <div class="srcline"><span class="eyebrow">${esc(t('ans.source'))}</span>${[...new Map(r.evidence.map((e, i) => [e.chunk.doc, i])).entries()].map(([id, i]) => { const d = docById(id); return d ? `<button class="chip" style="height:26px;font-size:12px" data-act="src" data-turn="${turn.id}" data-i="${i}">${ficonS(d.type)}<b>${esc(d.name)}</b><span class="muted">${esc(locLabel(r.evidence[i].chunk.loc))}</span></button>` : ''; }).join('')}</div>${c.details.length ? `<ul class="det">${c.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}${cmp}
      <div class="ev"><div class="eyebrow">${esc(t('ev.title'))} · ${r.evidence.length}</div>${r.evidence.map((e, i) => { const d = docById(e.chunk.doc); return `<button class="ev-card" data-act="src" data-turn="${turn.id}" data-i="${i}"><span class="ev-n">${i + 1}</span>
        <span class="ev-t">${ficonS(d.type)}<b>${esc(d.name)}</b><span class="badge">${esc(locLabel(e.chunk.loc))}</span></span><span class="muted" style="font-size:12px;align-self:center">${ic('eye', 'sm')}</span><span class="ev-x">${hlLines(e, true)}</span></button>`; }).join('')}</div></div>`;
  }
  let how = '';
  if (STATE.settings.details) how = `<details class="how"><summary>${ic('layers', 'sm')} ${esc(t('how.title'))}</summary><div class="kv">
    <b>${esc(t('how.mode'))}</b><span>${esc(r.kind === 'curated' ? t('how.curated') : r.kind === 'remote' ? t('prov.remote') : t('how.live'))}</span>
    <b>${esc(t('how.scanned'))}</b><span>${r.scanned ?? '—'} ${esc(t('chunks'))}</span>
    <b>${esc(t('how.cover'))}</b><span>${abst ? Math.round((r.coverage || 0) * 100) + '% < ' + Math.round(STATE.settings.threshold * 100) + '%' : r.kind === 'curated' ? '100%' : Math.round(r.coverage * 100) + '% ≥ ' + Math.round((r.semantic ? STATE.settings.semThr : STATE.settings.threshold) * 100) + '%'}</span>
    <b>${esc(t('how.time'))}</b><span>${(r.ms ?? 0).toFixed(1)} ms</span></div></details>`;
  const follows = abst ? [] : (r.kind === 'curated' ? r.qa.follow : CORPUS.QA.filter(x => !x.abstain && x.topic === r.topic && x.id !== r.qa?.id).map(x => x.id)).slice(0, 3);
  return `<section data-turn="${turn.id}">${q}<article class="ans ${abst ? 'abst' : ''}" style="margin-top:12px" aria-label="${esc(t('ans.label'))}">
    <div class="ans-h">${abst ? `<span class="badge warn">${ic('warn', 'sm')} ${esc(t('abst.badge'))}</span>` : `<span class="badge ok">${ic('check', 'sm')} ${esc(t('ans.verified', r.evidence.length))}</span>${strengthMeter(r.strength)}`}<span class="grow"></span>${prov ? `<span class="muted">${esc(prov)}</span>` : ''}</div>
    ${body}${how ? `<div style="padding:0 18px 14px">${how}</div>` : ''}
    <div class="ans-f"><button class="btn sm ghost" data-act="copy" data-turn="${turn.id}">${ic('copy', 'sm')}${esc(t('act.copy'))}</button>
      ${abst ? '' : `<button class="btn sm ghost" data-act="copycite" data-turn="${turn.id}">${ic('link', 'sm')}${esc(t('act.cite'))}</button>`}
      <button class="btn sm ghost" data-act="share" data-turn="${turn.id}">${ic('share', 'sm')}${esc(t('act.share'))}</button><span class="grow"></span>
      <button class="btn sm ghost icon ${fb === 'up' ? 'on' : ''}" data-act="fb" data-v="up" data-turn="${turn.id}" aria-pressed="${fb === 'up'}" title="${esc(t('fb.up'))}" aria-label="${esc(t('fb.up'))}">${ic('up', 'sm')}</button>
      <button class="btn sm ghost icon ${fb === 'down' ? 'on' : ''}" data-act="fb" data-v="down" data-turn="${turn.id}" aria-pressed="${fb === 'down'}" title="${esc(t('fb.down'))}" aria-label="${esc(t('fb.down'))}">${ic('down', 'sm')}</button>
      <button class="btn sm ghost ${fb === 'report' ? 'on' : ''}" data-act="fb" data-v="report" data-turn="${turn.id}">${ic('flag', 'sm')}${esc(t('fb.report'))}</button></div></article>
    ${follows.length || abst ? `<div style="margin-top:12px"><div class="eyebrow" style="margin-bottom:6px">${esc(t('follow.title'))}</div><div class="row wrap">${abst ? `<button class="chip" data-act="goto" data-r="/app/docs">${ic('upload', 'sm')}${esc(t('abst.add'))}</button><button class="chip" data-act="ask" data-q="d-metformin" data-qa="d-metformin">${esc(t('abst.try'))}</button>` : follows.map(id => `<button class="chip" data-act="ask" data-qa="${id}" data-q="${esc(questionText(qaById(id)))}">${ic('arrow', 'sm')}${esc(questionText(qaById(id)))}</button>`).join('')}</div></div>` : ''}</section>`;
}

const SUGGEST = ['d-metformin', 'h-serum', 'i-renal', 's-cold-2-8', 'p-shelf', 'x-pediatric'];
function composer(id, big) {
  return `<form class="composer" data-form="ask" role="search"><span class="muted">${ic('search', 'lg')}</span><label class="sr" for="${id}">${esc(t('ask.label'))}</label>
    <input id="${id}" name="q" autocomplete="off" placeholder="${esc(t('ask.ph'))}" ${big ? 'autofocus' : ''}><button class="btn primary ${big ? 'lg' : ''}" type="submit">${esc(t('ask.btn'))} ${ic('arrow', 'sm')}</button></form>`;
}
function sugChips() {
  if (STATE.settings.useDemo) return suggestChips(SUGGEST);
  const g = genSuggestions();
  return g.length ? g.map(q => `<button class="chip" data-act="ask" data-qa="" data-q="${esc(q)}">${esc(q)}</button>`).join('') : `<button class="chip" data-act="goto" data-r="/app/docs">${ic('upload', 'sm')}${esc(t('abst.add'))}</button>`;
}
function suggestChips(ids) { return ids.map(id => `<button class="chip" data-act="ask" data-qa="${id}" data-q="${esc(questionText(qaById(id)))}">${esc(questionText(qaById(id)))}</button>`).join(''); }

function assistantView() {
  if (!VIEW.thread.length) {
    const groups = [['dosage', ['d-metformin', 'd-vanco', 'd-infusion']], ['handling', ['h-serum', 'i-renal', 'h-citrate', 'h-urine']], ['storage', ['s-cold-2-8', 's-transport']], ['policy', ['p-shelf', 'p-recall', 'p-report']]];
    if (!STATE.settings.useDemo) return `<div class="page" style="max-width:880px"><div class="page-h"><div><h1>${esc(t('nav.assistant'))}</h1><p>${esc(t('asst.sub'))}</p></div></div>${composer('ask-in', true)}
      <div class="panel" style="margin-top:20px"><div class="hd"><h3>${esc(t('dash.suggested'))}</h3><button class="switch" role="switch" aria-checked="false" aria-label="${esc(t('set.usedemo'))}" data-act="tdemo"></button></div><div class="bd row wrap">${sugChips()}</div><div class="muted" style="padding:0 16px 16px;font-size:12px">${esc(t('set.usedemo.off'))}</div></div></div>`;
    return `<div class="page" style="max-width:880px"><div class="page-h"><div><h1>${esc(t('nav.assistant'))}</h1><p>${esc(t('asst.sub'))}</p></div></div>
      ${composer('ask-in', true)}
      <div class="panel" style="margin-top:20px"><div class="hd"><h3>${esc(t('asst.try'))}</h3><span class="muted">${esc(t('asst.mix'))}</span></div><div class="list">
      ${groups.map(([tp, ids]) => ids.map(id => `<button data-act="ask" data-qa="${id}" data-q="${esc(questionText(qaById(id)))}"><span class="badge" style="min-width:88px;justify-content:center">${esc(topicName(tp))}</span><span class="grow">${esc(questionText(qaById(id)))}</span>${ic('right', 'sm')}</button>`).join('')).join('')}
      <div style="background:var(--warn-soft)"><span class="badge warn" style="min-width:88px;justify-content:center">${esc(t('asst.unans'))}</span><span class="grow" style="display:flex;flex-wrap:wrap;gap:6px">${['x-pediatric', 'x-contrast', 'x-home', 'x-funding', 'x-vet'].map(id => `<button class="chip" style="height:26px;font-size:12px" data-act="ask" data-qa="${id}" data-q="${esc(questionText(qaById(id)))}">${esc(questionText(qaById(id)))}</button>`).join('')}</span></div></div></div></div>`;
  }
  return `<div class="page" style="max-width:880px"><div class="page-h"><div><h1>${esc(t('nav.assistant'))}</h1><p>${esc(t('asst.sub2'))}</p></div><button class="btn sm" data-act="clear">${ic('plus', 'sm')}${esc(t('asst.new'))}</button></div>
    <div class="thread">${VIEW.thread.map(turnView).join('')}</div></div>
    <div class="dock"><div class="dock-in">${composer('ask-in')}</div></div>`;
}

/* ---------- dashboard ---------- */
function stats() {
  const ds = docList(), proc = ds.filter(d => d.status === 'processed').length, hist = STATE.history;
  const live = hist.filter(h => !h.seed);
  const seedSearch = SEED_DAYS.ans.reduce((a, b) => a + b, 0) + SEED_DAYS.gap.reduce((a, b) => a + b, 0);
  const seedGapN = SEED_DAYS.gap.reduce((a, b) => a + b, 0);
  const total = seedSearch + live.length, ans = total - seedGapN - live.filter(h => h.status === 'abstain').length;
  return { docs: ds.length, proc, chunks: INDEX.N, total, ans, rate: total ? ans / total : 0, live };
}
function dashboardView() {
  const st = stats(), ds = docList().slice(0, 5), hist = STATE.history.slice(0, 5), gapsOpen = STATE.gaps.filter(g => g.status === 'open').length;
  const act = [...STATE.history.slice(0, 6).map(h => ({ ts: h.ts, ic: h.status === 'abstain' ? 'warn' : 'check', tx: t(h.status === 'abstain' ? 'act.abst' : 'act.ans', histQ(h)) })),
    ...STATE.uploads.slice(-3).map(u => ({ ts: u.ts, ic: 'upload', tx: t('act.upl', u.name) }))].sort((a, b) => b.ts - a.ts).slice(0, 5);
  return `<div class="page"><div class="ask-hero"><div class="eyebrow">${esc(t('dash.eyebrow'))}</div><h1 style="margin-top:8px">${esc(t('dash.h1a'))} <em>${esc(t('dash.h1b'))}</em></h1>
    <p class="dim" style="margin-top:8px;max-width:46em">${esc(t('dash.sub'))}</p>${composer('dash-in', true)}
    <div class="row wrap" style="margin-top:14px"><span class="eyebrow" style="margin-right:4px">${esc(t('dash.suggested'))}</span>${sugChips()}</div></div>
    <div class="grid2"><div class="col" style="gap:16px">
      <div class="panel"><div class="hd"><h3>${esc(t('dash.recent'))}</h3><a class="muted" href="#analytics">${esc(t('nav.analytics'))} →</a></div><div class="list">${hist.map(h => `<button data-act="ask" data-qa="${h.qa || ''}" data-q="${esc(histQ(h))}"><span style="color:${h.status === 'abstain' ? 'var(--warn)' : 'var(--accent)'}">${ic(h.status === 'abstain' ? 'warn' : 'check', 'sm')}</span><span class="grow">${esc(histQ(h))}</span><span class="muted">${esc(rel(h.ts))}</span></button>`).join('')}</div></div>
      <div class="panel"><div class="hd"><h3>${esc(t('dash.activity'))}</h3></div><div class="list">${act.map(a => `<div><span class="muted">${ic(a.ic, 'sm')}</span><span class="grow">${esc(a.tx)}</span><span class="muted">${esc(rel(a.ts))}</span></div>`).join('')}</div></div></div>
    <div class="col" style="gap:16px">
      <div class="panel"><div class="hd"><h3>${esc(t('dash.status'))}</h3><span class="badge ok">${ic('check', 'sm')} ${esc(t('dash.ready'))}</span></div>
        <div class="stat" style="grid-template-columns:repeat(3,1fr);border:0"><div><b>${st.docs}</b><span>${esc(t('stat.docs'))}</span></div><div><b>${st.proc}</b><span>${esc(t('stat.proc'))}</span></div><div><b>${fmtNum(st.chunks)}</b><span>${esc(t('stat.chunks'))}</span></div></div>
        <div class="stat" style="grid-template-columns:repeat(2,1fr)"><div><b>${fmtNum(st.total)}</b><span>${esc(t('stat.searches'))}</span></div><div><b>${Math.round(st.rate * 100)}%</b><span>${esc(t('stat.rate'))}</span></div></div></div>
      <div class="panel"><div class="hd"><h3>${esc(t('dash.library'))}</h3><a class="muted" href="#docs">${esc(t('dash.all'))} →</a></div><div class="list">${ds.map(d => `<button data-act="doc" data-id="${esc(d.id)}">${ficon(d.type)}<span class="grow" style="min-width:0"><b style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(d.name)}</b><span class="muted" style="font-size:12px">${d.chunks} ${esc(t('chunks'))} · ${fmtSize(d.size)}</span></span>${statusBadge(d)}</button>`).join('')}</div></div>
      <div class="panel"><div class="hd"><h3>${esc(t('crit.title'))}</h3><span class="muted" style="font-size:12px">${esc(t('crit.sub'))}</span></div><div class="list">
        ${[['01', 'crit.1', `data-act="ask" data-qa="${STATE.settings.useDemo ? 'd-metformin' : ''}" data-q="${esc(STATE.settings.useDemo ? questionText(qaById('d-metformin')) : (genSuggestions()[0] || t('crit.idk.q')))}"`],
           ['02', 'crit.2', `data-act="ask" data-qa="${STATE.settings.useDemo ? 'x-pediatric' : ''}" data-q="${esc(STATE.settings.useDemo ? questionText(qaById('x-pediatric')) : t('crit.idk.q'))}"`],
           ['03', 'crit.3', `data-act="qs"`], ['04', 'crit.4', `data-act="tour"`]].map(([w, k, attr]) => `<button ${attr}><span class="badge info" style="min-width:38px;justify-content:center">${w}</span><span class="grow"><b style="display:block">${esc(t(k))}</b><span class="muted" style="font-size:12px">${esc(t(k + '.d'))}</span></span>${ic('play', 'sm')}</button>`).join('')}</div>
        <div class="bd" style="border-top:1px solid var(--line)"><div class="row between"><div><b>${esc(t('set.usedemo'))}</b><div class="muted" style="font-size:12px">${esc(STATE.settings.useDemo ? t('set.usedemo.on') : t('set.usedemo.off'))}</div></div><button class="switch" role="switch" aria-checked="${STATE.settings.useDemo}" aria-label="${esc(t('set.usedemo'))}" data-act="tdemo"></button></div>
        <div class="row wrap" style="margin-top:10px"><a class="btn sm" href="${hashOf('/app/docs')}">${ic('upload', 'sm')}${esc(t('lib.upload'))}</a>${gapsOpen ? `<a href="${hashOf('/app/gaps')}" class="muted" style="font-size:12px">${ic('gap', 'sm')} ${esc(t('dash.gaps', gapsOpen))}</a>` : ''}</div></div></div></div></div></div></div></div>`;
}
const modeT = k => t(STATE.settings.scripted ? 'mode.' + k : 'mode.live.' + k);
function aiStatusText() { const s = Augment.st; return s.status === 'loading' ? t('ai.loading', s.progress) : s.status === 'ready' ? (s.indexing ? t('ai.indexing') : t('ai.ready')) : s.status === 'error' ? t('ai.error') : t('ai.off'); }
function histQ(h) { if (h.q) return h.q; const qa = qaById(h.qa); return qa ? questionText(qa) : ''; }
function statusBadge(d) {
  if (d.status === 'processed') return `<span class="badge ok">${esc(t('st.processed'))}${d.ocr ? ' · OCR' : ''}</span>`;
  if (d.status === 'processing') return `<span class="badge info">${esc(t('st.processing'))} ${d.progress}%</span>`;
  return `<span class="badge bad">${esc(t('st.failed'))}</span>`;
}

/* ---------- library ---------- */
function libraryRows() {
  const q = VIEW.libQ.trim().toLowerCase();
  return docList().filter(d => (VIEW.libType === 'all' || d.type === VIEW.libType) && (VIEW.libStatus === 'all' || d.status === VIEW.libStatus) && (!q || d.name.toLowerCase().includes(q) || docChunks(d.id).some(c => Retrieval.allText(c).toLowerCase().includes(q))));
}
function libTable() {
  const rows = libraryRows();
  if (!rows.length) return `<div class="empty">${ic('file', 'lg')}<h3>${esc(t('lib.empty'))}</h3><p>${esc(t('lib.empty.sub'))}</p></div>`;
  return `<div style="overflow:auto"><table class="tbl"><thead><tr><th>${esc(t('lib.name'))}</th><th class="hide-m">${esc(t('lib.type'))}</th><th class="hide-m">${esc(t('lib.date'))}</th><th>${esc(t('lib.status'))}</th><th class="hide-m">${esc(t('stat.chunks'))}</th><th></th></tr></thead><tbody>
  ${rows.map(d => `<tr><td><button class="row" style="border:0;background:none;padding:0;text-align:left" data-act="doc" data-id="${esc(d.id)}">${ficon(d.type)}<span><b style="display:block">${esc(d.name)}</b><span class="muted" style="font-size:12px">${fmtSize(d.size)}${d.demo ? ' · ' + esc(t('lib.demo')) : ''}</span></span></button></td>
  <td class="hide-m"><span class="badge">${esc(d.type.toUpperCase())}</span></td><td class="hide-m muted">${esc(fmtDate(d.ts))}</td>
  <td>${statusBadge(d)}${d.status === 'processing' ? `<div class="progress" style="width:110px;margin-top:6px"><i style="width:${d.progress}%"></i></div><div class="muted" style="font-size:11px;margin-top:2px">${esc(t('stage.' + d.stage))}</div>` : ''}${d.status === 'failed' ? `<div style="font-size:12px;color:var(--danger);margin-top:4px;max-width:260px">${esc(t('err.' + (d.error || 'parse')))}</div>` : ''}</td>
  <td class="hide-m">${d.status === 'processed' ? d.chunks : '—'}</td>
  <td><div class="row" style="justify-content:flex-end;gap:2px"><button class="btn sm ghost icon" data-act="doc" data-id="${esc(d.id)}" title="${esc(t('lib.view'))}" aria-label="${esc(t('lib.view'))}">${ic('eye', 'sm')}</button>
  ${d.status === 'failed' ? `<button class="btn sm ghost icon" data-act="retry" data-id="${esc(d.id)}" title="${esc(t('lib.retry'))}" aria-label="${esc(t('lib.retry'))}">${ic('refresh', 'sm')}</button>` : ''}
  <button class="btn sm ghost icon danger" data-act="rm" data-id="${esc(d.id)}" title="${esc(t('lib.remove'))}" aria-label="${esc(t('lib.remove'))}">${ic('trash', 'sm')}</button></div></td></tr>`).join('')}</tbody></table></div>`;
}
function libraryView() {
  return `<div class="page"><div class="page-h"><div><h1>${esc(t('nav.docs'))}</h1><p>${esc(t('lib.sub'))}</p></div><div class="row"><label class="row" style="gap:8px;font-size:13px"><span>${esc(t('set.usedemo'))}</span><button class="switch" role="switch" aria-checked="${STATE.settings.useDemo}" aria-label="${esc(t('set.usedemo'))}" data-act="tdemo"></button></label><button class="btn primary" data-act="pick">${ic('upload', 'sm')}${esc(t('lib.upload'))}</button></div></div>
  <input type="file" id="file-in" multiple hidden accept=".pdf,.docx,.txt,.md,.csv,.xlsx,.png,.jpg,.jpeg,.webp">
  <div class="drop" id="drop" tabindex="0" role="button" data-act="pick" aria-label="${esc(t('lib.drop'))}">${ic('upload', 'lg')}<div class="grow"><b>${esc(t('lib.drop'))}</b><div class="muted" style="font-size:12px">${esc(t('lib.formats'))}</div></div><button class="btn sm" data-act="sample" title="${esc(t('lib.sample.d'))}">${ic('plus', 'sm')}${esc(t('lib.sample'))}</button></div>
  <div class="row wrap" style="margin:16px 0 12px"><div style="position:relative;flex:1;min-width:200px;max-width:340px"><label class="sr" for="lib-q">${esc(t('lib.search'))}</label><input id="lib-q" class="input" style="padding-left:34px" placeholder="${esc(t('lib.search'))}" value="${esc(VIEW.libQ)}"><span class="muted" style="position:absolute;left:11px;top:10px">${ic('search', 'sm')}</span></div>
  <div class="seg" role="group" aria-label="${esc(t('lib.type'))}">${['all', 'pdf', 'docx', 'xlsx', 'csv', 'txt'].map(x => `<button data-act="ltype" data-v="${x}" aria-pressed="${VIEW.libType === x}">${x === 'all' ? esc(t('all')) : x.toUpperCase()}</button>`).join('')}</div>
  <label class="sr" for="lib-st">${esc(t('lib.status'))}</label><select id="lib-st" class="input" style="width:auto">${['all', 'processed', 'processing', 'failed'].map(x => `<option value="${x}" ${VIEW.libStatus === x ? 'selected' : ''}>${x === 'all' ? esc(t('lib.status') + ': ' + t('all')) : esc(t('st.' + x))}</option>`).join('')}</select></div>
  <div class="panel" id="lib-body">${libTable()}</div></div>`;
}

/* ---------- analytics ---------- */
function topicCoverage() {
  return CORPUS.TOPICS.map(tp => {
    const n = allChunks().filter(c => c.topic === tp.id).length, gaps = STATE.gaps.filter(g => g.status === 'open' && (g.qa ? qaById(g.qa)?.topic === tp.id : false)).length;
    const lvl = n >= 3 ? 'strong' : n >= 1 ? 'partial' : 'missing'; return { tp, n, gaps, lvl };
  });
}
function chartSVG() {
  const live = STATE.history.filter(h => !h.seed && Date.now() - h.ts < DAY);
  const A = SEED_DAYS.ans.slice(), G = SEED_DAYS.gap.slice(); A[13] += live.filter(h => h.status === 'answer').length; G[13] += live.filter(h => h.status === 'abstain').length;
  const W = 640, H = 190, pl = 30, pb = 22, max = Math.max(1, ...A.map((a, i) => a + G[i])), bw = (W - pl) / 14;
  const bars = A.map((a, i) => { const x = pl + i * bw + 5, w = bw - 10, ha = a / max * (H - pb - 10), hg = G[i] / max * (H - pb - 10); const d = new Date(Date.now() - (13 - i) * DAY);
    return `<rect x="${x}" y="${H - pb - ha}" width="${w}" height="${ha}" rx="2" fill="var(--accent)"><title>${a}</title></rect><rect x="${x}" y="${H - pb - ha - hg}" width="${w}" height="${hg}" rx="2" fill="var(--warn)"><title>${G[i]}</title></rect><text x="${x + w / 2}" y="${H - 6}" text-anchor="middle">${d.getDate()}</text>`; }).join('');
  const grid = [0, .5, 1].map(f => `<line x1="${pl}" x2="${W}" y1="${H - pb - f * (H - pb - 10)}" y2="${H - pb - f * (H - pb - 10)}" stroke="var(--line)"/><text x="0" y="${H - pb - f * (H - pb - 10) + 4}">${Math.round(max * f)}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t('an.chart'))}">${grid}${bars}</svg>`;
}
function analyticsView() {
  const st = stats(), cov = topicCoverage();
  const top = Object.entries(SEED_TOP).map(([id, n]) => ({ id, n: n + ((STATE.liveTop[id] || {}).n || 0), q: questionText(qaById(id)) }));
  Object.entries(STATE.liveTop).forEach(([k, v]) => { if (!SEED_TOP[k] && v.qa) top.push({ id: v.qa, n: v.n, q: questionText(qaById(v.qa)) }); else if (!SEED_TOP[k]) top.push({ id: k, n: v.n, q: v.q }); });
  top.sort((a, b) => b.n - a.n); const mx = top.length ? top[0].n : 1, openGaps = STATE.gaps.filter(g => g.status === 'open');
  const fbs = Object.values(STATE.feedback), up = fbs.filter(x => x === 'up').length, ms = st.live.map(h => h.ms).sort((a, b) => a - b), med = ms.length ? ms[Math.floor(ms.length / 2)] : null;
  const col = { strong: 'var(--accent)', partial: 'var(--warn)', missing: 'var(--danger)' };
  return `<div class="page"><div class="page-h"><div><h1>${esc(t('nav.analytics'))}</h1><p>${esc(t('an.sub'))}</p></div></div>
  <div class="panel"><div class="stat stat6" style="border:0">${[['stat.docs', st.docs], ['stat.proc', st.proc], ['stat.chunks', fmtNum(st.chunks)], ['stat.searches', fmtNum(st.total)], ['stat.rate', st.total ? Math.round(st.rate * 100) + '%' : '—'], ['an.gapsopen', openGaps.length]].map(([k, v]) => `<div><b>${v}</b><span>${esc(t(k))}</span></div>`).join('')}</div></div>
  <div class="grid2"><div class="panel"><div class="hd"><h3>${esc(t('an.usage'))}</h3><span class="row" style="gap:12px;font-size:12px"><span class="row" style="gap:5px"><i style="width:10px;height:10px;border-radius:2px;background:var(--accent)"></i>${esc(t('an.answered'))}</span><span class="row" style="gap:5px"><i style="width:10px;height:10px;border-radius:2px;background:var(--warn)"></i>${esc(t('an.abstained'))}</span></span></div><div class="bd">${chartSVG()}</div></div>
  <div class="panel"><div class="hd"><h3>${esc(t('an.success'))}</h3></div><div class="bd col" style="gap:14px">
    ${[[t('an.ans.rate'), st.total ? Math.round(st.rate * 100) + '%' : '—', 'var(--accent)', st.rate * 100], [t('an.abst.rate'), st.total ? Math.round((1 - st.rate) * 100) + '%' : '—', 'var(--warn)', st.total ? (1 - st.rate) * 100 : 0]].map(([l, v, c, p]) => `<div><div class="row between"><span class="dim">${esc(l)}</span><b>${v}</b></div><div class="progress" style="margin-top:6px"><i style="width:${p}%;background:${c}"></i></div></div>`).join('')}
    <div class="row between"><span class="dim">${esc(t('an.helpful'))}</span><b>${fbs.length ? up + ' / ' + fbs.length : '—'}</b></div>
    <div class="row between"><span class="dim">${esc(t('an.median'))}</span><b>${med == null ? '—' : med.toFixed(1) + ' ms'}</b></div>
    <p class="muted" style="font-size:12px">${esc(t('an.note'))}</p></div></div></div>
  <div class="grid2"><div class="panel"><div class="hd"><h3>${esc(t('an.top'))}</h3></div><div class="bd col" style="gap:12px">${top.length ? '' : `<span class="muted">${esc(t('an.empty'))}</span>`}${top.slice(0, 7).map(x => `<button style="border:0;background:none;padding:0;text-align:left" data-act="ask" data-qa="${esc(CORPUS.QA.find(q => q.id === x.id) ? x.id : '')}" data-q="${esc(x.q)}"><div class="row between" style="gap:12px"><span>${esc(x.q)}</span><b>${x.n}</b></div><div class="progress" style="margin-top:5px"><i style="width:${x.n / mx * 100}%"></i></div></button>`).join('')}</div></div>
  <div class="panel"><div class="hd"><h3>${esc(t('an.coverage'))}</h3></div><div class="bd col" style="gap:10px">${!STATE.settings.useDemo ? `<span class="muted">${esc(t('an.cov.off'))}</span>` : ''}${(STATE.settings.useDemo ? cov : []).map(c => `<div class="bar"><span class="t">${esc(pick(c.tp.n))}</span><span class="b"><i style="width:${c.lvl === 'strong' ? 100 : c.lvl === 'partial' ? 50 : 6}%;background:${col[c.lvl]}"></i></span><span style="width:70px;text-align:right;color:${col[c.lvl]};font-weight:600">${esc(t('cov.' + c.lvl))}</span></div>`).join('')}<p class="muted" style="font-size:12px">${esc(t('an.cov.note'))}</p></div></div></div>
  <div class="panel" style="margin-top:16px"><div class="hd"><h3>${esc(t('an.recent'))}</h3></div><div style="overflow:auto"><table class="tbl"><thead><tr><th>${esc(t('gap.q'))}</th><th>${esc(t('lib.status'))}</th><th class="hide-m">ms</th><th>${esc(t('gap.date'))}</th></tr></thead><tbody>${STATE.history.slice(0, 8).map(h => `<tr><td>${esc(histQ(h))}</td><td>${h.status === 'abstain' ? `<span class="badge warn">${esc(t('abst.badge'))}</span>` : `<span class="badge ok">${esc(t('an.answered'))}</span>`}</td><td class="hide-m muted">${h.ms}</td><td class="muted">${esc(rel(h.ts))}</td></tr>`).join('')}</tbody></table></div></div></div>`;
}

/* ---------- gaps ---------- */
function gapQ(g) { return g.q || questionText(qaById(g.qa)); }
function gapReason(g) {
  const qa = g.qa && qaById(g.qa); if (qa && qa.why) return pick(qa.why);
  if (g.reasonKind === 'low-coverage' || g.reasonKind === 'no-match') return g.missing && g.missing.length ? t('abst.terms', g.missing.slice(0, 4).join(', ')) : t('abst.generic');
  return t('abst.generic');
}
function gapsView() {
  const list = STATE.gaps.filter(g => VIEW.gapTab === 'all' || g.status === VIEW.gapTab).sort((a, b) => b.ts - a.ts), openN = STATE.gaps.filter(g => g.status === 'open').length;
  const byTopic = {}; STATE.gaps.filter(g => g.status === 'open').forEach(g => { const tp = (g.qa && qaById(g.qa)?.topic) || 'other'; byTopic[tp] = (byTopic[tp] || 0) + g.count; });
  const cl = Object.entries(byTopic).sort((a, b) => b[1] - a[1]);
  return `<div class="page"><div class="page-h"><div><h1>${esc(t('nav.gaps'))}</h1><p>${esc(t('gap.sub'))}</p></div></div>
  ${cl.length ? `<div class="panel" style="margin-bottom:16px"><div class="hd"><h3>${ic('gap', 'sm')} ${esc(t('gap.clusters'))}</h3></div><div class="bd row wrap">${cl.map(([tp, n]) => `<span class="chip" style="cursor:default"><b>${esc(topicName(tp))}</b><span class="badge warn">${n}×</span></span>`).join('')}<span class="muted" style="font-size:12px;flex-basis:100%">${esc(t('gap.clusters.note'))}</span></div></div>` : ''}
  <div class="tabs" role="tablist">${['open', 'resolved', 'all'].map(k => `<button role="tab" data-act="gtab" data-v="${k}" aria-selected="${VIEW.gapTab === k}">${esc(t('gap.tab.' + k))}${k === 'open' ? ` <span class="badge warn">${openN}</span>` : ''}</button>`).join('')}</div>
  ${list.length ? `<div class="panel" style="margin-top:14px"><div style="overflow:auto"><table class="tbl"><thead><tr><th>${esc(t('gap.q'))}</th><th>${esc(t('gap.reason'))}</th><th class="hide-m">${esc(t('gap.docs'))}</th><th>${esc(t('gap.date'))}</th><th>${esc(t('lib.status'))}</th><th></th></tr></thead><tbody>
  ${list.map(g => { const docs = (g.qa ? qaById(g.qa).related : g.related) || []; return `<tr><td style="min-width:200px"><b>${esc(gapQ(g))}</b>${g.count > 1 ? `<div><span class="badge warn" style="margin-top:4px">${esc(t('gap.times', g.count))}</span></div>` : ''}</td><td style="min-width:220px;color:var(--ink-2)">${esc(gapReason(g))}</td>
  <td class="hide-m">${docs.map(id => docById(id)).filter(Boolean).map(d => `<button class="chip" style="height:24px;font-size:11px;margin:0 4px 4px 0" data-act="doc" data-id="${esc(d.id)}">${esc(d.name)}</button>`).join('') || '<span class="muted">—</span>'}</td>
  <td class="muted" style="white-space:nowrap">${esc(fmtDate(g.ts))}</td><td>${g.status === 'open' ? `<span class="badge warn">${esc(t('gap.open'))}</span>` : `<span class="badge ok">${esc(t('gap.resolved'))}</span>`}</td>
  <td><div class="row" style="justify-content:flex-end;flex-wrap:wrap"><button class="btn sm" data-act="rerun" data-id="${g.id}">${ic('refresh', 'sm')}${esc(t('gap.rerun'))}</button><button class="btn sm ${g.status === 'open' ? '' : 'ghost'}" data-act="resolve" data-id="${g.id}">${g.status === 'open' ? ic('check', 'sm') + esc(t('gap.resolve')) : esc(t('gap.reopen'))}</button></div></td></tr>`; }).join('')}</tbody></table></div></div>
  <p class="muted" style="margin-top:12px;font-size:12px">${ic('info', 'sm')} ${esc(t('gap.hint'))}</p>` : `<div class="panel" style="margin-top:14px"><div class="empty">${ic('circ', 'lg')}<h3>${esc(t('gap.empty'))}</h3><p>${esc(t('gap.empty.sub'))}</p></div></div>`}</div>`;
}

/* ---------- settings ---------- */
function settingsView() {
  const s = STATE.settings;
  const row = (title, desc, ctl) => `<div class="set"><div><b>${esc(title)}</b>${desc ? `<p>${esc(desc)}</p>` : ''}</div>${ctl}</div>`;
  const sw = (act, on, label) => `<button class="switch" role="switch" aria-checked="${on}" aria-label="${esc(label)}" data-act="${act}"></button>`;
  return `<div class="page" style="max-width:860px"><div class="page-h"><div><h1>${esc(t('nav.settings'))}</h1><p>${esc(t('set.sub'))}</p></div></div>
  <div class="col" style="gap:16px">
  <div class="panel"><div class="hd"><h3>${esc(t('set.lang'))}</h3></div>${row(t('set.lang.t'), t('set.lang.d'), `<div class="seg" role="group" aria-label="${esc(t('lang.label'))}">${LANGS.map((l, i) => `<button data-act="lang" data-i="${i}" aria-pressed="${i === LANG}" lang="${l[0]}">${l[2]}</button>`).join('')}</div>`)}</div>
  <div class="panel"><div class="hd"><h3>${esc(t('set.appear'))}</h3></div>${row(t('set.theme'), '', `<div class="seg" role="group" aria-label="${esc(t('set.theme'))}">${['light', 'dark', 'system'].map(k => `<button data-act="theme" data-v="${k}" aria-pressed="${STATE.theme === k}">${esc(t('theme.' + k))}</button>`).join('')}</div>`)}</div>
  <div class="panel"><div class="hd"><h3>${esc(t('set.kb'))}</h3></div>
    ${row(t('set.thr'), t('set.thr.d'), `<div class="row"><input type="range" min="30" max="90" step="5" value="${Math.round(s.threshold * 100)}" id="thr" aria-label="${esc(t('set.thr'))}"><b id="thr-v" style="width:40px">${Math.round(s.threshold * 100)}%</b></div>`)}
    ${row(t('set.max'), t('set.max.d'), `<div class="seg" role="group" aria-label="${esc(t('set.max'))}">${[2, 3, 4, 5].map(n => `<button data-act="maxsrc" data-v="${n}" aria-pressed="${s.maxSources === n}">${n}</button>`).join('')}</div>`)}
    ${row(t('set.details'), t('set.details.d'), sw('tdetails', s.details, t('set.details')))}</div>
  <div class="panel"><div class="hd"><h3>${esc(t('set.demo'))}</h3><span class="badge warn">${esc(modeT('short'))}</span></div>
    ${row(t('set.usedemo'), t('set.usedemo.d'), sw('tdemo', s.useDemo, t('set.usedemo')))}
    ${row(t('set.scripted'), t('set.scripted.d'), sw('tscripted', s.scripted, t('set.scripted')))}
    ${row(t('set.ai'), t('set.ai.d') + ' ', `<div class="row"><span class="muted" id="ai-status" style="font-size:12px">${esc(aiStatusText())}</span>${sw('tai', s.ai, t('set.ai'))}</div>`)}
    ${s.ai ? row(t('set.semthr'), t('set.semthr.d'), `<div class="row"><input type="range" min="75" max="95" step="1" value="${Math.round(s.semThr * 100)}" id="semthr" aria-label="${esc(t('set.semthr'))}"><b id="semthr-v" style="width:40px">${Math.round(s.semThr * 100)}%</b></div>`) : ''}
    ${row(t('set.demo.t'), t('set.demo.d'), `<button class="btn" data-act="restore">${ic('refresh', 'sm')}${esc(t('set.restore'))}</button>`)}
    ${row(t('set.tour'), t('set.tour.d'), `<button class="btn" data-act="tour">${ic('play', 'sm')}${esc(t('tour.start'))}</button>`)}
    ${row(t('set.ob'), '', `<button class="btn" data-act="onboard">${esc(t('set.ob.btn'))}</button>`)}</div>
  <div class="panel"><div class="hd"><h3>${esc(t('set.backend'))}</h3><span class="badge ${s.endpoint ? 'info' : ''}">${esc(s.endpoint ? t('set.be.on') : t('set.be.off'))}</span></div>
    ${row(t('set.endpoint'), t('set.endpoint.d'), `<div class="row" style="width:min(340px,100%)"><input class="input" id="endpoint" placeholder="https://…/api/ask" value="${esc(s.endpoint)}" aria-label="${esc(t('set.endpoint'))}"><button class="btn" data-act="saveep">${esc(t('save'))}</button></div>`)}</div>
  <div class="panel"><div class="hd"><h3>${esc(t('set.general'))}</h3></div>
    ${row(t('set.clear'), t('set.clear.d'), `<button class="btn danger" data-act="reset">${ic('trash', 'sm')}${esc(t('set.clear.btn'))}</button>`)}
    ${row(t('set.about'), t('set.about.d'), '')}</div></div></div>`;
}

/* ---------- shell ---------- */
const NAV = [['/app', 'dash', 'nav.dash'], ['/app/ask', 'chat', 'nav.assistant'], ['/app/docs', 'file', 'nav.docs'], ['/app/analytics', 'chart', 'nav.analytics'], ['/app/gaps', 'gap', 'nav.gaps'], ['/app/settings', 'sliders', 'nav.settings']];
function shell(inner) {
  const open = STATE.gaps.filter(g => g.status === 'open').length;
  return `<div class="app"><aside class="side ${VIEW.navOpen ? 'open' : ''}" aria-label="${esc(t('nav.main'))}">${logo('#home')}
    ${NAV.map(([r, i, k]) => `<a class="nav" href="${hashOf(r)}" ${VIEW.route === r ? 'aria-current="page"' : ''}>${ic(i)}${esc(t(k))}${r === '/app/gaps' && open ? `<span class="badge warn">${open}</span>` : ''}</a>`).join('')}
    <div class="sp"></div><button class="btn" data-act="tour" style="justify-content:center">${ic('play', 'sm')}${esc(t('tour.start'))}</button>
    <div class="row between" style="padding:10px 4px 0">${langSw()}<a class="muted" href="#home" style="font-size:12px">${esc(t('nav.site'))}</a></div></aside>
  <div class="main"><header class="top"><button class="btn icon ghost menu" data-act="menu" aria-label="${esc(t('nav.menu'))}">${ic('menu')}</button>
    <button class="search-btn" data-act="qs">${ic('search', 'sm')}<span>${esc(t('qs.btn'))}</span><span class="kbd">Ctrl K</span></button><span class="grow"></span><span class="badge warn" title="${esc(modeT('long'))}">${esc(modeT('short'))}</span></header>
    <div class="sim">${ic('info', 'sm')}<span><b>${esc(modeT('short'))}.</b> ${esc(modeT('long'))}</span></div>${inner}</div></div>`;
}
