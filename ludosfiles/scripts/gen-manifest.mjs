// Regenerates src/data/covers.ts — the slot id → image mapping the <Cover>
// component reads.
//
//   npm run covers
//
// Two sources, in priority order:
//
//   1. public/covers/<key>.<ext>  — full-resolution drop-ins you supply. One
//      file fills every slot the registry lists for that game.
//   2. public/images/<slot>.webp  — the low-resolution art exported from the
//      design tool, used for anything without a drop-in.
//
// The registry lives in covers.config.mjs. Crop transforms saved in the design
// tool are carried over for legacy art only; a drop-in is assumed to be framed
// correctly already.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COVER_SOURCES, NO_ARTWORK } from '../covers.config.mjs';
import { appSlots, GAME_SLOT_PREFIXES } from './lib/slots.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'src/data/covers.ts');
const coversDir = resolve(root, 'public/covers');
const imagesDir = resolve(root, 'public/images');

const EXTENSIONS = ['webp', 'png', 'jpg', 'jpeg', 'avif'];

/** Crop transforms saved in the design tool, keyed by slot id. */
function legacyCrops() {
  const shim = {};
  const manifestPath = resolve(root, 'project/image-manifest.js');
  if (!existsSync(manifestPath)) return {};
  new Function('window', readFileSync(manifestPath, 'utf8'))(shim);
  return shim.IMAGE_SLOT_STATIC ?? {};
}

/** Reads WebP/PNG/JPEG dimensions from the file header, for the coverage report. */
function imageSize(buf) {
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const f = buf.toString('ascii', 12, 16);
    if (f === 'VP8X') return { w: buf.readUIntLE(24, 3) + 1, h: buf.readUIntLE(27, 3) + 1 };
    if (f === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (f === 'VP8L') {
      const v = buf.readUInt32LE(21);
      return { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 };
    }
  }
  if (buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let o = 2;
    while (o < buf.length - 9) {
      if (buf[o] !== 0xff) { o++; continue; }
      const m = buf[o + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return { w: buf.readUInt16BE(o + 7), h: buf.readUInt16BE(o + 5) };
      }
      o += 2 + buf.readUInt16BE(o + 2);
    }
  }
  return null;
}

const { all: validSlots } = appSlots();
const crops = legacyCrops();
const noArtwork = new Set(NO_ARTWORK);

/** Resolves a registry entry to the slot ids it owns. */
function slotsFor(entry) {
  const slots = new Set();
  for (const key of entry.keys ?? []) {
    for (const prefix of GAME_SLOT_PREFIXES) {
      const id = `cv-${prefix}-${key}`;
      if (validSlots.has(id)) slots.add(id);
    }
  }
  for (const id of entry.slots ?? []) slots.add(id);
  return slots;
}

/** Finds a drop-in file for a registry key. */
function dropIn(key) {
  for (const ext of EXTENSIONS) {
    if (existsSync(resolve(coversDir, `${key}.${ext}`))) return `${key}.${ext}`;
  }
  return null;
}

const manifest = {};
const owned = new Map();
const report = { hires: [], legacy: [], orphanSlots: [], unknownFiles: [], missingSlots: [] };

for (const [key, entry] of Object.entries(COVER_SOURCES)) {
  const slots = slotsFor(entry);

  for (const id of entry.slots ?? []) {
    if (!validSlots.has(id)) report.missingSlots.push(`${key} → ${id}`);
  }

  for (const id of slots) {
    if (owned.has(id)) report.missingSlots.push(`${id} claimed by both ${owned.get(id)} and ${key}`);
    owned.set(id, key);
  }

  const file = dropIn(key);
  if (file) {
    const size = imageSize(readFileSync(resolve(coversDir, file)));
    report.hires.push({ key, title: entry.title, file, slots: slots.size, size });
    // A drop-in is authored at the right framing; no crop transform applies.
    for (const id of slots) manifest[id] = { src: `/covers/${file}` };
  } else {
    report.legacy.push({ key, title: entry.title, slots: slots.size });
    for (const id of slots) {
      if (!existsSync(resolve(imagesDir, `${id}.webp`))) continue;
      const crop = crops[id] ?? {};
      manifest[id] = {
        src: `/images/${id}.webp`,
        ...(crop.s != null ? { s: crop.s } : {}),
        ...(crop.x != null ? { x: crop.x } : {}),
        ...(crop.y != null ? { y: crop.y } : {}),
      };
    }
  }
}

