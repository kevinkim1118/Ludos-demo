/** Static content for the Friends screen — the activity feed and the people in it. */

import type { Sentiment } from './detail';

/** Which dated rule a feed row files under. */
export type FrGroup = 'today' | 'week';

/** What a friend did. The filter chips slice the feed by these. */
export type FrActivity = 'finish' | 'review' | 'rating' | 'playing' | 'list';

/**
 * Which slice of the feed is showing. Lives here rather than in `State` for
 * the same reason `LibSeg` does — the chips and the feed are both content.
 */
export type FriendsFilter = 'all' | 'finishes' | 'ratings' | 'playing';

export interface FrFeedItem {
  g: FrGroup;
  /** Cover slot suffix — the row's art is `ff-<key>`. */
  key: string;
  /** The friend's display name. */
  who: string;
  /** Reads between the name and the target: "DuskRunner *just finished* …". */
  verb: string;
  type: FrActivity;
  target: string;
  time: string;
  /** `list` rows only — the list the game was added to. */
  listName?: string;
  /** A now-playing line under the time, behind an accent dot. */
  meta?: string;
  /** Quoted in Newsreader behind a left rule. */
  snippet?: string;
  /** Only the two warm leans appear in the feed. */
  sentiment?: 'rl' | 'l';
}

export const FR_FEED: FrFeedItem[] = [
  { g: 'today', key: 'alex', who: 'DuskRunner', verb: 'just finished', type: 'finish', target: 'Elden Ring', time: '2 hours ago', snippet: 'Absolutely worth the grind — every death taught me something.', sentiment: 'rl' },
  { g: 'today', key: 'dana', who: 'PaleOrbit', verb: 'rated', type: 'rating', target: 'Outer Wilds', time: '3 hours ago', sentiment: 'rl' },
  { g: 'today', key: 'maya', who: 'GlassCannon', verb: 'left a review for', type: 'review', target: 'Hades', time: '5 hours ago', snippet: 'Tight runs and a killer soundtrack. Ran out of steam before the true ending, but no regrets.', sentiment: 'l' },
  { g: 'today', key: 'chris', who: 'NoScope99', verb: 'started playing', type: 'playing', target: 'Baldur’s Gate 3', time: '6 hours ago', meta: 'Now playing on PC · 4.2h' },
  { g: 'week', key: 'sam', who: 'QuietVoid', verb: 'just finished', type: 'finish', target: 'Hollow Knight', time: 'Yesterday', snippet: 'One of the best metroidvanias, full stop. The map design alone is worth it.', sentiment: 'rl' },
  { g: 'week', key: 'jordan', who: 'MapPin', verb: 'added', type: 'list', target: 'Citizen Sleeper', listName: 'Cozy night-ins', time: '2 days ago' },
  { g: 'week', key: 'priya', who: 'NeonViper', verb: 'rated', type: 'rating', target: 'Balatro', time: '3 days ago', sentiment: 'l' },
];

/** The date rules the feed groups under, in order. */
export const FR_GROUPS: { key: FrGroup; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This week' },
];

/** The filter chip row, in order. */
export const FR_CHIPS: { key: FriendsFilter; label: string }[] = [
  { key: 'all', label: 'All activity' },
  { key: 'finishes', label: 'Finishes & reviews' },
  { key: 'ratings', label: 'Ratings' },
  { key: 'playing', label: 'Playing' },
];

/** Whether a filter admits an activity. "Finishes" covers reviews too. */
export function frMatches(filter: FriendsFilter, type: FrActivity): boolean {
  if (filter === 'all') return true;
  if (filter === 'finishes') return type === 'finish' || type === 'review';
  if (filter === 'ratings') return type === 'rating';
  return type === 'playing';
}

/**
 * The feed's own wording for a lean. Shorter than `SentimentPill`'s default
 * labels — a feed row already says who and what, so the pill only carries how.
 */
export const FR_SENTIMENTS: Record<'rl' | 'l', { sentiment: Sentiment; label: string }> = {
  rl: { sentiment: 'really-liked', label: 'Loved it' },
  l: { sentiment: 'liked', label: 'Liked it' },
};

export interface FrPerson {
  name: string;
  initials: string;
  /** Avatar tint — each person keeps the same one everywhere. */
  bg: string;
}

export interface FrFriend extends FrPerson {
  status: string;
  online: boolean;
}

export const FR_FRIENDS: FrFriend[] = [
  { name: 'DuskRunner', initials: 'DR', bg: '#5A4147', status: 'Playing Elden Ring', online: true },
  { name: 'QuietVoid', initials: 'QV', bg: '#5E4A44', status: 'Playing Hollow Knight', online: true },
  { name: 'GlassCannon', initials: 'GC', bg: '#63474C', status: 'Online', online: true },
  { name: 'PaleOrbit', initials: 'PO', bg: '#4A3A40', status: 'Online', online: true },
  { name: 'NoScope99', initials: 'NS', bg: '#514049', status: 'Playing Baldur’s Gate 3', online: true },
  { name: 'MapPin', initials: 'MP', bg: '#4A3A40', status: 'Last seen 2h ago', online: false },
  { name: 'NeonViper', initials: 'NV', bg: '#5A4147', status: 'Last seen 1d ago', online: false },
  { name: 'SlowClap', initials: 'SC', bg: '#63474C', status: 'Last seen 3d ago', online: false },
];

export interface FrCandidate extends FrPerson {
  /** Keys the per-row Add → Requested flip. */
  key: string;
  mutual: string;
}

/** Who the add-friends search looks through. */
export const FR_DIRECTORY: FrCandidate[] = [
  { key: 'nova', name: 'NovaWisp', initials: 'NW', bg: '#5A4147', mutual: '2 mutual friends' },
  { key: 'ember', name: 'EmberFox', initials: 'EF', bg: '#4A3A40', mutual: '5 mutual friends' },
  { key: 'ghost', name: 'GhostLantern', initials: 'GL', bg: '#63474C', mutual: '1 mutual friend' },
  { key: 'pixel', name: 'PixelMoth', initials: 'PM', bg: '#514049', mutual: 'No mutual friends' },
  { key: 'wren', name: 'WrenTactics', initials: 'WT', bg: '#5E4A44', mutual: '3 mutual friends' },
];

/** Copied to the clipboard by the invite row. */
export const FR_INVITE_LINK = 'ludos.app/invite/alexr-8f2k';
