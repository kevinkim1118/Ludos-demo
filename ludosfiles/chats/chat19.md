# Currently Playing card display

_Started 2026-08-03 19:05 UTC_

---

## User

when a game is marked playing on the discover page, it should reflect with the currently playing card at the top of the page. For example, if I press the plus icon and select "mark as playing" for Outer Wilds, the "currently playing" card should appear at the top of the page, with the Outer Wilds cover image and title. This applies to all the games on the discover page.

## Assistant

I'll look at how Discover handles the plus menu and the currently-playing card.

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

Now the edits:

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Now the rail/spotlight `openSheet` calls and renderVals:

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Template: rename the sheet buttons' handlers and attach the scroll ref.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: eval_js]_

_[tool: delete_file]_

_[tool: ready_for_verification]_

Marking any Discover game as playing now swaps the top card into "Currently playing" with that game's cover, title, and platforms, and scrolls back up to it. "Update Status → Mark as finished" clears it (that button previously did nothing).

## User

before i completed the head to head, I marked outer wilds as playing on the home page, and that was reflected by the currently playing card displaying outer wilds as playing. but after I completed the head to head, the outer wilds did not get replaced with the game that won the head to head. resolve this issue

## Assistant

_[tool: grep]_

The head-to-head winner set `upNext`, but `playingItem` still won in the card. Clearing it wherever `upNext` is set:

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Finishing a head-to-head now overrides a manually marked game, so the currently-playing card shows the winner instead of Outer Wilds.

## User

add an option to this dropdown that says "Move to backlog" with a bookmark icon on the left."

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: grep]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Added "Move to backlog" with a bookmark icon under "Mark as finished" — it clears the currently-playing card and marks the game as backlog.

