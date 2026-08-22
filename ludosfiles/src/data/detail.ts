/** Static content for the Game detail screen — fixed to one game, Elden Ring. */

export const GD_NAME = 'Elden Ring';

/** Studio · year · genre, over the hero art. */
export const GD_CREDIT = 'FromSoftware · 2022 · Action RPG';

export const GD_PLATFORMS = ['PC', 'PS5', 'Xbox', 'Switch 2'];

/** The horizontally scrolling neutral pills under the hero. */
export const GD_TAGS = ['Open world', 'High challenge', 'Solo', 'Long sessions', 'Story-rich'];

export const GD_ABOUT =
  "Elden Ring is an action-RPG, open-world masterpiece that blends FromSoftware's signature " +
  'punishing combat with environmental exploration. The game replaces rigid structural guidance ' +
  'with organic discovery, rewarding players for exploring every dark corner of its vast, ruined ' +
  'world. Elden Ring stands as an evolution of the action-RPG genre that satisfies both veteran ' +
  'players and resilient newcomers alike.';

/** What the status sheet shows when it's opened from this screen. */
export const GD_SHEET_META = 'Action RPG · PC / PS5 · ~60h';

/** The four-point scale, cool to warm. `key` is what `state.gdRating` holds. */
export type Tone = 'rd' | 'dl' | 'l' | 'rl';

export type Sentiment = 'really-disliked' | 'didnt-like' | 'liked' | 'really-liked';

/** `Tone` is the compact key the review data uses; this is its pill class. */
export const SENTIMENT_OF: Record<Tone, Sentiment> = {
  rd: 'really-disliked',
  dl: 'didnt-like',
  l: 'liked',
  rl: 'really-liked',
};

/** The four buckets a `VerdictBar` splits. Raw counts, not percentages. */
export interface SentimentDistribution {
  reallyLiked: number;
  liked: number;
  didntLike: number;
  reallyDisliked: number;
}

export interface ScaleChoice {
  key: Tone;
  /** The scale's word for this lean — on the rating button and in every key. */
  label: string;
  /** On the posted review card, once it's the pick. */
  headline: string;
  /** Which bucket of a distribution this lean counts towards. */
  field: keyof SentimentDistribution;
  /** Selected background. Only `rl` reaches for the accent. */
  color: string;
  fg: string;
}

export const GD_SCALE: ScaleChoice[] = [
  { key: 'rd', label: 'Strongly Disliked', headline: 'Strongly disliked it', field: 'reallyDisliked', color: '#4A3A3E', fg: 'var(--text-primary)' },
  { key: 'dl', label: "Didn't like", headline: "Didn't like it", field: 'didntLike', color: '#6E545A', fg: 'var(--text-primary)' },
  { key: 'l', label: 'Liked', headline: 'Liked it', field: 'liked', color: '#A94E58', fg: 'var(--text-primary)' },
  { key: 'rl', label: 'Loved', headline: 'Loved it', field: 'reallyLiked', color: 'var(--accent-500)', fg: 'var(--on-accent)' },
];

/** The scale's word for one lean. One vocabulary for the buttons and the keys. */
export function toneLabel(tone: Tone): string {
  return GD_SCALE.find((c) => c.key === tone)!.label;
}

export const GD_TASTE: SentimentDistribution = {
  reallyLiked: 54,
  liked: 31,
  didntLike: 10,
  reallyDisliked: 5,
};

export const GD_GLOBAL: SentimentDistribution = {
  reallyLiked: 34,
  liked: 30,
  didntLike: 21,
  reallyDisliked: 15,
};

/** The bar's buckets warm to cool — the order `VerdictBar` lays them out in. */
const KEY_ORDER: Tone[] = ['rl', 'l', 'dl', 'rd'];

/**
 * The percentage key printed under a verdict bar, in the bar's own order. Its
 * words come from `GD_SCALE`, so the key and the rating buttons can't drift
 * into naming the same lean two different things.
 */
export function verdictKey(dist: SentimentDistribution): { pctLabel: string; color: string }[] {
  const total =
    dist.reallyLiked + dist.liked + dist.didntLike + dist.reallyDisliked || 1;
  return KEY_ORDER.map((tone) => {
    const choice = GD_SCALE.find((c) => c.key === tone)!;
    return {
      pctLabel: `${Math.round((dist[choice.field] / total) * 100)}% ${choice.label}`,
      color: `var(--sent-${SENTIMENT_OF[tone]})`,
    };
  });
}

/** Which slice of the review list is showing. */
export type GdTab = 'friends' | 'taste' | 'all';

export interface GdReview {
  initials: string;
  /** Initials-only avatars — these reviewers have no artwork. */
  avBg: string;
  avFg?: string;
  name: string;
  /** Archetype chip, without "The" — it's a taste label, not a title. */
  type: string;
  meta: string;
  sentiment: string;
  tone: Tone;
  body: string;
}

