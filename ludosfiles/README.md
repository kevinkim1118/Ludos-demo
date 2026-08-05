# Ludos

A video game backlog app — discover what to play, track it, and settle
head-to-head matchups when you can't decide.

Built from the Claude Design handoff in [`project/`](project/), implementing
`Prototype.dc.html`. The bundle is kept intact as the design source of truth —
its original instructions are at [`project/HANDOFF.md`](project/HANDOFF.md), and
the chat transcripts behind the design decisions are in [`chats/`](chats/).

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the built output |
| `npm run typecheck` | Types only |
| `npm run smoke` | End-to-end walkthrough (needs `npm run dev` running; set `BASE_URL` to retarget) |
| `npm run covers` | Rebuild the cover manifest after adding art to `public/covers/` |
| `npm run icons` | Regenerate the app icons from `brand/logo.*` |
| `npm run pack` | Build a single self-contained `preview.html` — opens anywhere, no server |
| `npm run fonts` | Re-download the self-hosted webfonts |

## What's implemented

The three flows `Prototype.dc.html` contains:

**Onboarding** — four intro screens (welcome, an auto-scrolling cover carousel,
an add-to-list preview, sample reviews) → a played-games picker that unlocks at
ten selections → an analysis beat → the player-type result with taste axes and a
seeded backlog → the handoff into the app.

**Discover** — a pick card that offers a backlog game with an "Another" re-roll,
and flips to "Currently playing" with a status dropdown once something's in
flight. Below it, the head-to-head entry point and three rails ordered by the
trust ladder: friends → taste match → global. The `+` on any cover opens a
status sheet.

**Head-to-head** — pick a mood, then a winner-stays duel. A game wins on three
straight, after five matchups, or by outlasting the pool; the outcome can be
marked as playing, which takes over the Discover pick card.

The Library / Friends / Search / Profile tabs are stubs that report
"Not available in this demo", exactly as in the prototype.

### Deliberately carried over

- **The time sheet is unreachable.** Its markup and state exist, but nothing
  opens it — `onOpenTime` was never wired into the template in the prototype
  either (a leftover from the Library port). `state.time` still drives the pick
  card's session-fit line, defaulting to "a free evening". Wiring it up is one
  handler on a chip in `PickCard`.
- **`CONFIG.showRecommendedCard` and `CONFIG.friendsConnected` default to
  `false`**, matching the prototype's saved tweak state. That means the
  "Recommended for you" spotlight is hidden and the friends rail shows its
  cold-start prompt. Flip them in `src/config.ts`.

## Layout

```
src/
  config.ts              Values that were "Tweaks" panel props
  state/                 The state machine (reducer + timers/effects hook + save)
  data/                  Games, editorial content, generated cover manifest
  components/            Cover, PhoneShell, BottomSheet, Toast, icons
  screens/
    onboarding/          Intro screens, played-games picker, result, done
    home/                Discover, pick card, rails, spotlight, tab bar
    h2h/                 Intent, duel, outcome, cold start
  styles/
    ludos.css            Design system, vendored verbatim — don't hand-edit
    app.css              Shell, responsive frame, motion, interaction states
```

State lives in one reducer (`src/state/reducer.ts`) with pure transitions;
anything involving a timer — toasts, sheet exit animations, the duel's
resolve beat — is orchestrated in `src/state/useLudos.ts`.

## Saved state

`src/state/persistence.ts` mirrors the durable slice of state to `localStorage`
under `ludos.state`, so a reload — or a cold launch of the installed app —
doesn't replay onboarding or lose what you're playing.

Saved: `onboardingComplete`, `backlog`, `itemStatus`, `upNext`, `playingItem`,
`played`. Deliberately **not** saved: sheets, toasts, the in-flight duel, and
every other transient flag, so a launch never restores a half-open overlay.

The payload carries a version (`{ v: 1, … }`) and a save written by any other
version is discarded rather than migrated — bump `VERSION` whenever the shape
changes and old saves retire themselves. Individual fields are re-validated on
read too: the store is user-editable, so a malformed value degrades to its
default instead of crashing the boot.

The reducer stays pure. Hydration happens through `useReducer`'s init argument;
the write is an effect in `useLudos.ts`, memoized on the saved fields so a toast
or a duel frame doesn't touch `localStorage`.

**`?reset` wipes the save** and starts over at onboarding — the only way back
once it's complete.

## The phone frame

The designs were drawn in a 430×868 device mockup. Above 540px the app keeps
that frame (with the simulated 9:41 status bar) so it still demos like the
prototype; below 540px the frame and fake status bar drop away and the app runs
full-bleed at `100dvh` against the real device chrome, with safe-area insets for
notches. See the media query in `src/styles/app.css`.

## Fonts

The design's two faces — **Familjen Grotesk** (UI) and **Newsreader** (the
editorial serif for quotes and archetype names) — are self-hosted from
`public/fonts/` rather than pulled from the Google Fonts CDN at runtime. That
means no third-party request, no flash of fallback text, and the correct
typefaces even on a restricted network.

