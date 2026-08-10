/**
 * Corrects the viewport height for an installed iOS app.
 *
 * Launched from the home screen, iOS sizes the initial containing block as
 * though Safari's bottom toolbar were still on screen — about 56pt short on an
 * iPhone 17. Every way of asking the viewport how tall it is inherits that:
 * `100dvh`, `100vh` and `height: 100%` all resolve against the same wrong box,
 * so the app lays itself out for chrome that isn't there and leaves a dead
 * strip under the tab bar. `dvh` at least self-corrects on the first scroll;
 * percentages never do.
 *
 * `screen.height` doesn't come from the containing block, so it isn't wrong —
 * and in standalone the web view genuinely covers the whole screen, so it's
 * also the right answer.
 *
 * Taking the max with `innerHeight` guards the other direction: it can only
 * ever raise the value, so the iOS keyboard — which shrinks `innerHeight` and
 * would otherwise collapse the app while someone types in the played-games
 * search — can't drag it down.
 */

/** Set on `<html>`; `app.css` falls back to `100%` when it's absent. */
const PROPERTY = '--app-height';

function isStandalone(): boolean {
  // `navigator.standalone` is the iOS-only signal; the media query covers the rest.
  const nav = navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}

export function lockStandaloneHeight(): void {
  if (!isStandalone()) return;

  const apply = () => {
    const height = Math.max(window.screen?.height ?? 0, window.innerHeight);
    if (height > 0) {
      document.documentElement.style.setProperty(PROPERTY, `${height}px`);
    }
  };

  apply();
  // The app is portrait-locked, but a rotation still swaps what `screen` reports.
  window.addEventListener('orientationchange', apply);
  window.addEventListener('resize', apply);
}
