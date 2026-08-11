export type Intent = 'fast' | 'big' | 'story' | 'chill';

export interface Game {
  k: string;
  name: string;
  genre: string;
  hrs: string;
  plat: string;
  intents: Intent[];
}

export const GAMES: Record<string, Game> = {
  hades:   { k: 'hades',   name: 'Hades II',        genre: 'Roguelike',    hrs: '~21h', plat: 'PC / Switch',     intents: ['fast', 'big'] },
  outer:   { k: 'outer',   name: 'Outer Wilds',     genre: 'Mystery',      hrs: '~15h', plat: 'PC / Xbox',       intents: ['story', 'fast'] },
  hollow:  { k: 'hollow',  name: 'Hollow Knight',   genre: 'Metroidvania', hrs: '~27h', plat: 'PC / Switch',     intents: ['big', 'story'] },
  tunic:   { k: 'tunic',   name: 'Tunic',           genre: 'Adventure',    hrs: '~12h', plat: 'PC / PS5',        intents: ['fast', 'story'] },
  celeste: { k: 'celeste', name: 'Celeste',         genre: 'Platformer',   hrs: '~8h',  plat: 'PC / Switch',     intents: ['fast', 'chill'] },
  citizen: { k: 'citizen', name: 'Citizen Sleeper', genre: 'RPG',          hrs: '~9h',  plat: 'PC / Switch',     intents: ['story', 'chill'] },
  sts:     { k: 'sts',     name: 'Slay the Spire',  genre: 'Deckbuilder',  hrs: '~24h', plat: 'PC / Switch',     intents: ['fast', 'big'] },
  disco:   { k: 'disco',   name: 'Disco Elysium',   genre: 'RPG',          hrs: '~33h', plat: 'PC / PS5',        intents: ['big', 'story'] },
  stray:   { k: 'stray',   name: 'Stray',           genre: 'Adventure',    hrs: '~7h',  plat: 'PC / PS5',        intents: ['chill', 'story'] },
  bg3:     { k: 'bg3',     name: "Baldur's Gate 3", genre: 'CRPG',         hrs: '~90h', plat: 'PC / PS5',        intents: ['big'] },
  totk:    { k: 'totk',    name: 'The Legend of Zelda: Tears of the Kingdom', genre: 'Action-Adventure', hrs: '~50h', plat: 'Switch', intents: ['big', 'story'] },
  ds3:     { k: 'ds3',     name: 'Dark Souls III',  genre: 'Action RPG',   hrs: '~45h', plat: 'PC / PS5 / Xbox', intents: ['big', 'fast'] },
};

/** Games pre-seeded into the backlog on the onboarding result screen. */
export const SEED = ['hollow', 'outer', 'tunic', 'celeste', 'totk', 'ds3'] as const;

export const INTENT_LABELS: Record<Intent, string> = {
  fast: 'Fast & fun',
  big: 'Long haul',
  story: 'Story',
  chill: 'Chill',
};

export const INTENT_OPTIONS: { key: Intent; title: string; sub: string }[] = [
  { key: 'fast', title: 'Something fast & fun', sub: 'Short, one-off gaming session' },
  { key: 'big', title: 'Chip away at a larger game', sub: 'I want to commit to something big' },
  { key: 'story', title: 'Something narrative-driven', sub: 'I want to get lost in a story' },
  { key: 'chill', title: 'Something chill', sub: 'Flexible and cozy' },
];

/** Searchable catalogue behind the "What games have you played?" step. */
export interface PlayedGame {
  k: string;
  n: string;
  p: string;
}

export const PLAYED_DB: PlayedGame[] = [
  { k: 'gamble', n: 'Gamble With Your Friends', p: 'PC' },
  { k: 'sekiro', n: 'Sekiro: Shadows Die Twice', p: 'PC · PS5' },
  { k: 'zelda', n: 'Legend of Zelda: Tears of the Kingdom', p: 'Switch' },
  { k: 'acbf', n: "Assassin's Creed Black Flag: Resynched", p: 'PC · PS5 · Xbox' },
  { k: 'hades2', n: 'Hades II', p: 'PC · Switch' },
  { k: 'outerwilds', n: 'Outer Wilds', p: 'PC · Xbox' },
  { k: 'celeste', n: 'Celeste', p: 'PC · Switch' },
  { k: 'meccha', n: 'Meccha Chameleon', p: 'PC · PS5 · Xbox' },
  { k: 'bg3', n: "Baldur's Gate 3", p: 'PC · PS5' },
  { k: 'elden', n: 'Elden Ring', p: 'PC · PS5 · Xbox' },
  { k: 'hollow', n: 'Hollow Knight', p: 'PC · Switch' },
  { k: 'mina', n: 'Mina the Hollower', p: 'PC · Switch · PS5' },
  { k: 'tunic', n: 'Tunic', p: 'PC · PS5' },
  { k: 'disco', n: 'Disco Elysium', p: 'PC · PS5' },
  { k: 'citizen', n: 'Citizen Sleeper', p: 'PC · Switch' },
  { k: 'stray', n: 'Stray', p: 'PC · PS5' },
  { k: 'firstlight', n: '007 First Light', p: 'PC · PS5' },
  { k: 'subnautica', n: 'Subnautica 2', p: 'PC · Xbox' },
  { k: 'forza', n: 'Forza Horizon 6', p: 'PC · Xbox' },
  { k: 'pragmata', n: 'PRAGMATA', p: 'PC · PS5' },
];

/**
 * Hand-authored cards shown after the searchable catalogue. Each owns a
 * `cv-played-blank-*` cover slot rather than a `cv-search-*` one, which is the
 * only reason they're a separate list — `PlayedGames` searches these and
 * `PLAYED_DB` as one set.
 */
export const PLAYED_BLANKS: { id: string; slotId: string; name: string }[] = [
  { id: 'blank1', slotId: 'cv-played-blank-1', name: 'Balatro' },
  { id: 'blank2', slotId: 'cv-played-blank-2', name: 'Super Mario Galaxy 2' },
  { id: 'blank3', slotId: 'cv-played-blank-3', name: 'Katana Zero' },
  { id: 'blank4', slotId: 'cv-played-blank-4', name: 'Clair Obscur: Expedition 33' },
  { id: 'blank5', slotId: 'cv-played-blank-5', name: 'Lies of P' },
  { id: 'blank6', slotId: 'cv-played-blank-6', name: 'Dead Cells' },
  { id: 'blank7', slotId: 'cv-played-blank-7', name: 'NiER Automata' },
  { id: 'blank8', slotId: 'cv-played-blank-8', name: 'Sea of Stars' },
  { id: 'blank9', slotId: 'cv-played-blank-9', name: 'Until Then' },
  { id: 'blank10', slotId: 'cv-played-blank-10', name: "Assassin's Creed: Odyssey" },
];

/** Minimum played-games selections before onboarding can continue. */
export const PLAYED_MINIMUM = 10;
