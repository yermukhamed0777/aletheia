import fs from 'node:fs';
const read = f => fs.readFileSync(new URL('./src/' + f, import.meta.url), 'utf8');
const js = ['corpus.js', 'retrieval.js', 'augment.js', 'strings.js', 'events.js', 'pdfreader.js', 'model.js', 'interface.js', 'pages.js', 'controller.js'].map(read).join('\n;\n');
const b64 = f => fs.readFileSync(new URL('./vendor/' + f, import.meta.url)).toString('base64');
const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Aletheia — Verified answers from your protocols</title><meta name="description" content="Aletheia: evidence-first clinical retrieval. Verified answers from your protocols, with the exact source.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='9' fill='%23241F4B'/%3E%3Cpath d='M8 17a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8-8v8m0 0 4-4' fill='none' stroke='%23C7B8FF' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">
<style>${read('theme.css')}</style></head><body>
<div id="root"></div><div id="ov"></div><div class="toasts" id="toasts" aria-live="polite"></div>
<noscript>This application requires JavaScript.</noscript>
<script type="text/plain" id="pdfjs-main">${b64('pdf.min.mjs')}</script><script type="text/plain" id="pdfjs-worker">${b64('pdf.worker.min.mjs')}</script>
<script>${js}</script></body></html>`;
fs.mkdirSync(new URL('./dist/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('./dist/index.html', import.meta.url), html);
console.log('built', (html.length / 1024).toFixed(0) + ' KB');
