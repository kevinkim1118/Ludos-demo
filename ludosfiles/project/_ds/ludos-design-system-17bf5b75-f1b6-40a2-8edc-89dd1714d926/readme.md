# Ludos Design System — "Crimson Noir"

The design system for **Ludos**, a video-game backlogging and tracking app — *Letterboxd for gamers*. You track what you want to play, log what you've finished, and record how you felt about it on a deliberately opinionated four-point scale. Ludos reads less like a utility and more like a **publication**: a curated, opinionated space you open the way you'd open a magazine, not reflexively like a dashboard.

The personality in one line: **sophisticated but warm, opinionated but restrained.** Dark is a bookstore café at night; light is a sun-filled library reading room. Same system, two lights.

## Sources

This system was built from a read-only codebase attached to the project:

- **`backlog-design-system/`** — a real React + TypeScript component package (`@backlog/design-system`, v0.1.0). A deliberately minimal "pipeline slice": the full two-theme token layer plus `ThemeRoot`, `Button`, `VerdictBar`, `SentimentPill`. Its README calls itself the "Crimson noir design system … Letterboxd for gamers" and references a canonical `design-system-foundations.html` token reference (that HTML file was **not** included in the attachment).

No Figma file, no logo asset, and no marketing site were provided. Values below are copied **exactly** from `backlog-design-system/src/styles/tokens.css` — no rounding, no snapping to a grid.

## Components (this system)

- **`ThemeRoot`** — required token + theme context wrapper (`theme="dark"|"light"`).
- **`Button`** — action control (`primary` / `secondary` / `ghost` / `danger`).
- **`Icon`** — official Lucide icon wrapper (1.75px stroke).
- **`SentimentPill`** — one person's four-point sentiment lean.
- **`VerdictBar`** — aggregate four-bucket sentiment distribution ("The verdict").
- **`RelateChip`** *(intentional addition)* — neutral taste-alignment chip.
- **`TrustBadge`** *(intentional addition)* — trust-ladder source label.

### Intentional additions

The source ships four components but its token layer defines two more fully-specified UI concepts with dedicated token sets. These were built as components rather than invented from nothing:

- **`RelateChip`** — the source defines `--relate-bg / --relate-border / --relate-tx` for an "alignment" chip described in comments as "neutral, never sentiment." Built to make that encoding usable.
- **`TrustBadge`** — the source defines a three-rung `--trust-friends / --trust-taste / --trust-global` "trust ladder (neutral brightness axis)." Built to surface *whose* verdict you're reading.

If either misrepresents the intended API, say so and they'll be revised or removed.

---

## CONTENT FUNDAMENTALS

How Ludos writes. The copy is where "publication, not utility" is won or lost.

- **Voice: second person, warm, direct.** The UI talks to *you* ("Add to want list", "here's what you rated"). It never refers to itself in the first person and never sounds like a corporate product ("We've updated your library!"). It's a knowledgeable friend, not a brand.
- **Sentence case everywhere.** Buttons, labels, headings: `Add to want list`, `Recently logged`, `Really liked it` — never Title Case, never ALL CAPS except tiny mono eyebrow labels (letter-spaced, e.g. `RECENTLY LOGGED`).
- **Opinion over grading.** The scale is a *choice*, not a score: `Really liked it`, `Liked it`, `Didn't like it`, `Really disliked it`. Never "5 stars", never "8.4/10". Copy reinforces this — "you make a choice and see how it compares," not "rate this game."
- **The four sentiment labels are fixed strings.** `Really liked it / Liked it / Didn't like it / Really disliked it`. There is deliberately **no neutral middle** — the system asks you to lean.
- **Editorial moments get the serif.** Archetype names ("The Completionist"), review excerpts, and big quotes are set in Newsreader — these are treated as *someone's actual voice*, a publication moment. Example excerpt tone: *"I didn't expect to still be thinking about the ending three weeks later."*
- **Restraint in language mirrors restraint in color.** Short, confident, unhurried. No exclamation-point enthusiasm, no growth-hack urgency, no gamification badges-and-streaks language.
- **Emoji: none.** The brand does not use emoji. Sentiment, trust, and alignment are all expressed through the color/type system, never through emoji or icon-faces.
- **Numbers are factual, not gamified.** Counts, percentages, playtime, release years — set in mono, presented plainly ("128", "54%", "42h"). They inform; they don't congratulate.

---

## VISUAL FOUNDATIONS

