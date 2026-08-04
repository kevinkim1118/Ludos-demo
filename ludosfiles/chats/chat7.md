# Head-to-head feature prototype

_Started 2026-07-06 22:14 UTC_

---

## User

lets work on the head-to-head feature. using the wireframe attached to this message and the design system that we established, create a high fidelity prototype of the head to head feature.

## Assistant

Let me look at the wireframe and the existing design system.

_[tool: read_file]_

_[tool: read_file]_

Let me look at the Library and one more file to fully understand the design system and entry point.

_[tool: read_file]_

I have strong context now — a well-established design system and a detailed 4-frame wireframe. Let me read the interactive prototype skill, then build.

_[tool: read_skill_prompt]_

Design system is clear (Familjen Grotesk + Newsreader, warm-dark `#241B1D` surfaces, `#E23E4E`/`#F08C95` accents, 430px phone frame). I'll build the full head-to-head flow as one interactive DC covering all four frames with a real winner-stays state machine.

_[tool: update_todos]_

Now building the Head-to-Head prototype.

_[tool: dc_write]_

Now wire the Library entry point to the flow.

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: show_html]_

Intent screen looks right. Let me verify the duel and outcome states interactively.

_[tool: multi_screenshot]_

Duel works — progress advances (1→2 segments) as picks resolve, intent chip carries through, cards render. State machine is functioning. Handing to the verifier.

_[tool: update_todos]_

_[tool: ready_for_verification]_

Built the head-to-head "compare two" flow as a full interactive prototype in your design system's warm-dark palette:

- **Intent** → pick a mood (fast/big/story/chill), which scopes the pool
- **Duel** → Beli-style side-by-side with the OR badge; tap to pick, winner stays, next challenger loads with a highlight/swap animation; progress ticks, carried-intent chip (tap to change), plus Undo and Skip
- **Outcome** → the winning pick with a "why it won" reason (3-in-a-row / 5-matchup cap / last standing)
- **Cold-start** → shown when a mood has under 2 games ("Something chill" triggers it)

The Library "Still can't decide?" bar now opens the flow, and back/return routes to Library. Tweaks let you jump straight to any screen (`startScreen`) or preset the mood (`initialIntent`). Drop your own cover art onto the placeholder slots and it persists per game.

## User

change all instances of "Hades" to "Hades II." I have a cover image of Hades II and I keep having to rename each "Hades" to "Hades II."

## Assistant

_[tool: read_file]_

_[tool: dc_js_str_replace]_

All instances are driven by one `GAMES.hades` entry, so it now reads "Hades II" everywhere (chip, cards, outcome) — no per-screen renaming needed, and your cover image stays attached since the slot ID didn't change.

_[tool: ready_for_verification]_

Done.

## User

the steam requirement for a vertical cover art is 600 pixels by 900 pixels, which I use for my pictures. edit the size of the photo frames so that the pictures fit perfectly into the frames at different scales.

## Assistant

_[tool: grep]_

Updating all four cover slots to the 2:3 (600×900) Steam ratio.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

All four cover frames (duel pair, outcome, cold-start) now use a 2:3 ratio matching Steam's 600×900 spec, so your art fills them edge-to-edge at any scale.

_[tool: ready_for_verification]_

Done.

## User

there seems to be a double space in between "playing" and "Hades II." make sure there is a single space there.

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_html_str_replace]_

_[tool: show_html]_

That's the intent screen (default view); the outcome button now groups "Start playing" and the game name into one text node so the flex gap only applies between the icon and text, closing the visual double space.

_[tool: ready_for_verification]_

Fixed.

## User

delete

## Assistant

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Removed.

## User

when i press another, it changes the text for the next game but not the cover art.

## Assistant

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: grep]_

`pick.k` is already there (used in `pickKey`) — just need to expose it as the slot id.

_[tool: str_replace_edit]_

Fixed — the "What to play next" cover now uses a slot ID keyed per game (`cv-pick-hades`, `cv-pick-outerwilds`, etc.), so "Another" swaps both the text and the cover instead of reusing one shared slot.

_[tool: ready_for_verification]_

Done — you'll need to re-drop covers onto each game's new slot since they're separate now.

## User

Change "Big game" to "Long Haul"

## Assistant

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Done.

## User

change "Mystery" to "Exploration." Outer Wilds is more exploration than it is mystery

## Assistant

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Done.

## User

Change the copy to "Mark [Game Name] as playing" instead of "Start playing [Game name]." The app cannot launch games for the game's respective platforms.

## Assistant

_[tool: grep]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Done.

## User

add a toast message after the user presses "mark [game name] as playing" that says "Marked [game name] as playing," after the head-to-head takes the player back to the Your Library page

## Assistant

_[tool: grep]_

No mount hook yet. I'll add one that reads a one-shot flag written by Head-to-Head before navigating.

_[tool: str_replace_edit]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Wired up: pressing "Mark [game] as playing" stashes a one-shot message and Library shows it as a toast right after landing.

## User

only add the > chevron on a card if it's for a friend that left a written review. anything else, like if a friend started playing a game, if they reviewed a game but with no written review, if they finished a game, exclude the chevron that goes to that game's detail.

## Assistant

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Chevron now only appears on Maya's "left a review for Hades" card (the one written review in the feed) — finishes, ratings, playing, and list-add cards no longer show it.

_[tool: ready_for_verification]_

Done.

## User

add a chevron to this activity card, since the user left a review.

## Assistant

_[tool: str_replace_edit]_

Adjusted the rule: chevron shows whenever a written review/snippet is attached — so Alex J's and Sam K's finishes (which include blurbs) now get it too, alongside Maya's review. Ratings, playing, and list-adds still don't.

_[tool: ready_for_verification]_

Done.

## User

update the handoff markdown file with everything that we've accomplished in this chat

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: read_file]_

Looks correct — v4 written to `uploads/game-detail-session-handoff-4.md`, superseding v3. It adds the Head-to-head hi-fi section, resolves the outcome→Library handoff open question, folds in this session's copy/bugfixes (Long Haul, Mark-as-playing, Steam cover ratio, re-roll cover bug, chevron rule), and updates the next-steps/footer accordingly.

