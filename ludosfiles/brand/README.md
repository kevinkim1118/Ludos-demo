# Drop the app icon source here

One logo file named `logo`, in this folder:

```
brand/logo.svg     ← preferred
brand/logo.png     ← also fine
```

It's the source the home-screen and install icons are generated from.

This folder sits **outside `public/`** on purpose: everything under `public/` is
copied verbatim into `dist/` and would land in the service worker's precache, so
a 1024 px source would ship to every visitor for no reason. Only the generated
PNGs in `public/icons/` are meant to ship.

> **Not the same as `public/covers/ludos-logo.png`.** That one replaces the logo
> drawn *inside* the app on the welcome screen. This one becomes the icon on
> your phone's home screen. They can be the same artwork, but they're consumed
> by different pipelines and a file in the wrong folder silently does nothing.

## Size

**SVG if you have it** — it scales to every output size with no quality loss.

Otherwise PNG or WebP at **1024 × 1024**. 512 is the floor; below that the
largest icon upscales and looks soft on a 3× screen. The existing
`public/images/intro-logo.webp` is 350 × 350, which is why it isn't used as the
source.

Square. A non-square source gets letterboxed into the icon's safe area rather
than cropped, since cropping a logo usually eats the mark.

## Transparency, and what it tells the generator

**What sits at the edges of the file decides how it's treated.** Transparent
margin means a mark that needs a plate built around it; artwork reaching its own
edges means a finished icon that gets used as composed.

**A mark in transparent margin** — the margin is trimmed off, then:

- **Android / manifest icons** keep transparency
- **`apple-touch-icon`** is flattened onto `#241B1D` — iOS composites
  transparent pixels onto black, which would put a black square on the home
  screen
- **The maskable variant** is scaled into Android's safe circle, because it
  crops to a circle or squircle and a tightly-framed mark loses its edges

**Artwork composed to its own edges** (the current logo) is scaled to fill each
icon with nothing trimmed and nothing inset, on `#241B1D` throughout — including
maskable, since letting the launcher crop edge-to-edge art is what maskable
icons are for. Any transparency it carries is interior, and the theme colour
goes behind it rather than the wallpaper showing through.

Either way one file covers all four outputs. You don't need to export variants.
`npm run icons` prints which of the two it decided on — worth a glance.

## Generated from it

```
public/icons/icon-192.png
public/icons/icon-512.png
public/icons/icon-maskable-512.png
public/icons/apple-touch-icon-180.png
```

Those are generated — don't hand-edit them. Replace the source here and re-run
the generator, the same way `public/covers/` works with `npm run covers`.

## Why this exists

`public/favicon.svg` is the shelf mark simplified down to a 32 px browser tab —
it works as a fallback source, but it drops detail on purpose. If a
higher-fidelity original exists, this is where it goes so the home-screen icon
isn't derived from a favicon.

Files here are committed with the repo but excluded from the build — only the
generated icons in `public/icons/` ship.
