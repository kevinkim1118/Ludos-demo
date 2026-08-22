// Derives, from the app's own data files, every cover slot id this build can
// render. Shared by the manifest generator and the single-file packer so the
// two never disagree about what artwork is actually reachable.

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');

/** Slot-id prefixes that follow the `cv-<prefix>-<game key>` convention. */
export const GAME_SLOT_PREFIXES = ['pick', 'h2h', 'seed', 'fr', 'ts', 'gl', 'search', 'lib', 'list', 'disc'];

/**
 * @returns {{ all: Set<string>, byPrefix: Record<string, Set<string>>, standalone: Set<string> }}
 *   `byPrefix` maps a prefix to the game keys used under it; `standalone` holds
 *   slots that aren't keyed by game (marquee tiles, the logo, avatars).
 */
export function appSlots() {
  const games = read('src/data/games.ts');
  const content = read('src/data/content.ts');
  const library = read('src/data/library.ts');
  const detail = read('src/data/detail.ts');
  const friends = read('src/data/friends.ts');
  const profile = read('src/data/profile.ts');

  const all = new Set();
  const byPrefix = Object.fromEntries(GAME_SLOT_PREFIXES.map((p) => [p, new Set()]));
  const standalone = new Set([
    'intro-logo',
    'intro-elden-cover',
    'cv-spotlight',
    // Game detail's landscape key art, the one slot that isn't a cover.
    'cv-detail-hero',
    // The profile's banner and avatar — a 196px landscape band and an 80px
    // circle, neither of them a 2:3 capsule, so both stay off the convention.
    'cv-profile-cover',
    'cv-profile-avatar',
  ]);

  const addGame = (prefix, key) => {
    byPrefix[prefix].add(key);
    all.add(`cv-${prefix}-${key}`);
  };

  // Onboarding intro: three auto-scrolling rows of six tiles.
  for (const row of [1, 2, 3]) {
    for (let n = 1; n <= 6; n++) standalone.add(`disc-r${row}-${n}`);
  }

  // The friends feed keys its covers by who acted, not by the game — `ff-alex`
  // rather than `cv-fr-eldenring` — so they fall outside the prefix convention.
  for (const m of friends.matchAll(/\{ g: '[^']+', key: '([^']+)'/g)) standalone.add(`ff-${m[1]}`);

  // The profile's reviews and activity are keyed by the entry, not the game —
  // `cv-act-a-elden` rather than `cv-act-eldenring` — so they sit outside the
  // prefix convention too. `PR_ACTIVITY` keys already carry their own `a-`.
  const prReviews = profile.match(/PR_REVIEWS: PrReview\[\] = \[([\s\S]*?)\n\];/)?.[1] ?? '';
  for (const m of prReviews.matchAll(/\{ k: '([^']+)'/g)) standalone.add(`cv-rev-${m[1]}`);

  const prActivity = profile.match(/PR_ACTIVITY: PrActivityItem\[\] = \[([\s\S]*?)\n\];/)?.[1] ?? '';
  for (const m of prActivity.matchAll(/\{ k: '([^']+)'/g)) standalone.add(`cv-act-${m[1]}`);

  // Reviewer avatars — initials only, no artwork by design.
  for (const m of content.matchAll(/slotId: '(cv-review-\d+)'/g)) standalone.add(m[1]);

  // Hand-authored cards in the played-games picker.
  for (const m of games.matchAll(/slotId: '(cv-played-blank-\d+)'/g)) standalone.add(m[1]);

  // Searchable played-games catalogue.
  for (const m of games.matchAll(/\{ k: '([^']+)', n: /g)) addGame('search', m[1]);

  // Every GAMES entry can surface as a pick card or a duel card.
  for (const m of games.matchAll(/^\s{2}(\w+):\s*\{ k: '/gm)) {
    addGame('pick', m[1]);
    addGame('h2h', m[1]);
  }

  // Seeded backlog on the onboarding result screen.
  const seed = games.match(/export const SEED = \[([^\]]+)\]/)?.[1] ?? '';
  for (const m of seed.matchAll(/'([^']+)'/g)) addGame('seed', m[1]);

  // Library shelf — one card per LIB_GAMES entry.
  const libGames = library.match(/LIB_GAMES: LibGame\[\] = \[([\s\S]*?)\n\];/)?.[1] ?? '';
  for (const m of libGames.matchAll(/\{ k: '([^']+)', n: /g)) addGame('lib', m[1]);

  // Related games at the foot of the game-detail screen.
  for (const m of detail.matchAll(/\{ k: '([^']+)', n: /g)) addGame('disc', m[1]);

  // Rows inside a list's detail panel.
  for (const m of library.matchAll(/\{ k: '([^']+)', name: /g)) addGame('list', m[1]);

  // Collection cover strips — `cv-coll-<key>-<n>`, capped at ten by libCoverStrip.
  for (const m of library.matchAll(/key: '([^']+)', count: (\d+)/g)) {
    const n = Math.min(Number(m[2]), 10);
    for (let i = 0; i < n; i++) standalone.add(`cv-coll-${m[1]}-${i}`);
  }

  // Discover rails — each block's prefix applies to the items beneath it.
  for (const block of content.split(/prefix: '/).slice(1)) {
    const prefix = block.slice(0, block.indexOf("'"));
    const items = block.slice(0, block.indexOf('],') + 1);
    for (const m of items.matchAll(/\{ k: '([^']+)', n: /g)) addGame(prefix, m[1]);
  }

  for (const s of standalone) all.add(s);
  return { all, byPrefix, standalone };
}
