# Friends activity feed mockup

_Started 2026-07-05 04:26 UTC_

---

## User

attached to this message is the wireframe for the friends activity feed. using the design system we established and wireframe created, generate a hi-fi mockup of the friends activity feed.

## Assistant

_[tool: read_file]_

_[tool: read_file]_

I have the design system from Discover Home. Let me check the app-shell/canvas files quickly to match conventions.

_[tool: read_file]_

_[tool: read_file]_

Empty scaffolds. I have the full design system from Discover Home. I'll build the Friends feed as its own DC matching the exact app shell (frame, status bar, tab bar), translating the wireframe into hi-fi with working filters, an investigate tap-through, and a friends-list sheet behind the people icon.

_[tool: update_todos]_

Now building the Friends Feed DC:

_[tool: dc_write]_

_[tool: update_todos]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

Blank — the page isn't loaded in my iframe yet. Let me check logs.

_[tool: show_to_user]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

Renders cleanly and matches the design system. Handing off to verification.

_[tool: ready_for_verification]_

Done. The **Friends activity feed** hi-fi mockup is built from the wireframe, using the established design system (warm-dark palette, Familjen Grotesk + Newsreader serif for quotes, coral accent, the shared phone/status/tab-bar app shell).

What it carries over from the wireframe, made functional:
- **Action-led digest cards** — headline is the friend's main action ("Alex just finished Elden Ring"), with cover + sentiment pill + serif review snippet below; list-adds and now-playing get their own detail treatments.
- **Working filter chips** — All activity / Finishes & reviews / Ratings / Playing actually filter the feed, with live counts.
- **Recency grouping** (Today / This week) and non-jumping "Same taste" badges.
- **Investigate path** — tapping any card opens Game Detail.
- **Inline Connect-Steam growth lever** between the day groups.
- **Friends list behind the people icon** — a bottom sheet with presence dots and same-taste tags.
- Bottom-tab nav wired to Discover and Library; Friends active.

Tweaks exposed: friend count, show/hide the connect prompt, and the same-taste highlighting.

## User

edit so that these filter pills match the dark mode palette.

## Assistant

_[tool: dc_html_str_replace]_

Active chip now uses the coral accent tint (matching sentiment/same-taste tags) instead of an inverted light pill.

_[tool: ready_for_verification]_

Done.

## User

change the color of the pills so that it matches the design system; white text with a black/grey background with a grey border.

## Assistant

_[tool: read_file]_

Confirmed reverted state. Updating active chip to white text on a dark grey background with a grey border.

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Done.

## User

the filter pills at the top should match the filter pills in "library." see attached image below as reference. currently, all pills have a white background with white text, where instead it should match what the image shows.

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: dc_html_str_replace]_

Now update the logic to compute `bg`/`fg`/`bd` instead of `active`/`inactive`:

_[tool: dc_js_str_replace]_

Now matches Library's exact pill treatment (cream active pill, dark text; transparent inactive with grey border).

_[tool: ready_for_verification]_

Done.

## User

remove the link to elden ring game game for now, so that I can insert images without having to navigate to the game detail page

## Assistant

_[tool: read_file]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

Removed the tap-through on the Elden Ring card only — the cover slot there is now free to drop an image into without triggering navigation. Other cards still link to Game Detail.

_[tool: ready_for_verification]_

Done.

## User

remove the tap through on the other cards as well.

## Assistant

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Done — all cards are now static, no navigation.

