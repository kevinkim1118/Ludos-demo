# Library next card toggle

_Started 2026-07-23 00:55 UTC_

---

## User

make the recommended for you card a tweak that when toggled, hides/unhides it, and copy the "what to play next" card from the library page and place it under the "recommended for you" card. I want to see how the "what to play next" card would look and feel if it were on the discover/home page.

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

I need to see the full "What to play next" card and its supporting logic. Let me read that region of `Library.dc.html`.

_[tool: read_file]_

Now the logic backing the card. Let me find those handlers in the logic class.

_[tool: grep]_

_[tool: read_file]_

Now the time-sheet markup:

_[tool: read_file]_

I have everything I need. Now I'll (1) add a `showRecommended` tweak prop, (2) wire it to hide the spotlight card, and (3) copy the "What to play next" card + its time sheet + backing logic into Discover Home.

_[tool: dc_set_props]_

Now insert the "What to play next" card after the spotlight card:

_[tool: str_replace_edit]_

Now add the time sheet overlay (next to the existing toast/sheets) and wire up the logic. First the overlay:

_[tool: str_replace_edit]_

That edit broke the toast. Let me fix it by restoring and inserting the time sheet before it:

_[tool: str_replace_edit]_

Let me check for the dangling toast fragment left by the earlier broken edit:

_[tool: grep]_

Confirmed dangling fragment on line 439. Remove it:

_[tool: read_file]_

_[tool: str_replace_edit]_

Now the logic. Add state fields:

_[tool: str_replace_edit]_

Now wire `showRecommended` into `spotVisible` and add the pick/time-sheet render vals:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

I need to define `pick` before it's used in renderVals. Let me add it at the top of the return-value computation:

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Done. Two changes to **Discover Home copy**:

- **Recommended for you** is now a Tweak (`showRecommended`, on by default) — toggle it in the Tweaks panel to hide/show the spotlight card.
- The **"What to play next"** card from the Library page now sits directly below it — fully live (time-context chip + sheet, "Another" re-roll, head-to-head bar), using its own state so it doesn't collide with the existing sheets.

## User

create a tweak that hides/unhides the "what to play next" card in this library copy page

## Assistant

_[tool: grep]_

I need the card's closing tag and the current props JSON. Let me read both.

_[tool: read_file]_

_[tool: read_file]_

I need the card's closing `</div>` line. Let me read a bit more:

_[tool: read_file]_

Now wrap the card in an `sc-if`, add the prop, and the render val:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: dc_set_props]_

_[tool: str_replace_edit]_

That dropped a line. Restore it and add the render val to the return object instead:

_[tool: str_replace_edit]_

Now add the render val to the return object, next to the h2h flags:

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Added a **Show what next** tweak (on by default) that hides/unhides the "What to play next" card on the Library copy page.

