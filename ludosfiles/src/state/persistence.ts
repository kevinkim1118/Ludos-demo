import type { GameStatus, PlayingItem, State } from './types';

const KEY = 'ludos.state';

/**
 * Bump whenever the persisted shape changes. A save written by any other
 * version is discarded rather than migrated, so a data change can never
 * resurrect state the current build can't read.
 */
const VERSION = 1;

/**
 * The durable slice of {@link State} — what the user has told the app, not what
 * the app is currently animating. Everything transient (sheets, toasts, the
 * in-flight duel) is deliberately left out so a cold launch never restores a
 * half-open overlay.
 */
export interface PersistedState {
  onboardingComplete: boolean;
  backlog: Record<string, boolean>;
  itemStatus: Record<string, GameStatus>;
  upNext: string | null;
  playingItem: PlayingItem | null;
  played: Record<string, true>;
}

/** localStorage throws outright in some sandboxed and private-mode contexts. */
function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Keeps only the entries whose value survives `pick`; anything else is dropped. */
function filterRecord<T>(value: unknown, pick: (v: unknown) => v is T): Record<string, T> {
  if (!isRecord(value)) return {};
  const out: Record<string, T> = {};
  for (const [k, v] of Object.entries(value)) {
    if (pick(v)) out[k] = v;
  }
  return out;
}

const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean';
const isTrue = (v: unknown): v is true => v === true;
const STATUSES: GameStatus[] = ['backlog', 'playing', 'finished'];
const isStatus = (v: unknown): v is GameStatus => STATUSES.includes(v as GameStatus);

function parsePlayingItem(value: unknown): PlayingItem | null {
  if (!isRecord(value)) return null;
  const { name, meta, slotId } = value;
  if (typeof name !== 'string' || typeof meta !== 'string' || typeof slotId !== 'string') {
    return null;
  }
  return { name, meta, slotId };
}

/**
 * Reads the save, or null if there isn't one, it's unreadable, or it was
 * written by a different version. Every field is re-validated: the store is
 * user-editable, so a malformed value must degrade rather than crash the boot.
 */
function read(): PersistedState | null {
  const store = storage();
  if (!store) return null;

  let raw: string | null;
  try {
    raw = store.getItem(KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isRecord(parsed) || parsed.v !== VERSION) return null;

  return {
    onboardingComplete: parsed.onboardingComplete === true,
    backlog: filterRecord(parsed.backlog, isBoolean),
    itemStatus: filterRecord(parsed.itemStatus, isStatus),
    upNext: typeof parsed.upNext === 'string' ? parsed.upNext : null,
    playingItem: parsePlayingItem(parsed.playingItem),
    played: filterRecord(parsed.played, isTrue),
  };
}

/** Serializes the durable slice. Kept separate so the write effect can memoize it. */
export function serialize(slice: PersistedState): string {
  return JSON.stringify({ v: VERSION, ...slice });
}

/** Best-effort write — a full or blocked quota must not break the session. */
export function write(payload: string): void {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(KEY, payload);
  } catch {
    /* quota exceeded or storage denied — the app keeps working in memory */
  }
}

/** Drops the save. Exposed for the `?reset` dev escape hatch. */
export function clear(): void {
  const store = storage();
  if (!store) return;
  try {
    store.removeItem(KEY);
  } catch {
    /* nothing to do */
  }
}

/**
 * `useReducer`'s init argument: folds any save over the defaults. A completed
 * onboarding boots straight to Discover, which is the whole point — an
 * installed app must not replay the ten-game picker on every cold launch.
 */
export function hydrate(base: State): State {
  const saved = read();
  if (!saved) return base;

  return {
    ...base,
    onboardingComplete: saved.onboardingComplete,
    flow: saved.onboardingComplete ? 'home' : base.flow,
    obStep: saved.onboardingComplete ? 'done' : base.obStep,
    // Toggling a seed flips its value, never removes the key, so a backlog with
    // no entries at all means a corrupt save — fall back to the seeds rather
    // than boot a pick card with nothing to offer.
    backlog: Object.keys(saved.backlog).length ? saved.backlog : base.backlog,
    itemStatus: saved.itemStatus,
    upNext: saved.upNext,
    playingItem: saved.playingItem,
    played: saved.played,
  };
}
