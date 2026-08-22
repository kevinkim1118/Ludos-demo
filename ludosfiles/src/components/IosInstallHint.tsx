import { useEffect, useState } from 'react';
import { readFlag, writeFlag } from '../state/persistence';
import { IconClose, IconShare } from './icons';

/**
 * iOS has no install prompt. `beforeinstallprompt` is Chrome-only, so on the
 * app's actual target device the only route is Share → Add to Home Screen, and
 * nothing tells the user that. This is that nothing, filled in.
 *
 * Shown once, on Discover rather than mid-onboarding — by then the user has
 * picked their played games and has something worth keeping.
 */

/** How long to let the screen settle before sliding the hint in. */
const DELAY = 1400;

/**
 * Unmount delay after dismissal, matching the exit animation. A timer rather
 * than `animationend` because that event doesn't always arrive — a backgrounded
 * tab or a cancelled animation swallows it, and the hint would then sit there
 * invisible at opacity 0, still eating taps meant for the screen underneath.
 * Same reason the sheets in useLudos.ts close on a timer.
 */
const EXIT = 200;

function isIos(): boolean {
  if (/iP(hone|od|ad)/.test(navigator.userAgent)) return true;
  // iPadOS reports itself as a Mac; the touch points give it away.
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

/**
 * Every iOS browser runs WebKit, but only Safari offers Add to Home Screen from
 * the share sheet, and the others' share menus look nothing like the copy here.
 */
function isSafari(): boolean {
  return !/CriOS|FxiOS|EdgiOS|OPiOS|mercury/i.test(navigator.userAgent);
}

function isInstalled(): boolean {
  // `navigator.standalone` is the iOS-only signal; the media query covers the rest.
  const nav = navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}

export function IosInstallHint() {
  const [state, setState] = useState<'hidden' | 'shown' | 'leaving'>('hidden');

  useEffect(() => {
    // `?hint` forces it on any device — the alternative is needing an actual
    // iPhone to look at it. Companion to the `?screen=` and `?reset` links.
    const forced = new URLSearchParams(window.location.search).has('hint');
    if (!forced && (!isIos() || !isSafari() || isInstalled() || readFlag('iosInstallHint'))) {
      return;
    }
    const t = setTimeout(() => setState('shown'), forced ? 0 : DELAY);
    return () => clearTimeout(t);
  }, []);

  if (state === 'hidden') return null;

  const dismiss = () => {
    writeFlag('iosInstallHint');
    setState('leaving');
    setTimeout(() => setState('hidden'), EXIT);
  };

  return (
    <div
      role="note"
      style={{
        position: 'absolute',
        left: 12,
        right: 12,
        // Clear of the tab bar, which the hint must never cover.
        bottom: 78,
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        background: 'var(--surface-2)',
        border: '1px solid var(--border-strong)',
        borderRadius: 14,
        padding: '11px 12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        animation:
          state === 'leaving'
            ? `fadeOut ${EXIT - 20}ms ease forwards`
            : 'toastUp 260ms cubic-bezier(0.2,0,0,1)',
        // Nothing under a dismissed hint should be unreachable, even for the
        // few frames it's still mounted.
        pointerEvents: state === 'leaving' ? 'none' : undefined,
        zIndex: 40,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flex: 'none',
          width: 30,
          height: 30,
          borderRadius: 9,
          display: 'grid',
          placeItems: 'center',
          background: 'var(--surface-3)',
          color: 'var(--accent-500)',
        }}
      >
        <IconShare />
      </span>

      <p style={{ flex: 1, margin: 0, fontSize: 12.5, lineHeight: 1.35, color: 'var(--text-primary)' }}>
        Add Ludos to your Home Screen —{' '}
        <span style={{ color: 'var(--text-muted)' }}>tap Share, then Add to Home Screen.</span>
      </p>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          flex: 'none',
          width: 26,
          height: 26,
          display: 'grid',
          placeItems: 'center',
          background: 'none',
          border: 0,
          borderRadius: 8,
          color: 'var(--text-muted)',
          cursor: 'pointer',
        }}
      >
        <IconClose />
      </button>
    </div>
  );
}
