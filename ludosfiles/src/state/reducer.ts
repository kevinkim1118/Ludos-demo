import type { GdTab, Tone } from '../data/detail';
import type { FriendsFilter } from '../data/friends';
import { GAMES, type Game, type Intent } from '../data/games';
import {
  LIB_DEFAULT_LIST,
  LIB_LISTS,
  libOrderFor,
  type LibList,
  type LibSeg,
} from '../data/library';
import {
  PR_DEFAULT_BIO,
  PR_DEFAULT_USERNAME,
  type PrListSort,
} from '../data/profile';
import {
  INTRO_STEPS,
  type Flow,
  type GameStatus,
  type H2HScreen,
  type ObStep,
  type Overlay,
  type PlayingItem,
  type ProfileTab,
  type SheetTarget,
  type Side,
  type Snapshot,
  type State,
  type WinReason,
} from './types';

/** The `State` flag each dismissible tab overlay is held open by. */
const OVERLAY_FLAG: Record<Overlay, keyof State> = {
  libDetail: 'libDetailOpen',
  libEdit: 'libEditOpen',
  frSheet: 'frSheet',
  frAdd: 'frAddOpen',
  prEdit: 'prEditOpen',
};

export const initialState: State = {
  flow: 'onboarding',

  onboardingComplete: false,
  obStep: 'intro1',
  played: {},
  playedQuery: '',
  playedFocus: false,

  backlog: { hollow: true, outer: true, tunic: true, celeste: true, totk: true, ds3: true },
  itemStatus: {},

  pickIdx: 0,
  pickFading: false,
  pickIntro: false,
  time: 1,
  upNext: null,
  playingItem: null,
  spotDismissed: false,
  spotDismissing: false,

  gdTab: 'friends',
  gdRating: null,
  gdReviewText: '',
  gdPosted: false,

  libView: 'library',
  libSeg: 'want',
  libList: null,

  libDetailOpen: false,
  libDetailIn: false,
  libEditOpen: false,
  libEditIn: false,

  libEditTitleDraft: '',
  libEditDescDraft: '',
  libEditOrderedDraft: true,
  libEditProfileDraft: true,
  libEditOrderDraft: [],
  libEditDragFrom: null,

  libOverrides: {},
  libOrder: {},
  libOrdered: {},
  libProfileShown: {},

  frFilter: 'all',
  frSheet: false,
  frSheetClosing: false,
  frAddOpen: false,
  frAddIn: false,
  frAddQuery: '',
  frAdded: {},

  prTab: 'reviews',
  prEditOpen: false,
  prEditIn: false,
  prUsername: PR_DEFAULT_USERNAME,
  prBio: PR_DEFAULT_BIO,
  prUsernameDraft: PR_DEFAULT_USERNAME,
  prBioDraft: PR_DEFAULT_BIO,

  prListSearch: '',
  prListSort: 'recent',
  prListFilterOpen: false,

  srQuery: '',
  srFocused: false,

  sheet: null,
  sheetClosing: false,
  timeSheet: false,
  timeClosing: false,
  toast: null,
  toastKey: 0,

  intent: 'fast',
  h2hScreen: 'intent',
  champion: null,
  challenger: null,
  queue: [],
  streak: 0,
  compareCount: 0,
  turn: 0,
  history: [],
  picking: null,
  winner: null,
  winReason: 'streak',
};

/** Games currently in the backlog, in the order they were added. */
export function backlogGames(state: State): Game[] {
  return Object.keys(state.backlog)
    .filter((k) => state.backlog[k])
    .map((k) => GAMES[k])
    .filter(Boolean);
}

/** The backlog game the "What to play next" card is currently offering. */
export function currentPick(state: State): Game | null {
  const arr = backlogGames(state);
  if (!arr.length) return null;
  return arr[state.pickIdx % arr.length];
}

/** Backlog games that fit a given mood. */
export function poolFor(state: State, intent: Intent): Game[] {
  return backlogGames(state).filter((g) => g.intents.includes(intent));
}

