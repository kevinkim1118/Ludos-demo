import type { ReactNode } from 'react';
import { Cover } from '../../components/Cover';
import {
  IconArrowRight,
  IconBack,
  IconCheck,
  IconPlay,
  IconPlus,
  IconRefresh,
  IconSkip,
  IconUndo,
} from '../../components/icons';
import { WIN_REASONS } from '../../data/content';
import { GAMES, INTENT_LABELS, INTENT_OPTIONS, type Game } from '../../data/games';
import { poolFor } from '../../state/reducer';
import type { Side, State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';

const screen = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  animation: 'fadeIn 260ms ease',
} as const;

function BackBar({ onBack }: { onBack: () => void }) {
  return (
    <div
      style={{
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '4px 16px 6px',
      }}
    >
      <button
        type="button"
        className="u-quiet"
        onClick={onBack}
        title="Back"
        aria-label="Back to Discover"
        style={{
          width: 34,
          height: 34,
          flex: 'none',
          borderRadius: 10,
          border: '1px solid var(--border)',
          background: 'transparent',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <IconBack />
      </button>
      <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>
        Back to Discover
      </span>
    </div>
  );
}

/** The carried-mood chip; tapping it returns to the intent screen. */
function IntentChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div style={{ flex: 'none', display: 'flex', justifyContent: 'center', padding: '14px 16px 0' }}>
      <button
        type="button"
        className="u-chip"
        onClick={onClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          border: '1px solid var(--border-strong)',
          borderRadius: 999,
          padding: '6px 13px',
          fontSize: 12,
          color: 'var(--text-secondary)',
          background: '#2B2023',
          cursor: 'pointer',
          transition: 'border-color 120ms, background 120ms',
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            background: 'var(--accent-500)',
            transform: 'rotate(45deg)',
            borderRadius: 1,
          }}
        />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{label}</span>
        <span style={{ color: '#8A787C', fontSize: 9 }}>▾</span>
      </button>
    </div>
  );
}

function VersusBadge() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 42,
        height: 42,
        borderRadius: '50%',
        background: 'var(--surface-2)',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.04em',
        zIndex: 2,
        border: '1px solid var(--border-strong)',
        boxShadow: '0 0 0 6px var(--surface-0)',
      }}
    >
      OR
    </div>
  );
}

const duelCard = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  background: 'var(--surface-1)',
  borderRadius: 16,
  padding: '16px 8px 18px',
} as const;

function DuelCover({ game }: { game: Game | null }) {
  return (
    <Cover
      id={game ? `cv-h2h-${game.k}` : 'cv-h2h-x'}
      fallback={game?.name}
      style={{
        width: 92,
        aspectRatio: '2/3',
        background: 'var(--border)',
        border: '1px solid var(--border-strong)',
        borderRadius: 9,
        marginBottom: 13,
      }}
    />
  );
}

function DuelSide({
  game,
  side,
  picking,
  onPick,
}: {
  game: Game | null;
  side: Side;
  picking: Side | null;
  onPick: () => void;
}) {
  const isPicked = picking === side;
  const isLoser = !!picking && picking !== side;

  return (
    <button
      type="button"
      onClick={onPick}
      style={{
        ...duelCard,
        border: `1.5px solid ${isPicked ? 'var(--accent-500)' : 'var(--border)'}`,
        cursor: 'pointer',
        boxShadow: isPicked
          ? '0 0 0 3px rgba(226,62,78,0.28), 0 12px 30px rgba(0,0,0,0.4)'
          : 'none',
        transform: isPicked ? 'scale(1.035)' : 'scale(1)',
        opacity: isLoser ? 0.42 : 1,
        transition:
          'transform 200ms cubic-bezier(0.2,0,0,1), border-color 180ms, box-shadow 200ms, opacity 180ms',
      }}
    >
      <DuelCover game={game} />
      <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.15, color: 'var(--text-primary)' }}>
        {game?.name ?? ''}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>
        {game?.genre ?? ''}
      </div>
      <div style={{ fontSize: 11, color: '#8A787C', marginTop: 3 }}>{game?.hrs ?? ''}</div>
    </button>
  );
}