`src/styles/fonts.css` is generated. Both families are variable fonts, so each
`@font-face` carries a weight *range* (`400 700`) and one file serves every
weight. Latin and Latin-Extended subsets only — 6 files, ~347 KB total.

To change weights or add a subset, edit the `FAMILIES` / `KEEP_SUBSETS` lists in
`scripts/fetch-fonts.mjs` and run `npm run fonts`.

## Cover art

`src/data/covers.ts` maps each design slot id (`cv-h2h-hades`) to an image. It's
generated — edit `covers.config.mjs`, then run `npm run covers`.

Two sources, in priority order:

1. **`public/covers/<key>.webp`** — full-resolution art you supply. One file
   fills every slot for that game. See [`public/covers/README.md`](public/covers/README.md).
2. **`public/images/<slot>.webp`** — the art exported from the design tool, used
   for anything without a drop-in.

**Every registry key now has a 600 × 900 drop-in**, so nothing falls back to the
exported art any more. What's left in `public/images/` is the 18 decorative
marquee tiles on the onboarding screen, which no registry entry claims.

The exports were low-resolution for a reason worth remembering: they were
recompressed three times inside the design tool to fit under a 2 MB storage cap,
leaving covers ~240 px tall — about 2× too small for a 3× phone screen, and 2.8×
short at the head-to-head outcome. `npm run covers` reports any key that slips
back onto them.

One drop-in replaces every slot for a game at once, which also resolves the
duplicate-slot-id problem from the original prototype, where the same title was
keyed differently per screen (`cv-search-hades2`, `cv-fr-hades`, `cv-pick-hades`,
`cv-h2h-hades` are all Hades II).

`<Cover>` reproduces the design tool's crop geometry for legacy art: scale to
cover, then pan by a percentage of the box, clamped to the image's actual
overflow so a crop never exposes background. Drop-ins are assumed correctly
framed and carry no crop.

Slots with no artwork by design: the `cv-review-*` avatars render initials.
`<Cover>` falls back gracefully. (Stray used to be the other gap — `cv-pick-stray`
and `cv-h2h-stray` had nothing at all until the drop-ins landed.)

## Installable app

`vite-plugin-pwa` generates `manifest.webmanifest` and a Workbox service
worker at build time. Nothing to configure per environment — see
`vite.config.ts`.

**Icons** are generated from `brand/logo.svg` (or `.png`), which lives outside
`public/` so the full-size original never ships:

```bash
npm run icons
```

Four outputs into `public/icons/`, because the platforms disagree about what an
icon is: transparent 192 and 512 for the manifest's `any` purpose, a padded
opaque `maskable` variant, and an opaque 180 for iOS. The generator trims the
source's own margin first and derives the maskable scale from the mark's aspect
ratio, so the safe zone is respected whatever shape the logo is.

**What's precached** (~708 KB): the JS/CSS shell, `index.html`, the six
self-hosted fonts, the icons, and the Ludos logo. **Cover art is not** — at
1.6 MB it would more than triple the precache. So the app shell runs offline,
but covers need the network until a runtime caching strategy is added.

`registerType` is `autoUpdate`: a new build activates on next load rather than
waiting on a prompt. There's no "new version available" UI yet, and without one
a stale worker would pin users to an old build with no way out.

To test it, you need a real build — the service worker is off in `npm run dev`:

```bash
npm run build && npm run preview
```

### iOS

Safari ignores most of the manifest, so installability is spelled out in
`index.html` instead: `apple-touch-icon`, `mobile-web-app-capable` (and the
older prefixed spelling), `black-translucent` status bar, and the home-screen
title.

`npm run icons` also emits **11 portrait launch images** into `public/splash/`
and writes their `<link>` tags into `index.html` between `GENERATED` markers —
don't hand-edit those. Safari matches a launch image only when the media query
hits the device's CSS size *and* pixel ratio exactly, with no fallback and no
scaling, so a device missing from `scripts/lib/ios-devices.mjs` gets the plain
white flash instead. Add it there and re-run. They ship but are **not**
precached: iOS fetches them when the app is added to the home screen.

iOS has no install prompt — `beforeinstallprompt` is Chrome-only — so
`IosInstallHint` points at Share → Add to Home Screen. It shows once, on
Discover rather than mid-onboarding, only in Safari on iOS, and never once
installed. **`?hint` forces it on any device** so you don't need an iPhone to
look at it.

## Deploying

Static build, no server. On Vercel: framework preset **Vite**, build
`npm run build`, output `dist/`. `public/` is copied as-is, so cover art ships
with it.

## `?screen=` deep links

Replaces the prototype's "Jump to screen" tweak — handy for review:

```
?screen=onboarding:intro1 | intro2 | intro3 | intro4 | played | reading | result | done
?screen=home:discover | home:playing
?screen=h2h:intent | duel | outcome | cold
?reset                 Wipe saved state and start at onboarding
?hint                  Force the iOS "Add to Home Screen" hint on any device
```