/** The name of whatever the pick card is currently showing. */
export function activePickName(state: State): string {
  if (state.playingItem) return state.playingItem.name;
  if (state.upNext) return GAMES[state.upNext]?.name ?? 'Game';
  return 'Game';
}

/**
 * What the pick card is showing, in the shape the status sheet wants. A
 * head-to-head winner (`upNext`) outranks a game marked playing by hand.
 */
export function activePickTarget(state: State): { name: string; meta: string; slotId: string } {
  if (state.playingItem) {
    const { name, meta, slotId } = state.playingItem;
    return { name, meta, slotId: slotId || 'cv-pick-x' };
  }
  const pick = (state.upNext ? GAMES[state.upNext] : null) ?? currentPick(state) ?? GAMES.hades;
  return {
    name: pick.name,
    meta: `${pick.genre} · ${pick.plat} · ${pick.hrs}`,
    slotId: `cv-pick-${pick.k}`,
  };
}

/** The list the detail panel and the editor are working on. */
export function activeList(state: State): { name: string; list: LibList } {
  const name = state.libList && LIB_LISTS[state.libList] ? state.libList : LIB_DEFAULT_LIST;
  return { name, list: LIB_LISTS[name] };
}

/** A list's title and description, with any saved edit applied. */
export function listCopy(state: State, name: string, list: LibList) {
  const override = state.libOverrides[name];
  return {
    title: override?.title ?? list.title,
    desc: override?.desc ?? list.desc,
  };
}

/** Whether a list shows position numbers, with any saved edit applied. */
export function listIsRanked(state: State, name: string, list: LibList): boolean {
  return state.libOrdered[name] ?? list.ranked;
}

function snapshot(state: State): Snapshot {
  return {
    champion: state.champion,
    challenger: state.challenger,
    queue: state.queue,
    streak: state.streak,
    compareCount: state.compareCount,
    turn: state.turn,
  };
}

function finishDuel(
  state: State,
  champion: Game | null,
  reason: WinReason,
  snap: Snapshot,
  compareCount: number,
): State {
  return {
    ...state,
    h2hScreen: 'outcome',
    winner: champion,
    winReason: reason,
    compareCount,
    picking: null,
    history: [...state.history, snap],
  };
}

function startDuelState(state: State, intent: Intent): State {
  const pool = poolFor(state, intent);
  if (pool.length < 2) return { ...state, h2hScreen: 'coldstart', intent };
  return {
    ...state,
    h2hScreen: 'duel',
    intent,
    champion: pool[0],
    challenger: pool[1],
    queue: pool.slice(2),
    streak: 0,
    compareCount: 0,
    turn: 0,
    history: [],
    picking: null,
  };
}