export function HeadToHead({ state, actions }: { state: State; actions: LudosActions }) {
  const intentLabel = INTENT_LABELS[state.intent] ?? 'Fast & fun';

  if (state.h2hScreen === 'intent') {
    const poolSize = poolFor(state, state.intent).length;

    return (
      <Frame>
        <div style={screen}>
          <div
            style={{
              flex: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '4px 16px 8px',
            }}
          >
            <BackBarInner onBack={actions.h2hBack} />
          </div>

          <div style={{ padding: '16px 22px 4px' }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--accent-300)',
                marginBottom: 10,
              }}
            >
              Head-to-head
            </div>
            <div style={{ fontSize: 25, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.14 }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                Before we compare —
              </span>{' '}
              what are you in the mood for?
            </div>
          </div>

          <div
            style={{
              padding: '20px 16px 4px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {INTENT_OPTIONS.map((o) => {
              const selected = state.intent === o.key;
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => actions.setIntent(o.key)}
                  aria-pressed={selected}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 13,
                    textAlign: 'left',
                    background: selected ? '#2B2023' : 'transparent',
                    border: `1.5px solid ${selected ? 'var(--accent-500)' : 'var(--border)'}`,
                    borderRadius: 13,
                    padding: 14,
                    cursor: 'pointer',
                    transition: 'border-color 160ms, background 160ms',
                  }}
                >
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 15,
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {o.title}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 11.5,
                        color: 'var(--text-muted)',
                        marginTop: 2,
                      }}
                    >
                      {o.sub}
                    </span>
                  </span>
                  {selected ? (
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        flex: 'none',
                        borderRadius: '50%',
                        background: 'var(--accent-500)',
                        color: 'var(--on-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'popIn 240ms cubic-bezier(0.2,0,0,1)',
                      }}
                    >
                      <IconCheck size={13} strokeWidth={2.4} />
                    </span>
                  ) : (
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        flex: 'none',
                        borderRadius: '50%',
                        border: '1.5px solid var(--border-strong)',
                        background: 'transparent',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ flex: 'none', padding: '12px 16px 20px' }}>
            <div
              style={{
                fontSize: 11.5,
                color: '#8A787C',
                textAlign: 'center',
                marginBottom: 12,
                lineHeight: 1.45,
              }}
            >
              We'll pit your Backlog games against each other,{' '}
              {poolSize >= 2 ? `${poolSize} fit this mood.` : 'best-match first.'}
            </div>
            <button
              type="button"
              className="u-accent"
              onClick={actions.startComparing}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
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
              Start comparing
              <IconArrowRight />
            </button>
          </div>
        </div>
      </Frame>
    );
  }

  if (state.h2hScreen === 'duel') {
    return (
      <Frame>
        <div style={screen}>
          <BackBar onBack={actions.h2hBack} />

          <div
            style={{
              flex: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              padding: '6px 16px 0',
            }}
            aria-hidden="true"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                style={{
                  width: 26,
                  height: 3,
                  borderRadius: 2,
                  background: i < state.compareCount ? 'var(--accent-500)' : 'var(--border)',
                  transition: 'background 200ms',
                }}
              />
            ))}
          </div>

          <IntentChip label={intentLabel} onClick={actions.changeIntent} />

          <div style={{ flex: 1 }} />
          <div
            style={{
              flex: 'none',
              textAlign: 'center',
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: '-0.015em',
              padding: '4px 20px 22px',
            }}
          >
            Which would you rather play?
          </div>

          <div style={{ flex: 'none', padding: '0 18px', position: 'relative' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 34,
                position: 'relative',
              }}
            >
              <DuelSide
                game={state.champion}
                side="champ"
                picking={state.picking}
                onPick={() => actions.pickSide('champ')}
              />
              <DuelSide
                game={state.challenger}
                side="chall"
                picking={state.picking}
                onPick={() => actions.pickSide('chall')}
              />
              <VersusBadge />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '22px 4px 4px',
              }}
            >
              <button
                type="button"
                onClick={actions.undo}
                disabled={!state.history.length}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  background: 'none',
                  border: 'none',
                  padding: '6px 4px',
                  cursor: state.history.length ? 'pointer' : 'default',
                  color: state.history.length ? 'var(--text-secondary)' : '#5A484C',
                }}
              >
                <IconUndo />
                Undo
              </button>
              <button
                type="button"
                className="u-skip"
                onClick={actions.skip}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  background: 'none',
                  border: 'none',
                  padding: '6px 4px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              >
                Skip this matchup
                <IconSkip />
              </button>
            </div>
          </div>
          <div style={{ flex: 1 }} />
        </div>
      </Frame>
    );
  }

  if (state.h2hScreen === 'outcome') {
    const winner = state.winner;
    const reason = WIN_REASONS[state.winReason] ?? WIN_REASONS.streak;

    return (
      <Frame>
        <div style={{ ...screen, animation: 'fadeIn 300ms ease' }}>
          <BackBar onBack={actions.h2hBack} />

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '12px 26px',
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--accent-300)',
                marginBottom: 20,
                animation: 'fadeIn 400ms ease',
              }}
            >
              Your pick to play next
            </div>
            <div style={{ animation: 'riseIn 460ms cubic-bezier(0.2,0,0,1)' }}>
              <Cover
                id={winner ? `cv-h2h-${winner.k}` : 'cv-h2h-x'}
                fallback={winner?.name}
                style={{
                  width: 160,
                  aspectRatio: '2/3',
                  margin: '0 auto 20px',
                  background: 'var(--border)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 12,
                  boxShadow: '0 18px 44px rgba(0,0,0,0.5)',
                }}
              />
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 600,
                letterSpacing: '-0.025em',
                lineHeight: 1.05,
                animation: 'riseIn 500ms cubic-bezier(0.2,0,0,1)',
              }}
            >
              {winner?.name ?? ''}
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                marginTop: 7,
                marginBottom: 20,
              }}
            >
              {winner ? `${winner.genre} · ${winner.plat} · ${winner.hrs}` : ''}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12.5,
                color: 'var(--text-secondary)',
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: 999,
                padding: '9px 15px',
                animation: 'popIn 420ms cubic-bezier(0.2,0,0,1)',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  background: 'var(--accent-500)',
                  transform: 'rotate(45deg)',
                  borderRadius: 1,
                  flex: 'none',
                }}
              />
              <span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{reason.lead}</span>
                {reason.tail}
              </span>
            </div>
          </div>

          <div
            style={{
              flex: 'none',
              padding: '8px 16px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: 9,
            }}
          >
            <button
              type="button"
              className="u-accent"
              onClick={actions.commitPlaying}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
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
              <IconPlay size={16} />
              <span>Mark {winner?.name ?? ''} as playing</span>
            </button>
            <div style={{ display: 'flex', gap: 9 }}>
              <button
                type="button"
                className="u-quiet"
                onClick={actions.keepComparing}
                style={{ ...outcomeSecondary, gap: 7 }}
              >
                <IconRefresh />
                Keep comparing
              </button>
              <button type="button" className="u-quiet" onClick={actions.h2hBack} style={outcomeSecondary}>
                Back to Discover
              </button>
            </div>
          </div>
        </div>
      </Frame>
    );
  }

  // Cold start — fewer than two backlog games fit the chosen mood.
  const pool = poolFor(state, state.intent);
  const csGame = pool[0] ?? GAMES.stray;

  return (
    <Frame>
      <div style={screen}>
        <BackBar onBack={actions.h2hBack} />
        <IntentChip label={intentLabel} onClick={actions.changeIntent} />

        <div style={{ flex: 1 }} />
        <div style={{ flex: 'none', padding: '0 18px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 34,
              position: 'relative',
            }}
          >
            <div style={{ ...duelCard, border: '1.5px solid var(--border)' }}>
              <DuelCover game={csGame} />
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  lineHeight: 1.15,
                  color: 'var(--text-primary)',
                }}
              >
                {csGame.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>
                {csGame.genre}
              </div>
              <div style={{ fontSize: 11, color: '#8A787C', marginTop: 3 }}>{csGame.hrs}</div>
            </div>

            <button
              type="button"
              className="u-cold"
              onClick={actions.demo}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                background: 'transparent',
                border: '1.5px dashed var(--border-strong)',
                borderRadius: 16,
                padding: '16px 8px',
                cursor: 'pointer',
                transition: 'background 120ms var(--ease), border-color 120ms',
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '1.5px dashed var(--border-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-300)',
                  marginBottom: 11,
                }}
              >
                <IconPlus strokeWidth={1.8} />
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Add a game</span>
            </button>

            <VersusBadge />
          </div>

          <div
            style={{
              textAlign: 'center',
              fontSize: 12.5,
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              margin: '22px 6px 0',
            }}
          >
            Only one Backlog game fits{' '}
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{intentLabel}</span>{' '}
            right now. Try a different mood, or add more games to compare.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 20 }}>
            <button
              type="button"
              className="u-accent"
              onClick={actions.changeIntent}
              style={{
                width: '100%',
                background: 'var(--accent-500)',
                color: 'var(--on-accent)',
                border: 'none',
                borderRadius: 12,
                padding: 14,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 120ms var(--ease)',
              }}
            >
              Change your mood
            </button>
            <button
              type="button"
              className="u-quiet"
              onClick={actions.h2hBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                width: '100%',
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 14,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Browse Discover <span>→</span>
            </button>
          </div>
        </div>
        <div style={{ flex: 1 }} />
      </div>
    </Frame>
  );
}

/** Shared clipping wrapper for every head-to-head screen. */
function Frame({ children }: { children: ReactNode }) {
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
      {children}
    </div>
  );
}

/** The intent screen's back control sits in a slightly taller bar. */
function BackBarInner({ onBack }: { onBack: () => void }) {
  return (
    <>
      <button
        type="button"
        className="u-quiet"
        onClick={onBack}
        title="Back"
        aria-label="Back to Discover"
        style={{
          width: 34,
          height: 34,
          flex: 'none',
          borderRadius: 10,
          border: '1px solid var(--border)',
          background: 'transparent',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <IconBack />
      </button>
      <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>
        Back to Discover
      </span>
    </>
  );
}

const outcomeSecondary = {
  flex: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: 13,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
} as const;
