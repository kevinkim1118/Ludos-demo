# Drop cover art here

Put a full-resolution image in this folder named after its key in
`covers.config.mjs`, then run:

```bash
npm run covers
```

Every slot that shows that game switches to your file — one image covers the
picker, the Discover rails, the pick card, the duel, and the outcome screen.

## Naming

The filename is the registry key, not the game's title:

```
public/covers/hades-ii.webp        → Hades II  (4 slots)
public/covers/elden-ring.webp      → Elden Ring, incl. the Discover spotlight
public/covers/ludos-logo.png       → the welcome screen logo
```

`npm run covers` lists every key still on the old exported art, and warns about
files here whose name matches no key — so a typo shows up immediately rather
than silently doing nothing.

## Size

**600 × 900** — the Steam vertical capsule spec. The largest on-screen use is
the head-to-head outcome, which needs 480 × 720 on a 3× phone screen, so 600 ×
900 covers everything with headroom. The generator warns if a drop-in is
smaller than that.

`.webp`, `.png`, `.jpg` and `.avif` all work. WebP at quality ~0.85 keeps a
600 × 900 cover around 40–60 KB. The logo wants a transparent PNG.

Art is displayed with `object-fit: cover`, so anything that isn't 2:3 gets
centre-cropped to fit.

## Why this exists

The art exported from the design tool was recompressed three times to fit under
a 2 MB storage cap, leaving covers around 240 px tall — roughly 2× too small for
a modern phone. That constraint is gone: these are real files served from
`public/`, with no size ceiling.

Files here are committed with the repo and ship with the build.
