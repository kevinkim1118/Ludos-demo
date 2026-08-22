import { Cover } from '../../components/Cover';
import { IconSearch } from '../../components/icons';
import { normalize, type PlayedGame } from '../../data/games';
import { SEARCH_BROWSE, searchGames } from '../../data/search';
import type { State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';

interface SearchProps {
  state: State;
  actions: LudosActions;
}

/**
 * The Search tab. Empty query: three browse rows of plain titles, each of
 * which fills the field with its own name — so tapping one lands on a grid of
 * exactly itself. Anything typed filters the catalogue into that grid.
 *
 * "Has a query" is asked of the *normalized* query, not the raw one: "!!!"
 * normalizes to nothing and can't match a title, so it belongs on the browse
 * rows rather than in a "No games found" that would blame the user for typing.
 */
export function Search({ state, actions }: SearchProps) {
  const hasQuery = normalize(state.srQuery).length > 0;
  const results = searchGames(state.srQuery);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 0,
      }}
    >
      <div style={{ flex: 'none', padding: '6px 18px 14px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: `1.5px solid ${
              state.srFocused ? 'var(--accent-500)' : 'var(--border)'
            }`,
            padding: '8px 2px',
            transition: 'border-color 160ms',
          }}
        >
          <input
            value={state.srQuery}
            onChange={(e) => actions.setSrQuery(e.target.value)}
            onFocus={() => actions.setSrFocus(true)}
            onBlur={() => actions.setSrFocus(false)}
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
              fontSize: 19,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              padding: 0,
            }}
          />
          {hasQuery && (
            <button
              type="button"
              className="u-clear"
              onClick={() => actions.setSrQuery('')}
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

      <div className="scroll-y" style={{ flex: 1, minHeight: 0, padding: '0 18px' }}>
        {!hasQuery && (
          <div>
            {SEARCH_BROWSE.map((section) => (
              <div key={section.title} style={{ marginBottom: 26 }}>
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: 600,
                    letterSpacing: '-0.015em',
                    marginBottom: 12,
                  }}
                >
                  {section.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {section.games.map((game) => (
                    <button
                      key={game.k}
                      type="button"
                      className="u-fade"
                      onClick={() => actions.setSrQuery(game.n)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        padding: '9px 0',
                        cursor: 'pointer',
                        // A literal in the prototype, not one of the border
                        // tokens — ported as written.
                        borderBottom: '1px solid #2C2124',
                      }}
                    >
                      <span
                        style={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: 16,
                          fontWeight: 400,
                          color: 'var(--text-muted)',
                        }}
                      >
                        {game.n}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ height: 12 }} />
          </div>
        )}

        {hasQuery && (
          <div style={{ paddingTop: 4 }}>
            {results.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {results.map((game) => (
                  <ResultCard
                    key={game.k}
                    game={game}
                    added={!!state.itemStatus[game.n]}
                    onAdd={() =>
                      actions.openSheet({
                        name: game.n,
                        meta: game.p,
                        slotId: `cv-search-${game.k}`,
                      })
                    }
                  />
                ))}
              </div>
            )}

            {results.length === 0 && <NoResults query={state.srQuery} />}
          </div>
        )}

        <div style={{ height: 14 }} />
      </div>
    </div>
  );
}

/**
 * One hit. A plain div, not a button — the add control is a real button nested
 * inside it, and the card itself goes nowhere on tap.
 */
function ResultCard({
  game,
  added,
  onAdd,
}: {
  game: PlayedGame;
  added: boolean;
  onAdd: () => void;
}) {
  return (
    <div
      className="u-lift"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
        animation: 'cardFadeIn 220ms cubic-bezier(0.2,0,0,1)',
      }}
    >
      <div style={{ position: 'relative' }}>
        <Cover
          id={`cv-search-${game.k}`}
          alt={game.n}
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: '600 / 900',
            background: 'var(--border)',
          }}
        />
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Add ${game.n}`}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            padding: 0,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          {/* Two states, not four: the prototype shows the same ✓ whether the
              game is backlogged, playing, finished or DNF. The rails' badge
              carries a glyph per status — this one deliberately doesn't. */}
          {added ? (
            <span
              style={{
                display: 'flex',
                width: 26,
                height: 26,
                borderRadius: 8,
                background: 'var(--accent-500)',
                color: 'var(--on-accent)',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 600,
                animation: 'popIn 240ms cubic-bezier(0.2,0,0,1)',
              }}
            >
              ✓
            </span>
          ) : (
            <span
              className="u-add-badge"
              style={{
                display: 'flex',
                width: 26,
                height: 26,
                borderRadius: 8,
                background: 'rgba(18,11,13,0.62)',
                border: '1px solid rgba(240,233,233,0.16)',
                color: 'var(--text-primary)',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                lineHeight: 1,
                backdropFilter: 'blur(4px)',
              }}
            >
              +
            </span>
          )}
        </button>
      </div>
      <div style={{ padding: '8px 9px 10px' }}>
        <div
          style={{ fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.18 }}
        >
          {game.n}
        </div>
        <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 3 }}>{game.p}</div>
      </div>
    </div>
  );
}

/** Quotes the query as typed, not as matched — the normalized form is ours. */
function NoResults({ query }: { query: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '70px 24px 40px',
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
          color: 'var(--text-muted)',
          marginBottom: 16,
        }}
      >
        <IconSearch strokeWidth={1.6} />
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
        Nothing matches “{query}”. Try a different title or spelling.
      </div>
    </div>
  );
}
