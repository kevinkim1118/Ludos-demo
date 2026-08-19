# Ludos — handoff log

The prototypes in the design project are the source of truth. This file is the running record of what changed there and what it means for `ludosfiles/src`. Newest delta on top.

Each delta is a change spec, not a redesign: it names the files to touch and what to leave alone. Where a delta says "no visual change", the prototype and the app already agree and the entry is there for context only.

---

## Delta 001 — five new screens, DNF, and the status sheet

**This supersedes the earlier Delta 001 draft.** That draft was written, never implemented, and has been folded in here in full — sections 6 through 13 below are it, unchanged. Build this document; there is no separate first delta to catch up on.

The headline is that the app grows from three flows to eight. `Prototype.dc.html` now carries Game detail, Library, Friends, Profile, and Search alongside Onboarding, Discover, and Head-to-head, and the tab bar is real navigation instead of a stub.

### Reference build

`ludosfiles/project/Prototype.dc.html` is the frozen copy from the original handoff and predates everything here. **Replace it with the current export before starting** — the exact markup, inline styles, and copy for all five new screens live in that file, and this spec names structure and behaviour rather than restating a thousand lines of layout. Read the screen's `sc-if` block and its `*Vals()` method in the logic class; the two together are the whole screen.

---

### 1. Flow union and tab bar routing

- `src/state/types.ts` — extend the flow union:
  `export type Flow = 'onboarding' | 'home' | 'detail' | 'library' | 'friends' | 'profile' | 'search' | 'h2h';`
- `src/App.tsx` — add the five new flows to `SCREEN_LABELS` (`detail: 'Game detail'`, `library: 'Library'`, `friends: 'Friends'`, `profile: 'Profile'`, `search: 'Search'`) and render each screen off `state.flow`, matching the existing `Onboarding` / `Discover` / `HeadToHead` pattern.
- `src/screens/home/TabBar.tsx` — the component currently hardcodes Discover as active and routes every other tab to `onStub`. Replace that with a real `active: Flow` prop and an `onNavigate(flow)` callback. The five tabs map to `home` / `library` / `friends` / `search` / `profile`. Active tab: `var(--accent-300)`, weight 600, `cursor: default`, no handler. Inactive: `var(--text-muted)`, weight 500, hover `var(--text-secondary)`.
- The tab bar now renders on Discover, Library, Friends, Profile, and Search. It does **not** render on Game detail, onboarding, or head-to-head.
- `src/state/useBackNavigation.ts` — back should close the topmost overlay first (list detail, list edit, friends sheet, add-friends panel, profile edit), then fall back to Discover from any secondary tab, then to the existing behaviour.

### 2. Game detail

Reached from the Elden Ring rail card on Discover (`onOpen` for the `eldenring` key) and from `?screen=detail`. Back returns to Discover. New file: `src/screens/detail/GameDetail.tsx`.

Fixed content for one game — `GD_NAME = 'Elden Ring'`. Structure top to bottom:

- **Hero** — 300px `cv-detail-hero` key art under a bottom-up gradient to `--surface-0`, with studio/year/genre, title at 32px, and platform tags. Floating back and share buttons sit above it at `top: 10px`, blurred `rgba(18,11,13,0.5)` pills.
- **Tag rail** — horizontal scroll of neutral pills (Open world, High challenge, Solo, Long sessions, Story-rich).
- **About** — heading plus body copy at `--text-secondary`, line-height 1.72.
- **Review prompt** — shows only when `itemStatus['Elden Ring'] === 'finished'` and the review is not yet posted. Four-point scale from `GD_SCALE` (`Strongly Disliked` / `Didn't like` / `Liked` / `Loved`, keys `rd` / `dl` / `l` / `rl`, each with its own selected background), an optional textarea, and a Post review button that stays disabled-looking until a rating is picked. Clicking a selected rating clears it.
- **Verdict card** — three stacked sources, in trust order: your own posted review (headline from the picked scale entry, quoted body in Newsreader), Friends (gated on `friendsConnected`), and the archetype-plural bucket (`Completionists`), each using `VerdictBar` with `GD_TASTE` / `GD_GLOBAL` distributions and a percentage key.
- **Review list** — tabbed Friends / `{archetypePlural}` / All, reading `GD_REVIEWS`.
- **Discovery rail** — four related games (`cv-disc-*`), each with an add button that opens the status sheet.