- **Palette — wine-graphite, not neutral grey.** The dark base (`--surface-0: #241B1D`) is a warm, dark, intentional graphite with a wine undertone — its own world, explicitly *not* a clay-on-graphite or blue-grey neutral. Light is **cozy-paper cream** (`#F6F1E7`), never sterile white. Elevation climbs through four warm surfaces (`surface-0`→`surface-3`).
- **Crimson is spent like currency.** `--accent-500` (#E23E4E dark / #D62C3D light) is the *one* signal that matters. It means **primary action** or **positive sentiment** — nothing else. Not decoration, not alignment, not status, not structure. Because it's rationed, it's loud when it appears. This single rule is the whole personality.
- **Three independent encodings, no variable does double duty.** Action = hue (crimson). Sentiment = warm↔cool diverging scale (`#E23E4E` really-liked → `#49566B` really-disliked). Trust = neutral **brightness** (friends brightest → everyone dimmest). Alignment (RelateChip) = neutral graphite. Keeping these orthogonal is a core rule.
- **Type — literary meets approachable.** Two families in productive tension: **Newsreader** (serif, `--font-voice`) for the human/editorial voice — archetype names, review excerpts, quotes; **Familjen Grotesk** (sans, `--font-sans`) for the friendly, playful UI. System **mono** (`--font-mono`) for counts/codes. Body is 15px / 1.55.
- **Spacing — 4px base.** `--sp-1`(4) through `--sp-12`(48). Calm, generous, magazine-like rhythm rather than dense dashboard packing.
- **Radius — a climbing ladder.** `--r-seg`(3, near-square distribution segments) · `--r-control`(8, buttons/inputs) · `--r-card`(12, cards) · `--r-pill`(999, pills/chips).
- **Cards.** Surface `surface-1`/`surface-2` on the page's `surface-0`, `--r-card` (12px) corners, a **1px `--border`** hairline. No heavy drop shadows — depth comes from the warm elevation ladder, not from shadow. There is **no shadow token layer** in the source; keep elevation flat and let surface value carry hierarchy.
- **Borders.** Hairline `--border` (#45353A) for structure, `--border-strong` (#57434A) for emphasis / secondary-button outlines. Borders are structural and neutral — never crimson unless marking a crimson element.
- **Backgrounds.** Flat warm surfaces. **No gradients, no photographic hero washes, no texture/noise, no repeating patterns** in the token layer. Game cover art (when present in product) provides the only imagery; chrome stays flat and quiet so the art and the crimson can speak.
- **Motion.** One house easing — `cubic-bezier(0.2, 0, 0, 1)` (`--ease`) — across three durations: `--dur-fast`(120ms, color/hover), `--dur-base`(200ms), `--dur-slow`(320ms). Motion is a quiet fade/ease, never a bounce or spring. The button's only transition is `background` on hover.
- **Hover states.** Primary button lightens (accent-500 → accent-400). Secondary/ghost gain a `surface-2` fill. Hover is a small, warm shift — never a scale or glow.
- **Press states.** Primary darkens (accent-500 → **accent-600**). No shrink/scale transform in the source; the color shift is the feedback.
- **Disabled.** Text drops to `--text-disabled`; `cursor: not-allowed`. No opacity dimming of the whole control.
- **Transparency & blur.** Not used in the source token/component layer — surfaces are opaque. Introduce blur only for genuine overlays, and sparingly.
- **Imagery vibe.** Warm, moody, cinematic on dark; warm and inviting on light. Never cool/clinical, never harsh b&w. Let cover art stay full-color; the chrome does the restraint.

---

## ICONOGRAPHY

**Lucide is the official Ludos icon set.** The source package shipped no icons of its own, so the system standardizes on **Lucide** (lucide.dev) — a clean, consistent outline set whose restraint suits the "publication, not utility" feel.

- **The house stroke is 1.75px.** All icons render at `stroke-width: 1.75` via the `Icon` component (`components/icons/`). Don't change the weight casually — it's a brand constant.
- **Load Lucide via its UMD script**, then use the `Icon` component:
  ```html
  <script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js"></script>
  ```
  ```jsx
  <Icon name="library" />          // 18px default
  <Icon name="arrow-left" size={16} />
  ```
- **Icons are neutral.** They inherit `currentColor` and sit in `--text-secondary` / `--text-muted`. **Never tint an icon crimson unless it *is* the primary action** — the crimson-restraint rule applies to icons exactly as it does to everything else.
- **Sizing:** 16px inline with text, 18px default UI, 22px+ for standalone/feature icons. Pick names from lucide.dev in kebab-case.
- **No logo / brand mark exists in the sources.** Per brand rules we did **not** invent one: wherever a mark would go, the wordmark **"Ludos"** is set in Newsreader (see `thumbnail.html`). If you have a real logo, drop it in `assets/` and it will be adopted.
- **Emoji and unicode symbols are not used as icons** — consistent with the no-emoji content rule.
- If Ludos later adopts a bespoke icon set, replace the glyphs Lucide provides and keep the `Icon` API and 1.75px weight.

---

## Index / manifest

Root:
- `styles.css` — the single entry point consumers link. `@import`s only.
- `thumbnail.html` — homepage tile (wordmark + swatch strip).
- `readme.md` — this file.
- `SKILL.md` — Agent-Skill-compatible entry for downloaded use.

`tokens/` — `fonts.css` · `colors.css` · `typography.css` · `spacing.css` · `base.css`

`components/`
- `core/` — `ThemeRoot`, `Button` (+ `core.card.html`)
- `icons/` — `Icon` (official Lucide wrapper, 1.75px stroke) (+ `icons.card.html`)
- `sentiment/` — `SentimentPill`, `VerdictBar`, `RelateChip`, `TrustBadge` (+ `sentiment.card.html`)

`guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand groups).

`ui_kits/`
- `app/` — the Ludos app: game detail, backlog library, log-a-verdict flow.

## Conventions (from the source, kept)

- **Wrap everything in `ThemeRoot`.** It sets background, text color, font, and the active theme. Components outside it are unstyled.
- **Styling is token-driven CSS.** Consume `var(--*)`; never hardcode hex.
- **Crimson is reserved** — primary action or positive sentiment only.
- **The build artifacts** (`_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json`) are generated — never hand-edited.
