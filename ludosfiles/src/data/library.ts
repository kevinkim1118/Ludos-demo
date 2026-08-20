/** Static content for the Library screen — the shelf, the collections, the lists. */

/**
 * How the Library shelf labels a game. This is the prototype's own vocabulary
 * for fixed demo content and is deliberately *not* `GameStatus`: `want` is what
 * the shelf calls a backlog entry, and none of these rows are driven by
 * `state.itemStatus`.
 */
export type LibStatus = 'want' | 'playing' | 'finished' | 'dnf';

/** The chip row, plus `all`. */
export type LibSeg = LibStatus | 'all';

export interface LibGame {
  k: string;
  n: string;
  p: string;
  status: LibStatus;
  /** Backlog only — estimated length. */
  time?: string;
  /** Playing and DNF only — hours on the clock. */
  played?: string;
  /** Finished only. */
  finishedDate?: string;
}

export const LIB_GAMES: LibGame[] = [
  { k: 'hades', n: 'Hades II', p: 'PC · Switch', status: 'want', time: '~21 hours' },
  { k: 'hollow', n: 'Hollow Knight', p: 'PC · Switch', status: 'want', time: '~27 hours' },
  { k: 'outerwilds', n: 'Outer Wilds', p: 'PC · Xbox', status: 'want', time: '~15 hours' },
  { k: 'disco', n: 'Disco Elysium', p: 'PC · PS5', status: 'want', time: '~33 hours' },
  { k: 'tunic', n: 'Tunic', p: 'PC · Switch', status: 'want', time: '~12 hours' },
  { k: 'citizen', n: 'Citizen Sleeper', p: 'PC · Switch', status: 'want', time: '~9 hours' },
  { k: 'elden', n: 'Elden Ring', p: 'Steam', status: 'playing', played: '40h' },
  { k: 'bg3', n: "Baldur's Gate 3", p: 'PC', status: 'playing', played: '62h' },
  { k: 'dave', n: 'Dave the Diver', p: 'Switch', status: 'playing', played: '11h' },
  { k: 'stardew', n: 'Stardew Valley', p: 'PC · Switch · PS5', status: 'playing', played: '18h' },
  { k: 'sekiro', n: 'Sekiro', p: 'PS5', status: 'finished', finishedDate: "Aug '24" },
  { k: 'celeste', n: 'Celeste', p: 'Switch', status: 'finished', finishedDate: "Jun '24" },
  { k: 'inside', n: 'Inside', p: 'PC', status: 'finished', finishedDate: "May '24" },
  { k: 'portal2', n: 'Portal 2', p: 'PC', status: 'finished', finishedDate: "Apr '24" },
  { k: 'starfield', n: 'Starfield', p: 'Xbox', status: 'dnf', played: '9h' },
  { k: 'ac', n: "Assassin's Creed Valhalla", p: 'PS5', status: 'dnf', played: '14h' },
];

/** Chip row, in order. */
export const LIB_SEGMENTS: { key: LibSeg; label: string }[] = [
  { key: 'want', label: 'Backlog' },
  { key: 'playing', label: 'Playing' },
  { key: 'finished', label: 'Finished' },
  { key: 'dnf', label: 'DNF' },
  { key: 'all', label: 'All' },
];

/** The pill over a card's art. */
export const LIB_STATUS_LABELS: Record<LibStatus, string> = {
  want: 'Backlog',
  playing: 'Playing',
  finished: 'Finished',
  dnf: 'DNF',
};

/** The heading above the grid — longer than the chip that selected it. */
export const LIB_SEG_TITLES: Record<LibSeg, string> = {
  want: 'Backlog',
  playing: 'Playing now',
  finished: 'Finished',
  dnf: 'Did not finish',
  all: 'All games',
};

export interface LibListGame {
  k: string;
  name: string;
  platform: string;
  note: string;
}

export interface LibList {
  title: string;
  desc: string;
  ranked: boolean;
  games: LibListGame[];
}

