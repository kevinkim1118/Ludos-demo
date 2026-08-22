/** Static content for the Search tab — the browse rows behind an empty query. */

import { PLAYED_DB, normalize, type PlayedGame } from './games';

/**
 * The three rows shown before anything is typed. Each names games by key out
 * of `PLAYED_DB`, which is the whole search catalogue — the prototype's
 * `SEARCH_DB` was the same twenty games in a different order, so there is only
 * one list here. The one consequence is that a result grid comes back in
 * `PLAYED_DB` order rather than the prototype's; a set of search hits has no
 * meaningful order, and `PLAYED_DB`'s also orders the onboarding picker grid,
 * so it is not worth reshuffling for.
 */
export const SEARCH_SECTIONS: { title: string; keys: string[] }[] = [
  { title: 'Trending Right Now', keys: ['meccha', 'gamble'] },
  { title: 'Popular with Completionists', keys: ['elden', 'sekiro', 'zelda'] },
  { title: 'New Releases', keys: ['acbf', 'mina'] },
];

const BY_KEY: Record<string, PlayedGame> = Object.fromEntries(
  PLAYED_DB.map((game) => [game.k, game]),
);

/** The games each browse row lists, in the order the row names them. */
export const SEARCH_BROWSE: { title: string; games: PlayedGame[] }[] = SEARCH_SECTIONS.map(
  (section) => ({
    title: section.title,
    games: section.keys.map((k) => BY_KEY[k]).filter(Boolean),
  }),
);

/** Precomputed so typing doesn't re-normalize every title on every keystroke. */
const SEARCHABLE = PLAYED_DB.map((game) => ({ game, haystack: normalize(game.n) }));

/**
 * Games whose title contains the query, both sides normalized. An empty
 * normalized query — "!!!" collapses to one — matches nothing here; the screen
 * shows its browse rows instead of running a search at all.
 */
export function searchGames(query: string): PlayedGame[] {
  const q = normalize(query);
  if (!q) return [];
  return SEARCHABLE.filter((entry) => entry.haystack.includes(q)).map((entry) => entry.game);
}
