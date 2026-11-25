/* ---------- Optional local Augment: semantic embeddings + OCR (all in the browser, no API keys) ----------
   Off by default. Everything here is best-effort: any failure leaves the proven BM25 pipeline untouched. */
const Augment = (() => {
  const CDN = {
    tjs: 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3',
    model: 'Xenova/multilingual-e5-small',
    pdfjs: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs',
    pdfWorker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs',
    tess: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',
  };
  const st = { status: 'off', progress: 0, error: '', embedder: null, vec: new Map(), indexing: false, ocr: 'idle' };
  const listeners = new Set();
  const notify = () => listeners.forEach(f => { try { f(); } catch { } });

  const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };

  async function enable() {
    if (st.status === 'ready' || st.status === 'loading') return st.status === 'ready';
    st.status = 'loading'; st.progress = 0; st.error = ''; notify();
    try {
      if (!st.embedder) {
        const tjs = await import(/* @vite-ignore */ CDN.tjs);
        const pipe = await tjs.pipeline('feature-extraction', CDN.model, {
          dtype: 'q8',
          progress_callback: p => { if (p && typeof p.progress === 'number') { st.progress = Math.max(st.progress, Math.round(p.progress)); notify(); } },
        });
        st.embedder = async (texts) => {
          const out = await pipe(texts, { pooling: 'mean', normalize: true });
          const dim = out.dims[out.dims.length - 1], d = out.data;
          return texts.map((_, i) => Float32Array.from(d.slice(i * dim, (i + 1) * dim)));
        };
      }
      st.status = 'ready'; st.progress = 100; notify(); return true;
    } catch (e) {
      st.status = 'error'; st.error = String(e && e.message || e); notify(); return false;
    }
  }
  function disable() { st.status = 'off'; notify(); }
  const ready = () => st.status === 'ready' && !!st.embedder;

  const chunkText = (c, lang) => {
    const parts = (c.lines || []).map((_, i) => Retrieval.lineText(c, i, lang));
    return ((c.docName ? c.docName + '. ' : '') + parts.join(' ')).slice(0, 1400);
  };
  const cacheKey = (c, lang) => c.id + '|' + lang + '|' + (c.lines || []).length;

  // Embed all chunks that have no vector yet (batched, resumable)
  async function indexChunks(chunks, lang) {
    if (!ready() || st.indexing) return;
    st.indexing = true; notify();
    try {
      const todo = chunks.filter(c => !st.vec.has(cacheKey(c, lang)));
      for (let i = 0; i < todo.length; i += 8) {
        const batch = todo.slice(i, i + 8);
        const vs = await st.embedder(batch.map(c => 'passage: ' + chunkText(c, lang)));
        batch.forEach((c, j) => st.vec.set(cacheKey(c, lang), vs[j]));
        await new Promise(r => setTimeout(r, 0));
      }
    } catch (e) { st.error = String(e && e.message || e); }
    st.indexing = false; notify();
  }

  // Semantic ranking. Returns [{chunk, sim, line, lineSims}] best first. Never throws.
  async function search(question, chunks, lang, topN = 3) {
    if (!ready()) return [];
    try {
      const [qv] = await st.embedder(['query: ' + question]);
      const rows = [];
      chunks.forEach(c => { const v = st.vec.get(cacheKey(c, lang)); if (v) rows.push({ chunk: c, sim: dot(qv, v) }); });
      rows.sort((a, b) => b.sim - a.sim);
      const top = rows.slice(0, topN);
      // pick the best lines inside the leading chunks
      for (const r of top) {
        const n = (r.chunk.lines || []).length;
        if (n <= 1) { r.lines = [0]; r.bestLine = 0; continue; }
        const txt = r.chunk.lines.map((_, i) => 'passage: ' + Retrieval.lineText(r.chunk, i, lang));
        const vs = await st.embedder(txt);
        const ls = vs.map((v, i) => ({ i, s: dot(qv, v) })).sort((a, b) => b.s - a.s); r.bestLine = ls[0].i; r.lines = ls.filter(x => x.s >= ls[0].s - 0.04).slice(0, 2).map(x => x.i).sort((a, b) => a - b);
      }
      return top;
    } catch (e) { st.error = String(e && e.message || e); return []; }
  }

  /* ----- OCR ----- */
  let tessP = null;
  function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('script-load')); document.head.appendChild(s); });
  }
  async function ocrWorker() {
    if (!window.Tesseract) await (tessP ||= loadScript(CDN.tess));
    return window.Tesseract.createWorker(['rus', 'kaz', 'eng']);
  }
  // returns array of page texts
  async function ocrPDF(buf, onProgress, maxPages = 12) {
    st.ocr = 'run'; notify();
    try {
      const pdfjs = await pdfjsLoad();
      const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
      const n = Math.min(doc.numPages, maxPages), w = await ocrWorker(), texts = [];
      for (let p = 1; p <= n; p++) {
        const page = await doc.getPage(p), vp = page.getViewport({ scale: 2 });
        const cv = document.createElement('canvas'); cv.width = vp.width; cv.height = vp.height;
        await page.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise;
        const r = await w.recognize(cv); texts.push((r.data.text || '').trim());
        onProgress && onProgress(p, n);
      }
      await w.terminate(); st.ocr = 'idle'; notify();
      return { texts, pageCount: doc.numPages };
    } catch (e) { st.ocr = 'idle'; notify(); throw e; }
  }
  async function ocrImage(file) {
    st.ocr = 'run'; notify();
    try { const w = await ocrWorker(); const r = await w.recognize(file); await w.terminate(); st.ocr = 'idle'; notify(); return (r.data.text || '').trim(); }
    catch (e) { st.ocr = 'idle'; notify(); throw e; }
  }

  return { st, enable, disable, ready, indexChunks, search, ocrPDF, ocrImage, on: f => listeners.add(f), dot };
})();
