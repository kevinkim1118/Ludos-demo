import { useState } from 'react';
import { IconClose, IconRefresh } from './icons';

/**
 * "A new version is ready" — the affordance that lets the service worker stop
 * updating the app out from under the user. Sits where the install hint sits,
 * clear of the tab bar, and never blocks the screen: an update the user ignores
 * still lands on the next cold launch.
 */

/**
 * Unmount delay after dismissal, matching the exit animation. A timer rather
 * than `animationend` — see IosInstallHint for what that event costs.
 */
const EXIT = 200;

export function UpdatePrompt({
  onReload,
  onDismissed,
}: {
  onReload: () => void;
  onDismissed: () => void;
}) {
  const [leaving, setLeaving] = useState(false);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(onDismissed, EXIT);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute',
        left: 12,
        right: 12,
        // Clear of the tab bar, which no overlay may cover.
        bottom: 78,
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        background: 'var(--surface-2)',
        border: '1px solid var(--border-strong)',
        borderRadius: 14,
        padding: '11px 12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        animation: leaving
          ? `fadeOut ${EXIT - 20}ms ease forwards`
          : 'toastUp 260ms cubic-bezier(0.2,0,0,1)',
        // Nothing underneath should be unreachable while it plays out.
        pointerEvents: leaving ? 'none' : undefined,
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
        <IconRefresh size={16} />
      </span>

      <p
        style={{
          flex: 1,
          margin: 0,
          fontSize: 12.5,
          lineHeight: 1.35,
          color: 'var(--text-primary)',
        }}
      >
        A new version of Ludos is ready.
      </p>

      <button
        type="button"
        className="u-accent"
        onClick={onReload}
        style={{
          flex: 'none',
          background: 'var(--accent-500)',
          color: 'var(--on-accent)',
          border: 0,
          borderRadius: 9,
          padding: '8px 12px',
          fontSize: 12.5,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 120ms var(--ease)',
        }}
      >
        Reload
      </button>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Not now"
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
