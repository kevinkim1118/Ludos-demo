# Apply drawing

_Started 2026-07-20 19:05 UTC_

---

## User

Continuing from "Ludos design system update".

## Assistant

We've been systematically wiring the entire video game backlog app to the Ludos Design System. Started with Discover Home, then moved through Game Detail, Profile, Onboarding, Friends Feed, Library, Search, and Head-to-Head — each file now loads the DS token stylesheets + bundle and uses real Ludos components where they apply.

Key decisions made:
- Adopted `SentimentPill` component across Game Detail, Profile, Friends Feed, and Library (replacing custom icons since Ludos avoids icon-faces for sentiment)
- Used `VerdictBar` for Game Detail's diverging completionists/global sentiment distributions
- Adopted `RelateChip` for Game Detail discovery match labels, fixing an encoding violation where alignment was crimson (must be neutral per Ludos)
- Recolored verdict tier dots from crimson to trust-ladder brightness tokens (friends → global)
- Restyled Friends Feed activity cards to match Profile's layout: large 2:3 cover thumb, verb+title heading with chevron, date, sentiment pill, and quoted text with left rule
- Fixed Head-to-Head cover aspect ratio by adding `height: auto` to slots (DS image-slot defaults were overriding the 2:3 ratio)
- All hardcoded hex converted to `var(--*)` tokens; device chrome and intermediates with no exact tokens left as-is

Current state:
- Every interactive page (Discover Home, Game Detail, Profile, Onboarding, Friends Feed, Library, Search, Head-to-Head) fully wired to Ludos tokens + components
- Sentiment badges, verdict bars, trust/alignment chips all using real DS components
- All token-matching colors driven by design-system variables
- Head-to-Head covers now rendering at true 2:3 portrait ratio, matching app-wide standard

Two standalone Library export files remain if those need Ludos alignment, otherwise the app is fully integrated.

Files involved: Discover Home.dc.html, Game Detail.dc.html, Profile.dc.html, Onboarding.dc.html, Friends Feed.dc.html, Library.dc.html, Search.dc.html, Head-to-Head.dc.html, .image-slots.state.json

## User

Apply drawing

## Assistant

I'll look at the current Friends Feed header to find the filter button.

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

Now wire up the handler. Let me check the existing `onSort` handler in the logic.

_[tool: grep]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Replaced the sort button with an add-friends button — crimson noir orange (`--accent-500`) fill, white plus icon.

## User

add a fade out animation when the close element is clicked on the recommended card, and add a easing slide up animation for the elements below it, that move up when the recommended card is closed.

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now update the logic — add the dismissing state and expose `spotAnim`.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Clicking dismiss now fades the recommended card out and collapses its height, so the cards below ease upward to fill the space. Let me confirm the collapse mid-animation looks clean.

_[tool: multi_screenshot]_

The card fades out and collapses, and the "What your friends are playing" section eases up to fill the space. Working as intended.

