/**
 * Take the newest screenshot Windows saved and install it as one of the
 * /hero gallery images.
 *
 *   node scripts/use-screenshot.mjs ribbon
 *   node scripts/use-screenshot.mjs ribbon --crop 0,0,1340,220
 *
 * Win + PrtScn saves straight into Pictures\Screenshots. Win + Shift + S
 * only copies to the clipboard, which is why pasted shots never appear on
 * disk. This looks in every folder Windows might have used, newest first.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync, inflateSync } from 'node:zlib';

const SLOTS = ['ribbon', 'findings', 'powers', 'disposition', 'split-by-manager'];
const slot = process.argv[2];
if (!SLOTS.includes(slot)) {
  console.error(`usage: node scripts/use-screenshot.mjs <${SLOTS.join('|')}> [--crop x,y,w,h]`);
  process.exit(2);
}
const cropArg = process.argv.includes('--crop') ? process.argv[process.argv.indexOf('--crop') + 1] : null;

const home = process.env.USERPROFILE || process.env.HOME || '';
const folders = [
  join(home, 'Pictures', 'Screenshots'),
  join(home, 'OneDrive', 'Pictures', 'Screenshots'),
  join(home, 'Pictures'),
  join(home, 'Downloads'),
  join(home, 'Desktop'),
];

const candidates = [];
for (const dir of folders) {
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)) {
    if (!/\.png$/i.test(name)) continue;
    const full = join(dir, name);
    try { candidates.push({ full, at: statSync(full).mtimeMs }); } catch { /* skip */ }
  }
}
if (!candidates.length) {
  console.error('No PNG found in Pictures\\Screenshots, Pictures, Downloads or Desktop.');
  console.error('Press Win + PrtScn (not Win + Shift + S) — that writes a file; the other only copies to the clipboard.');
  process.exit(1);
}
candidates.sort((a, b) => b.at - a.at);
const src = candidates[0];
const age = Math.round((Date.now() - src.at) / 60000);

const dest = join('src', 'assets', 'shots', `${slot}.png`);
mkdirSync(join('src', 'assets', 'shots'), { recursive: true });

if (!cropArg) {
  copyFileSync(src.full, dest);
} else {
  const [x, y, w, h] = cropArg.split(',').map(Number);
  writeFileSync(dest, crop(readFileSync(src.full), x, y, w, h));
}

const png = readFileSync(dest);
console.log(`${src.full}`);
console.log(`  saved ${age} minute${age === 1 ? '' : 's'} ago -> ${dest}  ${png.readUInt32BE(16)}x${png.readUInt32BE(20)}  ${Math.round(png.length / 1024)}KB`);

/** Crop a PNG without any image library: inflate, slice rows, re-deflate. */
function crop(buf, x0, y0, w, h) {
  let off = 8, ihdr = null;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') ihdr = Buffer.from(data);
    else if (type === 'IDAT') idat.push(data);
    off += 12 + len;
  }
  const W = ihdr.readUInt32BE(0), H = ihdr.readUInt32BE(4);
  const CH = { 0: 1, 2: 3, 4: 2, 6: 4 }[ihdr[9]];
  if (!CH || ihdr[8] !== 8 || ihdr[12] !== 0) throw new Error('unsupported PNG for cropping');
  const stride = W * CH;
  const z = inflateSync(Buffer.concat(idat));
  const px = Buffer.alloc(stride * H);
  const paeth = (a, b, c) => { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c; };
  for (let y = 0; y < H; y++) {
    const ft = z[y * (stride + 1)];
    const s = z.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const row = px.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? px.subarray((y - 1) * stride, y * stride) : null;
    for (let i = 0; i < stride; i++) {
      const a = i >= CH ? row[i - CH] : 0, b = prev ? prev[i] : 0, c = prev && i >= CH ? prev[i - CH] : 0;
      let v = s[i];
      if (ft === 1) v += a; else if (ft === 2) v += b; else if (ft === 3) v += (a + b) >> 1; else if (ft === 4) v += paeth(a, b, c);
      row[i] = v & 0xff;
    }
  }
  const cw = Math.min(w, W - x0), chh = Math.min(h, H - y0);
  const outStride = cw * CH;
  const raw = Buffer.alloc((outStride + 1) * chh);
  for (let y = 0; y < chh; y++) {
    raw[y * (outStride + 1)] = 0;
    px.copy(raw, y * (outStride + 1) + 1, (y0 + y) * stride + x0 * CH, (y0 + y) * stride + (x0 + cw) * CH);
  }
  const table = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (b) => { let c = 0xffffffff; for (const v of b) c = table[(c ^ v) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const cc = Buffer.alloc(4); cc.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, cc]);
  };
  const head = Buffer.from(ihdr);
  head.writeUInt32BE(cw, 0); head.writeUInt32BE(chh, 4);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', head),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
