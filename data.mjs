/* Data-layer tests: drive the real client-side parsers with synthetic,
 * non-sensitive files. No network, no user data. Run: node data.mjs
 */
import { makeContext, run } from './harness.mjs';

let pass = 0, fail = 0;
const ok = (cond, msg) => {
  if (cond) { pass++; console.log('  PASS ' + msg); }
  else { fail++; console.log('  FAIL ' + msg); }
};

const enc = new TextEncoder();
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
const crc32 = buf => { let c = ~0; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (~c) >>> 0; };
const concat = parts => { const out = new Uint8Array(parts.reduce((a, p) => a + p.length, 0)); let o = 0; for (const p of parts) { out.set(p, o); o += p.length; } return out; };

// Minimal ZIP writer (stored entries) — only used to build test fixtures.
function zip(entries) {
  const local = [], central = []; let offset = 0;
  for (const [name, content] of entries) {
    const nb = enc.encode(name), data = content instanceof Uint8Array ? content : enc.encode(content), crc = crc32(data);
    const lh = new Uint8Array(30 + nb.length), lv = new DataView(lh.buffer);
    lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(8, 0, true);
    lv.setUint32(14, crc, true); lv.setUint32(18, data.length, true); lv.setUint32(22, data.length, true);
    lv.setUint16(26, nb.length, true); lh.set(nb, 30);
    const ch = new Uint8Array(46 + nb.length), cv = new DataView(ch.buffer);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true);
    cv.setUint32(16, crc, true); cv.setUint32(20, data.length, true); cv.setUint32(24, data.length, true);
    cv.setUint16(28, nb.length, true); cv.setUint32(42, offset, true); ch.set(nb, 46);
    local.push(lh, data); central.push(ch); offset += lh.length + data.length;
  }
  const cdSize = central.reduce((a, c) => a + c.length, 0), eocd = new Uint8Array(22), ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, entries.length, true); ev.setUint16(10, entries.length, true);
  ev.setUint32(12, cdSize, true); ev.setUint32(16, offset, true);
  return concat([...local, ...central, eocd]);
}

const { ctx } = makeContext();
async function upload(name, bytes) {
  ctx.__file = new File([bytes], name);
  await run(ctx, 'processUpload(__file)');
  const uploads = run(ctx, 'STATE.uploads');
  const d = uploads[uploads.length - 1];
  if (d.status !== 'processed') console.log('    ' + name + ' -> ' + d.status + ' / ' + d.error);
  return d;
}
const textOf = doc => (doc.chunks || []).map(c => (c.lines || []).join(' ')).join(' ').toLowerCase();

console.log('DATA — synthetic parser fixtures');
{
  const d = await upload('dose.txt', enc.encode('Metformin 500 mg twice daily.\n\nMaximum daily dose is 2000 mg.\n'));
  ok(d.status === 'processed', 'TXT: processed');
  ok(d.chunks.length > 0 && !!d.chunks[0].loc.lines, 'TXT: line-located passages');
  ok(textOf(d).includes('2000 mg'), 'TXT: text extracted');
}
{
  const d = await upload('prices.csv', enc.encode('item,price\nMetformin 500mg,1200\nParacetamol,300\n'));
  ok(d.status === 'processed', 'CSV: processed');
  ok(d.chunks.length > 0 && !!d.chunks[0].loc.rows, 'CSV: sheet/row-located passages');
  ok(textOf(d).includes('item: metformin 500mg'), 'CSV: header-to-field mapping');
}
{
  const xml = '<?xml version="1.0"?><w:document><w:body>' +
    '<w:p><w:t>Specimen serum is spun at 1600 g.</w:t></w:p>' +
    '<w:p><w:t>Citrate tubes are used for coagulation.</w:t></w:p></w:body></w:document>';
  const d = await upload('sop.docx', zip([['word/document.xml', xml]]));
  ok(d.status === 'processed', 'DOCX: processed through the in-repo ZIP reader');
  ok(d.chunks.length > 0 && !!d.chunks[0].loc.para, 'DOCX: paragraph-located passages');
  ok(textOf(d).includes('1600 g'), 'DOCX: paragraph text extracted');
}
{
  const entries = [
    ['xl/workbook.xml', '<?xml version="1.0"?><workbook><sheets><sheet name="Dosages" sheetId="1" r:id="rId1"/></sheets></workbook>'],
    ['xl/_rels/workbook.xml.rels', '<?xml version="1.0"?><Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>'],
    ['xl/sharedStrings.xml', '<?xml version="1.0"?><sst><si>drug</si><si>dose</si><si>metformin</si><si>500 mg</si></sst>'],
    ['xl/worksheets/sheet1.xml', '<?xml version="1.0"?><worksheet><sheetData>' +
      '<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c></row>' +
      '<row r="2"><c r="A2" t="s"><v>2</v></c><c r="B2" t="s"><v>3</v></c></row>' +
      '</sheetData></worksheet>'],
  ];
  const d = await upload('formulary.xlsx', zip(entries));
  ok(d.status === 'processed', 'XLSX: processed through workbook relationships');
  ok(d.chunks.length > 0 && d.chunks[0].loc.sheet === 'Dosages' && !!d.chunks[0].loc.rows, 'XLSX: sheet+row locations');
  ok(textOf(d).includes('drug: metformin'), 'XLSX: shared strings joined into records');
}
{
  const stream = 'BT /F1 12 Tf 72 720 Td (Metformin 500 mg twice daily with food. Maximum 2000 mg per day.) Tj ET';
  const pdf = '%PDF-1.4\n' +
    '1 0 obj\n<< /Type /Catalog >>\nendobj\n' +
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n' +
    '3 0 obj\n<< /Type /Page /Contents 4 0 R >>\nendobj\n' +
    '4 0 obj\n<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream\nendobj\ntrailer\n<< /Root 1 0 R >>\n';
  const d = await upload('note.pdf', enc.encode(pdf));
  ok(d.status === 'processed', 'PDF: text-stream fallback extracts a simple page');
  ok(d.chunks.length > 0 && !!d.chunks[0].loc.page, 'PDF: page-located passages');
  ok(textOf(d).includes('metformin 500 mg'), 'PDF: text extracted');
}
{
  const d = await upload('empty.txt', new Uint8Array(0));
  ok(d.status === 'failed' && d.error === 'empty', 'empty file: failed with reason code, not processed');
  const u = await upload('archive.bin', enc.encode('x'));
  ok(u.status === 'failed' && u.error === 'unsupported', 'unsupported extension: failed with reason code');
}
{
  const n = run(ctx, 'STATE.uploads.filter(u => u.status === "processed").length');
  ok(n === 5, 'five synthetic sources indexed: ' + n);
  const r = run(ctx, 'Retrieval.search(INDEX, "What is the maximum daily dose of metformin?", {threshold:0.6})');
  ok(!!r && ['answer', 'abstain'].includes(r.status), 'indexed synthetic sources remain queryable');
}

console.log('DATA ' + (fail ? 'FAILED' : 'PASSED') + ' — ' + pass + ' passed, ' + fail + ' failed');
if (fail) process.exit(1);
