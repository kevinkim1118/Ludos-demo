/**
 * Values that were "Tweaks" panel props in the design prototype. Defaults here
 * match the state the prototype was last saved in.
 */
export const CONFIG = {
  playerName: 'Kevin',
  archetype: 'The Completionist',
  /** Share of players with the same archetype, shown on the result screen. */
  rarityPct: '12%',
  /**
   * Friends rail shows its cold-start prompt until this is true. Deliberately
   * `true` rather than the prototype's `false`: the demo is more useful in the
   * connected state, and it's the only route from Discover into Game detail.
   * Delta 001's "do not change" list says otherwise — this overrides it.
   * `?friends=0` still reaches the cold-start state.
   */
  friendsConnected: true,
  /** The "Recommended for you" spotlight above the pick card. */
  showRecommendedCard: false,
} as const;

/**
 * `?friends` and `?friends=0` force the friend-gated UI on or off — the
 * Discover friends rail, the Verdict card's Friends source, Game detail's
 * friend activity. Companion to `?hint` and `?update`: without it, looking at
 * either state means editing the config above and rebuilding.
 *
 * Now that the default is connected, `?friends=0` is the one that earns its
 * keep — it is the only way to reach the cold-start rail and, once Friends
 * lands, its "Quiet feed?" connect card.
 */
const FRIENDS_PARAM = new URLSearchParams(window.location.search).get('friends');

/**
 * Whether friend-sourced UI renders. Read this rather than
 * `CONFIG.friendsConnected` directly, so the dev flag reaches every gate.
 */
export const friendsConnected =
  FRIENDS_PARAM === null ? CONFIG.friendsConnected : FRIENDS_PARAM !== '0';

/** "The Completionist" → "Completionists" */
export function archetypePlural(archetype: string): string {
  const bare = archetype.replace(/^The\s+/i, '');
  return bare.endsWith('s') ? bare : `${bare}s`;
}
