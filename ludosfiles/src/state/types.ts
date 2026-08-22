import type { GdTab, Tone } from '../data/detail';
import type { FriendsFilter } from '../data/friends';
import type { LibSeg } from '../data/library';
import type { PrListSort } from '../data/profile';
import type { Game, Intent } from '../data/games';

export type Flow =
  | 'onboarding'
  | 'home'
  | 'detail'
  | 'library'
  | 'friends'
  | 'profile'
  | 'search'
  | 'h2h';

/** The tabs the tab bar navigates between, in bar order. */
export const TAB_FLOWS = ['home', 'library', 'friends', 'search', 'profile'] as const;

/** Flows that sit behind the tab bar — back from any of them returns to Discover. */
export type TabFlow = (typeof TAB_FLOWS)[number];

/** Which pane the Library's segmented control is showing. */
export type LibView = 'library' | 'lists';

/** Which tab the Profile is showing. */
export type ProfileTab = 'reviews' | 'lists' | 'activity';

/**
 * Panels and sheets the secondary tabs own. They live here rather than inside
 * their screens because back navigation has to know what is open before it
 * decides what a back press means.
 */
export type Overlay = 'libDetail' | 'libEdit' | 'frSheet' | 'frAdd' | 'prEdit';

export type ObStep =
  | 'intro1'
  | 'intro2'
  | 'intro3'
  | 'intro4'
  | 'played'
  | 'reading'
  | 'result'
  | 'done';

export const INTRO_STEPS: ObStep[] = ['intro1', 'intro2', 'intro3', 'intro4'];

export type H2HScreen = 'intent' | 'duel' | 'outcome' | 'coldstart';

export type Side = 'champ' | 'chall';

export type WinReason = 'streak' | 'cap' | 'exhausted';

/**
 * How a game is tracked once the user acts on it. `dnf` is a game put down
 * unfinished — a different fact from either returning it to the backlog or
 * completing it.
 */
export type GameStatus = 'backlog' | 'playing' | 'finished' | 'dnf';

/** The game a status sheet was opened for. */
export interface SheetTarget {
  name: string;
  meta?: string;
  slotId?: string;
  /** Renders the sheet in status mode — updating a tracked game, not adding one. */
  statusUpdate?: boolean;
}

/** A game marked playing from a rail — carries its own cover and meta. */
export interface PlayingItem {
  name: string;
  meta: string;
  slotId: string;
}

/** Duel state captured before each pick so Undo can rewind. */
export interface Snapshot {
  champion: Game | null;
  challenger: Game | null;
  queue: Game[];
  streak: number;
  compareCount: number;
  turn: number;
}

export interface State {
  flow: Flow;

  // onboarding
  /** Sticky once the user enters Ludos — drives boot straight to Discover. */
  onboardingComplete: boolean;
  obStep: ObStep;
  played: Record<string, true>;
  playedQuery: string;
  playedFocus: boolean;

  // library
  backlog: Record<string, boolean>;
  itemStatus: Record<string, GameStatus>;

  // discover
  pickIdx: number;
  pickFading: boolean;
  pickIntro: boolean;
  time: number;
  upNext: string | null;
  playingItem: PlayingItem | null;
  spotDismissed: boolean;
  spotDismissing: boolean;

  // game detail
  /** Which slice of the review list is showing. */
  gdTab: GdTab;
  /** The rating picked in the review prompt, before it's posted. */
  gdRating: Tone | null;
  gdReviewText: string;
  /** Whether the picked rating has been posted as the user's own review. */
  gdPosted: boolean;

  // library tab
  libView: LibView;
  /** Which chip the shelf is filtered to. */
  libSeg: LibSeg;
  /** Key into `LIB_LISTS` for whatever the detail panel is showing. */
  libList: string | null;

  /**
   * Sliding panels come in pairs: `…Open` is whether the panel is mounted,
   * `…In` is whether it has slid into place. Mounting it out of frame and
   * moving it a tick later is what makes the transition run at all — and back
   * navigation treats a panel on its way out as already gone.
   */
  libDetailOpen: boolean;
  libDetailIn: boolean;
  libEditOpen: boolean;
  libEditIn: boolean;

  // list editor — drafts, discarded unless Save commits them
  libEditTitleDraft: string;
  libEditDescDraft: string;
  libEditOrderedDraft: boolean;
  libEditProfileDraft: boolean;
  libEditOrderDraft: number[];
  libEditDragFrom: number | null;

  // committed per-list edits, keyed by list name
  libOverrides: Record<string, { title: string; desc: string }>;
  libOrder: Record<string, number[]>;
  libOrdered: Record<string, boolean>;
  libProfileShown: Record<string, boolean>;

  // friends
  frFilter: FriendsFilter;
  frSheet: boolean;
  /** True while the friends sheet plays its exit animation. */
  frSheetClosing: boolean;
  /** The add-friends panel is the same Open/In pair as the library's. */
  frAddOpen: boolean;
  frAddIn: boolean;
  frAddQuery: string;
  /** Directory keys whose Add button has flipped to "Requested". */
  frAdded: Record<string, boolean>;

  // profile
  prTab: ProfileTab;
  /** The edit sheet is the same Open/In pair as the library's panels. */
  prEditOpen: boolean;
  prEditIn: boolean;
  prUsername: string;
  prBio: string;
  /** Edit-sheet drafts — discarded unless Save commits them. */
  prUsernameDraft: string;
  prBioDraft: string;

  // profile → lists tab
  prListSearch: string;
  prListSort: PrListSort;
  /** Whether the sort popover under the search row is showing. */
  prListFilterOpen: boolean;

  // search
  /**
   * The raw query, exactly as typed. Session UI state — deliberately not
   * serialized, and reset by the `?screen=search` deep link.
   */
  srQuery: string;
  /** Whether the input has focus, which is what turns its underline accent. */
  srFocused: boolean;

  // overlays
  sheet: SheetTarget | null;
  sheetClosing: boolean;
  timeSheet: boolean;
  timeClosing: boolean;
  toast: string | null;
  toastKey: number;

  // head-to-head
  intent: Intent;
  h2hScreen: H2HScreen;
  champion: Game | null;
  challenger: Game | null;
  queue: Game[];
  streak: number;
  compareCount: number;
  turn: number;
  history: Snapshot[];
  picking: Side | null;
  winner: Game | null;
  winReason: WinReason;
}
