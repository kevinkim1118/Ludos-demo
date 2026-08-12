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
//
// Two kinds of source get handled differently — see `fullBleed` below. A mark
// floating in transparent margin is centred and inset; artwork already composed
// to its own edges is used as it is.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { IOS_DEVICES, splashFile, splashMedia, splashSize } from './lib/ios-devices.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const brandDir = resolve(root, 'brand');
const outDir = resolve(root, 'public/icons');
const splashDir = resolve(root, 'public/splash');
const indexHtml = resolve(root, 'index.html');

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

const rendered = await sharp(source, { density: 512 })
  .ensureAlpha()
  .toBuffer({ resolveWithObject: true });

/**
 * The mark with the source's own transparent margin removed — transparent
 * only, never a colour.
 *
 * This used to trim by colour, which reads the top-left pixel as "background"
 * and cuts everything matching it off the edges. That silently ate the L of the
 * current logo, whose own artwork starts in that corner, and shipped icons
 * showing the O alone.
 */
const mark = await sharp(rendered.data)
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
  .toBuffer({ resolveWithObject: true });

/**
 * Nothing transparent at the edges means the artwork is already composed to
 * them — a finished icon rather than a mark needing a plate. Insetting one of
 * those second-guesses the design, and the transparency it does carry is
 * interior, so it gets the theme colour behind it instead of a hole for the
 * wallpaper to show through.
 */
const fullBleed =
  mark.info.width >= rendered.info.width && mark.info.height >= rendered.info.height;

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

/**
 * Full-bleed artwork fills every output, including the maskable one: letting
 * the launcher crop edge-to-edge art is what maskable icons are *for*, and
 * shrinking it into the safe circle would leave a small mark adrift in a dark
 * field on every Android launcher. A mark on a plate is the opposite case — it
 * can't afford to be cropped, so it gets the derived safe-zone scale.
 */
const maskable = fullBleed ? 1 : maskableScale(mark.info.width, mark.info.height);
const plain = fullBleed ? 1 : SCALE.plain;
const apple = fullBleed ? 1 : SCALE.apple;

/**
 * Every output gets the theme colour behind it, `any` included. Keeping those
 * transparent is the usual advice, but the mark is off-white — on a light
 * launcher, taskbar or tab strip it would be a red circle beside an invisible
 * L. The plate is part of the identity, not packaging around it.
 */
const outputs = [
  { file: 'icon-192.png', build: () => icon(192, plain, BACKGROUND) },
  { file: 'icon-512.png', build: () => icon(512, plain, BACKGROUND) },
  { file: 'icon-maskable-512.png', build: () => icon(512, maskable, BACKGROUND) },
  { file: 'apple-touch-icon-180.png', build: () => icon(180, apple, BACKGROUND) },
];

const meta = await sharp(source).metadata();
console.log(
  `\nsource: brand/${source.split('/').pop()}  ${meta.width}×${meta.height} ${meta.format}` +
    `  → mark ${mark.info.width}×${mark.info.height} after trim` +
    `  (${fullBleed ? 'full-bleed: used as composed' : 'inset on the theme colour'})`,
);

if (meta.format !== 'svg' && Math.min(meta.width, meta.height) < 512) {
  console.log(`  ⚠ below 512×512 — the 512 icon will be upscaled`);
}
console.log(
  fullBleed
    ? 'maskable: edge to edge, the launcher crops'
    : `maskable safe-zone scale: ${maskable.toFixed(3)}`,
);

console.log('');
for (const { file, build } of outputs) {
  const pipeline = await build();
  const info = await pipeline.toFile(resolve(outDir, file));
  console.log(`  ${file.padEnd(26)} ${info.width}×${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
}

console.log(`\n${outputs.length} icons → public/icons/`);

// ── iOS launch images ─────────────────────────────────────────────
// Without these Safari shows a white screen while the app boots, which on a
// dark app reads as a flash. Each is the theme colour with the mark centred —
// the same thing the first frame renders, so the transition is invisible.

mkdirSync(splashDir, { recursive: true });

/** The mark, sized to a share of the narrower edge so it reads the same on every device. */
const SPLASH_MARK_SHARE = 0.34;

let splashBytes = 0;
for (const device of IOS_DEVICES) {
  const { width, height } = splashSize(device);
  const inner = Math.round(Math.min(width, height) * SPLASH_MARK_SHARE);
  const resized = await sharp(mark.data).resize(inner, inner, { fit: 'inside' }).toBuffer();

  const info = await sharp({
    create: { width, height, channels: 4, background: BACKGROUND },
  })
    .composite([{ input: resized, gravity: 'centre' }])
    .png({ palette: true })
    .toFile(resolve(splashDir, splashFile(device)));

  splashBytes += info.size;
}

console.log(
  `${IOS_DEVICES.length} launch images → public/splash/  ` +
    `(${(splashBytes / 1024).toFixed(0)} KB total)`,
);

// ── index.html link tags ──────────────────────────────────────────
// Written straight into index.html between markers, so the device list can
// never drift out of sync with the images that were actually produced.

const START = '<!-- GENERATED by scripts/gen-icons.mjs — do not hand-edit -->';
const END = '<!-- /GENERATED -->';

const links = IOS_DEVICES.map(
  (d) =>
    `    <link\n` +
    `      rel="apple-touch-startup-image"\n` +
    `      media="${splashMedia(d)}"\n` +
    `      href="/splash/${splashFile(d)}"\n` +
    `    />`,
).join('\n');

const html = readFileSync(indexHtml, 'utf8');
const startAt = html.indexOf(START);
const endAt = html.indexOf(END);

if (startAt === -1 || endAt === -1) {
  console.log(
    `\n⚠ index.html has no ${START} … ${END} block — launch image links not written.\n`,
  );
} else {
  const next =
    html.slice(0, startAt + START.length) + '\n' + links + '\n    ' + html.slice(endAt);
  if (next !== html) {
    writeFileSync(indexHtml, next);
    console.log(`${IOS_DEVICES.length} startup-image links → index.html`);
  } else {
    console.log(`index.html already up to date`);
  }
}

console.log('');
