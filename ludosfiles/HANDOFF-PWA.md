# Ludos — project state

Orientation for a new session. This describes what exists, what's deliberately
left alone, and the small number of things still open.

**Live:** https://ludos-demo.vercel.app — deploys from `main` on push.
**Branch:** `feat/delta-001`, pushed to `origin` on 2026-08-22 for a Vercel
preview. Delta 001 is complete and committed there but is **not merged and not
deployed to production** — the live site is still the pre-delta build.

**The merge is not a fast-forward.** `origin/main` carries three
"Add files via upload" commits (GitHub web UI, 2026-08-19) that local `main`
never had: `HANDOFF.md` and the `project/` design bundle. Check `origin/main`,
not local `main`, before planning the merge. The two design files —
`project/Prototype.dc.html` and `project/image-manifest.js` — are already
byte-identical to this branch's copies, so they merge silently; `HANDOFF.md`
differs and is the one real conflict to resolve by hand.

`feat/pwa` and `feat/pwa-polish` are fully merged and safe to delete.

---

## Read this before running anything

**Node lives at `~/.local/node`**, not in `/usr/local` or Homebrew — it's the
official v22 tarball extracted into the home directory, on `PATH` via
`~/.zshrc`. A shell that hasn't sourced that will report `npm: command not
found` and look like Node isn't installed at all. Either start a login shell or:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

Playwright's chromium is in the default cache (`~/Library/Caches/ms-playwright`)
and `scripts/smoke.mjs` finds it automatically — it only falls back to
`CHROMIUM_PATH` / `/opt/pw-browsers/chromium` if that's where the browser is.
No need to re-download it.

There is **no Xcode on this machine**, only Command Line Tools, so `simctl` and
the iOS Simulator are unavailable. Anything iOS-specific has to be checked on a
real device.

---

## What this is

A video game backlog app — discover what to play, track it, and settle
head-to-head matchups when you can't decide. Designed in Claude Design (the
bundle in `project/`, conversations in `chats/`), then implemented as a real app.

**Stack:** React 19 + Vite 7 + TypeScript. Node 22. No router, no state
library — one `useReducer`. Static build, no server. Installable PWA.

**Scope:** implements `project/Prototype.dc.html` — eight flows. Delta 001
completed the set; **there are no stub screens left**, and every tab reaches a
real screen. `Flow` in `state/types.ts` is the authoritative list:

- **Onboarding** — 4 intro screens → played-games picker (unlocks at 5
  selections, `PLAYED_MINIMUM`) → analysis beat → player-type result with seeded
  backlog → done
- **Discover** — pick card with "Another" re-roll, flips to "Currently playing";
  head-to-head entry; three trust-ladder rails (friends → taste → global);
  status sheet on any `+`
- **Head-to-head** — mood → winner-stays duel → outcome → mark as playing
- **Game detail** — verdict card, review prompt (rate → write → post, with a
  durable draft), friend activity, discovery rail
- **Library** — tracked games and Lists, with list detail and a list editor
- **Friends** — friend reviews and activity, an add panel, and a profile sheet
- **Profile** — stats, Lists tab that jumps into the Library, and in-place edit
- **Search** — browse sections and a result grid, reaching the same status sheet

The tab bar navigates between five of these (`TAB_FLOWS`); `detail` and `h2h`
are pushed on top. Back unwinds the topmost layer first — see `useBackNavigation`.

**"No stubs" means no stub _screens_.** `actions.demo()` — the "Not available in
this demo" toast — is still alive and wired to plenty of individual controls
inside the real screens (overflow menus, secondary buttons, most rail tiles).
That's the prototype's own behaviour, not unfinished work. The one worth knowing
about: `Discover.tsx` opens Game detail from **Elden Ring only**; every other
rail item toasts.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server. **No service worker** — PWA behaviour needs a build |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the built output — use this for anything PWA-related |
| `npm run typecheck` | Types only |
| `npm run smoke` | 61-check end-to-end walkthrough (needs a server running; `BASE_URL` retargets) |
| `npm run covers` | Rebuild the cover manifest after adding art to `public/covers/` |
| `npm run icons` | Regenerate app icons and iOS launch images from `brand/logo.*` |
| `npm run pack` | Single self-contained `preview.html` (gitignored) |
| `npm run fonts` | Re-download self-hosted webfonts |

Dev deep links: `?screen=onboarding:played`, `?screen=home:playing`,
`?screen=h2h:duel`, `?screen=h2h:outcome`, `?screen=h2h:cold`. Also `?reset`
(wipe saved state), `?hint` (force the iOS install hint on any device) and
`?update` (force the update prompt without deploying twice).

## Layout

```
src/
  config.ts              Values that were "Tweaks" panel props in the design tool
  state/
    types.ts             State shape
    reducer.ts           Pure transitions
    useLudos.ts          Timers, toasts, scroll orchestration
    persistence.ts       Versioned localStorage save (hydrate + write)
    useBackNavigation.ts History entries so back dismisses UI, not the app
  lib/
    standaloneHeight.ts  Corrects iOS's wrong viewport height when installed
    appUpdate.ts         Registers the worker, reports a waiting build
  data/
    games.ts             GAMES, SEED, PLAYED_DB, PLAYED_BLANKS, intents,
                         PLAYED_MINIMUM, normalize()
    content.ts           Rails, reviews, taste axes, copy
    library.ts  detail.ts  friends.ts  profile.ts  search.ts
                         Per-screen fixtures added by Delta 001
    covers.ts            GENERATED — do not hand-edit
  components/            Cover, PhoneShell, BottomSheet, StatusSheet, Toast,
                         SentimentPill, VerdictBar, IosInstallHint,
                         UpdatePrompt, icons
  screens/
    onboarding/  home/ (incl. TabBar)  h2h/
    detail/  library/  friends/  profile/  search/
  styles/
    ludos.css            Design system, vendored verbatim — do not hand-edit
    fonts.css            GENERATED by scripts/fetch-fonts.mjs
    app.css              Shell, responsive frame, motion, interaction states
