# Game Discovery Platform — Session Handoff (v3)

*A "Letterboxd for gamers" — game discovery + backlog management. This supersedes the previous handoff. It captures what this session decided, built, and left open so a new chat can pick up without re-litigating settled work.*

---

## Where the project stands

Research, competitive analysis, problem framing, JTBD, feature scope, the personality-quiz concept, IA, and all four core flows were already complete coming in. The prior session had wireframed the **game detail page — deciding state only**, at both breakpoints, and visual design had not started.

**This session completed the game detail page as a full wireframe set:** every state at both breakpoints, all migrated to a new rating system and a unified set of interaction patterns. The structural/lo-fi foundation for this screen is now done.

**Later sessions also wireframed the Library / backlog page, the Friends activity feed, the Discover / Home surface, and the Onboarding & personality quiz flow** (each desktop + mobile, lo-fi). **All four core flows now reach lo-fi wireframe** — the onboarding/quiz flow was the last, completed in the most recent session (see its dedicated section below). The Discover home — the app's actual landing surface, which the other pages' nav already assumed but which had never been designed — was added earlier. Visual (hi-fi) design has been deliberately deferred across the whole product; the team chose to keep building out lo-fi pages first. **A later session (this one) also built the head-to-head "compare two" flow** — the Library's refine path — as its own wireframe set (see its dedicated section below).

> **Master file list:** a consolidated, disk-reconciled index of every wireframe (grouped by flow, with breakpoint + one-line purpose) lives at `Documents/Claude/Claude Code/video game backlog project wireframes/INDEX.md`. This handoff is the narrative/decisions doc; the INDEX is the file registry.

---

## The big reframe: it's conditions, not states

The earlier model treated the page as three discrete "states" (deciding / playing / finished). This session sharpened that: **the page is one screen reweighted by two independent conditions** —

1. **Tracking status** — untracked / want / playing / finished
2. **Review exists** — has the user left a rating yet, yes/no

Every module's behavior is a function of those two flags; the page composes itself. Consequences:

- **The verdict module's reframe is triggered by `review-exists`, not by status.** It stays forward-looking ("is this worth it / worth continuing?") until the user has rated, then it reframes to comparison ("how does my take compare?"). This is why *playing* keeps the forward-looking verdict and *finished-but-unrated* shows an empty comparison anchor.
- **"Playing" is a small delta off "deciding"** (tracking flips, purchase demotes to a progress line, verdict stays forward-looking), not a from-scratch design.
- The wireframes are still useful references for a Figma rebuild, but they should be understood as **cells in a status × review-exists grid**, not as monolithic screens.

This principle still sits on top of the previously-locked **"emphasis-shift, not auto-hide"** decision (same content, reweighted hierarchy; auto-hide remains the intended v2 behavior).

> **Update (latest session): hi-fi has begun on a real screen.** The **Discover / Home mobile surface is now built as a live, interactive hi-fi Design Component** (`Discover Home.dc.html`) in the Crimson noir dark theme — the first screen out of grayscale. See its dedicated section below. This changes the recommended next-milestone ordering (Discover went first, ahead of the verdict module).

---

## Decisions locked this session

