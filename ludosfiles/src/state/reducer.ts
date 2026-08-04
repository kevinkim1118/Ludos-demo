import { GAMES, type Game, type Intent } from '../data/games';
import {
  INTRO_STEPS,
  type GameStatus,
  type H2HScreen,
  type ObStep,
  type PlayingItem,
  type SheetTarget,
  type Side,
  type Snapshot,
  type State,
  type WinReason,
} from './types';

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
  statusMenu: false,
  spotDismissed: false,
  spotDismissing: false,

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
  | { type: 'flow/goCompare' }
  | { type: 'pick/fadeStart' }
  | { type: 'pick/advance' }
  | { type: 'pick/startPlaying' }
  | { type: 'pick/clearStatus'; status: GameStatus; name: string }
  | { type: 'pickIntro/set'; value: boolean }
  | { type: 'status/toggleMenu' }
  | { type: 'time/open' }
  | { type: 'time/closing' }
  | { type: 'time/closed' }
  | { type: 'time/pick'; index: number }
  | { type: 'sheet/open'; target: SheetTarget }
  | { type: 'sheet/closing' }
  | { type: 'sheet/closed' }
  | { type: 'sheet/markPlaying'; item: PlayingItem }
  | { type: 'sheet/setStatus'; name: string; status: GameStatus }
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

    case 'flow/goCompare':
      return { ...state, flow: 'h2h', h2hScreen: 'intent', statusMenu: false };

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
        statusMenu: false,
        upNext: null,
        playingItem: null,
        itemStatus: { ...state.itemStatus, [action.name]: action.status },
      };

    case 'pickIntro/set':
      return { ...state, pickIntro: action.value };

    case 'status/toggleMenu':
      return { ...state, statusMenu: !state.statusMenu };

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
        statusMenu: false,
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
