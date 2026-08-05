// Regenerates public/icons/ — the raster app icons the web manifest points at.
//
//   npm run icons
//
// Source: brand/logo.png (or .svg), which sits outside public/ so the
// full-size original never ships. See brand/README.md.
//
// Four outputs, because the platforms disagree about what an icon is:
//
//   icon-192 / icon-512      transparent, the manifest's `any` purpose
//   icon-maskable-512        padded and opaque, so Android's circle/squircle
//                            crop can't shave the mark
//   apple-touch-icon-180     opaque, because iOS composites transparency onto
//                            black and would put a black square on the home
//                            screen

import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const brandDir = resolve(root, 'brand');
const outDir = resolve(root, 'public/icons');

/** Matches the theme-color meta in index.html and the manifest. */
const BACKGROUND = '#241B1D';

/**
 * How much of the canvas the mark itself occupies, after the source's own
 * padding is trimmed off. Measuring rather than trusting the source keeps these
 * predictable no matter how much whitespace the supplied logo carries.
 *
 *   plain     transparent icons — a little breathing room, nothing crops them
 *   apple     iOS only rounds the corners, so the mark can run closer to the edge
 *
 * The maskable scale isn't fixed here — see `maskableScale()`.
 */
const SCALE = { plain: 0.86, apple: 0.76 };

/**
 * The largest scale at which the mark's bounding box still fits inside a
 * maskable icon's safe zone — the circle of 80% diameter that Android
 * guarantees it won't crop.
 *
 * Fitting a `w × h` box inside a circle of radius `0.4 · size` means its
 * half-diagonal must not exceed that radius, which solves to
 * `0.8 · max(w,h) / hypot(w,h)` — 0.566 for a square, more for a long thin
 * mark. Derived rather than hardcoded so a differently-shaped logo stays
 * correct without anyone re-doing the trigonometry.
 */
function maskableScale(width, height) {
  return (0.8 * Math.max(width, height)) / Math.hypot(width, height);
}

const SOURCE_EXTENSIONS = ['svg', 'png', 'webp', 'jpg', 'jpeg'];

function findSource() {
  for (const ext of SOURCE_EXTENSIONS) {
    const p = resolve(brandDir, `logo.${ext}`);
    if (existsSync(p)) return p;
  }
  return null;
}

const source = findSource();
if (!source) {
  const found = existsSync(brandDir) ? readdirSync(brandDir).join(', ') : '(no brand/ directory)';
  console.error(
    `\nNo logo source found.\n\n` +
      `  Expected one of: ${SOURCE_EXTENSIONS.map((e) => `brand/logo.${e}`).join(', ')}\n` +
      `  brand/ contains: ${found}\n\n` +
      `See brand/README.md.\n`,
  );
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

/** The mark with the source's own transparent margin removed. */
const mark = await sharp(source, { density: 512 })
  .ensureAlpha()
  .trim()
  .toBuffer({ resolveWithObject: true });

/**
 * Centres the mark at `scale` of a `size` canvas, over `background` (null for
 * transparent). `fit: 'inside'` preserves the mark's aspect ratio, so a
 * non-square logo is letterboxed rather than stretched.
 */
async function icon(size, scale, background) {
  const inner = Math.round(size * scale);
  const resized = await sharp(mark.data)
    .resize(inner, inner, { fit: 'inside' })
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized, gravity: 'centre' }])
    .png();
}

const maskable = maskableScale(mark.info.width, mark.info.height);

const outputs = [
  { file: 'icon-192.png', build: () => icon(192, SCALE.plain, null) },
  { file: 'icon-512.png', build: () => icon(512, SCALE.plain, null) },
  { file: 'icon-maskable-512.png', build: () => icon(512, maskable, BACKGROUND) },
  { file: 'apple-touch-icon-180.png', build: () => icon(180, SCALE.apple, BACKGROUND) },
];

const meta = await sharp(source).metadata();
console.log(
  `\nsource: brand/${source.split('/').pop()}  ${meta.width}×${meta.height} ${meta.format}` +
    `  → mark ${mark.info.width}×${mark.info.height} after trim`,
);

if (meta.format !== 'svg' && Math.min(meta.width, meta.height) < 512) {
  console.log(`  ⚠ below 512×512 — the 512 icon will be upscaled`);
}
console.log(`maskable safe-zone scale: ${maskable.toFixed(3)}`);

console.log('');
for (const { file, build } of outputs) {
  const pipeline = await build();
  const info = await pipeline.toFile(resolve(outDir, file));
  console.log(`  ${file.padEnd(26)} ${info.width}×${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
}

console.log(`\n${outputs.length} icons → public/icons/\n`);