export const GD_REVIEWS: Record<GdTab, GdReview[]> = {
  friends: [
    {
      initials: 'CV',
      avBg: 'var(--surface-3)',
      name: 'ColinVolt',
      type: 'Completionist',
      meta: 'Finished · Dec 2024',
      sentiment: 'Loved',
      tone: 'rl',
      body: 'Punishing but fair. Every death teaches you something, and the open world genuinely rewards curiosity. I 100% the game and it never felt padded.',
    },
    {
      initials: 'MA',
      avBg: 'var(--border-accent)',
      name: 'Marcus1994',
      type: 'Explorer',
      meta: 'Finished · Nov 2024',
      sentiment: 'Liked',
      tone: 'l',
      body: 'Dense and rewarding, boss fights are grand and challenging. Worth it for the sense of discovery alone.',
    },
  ],
  taste: [
    {
      initials: 'IK',
      avBg: 'var(--surface-3)',
      name: 'IcebergKing',
      type: 'Completionist',
      meta: 'Finished · Jan 2025',
      sentiment: 'Loved',
      tone: 'rl',
      body: 'The optional content is where this game truly opens up. If you like leaving no stone unturned, nothing else comes close this generation.',
    },
    {
      initials: 'ZF',
      avBg: '#5A4147',
      name: 'ZenithForce',
      type: 'Completionist',
      meta: 'Finished · Dec 2024',
      sentiment: 'Loved',
      tone: 'rl',
      body: 'Every catacomb and hidden boss adds up. 130 hours in and I still found new things. Completionist heaven.',
    },
  ],
  all: [
    {
      initials: 'SL',
      avBg: 'var(--surface-3)',
      name: 'Soulless_',
      type: 'Storyteller',
      meta: 'Finished · Feb 2025',
      sentiment: 'Loved',
      tone: 'rl',
      body: 'A masterpiece of environmental storytelling. The lore rewards those willing to piece it together themselves.',
    },
    {
      initials: 'MC',
      avBg: '#5A4147',
      name: 'MorningCoffee',
      type: 'Casual',
      meta: 'Jan 2025',
      sentiment: 'Strongly Disliked',
      tone: 'rd',
      body: 'Bounced off it hard. The difficulty spikes and lack of direction were too much for my limited playtime.',
    },
  ],
};

/** Stacked avatars on the Friends verdict card. */
export const GD_FRIEND_FACES: { initials: string; bg: string; fg?: string }[] = [
  { initials: 'AJ', bg: 'var(--surface-3)' },
  { initials: 'SK', bg: '#5A4147' },
  { initials: 'MR', bg: 'var(--border-accent)', fg: '#E8DCDD' },
];

/** How long the game takes, above the storefront list. */
export const GD_LENGTHS = [
  { value: '60h', label: 'Main story' },
  { value: '130–150h', label: '100% completion' },
];

export const GD_STORES = [
  { name: 'Steam', price: '$39.99' },
  { name: 'Epic Games', price: '$39.99' },
  { name: 'PlayStation Store', price: '$59.99' },
  { name: 'Xbox / Game Pass', price: 'Included' },
];

export interface GdFriendRow {
  initials: string;
  avBg: string;
  avFg?: string;
  name: string;
  /** "Finished" reads as a filled chip; "Playing" as an outlined one. */
  badge: string;
  playing?: boolean;
  /** A finished friend leaves a quote; someone still playing leaves a count. */
  quote?: string;
  meta?: string;
  sentiment?: string;
  tone?: Tone;
}

export const GD_FRIEND_ACTIVITY: GdFriendRow[] = [
  {
    initials: 'CV',
    avBg: 'var(--surface-3)',
    name: 'ColinVolt',
    badge: 'Finished',
    quote:
      'Punishing but fair. Every death teaches you something, and the open world genuinely rewards curiosity.',
    sentiment: 'Loved',
    tone: 'rl',
  },
  {
    initials: 'MA',
    avBg: 'var(--border-accent)',
    avFg: '#E8DCDD',
    name: 'Marcus1994',
    badge: 'Finished',
    quote:
      'Dense and rewarding, though the late game drags. Worth it for the sense of discovery alone.',
    sentiment: 'Liked',
    tone: 'l',
  },
  {
    initials: 'AW',
    avBg: '#5A4147',
    name: 'AvaWinters03',
    badge: 'Playing',
    playing: true,
    meta: '65 hours in · no rating',
  },
];

/** The related-games rail at the foot of the screen — `cv-disc-<k>` covers. */
export const GD_DISCOVERY = [
  { k: 'darksouls', n: 'Dark Souls III', p: 'PC · PS4 · Xbox' },
  { k: 'hollow', n: 'Hollow Knight', p: 'PC · Switch' },
  { k: 'sekiro', n: 'Sekiro', p: 'PC · PS4 · Xbox' },
  { k: 'bg3', n: "Baldur's Gate 3", p: 'PC · PS5 · Xbox' },
];
