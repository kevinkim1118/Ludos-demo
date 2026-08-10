import { useEffect, useRef } from 'react';
import type { State } from './types';
import type { LudosActions } from './useLudos';

/**
 * Makes the platform back gesture dismiss UI instead of leaving the app.
 *
 * Installed, there's no browser chrome, so Android's back button goes straight
 * to the OS — press it with a status sheet open and the whole app closes. The
 * app has no router, so there's nothing for the system to go "back" through
 * unless we put it there: each dismissible layer pushes a history entry when it
 * opens and consumes one when it closes.
 *
 * Harmless elsewhere. On desktop it makes the browser's back button close the
 * sheet before leaving the site, which is what you'd want anyway, and iOS's
 * edge-swipe follows the same history.
 */

/** Dismissible layers, outermost first — the last one is what back closes. */
type Layer = 'h2h' | 'sheet' | 'time';

function openLayers(state: State): Layer[] {
  const open: Layer[] = [];
  if (state.flow === 'h2h') open.push('h2h');
  // A sheet mid-exit-animation is already on its way out; counting it would
  // push a fresh entry for something that's closing.
  if (state.sheet && !state.sheetClosing) open.push('sheet');
  if (state.timeSheet && !state.timeClosing) open.push('time');
  return open;
}

export function useBackNavigation(state: State, actions: LudosActions) {
  const stateRef = useRef(state);
  stateRef.current = state;

  /** History entries we're responsible for. */
  const depth = useRef(0);
  /** popstate events we triggered ourselves, and must not act on. */
  const selfPops = useRef(0);

  // Keep the history depth matched to what's actually open.
  useEffect(() => {
    const next = openLayers(state).length;
    const prev = depth.current;

    if (next > prev) {
      for (let i = prev; i < next; i++) window.history.pushState({ ludos: i + 1 }, '');
    } else if (next < prev) {
      // Closed from inside the app — a tap on the backdrop, the in-app back
      // button — so retire the entries that layer was holding.
      selfPops.current += prev - next;
      window.history.go(next - prev);
    }

    depth.current = next;
  }, [state]);

  useEffect(() => {
    const onPopState = () => {
      if (selfPops.current > 0) {
        selfPops.current -= 1;
        return;
      }

      const open = openLayers(stateRef.current);
      const top = open[open.length - 1];
      // Nothing left to dismiss: let the back go through and leave the app.
      if (!top) return;

      // The entry is already spent — record that before the close dispatches,
      // or the sync effect above will try to retire it a second time.
      depth.current = open.length - 1;

      if (top === 'time') actions.closeTimeSheet();
      else if (top === 'sheet') actions.closeSheet();
      else actions.h2hBack();
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [actions]);
}
