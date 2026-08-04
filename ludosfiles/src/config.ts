/**
 * Values that were "Tweaks" panel props in the design prototype. Defaults here
 * match the state the prototype was last saved in.
 */
export const CONFIG = {
  playerName: 'Kevin',
  archetype: 'The Completionist',
  /** Share of players with the same archetype, shown on the result screen. */
  rarityPct: '12%',
  /** Friends rail shows its cold-start prompt until this is true. */
  friendsConnected: false,
  /** The "Recommended for you" spotlight above the pick card. */
  showRecommendedCard: false,
} as const;

/** "The Completionist" → "Completionists" */
export function archetypePlural(archetype: string): string {
  const bare = archetype.replace(/^The\s+/i, '');
  return bare.endsWith('s') ? bare : `${bare}s`;
}
