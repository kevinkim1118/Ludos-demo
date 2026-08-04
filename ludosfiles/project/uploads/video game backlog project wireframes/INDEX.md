# Wireframe index — "LevelUp" game discovery platform

Master file list for the lo-fi grayscale wireframe set. **All four core flows are wireframed at both breakpoints.** This index is reconciled against disk; the narrative and design decisions live in the session handoff (`Documents/Claude/markdowns/game-detail-session-handoff-3.md`).

- **Fidelity:** all files are grayscale, annotated, low/mid-fidelity. Hi-fi / color is deliberately deferred product-wide.
- **Consistent example:** Elden Ring across the detail pages; Kevin → *The Completionist* across Discover and onboarding. Same distribution numbers for the same game on every page.
- **Load-bearing grammar every file respects:** the trust ladder (friends → taste-matched → global) and the four-point sentiment rating (no neutral, no numeric scores; aggregates are distributions).

---

## Onboarding & personality quiz — first-run flow
*Built as a multi-screen flow board (welcome → 6 scenario questions → reading beat → result hero → Connect Steam → land on Discover).*

| File | Breakpoint | What it is |
|---|---|---|
| `onboarding-quiz-wireframe-desktop.html` | 1200px | Full flow; the six questions render as a 2-up deck. Named archetype + four taste axes; explicit Back/Next nav. |
| `onboarding-quiz-wireframe-mobile.html` | 412px | Same six steps as a wrapping row of phone frames. |

## Discover / Home — logged-in landing surface
*Top-of-funnel: surfaces new games and converts them to the Want list. The page IS the trust ladder (rails descend friends → taste → tag → global).*

| File | Breakpoint | What it is |
|---|---|---|
| `discover-home-wireframe-desktop.html` | 1200px | Spotlight pick + trust-ladder rails; includes the cold-start (no-friends) demonstration. |
| `discover-home-wireframe-mobile.html` | 412px | Rails as horizontal carousels; bottom tab bar. |

## Library / backlog — decide among games you already track
*Solves backlog paralysis: leads with one confident "what to play next" pick; head-to-head as the refine path.*

| File | Breakpoint | What it is |
|---|---|---|
| `library-wireframe-desktop.html` | 1200px | "What to play next" hero + status-segmented backlog; cards reweight by status. |
| `library-wireframe-mobile.html` | 412px | Mobile segment control + bottom tab bar. |

## Head-to-head "compare two" — the Library refine flow
*Single-purpose: decide **what to play**. Flow: an **intent screen** ("what do you want to do tonight?" — 4 options spanning genre + time-commitment) scopes the pool, then the Beli pattern — two sparse cards (cover · name · genre · time-to-finish) side by side with an OR badge; tap the one you prefer and the next pairing loads. Winner stays, the unchosen card is replaced by the next game in line. **Stop rule:** auto-stops when a game wins 3 in a row or after a 5-compare cap (best-match seeded within the intent, just-rejected hero pick excluded); a minimal progress cue signals it's short. The duel chip shows the **chosen intent** (tappable to switch) — it replaces a raw duration chip, since intent already encompasses time. **Cold-start:** when <2 games fit the intent, the Library entry is gated (disabled "add games" hint) plus an in-flow screen offering "change your intent" / "Browse Discover." No scores/stars. (Ranking mode was considered then cut — this flow is play-only.)*

| File | Breakpoint | What it is |
|---|---|---|
| `headtohead-wireframe-desktop.html` | 1200px | Modal over a dimmed Library; intent screen + live duel (progress cue + intent chip) + "how the winner emerges" filmstrip + winning-pick outcome + cold-start (→ change intent / Discover). |
| `headtohead-wireframe-mobile.html` | 412px | Full-screen takeover; 4 frames (intent · duel · outcome · cold-start) + entry-bar reference showing both the live and gated (<2 wants) states. |

## Game detail page — one screen reweighted by `status × review-exists`
*The most complete set: every condition at both breakpoints. Verdict module is the differentiator.*

### Desktop (1200px)
| File | State |
|---|---|
| `game-detail-wireframe-deciding.html` | Deciding (untracked / want) — canonical reference copy |
| `game-detail-wireframe-coldstart.html` | Cold-start / empty — trust ladder inverted, Connect-Steam CTA |
| `game-detail-wireframe-playing.html` | Playing — forward-looking verdict, playthrough line |
| `game-detail-wireframe-finished.html` | Finished + reviewed — contribution rises to hero, verdict re-anchors |
| `game-detail-wireframe-finished-prompt.html` | Finished, not yet reviewed — Option B non-blocking prompt |

### Mobile (412px)
| File | State |
|---|---|
| `game-detail-wireframe-mobile-deciding.html` | Deciding — single column, sticky "Add to List" bottom bar → status sheet |
| `game-detail-wireframe-mobile-coldstart.html` | Cold-start — inverted ladder, Editorial default review tab |
| `game-detail-wireframe-mobile-playing.html` | Playing — bar shows "Playing" |
| `game-detail-wireframe-mobile-finished.html` | Finished + reviewed — contribution hero on top |
| `game-detail-wireframe-mobile-finished-prompt.html` | Finished, unrated — Option B nudge + empty "you" anchor |
| `game-detail-wireframe-mobile-sheet-overlay.html` | *Alternate depiction* — status sheet as overlay on dimmed page (reference; truer-to-life for hi-fi) |

## Friends activity feed — trusted-discovery engine as a social feed
*Friend-centric digest, recency-ordered; awareness + investigate hook, no in-app conversation.*

| File | Breakpoint | What it is |
|---|---|---|
| `friends-feed-wireframe-desktop.html` | 1200px | One headlined action per friend card; sidebar filters. |
| `friends-feed-wireframe-mobile.html` | 412px | Chip-row filters + bottom tab bar. |

---

## Archive
- `_archive/game-detail-wireframe-mobile_PRE-OVERHAUL.html` — superseded mobile detail page (pre four-point-scale rating overhaul; old numbers). Kept for reference only — **do not use.**

## Notes
- **Canonical path:** `Documents/Claude/Claude Code/video game backlog project wireframes/` (this folder). A near-duplicate folder without "Claude Code" in the path once existed and caused confusion; it is no longer present, but if it reappears, this folder is the source of truth.
- **Count:** 21 active files (11 game detail · 2 each for onboarding, Discover, Library, friends feed, head-to-head) + 1 archived.
- **Remaining lo-fi loose ends** (not yet drawn): Library/Discover empty-cold-start, custom-list detail view, friends-feed multi-action-per-friend, and the onboarding quiz's skip path. (Head-to-head compare flow: now drawn — see its section above.) See the handoff's "Open questions" for the full list.
