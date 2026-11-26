/* Test harness: boot the real browser sources in a VM with minimal DOM stubs.
 * This catches undefined globals and top-level crashes that syntax-only lint
 * misses. No production code imports this file.
 */
import fs from 'node:fs';
import vm from 'node:vm';

export const ORDER = [
  'corpus.js', 'retrieval.js', 'augment.js', 'strings.js', 'events.js', 'pdfreader.js',
  'model.js', 'interface.js', 'pages.js', 'controller.js',
];

function fakeEl() {
  const el = {
    innerHTML: '', textContent: '', value: '', selectionStart: 0, tagName: 'DIV',
    dataset: {}, children: [], firstElementChild: null,
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    style: {},
    focus() {}, remove() {}, appendChild() {}, setAttribute() {},
    contains() { return false; }, scrollIntoView() {}, addEventListener() {},
    setSelectionRange() {}, querySelector() { return null; },
    get firstChild() { return this.children[0] || null; },
  };
  return el;
}

const hostSetTimeout = globalThis.setTimeout;

export function makeContext(extra = {}, seed = {}) {
  const store = new Map(Object.entries(seed));
  const sandbox = {
    console, performance,
    // Run short delays immediately (sleep() in the app) but skip long UI timers.
    setTimeout: (fn, ms) => { if ((ms || 0) <= 500) hostSetTimeout(fn, 0); return 0; },
    clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
    fetch: async () => { throw new Error('network disabled in harness'); },
    localStorage: {
      getItem: k => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: k => store.delete(k),
    },
    document: {
      documentElement: { dataset: {}, lang: '' },
      body: fakeEl(), head: fakeEl(), activeElement: null,
      querySelector: () => fakeEl(), getElementById: () => fakeEl(),
      createElement: () => fakeEl(), addEventListener() {},
    },
    window: { scrollTo() {}, addEventListener() {} },
    location: { hash: '' },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    navigator: { clipboard: { writeText: async () => {} }, platform: '' },
    atob: globalThis.atob, btoa: globalThis.btoa,
    Blob: globalThis.Blob, File: globalThis.File, Response: globalThis.Response,
    TextDecoder: globalThis.TextDecoder, TextEncoder: globalThis.TextEncoder,
    DecompressionStream: globalThis.DecompressionStream,
    URL: globalThis.URL,
    ...extra,
  };
  const ctx = vm.createContext(sandbox);
  for (const f of ORDER) vm.runInContext(fs.readFileSync('src/' + f, 'utf8'), ctx, { filename: f });
  return { ctx, sandbox, store };
}

export const run = (ctx, code) => vm.runInContext(code, ctx);
