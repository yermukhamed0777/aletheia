/* Fast unit harness for rules that cannot be driven through a UI.
 * Run: node unit.mjs. Every check is a command with a recorded PASS/FAIL line.
 */
import { makeContext, run } from './harness.mjs';

let pass = 0, fail = 0;
const ok = (cond, msg) => {
  if (cond) { pass++; console.log('  PASS ' + msg); }
  else { fail++; console.log('  FAIL ' + msg); }
};
const safe = fn => { try { return { value: fn() }; } catch (e) { return { error: e }; } };
const expr = (ctx, code) => safe(() => run(ctx, code));
const call = (ctx, code) => expr(ctx, code);

console.log('UNIT — boot and pure rules');

// 1. Every source file must evaluate in the real bundle order.
ok(!expr(makeContext().ctx, '1').error, 'all source files boot without a top-level error');

// 2. Backend URL validation (P0-3).
{
  const { ctx } = makeContext();
  const b = v => expr(ctx, 'backendURL(' + JSON.stringify(v) + ')').value;
  ok(b('') === '', 'empty endpoint is allowed and stored as empty');
  ok(b('https://example.com/api/ask') === 'https://example.com/api/ask', 'https endpoint accepted');
  ok(b('http://localhost:8000/ask') === 'http://localhost:8000/ask', 'http localhost accepted');
  ok(b('http://127.0.0.1:8000/ask') === 'http://127.0.0.1:8000/ask', 'http loopback accepted');
  ok(b('http://example.com/ask') === null, 'plain http endpoint rejected');
  ok(b('https://user:pw@example.com/ask') === null, 'credentials in URL rejected');
  ok(b('https://example.com/ask#frag') === null, 'URL fragment rejected');
  ok(b('javascript:alert(1)') === null, 'non-http scheme rejected');
}

// 3. Persisted state is sanitised on load; no fabricated analytics survive (P0-1/strategy).
{
  const { ctx } = makeContext({}, {
    'altheia.state': JSON.stringify({
      settings: { endpoint: 'http://evil.example/x', maxSources: 99 },
      liveTop: { 'fake': { n: 999 } },
      history: [{ id: 'h1', ts: Date.now(), status: 'answer', ms: 1 }],
    }),
  });
  ok(call(ctx, 'STATE.settings.endpoint').value === '', 'unsafe persisted endpoint dropped on load');
  ok(call(ctx, 'STATE.settings.maxSources').value === 99, 'other persisted settings preserved');
  ok(call(ctx, "'liveTop' in STATE").value === false, 'legacy fabricated liveTop removed on load');
  ok(call(ctx, 'freshState().history.length').value === 0, 'fresh state has no seeded history');
  ok(call(ctx, "Object.keys(freshState()).some(k=>/seed|liveTop/i.test(k))").value === false, 'fresh state has no fabricated counters');
}

// 4. Analytics must be built only from real recorded history.
{
  const { ctx } = makeContext();
  const st = call(ctx, 'stats()');
  ok(!st.error && st.value.total === 0 && st.value.rate === 0, 'empty state reports zero searches and zero rate');
  ok(!call(ctx, 'chartSVG()').error, 'chart renders with no fabricated seed days');
  ok(!call(ctx, 'analyticsView()').error, 'analytics view renders with empty history');
  ok(!call(ctx, 'dashboardView()').error, 'dashboard view renders with empty history');
}