covers.config.mjs        Cover art registry (game → slots)
vercel.json              Build config + cache headers
brand/logo.png           Icon source, outside public/ so it never ships
scripts/
  lib/slots.mjs          Derives valid slot ids from the app's own data
  lib/ios-devices.mjs    iPhone sizes an iOS launch image must match
  gen-manifest.mjs       npm run covers
  gen-icons.mjs          npm run icons
  fetch-fonts.mjs        npm run fonts
  pack-single.mjs        npm run pack
  smoke.mjs              npm run smoke
public/
  images/                18 decorative marquee tiles (disc-r*), plus the
                         Library/Profile/detail art Delta 001 added (cv-*)
  covers/                Full-res 600×900 drop-ins (see its README)
  icons/                 GENERATED by scripts/gen-icons.mjs
  splash/                GENERATED — iOS launch images
  fonts/                 Self-hosted woff2
```

## Verified state

- `npm run build` and `npm run typecheck` clean
- All **163 smoke checks pass**, zero console errors, no page errors
- The update prompt was driven against a genuine second build: banner on a real
  waiting worker, handover on Reload, nothing left waiting afterwards
- Deployed headers confirmed correct; offline behaviour confirmed against
  production
- Installed and confirmed working on a real iPhone

The build, typecheck and smoke results above are current for `feat/delta-001`.
The last four — update prompt, headers, offline, real iPhone — were verified
against the **deployed pre-delta build** and have not been re-run since. The
service worker can't be exercised by `vite preview` in a sandboxed browser, so
re-check it on a Vercel preview deployment before merging, comparing the built
asset hash rather than grepping.

---

# How it works

## Saved state

`src/state/persistence.ts` mirrors the durable slice to `localStorage` under
`ludos.state`: `onboardingComplete`, `backlog`, `itemStatus`, `upNext`,
`playingItem`, `played`. Transient UI — sheets, toasts, the in-flight duel — is
deliberately excluded so a launch never restores a half-open overlay.

The payload is versioned (`{ v: 1, … }`) and a save from any other version is
discarded rather than migrated; bump `VERSION` when the shape changes. Fields
are re-validated on read, since the store is user-editable.

The reducer stays pure: hydration goes through `useReducer`'s init argument, and
the write is a memoized effect in `useLudos.ts` so a toast doesn't touch
storage. One-shot UI flags (the install hint's dismissal) live under
`ludos.flag.*`, outside the versioned save, because they carry no data.

## PWA

`vite-plugin-pwa` generates the manifest and a Workbox service worker.

- **Precache: 708 KB / 17 entries** — shell, fonts, icons, manifest, and the
  Ludos logo. The logo is listed explicitly because it only sits under `covers/`
  thanks to the art registry's naming; it's chrome, and the welcome screen
  renders a broken image without it offline.
- **Artwork is cached at runtime**, not precached — a `CacheFirst` route over
  `/covers/` and `/images/` (`ludos-artwork`, 80 entries, 7-day expiry). 1.6 MB
  of art against a 708 KB shell wasn't worth paying at install. Entries expire
  because art keeps its filename when replaced, so `CacheFirst` would otherwise
  pin a stale cover forever.
- **`registerType: 'prompt'`** — a new worker installs and waits; the user takes
  it. `autoUpdate` reloads the page the instant a deploy lands, and only the
  durable slice of state is saved, so that could drop someone mid-duel onto a
  fresh Discover. Ignoring the prompt strands nobody: a waiting worker activates
  on its own once every tab is closed, so the next cold launch is on the new
  build regardless.
- **`clientsClaim: true`, set explicitly** — `autoUpdate` used to imply it and
  `prompt` doesn't. Without it the first visit runs uncontrolled and no artwork
  reaches the runtime cache until the second load. It only takes effect when a
  worker activates, so a waiting build still waits.
- **`injectRegister: false`** — the app registers the worker itself through
  `virtual:pwa-register` (`src/lib/appUpdate.ts`), which is the only way to hear
  about the waiting build. Left on, it would ship `registerSW.js` and register a
  second time.
- **`includeManifestIcons: false`** — the `icons/*.png` glob already precaches
  them and also catches `apple-touch-icon-180`, which the manifest never lists.
  Left on, each manifest icon was entered twice.

**The update prompt** is `src/lib/appUpdate.ts` plus
`src/components/UpdatePrompt.tsx`: a banner above the tab bar saying a new
version is ready, with Reload and a dismiss. Reload messages the waiting worker
to skip waiting and reloads once it takes control — backed by a 3-second timer,
because that handover is a message to another thread and can go unanswered.
Dismissing it is per-session only; nothing about an update is worth persisting.

The browser only looks for a new worker when the page navigates, and an
installed app never navigates. So the registration is re-checked hourly, and on
returning to the foreground if an hour has passed — that second one is what
actually fires on a phone.

The prompt and the iOS install hint occupy the same spot, so `App.tsx` renders
at most one and a waiting build outranks the hint. The hint is one-shot but
comes back next launch if it loses; an unreloaded build keeps the whole session
on old code.

**Icons** come from `brand/logo.png` (1024×1024) via `npm run icons`, and the
generator branches on what the source carries at its edges. Transparent margin
means a mark: trim the margin, inset it, derive the maskable scale from the
trimmed mark's aspect ratio rather than hardcoding one — the bounding box has to
fit the safe circle of 80% diameter, which solves to `0.8 · max(w,h) /
hypot(w,h)` (a fixed 0.62 clipped the corners by 17 px). Nothing transparent at
the edges means the artwork is already an icon: it fills every output as
composed, on the theme colour, maskable included.

The current logo is the first kind — an L and an O as a 700×700 mark inside its
own 162 px margin, so no platform's mask reaches it. Every output gets the theme
colour behind it, `any` included: the mark is off-white, and a transparent icon
on a light launcher or tab strip is a red circle beside an invisible L.

## iOS

Safari ignores most of the manifest, so it's spelled out in `index.html`:
`apple-touch-icon`, `mobile-web-app-capable` plus the older prefixed spelling,
`black-translucent` status bar, and `apple-mobile-web-app-title`.

**Launch images** — `npm run icons` emits 11 portrait PNGs into `public/splash/`
and writes their `<link>` tags into `index.html` between `GENERATED` markers.
The device table is `scripts/lib/ios-devices.mjs`, shared by the generator and
the tag writer so the two can't drift. Safari matches a launch image only on an
exact CSS-size *and* pixel-ratio hit — no fallback, no scaling — so a device
missing from that list gets the white flash. Shipped but not precached; iOS
fetches them at add-to-home-screen time.

**The install hint** (`src/components/IosInstallHint.tsx`) points at Share → Add
to Home Screen, since `beforeinstallprompt` is Chrome-only. Shown once, on
Discover rather than mid-onboarding. Gated on iOS *and* Safari specifically:
every iOS browser is WebKit underneath, but only Safari offers Add to Home
Screen. `?hint` forces it on any device.

## Deployment

Vercel, from `main`, static build, no env vars. **Root Directory must be
`ludosfiles`** — the repo wraps the app in a subdirectory. Everything else is in
`vercel.json`; Node is pinned to 22 via `engines`.

The cache headers matter more than usual because of the service worker:
`sw.js`, `manifest.webmanifest` and `/` revalidate every time (a cached worker
is never re-fetched, so the app can't discover it updated);
hashed assets and fonts get a year immutable; artwork gets a day plus a week of
`stale-while-revalidate`, because covers keep their filename when replaced.

---

# Still open

Nothing blocking. In rough order of value:

- **Android has never been tested on real hardware.** `useBackNavigation` is
  covered by smoke checks driving `page.goBack()` — the same `popstate` path —
  but the OS integration, the install prompt and the maskable icon's rendering
  in a launcher are unverified.
- **No iPad launch images.** The app is portrait phone-only, so an iPad
  add-to-home-screen still flashes white. A few rows in `ios-devices.mjs`.
- **The 18 marquee tiles** on the onboarding carousel are still on the design
  tool's low-resolution exports. They're decorative and heavily masked, so it
  has never looked wrong.
- **Returning visitors lose one BG3 marking when the delta deploys.** Delta 001
  straightened the curly apostrophe in `content.ts`, but `itemStatus` is keyed
  by raw display name and `VERSION` stayed at `1`, so saves already in people's
  browsers keep the old curly key — it now matches nothing and BG3 renders
  unmarked. Verified against a seeded pre-delta save: the app boots clean and
  restores everything else, and re-marking BG3 writes the straight key and
  self-heals. Left alone deliberately — a `VERSION` bump would discard every
  save and replay onboarding for everyone, which is worse.

---

# Deliberate — don't "fix" without asking

- **The time sheet is unreachable.** Its markup and state exist, but nothing
  opens it — `onOpenTime` was never wired into the template in the original
  prototype either (a leftover from the Library port). `state.time` still drives
  the pick card's session-fit line, defaulting to "a free evening".
- **`CONFIG.showRecommendedCard` defaults to `false`** (`src/config.ts`),
  matching the prototype's saved tweak state, so the "Recommended for you"
  spotlight is hidden.
- **`CONFIG.friendsConnected` defaults to `true`** — changed by Delta 001, and
  the one place the delta knowingly overrode its own "do not change" list. The
  connected state is the only route from Discover into Game detail, so leaving
  it `false` made a whole screen unreachable. Read the exported
  `friendsConnected` binding rather than `CONFIG.friendsConnected` directly, so
  the `?friends` / `?friends=0` dev flag reaches every friend-gated surface.
- **`cv-review-1/2/3` avatars render initials** by design. `<Cover>` falls back
  gracefully.
- **`src/styles/ludos.css` is vendored verbatim** from `project/_ds/`. Don't
  hand-edit; re-vendor.
- **`src/data/covers.ts` and `src/styles/fonts.css` are generated.** Edit
  `covers.config.mjs` / `scripts/fetch-fonts.mjs` and re-run.
- **`project/` is kept intentionally** — it's the source `npm run covers`
  regenerates from, and it's where the 92 deleted `public/images/` files still
  live.

## Cover art

All 45 registry keys now have 600×900 drop-ins in `public/covers/`; nothing
falls back to the design tool's exports any more. The exports were ~240 px tall
after being recompressed three times to fit a 2 MB cap in the design tool —
roughly 2× too small for a 3× phone screen. To replace a cover, drop
`public/covers/<key>.webp` and run `npm run covers`, then **commit the
regenerated `src/data/covers.ts` with it** — the image alone does nothing.

Files must genuinely be WebP; a PNG renamed `.webp` renders fine but is ~20×
larger, and git keeps both copies forever once committed.

---

# Bugs already fixed — don't reintroduce

- **Trimming an icon source by colour eats artwork.** `sharp`'s bare `.trim()`
  reads the top-left pixel as the background and cuts everything matching it off
  every edge. The logo's L starts in that corner, so the icons came out as the O
  alone. `gen-icons.mjs` trims fully transparent margin only — a colour at the
  edge is a decision the designer made, not padding.
- **The welcome screen's logo box crops to fill.** `<Cover>` is
  `object-fit: cover`, so a 4:3 box took a quarter of the height off a square
  mark. It was harmless while the mark floated in its own margin and isn't now.

- **`<button>` centers its content vertically.** Cards in a grid stretch to the
  tallest in the row, so short-titled cards had their cover art pushed off the
  top edge. Any `<button>` acting as a stretched card must set
  `display: flex; flex-direction: column`.
- **`IMAGES.md`'s crop recipe is wrong.** It says to reproduce crops with
  `transform: translate(x%, y%)` on an `object-fit: cover` image, but that moves
  the whole element and tears background gaps. The design tool panned *within*
  the image's overflow and clamped to it. The correct math is in
  `src/components/Cover.tsx` — don't "simplify" it back.
- **`animationend` doesn't always arrive.** The install hint originally
  unmounted on it; a backgrounded tab swallowed the event and left the element
  in the DOM at opacity 0 — invisible but still eating taps. Everything that
  unmounts after an exit animation uses a timer, like the sheets in
  `useLudos.ts`.
- **An installed iOS app can't trust any viewport unit.** It sizes its initial
  containing block as though Safari's bottom toolbar were still there — ~56pt
  short — and `100dvh`, `100vh` and `height: 100%` all inherit that.
  `src/lib/standaloneHeight.ts` sets `--app-height` from `screen.height`, which
  doesn't come from the containing block. It's `max(screen.height, innerHeight)`
  so it can only move up: the iOS keyboard shrinks `innerHeight`, and the
  played-games picker has a search field.
- **The intro screens can't assume a tall viewport.** Each pairs a fixed-size
  illustration with a heading beneath it, and the heading is what disappeared.
  The illustration is the flexible element in all of them (`flex: 0 1 auto`),
  and each trailing spacer carries `minHeight: 20` so the copy always clears the
  step dots.
- **Both played-games lists must stay searchable.** `PLAYED_BLANKS` exists only
  because those cards own `cv-played-blank-*` slots instead of `cv-search-*`
  ones. It was once filtered out entirely whenever a query was active, so ten
  titles vanished as you typed their name. Search also normalizes punctuation —
  "assassins creed odyssey" has to find "Assassin's Creed: Odyssey".

---

# Testing traps that cost real time

- **The service worker doesn't run in `npm run dev`.** Anything PWA-related
  needs `npm run build && npm run preview`.
- **A page's first visit isn't controlled by the service worker**, so runtime
  caching doesn't happen until the second load. An offline test that warms the
  cache on load one and then goes offline will fail for the wrong reason.
- **`?update` fakes the banner, not the handover.** It's there so the layout and
  copy can be looked at without deploying twice, and its Reload just reloads.
  Exercising the real path means two genuinely different builds: load one, swap
  `dist/` for the next, reload, and let the worker install and go to waiting.
- **CDP's `Emulation.setEmulatedMedia` does not emulate `display-mode`.** It
  silently matches nothing, so a standalone test written that way passes while
  verifying nothing. Launch Chromium with `--app=<url>` via
  `launchPersistentContext` instead — that's a real standalone context.
- **Verify a deploy landed by comparing the built asset hash**, not by grepping
  the bundle for a string that may predate the change.
- **`git` pathspecs are relative to the shell's cwd**, and the app lives in
  `ludosfiles/` inside the repo. A `git ls-tree` that returns nothing usually
  means the prefix is wrong, not that the files are missing.
