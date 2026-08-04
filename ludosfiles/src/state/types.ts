import type { Game, Intent } from '../data/games';

export type Flow = 'onboarding' | 'home' | 'h2h';

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

/** How a game is tracked once the user acts on it. */
export type GameStatus = 'backlog' | 'playing' | 'finished';

/** The game a status sheet was opened for. */
export interface SheetTarget {
  name: string;
  meta?: string;
  slotId?: string;
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
  statusMenu: boolean;
  spotDismissed: boolean;
  spotDismissing: boolean;

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