One behaviour worth preserving: when a game is marked finished **from the detail screen**, `sheetAction` schedules `scrollToReviewPrompt()` 320ms later (after the sheet's close animation) and scrolls the newly-mounted prompt to the vertical centre of the scroller, not the top.

### 3. Library

New: `src/screens/library/Library.tsx`. Two panes behind a top segmented control, sliding as one 200%-wide track (`translateX(-50%)` for Lists, 340ms house easing) with a 2px accent underline that animates `left` between `0%` and `50%`.

**Library pane.** A scrolling chip row — Backlog / Playing / Finished / DNF / All, each with a count, active chip inverted (`--text-primary` background, `--surface-0` text). Below it a section title (`Backlog` / `Playing now` / `Finished` / `Did not finish` / `All games`) and a three-column grid of cover cards. Each card carries a status pill over the art and a status-dependent meta line: estimated time for backlog, hours played for playing and DNF, finish month for finished. Data is `LIB_GAMES` (16 entries) — port it to `src/data/games.ts` or a sibling `library.ts`.

**Lists pane.** "+ Create new List" (stubbed), then collection cards, each a horizontally scrollable strip of cover thumbnails over a name and `{count} games · updated {when}` line, then a dashed "+ New list" button.

**List detail** — slides in from the right over the pane (`left` 100% → 0%, 300ms), sits above the tab bar (`bottom: 64px`). Title, description, edit button, and the list's games as 84px rows with platform and an italic note. Ranked lists show a position number. Ordering is applied through CSS `order` from the saved index array, so reordering never remounts a row.

**List edit** — full-screen sheet rising from the bottom (`translateY` 100% → 0%). Title and description inputs, a "Ranked list" toggle, a "Display on Profile" toggle whose description flips between "Visible to others on your profile" and "Hidden — only you can see this list", and a drag-to-reorder game list. Cancel discards; Save commits title, description, order, ranked flag, and profile visibility into per-list override maps keyed by list name (`libOverrides`, `libOrder`, `libOrdered`, `libProfileShown`).

Two lists have real content: `My favorite games` (ranked, 8 games) and `Cozy night-ins` (unranked, 6). `Handheld / travel` is a stub that toasts.

### 4. Friends

New: `src/screens/friends/Friends.tsx`. A header with a friends-list button and an accent add button, a filter chip row (All activity / Finishes & reviews / Ratings / Playing, each with a count), and a grouped feed under `Today` / `This week` rules. Empty groups drop out entirely.

Each feed row is a 92px cover beside a sentence — actor, verb, target, optionally "to {list}" — with a relative time, an optional now-playing meta line, an optional `SentimentPill`, and an optional Newsreader snippet behind a left rule. The feed reads `FR_FEED` (7 entries).

When `friendsConnected` is false, a dashed "Quiet feed?" connect card appears in the Today group on the All filter only. The footer reads `You're all caught up · {n} friends`.

**Friends sheet** — bottom sheet listing `FR_FRIENDS` (8) with initials avatars, an accent online dot, and a status line.

**Add friends** — a right-slide panel with a username search over `FR_DIRECTORY`, per-row Add buttons that flip to "Requested" and toast "Friend request sent", a copyable invite link (`ludos.app/invite/alexr-8f2k`, uses the clipboard API and toasts "Invite link copied"), and a row of share targets that stub out.

### 5. Profile and Search

**Profile** — new `src/screens/profile/Profile.tsx`. A 196px cover banner with a settings button, an 80px avatar overlapping it, username and Newsreader bio, and a four-cell stat card (Playing 3 · Finished 42 · Backlogged 16 · DNF 2) in mono. Below: an "Edit profile" pill and three pill tabs.

- **Reviews** — `PR_REVIEWS`, each a cover beside title, date, `SentimentPill`, and a quoted excerpt.
- **Lists** — a search field over the user's lists, a sort button opening Recently updated / Name (A–Z) / Most games, then list cards. Opening a list that maps to a real Library list jumps to `flow: 'library'`, `libView: 'lists'` and opens its detail; the unmapped one toasts.
- **Activity** — `PR_ACTIVITY`, verb-first lines with optional sentiment and quote.

**Edit profile** is a full-screen sheet over a fading scrim: cover banner, avatar, username, bio. Cancel discards the drafts, Save commits them.

**Search** — new `src/screens/search/Search.tsx`. A large underlined input that turns accent on focus. Empty query shows browse sections (`Trending Right Now`, `Popular with Completionists`, `New Releases`) as plain tappable title rows that fill the query. A query filters `SEARCH_DB` on a normalized match (lowercase, apostrophes stripped, non-alphanumerics collapsed) into a three-column cover grid whose add buttons open the status sheet; no match shows the "No games found" empty state.

### 6. New game status: `dnf` ("Did not finish")

A fourth way to stop tracking something. It sits along `backlog` / `playing` / `finished` — a game you put down without finishing, which is a different fact than either abandoning it to the backlog or completing it.

- `src/state/types.ts` — extend the union:
  `export type GameStatus = 'backlog' | 'playing' | 'finished' | 'dnf';`
- `src/state/persistence.ts` — add `'dnf'` to the `STATUSES` array that `isStatus` validates against. Without this, a saved `dnf` is silently dropped on the next cold launch. **Do not bump `VERSION`** — this widens the accepted set rather than changing the shape, so existing saves stay readable.
- `src/state/reducer.ts` — no change needed. `pick/clearStatus` and `sheet/setStatus` both already take a `GameStatus`, so they carry the new member for free.
- Rail badge: the `+` badge on a rail card shows a status glyph once the game is tracked. `dnf` needs its own — a circle with a diagonal slash (prototype uses a 20×20 `circle r=7` plus `M7 7l6 6`, stroke 1.9). Add an `IconCircleSlash` to `src/components/icons.tsx` and branch on it wherever the badge picks its glyph.
- Toast copy: `Marked {name} as did not finish`.

### 7. Status dropdown → bottom sheet

The "Update Status" dropdown on the pick card is gone. The button now opens the same bottom sheet used for adding a game, in a second mode. Reason: three actions in a floating menu inside a scrolling card was cramped and inconsistent with every other status choice in the app, which already happens in a sheet.

- `src/screens/home/PickCard.tsx` — keep the "Update Status" button and its chevron, but point `onClick` at a new "open status sheet" action instead of `toggleStatusMenu`. Delete the `state.statusMenu &&` block, the `menuItem` style constant, the `aria-expanded`, and the now-unused `IconBookmarkSmall` / `IconCheck` imports. The button no longer needs its `position: relative` wrapper.
- `src/state/types.ts` — `SheetTarget` gains `statusUpdate?: boolean`. That flag is what tells the sheet which mode to render.
- `src/screens/home/Discover.tsx` (wherever `BottomSheet` is mounted) — branch on `sheet.statusUpdate`:
  - **status mode** — title `Update {name}`, subtitle "Change how you're tracking it", three buttons in order: **Mark as finished** (primary/accent), **Move to backlog** (outline), **Did not finish** (outline).
  - **add mode** — unchanged: title `Add {name} to…`, subtitle "Set a status to start tracking it", then Add to backlog / Mark as playing / Mark as finished / Add to a list.
- `BottomSheet.tsx` itself needs no change — it already takes `title`, `subtitle`, `children`.
- The three status actions dispatch the existing `pick/clearStatus` with `'finished'` / `'backlog'` / `'dnf'`, then close the sheet.
- The sheet is now opened from Game detail and Search as well as Discover, so it must be mounted somewhere all three can reach — lift it to `App.tsx` if that is cleaner than duplicating the mount.
- `state.statusMenu` and the `status/toggleMenu` action become dead. Leave them in place if anything else reads them; otherwise remove both, plus `statusMenu: false` from `initialState`, `flow/goCompare`, `pick/clearStatus`, and `sheet/markPlaying`.

### 8. Onboarding pick minimum: 10 → 5

Ten games was too long a wall before the payoff. Five is enough signal for the archetype read.

- `src/data/games.ts` — `PLAYED_MINIMUM = 5`.
- No other change: `PlayedGames.tsx` derives `remaining`, `canContinue`, and the count label from the constant, and the copy reads correctly at five.
- `src/state/persistence.ts` — the `hydrate` doc comment says "must not replay the ten-game picker"; update the wording.

### 9. Played-games step: title scrolls, search sticks

At five picks the grid is the point of the screen, and a fixed header was eating a third of it.

- `src/screens/onboarding/PlayedGames.tsx` — move the `<h1>` and description **inside** the `.scroll-y` container so they scroll away with the grid. Wrap the search row in a `position: sticky; top: 0; z-index: 4` band with `background: var(--surface-0)` and `padding: 6px 20px 0`, as the first child of the scroll area. The grid keeps its own `padding: 16px 20px 0` in a plain wrapper. The bottom action bar stays fixed and outside the scroll area.

### 10. Rail rhythm

- `src/screens/home/Rail.tsx` — each rail `<section>` gets `marginTop: 30, marginBottom: 30` (was `marginBottom: 22`). Slightly more air between rails; the section header and card padding are unchanged.

### 11. Review-card archetype labels drop "The"

- `src/data/content.ts` — in `REVIEWS`, the archetype chips read `Completionist` and `Explorer`, not `The Completionist` / `The Explorer`. The chip is a taste-alignment label, not a title, and "The" reads oddly at chip size. `CONFIG.archetype` on the result screen keeps its "The" — that one *is* a title.

### 12. Intro logo: no crop

- `src/screens/onboarding/IntroScreens.tsx` — the logo renders at **153×168**, `objectFit: 'contain'`, transparent background, no border. Previously it filled a fixed box and cropped the mark. Whatever `Cover`-style crop math applies elsewhere must not apply here: contain the whole mark, never fill.

### 13. Intro screen 1 survives short viewports

- `src/screens/onboarding/IntroScreens.tsx` — the first intro screen used `height: 100%`, which clipped the tagline on short screens. Use `minHeight: '100%'` and give the leading spacer a `minHeight: 12` so the screen grows and scrolls instead of cutting off. The trailing spacer keeps its `flex: 1.4`.

---

### Deep links

`src/App.tsx` reads `?screen=`. The prototype's jump list is now:

`onboarding:intro1` … `onboarding:done` · `home` · `home:playing` · `search` · `library` · `library:lists` · `friends` · `profile` · `profile:lists` · `profile:activity` · `detail` · `h2h:intent` · `h2h:duel` · `h2h:outcome` · `h2h:cold`

Extend `jumpPatch` in `src/state/useLudos.ts` to cover the new targets. Each one should also reset the screen's overlays — `profile` clears `prEditOpen`, `friends` clears the sheet and add panel and resets the filter to `all`, `library` clears list detail and edit.

### Covers

Every new cover slot is already mapped in the design project's `image-manifest.js`. Slots resolving to `covers/*.webp` correspond one-to-one with files already in `public/covers/` and need only new id → file entries in `src/data/covers.ts`. Slots resolving to `images/*.webp` are design-project exports that are **not** in the repo yet — the `cv-lib-*`, `cv-coll-*`, `cv-list-*`, `cv-rev-*`, `cv-act-*`, and `ff-*` families, plus `cv-profile-avatar`, `cv-profile-cover`, and `cv-detail-hero`. Either add those files to `public/` or repoint the slots at existing `public/covers/` artwork; several already are (e.g. `cv-coll-cozy-3` → `covers/outer-wilds.webp`). Crop transforms in the manifest (`x` / `y` / `s`) use the same math `Cover.tsx` already implements.

### Do not change

- The head-to-head flow in full — intent, duel, resolution rules (3-streak / 5-cap / exhausted), undo, skip, coldstart. Untouched this round.
- The Discover rails' content, order, and cold-start behaviour.
- `src/config.ts` values.
- The PWA install hint and update prompt, including their device gating.
- Everything in `ludosfiles/project/` other than refreshing `Prototype.dc.html` — that folder is history.

### Suggested order

1. Flow union, `App.tsx` routing, real `TabBar`, `jumpPatch` (§1, deep links) — nothing else can be reached until navigation works.
2. `dnf` and the status sheet (§6, §7) — the new screens all display and set status.
3. Library, then Profile (its Lists tab jumps into Library), then Friends, then Search, then Game detail.
4. The onboarding and rail changes (§8–§13) — independent of everything above; ship them whenever.
