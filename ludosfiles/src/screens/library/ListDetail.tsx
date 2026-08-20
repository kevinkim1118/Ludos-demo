import { Cover } from '../../components/Cover';
import { IconBack, IconPencil, IconPlus, IconSearchSmall } from '../../components/icons';
import { libOrderFor } from '../../data/library';
import { activeList, listCopy, listIsRanked } from '../../state/reducer';
import type { State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';

/**
 * One list's contents, sliding in over the Library from the right. It stops
 * short of the tab bar rather than covering it — the list is a place inside
 * the tab, not a screen of its own.
 */
export function ListDetail({ state, actions }: { state: State; actions: LudosActions }) {
  const { name, list } = activeList(state);
  const copy = listCopy(state, name, list);
  const ranked = listIsRanked(state, name, list);
  const order = libOrderFor(list, state.libOrder[name]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: state.libDetailIn ? '0%' : '100%',
        width: '100%',
        bottom: 0,
        zIndex: 16,
        background: 'var(--surface-0)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'left 300ms cubic-bezier(0.2,0,0,1)',
      }}
    >
      <div
        style={{
          flex: 'none',
          height: 54,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 14px 0 12px',
          borderBottom: '1px solid var(--surface-1)',
        }}
      >
        <button
          type="button"
          className="u-quiet"
          onClick={actions.closeLibList}
          aria-label="Back to your library"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <IconBack />
        </button>
        <span style={{ flex: 1 }} />
        <button
          type="button"
          className="u-link"
          onClick={actions.demo}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: 16,
            fontWeight: 500,
            cursor: 'pointer',
            padding: '6px 4px',
          }}
        >
          Search in list
          <IconSearchSmall />
        </button>
      </div>

      <div className="scroll-y" style={{ flex: 1, minHeight: 0 }}>
        <div style={{ padding: '16px 14px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: '-0.015em',
                  lineHeight: 1.1,
                }}
              >
                {copy.title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  lineHeight: 1.45,
                  marginTop: 7,
                }}
              >
                {copy.desc}
              </div>
            </div>
            <button
              type="button"
              className="u-quiet"
              onClick={actions.openLibEdit}
              aria-label="Edit list"
              style={{
                width: 38,
                height: 38,
                flex: 'none',
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginTop: 3,
              }}
            >
              <IconPencil />
            </button>
          </div>

          {/* Rows carry their saved position as CSS `order`, so reordering a
              list never remounts a row or reloads its cover. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {list.games.map((game, index) => {
              const position = order.indexOf(index);
              return (
                <button
                  key={game.k}
                  type="button"
                  onClick={actions.demo}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    order: position,
                  }}
                >
                  {ranked && (
                    <span
                      style={{
                        flex: 'none',
                        width: 20,
                        paddingTop: 2,
                        fontSize: 15,
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textAlign: 'right',
                      }}
                    >
                      {position + 1}.
                    </span>
                  )}
                  <Cover
                    id={`cv-list-${game.k}`}
                    alt={game.name}
                    style={{
                      width: 84,
                      height: 84,
                      flex: 'none',
                      background: 'var(--border)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: 8,
                      boxSizing: 'border-box',
                    }}
                  />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 15,
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {game.name}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 10.5,
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        color: 'var(--text-muted)',
                        margin: '4px 0 6px',
                      }}
                    >
                      {game.platform}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.42,
                        fontStyle: 'italic',
                      }}
                    >
                      “{game.note}”
                    </span>
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              className="u-dashed"
              onClick={actions.demo}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                height: 84,
                boxSizing: 'border-box',
                background: 'transparent',
                border: '1px dashed var(--border-accent)',
                borderRadius: 11,
                color: 'var(--accent-300)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                order: 999,
              }}
            >
              <IconPlus size={18} strokeWidth={1.8} />
              Add a game
            </button>
          </div>
        </div>
        <div style={{ height: 18 }} />
      </div>
    </div>
  );
}
