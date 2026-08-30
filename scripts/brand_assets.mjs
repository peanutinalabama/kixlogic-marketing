// Brand asset pipeline (2026-08-30 rebrand): from the master logo PNG,
// produce the nav lockup, the square mark, and every favicon size; also
// pull the four iOS app icons into public/apps/ at web weight.
// Run from repo root: node scripts/brand_assets.mjs "<master-logo.png>"
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { execSync } from "node:child_process";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let PNG;
try { PNG = require("pngjs").PNG; } catch {
  execSync("npm install --no-save pngjs", { stdio: "inherit" });
  PNG = require("pngjs").PNG;
}

const SRC = process.argv[2];
if (!SRC || !fs.existsSync(SRC)) { console.error("pass the master logo png"); process.exit(1); }

const read = (p) => PNG.sync.read(fs.readFileSync(p));

function bboxNonWhite(img, threshold = 240) {
  let minX = img.width, minY = img.height, maxX = 0, maxY = 0;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const i = (y * img.width + x) * 4;
      if (!(img.data[i] > threshold && img.data[i + 1] > threshold && img.data[i + 2] > threshold)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, minY, maxX, maxY };
}

/// Bilinear resample a crop of src into a w*h RGB buffer on white.
function render(src, crop, w, h) {
  const out = Buffer.alloc(w * h * 3, 255);
  const sx0 = crop.minX, sy0 = crop.minY;
  const sw = crop.maxX - crop.minX + 1, sh = crop.maxY - crop.minY + 1;
  const scale = Math.min(w / sw, h / sh);
  const ox = (w - sw * scale) / 2, oy = (h - sh * scale) / 2;
  const at = (x, y) => {
    const i = (y * src.width + x) * 4;
    return [src.data[i], src.data[i + 1], src.data[i + 2]];
  };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const sx = sx0 + (x - ox) / scale, sy = sy0 + (y - oy) / scale;
      if (sx < 0 || sy < 0 || sx >= src.width - 1 || sy >= src.height - 1) continue;
      const x0 = Math.floor(sx), y0 = Math.floor(sy), fx = sx - x0, fy = sy - y0;
      const p00 = at(x0, y0), p10 = at(x0 + 1, y0), p01 = at(x0, y0 + 1), p11 = at(x0 + 1, y0 + 1);
      const o = (y * w + x) * 3;
      for (let c = 0; c < 3; c++) {
        out[o + c] = Math.round(p00[c] * (1 - fx) * (1 - fy) + p10[c] * fx * (1 - fy) +
                                p01[c] * (1 - fx) * fy + p11[c] * fx * fy);
      }
    }
  }
  return out;
}

function writePng(file, rgb, w, h) {
  const chunk = (tag, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(tag), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2;
  const raw = Buffer.alloc(h * (w * 3 + 1));
  for (let y = 0; y < h; y++) {
    rgb.copy(raw, y * (w * 3 + 1) + 1, y * w * 3, (y + 1) * w * 3);
  }
  fs.writeFileSync(file, Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]));
  console.log(`wrote ${file} (${w}x${h})`);
}
function crc32(buf) {
  let c; const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

const master = read(SRC);
const full = bboxNonWhite(master);

// The square MARK is the left, blue-dominant region. Find blue bbox.
let mMinX = master.width, mMinY = master.height, mMaxX = 0, mMaxY = 0;
for (let y = 0; y < master.height; y += 2) {
  for (let x = 0; x < master.width; x += 2) {
    const i = (y * master.width + x) * 4;
    const [r, g, b] = [master.data[i], master.data[i + 1], master.data[i + 2]];
    if (b > 140 && b > r + 40 && g > r) {   // the bright brand blue
      if (x < mMinX) mMinX = x;
      if (x > mMaxX) mMaxX = x;
      if (y < mMinY) mMinY = y;
      if (y > mMaxY) mMaxY = y;
    }
  }
}
const mark = { minX: mMinX, minY: mMinY, maxX: mMaxX, maxY: mMaxY };
console.log(`lockup bbox ${full.minX},${full.minY}..${full.maxX},${full.maxY}; mark ${mMinX},${mMinY}..${mMaxX},${mMaxY}`);

// Nav lockup: 2x for retina at ~44px display height.
{
  const sw = full.maxX - full.minX + 1, sh = full.maxY - full.minY + 1;
  const h = 96, w = Math.round((sw / sh) * h);
  writePng("public/kixlogic-logo.png", render(master, full, w, h), w, h);
}
// Square mark + favicons.
const pad = Math.round((mark.maxX - mark.minX) * 0.06);
const markCrop = { minX: mark.minX - pad, minY: mark.minY - pad, maxX: mark.maxX + pad, maxY: mark.maxY + pad };
for (const [file, size] of [
  ["public/kixlogic-mark.png", 512],
  ["public/favicon-512.png", 512],
  ["public/favicon-192.png", 192],
  ["public/favicon-32.png", 32],
  ["public/apple-touch-icon.png", 180],
]) {
  writePng(file, render(master, markCrop, size, size), size, size);
}

// App icons → public/apps/ at 320px.
fs.mkdirSync("public/apps", { recursive: true });
const APPS = [
  ["pixalary", "C:/dev/pixalary-ios/Pixalary/Assets.xcassets/AppIcon.appiconset/AppIcon.png"],
  ["bingopalooza", "C:/dev/bingopalooza-ios/Bingopalooza/Assets.xcassets/AppIcon.appiconset/AppIcon.png"],
  ["auravo", "C:/dev/auralis/Auralis/Assets.xcassets/AppIcon.appiconset/AppIcon.png"],
  ["lilyfi", "C:/dev/lilyfi/LilyFi/Assets.xcassets/AppIcon.appiconset/AppIcon.png"],
];
for (const [name, srcPath] of APPS) {
  if (!fs.existsSync(srcPath)) { console.log(`SKIP ${name}: ${srcPath} missing`); continue; }
  const icon = read(srcPath);
  const crop = { minX: 0, minY: 0, maxX: icon.width - 1, maxY: icon.height - 1 };
  writePng(path.join("public", "apps", `${name}.png`), render(icon, crop, 320, 320), 320, 320);
}
