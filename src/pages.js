/* Views 2: landing page, drawers, quick search, onboarding, guided tour. */
const LP_IDS = ['d-metformin', 'i-renal', 'x-pediatric'];
function lpPreview() {
  const rows = [['check', 1], ['file', 2], ['warn', 3]];
  return `<div class="pv"><div class="pv-h"><i></i><i></i><i></i><span class="muted mono" style="margin-left:8px">${esc(t('lp.an.title'))}</span></div><div class="anat">${rows.map(([ico, k]) => `<div class="anat-r"><span class="anat-n">${k}</span><div><h4>${esc(t('lp.an.' + k))}</h4><p>${esc(t('lp.an.' + k + 'd'))}</p></div></div>`).join('')}</div></div>`;
}
function landingView() {
  const steps = ['docs', 'proc', 'ret', 'ev', 'ans'];
  const feats = [['spark', 'ev'], ['shield', 'abst'], ['gap', 'gap'], ['cols', 'cmp'], ['globe', 'lang'], ['upload', 'up']];
  return `<div class="l-nav"><div class="l-wrap">${logo('#home')}<nav aria-label="${esc(t('nav.main'))}"><a href="#how" data-act="scroll" data-id="how">${esc(t('lp.nav.how'))}</a><a href="#idk" data-act="scroll" data-id="idk">${esc(t('lp.nav.idk'))}</a><a href="#security" data-act="scroll" data-id="security">${esc(t('lp.nav.sec'))}</a></nav>${langSw()}<a class="btn primary" href="#app">${esc(t('lp.try'))}</a></div></div>
  <main><div class="l-wrap"><section class="hero"><div><div class="eyebrow">${esc(t('tagline'))}</div><h1 style="margin-top:14px">${esc(t('lp.h1a'))} <em>${esc(t('lp.h1b'))}</em></h1><p class="lead">${esc(t('lp.lead'))}</p>
    <div class="row wrap" style="margin-top:28px"><a class="btn primary lg" href="#app" data-act="demo">${ic('play', 'sm')}${esc(t('lp.try'))}</a><a class="btn lg" href="#ask">${esc(t('lp.explore'))}</a></div>
    <p class="muted" style="margin-top:16px;font-size:13px">${ic('info', 'sm')} ${esc(t('lp.nosignup'))}</p></div><div>${lpPreview()}</div></section></div>
  <section class="sec" id="criteria" style="padding-top:8px"><div class="l-wrap"><div class="eyebrow">${esc(t('lp.cr.eyebrow'))}</div><h2 style="margin-top:8px">${esc(t('lp.cr.h'))}</h2><div class="crit">${[['01', 1], ['02', 2], ['03', 3], ['04', 4]].map(([p, k]) => `<div><b class="pct">${p}</b><h4>${esc(t('lp.cr.' + k))}</h4><p>${esc(t('lp.cr.' + k + 'd'))}</p></div>`).join('')}</div></div></section>
  <section class="sec" id="how"><div class="l-wrap"><div class="eyebrow">${esc(t('lp.how.eyebrow'))}</div><h2 style="margin-top:8px">${esc(t('lp.how.h'))}</h2><p class="sub">${esc(t('lp.how.sub'))}</p>
    <div class="pipe">${steps.map((s, i) => `<div><span class="n">0${i + 1}</span><h4>${esc(t('pipe.' + s))}</h4><p>${esc(t('pipe.' + s + '.d'))}</p></div>`).join('')}</div></div></section>
  <section class="sec"><div class="l-wrap"><div class="eyebrow">${esc(t('lp.feat.eyebrow'))}</div><h2 style="margin-top:8px">${esc(t('lp.feat.h'))}</h2><div class="frows" style="margin-top:28px">${feats.map(([i, k]) => `<div><span style="color:var(--accent)">${ic(i, 'lg')}</span><h4>${esc(t('feat.' + k))}</h4><p>${esc(t('feat.' + k + '.d'))}</p></div>`).join('')}</div></div></section>
  <section class="sec" id="idk"><div class="l-wrap split"><div><div class="eyebrow">${esc(t('lp.idk.eyebrow'))}</div><h2 style="margin-top:8px">${esc(t('lp.idk.h'))}</h2><p class="sub">${esc(t('lp.idk.sub'))}</p><ul class="det" style="margin-top:18px"><li>${esc(t('lp.idk.1'))}</li><li>${esc(t('lp.idk.2'))}</li><li>${esc(t('lp.idk.3'))}</li></ul>
    <a class="btn lg" style="margin-top:22px" href="#ask">${esc(t('lp.idk.try'))} ${ic('arrow', 'sm')}</a></div>
    <div class="col"><div class="q-turn"><span class="badge info" style="margin-top:3px">${esc(t('you'))}</span><div class="qb" style="font-style:italic">${esc(t('lp.idk.ph'))}</div></div><div class="ans abst"><div class="ans-h"><span class="badge warn">${ic('warn', 'sm')} ${esc(t('abst.badge'))}</span></div><div class="ans-b"><p class="direct">${esc(t('abst.title'))}</p><p class="dim" style="margin-top:8px">${esc(t('abst.generic'))}</p></div></div></div></div></section>
  <section class="sec"><div class="l-wrap"><div class="split" style="align-items:start"><div><div class="eyebrow">${esc(t('lp.ben.eyebrow'))}</div><h2 style="margin-top:8px">${esc(t('lp.ben.h'))}</h2></div><div class="frows" style="margin-top:-18px">${['emp', 'biz', 'new'].map(k => `<div style="grid-template-columns:1fr"><h4>${esc(t('ben.' + k))}</h4><p>${esc(t('ben.' + k + '.d'))}</p></div>`).join('')}</div></div></div></section>
  <section class="sec" id="security"><div class="l-wrap"><div class="eyebrow">${esc(t('lp.sec.eyebrow'))}</div><h2 style="margin-top:8px">${esc(t('lp.sec.h'))}</h2><p class="sub">${esc(t('lp.sec.sub'))}</p>
    <div class="frows" style="margin-top:24px">${[['lock', 'local'], ['upload', 'upl'], ['link', 'key'], ['info', 'notyet']].map(([i, k]) => `<div><span style="color:var(--accent)">${ic(i, 'lg')}</span><h4>${esc(t('sec.' + k))}</h4><p>${esc(t('sec.' + k + '.d'))}</p></div>`).join('')}</div></div></section>
  <section class="sec"><div class="l-wrap"><div class="cta"><div><h2>${esc(t('lp.cta.h'))}</h2><p style="opacity:.75;margin-top:8px">${esc(t('lp.cta.sub'))}</p></div><a class="btn primary lg" href="#app">${ic('play', 'sm')}${esc(t('lp.try'))}</a></div></div></section></main>
  <footer class="l-foot"><div class="l-wrap row between wrap">${logo('#home')}<span>${esc(t('lp.foot'))}</span><span>${esc(t('tagline'))}</span></div></footer>`;
}