// 5. Remote answers must render a real citation with a non-empty location (P0-1).
{
  const { ctx } = makeContext();
  ctx.fetch = async () => ({
    ok: true,
    json: async () => ({
      status: 'answer', answer: 'Use 500 mg twice daily.', details: ['Check renal function.'],
      citations: [{ doc: 'formulary.pdf', location: 'p. 4', excerpt: 'Metformin 500 mg twice daily.' }],
      ms: 12, scanned: 3, coverage: 0.9, strength: 'moderate',
    }),
  });
  let r;
  try { r = { value: await run(ctx, 'remoteAsk("question")') }; }
  catch (e) { r = { error: e }; }
  ok(!r.error && r.value.kind === 'remote', 'remote answer path resolves');
  const ev = r.value && r.value.evidence && r.value.evidence[0];
  ok(!!ev && ev.source && ev.source.name === 'formulary.pdf', 'remote evidence carries its own source');
  ok(!!ev && call(ctx, 'locLabel(' + JSON.stringify(ev ? ev.chunk.loc : {}) + ')').value === 'p. 4', 'remote citation keeps its location');
  const view = call(ctx, 'turnView(' + JSON.stringify({ id: 't1', q: 'question', state: 'done', result: r.value || {} }) + ')');
  ok(!view.error && view.value.includes('formulary.pdf') && view.value.includes('p. 4'), 'answer view renders a named citation and location');
  const drawer = call(ctx, "(function(){VIEW.drawer={type:'src',turn:'t1',i:0};VIEW.thread=[{id:'t1',q:'question',state:'done',result:RESULT}];return srcDrawer()})()".replace('RESULT', JSON.stringify(r.value || {})));
  ok(!drawer.error && drawer.value.includes('p. 4'), 'source drawer opens the remote citation with a non-empty location');
}

// 6. Upload state must be truthful when persistence fails (P0-9).
{
  const { ctx } = makeContext();
  let r;
  try { r = { value: await run(ctx, 'processUpload(new File(["alpha beta gamma"], "notes.txt"))') }; }
  catch (e) { r = { error: e }; }
  ok(!r.error, 'TXT upload resolves');
  ok(call(ctx, "STATE.uploads[STATE.uploads.length-1].status").value === 'processed', 'successful upload marked processed');
  const failing = makeContext({ localStorage: { getItem: () => null, setItem: () => { throw new Error('quota'); }, removeItem() {} } });
  try { await run(failing.ctx, 'processUpload(new File(["alpha beta gamma"], "notes.txt"))'); }
  catch { /* failure is asserted below */ }
  ok(call(failing.ctx, "STATE.uploads[STATE.uploads.length-1].error").value === 'storage', 'quota failure records a storage reason code');
  ok(call(failing.ctx, "STATE.uploads[STATE.uploads.length-1].status").value === 'failed', 'quota failure marks upload failed, not processed');
}

// 7. Reset must not depend on removed seed helpers.
{
  const { ctx } = makeContext();
  const r = call(ctx, 'resetAll()');
  ok(!r.error, 'resetAll() exists and runs');
  ok(call(ctx, 'STATE.history.length').value === 0 && call(ctx, 'STATE.gaps.length').value === 0, 'reset clears history and gaps');
}

// 8. Endpoint save uses the same validator as load.
{
  const { ctx } = makeContext();
  call(ctx, "saveEndpoint('http://evil.example/x')");
  ok(call(ctx, 'STATE.settings.endpoint').value === '', 'saveEndpoint rejects unsafe URL');
  call(ctx, "saveEndpoint('https://ok.example/x')");
  ok(call(ctx, 'STATE.settings.endpoint').value === 'https://ok.example/x', 'saveEndpoint stores a valid URL');
}

// 9. Content-free event harness: allowlisted names, integer counts, no text, no network.
{
  const { ctx, sandbox } = makeContext();
  let net = 0;
  sandbox.fetch = async () => { net++; throw new Error('network'); };
  const snap = call(ctx, 'EVENT_SNAPSHOT()');
  ok(!snap.error && Object.keys(snap.value).length === 0, 'event log starts empty');
  ok(call(ctx, "track('bogus_event')").value === false, 'unknown event name is rejected');
  ok(call(ctx, "track('ask_started')").value === true, 'allowlisted event is accepted');
  ok(call(ctx, "track('ask_started')").value === true, 'repeat event increments the same counter');
  const after = call(ctx, 'EVENT_SNAPSHOT()');
  ok(!after.error && after.value.ask_started === 2, 'event counts are integers');
  ok(Object.values(after.value || {}).every(Number.isInteger), 'every emitted value is an integer count');
  ok(Object.keys(after.value || {}).every(k => call(ctx, 'EVENT_ALLOW.includes(' + JSON.stringify(k) + ')').value), 'every emitted key is on the allowlist');
  ok(net === 0, 'emitters never transmit over the network');
}

console.log('UNIT ' + (fail ? 'FAILED' : 'PASSED') + ' — ' + pass + ' passed, ' + fail + ' failed');
if (fail) process.exit(1);
