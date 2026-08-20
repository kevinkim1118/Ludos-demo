import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { GAMES, type Intent } from '../data/games';
import { hydrate, serialize, write } from './persistence';
import {
  activePickTarget,
  backlogGames,
  currentPick,
  initialState,
  poolFor,
  reducer,
  type Action,
} from './reducer';
import type { LibSeg } from '../data/library';
import type {
  FriendsFilter,
  GameStatus,
  LibView,
  ObStep,
  Overlay,
  PlayingItem,
  ProfileTab,
  SheetTarget,
  Side,
  State,
  TabFlow,
} from './types';

/** Toast copy for a status set from the sheet's status mode. */
function statusToast(status: GameStatus, name: string): string {
  if (status === 'finished') return `Marked ${name} as finished`;
  if (status === 'backlog') return `Moved ${name} to backlog`;
  if (status === 'dnf') return `Marked ${name} as did not finish`;
  return `Now playing ${name}`;
}

/**
 * Animation and flow timings, in ms. These are load-bearing: sheets and the
 * spotlight unmount only after their exit animation has played, so shortening
 * one here truncates the animation on screen.
 */
const TIMING = {
  toast: 1900,
  /** One tick out of frame before a sliding panel moves, so the transition runs. */
  panelEnter: 40,
  /** Matches the `left` / `transform` transitions on the library panels. */
  panelExit: 300,
  /** "Analyzing what you've played…" before the result screen. */
  reading: 2400,
  /** Highlight the chosen card before the next matchup loads. */
  duelResolve: 380,
  /** Cross-fade out, swap the pick, fade back in. */
  pickFade: 180,
  sheetClose: 280,
  spotDismiss: 380,
  /** Pick card's entrance after landing back on Discover. */
  pickIntroFromDuel: 1000,
  pickIntroFromSheet: 700,
  scrollTop: 60,
} as const;

type TimerKey =
  | 'toast'
  | 'reading'
  | 'duel'
  | 'pickFade'
  | 'sheet'
  | 'timeSheet'
  | 'pickIntro'
  | 'spot'
  | 'scroll'
  | 'libDetail'
  | 'libDetailIn'
  | 'libEdit'
  | 'libEditIn';

