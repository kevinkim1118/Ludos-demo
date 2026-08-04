import { Cover } from '../../components/Cover';
import { IconBigCheck } from '../../components/icons';
import { CONFIG } from '../../config';
import { TASTE_AXES } from '../../data/content';
import { GAMES, SEED } from '../../data/games';
import { backlogGames } from '../../state/reducer';
import type { State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';

/** Analysis beat between the picker and the result. */
export function Reading() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 40,
        overflow: 'hidden',
        animation: 'fadeIn 320ms cubic-bezier(0.2,0,0,1)',
      }}
    >
      <div
        style={{
          flex: 'none',
          width: 58,
          height: 58,
          borderRadius: '50%',
          border: '3px solid var(--surface-2)',
          borderTopColor: 'var(--accent-500)',
          marginBottom: 24,
          animation: 'spin 900ms linear infinite',
        }}
      />
      <h2
        style={{
          flex: 'none',
          fontSize: 21,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          margin: '0 0 8px',
        }}
      >
        Analyzing what you've played...
      </h2>
      <p
        style={{
          flex: 'none',
          fontSize: 13,
          color: 'var(--text-muted)',
          margin: 0,
          animation: 'orbPulse 1600ms ease-in-out infinite',
        }}
      >
        Evaluating what you've played to find your playstyle
      </p>
    </div>
  );
}

/** Player type, taste axes, and the seeded backlog. */
export function Result({ state, actions }: { state: State; actions: LudosActions }) {
  const seedCount = backlogGames(state).length;

  return (
    <div style={{ animation: 'fadeIn 340ms cubic-bezier(0.2,0,0,1)' }}>
      <div
        style={{
          padding: '26px 22px 22px',
          textAlign: 'center',
          borderBottom: '1px solid var(--surface-1)',
          background: 'var(--surface-0)',
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 12,
          }}
        >
          Your player type
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            marginBottom: 12,
            opacity: 0,
            animation: 'fadeIn 340ms cubic-bezier(0.2,0,0,1) 400ms both',
          }}
        >
          {CONFIG.archetype}
        </div>
        <div
          style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            margin: '0 auto 16px',
            maxWidth: 296,
          }}
        >
          You don't just play games, you finish them. Mastery over novelty, the long haul over the
          quick hit.
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            fontSize: 12,
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 999,
            padding: '6px 14px',
            background: '#2B2023',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              background: 'var(--accent-500)',
              transform: 'rotate(45deg)',
              borderRadius: 1,
            }}
          />
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{CONFIG.rarityPct}</span>{' '}
          of players share your type
        </span>
      </div>

      <div style={{ padding: '24px 22px', borderBottom: '1px solid var(--surface-1)' }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 16,
          }}
        >
          What shapes your taste
        </div>
        {TASTE_AXES.map((a) => (
          <div key={a.left} style={{ marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12.5,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  color: a.leftHi ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: a.leftHi ? 600 : 400,
                }}
              >
                {a.left}
              </span>
              <span
                style={{
                  color: a.leftHi ? 'var(--text-muted)' : 'var(--text-primary)',
                  fontWeight: a.leftHi ? 400 : 600,
                }}
              >
                {a.right}
              </span>
            </div>
            <div
              style={{
                height: 8,
                background: 'var(--surface-2)',
                borderRadius: 4,
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: a.pos,
                  transform: 'translate(-50%,-50%)',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'var(--accent-500)',
                  border: '3px solid var(--surface-0)',
                  boxShadow: '0 0 0 1.5px var(--accent-500)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '22px 0 12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 22px',
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 600 }}>Start your backlog</span>
        </div>
        <div
          style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            padding: '0 22px',
            marginBottom: 14,
            lineHeight: 1.45,
          }}
        >
          Based off of the games you've played, here are a few recommendations we think you'll enjoy
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            padding: '2px 22px 4px',
          }}
        >
          {SEED.map((k) => {
            const game = GAMES[k];
            const added = !!state.backlog[k];
            return (
              <div
                key={k}
                style={{
                  background: 'var(--surface-2)',
                  border: `1px solid ${added ? 'var(--border-accent)' : 'var(--border)'}`,
                  borderRadius: 12,
                  overflow: 'hidden',
                  transition: 'border-color 160ms',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <Cover
                    id={`cv-seed-${k}`}
                    style={{ width: '100%', aspectRatio: '3/4', background: 'var(--border)' }}
                  />
                  <button
                    type="button"
                    onClick={() => actions.toggleSeed(k)}
                    aria-pressed={added}
                    aria-label={`${added ? 'Remove' : 'Add'} ${game.name}`}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      padding: 0,
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {added ? (
                      <span
                        style={{
                          display: 'flex',
                          width: 28,
                          height: 28,
                          borderRadius: 8,
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
                          borderRadius: 8,
                          background: 'rgba(18,11,13,0.62)',
                          border: '1px solid rgba(240,233,233,0.16)',
                          color: 'var(--text-primary)',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 17,
                          lineHeight: 1,
                        }}
                      >
                        +
                      </span>
                    )}
                  </button>
                </div>
                <div style={{ padding: '9px 11px 11px' }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {game.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {game.genre} · {game.hrs}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 12, color: 'var(--accent-300)', padding: '14px 22px 0' }}>
          <span style={{ fontWeight: 600 }}>{seedCount}</span> games in your backlog
        </div>
      </div>

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          padding: '14px 22px 26px',
          background: 'var(--surface-0)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <button
          type="button"
          className="u-accent"
          onClick={actions.resultContinue}
          style={{
            width: '100%',
            background: 'var(--accent-500)',
            color: 'var(--on-accent)',
            border: 'none',
            borderRadius: 11,
            padding: 15,
            fontSize: 14.5,
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 12,
            transition: 'background 120ms var(--ease)',
          }}
        >
          Continue
        </button>
        <button
          type="button"
          className="u-underline"
          onClick={actions.retake}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'center',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: 13,
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          Not quite right? Retake
        </button>
      </div>
    </div>
  );
}

/** Handoff into the app. */
export function Done({ state, actions }: { state: State; actions: LudosActions }) {
  const seedCount = backlogGames(state).length;

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 22px 20px',
        overflow: 'hidden',
        animation: 'fadeIn 320ms cubic-bezier(0.2,0,0,1)',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: '#2E2224',
            border: '1px solid var(--border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
            color: 'var(--accent-500)',
          }}
        >
          <IconBigCheck />
        </div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            margin: '0 0 8px',
          }}
        >
          You're all set!
        </h2>
        <p
          style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            margin: 0,
            maxWidth: 320,
          }}
        >
          Your Ludos experience is tuned to your taste, and{' '}
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{seedCount} games</span>{' '}
          are waiting in your backlog. Happy logging!
        </p>
      </div>
      <div style={{ flex: 'none', marginTop: 'auto', paddingTop: 18 }}>
        <button
          type="button"
          className="u-accent"
          onClick={actions.enterLudos}
          style={{
            width: '100%',
            background: 'var(--accent-500)',
            color: 'var(--on-accent)',
            border: 'none',
            borderRadius: 12,
            padding: 14,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 120ms var(--ease)',
          }}
        >
          Enter Ludos
        </button>
      </div>
    </div>
  );
}
