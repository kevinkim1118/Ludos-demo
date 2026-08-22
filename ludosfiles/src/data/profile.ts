/** Static content for the Profile screen — your reviews, your history, your lists. */

import type { Sentiment } from './detail';

/**
 * The profile's own sentiment vocabulary — a third one, alongside `Tone` and
 * the friends feed's. `d` is plain didn't-like, and there is no
 * really-disliked here at all, so this is deliberately not a `Tone`.
 */
export type PrLean = 'rl' | 'l' | 'd';

/**
 * How the profile words a lean. Shorter than both `SentimentPill`'s defaults
 * and the friends feed's — a row on your own profile has already said what
 * you did, so the pill only carries how it went.
 */
export const PR_SENTIMENTS: Record<PrLean, { sentiment: Sentiment; label: string }> = {
  rl: { sentiment: 'really-liked', label: 'Loved' },
  l: { sentiment: 'liked', label: 'Liked' },
  d: { sentiment: 'didnt-like', label: 'Disliked' },
};

/** The four hardcoded cells of the stat card, in order. */
export const PR_STATS: { value: string; label: string }[] = [
  { value: '3', label: 'Playing' },
  { value: '42', label: 'Finished' },
  { value: '16', label: 'Backlogged' },
  { value: '2', label: 'DNF' },
];

export interface PrReview {
  /** Cover slot suffix — the row's art is `cv-rev-<k>`. */
  k: string;
  title: string;
  date: string;
  sent: PrLean;
  quote: string;
}

export const PR_REVIEWS: PrReview[] = [
  { k: 'persona3', title: 'Persona 3 Reload', date: 'Finished Jun 2026', sent: 'rl', quote: '“Every action I did felt meaningful and mundane activities were impactful. Great characters, voice acting, great story.”' },
  { k: 'elden', title: 'Elden Ring', date: 'Finished Mar 2026', sent: 'rl', quote: '“Rich story and endless exploration really satisfied me and raised the bar for open world RPGs going forward.”' },
  { k: 'acodyssey', title: 'Assassin’s Creed: Odyssey', date: 'Finished Nov 2025', sent: 'd', quote: '“Love the AC franchise but this one strays from the original formula and feels more like a Greece simulator than an AC.”' },
];

export interface PrActivityItem {
  /** Cover slot suffix — the row's art is `cv-act-<k>`. */
  k: string;
  /** Opens the sentence: "*Finished* Persona 3 Reload". */
  verb: string;
  game: string;
  /** Reads as "to {target}" — the list the game was added to. */
  target?: string;
  date: string;
  sent?: PrLean;
  quote?: string;
}

export const PR_ACTIVITY: PrActivityItem[] = [
  { k: 'a-persona3', verb: 'Finished', game: 'Persona 3 Reload', date: 'June 2026', sent: 'rl', quote: '“Every action I did felt meaningful and mundane activities were impactful. Great characters, voice acting, great story.”' },
  { k: 'a-elden', verb: 'Finished', game: 'Elden Ring', date: 'March 13, 2026', sent: 'l', quote: '“Rich story and endless exploration really satisfied me and raised the bar for open world RPGs going forward.”' },
  { k: 'a-persona4', verb: 'Started', game: 'Persona 4 Golden', date: 'June 30, 2026' },
  { k: 'a-nier', verb: 'Added', game: 'NiER: Automata', target: 'Action RPGs', date: 'June 24, 2026' },
  { k: 'a-hades', verb: 'Reviewed', game: 'Hades II', date: 'June 12, 2026', sent: 'rl', quote: '“Endless replayability and the writing keeps every run feeling fresh.”' },
];

/** Which order the Lists tab's sort popover puts the cards in. */
export type PrListSort = 'recent' | 'name' | 'games';

export const PR_SORTS: { key: PrListSort; label: string }[] = [
  { key: 'recent', label: 'Recently updated' },
  { key: 'name', label: 'Name (A–Z)' },
  { key: 'games', label: 'Most games' },
];

export interface PrList {
  /** Prefix of the shared `cv-coll-<key>-<n>` cover strip. */
  k: string;
  name: string;
  count: number;
  updated: string;
  /** Sort key behind "Recently updated" — smaller is more recent. */
  days: number;
  /** Key into `LIB_LISTS`; null for the card that only toasts. */
  libKey: string | null;
}

/**
 * The profile's own copy of the lists, not a view of `LIB_COLLECTIONS`. The
 * two disagree on purpose — different names ("Cozy nights in" vs "Cozy
 * night-ins") and different relative times for the same list — so `libKey` is
 * what ties a card back to the Library list it opens.
 */
export const PR_LISTS: PrList[] = [
  { k: 'cozy', name: 'Cozy nights in', count: 8, updated: '2 days ago', days: 2, libKey: 'Cozy night-ins' },
  { k: 'fav', name: 'Favorite Games', count: 8, updated: '5 days ago', days: 5, libKey: 'My favorite games' },
  { k: 'hh', name: 'Handheld / Travel', count: 4, updated: '1 month ago', days: 30, libKey: null },
];

/** The lists matching a search, in the chosen order. */
export function prSortedLists(query: string, sort: PrListSort): PrList[] {
  const q = query.trim().toLowerCase();
  const lists = PR_LISTS.filter((l) => !q || l.name.toLowerCase().includes(q));
  if (sort === 'name') return lists.slice().sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'games') return lists.slice().sort((a, b) => b.count - a.count);
  return lists.slice().sort((a, b) => a.days - b.days);
}

/** The three pill tabs, in order. */
export const PR_TABS: { key: 'reviews' | 'lists' | 'activity'; label: string }[] = [
  { key: 'reviews', label: 'Reviews' },
  { key: 'lists', label: 'Lists' },
  { key: 'activity', label: 'Activity' },
];

export const PR_DEFAULT_USERNAME = 'ColinVolt';

/**
 * Up to two initials from a username. The avatar slot has no artwork until one
 * is dropped in, and initials read as a person where an empty circle reads as
 * a bug — the same treatment `cv-review-*` uses.
 */
export function prInitials(name: string): string {
  const caps = name.match(/[A-Z]/g) ?? [];
  if (caps.length >= 2) return caps.slice(0, 2).join('');
  return name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();
}

/** The quote marks are part of the bio, not decoration around it. */
export const PR_DEFAULT_BIO =
  '"Currently obsessed with action RPGs. Looking for more JRPGs to play!"';
