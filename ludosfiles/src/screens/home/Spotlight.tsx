import { Cover } from '../../components/Cover';
import { CONFIG } from '../../config';
import type { State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';

const SPOTLIGHT = {
  name: 'Elden Ring',
  meta: 'Action RPG · PC / PS5 / Xbox · ~60h',
  slotId: 'cv-spotlight',
};

/** Dismissible "Recommended for you" card above the pick card. */
export function Spotlight({ state, actions }: { state: State; actions: LudosActions }) {
  return (
    <div
      style={{
        overflow: 'hidden',
        margin: '12px 14px 22px',
        background: 'var(--surface-1)',
        border: '1px solid var(--border-strong)',
        borderRadius: 14,
        padding: 16,
        boxShadow: '0 6px 22px rgba(0,0,0,0.28)',
        animation: state.spotDismissing
          ? 'spotCollapse 380ms cubic-bezier(0.4,0,0.2,1) forwards'
          : 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 13,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          Recommended for you
        </span>
        <button
          type="button"
          className="u-quiet"
          onClick={actions.dismissSpotlight}
          title="Dismiss"
          aria-label="Dismiss recommendation"
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>

      <div onClick={actions.demo} style={{ display: 'flex', gap: 14, cursor: 'pointer' }}>
        <Cover
          id={SPOTLIGHT.slotId}
          style={{ width: 104, height: 139, flex: 'none', borderRadius: 10 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>
            Not in your library yet
          </div>
          <div
            style={{
              fontSize: 23,
              fontWeight: 600,
              letterSpacing: '-0.015em',
              lineHeight: 1.08,
            }}
          >
            {SPOTLIGHT.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', margin: '5px 0 13px' }}>
            {SPOTLIGHT.meta}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
            <span
              style={{
                width: 9,
                height: 9,
                background: 'var(--accent-500)',
                transform: 'rotate(45deg)',
                borderRadius: 1,
                flex: 'none',
                marginTop: 5,
              }}
            />
            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <span style={{ color: 'var(--accent-300)', fontWeight: 600 }}>Strong match</span> for{' '}
              <span
                style={{
                  fontFamily: 'var(--font-voice)',
                  fontStyle: 'italic',
                  color: '#E8DCDD',
                  fontSize: 13.5,
                }}
              >
                {CONFIG.archetype}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 9, marginTop: 16 }}>
        <button
          type="button"
          className="u-accent"
          onClick={() => actions.openSheet(SPOTLIGHT)}
          style={{
            flex: 1,
            background: 'var(--accent-500)',
            color: 'var(--on-accent)',
            border: 'none',
            borderRadius: 9,
            padding: 12,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 120ms var(--ease)',
          }}
        >
          + Add to List
        </button>
        <button
          type="button"
          className="u-quiet"
          onClick={actions.demo}
          style={{
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 9,
            padding: '12px 16px',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          View
        </button>
      </div>
    </div>
  );
}