/* ---------- drawers ---------- */
function metaKV(d, extra) {
  const rows = [[t('lib.type'), d.type.toUpperCase()], [t('lib.size'), fmtSize(d.size)], [t('lib.date'), fmtDate(d.ts)]];
  if (d.pages) rows.push([t('meta.pages'), d.pages]); if (d.sheets) rows.push([t('meta.sheets'), d.sheets]); if (d.rows) rows.push([t('meta.rows'), d.rows]);
  return `<div class="kv" style="grid-template-columns:auto 1fr;font-size:13px">${rows.concat(extra || []).map(([k, v]) => `<b>${esc(k)}</b><span>${esc(v)}</span>`).join('')}</div>`;
}
function srcDrawer() {
  const turn = VIEW.thread.find(x => x.id === VIEW.drawer.turn); if (!turn) return '';
  const evs = turn.result.evidence, i = VIEW.drawer.i, ev = evs[i], d = sourceOf(ev);
  if (!d) return '';
  const sib = d.remote ? [ev.chunk] : docChunks(d.id), pos = sib.findIndex(c => c.id === ev.chunk.id);
  const prev = pos > 0 ? sib[pos - 1] : null, next = pos < sib.length - 1 ? sib[pos + 1] : null;
  const ctx = c => c ? `<p class="ctx">${esc(lt(c, c === prev ? c.lines.length - 1 : 0))}</p>` : '';
  return `<div class="scrim" data-act="close"></div><aside class="drawer" role="dialog" aria-modal="true" aria-label="${esc(t('src.title'))}"><div class="hd"><span class="ev-n">${i + 1}</span><div class="grow"><div class="eyebrow">${esc(t('src.title'))}</div><b>${esc(d.name)}</b></div><button class="btn icon ghost" data-act="close" aria-label="${esc(t('close'))}" id="drawer-x">${ic('x')}</button></div>
  <div class="bd col" style="gap:18px"><div class="row wrap"><span class="badge info">${esc(locLabel(ev.chunk.loc))}</span>${evs.length > 1 ? `<span class="muted">${esc(t('src.of', i + 1, evs.length))}</span>` : ''}</div>
  <div><div class="eyebrow" style="margin-bottom:6px">${esc(t('src.passage'))}</div><div class="excerpt">${ctx(prev)}<p>${hlLines(ev, false)}</p>${ctx(next)}</div><p class="muted" style="font-size:12px;margin-top:6px">${ic('info', 'sm')} ${esc(t('src.hl'))}</p></div>
  <div><div class="eyebrow" style="margin-bottom:6px">${esc(t('src.meta'))}</div>${metaKV(d, [[t('src.loc'), locLabel(ev.chunk.loc)], [t('src.chunk'), `${pos + 1} / ${sib.length}`]])}</div>
  ${evs.length > 1 ? `<div><div class="eyebrow" style="margin-bottom:6px">${esc(t('src.all'))}</div>${evs.map((e, k) => `<button class="ev-card" style="grid-template-columns:22px 1fr;${k === i ? 'border-color:var(--accent)' : ''}" data-act="src" data-turn="${turn.id}" data-i="${k}"><span class="ev-n">${k + 1}</span><span class="ev-t"><b>${esc((sourceOf(e) || {}).name || '')}</b><span class="badge">${esc(locLabel(e.chunk.loc))}</span></span></button>`).join('')}</div>` : ''}</div>
  <div class="ft"><button class="btn" data-act="copyone" data-turn="${turn.id}" data-i="${i}">${ic('copy', 'sm')}${esc(t('src.copy'))}</button>${d.remote ? '' : `<button class="btn" data-act="doc" data-id="${esc(d.id)}">${esc(t('src.opendoc'))}</button>`}<span class="grow"></span>
  <button class="btn icon" data-act="src" data-turn="${turn.id}" data-i="${(i - 1 + evs.length) % evs.length}" aria-label="${esc(t('prev'))}" ${evs.length < 2 ? 'disabled' : ''}>${ic('left')}</button><button class="btn icon" data-act="src" data-turn="${turn.id}" data-i="${(i + 1) % evs.length}" aria-label="${esc(t('next'))}" ${evs.length < 2 ? 'disabled' : ''}>${ic('right')}</button></div></aside>`;
}
function docDrawer() {
  const d = docById(VIEW.drawer.id); if (!d) return '';
  const full = docList().find(x => x.id === d.id) || d, chunks = docChunks(d.id), ent = Retrieval.entities(chunks), terms = d.demo ? [] : Retrieval.keyTerms(chunks, 8);
  const sum = chunks[0] ? lt(chunks[0], 0) : '';
  const tag = a => a.map(x => `<span class="badge">${esc(x)}</span>`).join(' ') || `<span class="muted">—</span>`;
  return `<div class="scrim" data-act="close"></div><aside class="drawer" role="dialog" aria-modal="true" aria-label="${esc(t('doc.title'))}"><div class="hd">${ficon(d.type)}<div class="grow" style="min-width:0"><div class="eyebrow">${esc(t('doc.title'))}</div><b style="overflow-wrap:anywhere">${esc(d.name)}</b></div><button class="btn icon ghost" data-act="close" aria-label="${esc(t('close'))}" id="drawer-x">${ic('x')}</button></div>
  <div class="bd col" style="gap:18px"><div class="row wrap">${statusBadge(full)}<span class="badge">${esc(pick(d.category || [t('lib.uploaded'), t('lib.uploaded'), t('lib.uploaded')]))}</span>${d.demo ? `<span class="badge info">${esc(t('lib.demo'))}</span>` : ''}</div>
  ${d.status === 'failed' ? `<div class="callout warn">${ic('warn')}<div><b>${esc(t('doc.notproc'))}</b><div>${esc(t('err.' + (d.error || 'parse')))}</div></div></div>` : ''}
  ${metaKV(full, [[t('stat.chunks'), full.chunks || 0]].concat(d.chars ? [[t('meta.chars'), fmtNum(d.chars)]] : []))}
  ${chunks.length ? `<div><div class="eyebrow" style="margin-bottom:6px">${esc(t('doc.summary'))}</div><p class="dim">${esc(sum)}</p><p class="muted" style="font-size:12px;margin-top:4px">${esc(t('doc.summary.note'))}</p></div>
  <div><div class="eyebrow" style="margin-bottom:6px">${esc(t('doc.entities'))}</div><div class="col" style="gap:6px;font-size:13px"><div>${esc(t('doc.products'))}: ${tag(ent.products)}</div><div>${esc(t('doc.amounts'))}: ${tag(ent.amounts)}</div><div>${esc(t('doc.percents'))}: ${tag(ent.percents)}</div>${terms.length ? `<div>${esc(t('doc.terms'))}: ${tag(terms)}</div>` : ''}</div></div>
  <div><div class="eyebrow" style="margin-bottom:6px">${esc(t('doc.extracted'))} · ${chunks.length}</div>${chunks.slice(0, 40).map(c => `<div class="excerpt" style="margin-bottom:8px;font-size:13px"><span class="badge info" style="margin-bottom:6px">${esc(locLabel(c.loc))}</span>${c.lines.map((_, i) => `<p>${esc(lt(c, i))}</p>`).join('')}</div>`).join('')}${chunks.length > 40 ? `<p class="muted">… +${chunks.length - 40}</p>` : ''}</div>` : (d.status === 'processed' ? '' : `<p class="muted">${esc(t('doc.nochunks'))}</p>`)}</div>
  <div class="ft">${full.status === 'failed' ? `<button class="btn" data-act="retry" data-id="${esc(d.id)}">${ic('refresh', 'sm')}${esc(t('lib.retry'))}</button>` : ''}<button class="btn danger" data-act="rm" data-id="${esc(d.id)}">${ic('trash', 'sm')}${esc(t('lib.remove'))}</button></div></aside>`;
}
function confirmView() {
  const rs = VIEW.confirm.reset, d = rs ? null : docById(VIEW.confirm.id);
  return `<div class="scrim" data-act="cclose"></div><div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="cf-t" style="top:25vh;width:min(440px,92vw)"><div style="padding:20px"><h3 id="cf-t">${esc(rs ? t('reset.title') : t('rm.title', d ? d.name : ''))}</h3><p class="dim" style="margin-top:8px">${esc(rs ? t('reset.body') : d && d.demo ? t('rm.demo') : t('rm.body'))}</p></div>
  <div class="row" style="justify-content:flex-end;padding:12px 20px;border-top:1px solid var(--line)"><button class="btn" data-act="cclose">${esc(t('cancel'))}</button><button class="btn primary" style="background:var(--danger);border-color:var(--danger)" data-act="rmgo" data-id="${esc(VIEW.confirm.id || '__reset')}" id="cf-go">${esc(rs ? t('set.clear.btn') : t('lib.remove'))}</button></div></div>`;
}