### 1. Rating system overhaul — four-point sentiment (replaces 1–10 / stars)
- **Individual ratings** use a Beli-style four-choice ordinal scale: **Really disliked it · Didn't like it · Liked it · Really liked it.** No numeric scores, no stars anywhere.
- **No neutral middle** (unlike Beli's three-point scale, which includes "it was fine"). All four options are leans — this forces a stance and is a deliberate, kept choice.
- **Aggregates are distributions, not averages.** Any group rating (taste-matched, global) renders as a four-bucket distribution bar, never a single number.
- **Why it's coherent:** this resolves the long-standing tension with the locked "global rating is a sentiment distribution, never a Metacritic number" decision. Individual rating = a lean; aggregate = a distribution of leans. It also unifies the visual grammar — friends, taste-matched, and global tiers now all speak sentiment (previously friends/taste showed numbers, only global showed a distribution).
- **Display:** individual ratings shown as sentiment pills (e.g., a dark pill for "Really liked it", light for "Liked it"); aggregates as the four-bucket bar + key.
- **Known tradeoff:** loss of granularity (a "solid liked" can't be distinguished from a "near-perfect liked"), which gives the recommendation engine less to rank on. **Mitigation considered, then narrowed:** Beli's head-to-head "would you rather" mechanic was floated as a fine-ordering patch (coarse bucket from the tap + fine ordering from occasional head-to-heads). When head-to-head was actually built (see its section), the **ranking-precision mode was cut** — the flow is now play-only (decide what to play, not sharpen ratings). The granularity loss therefore remains an accepted tradeoff, not currently patched.
- **Cognitive-load upside:** four choices vs. ten lowers the cost of reviewing (Hick's law), which helps the cold-start seeding problem.

### 2. Verdict module — persistent, title fixed
- **The module never disappears** across any state, and its **title stays "The verdict"** everywhere (it does not rename to "How your take compares").
- It is **anchored on the user's own rating once a review exists** (a dark "Your rating" row at the top), with the three trust tiers reporting how each relates to the user's take. Before a rating exists, it is forward-looking with no anchor.
- The **divergence insight** (the differentiator — "polarizing, but people like you land positive") reads as *guidance* in deciding/playing and as *validation/reflection* in finished ("you backed the right read — your friends and type agreed, the wider crowd was more split"). Same mechanism, read forward or backward.
- Trust ladder order is unchanged and still load-bearing: **friends → taste-matched → global.**

### 3. Finish → review handoff — Option B (non-blocking)
- On marking a game finished, the **contribution module drops into prompt mode** (empty four-choice scale at the top of the page) **plus a dismissible non-blocking nudge** — *not* a blocking modal.
- The verdict's "you" anchor is shown **empty and pointing up to the prompt**: the comparison literally cannot resolve until the user rates, which is the gentle pull.
- **Rationale:** a modal that gets reflexively dismissed trains dismissal and loses the review anyway; squeezed reviews tend to be low-effort and pollute the taste signal the whole product depends on. Prefer reviews that come from intent.

### 4. Status control — unified, three options
- One consistent control across all states: **Add to want list / Mark as playing / Mark as finished**, stacked, with the current status filled.
- **Replay removed** as a top-level option. (Re-tracking a finished game for replay is an edge case — parked; see open threads.)

### 5. Purchase confidence — trimmed and demoting
- **Cost-per-hour line removed** in every state (judged too granular).
- Demotes to a quiet **"Your playthrough"** line once owned: progress ("Playing on Steam · 40h played") in playing; ownership ("You own this on Steam · 95h played") in finished. Price/stores/time-to-beat hidden once the buy decision is behind the user.
- Stays full and load-bearing in **cold-start** (utility data is non-social, so it carries the page when social signal is absent).

### 6. Cold-start treatment (game detail page)
- **The trust ladder inverts at launch:** the most-trusted tiers (friends, then your type) are empty; the only populated tier is the least-trusted (global, seeded from editorial/critic data).
- **The empty friends rung becomes the primary growth CTA** — "Connect Steam to import friends." Cold-start is reframed from a problem to mitigate into the growth engine that fills the platform.
- **Integrity rules:** editorial-seeded reviews are visually distinct (dashed avatar, "Editorial" badge) and never disguised as peer/friend reviews. The empty taste tier says so honestly ("not enough data yet").
- **Adaptive default review tab:** opens on "Editorial" because Friends / People-like-you are at 0 (recognition over recall — don't dump the user on an empty tab). Implies the default tab is state-dependent.
- **Discovery survives** because it's content/tag-based, not social — relabeled "Similar games" (tag-driven) rather than "Played by Completionists" until that can be populated.
- **No double CTA:** the friend-signal module shows a light empty state and does *not* repeat the Connect-Steam CTA — the verdict's friends rung owns it.

### 7. Mobile pattern — tracking lives in the bottom bar
- Single column; the desktop sticky sidebar is gone.
- **The mobile tracking-redundancy question is resolved:** there is **no inline status module**. All tracking is consolidated into a sticky bottom bar with a single **"Add to List"** button. Tapping it raises a **bottom sheet = the desktop "Your status" widget** (Add to want list / Mark as playing / Mark as finished + "+ Add to a list"), with the current status pre-selected.
- Standard reflows: hero tags scroll horizontally, trust ladder stays stacked (suits the vertical room), discovery becomes a carousel, review tabs scroll sideways.
- **Wireframe depiction choice:** the sheet is drawn as a **separate panel beneath the phone** (so the page and the widget are both fully legible in one static view). An **overlay version** (sheet over a dimmed page) was also built for comparison and is kept as a reference; the overlay is the truer-to-life treatment to realize in hi-fi.

---

## Wireframes produced (the deliverable)

All grayscale, annotated, low/mid-fidelity, using Elden Ring as the consistent example so states can be compared directly. Same distribution numbers across every page for the same game.

> **Reconciliation + build note (audit pass, then completion):** the file list was reconciled against disk and the **lo-fi set is now complete** — all five desktop files and all six mobile files exist and pass the same consistency checks (no numeric/star leakage, "The verdict" title, four-point scale, matching Elden Ring distribution numbers). A pre-overhaul `mobile.html` (no four-point scale, old numbers) was archived to `_archive/`. The `_1` download-suffixes were dropped from the playing/finished/finished-prompt filenames. The five missing mobile variants were built this pass by porting each desktop state onto the `mobile-deciding` template (single column, no inline status module, sticky "Add to List" bottom bar → status sheet; tracked states show the live status in the bar with that option pre-selected in the sheet). Canonical location: `Documents/Claude/Claude Code/video game backlog project wireframes/`.

**Desktop (1200px) — all present** ✅
- `game-detail-wireframe-deciding.html` — deciding (canonical copy; the original lived read-only in the project folder)
- `game-detail-wireframe-coldstart.html` — cold-start / empty
- `game-detail-wireframe-playing.html` — playing
- `game-detail-wireframe-finished.html` — finished + reviewed
- `game-detail-wireframe-finished-prompt.html` — finished, not yet reviewed (Option B prompt)

**Mobile (412px) — all present** ✅
- `game-detail-wireframe-mobile-deciding.html`
- `game-detail-wireframe-mobile-coldstart.html` — trust ladder inverted, Connect-Steam CTA, Editorial default review tab
- `game-detail-wireframe-mobile-playing.html` — forward-looking verdict, playthrough line, bar shows "Playing"
- `game-detail-wireframe-mobile-finished.html` — contribution hero on top, verdict re-anchored, bar shows "Finished"
- `game-detail-wireframe-mobile-finished-prompt.html` — Option B nudge + empty rating prompt + empty "you" anchor
- `game-detail-wireframe-mobile-sheet-overlay.html` — *alternate* sheet depiction (overlay-on-dimmed-page; reference only, truer-to-life for hi-fi)

All **eleven files** (five desktop + six mobile) are consistent on: the four-point sentiment rating, the unified status control, the fixed "The verdict" title, and (mobile) the "Add to List" → sheet pattern.

---

## Game detail page — content inventory (unchanged, for reference)

Eight modules, organized by job: (1) Identity & essentials, (2) Taste verdict [hero], (3) Purchase confidence cluster, (4) Friend signal, (5) Reviews, (6) Tracking actions, (7) Your own contribution, (8) Discovery continuation.

**Deciding-state stack rank:** Identity → Verdict → Tracking (persistent CTA) → Purchase → Friend signal → Reviews → Discovery → Contribution (minimal).

**Finished-state reorder:** Contribution rises to the top (hero); verdict stays and re-anchors; purchase demotes to the playthrough line; discovery becomes the "what to play next" exit.

---

## Library / backlog page (wireframed, lo-fi)

The second core flow to reach wireframe. Two files, same grayscale language and component grammar as the game detail set (nav, tokens, game-card, status taxonomy, sentiment pills):

- `library-wireframe-desktop.html` (1200px)
- `library-wireframe-mobile.html` (412px)

**Framing — this page exists to solve JTBD 02 (backlog paralysis), not to be an archive.** A daunting library should not open onto a wall of covers; it opens onto one confident answer. Structure:

1. **"What to play next" leads the page (the paralysis-breaker).** A bordered hero — like the detail page's hero modules — carrying: (a) a **time-context chip** ("How much time? · A free evening") that shapes the pick toward something finishable; (b) **one confident pick** with its reasoning compressed from the verdict's three trust signals (taste match · fits-your-time · friend signal), plus *Start playing* (flips to Playing) / *Show another* (re-roll); (c) the **head-to-head "compare two" refine path**.

2. **Decisions locked for this page (chosen this session):**
   - **Paralysis fix = confident pick LEADS, head-to-head REFINES.** The single recommendation is the headline; the would-you-rather A/B is the fallback when the pick doesn't land. This finally gives the parked head-to-head mechanic a home (the backlog "what to play?" feature). *(Update: head-to-head has since been fully wireframed as its own flow — play-only; the rating-precision angle was cut. See the head-to-head section below.)*
   - **Organization = status segments primary, custom lists secondary.** Want / Playing / Finished with live counts are the main nav (desktop sidebar / mobile horizontal segment control), mirroring the locked want→playing→finished model. Custom lists sit below/behind it (sidebar group / mobile "Lists" link); "+ New list" lives there. This makes the detail page's "+ Add to a list" a real destination.
   - **Cards reweight by status** (same emphasis-shift principle as the detail page): Want cards show decision data (taste-match label + time-to-beat); Playing cards show progress (Xh played); Finished cards show the sentiment pill. One card component, footer data varies.
   - **Default sort = Best match** (taste-first, not recency) so the backlog stays decision-oriented.
   - **Mobile gets a bottom tab bar** (Discover / Library / Friends / Search) since Library is a top-level destination — unlike the detail page's back-arrow header.

**Consistency held:** no numeric/star rating scores anywhere (match labels + sentiment pills only); time-to-beat hours and list counts are utility data, not ratings.

---

## Friends activity feed (wireframed, lo-fi)

The third core flow to reach wireframe. Two files, same grayscale language and components:

- `friends-feed-wireframe-desktop.html` (1200px)
- `friends-feed-wireframe-mobile.html` (412px)

**Framing — the feed is the app's trusted-discovery engine disguised as a social feed.** Research basis: 73.6% want a friend feed / 0% said no (JTBD 05), but the "yes" is conditional — 36.8% "definitely" is matched by 36.8% "maybe, if not noisy." So the feed's purpose (social awareness + relationship-mediated discovery, JTBD 03) is only served if it stays signal-rich and noise-free. Convergence signal ("3 friends finished this") is intentionally NOT the feed's job — that lives on the game detail page's verdict; the feed's job is awareness + the investigate/conversation hook.

**Decisions locked for this page (chosen this session):**
- **Organizing unit = friend-centric digest** (changed from an initial game-centric-clusters pick). Each card is one friend; chosen because the user frames the feed around *what a friend did* → investigate their take → optionally take the conversation off-platform.
- **Each card is headlined by the friend's main action**, in plain language — "Alex just finished Elden Ring," "Maya left a review for Hades," "Jordan added Citizen Sleeper to Cozy night-ins." The event leads, not just the name. Supporting detail (cover thumb + sentiment pill + review snippet, or a list chip) sits below; **the card carries only what relates to that one headlined action** (the earlier bundled "also started playing X" secondary rows were removed as off-topic noise).
- **Ordering = recency** (most recent first, grouped Today / This week). Taste-matched friends get a "Same taste as you" badge but do **not** jump the order.
- **No in-app conversation** (by decision). The feed creates the opening; the user reaches out via Discord/text. So no reply/comment UI — names link to a profile, activity links to the game's detail page (the JTBD-03 investigate path).
- **Noise control** now leans on: one headlined action per card + recency + filters ("All activity / Finishes & reviews / Ratings / Playing" — desktop sidebar, mobile chip row).
- **Cold-start growth lever** carried over — "Connect Steam to import friends" (desktop friends list / inline on mobile), consistent with the detail page.
- **Mobile** uses the bottom tab bar (Friends active), like the Library page.
- **Vocabulary:** uses "just finished" (not "completed") to match the locked want/playing/**finished** taxonomy.

---

## Discover / Home (wireframed, lo-fi) — start of the fourth flow

The logged-in **home surface** — the first screen a returning user lands on (the "Discover" tab that the Library and Friends pages already assume in their bottom nav, but which had never been designed). Two files, same grayscale language and component grammar:

- `discover-home-wireframe-desktop.html` (1200px)
- `discover-home-wireframe-mobile.html` (412px)

**Framing — Discover is the trusted-discovery engine, and it is the matched pair to the Library, not a duplicate.** The Library breaks paralysis *among games you already track* (output: press play). Discover is *top-of-funnel* — it surfaces **new** games you don't yet track and converts them to the Want list (output: add to want list). That distinction drives every decision on the page.

**Decisions locked for this page (chosen this session):**
- **The page IS the trust ladder.** Rails are ordered top-to-bottom by the locked ladder — **friends → taste-matched → similar/tag → global** — so the surface itself descends from personal to anonymous. The most-trusted rung sits highest; the anonymous crowd comes last. Tier badges (Friends · most trusted / Your type / Global) make the ladder legible.
- **One confident spotlight leads** (reuses the locked "confident pick leads" pattern from Library/detail, pointed at discovery). It's a single *new* game with the primary action **+ Add to want list** (the conversion) and a **Show another** re-roll. It carries a *compressed* why — the **top two trust rungs in plain language** ("Strong match for The Completionist" + "2 friends have played"). **Deliberately trimmed:** no per-friend names and no distribution/review breakdown in the hero — those are detail-page depth. (The "2 friends have played" line was specifically reduced from naming Maya & Alex.)
- **Discover is at-a-glance; the game detail page owns the depth.** This is the governing principle for the whole surface. Rail cards are **cover · name · platform only** — no per-card friend names, sentiment pills, match labels, time-to-beat, or distribution bars. The **rail title + tier badge carry the "why this group"** so cards never repeat it. Anything deeper (which friend, match strength, review breakdown) is one tap away on the detail page.
- **The one card-level action is a quick "+"** (add to want list) on the cover. It's the page's core conversion, so it stays; every other "tell me more / decide" action routes to the detail page. (Open: whether even the "+" should move to the detail page and make cards purely navigational — kept for now.)
- **Tag-based discovery survives cold-start** — "Because you finished Elden Ring" is content/tag-driven, so it works before the social graph fills (consistent with the detail page's "Similar games" relabel).
- **Cold-start lever** carried over and demonstrated: with no friends connected, the friends rail collapses to **"Connect Steam to import friends"** — the same growth move as the detail page and feed.
- **Mobile** keeps the bottom tab bar (Discover active); rails become horizontal carousels.

**Consistency held:** no numeric/star scores anywhere; the trust ladder and four-point sentiment grammar are respected (sentiment/distribution detail simply deferred to the detail page on this surface).

---

## Onboarding & personality quiz (wireframed, lo-fi) — the fourth and final core flow

The first-run flow, built as a **multi-screen flow board** (not a single screen) so the whole sequence reads in one static view. Two files, same grayscale language and component grammar:

- `onboarding-quiz-wireframe-desktop.html` (full-screen onboarding canvases, stacked with connecting arrows; the six questions render as a 2-up grid)
- `onboarding-quiz-wireframe-mobile.html` (412px; the same six steps as a wrapping row of phone frames)

**Framing — the quiz is load-bearing infrastructure, not novelty.** It does two jobs at once: (1) it **seeds the *taste* rung of the trust ladder before any play history exists** — the cold-start fix for "people who share your profile," exactly as Steam-connect is the cold-start fix for the *friends* rung; and (2) it's the **expressive identity moment** ("Letterboxd for gamers" earns its first emotional hook and first shareable artifact here). The rest of the product already assumes a named player type ("Strong match for **The Completionist**"), so the quiz is what assigns it.

**The flow (6 steps):** Welcome → Scenario question ×6 → brief "reading your answers" beat → **Result hero** → Connect Steam → land on Discover. Same running example as every other screen: Kevin → *The Completionist*.

**Decisions locked for this flow:**
- **Mechanic = scenario / vibe choices** (e.g. *"A free Saturday, nothing on the calendar — what actually sounds best?"*), **not this-or-that game pairings.** Chosen because it needs no game-recognition, so it works for lapsed/casual players, and it leans into the personality-quiz identity feel. Each answer option quietly loads one or more **taste axes** (shown as orange tags in the wireframe only — the real user never sees them).
- **Result = a named archetype backed by four taste axes.** The shareable type (*The Completionist*) is the hero; beneath it sit the **four axes as dot-on-spectrum evidence** — the "here's why," and the engine layer that powers taste-match. The four axes: **Depth ↔ Breadth · Challenge ↔ Comfort · Story ↔ Systems · Solo ↔ Social.** (A rarity stat — "12% of players share your type" — adds the shareable-identity hook.)
- **The result pays off immediately** — a now-warm "players like you really liked these" rail is previewed right on the result screen, so the quiz's value is visible before the user even reaches the app.
- **Connect Steam is the matched second lever**, framed against the same trust ladder (taste rung now warm from the quiz; friends rung still cold → connect to fill it). Both the quiz and Steam are **skippable, but skipping is never free** — copy makes the global-tier fallback legible rather than hiding it.
- **Sequence = quiz-first → result → Connect Steam → Discover**, so the surface hands off a **non-empty trust ladder** (Discover's "Matched to your taste" and "Friends" rails arrive populated, not collapsed to cold-start).
- **The six-question deck is balanced for coverage:** each axis is probed from a few different angles (booting a new game · weekend intent · tolerance for a 100h game · hitting a wall · purchase trigger · what makes a game stick), and the selected answers across the six trace one consistent example player.

**Question-screen navigation — SUPERSEDES an earlier in-session idea.** An initial pass used **tap-to-auto-advance with no "Next" button**; this was **reversed**. The final, built pattern is: **explicit Back / Next at the bottom of every question**, with the final button (*"See your result"*) **greyed out until all six are answered**. The screen chrome was also simplified — no logo, no top back-arrow; a single **"Exit quiz"** affordance in the corner, progress bar up top. Any lingering "selecting auto-advances / no Next" phrasing is stale — the explicit-nav pattern is canonical.

**User-facing copy note (product-wide vocabulary).** On the Connect-Steam and result screens, the internal trust-ladder metaphor ("rung," "warm/cold") was **scrubbed from on-screen copy** — sources read plainly as *From your friends · Matched to your taste · Popular overall*, with states *Connect to turn on · Set ✓ from your quiz · Always on*. The "rung/ladder" vocabulary is **retained in design annotations only** (it's the team's shorthand, not user-facing). This nudges up against a parked question: whether a shipping product should expose its ranking tiers to users at all, or just order them silently.

**Consistency held:** no numeric/star scores anywhere; the trust ladder and four-point sentiment grammar are respected (the result's taste rail and axes are the quiz's expression of them).

---

## Head-to-head "compare two" flow (wireframed, lo-fi) — the Library refine path

The parked "would you rather" mechanic, finally built — a sub-flow of the Library, but substantial enough to stand alone. Two files, same grayscale grammar:

- `headtohead-wireframe-desktop.html` (1200px — modal over a dimmed Library)
- `headtohead-wireframe-mobile.html` (412px — full-screen takeover)

**Framing — scoped to one job: decide what to play.** A ranking-precision mode (sharpen the four-point scale by ordering games *within* a sentiment bucket) was designed in-session, then **cut** — head-to-head is now **play-only**. Entry is unchanged: the Library "What to play next" hero's "Still can't decide?" path, on both breakpoints.

**Decisions locked for this flow:**

- **Pattern = Beli's "would you rather" (horizontal, tap-the-card).** Two sparse cards side by side with an **OR** badge; tapping the preferred card *is* the choice (no buttons on the card), and the next pairing loads. An earlier denser, vertically-stacked treatment (in-card buttons + trust tags) was replaced — sparseness is the point: head-to-head is a half-second gut pick, not a research task, so the trust signals (match · fits-time · friends) were stripped. Cards carry only **cover · name · genre · time-to-finish**.
- **Mechanic = champion-vs-challenger ("winner stays").** The winner holds its spot; the unchosen card is replaced by the **next game in line**.
- **Stop rule = hybrid, short by design.** Auto-stops at the first of: a game wins **3 in a row**, a **5-compare cap**, or challengers exhausted. Skips are free (count toward neither streak nor cap). Rationale: finding the *true* best needs N−1 comparisons (impossible to shortcut), so the real lever is *confidence*, not correctness — stop at a clear-enough favorite. A **minimal progress cue** (~5 ticks) signals it's short. Seeded **best-match-first**, with the just-rejected Library-hero pick **excluded** (you only enter because that pick didn't land).
- **Intent screen leads the flow.** Before any pairing, an intent question — **"What are you in the mood for?"** — scopes the pool. Four options spanning genre + time-commitment: *Something fast & fun · Chip away at a big game · Get lost in a story · Something chill.* Reuses the onboarding question-screen pattern. **No example games are shown** in the options — seeing a specific title biases the choice; only the label + a wireframe-only filter tag remain. Copy is deliberately **moment-neutral** ("in the mood for," not "tonight" — players aren't necessarily playing at night). The chosen intent **becomes the duel's scope chip** (tappable to switch) and **replaces** a raw duration chip — intent already encompasses time, so there's one scope control, not two. *(This superseded an earlier in-session decision to carry a "How much time? · a free evening" duration chip into the duel.)*
- **Outcome = the winning pick, no launch CTA.** The survivor is revealed with a one-line reason ("Won 3 head-to-heads in a row"). There is deliberately **no "Start playing" button** — the app can't launch a game on the user's PC/console, so the reveal closes the loop with *Keep comparing* / *Back to library*. (Note: "Start playing" elsewhere — e.g. the Library hero — means *flip tracking status to Playing*, not launch.)
- **Cold-start / empty state.** When fewer than two games fit (a thin/new backlog, or a too-narrow intent), it's handled two ways: the Library entry is **gated** (disabled "add 2+ games" hint, stays discoverable), plus an **in-flow screen** (one real card + an empty "add a game" slot) offering **Change your intent** / **Browse Discover** — Discover being the platform-standard cold-start lever.
- **Mobile specifics.** Full-screen (not a modal); header is a back chevron + **"Return to Library"**; the duel is centered vertically for one-handed thumb reach. The flow board is four frames — intent · duel · outcome · cold-start — plus an entry-bar reference showing the live and gated states.

**Consistency held:** no numeric/star scores anywhere; sparse cards; the running example winner stays Hades — the duel/filmstrip challengers were set to fast-fun titles (e.g. Hades vs Slay the Spire) so the example coheres with the demonstrated "fast & fun" intent.

---

## Design system — foundations (this session)

The project crossed from lo-fi into **visual design**, foundations-first. With every core flow already at lo-fi, the team chose to build the **design-system foundations before** taking any single screen to hi-fi (foundations-first, not flagship-first). The canonical artifact is **`design-system-foundations.html`** in the wireframes folder — a self-contained token reference (palette, type, spacing, radius, motion) with the core components rendered in-palette, in **both themes**.

**How the direction was found (the path matters):**
- A first pass landed on **"Midnight editorial"** — a warm-graphite base with an ember-orange accent. The user then caught that this was effectively **Claude's own palette** (warm graphite + clay/orange).
- Regenerated four warm-but-distinctly-not-Claude directions (**Crimson noir / Berry expressive / Chartreuse pop / Jade lounge**), each shifting *both* the accent off orange and the neutral base off neutral-graphite.
- Chose **Crimson noir**, then **stress-tested it** by rendering the densest states (finished + reviewed, cold-start) *before* committing — which is exactly where the load-bearing restraint rule surfaced.

### 1. Direction & palette — Crimson noir (dark-first)
- **Base = wine-graphite `#241B1D`** (a warm dark tinted distinctly off neutral graphite; the original near-black was lightened at the user's call). Surface ladder `#241B1D → #322528 → #3D2D31 → #48363B`.
- **Accent = crimson `#E23E4E`** — the single brand color (CTAs, selection, links), which also anchors the **positive pole of sentiment**.
- **Sentiment = warm↔cool diverging**, deliberately NOT a red/green traffic-light: really-liked `#E23E4E` · liked `#EC8290` · didn't-like slate `#7C8AA0` · really-disliked slate `#49566B`. Reads as a *take*, not a score — coherent with the long-locked "no numeric scores" rule.
- **Trust ladder on a neutral *brightness* axis** (friends `#F0E9E9` → taste `#A9989C` → global `#6E5A60`).
- **The three-axis principle (why this resolves the old grayscale collision):** action = crimson (hue, reserved) · sentiment = warm↔cool (hue, diverging) · trust = brightness (neutral). No visual variable does double duty — the thing lo-fi grayscale couldn't guarantee (sentiment and trust both leaned on darkness).

### 2. The crimson restraint rule (load-bearing)
- **Crimson means sentiment OR primary action — nothing else.** Discovered on the dense finished state, where crimson doing extra duty (alignment chips, callout frames, status checks) made the page loud and risked "aligned" being misread as a *rating*.
- Alignment, status-current, and structural accents stay **neutral**. A neutral **"relate chip"** (sage check for *Agreed* / plain *Diverged*) reports how each trust tier relates to your rating, so it's never confused with sentiment.
- **Destructive does not lean on red alone** (it would echo the brand) — muted brick danger `#CF4636` + icon + confirmation.

### 3. Typography — Familjen Grotesk + Newsreader
- Chosen from four serif+sans pairings (others considered: Fraunces+Inter, Spectral+Space Grotesk, Crimson Pro+Hanken Grotesk) for a warm/cozy/gamer **"friendly-magazine"** feel.
- **Familjen Grotesk** (`--font-sans`) does all UI/body; **Newsreader** (`--font-voice`, serif) is reserved for the publication moments — the **personality archetype name** and **review excerpts**. Both from Google Fonts; shared across both themes (set above the theme layer).

### 4. Light theme — ported
- A `[data-theme="light"]` layer remaps the same token *names* onto **cozy-paper cream `#F6F1E7`** (reusing the "Cozy paper" exploration's base; the first attempt at a wine-tinted `#F2EBE9` paper was replaced at the user's request).
- **Two things flip vs. dark:** the **trust ladder inverts** (most-trusted = *darkest* on paper, since contrast comes from darkness not light) and **crimson deepens** (CTA fill `#D62C3D` with white text; accent text `#BE2A3A`). Sentiment-bar hues and both fonts carry over unchanged.

**Supersessions:** the lo-fi grayscale + the placeholder orange `#E8640A`, *and* the interim ember `#F0623C` "Midnight editorial" direction, are **both superseded by Crimson noir**.

**On taking it forward (orientation only — no migration started):** because the work was done *in code* (CSS custom properties), the **token layer is the portable bridge** to anywhere — a real codebase (copy tokens into a stylesheet / Tailwind / shadcn), claude.ai Artifacts, or Figma (via a Tokens Studio variables JSON). Standing recommendation: stay **code-first**, since the next milestone (verdict module hi-fi) is a *component*, not a drawing. No destination chosen yet.

---

## First hi-fi screen — Discover / Home, mobile (latest session)

The project's **first screen taken out of grayscale into full hi-fi**, built as a **live, interactive Design Component**: `Discover Home.dc.html` (mobile, framed in an iPhone-style device shell). It renders the Discover / Home surface in the **Crimson noir dark theme** with the locked **Familjen Grotesk + Newsreader** pairing — not a static wireframe.

**Sequencing note — this deviates from the foundations handoff's recommendation.** That doc named the **verdict module** as the next hi-fi milestone. The team instead took **Discover / Home to hi-fi first** — the simpler, lower-risk surface — to exercise the palette + type + component grammar in a real interactive build before tackling the differentiator. The verdict module remains the harder, still-pending flagship.

**What's built & interactive:**
- Full mobile chrome: status bar, top bar (Discover title · search · avatar), and the **bottom tab bar** (Discover / Library / Friends / Search) from the lo-fi spec. Non-Discover tabs route to a labeled “not built yet — you’re prototyping Discover” placeholder with a Back-to-Discover button, so the prototype never dead-ends.
- **Greeting + live backlog count** (“Good evening, Kevin · N waiting in your backlog”); the count increments as games are added.
- **Spotlight hero** (“Recommended for you,” dismissible ✕): one *new* game (Hollow Knight) carrying the **compressed two-rung why** exactly per the lo-fi decision — “Strong match for *The Completionist*” (Newsreader italic on the archetype name) + “2 friends have played” (two avatar chips, no names). Primary **+ Add to Backlog** (crimson) toggles to **✓ Added to Backlog**; secondary **View**.
- **Four rails in trust-ladder order** — friends → taste-matched → tag (“Because you finished Elden Ring”) → global — each a horizontal carousel with its **tier badge** (Friends = bright pill / THE COMPLETIONIST / none on tag / Global = outline). Rail cards are **cover · name · platform only** (the “Discover is at-a-glance; the detail page owns depth” rule held), with a **quick “+”** on each cover that pops to ✓ (animated) and fires an “Added to your want list” toast.
- **Cold-start lever** wired to a `friendsConnected` prop: false collapses the friends rail to the **“Connect Steam to import your friends list”** dashed card — the same growth move as every other surface.
- Covers are **`image-slot` placeholders** — the user drops real cover art onto them and the drops persist.

**Tweakable props:** `playerName`, `archetype`, `friendsConnected` (the cold-start toggle).

**Fidelity / consistency held:** dark Crimson noir tokens throughout (wine-graphite surface ladder; crimson reserved for the two add-CTAs + the spotlight’s sentiment diamond), **no numeric/star scores anywhere**, at-a-glance cards, and the **crimson restraint rule** respected (crimson only on primary add actions and the sentiment-pole marker). The global rail uses **invented placeholder titles** (Meccha Chameleon, 007 First Light, Subnautica 2, Forza Horizon 6, PRAGMATA, “Gamble With Your Friends”) so nothing reads as a real shipped ranking; friends/taste/tag rails use real indie titles as the running example.

**New vocabulary wrinkle (feeds the parked naming question).** The hero CTA now reads **“Add to Backlog”** while the card “+” toast says **“Added to your want list,”** and the parked debate was already Track vs. List vs. status. “Backlog” is now effectively a *fourth* term on screen for the same want-list action — the product-wide vocabulary really needs resolving (see open questions).

---

## Open questions / parked for hi-fi

- **"Add to List" naming ambiguity (label, not structure) — now more urgent.** The mobile bottom-bar says "Add to List," and the sheet it opens also contains "+ Add to a list" — two controls saying "list" for different scopes (umbrella vs. custom lists). The bar also sets *play status*, which isn't strictly a "list." **The Discover / Home hi-fi build added a fourth term:** its spotlight CTA says **"Add to Backlog"** while the rail "+" toast says **"Added to your want list."** So the product now shows *want list / list / backlog* (and internally *Track / status*) for overlapping concepts. Pick one canonical verb for "add to the pile of games I intend to play" and apply it everywhere; resolve in hi-fi as components get built.
- **Replay-from-finished path.** Replay was dropped as a top-level status. Likely home in v2/hi-fi: a secondary action inside the "Finished" row ("Finished · play again?"), so the three-option control stays clean.
- **Sheet interaction details (mobile).** The slide-up animation, the scrim, and pre-selecting the current status inside the sheet are hi-fi prototype concerns the static wireframe can't show.
- **Cold-start global distribution.** Kept identical to the mature/populated pages for wireframe consistency. Editorial/critic data realistically skews more positive than the eventual user crowd — differentiating those numbers in hi-fi would tell a truer "editorial leans high, the crowd diverges later" story.
- **Head-to-head "compare two" flow — now fully wireframed** (both breakpoints; see its section above). Built **play-only**; the rating-precision/ranking mode was cut. **The canonical `library-wireframe-*` files have been aligned** — the entry copy/annotation now reflects the intent-first, play-only flow (the stale "sharpen your taste profile" line is gone), and each carries a labeled **gated-state reference** (disabled "Add 2+ games" bar) below the main mockup. Remaining sub-questions: the **outcome → Library handoff** (does the winner get pinned, or become the hero's confident pick?), and whether the Library hero's own "How much time?" duration chip should feed the new intent screen or stay independent (deliberately left untouched in the Library push — it's this open call).
- **Library empty states.** A brand-new user has an empty Want list, so the "What to play next" paralysis hero has nothing to recommend — it needs a cold-start treatment (likely a hand-off to Discover). Not yet wireframed. *(Head-to-head's own cold-start is now drawn — gated entry + an in-flow "add games / change intent → Discover" screen; the Library hero's empty state still isn't.)*
- **Custom list detail view.** Tapping a custom list presumably opens the same browser scoped to that list, but that screen isn't drawn and the interaction isn't confirmed.
- **Library "Add to List" label** feeds the same naming question as the detail page — now that lists are a real destination here, the vocabulary (Track vs. List vs. status) should be resolved product-wide.
- **Friends feed — multi-action per friend.** With secondary rows removed, a card is now one friend + one action, so a friend with several recent actions yields several cards. Unresolved: either (a) separate compact cards per action (low-signal ones smaller/muted), or (b) one card headlining the top action with a "+N more" expander. The original "one card bundles a friend's activity" noise lever is no longer literally true.
- **Friends feed — fully-empty cold-start.** The drawn feed is the *populated* state with the connect-Steam lever inline; the zero-friends / zero-activity day-one state isn't drawn yet (overlaps the onboarding Steam-import step).
- **Onboarding quiz — skip path not drawn.** The flow board shows the *complete* path. If a user skips the quiz, the result hero and the warm taste rail never appear, and Discover degrades to cold-start — that branch isn't wireframed.
- **Onboarding quiz — archetype system is one example deep.** Only *The Completionist* is specified. The full set of named types and the axis-score → archetype mapping is a design system still to build out (a natural hi-fi flagship alongside the verdict module — it's the most expressive surface in the product).
- **Onboarding quiz — Solo ↔ Social is the lightest-probed axis** (explicit in only 2 of 6 questions; it's bipolar so non-Social picks imply Solo). A seventh scenario with an explicit solo/social split would even the weighting if desired. Deck deliberately kept at six for now.
- **Expose ranking tiers, or order silently?** The quiz's Connect-Steam/result copy now names recommendation *sources* plainly. Open product question: whether a shipping app should surface its trust-tier structure to users at all, or just rank quietly behind the scenes.
- **Carried over from prior handoff, still open:** review-matching layout specifics (type-badge placement, sort behavior) — now a build detail, not a blocker.

---

## Suggested next steps (priority order)

*Current direction: design-system foundations are locked (Crimson noir, both themes, type pairing) — hi-fi work has begun, building up from the foundations.*

1. **Core-flow wireframes complete (lo-fi).** All four done: game detail, Library, friends feed, Discover / Home, and **onboarding & personality quiz** — plus the head-to-head refine flow. No core flow remains at this fidelity.
2. **Design-system foundations complete.** Crimson noir palette (dark primary + light port), the **crimson restraint rule**, the three-axis encoding, type (**Familjen Grotesk + Newsreader**), spacing/radius/motion, and core components — all canonical in **`design-system-foundations.html`**. The three previously-deferred forks (sentiment encoding, brand/accent, light-vs-dark) are now settled.
3. **First hi-fi screen shipped: Discover / Home (mobile), interactive.** `Discover Home.dc.html` — the Crimson noir dark theme applied to a live, tappable surface (spotlight, four trust-ladder rails, add-to-backlog, cold-start toggle, tab nav). Proves the palette + type + component grammar in a real build. Still to do here: the **desktop** counterpart in hi-fi, and possibly the light theme.
4. **Next hi-fi milestone: the verdict module.** The differentiator and riskiest thing to get right out of grayscale — now with a palette, a type system, *and* a shipped reference screen to match. Still the recommended next flagship build.
5. **Finish the lo-fi loose ends** (Library empty/cold-start, custom-list detail, friends-feed multi-action + empty cold-start, onboarding quiz skip path, head-to-head **outcome → Library handoff**). These can now be drawn directly in the new palette rather than grayscale.
6. **Resolve the parked vocabulary** (now four-way: Backlog / want list / list / Track / status — the Discover hi-fi build made this concrete) ("Add to List" / Track / List / status) and other parked hi-fi items (replay path, mobile sheet interaction) as components get built.

---

## Reference: trust ladder & rating grammar (load-bearing across the product)

- **Trust ladder:** friends → taste-matched → global. Descending from personal to anonymous. Every rating/review surface respects this order. Taste-matched outranks global everywhere.
- **Rating grammar:** individuals rate on the four-point sentiment scale (no neutral); all aggregates display as four-bucket distributions; nothing shows a single numeric score. The global tier earns its place precisely *when it disagrees* with the personal tiers.

---

*Last updated: first hi-fi screen session — built **`Discover Home.dc.html`**, the Discover / Home mobile surface, as a live interactive Design Component in the Crimson noir dark theme (spotlight hero with compressed two-rung why, four trust-ladder rails as carousels, at-a-glance cover cards with quick-add, cold-start Connect-Steam collapse, tab nav, image-slot covers, tweakable playerName/archetype/friendsConnected). Went to hi-fi ahead of the verdict module by choice, to prove the system on a lower-risk surface first. Surfaced a four-way vocabulary collision (Backlog / want list / list / Track). Prior: design-system foundations session — crossed from lo-fi into visual design, foundations-first. Explored vibe directions, caught that the first pick ("Midnight editorial") was Claude's own palette, and pivoted to **Crimson noir** (wine-graphite `#241B1D` base, crimson `#E23E4E` accent, warm↔cool diverging sentiment, neutral-brightness trust ladder). Stress-tested it on the dense states and derived the **crimson restraint rule** (crimson = sentiment or primary action only). Locked type (**Familjen Grotesk + Newsreader**) and **ported a light theme** (cozy-paper cream `#F6F1E7`; trust ladder inverts, crimson deepens). All committed to `design-system-foundations.html`. Next milestone: verdict module to full hi-fi. Living document — supersedes handoff v2.*