export const LIB_LISTS: Record<string, LibList> = {
  'My favorite games': {
    title: 'Favorite Games',
    desc: 'Ranking of my favorite games',
    ranked: true,
    games: [
      { k: 'fav0', name: 'Clair Obscur: Expedition 33', platform: 'PC · Switch · PS5 • Xbox', note: "Hands down the best game i've played" },
      { k: 'fav1', name: 'Ghost of Tsushima', platform: 'PC · Switch · PS5', note: 'Satisfying combat and beautiful graphics and story' },
      { k: 'fav2', name: 'Until Then', platform: 'PC', note: 'Great art direction and story beats' },
      { k: 'fav3', name: 'Katana Zero', platform: 'PC · Switch · PS5 • Xbox', note: 'Great music to workout to and satisfying combat' },
      { k: 'fav4', name: 'NieR: Automata', platform: 'PC · PS5 • Xbox', note: 'An amazing game with a surprising amount of existential dread' },
      { k: 'fav5', name: 'Elden Ring', platform: 'PC · Switch · PS5 • Xbox', note: 'Almost had a heart attack playing this one' },
      { k: 'fav6', name: 'Rhythm Doctor', platform: 'PC', note: 'Amazing blend of 2D pixel art and complex yet fun rhythm challenges' },
      { k: 'fav7', name: 'Super Mario Galaxy 2', platform: 'Switch • Nintendo Wii', note: 'Best childhood game. I still listen to the soundtrack to this day.' },
    ],
  },
  'Cozy night-ins': {
    title: 'Cozy night-ins',
    desc: 'Games for a rainy day or a night in',
    ranked: false,
    games: [
      { k: 'stardew', name: 'Stardew Valley', platform: 'PC · Switch · PS5', note: 'Endless little chores that somehow melt three hours away.' },
      { k: 'unpacking', name: 'Unpacking', platform: 'PC · Switch · Xbox', note: 'Quiet, meditative, and secretly a whole life story.' },
      { k: 'spiritfarer', name: 'Spiritfarer', platform: 'PC · Switch · PS5', note: 'Gentle management with the most tender goodbyes.' },
      { k: 'cozygrove', name: 'Cozy Grove', platform: 'Switch · iOS', note: 'A little every day — perfect right before bed.' },
      { k: 'wildfrost', name: 'A Little to the Left', platform: 'PC · Switch', note: 'Tidying puzzles that scratch exactly the right itch.' },
      { k: 'strayss', name: 'Stray', platform: 'PC · PS5', note: 'Be a cat, knock things over, feel completely at peace.' },
    ],
  },
};

/** The list a detail panel falls back to when nothing sensible is selected. */
export const LIB_DEFAULT_LIST = 'Cozy night-ins';

export interface LibCollection {
  name: string;
  /** Key into {@link LIB_LISTS}; null for the card that only toasts. */
  list: string | null;
  /** Prefix of the `cv-coll-<key>-<n>` cover strip. */
  key: string;
  count: number;
  updated: string;
}

export const LIB_COLLECTIONS: LibCollection[] = [
  { name: 'Cozy night-ins', list: 'Cozy night-ins', key: 'cozy', count: 8, updated: '2d ago' },
  { name: 'Favorite Games', list: 'My favorite games', key: 'fav', count: 8, updated: '1w ago' },
  { name: 'Handheld / travel', list: null, key: 'hh', count: 4, updated: '3w ago' },
];

/** Cover slots for a collection card's thumbnail strip, capped at ten. */
export function libCoverStrip(key: string, count: number): string[] {
  return Array.from({ length: Math.min(count, 10) }, (_, i) => `cv-coll-${key}-${i}`);
}

/** The saved order for a list, or its authored order when nothing is saved. */
export function libOrderFor(list: LibList, saved: number[] | undefined): number[] {
  return saved && saved.length === list.games.length ? saved : list.games.map((_, i) => i);
}