export function useLudos() {
  const [state, dispatch] = useReducer(reducer, initialState, hydrate);

  // Only the durable slice is serialized, and only when one of its fields
  // actually changes — otherwise every toast and duel frame would hit
  // localStorage synchronously.
  const payload = useMemo(
    () =>
      serialize({
        onboardingComplete: state.onboardingComplete,
        backlog: state.backlog,
        itemStatus: state.itemStatus,
        upNext: state.upNext,
        playingItem: state.playingItem,
        played: state.played,
      }),
    [
      state.onboardingComplete,
      state.backlog,
      state.itemStatus,
      state.upNext,
      state.playingItem,
      state.played,
    ],
  );

  useEffect(() => {
    write(payload);
  }, [payload]);

  // Mirrors the class component's `this.state` — lets action creators read the
  // current state without re-binding every callback on each render.
  const stateRef = useRef(state);
  stateRef.current = state;

  const timers = useRef<Partial<Record<TimerKey, ReturnType<typeof setTimeout>>>>({});
  const homeScroll = useRef<HTMLDivElement>(null);

  const setTimer = useCallback((key: TimerKey, fn: () => void, ms: number) => {
    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(fn, ms);
  }, []);

  const clearTimer = useCallback((key: TimerKey) => {
    clearTimeout(timers.current[key]);
    delete timers.current[key];
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      Object.values(pending).forEach(clearTimeout);
    };
  }, []);

  const flash = useCallback(
    (msg: string) => {
      dispatch({ type: 'toast/show', msg });
      setTimer('toast', () => dispatch({ type: 'toast/hide' }), TIMING.toast);
    },
    [setTimer],
  );

  const demo = useCallback(() => flash('Not available in this demo'), [flash]);

  const scrollHomeTop = useCallback(() => {
    setTimer(
      'scroll',
      () => homeScroll.current?.scrollTo({ top: 0, behavior: 'smooth' }),
      TIMING.scrollTop,
    );
  }, [setTimer]);

  const closeSheet = useCallback(() => {
    if (!stateRef.current.sheet) return;
    dispatch({ type: 'sheet/closing' });
    setTimer('sheet', () => dispatch({ type: 'sheet/closed' }), TIMING.sheetClose);
  }, [setTimer]);

  const closeTimeSheet = useCallback(() => {
    if (!stateRef.current.timeSheet) return;
    dispatch({ type: 'time/closing' });
    setTimer('timeSheet', () => dispatch({ type: 'time/closed' }), TIMING.sheetClose);
  }, [setTimer]);

  const closeLibDetail = useCallback(() => {
    if (!stateRef.current.libDetailOpen) return;
    dispatch({ type: 'lib/closingDetail' });
    setTimer('libDetail', () => dispatch({ type: 'lib/closedDetail' }), TIMING.panelExit);
  }, [setTimer]);

  /** Cancel discards the drafts; Save commits them before the panel leaves. */
  const closeLibEdit = useCallback(
    (save: boolean) => {
      if (!stateRef.current.libEditOpen) return;
      if (save) dispatch({ type: 'lib/saveEdit' });
      dispatch({ type: 'lib/closingEdit' });
      setTimer('libEdit', () => dispatch({ type: 'lib/closedEdit' }), TIMING.panelExit);
    },
    [setTimer],
  );

  const actions = useMemo(
    () => ({
      dispatch: (action: Action) => dispatch(action),
      flash,
      demo,

      // ── onboarding ──────────────────────────────────────────
      introNext: () => dispatch({ type: 'ob/introNext' }),
      introBack: () => dispatch({ type: 'ob/introBack' }),
      togglePlayed: (id: string) => dispatch({ type: 'played/toggle', id }),
      setPlayedQuery: (value: string) => dispatch({ type: 'played/query', value }),
      setPlayedFocus: (value: boolean) => dispatch({ type: 'played/focus', value }),

      /** Runs the analysis beat, then reveals the player-type result. */
      goReading: () => {
        dispatch({ type: 'ob/step', step: 'reading' });
        setTimer('reading', () => dispatch({ type: 'ob/step', step: 'result' }), TIMING.reading);
      },
      skipPlayed: () => {
        clearTimer('reading');
        dispatch({ type: 'ob/step', step: 'done' });
      },
      toggleSeed: (k: string) => dispatch({ type: 'seed/toggle', k }),
      resultContinue: () => dispatch({ type: 'ob/step', step: 'done' }),
      retake: () => {
        clearTimer('reading');
        dispatch({ type: 'ob/retake' });
      },
      enterLudos: () => dispatch({ type: 'flow/enterHome' }),

      // ── discover ────────────────────────────────────────────
      cyclePick: () => {
        dispatch({ type: 'pick/fadeStart' });
        setTimer('pickFade', () => dispatch({ type: 'pick/advance' }), TIMING.pickFade);
      },
      startPlayingPick: () => {
        const game = currentPick(stateRef.current);
        if (!game) return;
        dispatch({ type: 'pick/startPlaying' });
        flash(`Now playing ${game.name}`);
      },
      /** The pick card's "Update Status" button — the sheet in status mode. */
      openStatusSheet: () => {
        clearTimer('sheet');
        dispatch({
          type: 'sheet/open',
          target: { ...activePickTarget(stateRef.current), statusUpdate: true },
        });
      },
      goCompare: () => dispatch({ type: 'flow/goCompare' }),

      // ── navigation ──────────────────────────────────────────
      navigate: (flow: TabFlow) => dispatch({ type: 'flow/go', flow }),
      goDiscover: () => dispatch({ type: 'flow/go', flow: 'home' }),
      openDetail: () => dispatch({ type: 'flow/go', flow: 'detail' }),
      /**
       * Used by back navigation, which knows what's open but not how each
       * layer leaves. The library panels animate out; the rest are still
       * plain flags until their screens land.
       */
      closeOverlay: (overlay: Overlay) => {
        if (overlay === 'libDetail') closeLibDetail();
        else if (overlay === 'libEdit') closeLibEdit(false);
        else dispatch({ type: 'overlay/close', overlay });
      },

      // ── library ─────────────────────────────────────────────
      setLibView: (view: LibView) => dispatch({ type: 'lib/view', view }),
      setLibSeg: (seg: LibSeg) => dispatch({ type: 'lib/seg', seg }),

      openLibList: (name: string) => {
        clearTimer('libDetail');
        dispatch({ type: 'lib/openDetail', name });
        setTimer('libDetailIn', () => dispatch({ type: 'lib/detailIn' }), TIMING.panelEnter);
      },
      closeLibList: closeLibDetail,

      openLibEdit: () => {
        clearTimer('libEdit');
        dispatch({ type: 'lib/openEdit' });
        setTimer('libEditIn', () => dispatch({ type: 'lib/editIn' }), TIMING.panelEnter);
      },
      cancelLibEdit: () => closeLibEdit(false),
      saveLibEdit: () => closeLibEdit(true),

      setLibEditTitle: (value: string) => dispatch({ type: 'lib/editTitle', value }),
      setLibEditDesc: (value: string) => dispatch({ type: 'lib/editDesc', value }),
      toggleLibRanked: () => dispatch({ type: 'lib/toggleOrdered' }),
      toggleLibProfile: () => dispatch({ type: 'lib/toggleProfile' }),
      libDragStart: (index: number) => dispatch({ type: 'lib/dragStart', index }),
      libDragOver: (index: number) => dispatch({ type: 'lib/dragOver', index }),
      libDragEnd: () => dispatch({ type: 'lib/dragEnd' }),

      dismissSpotlight: () => {
        if (stateRef.current.spotDismissing) return;
        dispatch({ type: 'spot/dismissing' });
        setTimer('spot', () => dispatch({ type: 'spot/dismissed' }), TIMING.spotDismiss);
      },

      openTimeSheet: () => {
        clearTimer('timeSheet');
        dispatch({ type: 'time/open' });
      },
      closeTimeSheet,
      pickTime: (index: number) => {
        dispatch({ type: 'time/pick', index });
        closeTimeSheet();
      },

      openSheet: (target: SheetTarget) => {
        clearTimer('sheet');
        dispatch({ type: 'sheet/open', target });
      },
      closeSheet,

      /**
       * Status chosen from the sheet's status mode. Unlike the add sheet this
       * clears the pick card outright — the game it was showing is no longer
       * what's in flight.
       */
      setPickStatus: (status: GameStatus) => {
        const name = stateRef.current.sheet?.name;
        closeSheet();
        if (!name) return;
        dispatch({ type: 'pick/clearStatus', status, name });
        flash(statusToast(status, name));
      },

      /** Status chosen from the add sheet. "Playing" also takes over the pick card. */
      sheetAction: (status: GameStatus, msg: string) => {
        const sheet = stateRef.current.sheet;
        const name = sheet?.name;
        closeSheet();
        if (!name) {
          flash(msg);
          return;
        }

        if (status === 'playing') {
          const item: PlayingItem = {
            name,
            meta: sheet?.meta ?? '',
            slotId: sheet?.slotId ?? '',
          };
          flash(`Now playing ${name}`);
          dispatch({ type: 'sheet/markPlaying', item });
          setTimer(
            'pickIntro',
            () => dispatch({ type: 'pickIntro/set', value: false }),
            TIMING.pickIntroFromSheet,
          );
          scrollHomeTop();
          return;
        }

        flash(msg);
        dispatch({ type: 'sheet/setStatus', name, status });
      },

      // ── head-to-head ────────────────────────────────────────
      setIntent: (intent: Intent) => dispatch({ type: 'h2h/setIntent', intent }),
      startComparing: () =>
        dispatch({ type: 'h2h/startDuel', intent: stateRef.current.intent }),
      changeIntent: () => dispatch({ type: 'h2h/screen', screen: 'intent' }),
      pickSide: (side: Side) => {
        if (stateRef.current.picking) return;
        dispatch({ type: 'h2h/picking', side });
        setTimer('duel', () => dispatch({ type: 'h2h/resolve', side }), TIMING.duelResolve);
      },
      undo: () => dispatch({ type: 'h2h/undo' }),
      skip: () => dispatch({ type: 'h2h/skip' }),
      keepComparing: () => dispatch({ type: 'h2h/keepComparing' }),
      commitPlaying: () => {
        const winner = stateRef.current.winner;
        if (!winner) return;
        dispatch({ type: 'h2h/commitPlaying' });
        scrollHomeTop();
        setTimer(
          'pickIntro',
          () => dispatch({ type: 'pickIntro/set', value: false }),
          TIMING.pickIntroFromDuel,
        );
        flash(`Marked ${winner.name} as playing`);
      },
      h2hBack: () => dispatch({ type: 'h2h/back' }),
    }),
    [
      flash,
      demo,
      setTimer,
      clearTimer,
      closeSheet,
      closeTimeSheet,
      closeLibDetail,
      closeLibEdit,
      scrollHomeTop,
    ],
  );

  return { state, actions, homeScroll };
}

