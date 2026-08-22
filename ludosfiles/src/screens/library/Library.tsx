import { Cover } from '../../components/Cover';
import { IconChevronRight } from '../../components/icons';
import {
  LIB_COLLECTIONS,
  LIB_GAMES,
  LIB_SEGMENTS,
  LIB_SEG_TITLES,
  LIB_STATUS_LABELS,
  libCoverStrip,
} from '../../data/library';
import type { State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';
import { ListDetail } from './ListDetail';

interface LibraryProps {
  state: State;
  actions: LudosActions;
}

/**
 * The Library tab: a shelf of everything tracked, and the user's own lists,
 * behind a segmented control. Both panes live on one 200%-wide track that
 * slides sideways, so switching panes keeps each pane's scroll position.
 */
export function Library({ state, actions }: LibraryProps) {
  const isLists = state.libView === 'lists';
  const games = state.libSeg === 'all' ? LIB_GAMES : LIB_GAMES.filter((g) => g.status === state.libSeg);
  const countOf = (key: string) =>
    key === 'all' ? LIB_GAMES.length : LIB_GAMES.filter((g) => g.status === key).length;

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
      <header
        style={{
          flex: 'none',
          height: 54,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 18px',
          borderBottom: '1px solid var(--surface-1)',
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Your library</span>
        <span style={{ flex: 1 }} />
      </header>

      <div
        style={{
          flex: 'none',
          position: 'relative',
          display: 'flex',
          padding: '0 18px',
          borderBottom: '1px solid var(--surface-1)',
        }}
      >
        <button
          type="button"
          onClick={() => actions.setLibView('library')}
          aria-current={!isLists ? 'true' : undefined}
          style={{ ...segTab, color: isLists ? 'var(--text-muted)' : 'var(--text-primary)' }}
        >
          Library
        </button>
        <button
          type="button"
          onClick={() => actions.setLibView('lists')}
          aria-current={isLists ? 'true' : undefined}
          style={{ ...segTab, color: isLists ? 'var(--text-primary)' : 'var(--text-muted)' }}
        >
          Lists
        </button>
        <div
          style={{ position: 'absolute', left: 18, right: 18, bottom: -1, height: 2, overflow: 'hidden' }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: isLists ? '50%' : '0%',
              width: '50%',
              height: '100%',
              background: 'var(--accent-500)',
              transition: 'left 260ms cubic-bezier(0.2,0,0,1)',
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0 }}>
        <div
          style={{
            display: 'flex',
            width: '200%',
            height: '100%',
            transform: isLists ? 'translateX(-50%)' : 'translateX(0)',
            transition: 'transform 340ms cubic-bezier(0.2,0,0,1)',
          }}
        >
          {/* ── Library pane ───────────────────────────────── */}
          <div className="scroll-y" style={{ width: '50%', height: '100%' }}>
            <div className="scroll-x" style={{ display: 'flex', gap: 7, padding: '14px 14px 12px' }}>
              {LIB_SEGMENTS.map((seg) => {
                const active = seg.key === state.libSeg;
                return (
                  <button
                    key={seg.key}
                    type="button"
                    onClick={() => actions.setLibSeg(seg.key)}
                    aria-pressed={active}
                    style={{
                      flex: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      padding: '8px 14px',
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      background: active ? 'var(--text-primary)' : 'transparent',
                      color: active ? 'var(--surface-0)' : 'var(--text-secondary)',
                      border: `1px solid ${active ? 'var(--text-primary)' : 'var(--border)'}`,
                      transition: 'background 140ms, color 140ms, border-color 140ms',
                    }}
                  >
                    {seg.label}
                    <span style={{ fontSize: 11, opacity: 0.62 }}>{countOf(seg.key)}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 12px' }}>
              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>
                {LIB_SEG_TITLES[state.libSeg]}
              </span>
              <span style={{ flex: 1 }} />
            </div>

            <div
              key={state.libSeg}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 12,
                padding: '0 18px 4px',
                animation: 'cardFadeIn 220ms cubic-bezier(0.2,0,0,1)',
              }}
            >
              {games.map((game) => (
                <button
                  key={game.k}
                  type="button"
                  className="u-lift"
                  onClick={actions.demo}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0,
                    textAlign: 'left',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ position: 'relative', display: 'block', width: '100%' }}>
                    <Cover
                      id={`cv-lib-${game.k}`}
                      alt={game.n}
                      style={{ width: '100%', height: 'auto', aspectRatio: '600 / 900', background: 'var(--border)' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        fontSize: 12,
                        letterSpacing: '0.02em',
                        padding: '4px 8px',
                        borderRadius: 999,
                        background: 'rgba(18,11,13,0.66)',
                        color: '#E8DCDD',
                        border: '1px solid rgba(240,233,233,0.16)',
                        backdropFilter: 'blur(1px)',
                        display: 'block',
                      }}
                    >
                      {LIB_STATUS_LABELS[game.status]}
                    </span>
                  </span>
                  <span style={{ display: 'block', padding: '9px 11px 11px', width: '100%' }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 14,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {game.n}
                    </span>
                    <span
                      style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 4px' }}
                    >
                      {game.p}
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 6,
                        minHeight: 18,
                      }}
                    >
                      <MetaLine game={game} />
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <div style={{ height: 18 }} />
          </div>

          {/* ── Lists pane ─────────────────────────────────── */}
          <div className="scroll-y" style={{ width: '50%', height: '100%' }}>
            <div style={{ padding: '16px 14px 4px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'flex-end',
                  marginBottom: 14,
                }}
              >
                <button
                  type="button"
                  className="u-link"
                  onClick={actions.demo}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'var(--accent-300)',
                    cursor: 'pointer',
                  }}
                >
                  + Create new List
                </button>
              </div>

              {LIB_COLLECTIONS.map((collection) => (
                <button
                  key={collection.name}
                  type="button"
                  className="u-border-hover"
                  onClick={
                    collection.list ? () => actions.openLibList(collection.list!) : actions.demo
                  }
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    textAlign: 'left',
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    padding: 12,
                    marginBottom: 12,
                    cursor: 'pointer',
                    transition: 'border-color 160ms',
                  }}
                >
                  <span
                    className="scroll-x"
                    style={{
                      display: 'flex',
                      overflowY: 'hidden',
                      touchAction: 'pan-x',
                      overscrollBehavior: 'contain',
                      margin: '0 -12px 11px 0',
                      borderRadius: '7px 0 0 7px',
                      width: 'calc(100% + 12px)',
                    }}
                  >
                    {libCoverStrip(collection.key, collection.count).map((slotId) => (
                      <Cover
                        key={slotId}
                        id={slotId}
                        style={{ flex: 'none', width: 58, height: 87, background: 'var(--border)' }}
                      />
                    ))}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: 'block',
                          fontSize: 16,
                          fontWeight: 600,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {collection.name}
                      </span>
                      <span
                        style={{
                          display: 'block',
                          fontSize: 12,
                          color: 'var(--text-muted)',
                          marginTop: 2,
                        }}
                      >
                        {collection.count} games · updated {collection.updated}
                      </span>
                    </span>
                    <span style={{ flex: 'none', color: '#8A787C', display: 'inline-flex' }}>
                      <IconChevronRight />
                    </span>
                  </span>
                </button>
              ))}

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
                  background: 'transparent',
                  color: 'var(--accent-300)',
                  border: '1px dashed var(--border-accent)',
                  borderRadius: 14,
                  padding: 14,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + New list
              </button>
            </div>
            <div style={{ height: 18 }} />
          </div>
        </div>
      </div>

      {/* The list editor is a full-screen sheet over the tab bar too, so it
          mounts in App.tsx rather than inside this box. */}
      {state.libDetailOpen && <ListDetail state={state} actions={actions} />}
    </div>
  );
}

/** The status-dependent line under a shelf card's platform. */
function MetaLine({ game }: { game: (typeof LIB_GAMES)[number] }) {
  if (game.status === 'want') {
    return <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{game.time}</span>;
  }
  if (game.status === 'playing') {
    return <span style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>{game.played} played</span>;
  }
  if (game.status === 'finished') {
    return <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{game.finishedDate}</span>;
  }
  return <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{game.played} played</span>;
}

const segTab = {
  flex: 1,
  background: 'none',
  border: 'none',
  padding: '13px 0',
  fontSize: 14,
  fontWeight: 600,
  textAlign: 'center',
  cursor: 'pointer',
} as const;
