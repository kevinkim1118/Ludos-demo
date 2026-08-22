import { useEffect, useRef } from 'react';
import type { Overlay, State } from './types';
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
type Layer = 'flow' | Overlay | 'sheet' | 'time';

/**
 * True anywhere back should unwind to Discover. Onboarding is excluded — it
 * runs before Discover exists, so there's nothing behind it to return to.
 */
function isSecondaryFlow(state: State): boolean {
  return state.flow !== 'onboarding' && state.flow !== 'home';
}

function openLayers(state: State): Layer[] {
  const open: Layer[] = [];

  // Head-to-head and the five secondary tabs are all "somewhere other than
  // Discover", and back returns from any of them the same way.
  if (isSecondaryFlow(state)) open.push('flow');

  // Panels a tab can be left holding open, above the tab but below the sheet.
  // A panel sliding out counts as gone, like a sheet mid-exit below.
  if (state.libDetailOpen && state.libDetailIn) open.push('libDetail');
  if (state.libEditOpen && state.libEditIn) open.push('libEdit');
  if (state.frSheet && !state.frSheetClosing) open.push('frSheet');
  if (state.frAddOpen && state.frAddIn) open.push('frAdd');
  if (state.prEditOpen && state.prEditIn) open.push('prEdit');

  // A sheet mid-exit-animation is already on its way out; counting it would
  // push a fresh entry for something that's closing.
  if (state.sheet && !state.sheetClosing) open.push('sheet');
  if (state.timeSheet && !state.timeClosing) open.push('time');
  return open;
}

const OVERLAYS: Overlay[] = ['libDetail', 'libEdit', 'frSheet', 'frAdd', 'prEdit'];

function isOverlay(layer: Layer): layer is Overlay {
  return (OVERLAYS as Layer[]).includes(layer);
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
      else if (isOverlay(top)) actions.closeOverlay(top);
      else if (stateRef.current.flow === 'h2h') actions.h2hBack();
      else actions.goDiscover();
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [actions]);
}