export type LudosActions = ReturnType<typeof useLudos>['actions'];

/** Screen deep-links for development — see `?screen=` in App.tsx. */
export function jumpPatch(state: State, target: string): Partial<State> | null {
  const [group, name] = target.split(':').map((s) => s.trim());

  if (group === 'onboarding') {
    const steps: Record<string, ObStep> = {
      intro1: 'intro1',
      intro2: 'intro2',
      intro3: 'intro3',
      intro4: 'intro4',
      played: 'played',
      reading: 'reading',
      result: 'result',
      done: 'done',
    };
    return { flow: 'onboarding', obStep: steps[name] ?? 'intro1' };
  }

  if (group === 'home') {
    if (name === 'playing') {
      // Discover as it looks once a game is in flight.
      const game = backlogGames(state)[0];
      return { flow: 'home', upNext: game?.k ?? null, playingItem: null };
    }
    return { flow: 'home', upNext: null, playingItem: null };
  }

  if (group === 'search') return { flow: 'search' };

  if (group === 'detail') return { flow: 'detail' };

  // Each tab lands on itself with nothing it may have been left holding open.
  if (group === 'profile') {
    const tabs: ProfileTab[] = ['reviews', 'lists', 'activity'];
    const prTab = tabs.find((t) => t === name) ?? 'reviews';
    return { flow: 'profile', prTab, prEditOpen: false };
  }

  if (group === 'friends') {
    const frFilter: FriendsFilter = 'all';
    return { flow: 'friends', frFilter, frSheet: false, frAddOpen: false };
  }

  if (group === 'library') {
    const libView: LibView = name === 'lists' ? 'lists' : 'library';
    return {
      flow: 'library',
      libView,
      libDetailOpen: false,
      libDetailIn: false,
      libEditOpen: false,
      libEditIn: false,
    };
  }

  if (group === 'h2h') {
    const intent =
      (['big', 'story', 'fast', 'chill'] as Intent[]).find((k) => poolFor(state, k).length >= 2) ??
      'fast';

    if (name === 'intent') return { flow: 'h2h', h2hScreen: 'intent' };
    if (name === 'cold') return { flow: 'h2h', h2hScreen: 'coldstart', intent };

    if (name === 'duel') {
      const pool = poolFor(state, intent);
      if (pool.length < 2) return { flow: 'h2h', h2hScreen: 'coldstart', intent };
      return {
        flow: 'h2h',
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

    if (name === 'outcome') {
      const pool = poolFor(state, intent);
      return {
        flow: 'h2h',
        h2hScreen: 'outcome',
        intent,
        winner: pool[0] ?? backlogGames(state)[0] ?? GAMES.hades,
        winReason: 'streak',
        compareCount: 3,
        picking: null,
        history: [],
      };
    }
  }

  return null;
}
