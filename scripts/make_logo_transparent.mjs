// Charles 2026-08-30: footer logo shows a white box on the mist footer.
// Flood-fill exterior near-white to transparent, starting from the borders,
// so the white chevron INSIDE the blue tile stays opaque.
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(import.meta.url);
const { PNG } = require("pngjs");

const src = "public/kx-logo.png";
const png = PNG.sync.read(fs.readFileSync(src));
const { width: w, height: h, data } = png;

const isWhite = (i) => data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235;
const seen = new Uint8Array(w * h);
const stack = [];
for (let x = 0; x < w; x++) { stack.push(x, x + (h - 1) * w); }
for (let y = 0; y < h; y++) { stack.push(y * w, w - 1 + y * w); }

while (stack.length) {
  const p = stack.pop();
  if (seen[p]) continue;
  seen[p] = 1;
  if (!isWhite(p * 4)) continue;
  data[p * 4 + 3] = 0;
  const x = p % w, y = (p / w) | 0;
  if (x > 0) stack.push(p - 1);
  if (x < w - 1) stack.push(p + 1);
  if (y > 0) stack.push(p - w);
  if (y < h - 1) stack.push(p + w);
}

png.colorType = 6;
fs.writeFileSync(src, PNG.sync.write(png));
const cleared = seen.reduce((n, v, i) => n + (data[i * 4 + 3] === 0 ? 1 : 0), 0);
console.log(`kx-logo.png: ${w}x${h}, ${cleared} px now transparent`);
