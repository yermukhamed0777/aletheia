/* App controller: router, events, ask flow, tour, boot. */
const $ = s => document.querySelector(s);
let seq = 0, lastFocus = null;
const UI = { refresh: () => render(), toast };

function toast(msg, kind) {
  const box = $('#toasts'); if (!box) return; const el = document.createElement('div');
  el.className = 'toast ' + (kind || ''); el.setAttribute('role', kind === 'err' ? 'alert' : 'status'); el.innerHTML = `${ic(kind === 'err' ? 'warn' : 'check', 'sm')}<span>${esc(msg)}</span>`;
  while (box.children.length > 3) box.firstChild.remove(); box.appendChild(el); setTimeout(() => el.remove(), 3800);
}
async function copyText(tx, msg) {
  let okc = false;
  try { await navigator.clipboard.writeText(tx); okc = true; } catch { const a = document.createElement('textarea'); a.value = tx; document.body.appendChild(a); a.select(); try { okc = document.execCommand('copy'); } catch {} a.remove(); }
  toast(okc ? (msg || t('toast.copied')) : t('toast.copyfail'), okc ? '' : 'err');
}
function applyTheme() {
  const dark = STATE.theme === 'dark' || (STATE.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.lang = LANGS[LANG][0]; document.title = `${t('app.name')} — ${t('tagline')}`;
}
function parseRoute() { const h = location.hash.replace(/^#/, ''); return HASH2ROUTE[h] || '/'; }
function go(r) { if (parseRoute() === r) { render(); return; } location.hash = hashOf(r); }

function pageHtml() {
  switch (VIEW.route) {
    case '/app': return dashboardView(); case '/app/ask': return assistantView(); case '/app/docs': return libraryView();
    case '/app/analytics': return analyticsView(); case '/app/gaps': return gapsView(); case '/app/settings': return settingsView(); default: return dashboardView();
  }
}
function render(opts = {}) {
  const root = $('#root'), ae = document.activeElement, keep = ae && ae.id && root.contains(ae) && ae.tagName === 'INPUT' ? { id: ae.id, v: ae.value, s: ae.selectionStart } : null, sy = window.scrollY;
  applyTheme();
  root.innerHTML = VIEW.route === '/' ? landingView() : shell(pageHtml());
  if (keep) { const el = document.getElementById(keep.id); if (el) { el.value = keep.v; el.focus(); try { el.setSelectionRange(keep.s, keep.s); } catch {} } }
  if (!opts.top) window.scrollTo(0, sy);
  renderOv();
}
function renderOv() {
  const ov = $('#ov'); ov.innerHTML = overlays();
  const f = $('#qs-in') || $('#ob-go') || $('#cf-go') || (VIEW.drawer && $('#drawer-x'));
  if (f && !ov.contains(document.activeElement)) f.focus();
  if (VIEW.qs && $('#qs-in')) { const el = $('#qs-in'); if (document.activeElement !== el) el.focus(); }
}
function route() {
  VIEW.route = parseRoute(); VIEW.navOpen = false;
  if (VIEW.route.startsWith('/app') && !STATE.onboarded && VIEW.ob == null && VIEW.tour == null) VIEW.ob = 0;
  render({ top: true }); window.scrollTo(0, 0);
}

/* ---------- ask ---------- */
async function remoteAsk(q) {
  const res = await fetch(STATE.settings.endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question: q, language: LANGS[LANG][0], threshold: STATE.settings.threshold }) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const j = await res.json(), cites = Array.isArray(j.citations) ? j.citations : [];
  if (j.status === 'abstain' || !j.answer || !cites.length) return { kind: 'abstain', reason: 'remote', related: [], evidence: [], ms: j.ms || 0, scanned: j.scanned, coverage: 0, topic: 'general', qa: null, missing: [], remoteWhy: j.reason };
  const evidence = cites.map((c, i) => {
    const id = 'remote-' + seq + '-' + i;
    const source = { id, name: String(c.doc || t('prov.remote')), type: 'txt', size: 0, ts: Date.now(), remote: true };
    const chunk = { id, doc: id, loc: { label: String(c.location || '') }, lines: [String(c.excerpt || '')], topic: 'remote', remote: c };
    return makeEvidence(chunk, [0], source);
  });
  return { kind: 'remote', direct: j.answer, details: j.details || [], evidence, strength: j.strength || 'moderate', ms: j.ms || 0, scanned: j.scanned, coverage: j.coverage ?? 1, topic: 'general' };
}
async function ask(q, qaId) {
  q = (q || '').trim(); if (!q) return;
  if (VIEW.route !== '/app/ask') { VIEW.drawer = null; go('/app/ask'); await sleep(40); }
  const turn = { id: 't' + (++seq) + Date.now(), q, qa: qaId || null, qaClick: !!qaId, state: 'loading', step: 0 };
  VIEW.thread.push(turn); render({ top: false }); track('ask_started');
  let result, err;
  try { result = STATE.settings.endpoint ? await remoteAsk(q) : await resolveQuestionAsync(q, qaId || null); } catch (e) { err = e; }
  const el = () => document.querySelector(`[data-turn="${turn.id}"]`); el()?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  for (let i = 1; i <= 4; i++) { await sleep(270); turn.step = i; if (i < 4) render(); }
  if (err) { turn.state = 'error'; turn.error = String(err.message || err); }
  else { turn.result = result; turn.state = 'done'; track(result.kind === 'abstain' ? 'abstain_shown' : 'answer_shown'); logResult(turn); }
  render(); el()?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const inp = $('#ask-in'); inp && inp.focus({ preventScroll: true });
}
const turnOf = id => VIEW.thread.find(x => x.id === id);

/* ---------- tour ---------- */
async function tourNext() {
  const i = VIEW.tour; VIEW.tourBusy = true; renderOv();
  if (i === 0) await ask(questionText(qaById('d-metformin')), 'd-metformin');
  else if (i === 1) { const tn = VIEW.thread[VIEW.thread.length - 1]; VIEW.drawer = { type: 'src', turn: tn.id, i: 0 }; }
  else if (i === 2) { VIEW.drawer = null; await ask(questionText(qaById('h-serum')), 'h-serum'); }
  else if (i === 3) await ask(questionText(qaById('x-pediatric')), 'x-pediatric');
  else if (i === 4) go('/app/gaps');
  else if (i === 5) go('/app/analytics');
  VIEW.tourBusy = false;
  if (i >= TOUR_N - 1) { VIEW.tour = null; tourRestore(); go('/app/ask'); } else VIEW.tour = i + 1;
  renderOv();
}
function tourRestore() {
  VIEW.tourSession = false;
  if (!VIEW.tourPrev) return;
  Object.assign(STATE.settings, VIEW.tourPrev); VIEW.tourPrev = null;
  VIEW.thread = []; rebuild(); save();
}
function tourStart() {
  // Persist onboarding with the real settings, then shield the temporary demo
  // overrides from save() until the tour is restored.
  VIEW.tourSession = false; STATE.onboarded = true; save();
  VIEW.tourPrev = { useDemo: STATE.settings.useDemo, scripted: STATE.settings.scripted };
  STATE.settings.useDemo = true; STATE.settings.scripted = true;
  VIEW.tourSession = true;
  rebuild(); VIEW.thread = []; VIEW.drawer = null; VIEW.qs = null; VIEW.ob = null;
  VIEW.tour = 0; VIEW.tourT0 = Date.now(); track('tour_started'); go('/app'); render({ top: true });
}
function saveEndpoint(value) {
  const url = backendURL((value || '').trim());
  if (value && !url) { toast(t('toast.badurl'), 'err'); return false; }
  STATE.settings.endpoint = url || ''; save(); render();
  toast(url ? t('toast.ep.on') : t('toast.ep.off'));
  return true;
}
function resetAll() {
  LS.del(STORAGE_KEY);
  Object.assign(STATE, freshState()); STATE.onboarded = true; LANG = 0;
  VIEW.thread = []; VIEW.confirm = null; VIEW.drawer = null;
  rebuild(); save(); render(); toast(t('toast.reset'));
}

/* ---------- events ---------- */
function setLang(i) {
  LANG = i; STATE.lang = i; track('lang_changed'); save(); if (STATE.settings.ai && Augment.ready()) Augment.indexChunks(allChunks(), LANG); VIEW.thread.forEach(tn => { if (tn.qaClick && tn.qa) tn.q = questionText(qaById(tn.qa)); }); render(); toast(t('toast.lang', LANGS[i][2]));
}
function closeOverlay() {
  if (VIEW.qs) VIEW.qs = null; else if (VIEW.confirm) VIEW.confirm = null; else if (VIEW.drawer) VIEW.drawer = null; else if (VIEW.ob != null) { VIEW.ob = null; STATE.onboarded = true; save(); } else return false;
  renderOv(); if (lastFocus && document.contains(lastFocus)) lastFocus.focus(); return true;
}
function evText(e) { return `${citeStr(e.chunk)}\n"${e.lines.map(i => lt(e.chunk, i)).join(' … ')}"`; }
document.addEventListener('click', async ev => {
  const el = ev.target.closest('[data-act]'); if (!el) return; const a = el.dataset.act, d = el.dataset;
  if (el.tagName === 'A' && a !== 'demo') ev.preventDefault();
  // Track citation triggers too, so closing the drawer restores focus to them.
  if (!['close', 'qclose', 'cclose', 'obskip'].includes(a)) lastFocus = el;
  switch (a) {
    case 'lang': setLang(+d.i); break;
    case 'theme': STATE.theme = d.v; save(); render(); break;
    case 'goto': VIEW.qs = null; VIEW.drawer = null; go(d.r); break;
    case 'menu': VIEW.navOpen = !VIEW.navOpen; render(); break;
    case 'scroll': document.getElementById(d.id)?.scrollIntoView({ behavior: 'smooth' }); break;
    case 'lp': VIEW.lp = +d.i; render(); break;
    case 'ask': VIEW.qs = null; ask(d.q, d.qa || null); break;
    case 'clear': VIEW.thread = []; render(); break;
    case 'src': VIEW.drawer = { type: 'src', turn: d.turn, i: +d.i }; track('citation_opened'); renderOv(); break;
    case 'doc': VIEW.drawer = { type: 'doc', id: d.id }; VIEW.qs = null; renderOv(); break;
    case 'close': case 'qclose': case 'cclose': case 'obskip': closeOverlay(); break;
    case 'copy': copyText(plainAnswer(turnOf(d.turn))); break;
    case 'copycite': copyText(turnOf(d.turn).result.evidence.map((e, i) => `[${i + 1}] ${citeStr(e.chunk)}`).join('\n'), t('toast.citecopied')); break;
    case 'copyone': copyText(evText(turnOf(d.turn).result.evidence[+d.i]), t('toast.citecopied')); break;
    case 'share': copyText(`${t('app.name')}\n${plainAnswer(turnOf(d.turn))}`, t('toast.shared')); break;
    case 'fb': { const cur = STATE.feedback[d.turn]; STATE.feedback[d.turn] = cur === d.v ? undefined : d.v; if (!STATE.feedback[d.turn]) delete STATE.feedback[d.turn]; save(); render(); if (STATE.feedback[d.turn]) toast(d.v === 'report' ? t('toast.reported') : t('toast.thanks')); break; }
    case 'tour': tourStart(); break;
    case 'tournext': tourNext(); break;
    case 'tourend': VIEW.tour = null; tourRestore(); renderOv(); render(); break;
    case 'qs': VIEW.qs = { q: '', sel: 0 }; renderOv(); break;
    case 'qrun': { const it = qsItems()[+d.i]; if (!it) break; VIEW.qs = null; renderOv(); const x = it.act; if (x.act === 'ask') ask(x.q, x.qa); else if (x.act === 'doc') { VIEW.drawer = { type: 'doc', id: x.id }; renderOv(); } else go(x.r); break; }
    case 'onboard': VIEW.ob = 0; renderOv(); break;
    case 'obnext': if (VIEW.ob >= 2) { VIEW.ob = null; STATE.onboarded = true; save(); } else VIEW.ob++; renderOv(); break;
    case 'pick': if (ev.target.closest('[data-act=sample]')) { addSample(); break; } $('#file-in')?.click(); break;
    case 'sample': addSample(); break;
    case 'ltype': VIEW.libType = d.v; render(); break;
    case 'gtab': VIEW.gapTab = d.v; render(); break;
    case 'resolve': { const g = STATE.gaps.find(x => x.id === d.id); g.status = g.status === 'open' ? 'resolved' : 'open'; save(); render(); toast(g.status === 'resolved' ? t('toast.resolved') : t('toast.reopened')); break; }
    case 'rerun': { const g = STATE.gaps.find(x => x.id === d.id); ask(gapQ(g), g.qa); break; }
    case 'rm': VIEW.confirm = { id: d.id }; renderOv(); break;
    case 'rmgo': {
      if (d.id === '__reset') { resetAll(); break; }
      const nm = (docById(d.id) || {}).name; if (DEMO_DOCS.find(x => x.id === d.id)) STATE.removed.push(d.id); else STATE.uploads = STATE.uploads.filter(u => u.id !== d.id);
      VIEW.confirm = null; VIEW.drawer = null; rebuild(); save(); render(); toast(t('toast.removed', nm)); break; }
    case 'retry': { const f = FILES.get(d.id); if (f) { VIEW.drawer = null; processUpload(f, d.id); } else toast(t('toast.reupload'), 'err'); break; }
    case 'restore': STATE.removed = []; rebuild(); save(); render(); toast(t('toast.restored')); break;
    case 'tai': {
      if (STATE.settings.ai) { STATE.settings.ai = false; Augment.disable(); save(); render(); toast(t('toast.ai.off')); break; }
      STATE.settings.ai = true; save(); render(); toast(t('toast.ai.loading'));
      const ok = await Augment.enable();
      if (ok) { await Augment.indexChunks(allChunks(), LANG); toast(t('toast.ai.on')); }
      else { STATE.settings.ai = false; save(); toast(t('toast.ai.fail'), 'err'); }
      render(); break; }
    case 'tdetails': STATE.settings.details = !STATE.settings.details; save(); render(); break;
    case 'maxsrc': STATE.settings.maxSources = +d.v; save(); render(); break;
    case 'saveep': saveEndpoint($('#endpoint').value); break;
    case 'tdemo': STATE.settings.useDemo = !STATE.settings.useDemo; VIEW.thread = []; rebuild(); save(); render(); toast(STATE.settings.useDemo ? t('toast.demo.on') : t('toast.demo.off')); break;
    case 'tscripted': STATE.settings.scripted = !STATE.settings.scripted; VIEW.thread = []; save(); render(); toast(t(STATE.settings.scripted ? 'toast.scripted.on' : 'toast.scripted.off')); break;
    case 'reset': VIEW.confirm = { reset: true }; renderOv(); break;
  }
});
document.addEventListener('submit', ev => { const f = ev.target.closest('[data-form=ask]'); if (!f) return; ev.preventDefault(); const inp = f.querySelector('input'); const v = inp.value; inp.value = ''; ask(v, null); });
document.addEventListener('input', ev => {
  const id = ev.target.id;
  if (id === 'lib-q') { VIEW.libQ = ev.target.value; $('#lib-body').innerHTML = libTable(); }
  else if (id === 'thr') { STATE.settings.threshold = ev.target.value / 100; $('#thr-v').textContent = ev.target.value + '%'; }
  else if (id === 'semthr') { STATE.settings.semThr = ev.target.value / 100; $('#semthr-v').textContent = ev.target.value + '%'; }
  else if (id === 'qs-in') { VIEW.qs.q = ev.target.value; VIEW.qs.sel = 0; const pos = ev.target.selectionStart; renderOv(); const el = $('#qs-in'); el.focus(); el.setSelectionRange(pos, pos); }
});
document.addEventListener('change', ev => {
  const id = ev.target.id;
  if (id === 'lib-st') { VIEW.libStatus = ev.target.value; render(); } else if (id === 'thr' || id === 'semthr') save();
  else if (id === 'file-in') { [...ev.target.files].forEach(f => processUpload(f)); ev.target.value = ''; }
});
document.addEventListener('keydown', ev => {
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k') { ev.preventDefault(); if (VIEW.route === '/') return go('/app'); VIEW.qs = VIEW.qs ? null : { q: '', sel: 0 }; renderOv(); return; }
  if (ev.key === 'Escape' && closeOverlay()) { ev.preventDefault(); return; }
  if (ev.target && ev.target.dataset && ev.target.dataset.act === 'gtab' && (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft')) {
    ev.preventDefault();
    const tabs = ['open', 'resolved', 'all'], i = tabs.indexOf(VIEW.gapTab);
    VIEW.gapTab = tabs[(i + (ev.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    render(); document.getElementById('gap-tab-' + VIEW.gapTab)?.focus(); return;
  }
  if (ev.key === 'Tab') {
    const ov = $('#ov'), root = ov && ov.firstElementChild;
    const f = root ? [...ov.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')] : [];
    if (f.length) {
      const first = f[0], last = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      else if (!ov.contains(document.activeElement)) { ev.preventDefault(); first.focus(); }
    }
  }
  if (VIEW.qs) {
    const n = qsItems().length;
    if (ev.key === 'ArrowDown') { ev.preventDefault(); VIEW.qs.sel = (VIEW.qs.sel + 1) % n; renderOv(); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); VIEW.qs.sel = (VIEW.qs.sel - 1 + n) % n; renderOv(); }
    else if (ev.key === 'Enter') { ev.preventDefault(); document.querySelector(`[data-act=qrun][data-i="${VIEW.qs.sel}"]`)?.click(); }
  } else if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.id === 'drop') { ev.preventDefault(); $('#file-in')?.click(); }
});
['dragover', 'drop'].forEach(n => window.addEventListener(n, ev => { if (ev.dataTransfer && [...ev.dataTransfer.types].includes('Files')) { ev.preventDefault(); const z = ev.target.closest && ev.target.closest('#drop'); $('#drop')?.classList.toggle('over', n === 'dragover' && !!z); if (n === 'drop' && z) [...ev.dataTransfer.files].forEach(f => processUpload(f)); } }));
window.addEventListener('hashchange', route);
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => STATE.theme === 'system' && applyTheme());

/* ---------- boot ---------- */
STATE.uploads.forEach(u => { if (u.status === 'processing') { u.status = 'failed'; u.error = 'interrupted'; } });
setInterval(() => {
  const el = $('#tour-clock'); if (!el || VIEW.tour == null) return;
  const s = tourSeconds();
  el.textContent = s > 0 ? clockText(s) : t('tour.timeup');
  el.classList.toggle('warnc', s === 0);
}, 1000);
Augment.on(() => { const el = $('#ai-status'); if (el) el.textContent = aiStatusText(); });
rebuild(); route();
if (STATE.settings.ai) Augment.enable().then(ok => { if (ok) Augment.indexChunks(allChunks(), LANG); });