export type Action =
  | { type: 'toast/show'; msg: string }
  | { type: 'toast/hide' }
  | { type: 'ob/step'; step: ObStep }
  | { type: 'ob/introNext' }
  | { type: 'ob/introBack' }
  | { type: 'ob/retake' }
  | { type: 'played/toggle'; id: string }
  | { type: 'played/query'; value: string }
  | { type: 'played/focus'; value: boolean }
  | { type: 'seed/toggle'; k: string }
  | { type: 'flow/enterHome' }
  | { type: 'flow/go'; flow: Flow }
  | { type: 'flow/goCompare' }
  | { type: 'pick/fadeStart' }
  | { type: 'pick/advance' }
  | { type: 'pick/startPlaying' }
  | { type: 'pick/clearStatus'; status: GameStatus; name: string }
  | { type: 'pickIntro/set'; value: boolean }
  | { type: 'overlay/close'; overlay: Overlay }
  | { type: 'lib/view'; view: State['libView'] }
  | { type: 'lib/seg'; seg: LibSeg }
  | { type: 'lib/openDetail'; name: string }
  | { type: 'lib/detailIn' }
  | { type: 'lib/closingDetail' }
  | { type: 'lib/closedDetail' }
  | { type: 'lib/openEdit' }
  | { type: 'lib/editIn' }
  | { type: 'lib/editTitle'; value: string }
  | { type: 'lib/editDesc'; value: string }
  | { type: 'lib/toggleOrdered' }
  | { type: 'lib/toggleProfile' }
  | { type: 'lib/dragStart'; index: number }
  | { type: 'lib/dragOver'; index: number }
  | { type: 'lib/dragEnd' }
  | { type: 'lib/saveEdit' }
  | { type: 'lib/closingEdit' }
  | { type: 'lib/closedEdit' }
  | { type: 'fr/filter'; filter: FriendsFilter }
  | { type: 'fr/openSheet' }
  | { type: 'fr/closingSheet' }
  | { type: 'fr/closedSheet' }
  | { type: 'fr/openAdd' }
  | { type: 'fr/addIn' }
  | { type: 'fr/closingAdd' }
  | { type: 'fr/closedAdd' }
  | { type: 'fr/addQuery'; value: string }
  | { type: 'fr/request'; key: string }
  | { type: 'pr/tab'; tab: ProfileTab }
  | { type: 'pr/openEdit' }
  | { type: 'pr/editIn' }
  | { type: 'pr/saveEdit' }
  | { type: 'pr/closingEdit' }
  | { type: 'pr/closedEdit' }
  | { type: 'pr/usernameDraft'; value: string }
  | { type: 'pr/bioDraft'; value: string }
  | { type: 'pr/listSearch'; value: string }
  | { type: 'pr/listSort'; sort: PrListSort }
  | { type: 'pr/toggleListFilter' }
  | { type: 'sr/query'; value: string }
  | { type: 'sr/focus'; value: boolean }
  | { type: 'time/open' }
  | { type: 'time/closing' }
  | { type: 'time/closed' }
  | { type: 'time/pick'; index: number }
  | { type: 'sheet/open'; target: SheetTarget }
  | { type: 'sheet/closing' }
  | { type: 'sheet/closed' }
  | { type: 'sheet/markPlaying'; item: PlayingItem }
  | { type: 'sheet/setStatus'; name: string; status: GameStatus }
  | { type: 'gd/tab'; tab: GdTab }
  | { type: 'gd/rating'; rating: Tone }
  | { type: 'gd/reviewText'; value: string }
  | { type: 'gd/post' }
  | { type: 'gd/editReview' }
  | { type: 'spot/dismissing' }
  | { type: 'spot/dismissed' }
  | { type: 'h2h/setIntent'; intent: Intent }
  | { type: 'h2h/screen'; screen: H2HScreen }
  | { type: 'h2h/startDuel'; intent: Intent }
  | { type: 'h2h/picking'; side: Side }
  | { type: 'h2h/resolve'; side: Side }
  | { type: 'h2h/undo' }
  | { type: 'h2h/skip' }
  | { type: 'h2h/keepComparing' }
  | { type: 'h2h/commitPlaying' }
  | { type: 'h2h/back' }
  | { type: 'jump'; patch: Partial<State> };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'toast/show':
      return { ...state, toast: action.msg, toastKey: state.toastKey + 1 };

    case 'toast/hide':
      return { ...state, toast: null };

    // ── onboarding ────────────────────────────────────────────
    case 'ob/step':
      return { ...state, obStep: action.step };

    case 'ob/introNext': {
      const i = INTRO_STEPS.indexOf(state.obStep);
      // Past the last intro screen, the quiz picker takes over.
      if (i < 0 || i >= INTRO_STEPS.length - 1) return { ...state, obStep: 'played' };
      return { ...state, obStep: INTRO_STEPS[i + 1] };
    }

    case 'ob/introBack': {
      const i = INTRO_STEPS.indexOf(state.obStep);
      return i > 0 ? { ...state, obStep: INTRO_STEPS[i - 1] } : state;
    }

    case 'ob/retake':
      return { ...state, obStep: 'played', played: {}, playedQuery: '' };

    case 'played/toggle': {
      const played = { ...state.played };
      if (played[action.id]) delete played[action.id];
      else played[action.id] = true;
      return { ...state, played };
    }

    case 'played/query':
      return { ...state, playedQuery: action.value };

    case 'played/focus':
      return { ...state, playedFocus: action.value };

    case 'seed/toggle':
      return { ...state, backlog: { ...state.backlog, [action.k]: !state.backlog[action.k] } };

    case 'flow/enterHome':
      return { ...state, flow: 'home', onboardingComplete: true };

    case 'flow/go':
      // Landing on Profile always shows the profile itself, never the editor
      // it was left in. The other tabs keep whatever they had open.
      if (action.flow !== 'profile') return { ...state, flow: action.flow };
      return { ...state, flow: action.flow, prEditOpen: false, prEditIn: false };

    case 'flow/goCompare':
      return { ...state, flow: 'h2h', h2hScreen: 'intent' };

    // ── discover ──────────────────────────────────────────────
    case 'pick/fadeStart':
      return { ...state, pickFading: true };

    case 'pick/advance': {
      const n = backlogGames(state).length || 1;
      return { ...state, pickIdx: (state.pickIdx + 1) % n, pickFading: false };
    }

    case 'pick/startPlaying': {
      const g = currentPick(state);
      if (!g) return state;
      return { ...state, upNext: g.k, playingItem: null };
    }

    case 'pick/clearStatus':
      return {
        ...state,
        upNext: null,
        playingItem: null,
        itemStatus: { ...state.itemStatus, [action.name]: action.status },
      };

    case 'pickIntro/set':
      return { ...state, pickIntro: action.value };

    case 'overlay/close':
      return { ...state, [OVERLAY_FLAG[action.overlay]]: false };

    // ── library ───────────────────────────────────────────────
    case 'lib/view':
      return { ...state, libView: action.view };

    case 'lib/seg':
      return { ...state, libSeg: action.seg };

    // Mounted off-frame; `lib/detailIn` a tick later is what animates it in.
    case 'lib/openDetail':
      return { ...state, libDetailOpen: true, libDetailIn: false, libList: action.name };

    case 'lib/detailIn':
      return state.libDetailOpen ? { ...state, libDetailIn: true } : state;

    case 'lib/closingDetail':
      return { ...state, libDetailIn: false };

    case 'lib/closedDetail':
      return { ...state, libDetailOpen: false };

    case 'lib/openEdit': {
      const { name, list } = activeList(state);
      const copy = listCopy(state, name, list);
      return {
        ...state,
        libEditOpen: true,
        libEditIn: false,
        libEditTitleDraft: copy.title,
        libEditDescDraft: copy.desc,
        libEditOrderedDraft: listIsRanked(state, name, list),
        libEditProfileDraft: state.libProfileShown[name] ?? true,
        libEditOrderDraft: libOrderFor(list, state.libOrder[name]).slice(),
        libEditDragFrom: null,
      };
    }

    case 'lib/editIn':
      return state.libEditOpen ? { ...state, libEditIn: true } : state;

    case 'lib/editTitle':
      return { ...state, libEditTitleDraft: action.value };

    case 'lib/editDesc':
      return { ...state, libEditDescDraft: action.value };

    case 'lib/toggleOrdered':
      return { ...state, libEditOrderedDraft: !state.libEditOrderedDraft };

    case 'lib/toggleProfile':
      return { ...state, libEditProfileDraft: !state.libEditProfileDraft };

    case 'lib/dragStart':
      return { ...state, libEditDragFrom: action.index };

    case 'lib/dragOver': {
      const from = state.libEditDragFrom;
      if (from === null || from === action.index) return state;
      const order = state.libEditOrderDraft.slice();
      const [moved] = order.splice(from, 1);
      order.splice(action.index, 0, moved);
      // The row now under the cursor becomes the drag source, so the next
      // crossing measures from where the row actually is.
      return { ...state, libEditOrderDraft: order, libEditDragFrom: action.index };
    }

    case 'lib/dragEnd':
      return { ...state, libEditDragFrom: null };

    case 'lib/saveEdit': {
      const { name } = activeList(state);
      return {
        ...state,
        libOverrides: {
          ...state.libOverrides,
          [name]: { title: state.libEditTitleDraft, desc: state.libEditDescDraft },
        },
        libOrder: { ...state.libOrder, [name]: state.libEditOrderDraft },
        libOrdered: { ...state.libOrdered, [name]: state.libEditOrderedDraft },
        libProfileShown: { ...state.libProfileShown, [name]: state.libEditProfileDraft },
      };
    }

    case 'lib/closingEdit':
      return { ...state, libEditIn: false };

    case 'lib/closedEdit':
      return { ...state, libEditOpen: false };

    // ── friends ───────────────────────────────────────────────
    case 'fr/filter':
      return { ...state, frFilter: action.filter };

    case 'fr/openSheet':
      return { ...state, frSheet: true, frSheetClosing: false };

    case 'fr/closingSheet':
      return { ...state, frSheetClosing: true };

    case 'fr/closedSheet':
      return { ...state, frSheet: false, frSheetClosing: false };

    // Mounted off-frame; `fr/addIn` a tick later is what animates it in.
    case 'fr/openAdd':
      return { ...state, frAddOpen: true, frAddIn: false };

    case 'fr/addIn':
      return state.frAddOpen ? { ...state, frAddIn: true } : state;

    case 'fr/closingAdd':
      return { ...state, frAddIn: false };

    // The search resets with the panel — reopening it starts from Suggested.
    case 'fr/closedAdd':
      return { ...state, frAddOpen: false, frAddQuery: '' };

    case 'fr/addQuery':
      return { ...state, frAddQuery: action.value };

    case 'fr/request':
      return { ...state, frAdded: { ...state.frAdded, [action.key]: true } };

    // ── profile ───────────────────────────────────────────────
    case 'pr/tab':
      return { ...state, prTab: action.tab };

    // Mounted off-frame; `pr/editIn` a tick later is what animates it in.
    // Both drafts are seeded from what's committed, so Cancel can drop them.
    case 'pr/openEdit':
      return {
        ...state,
        prEditOpen: true,
        prEditIn: false,
        prUsernameDraft: state.prUsername,
        prBioDraft: state.prBio,
      };

    case 'pr/editIn':
      return state.prEditOpen ? { ...state, prEditIn: true } : state;

    case 'pr/saveEdit':
      return { ...state, prUsername: state.prUsernameDraft, prBio: state.prBioDraft };

    case 'pr/closingEdit':
      return { ...state, prEditIn: false };

    case 'pr/closedEdit':
      return { ...state, prEditOpen: false };

    case 'pr/usernameDraft':
      return { ...state, prUsernameDraft: action.value };

    case 'pr/bioDraft':
      return { ...state, prBioDraft: action.value };

    case 'pr/listSearch':
      return { ...state, prListSearch: action.value };

    case 'pr/listSort':
      return { ...state, prListSort: action.sort };

    case 'pr/toggleListFilter':
      return { ...state, prListFilterOpen: !state.prListFilterOpen };

    // ── search ────────────────────────────────────────────────
    case 'sr/query':
      return { ...state, srQuery: action.value };

    case 'sr/focus':
      return { ...state, srFocused: action.value };

    case 'time/open':
      return { ...state, timeSheet: true, timeClosing: false };

    case 'time/closing':
      return { ...state, timeClosing: true };

    case 'time/closed':
      return { ...state, timeSheet: false, timeClosing: false };

    case 'time/pick':
      // Re-tuning the session length restarts the pick rotation.
      return { ...state, time: action.index, pickIdx: 0 };

    case 'sheet/open':
      return { ...state, sheet: action.target, sheetClosing: false };

    case 'sheet/closing':
      return { ...state, sheetClosing: true };

    case 'sheet/closed':
      return { ...state, sheet: null, sheetClosing: false };

    case 'sheet/markPlaying':
      return {
        ...state,
        itemStatus: { ...state.itemStatus, [action.item.name]: 'playing' },
        playingItem: action.item,
        upNext: null,
        pickIntro: true,
      };

    case 'sheet/setStatus':
      return {
        ...state,
        itemStatus: { ...state.itemStatus, [action.name]: action.status },
        // A game that leaves "playing" stops occupying the pick card.
        playingItem:
          state.playingItem && state.playingItem.name === action.name ? null : state.playingItem,
      };

    // ── game detail ───────────────────────────────────────────
    case 'gd/tab':
      return { ...state, gdTab: action.tab };

    // Tapping the rating that's already picked clears it.
    case 'gd/rating':
      return { ...state, gdRating: state.gdRating === action.rating ? null : action.rating };

    case 'gd/reviewText':
      return { ...state, gdReviewText: action.value };

    case 'gd/post':
      return state.gdRating ? { ...state, gdPosted: true } : state;

    case 'gd/editReview':
      return { ...state, gdPosted: false };

    case 'spot/dismissing':
      return state.spotDismissing ? state : { ...state, spotDismissing: true };

    case 'spot/dismissed':
      return { ...state, spotDismissed: true, spotDismissing: false };

    // ── head-to-head ──────────────────────────────────────────
    case 'h2h/setIntent':
      return { ...state, intent: action.intent };

    case 'h2h/screen':
      return { ...state, h2hScreen: action.screen };

    case 'h2h/startDuel':
      return startDuelState(state, action.intent);

    case 'h2h/picking':
      return state.picking ? state : { ...state, picking: action.side };

    case 'h2h/resolve': {
      const snap = snapshot(state);
      const isChamp = action.side === 'champ';
      const champion = isChamp ? state.champion : state.challenger;
      // Winner stays; a new challenger resets the streak to 1.
      const streak = isChamp ? state.streak + 1 : 1;
      const compareCount = state.compareCount + 1;
      const queue = state.queue.slice();

      if (streak >= 3) return finishDuel(state, champion, 'streak', snap, compareCount);
      if (compareCount >= 5) return finishDuel(state, champion, 'cap', snap, compareCount);
      if (queue.length === 0) return finishDuel(state, champion, 'exhausted', snap, compareCount);

      const nextChallenger = queue.shift()!;
      return {
        ...state,
        champion,
        challenger: nextChallenger,
        queue,
        streak,
        compareCount,
        turn: state.turn + 1,
        picking: null,
        history: [...state.history, snap],
      };
    }

    case 'h2h/undo': {
      if (!state.history.length) return state;
      const history = state.history.slice();
      const snap = history.pop()!;
      return { ...state, ...snap, history, h2hScreen: 'duel', picking: null };
    }

    case 'h2h/skip': {
      if (state.picking) return state;
      const snap = snapshot(state);
      const queue = state.queue.slice();
      if (queue.length === 0) {
        return finishDuel(state, state.champion, 'exhausted', snap, state.compareCount);
      }
      const nextChallenger = queue.shift()!;
      return {
        ...state,
        challenger: nextChallenger,
        queue,
        turn: state.turn + 1,
        history: [...state.history, snap],
      };
    }

    case 'h2h/keepComparing': {
      const winnerKey = state.winner?.k;
      const pool = poolFor(state, state.intent).filter((g) => g.k !== winnerKey);
      if (pool.length < 2) return { ...state, h2hScreen: 'coldstart' };
      return {
        ...state,
        h2hScreen: 'duel',
        champion: pool[0],
        challenger: pool[1],
        queue: pool.slice(2),
        streak: 0,
        compareCount: 0,
        turn: 0,
        history: [],
        picking: null,
      };
    }

    case 'h2h/commitPlaying': {
      const w = state.winner;
      if (!w) return state;
      // The duel winner overrides anything marked playing by hand.
      return {
        ...state,
        upNext: w.k,
        playingItem: null,
        flow: 'home',
        pickIntro: true,
      };
    }

    case 'h2h/back':
      return { ...state, flow: 'home' };

    case 'jump':
      return { ...state, ...action.patch };

    default:
      return state;
  }
}