/* ---------- quick search ---------- */
function qsItems() {
  const q = VIEW.qs.q.trim().toLowerCase(), out = [];
  if (q) out.push({ g: t('qs.ask'), icon: 'search', label: VIEW.qs.q.trim(), sub: t('qs.ask.sub'), act: { act: 'ask', q: VIEW.qs.q.trim() } });
  const toks = Retrieval.tokens(q).map(x => x.s);
  const qs = CORPUS.QA.map(x => ({ x, tx: questionText(x), sc: toks.length ? toks.filter(s => Retrieval.tokens(questionText(x)).some(y => y.s === s)).length : 1 })).filter(o => !q || o.sc > 0 || o.tx.toLowerCase().includes(q)).sort((a, b) => b.sc - a.sc).slice(0, q ? 5 : 6);
  qs.forEach(o => out.push({ g: t('qs.questions'), icon: o.x.abstain ? 'warn' : 'help', label: o.tx, act: { act: 'ask', q: o.tx, qa: o.x.id } }));
  docList().filter(d => !q || d.name.toLowerCase().includes(q)).slice(0, 4).forEach(d => out.push({ g: t('qs.docs'), icon: 'file', label: d.name, sub: fmtSize(d.size), act: { act: 'doc', id: d.id } }));
  NAV.filter(([r, , k]) => !q || t(k).toLowerCase().includes(q)).forEach(([r, i, k]) => out.push({ g: t('qs.pages'), icon: i, label: t(k), act: { act: 'goto', r } }));
  return out;
}
function qsView() {
  const items = qsItems(); VIEW.qs.sel = Math.min(VIEW.qs.sel, Math.max(0, items.length - 1)); let last = '';
  return `<div class="scrim" data-act="qclose"></div><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(t('qs.btn'))}"><div class="row" style="padding:12px 16px;border-bottom:1px solid var(--line)"><span class="muted">${ic('search')}</span><input id="qs-in" class="grow" style="border:0;outline:0;background:none;font-size:16px;height:32px" placeholder="${esc(t('qs.ph'))}" value="${esc(VIEW.qs.q)}" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="qs-list" aria-activedescendant="qs-opt-${VIEW.qs.sel}" aria-label="${esc(t('qs.btn'))}"><span class="kbd">${esc(t('qs.esc'))}</span></div>
  <div class="res" id="qs-list" role="listbox">${items.map((it, i) => { const h = it.g !== last ? `<div class="grp">${esc(it.g)}</div>` : ''; last = it.g; return h + `<button class="it" id="qs-opt-${i}" role="option" aria-selected="${i === VIEW.qs.sel}" data-act="qrun" data-i="${i}"><span class="muted">${ic(it.icon, 'sm')}</span><span class="grow">${esc(it.label)}</span>${it.sub ? `<span class="muted" style="font-size:12px">${esc(it.sub)}</span>` : ''}</button>`; }).join('') || `<div class="empty">${esc(t('qs.none'))}</div>`}</div></div>`;
}

