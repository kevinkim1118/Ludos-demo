// Packs the built app into one self-contained HTML file for preview.
//
//   npm run build && node scripts/pack-single.mjs
//
// Inlines JS, CSS, fonts, and cover art as data URIs so the page runs from a
// single file with no network requests — needed for hosts that block external
// requests, and handy for opening the prototype on a phone before deploying.
//
// src/data/covers.ts is generated pre-pruned to the slots this build can
// reach, so everything the bundle references gets inlined.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const out = resolve(root, 'preview.html');

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const read = (p) => readFileSync(resolve(root, p));
const src = (p) => readFileSync(resolve(root, p), 'utf8');

const html = src('dist/index.html');
const assets = readdirSync(resolve(dist, 'assets'));
const jsFile = assets.find((f) => f.endsWith('.js'));
const cssFile = assets.find((f) => f.endsWith('.css'));

// Fonts → data URIs inside the stylesheet.
let css = src(`dist/assets/${cssFile}`);
for (const font of readdirSync(resolve(dist, 'fonts'))) {
  const uri = `data:font/woff2;base64,${read(`dist/fonts/${font}`).toString('base64')}`;
  css = css.split(`/fonts/${font}`).join(uri);
}

// Cover art → data URIs inside the JS bundle's manifest.
//
// covers.ts is generated pre-pruned to the slots this build can reach, so
// anything the bundle references is needed by definition. Both sources are
// scanned: full-resolution drop-ins in covers/, exported art in images/.
const MIME = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', avif: 'image/avif' };

let js = src(`dist/assets/${jsFile}`);
let inlined = 0;
let bytes = 0;

for (const dir of ['covers', 'images']) {
  let files;
  try {
    files = readdirSync(resolve(dist, dir));
  } catch {
    continue; // covers/ is optional
  }
  for (const file of files) {
    const token = `/${dir}/${file}`;
    if (!js.includes(token)) continue;
    const ext = file.split('.').pop().toLowerCase();
    const mime = MIME[ext];
    if (!mime) continue;
    const buf = read(`dist/${dir}/${file}`);
    bytes += buf.length;
    inlined++;
    js = js.split(token).join(`data:${mime};base64,${buf.toString('base64')}`);
  }
}

// Anything still pointing at a file path would 404 in a single-file page.
const stubbed = (js.match(/\/(images|covers)\/[\w.-]+\.(webp|png|jpe?g|avif)/g) ?? []).length;
js = js.replace(/\/(images|covers)\/[\w.-]+\.(webp|png|jpe?g|avif)/g, PIXEL);

// Ludos was chosen dark-only (chat 1), and the shell's non-token chrome is
// hardcoded dark — but the design system still ships a light palette under
// [data-theme="light"]. A host that stamps that attribute would half-flip the
// app into a theme it was never designed for, so re-assert the dark tokens at
// higher specificity and pin color-scheme.
const darkTokens = src('src/styles/ludos.css').match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
css += `\n:root{color-scheme:dark}\n:root[data-theme="light"]{${darkTokens}}\n`;

const packed = html
  .replace(/<script[^>]*src="[^"]*\.js"[^>]*><\/script>/, () => `<script type="module">${js}</script>`)
  .replace(/<link[^>]*href="[^"]*\.css"[^>]*>/, () => `<style>${css}</style>`)
  // Preload hints point at files that no longer exist in a single-file build.
  .replace(/<link[^>]*rel="preload"[^>]*>/g, '')
  .replace(/<link[^>]*rel="icon"[^>]*>/, '');

writeFileSync(out, packed);

console.log(
  `inlined ${inlined} images (${(bytes / 1024 / 1024).toFixed(2)} MB)` + (stubbed ? `, ${stubbed} unresolved → stubbed` : '') + '\n' +
    `→ ${out} — ${(Buffer.byteLength(packed) / 1024 / 1024).toFixed(2)} MB`,
);
