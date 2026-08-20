import { Cover } from '../../components/Cover';
import { IconChevronDown, IconPlay, IconRefresh } from '../../components/icons';
import { CONFIG } from '../../config';
import { TIME_FIT } from '../../data/content';
import { activePickTarget } from '../../state/reducer';
import type { State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';

const diamond = {
  background: 'var(--accent-500)',
  transform: 'rotate(45deg)',
  borderRadius: 1,
  flex: 'none',
} as const;

/**
 * The card at the top of Discover. Before anything is in flight it offers a
 * backlog pick with an "Another" re-roll; once a game is playing it becomes
 * "Currently playing", and the same button opens the status sheet instead.
 */
export function PickCard({ state, actions }: { state: State; actions: LudosActions }) {
  const isPlaying = !!state.upNext || !!state.playingItem;

  // Shared with the status sheet, which opens on whatever this card is showing.
  const { name, meta, slotId } = activePickTarget(state);

  const timeFit = TIME_FIT[state.time];
  const reasons = [
    { lead: 'Strong match', tail: ` for ${CONFIG.archetype}` },
    { lead: timeFit.lead, tail: timeFit.tail },
    { lead: '2 friends', tail: ' really liked it' },
  ];

  return (
    <div
      style={{
        animation: state.pickIntro
          ? 'cardFadeIn 420ms cubic-bezier(0.2,0,0,1) 150ms both'
          : 'none',
        margin: '4px 14px 22px',
        background: 'var(--surface-1)',
        border: '1.5px solid var(--border-accent)',
        borderRadius: 16,
        padding: 16,
        boxShadow: '0 8px 26px rgba(0,0,0,0.32)',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 14,
          opacity: state.pickFading ? 0 : 1,
          transition: 'opacity 170ms ease',
        }}
      >
        <Cover id={slotId} style={{ width: 96, height: 128, flex: 'none', borderRadius: 10 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {!isPlaying && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>
              From your Backlog
            </div>
          )}
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '-0.015em',
              lineHeight: 1.06,
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', margin: '5px 0 11px' }}>
            {meta}
          </div>
          {reasons.map((r) => (
            <div
              key={r.lead}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}
            >
              <span style={{ ...diamond, width: 8, height: 8, marginTop: 4 }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <span style={{ color: 'var(--accent-300)', fontWeight: 600 }}>{r.lead}</span>
                {r.tail}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!isPlaying && (
        <div style={{ display: 'flex', gap: 9, marginTop: 15 }}>
          <button
            type="button"
            className="u-accent"
            onClick={actions.startPlayingPick}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'var(--accent-500)',
              color: 'var(--on-accent)',
              border: 'none',
              borderRadius: 10,
              padding: 12,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 120ms var(--ease)',
            }}
          >
            <IconPlay />
            Start playing
          </button>
          <button
            type="button"
            className="u-quiet"
            onClick={actions.cyclePick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '12px 15px',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <IconRefresh />
            Another
          </button>
        </div>
      )}

      {isPlaying && (
        <button
          type="button"
          className="u-accent"
          onClick={actions.openStatusSheet}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            width: '100%',
            marginTop: 15,
            background: 'var(--accent-500)',
            color: 'var(--on-accent)',
            border: 'none',
            borderRadius: 10,
            padding: 13,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 120ms var(--ease)',
          }}
        >
          Update Status
          <IconChevronDown />
        </button>
      )}
    </div>
  );
}
