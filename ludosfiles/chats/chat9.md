# Game covers permanence issue

_Started 2026-07-08 19:28 UTC_

---

## User

how do I make the game covers permanent in the prototype so that I don't have to insert them manually when I port these prototypes to vercel?

## Assistant

Good question — let me look at how images are currently set up in your prototypes.

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: run_script]_

_[tool: run_script]_

Here's what's going on, and the clean fix.

**Why they vanish on Vercel:** your covers aren't in the code — they're drag-and-drop `<image-slot>` placeholders. Each dropped image is stored as a base64 data-URL in a hidden sidecar file (`.image-slots.state.json`) that `image-slot.js` fetches at runtime through this environment's host bridge. On Vercel there's no host bridge and (unless you copy it) no sidecar, so every slot renders empty and you re-drop by hand.

**The fix:** bake the covers into real committed image files and reference them with a normal `src`, so they ship with the code. You already have all 86 covers sitting in that sidecar — I can extract them into an `assets/covers/` folder and rewire the prototypes automatically. Two options for the rewire:

- **Keep `<image-slot>`, add `src="assets/covers/….webp"`** on each — smallest diff, still lets you re-drop later, but you must also commit `image-slot.js`.
- **Replace `<image-slot>` with plain `<img>`** — cleanest for deploy; drops the runtime dependency entirely. I'd preserve each cover's crop framing via `object-fit`/`object-position`.

Let me confirm one thing before recommending which — whether any of your covers were repositioned/zoomed after dropping:

_[tool: run_script]_

Good — only **11 of 86** covers were repositioned/zoomed; the other 75 are default centered crops. All 11 are reproducible with `object-position` (+ a scale transform for the 3 that were zoomed), so nothing gets lost.

**My recommendation: option 2 (plain `<img>`).** For a Vercel deploy it's the cleanest — the covers become ordinary committed image files, no `image-slot.js`, no sidecar, no host bridge. I'd:

1. Extract all 86 covers from the sidecar into `assets/covers/<slot-id>.webp`
2. Replace every `<image-slot>` with an `<img>` pointing at its file, carrying over the 11 custom crops
3. Leave the layout/styling otherwise untouched

That makes the whole set portable — you `git push` and the covers are just there.

One caveat worth flagging: doing this **removes the ability to re-drop covers in this tool** (they become fixed `<img>`s). If you still want to keep editing covers here *and* deploy to Vercel, I'd instead keep `<image-slot>` but add committed `src=` fallbacks — more moving parts, but editable both places.

Want me to go with option 2 across all six prototypes (Discover Home, Game Detail, Friends Feed, Head-to-Head, Library, Onboarding)? Or the editable-fallback version?

