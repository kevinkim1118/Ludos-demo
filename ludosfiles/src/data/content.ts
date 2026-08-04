/** Static editorial content for the onboarding intro and the Discover rails. */

/** Auto-scrolling cover rows on intro screen 2. */
export const MARQUEE_ROWS: { slots: string[]; duration: string }[] = [
  { slots: [1, 2, 3, 4, 5, 6].map((n) => `disc-r1-${n}`), duration: '34s' },
  { slots: [1, 2, 3, 4, 5, 6].map((n) => `disc-r2-${n}`), duration: '44s' },
  { slots: [1, 2, 3, 4, 5, 6].map((n) => `disc-r3-${n}`), duration: '38s' },
];

export type SentimentClass =
  | 'ds-sentiment-pill--really-liked'
  | 'ds-sentiment-pill--liked'
  | 'ds-sentiment-pill--didnt-like'
  | 'ds-sentiment-pill--really-disliked';

export interface Review {
  initials: string;
  slotId: string;
  name: string;
  archetype: string;
  meta: string;
  verdict: string;
  pillClass: SentimentClass;
  text: string;
}

/** Sample reviews on intro screen 4. */
export const REVIEWS: Review[] = [
  {
    initials: 'CV',
    slotId: 'cv-review-1',
    name: 'ColinVolt',
    archetype: 'The Completionist',
    meta: 'Finished · Dec 2024',
    verdict: 'Really liked it',
    pillClass: 'ds-sentiment-pill--really-liked',
    text: 'Punishing but fair. Every death teaches you something, and the open world genuinely rewards curiosity — I 100%-ed it and never felt padded.',
  },
  {
    initials: 'ZF',
    slotId: 'cv-review-2',
    name: 'ZenithForce',
    archetype: 'The Completionist',
    meta: 'Finished · Dec 2024',
    verdict: 'Really liked it',
    pillClass: 'ds-sentiment-pill--really-liked',
    text: 'Every catacomb and hidden boss adds up. 130 hours in and I still found new things. Completionist heaven.',
  },
  {
    initials: 'MA',
    slotId: 'cv-review-3',
    name: 'Marcus1994',
    archetype: 'The Explorer',
    meta: 'Finished · Nov 2024',
    verdict: 'Liked it',
    pillClass: 'ds-sentiment-pill--liked',
    text: 'Dense and rewarding, though the late game drags. Worth it for the sense of discovery alone.',
  },
];

/** Taste axes on the onboarding result screen. `pos` is the marker's offset. */
export const TASTE_AXES: { left: string; right: string; pos: string; leftHi: boolean }[] = [
  { left: 'Depth', right: 'Breadth', pos: '16%', leftHi: true },
  { left: 'Challenge', right: 'Comfort', pos: '24%', leftHi: true },
  { left: 'Story', right: 'Systems', pos: '68%', leftHi: false },
  { left: 'Solo', right: 'Social', pos: '22%', leftHi: true },
];

export interface RailItem {
  k: string;
  n: string;
  p: string;
}

/**
 * Discover rails, ordered by the trust ladder: friends first, then taste
 * match, then global popularity. `prefix` builds each item's cover slot id.
 */
export const RAILS: {
  prefix: string;
  title: string;
  sub: string;
  /** Friends rail falls back to a cold-start prompt until friends connect. */
  requiresFriends?: boolean;
  items: RailItem[];
}[] = [
  {
    prefix: 'fr',
    title: 'What your friends are playing',
    sub: 'Recently logged by people you follow',
    requiresFriends: true,
    items: [
      { k: 'hades', n: 'Hades II', p: 'PC · Switch' },
      { k: 'pizzatower', n: 'Pizza Tower', p: 'PC' },
      { k: 'citizensleeper', n: 'Citizen Sleeper', p: 'PC · Switch' },
      { k: 'tunic', n: 'Tunic', p: 'PC · PS5' },
      { k: 'cocoon', n: 'Cocoon', p: 'PC · Switch' },
      { k: 'seaofstars', n: 'Sea of Stars', p: 'PC · PS5' },
    ],
  },
  {
    prefix: 'ts',
    title: 'Matched to your taste',
    // `sub` is completed at render time with the archetype's plural.
    sub: 'really liked these',
    items: [
      { k: 'outerwilds', n: 'Outer Wilds', p: 'PC · Xbox' },
      { k: 'celeste', n: 'Celeste', p: 'PC · Switch' },
      { k: 'slaythespire', n: 'Slay the Spire 2', p: 'PC · Switch' },
      { k: 'tunic', n: 'Tunic', p: 'PC · PS5' },
      { k: 'inscryption', n: 'Inscryption', p: 'PC' },
      { k: 'tetriseffect', n: 'Tetris Effect', p: 'PC · PS5' },
    ],
  },
  {
    prefix: 'gl',
    title: 'Widely played right now',
    sub: "What's popular and trending recently",
    items: [
      { k: 'bg3', n: 'Baldur’s Gate 3', p: 'PC · PS5 · Xbox' },
      { k: 'firstlight', n: '007 First Light', p: 'PC · PS5' },
      { k: 'subnautica', n: 'Subnautica 2', p: 'PC · Xbox' },
      { k: 'forza', n: 'Forza Horizon 6', p: 'PC' },
      { k: 'pragmata', n: 'PRAGMATA', p: 'PC · Switch' },
      { k: 'sflegends', n: 'Silksong', p: 'PC · Switch' },
    ],
  },
];

/** Session-length options behind the "What to play next" time chip. */
export const TIME_OPTIONS = [
  { label: 'A quick session', desc: '30 minutes or so' },
  { label: 'A free evening', desc: 'A couple of hours' },
  { label: 'A long haul', desc: 'Settle in for the weekend' },
];

/** Reason line shown on the pick card, keyed by the selected session length. */
export const TIME_FIT = [
  { lead: 'Fits a quick session', tail: ' — pick-up-put-down' },
  { lead: 'Fits a free evening', tail: ' — a solid sitting' },
  { lead: 'Great for a long haul', tail: ' — deep progression' },
];

/** Why a game won its head-to-head. */
export const WIN_REASONS = {
  streak: { lead: 'Won 3 head-to-heads', tail: ' in a row' },
  cap: { lead: 'Came out on top', tail: ' across 5 matchups' },
  exhausted: { lead: 'Last one standing', tail: '' },
};