// Slots no registry entry claims (marquee tiles, etc.) keep their exported art.
for (const id of validSlots) {
  if (manifest[id] || noArtwork.has(id)) continue;
  if (!existsSync(resolve(imagesDir, `${id}.webp`))) continue;
  const crop = crops[id] ?? {};
  manifest[id] = {
    src: `/images/${id}.webp`,
    ...(crop.s != null ? { s: crop.s } : {}),
    ...(crop.x != null ? { x: crop.x } : {}),
    ...(crop.y != null ? { y: crop.y } : {}),
  };
  report.orphanSlots.push(id);
}

// Drop-in files that match no registry key — almost always a typo.
if (existsSync(coversDir)) {
  for (const file of readdirSync(coversDir)) {
    if (file.startsWith('.') || file.endsWith('.md')) continue;
    const key = file.replace(/\.[^.]+$/, '');
    if (!COVER_SOURCES[key]) report.unknownFiles.push(file);
  }
}

const entries = Object.keys(manifest)
  .sort()
  .map((id) => {
    const v = manifest[id];
    const fields = [`src: ${JSON.stringify(v.src)}`];
    for (const p of ['s', 'x', 'y']) if (v[p] != null) fields.push(`${p}: ${v[p]}`);
    return `  ${JSON.stringify(id)}: { ${fields.join(', ')} },`;
  });

writeFileSync(
  out,
  `// Generated by scripts/gen-manifest.mjs — do not hand-edit.
// Sources: full-resolution drop-ins in public/covers/, falling back to the
// design tool's exported art in public/images/. Edit covers.config.mjs to
// change which slots a piece of artwork fills, then run: npm run covers
//
// \`s\` / \`x\` / \`y\`, when present, are a legacy crop transform:
// \`transform: translate(x%, y%) scale(s)\` on an object-fit: cover <img>.

export interface CoverEntry {
  src: string;
  /** scale factor */
  s?: number;
  /** horizontal offset, % of the frame */
  x?: number;
  /** vertical offset, % of the frame */
  y?: number;
}

export const COVERS: Record<string, CoverEntry> = {
${entries.join('\n')}
};
`,
);

// ── Report ────────────────────────────────────────────────────────
const SMALL = 500; // below this height, art is upscaled on a 3× phone screen
console.log(`\n${entries.length} slots mapped → src/data/covers.ts\n`);

if (report.hires.length) {
  console.log(`Full-resolution drop-ins (${report.hires.length}):`);
  for (const r of report.hires.sort((a, b) => a.key.localeCompare(b.key))) {
    const dim = r.size ? `${r.size.w}×${r.size.h}` : 'unreadable';
    const warn = r.size && r.size.h < SMALL ? '  ⚠ below 600×900' : '';
    console.log(`  ${r.key.padEnd(28)} ${dim.padEnd(11)} → ${r.slots} slot(s)${warn}`);
  }
  console.log('');
}

console.log(`Still on exported art (${report.legacy.length} games):`);
console.log(
  '  ' +
    report.legacy
      .map((r) => r.key)
      .sort()
      .join(', ') || '  none',
);
console.log(`\n  drop files in public/covers/ named <key>.webp to replace them`);

if (report.orphanSlots.length) {
  console.log(`\nUnclaimed slots keeping exported art (${report.orphanSlots.length}):`);
  console.log(`  marquee tiles, plus library art with no full-resolution drop-in`);
}
if (report.unknownFiles.length) {
  console.log(`\n⚠ Files in public/covers/ matching no registry key:`);
  for (const f of report.unknownFiles) console.log(`    ${f}`);
}
if (report.missingSlots.length) {
  console.log(`\n⚠ Registry problems:`);
  for (const m of report.missingSlots) console.log(`    ${m}`);
}
console.log('');