/* ---------- onboarding & tour ---------- */
function obView() {
  const i = VIEW.ob, icons = ['search', 'eye', 'shield'];
  return `<div class="scrim" data-act="obskip"></div><div class="modal" role="dialog" aria-modal="true" aria-labelledby="ob-t" style="top:14vh;width:min(520px,94vw)"><div style="padding:28px 28px 8px"><div class="ob-dots">${[0, 1, 2].map(k => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div>
  <div style="color:var(--accent);margin:22px 0 10px">${ic(icons[i], 'lg')}</div><h2 id="ob-t" style="font-size:24px;letter-spacing:-.02em">${esc(t('ob.' + i + '.t'))}</h2><p class="dim" style="margin-top:8px;font-size:15px">${esc(t('ob.' + i + '.d'))}</p></div>
  <div class="row between" style="padding:20px 28px 24px"><button class="btn ghost" data-act="obskip">${esc(t('skip'))}</button><button class="btn primary" data-act="obnext" id="ob-go">${esc(i === 2 ? t('ob.start') : t('next'))} ${ic('arrow', 'sm')}</button></div></div>`;
}
const TOUR_N = 7;
function coachView() {
  const i = VIEW.tour;
  return `<div class="coach" role="dialog" aria-label="${esc(t('tour.label'))}" aria-live="polite"><div class="pg">${Array.from({ length: TOUR_N }, (_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div>
  <div class="row between"><div class="eyebrow" style="opacity:.7">${esc(t('tour.step', i + 1, TOUR_N))}</div><div class="mono" id="tour-clock" title="${esc(t('tour.clock'))}" style="opacity:.85">${clockText(tourSeconds())}</div></div><h3 style="margin:4px 0 6px;font-size:16px">${esc(t('tour.' + i + '.t'))}</h3><p style="font-size:13px;opacity:.85">${esc(t('tour.' + i + '.d'))}</p>
  <div class="row between" style="margin-top:14px"><button class="btn sm ghost" data-act="tourend">${esc(t('tour.skip'))}</button><button class="btn sm" data-act="tournext" id="tour-go" ${VIEW.tourBusy ? 'disabled' : ''}>${esc(i === TOUR_N - 1 ? t('tour.done') : t('next'))} ${ic('arrow', 'sm')}</button></div></div>`;
}
function overlays() {
  let h = '';
  if (VIEW.drawer) h += VIEW.drawer.type === 'src' ? srcDrawer() : docDrawer();
  if (VIEW.confirm) h += confirmView();
  if (VIEW.qs) h += qsView();
  if (VIEW.ob != null) h += obView();
  if (VIEW.tour != null) h += coachView();
  return h;
}

function tourSeconds() { return Math.max(0, 180 - Math.floor((Date.now() - (VIEW.tourT0 || Date.now())) / 1000)); }
const clockText = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
const tourClock = () => clockText(tourSeconds());
