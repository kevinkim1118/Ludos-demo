import { useCallback, useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

/**
 * Registers the service worker and reports when a newer build is waiting.
 *
 * The worker used to take over on its own (`registerType: 'autoUpdate'`), which
 * reloads the page the moment a deploy lands — possibly mid-duel or mid-picker.
 * Only the durable slice of state is saved, so that reload throws away an
 * in-flight matchup and drops the user somewhere they didn't ask to be. The new
 * build now waits, and taking it is the user's call.
 *
 * Ignoring it strands nobody: a waiting worker activates on its own once every
 * tab is closed, so the next cold launch is on the new build regardless.
 */

/** How long a session may run before it looks for a new build. */
const POLL = 60 * 60 * 1000;

/**
 * `?update` fakes an available update on any build, the way `?hint` fakes the
 * install hint — otherwise looking at this banner means deploying twice.
 */
const FORCED = new URLSearchParams(window.location.search).has('update');

/** The handover is a message to another thread; don't leave a dead button if it goes unanswered. */
const RELOAD_FALLBACK = 3000;

type Listener = () => void;

const listeners = new Set<Listener>();
let waiting = false;
let started = false;
let updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined;

/**
 * The browser only looks for a new worker when the page navigates, and an
 * installed app doesn't navigate — it sits on a home screen for weeks. Coming
 * back to the foreground is the moment that matters on a phone; the interval
 * covers a tab left open on a desktop.
 */
function watch(registration: ServiceWorkerRegistration) {
  let last = Date.now();

  const check = () => {
    last = Date.now();
    // Offline, or the request raced a deploy — either way the next check retries.
    registration.update().catch(() => {});
  };

  setInterval(check, POLL);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && Date.now() - last >= POLL) check();
  });
}

/** Once per document rather than once per mount — StrictMode mounts twice. */
function start() {
  if (started) return;
  started = true;

  updateSW = registerSW({
    onNeedRefresh() {
      waiting = true;
      for (const listener of listeners) listener();
    },
    onRegisteredSW(_url, registration) {
      if (registration) watch(registration);
    },
  });
}

export interface AppUpdate {
  /** A newer build is installed and waiting to take over. */
  ready: boolean;
  /** Hand over to it and reload onto the new build. */
  apply: () => void;
  /** Drop the prompt for this session; the update still lands on the next cold start. */
  dismiss: () => void;
}

export function useAppUpdate(): AppUpdate {
  const [ready, setReady] = useState(() => FORCED || waiting);

  useEffect(() => {
    const listener = () => setReady(true);
    listeners.add(listener);
    start();
    // Registration can resolve between the first render and this effect.
    if (waiting) setReady(true);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const apply = useCallback(() => {
    // Nothing is actually waiting behind `?update`, so there's nothing to hand
    // over to — reloading is the whole of what the real path ends in anyway.
    if (FORCED) {
      window.location.reload();
      return;
    }

    // Tells the waiting worker to skip waiting, then reloads once it takes
    // control. Same reason nothing here unmounts on `animationend`: the event
    // that would complete this can fail to arrive, so back it with a timer.
    void updateSW?.(true);
    setTimeout(() => window.location.reload(), RELOAD_FALLBACK);
  }, []);

  const dismiss = useCallback(() => setReady(false), []);

  return { ready, apply, dismiss };
}
