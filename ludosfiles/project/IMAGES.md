# Images — static assets

All artwork is committed to the repo as real files. Nothing needs to be
re-uploaded or re-dropped.

## Layout

- `images/*.webp` — 189 image files, one per slot id (e.g. `images/cv-lib-hades.webp`)
- `images/manifest.json` — `{ "<slot-id>": { "src": "...", "s"?, "x"?, "y"? } }`
- `image-manifest.js` — same data as `window.IMAGE_SLOT_STATIC`, loaded before `image-slot.js`
- `.image-slots.state.json` — **editor-only** sidecar of base64 copies. Not needed
  for deploy; delete it and every image still renders from `images/`.

`s` / `x` / `y`, when present, are the crop transform for that image:
`transform: translate(x%, y%) scale(s)` on the `<img>` inside its cropping box,
with `object-fit: cover`.

## Deploying

Copy `images/` and `image-manifest.js` alongside the HTML. Any static host
(Vercel included) serves them as-is — no build step, no runtime, no external URLs.
On Vercel with a framework preset, move `images/` into `public/` and drop the
`images/` prefix accordingly.

## Removing the `<image-slot>` runtime

`<image-slot>` is a drag-and-drop authoring affordance; in production it is just
an `<img>`. To strip it, for each slot:

```html
<!-- from -->
<image-slot id="cv-lib-hades" shape="rounded" radius="8" style="…"></image-slot>

<!-- to -->
<img src="images/cv-lib-hades.webp" alt="" style="…; object-fit: cover; border-radius: 8px;">
```

Slots whose id is data-driven (`id="{{ item.slotId }}"`) need the source in the
data instead: add `coverSrc: 'images/' + slotId + '.webp'` where the item is
built in `renderVals()`, and bind `src="{{ item.coverSrc }}"`.

Once no `<image-slot>` tags remain, delete `image-slot.js`, `image-manifest.js`,
and `.image-slots.state.json`.
