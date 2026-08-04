import { useMemo } from 'react';
import { Cover } from '../../components/Cover';
import { IconSearch } from '../../components/icons';
import { PLAYED_BLANKS, PLAYED_DB, PLAYED_MINIMUM } from '../../data/games';
import type { LudosActions } from '../../state/useLudos';
import type { State } from '../../state/types';

interface CardProps {
  slotId: string;
  name: string;
  selected: boolean;
  onToggle: () => void;
}

/** A tappable cover. The whole card toggles; the badge is just the indicator. */
function GameCard({ slotId, name, selected, onToggle }: CardProps) {
  return (
    <button
      type="button"
      className="u-lift-sm"
      onClick={onToggle}
      aria-pressed={selected}
      title={selected ? `Remove ${name}` : `I played ${name}`}
      style={{
        // Grid rows stretch every card to the tallest title in the row. A
        // button centres its content vertically, which would push short-titled
        // cards' art away from the top edge — flex column stacks from the top
        // instead, so the slack falls below the title.
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        background: 'var(--surface-2)',
        border: `1.5px solid ${selected ? 'var(--accent-500)' : 'var(--border)'}`,
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        padding: 0,
        textAlign: 'left',
        font: 'inherit',
        color: 'inherit',
      }}
    >
      <div style={{ position: 'relative' }}>
        <Cover
          id={slotId}
          style={{ width: '100%', aspectRatio: '600 / 900', background: 'var(--border)' }}
        />
        <div style={{ position: 'absolute', top: 6, right: 6, pointerEvents: 'none' }}>
          {selected ? (
            <span
              style={{
                display: 'flex',
                width: 28,
                height: 28,
                borderRadius: 9,
                background: 'var(--accent-500)',
                color: 'var(--on-accent)',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: 600,
                animation: 'popIn 240ms cubic-bezier(0.2,0,0,1)',
              }}
            >
              ✓
            </span>
          ) : (
            <span
              style={{
                display: 'flex',
                width: 28,
                height: 28,
                borderRadius: 9,
                background: 'rgba(18,11,13,0.62)',
                border: '1px solid rgba(240,233,233,0.16)',
                color: 'var(--text-primary)',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 17,
                lineHeight: 1,
                backdropFilter: 'blur(4px)',
              }}
            >
              +
            </span>
          )}
        </div>
      </div>
      <div style={{ padding: '8px 9px 10px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.18 }}>
          {name}
        </div>
      </div>
    </button>
  );
}

export function PlayedGames({ state, actions }: { state: State; actions: LudosActions }) {
  const query = state.playedQuery.trim().toLowerCase();
  const pickedCount = Object.keys(state.played).length;
  const remaining = Math.max(0, PLAYED_MINIMUM - pickedCount);
  const canContinue = pickedCount >= PLAYED_MINIMUM;

  const results = useMemo(
    () => PLAYED_DB.filter((g) => !query || g.n.toLowerCase().includes(query)),
    [query],
  );

  // The hand-authored cards aren't in the searchable set, so they step aside
  // as soon as the user types.
  const showBlanks = !query;
  const noResults = results.length === 0 && !!query;

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 300ms cubic-bezier(0.2,0,0,1)',
      }}
    >
      <div style={{ flex: 'none', padding: '30px 20px 0' }}>
        <h1
          style={{
            fontSize: 29,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.14,
            margin: '0 0 10px',
          }}
        >
          What games have you played?
        </h1>
        <p
          style={{
            fontSize: 14.5,
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
            margin: '0 0 20px',
            textWrap: 'pretty',
          }}
        >
          We'll use what you selected to recommend games that you'll like. They'll also be added to
          your “Finished” list in your library.
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: `1.5px solid ${
              state.playedFocus ? 'var(--accent-500)' : 'var(--border-strong)'
            }`,
            padding: '8px 2px',
            transition: 'border-color 160ms',
          }}
        >
          <input
            value={state.playedQuery}
            onChange={(e) => actions.setPlayedQuery(e.target.value)}
            onFocus={() => actions.setPlayedFocus(true)}
            onBlur={() => actions.setPlayedFocus(false)}
            placeholder="Search for a game"
            aria-label="Search for a game"
            style={{
              flex: 1,
              minWidth: 0,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              padding: 0,
            }}
          />
          {state.playedQuery.length > 0 && (
            <button
              type="button"
              className="u-quiet"
              onClick={() => actions.setPlayedQuery('')}
              aria-label="Clear search"
              style={{
                width: 24,
                height: 24,
                flex: 'none',
                border: 'none',
                background: 'var(--surface-2)',
                borderRadius: '50%',
                color: 'var(--text-secondary)',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              ✕
            </button>
          )}
          <span style={{ flex: 'none', color: 'var(--text-secondary)', display: 'inline-flex' }}>
            <IconSearch />
          </span>
        </div>
      </div>

      <div className="scroll-y" style={{ flex: 1, minHeight: 0, padding: '16px 20px 0' }}>
        {!noResults && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 11 }}>
            {results.map((g) => (
              <GameCard
                key={g.k}
                slotId={`cv-search-${g.k}`}
                name={g.n}
                selected={!!state.played[g.k]}
                onToggle={() => actions.togglePlayed(g.k)}
              />
            ))}
            {showBlanks &&
              PLAYED_BLANKS.map((b) => (
                <GameCard
                  key={b.id}
                  slotId={b.slotId}
                  name={b.name}
                  selected={!!state.played[b.id]}
                  onToggle={() => actions.togglePlayed(b.id)}
                />
              ))}
          </div>
        )}

        {noResults && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '60px 24px 40px',
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 15,
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8A787C',
                marginBottom: 16,
              }}
            >
              <IconSearch size={24} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 600 }}>No games found</div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                marginTop: 6,
                maxWidth: 240,
              }}
            >
              Nothing matches “{state.playedQuery}”. Try a different title or spelling.
            </div>
          </div>
        )}
        <div style={{ height: 14 }} />
      </div>

      <div
        style={{
          flex: 'none',
          padding: '12px 20px 24px',
          background: 'var(--surface-0)',
          boxShadow: '0 -20px 26px -14px var(--surface-0)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: 14.5,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            marginBottom: 13,
          }}
        >
          {canContinue
            ? `${pickedCount} games ready for your Finished list`
            : `Pick at least ${remaining} more game${remaining === 1 ? '' : 's'} that you've played`}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {canContinue ? (
            <button
              type="button"
              className="u-accent"
              onClick={actions.goReading}
              style={{
                flex: 1,
                background: 'var(--accent-500)',
                color: 'var(--on-accent)',
                border: 'none',
                borderRadius: 12,
                padding: 15,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 120ms var(--ease)',
              }}
            >
              Next
            </button>
          ) : (
            <span
              aria-disabled="true"
              style={{
                flex: 1,
                textAlign: 'center',
                background: '#2E2224',
                color: '#6E5A5F',
                borderRadius: 12,
                padding: 15,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'not-allowed',
              }}
            >
              Next
            </span>
          )}
          <button
            type="button"
            className="u-outline"
            onClick={actions.skipPlayed}
            style={{
              flex: 'none',
              border: '1.5px solid var(--border-strong)',
              color: 'var(--text-primary)',
              borderRadius: 12,
              padding: '15px 20px',
              fontSize: 15,
              fontWeight: 500,
              background: 'transparent',
              cursor: 'pointer',
              transition: 'background 120ms var(--ease)',
            }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
