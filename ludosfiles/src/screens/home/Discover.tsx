import type { RefObject } from 'react';
import { BottomSheet } from '../../components/BottomSheet';
import { Cover } from '../../components/Cover';
import { IconChevronRight } from '../../components/icons';
import { CONFIG, archetypePlural, friendsConnected } from '../../config';
import { RAILS, TIME_OPTIONS } from '../../data/content';
import { prInitials } from '../../data/profile';
import { backlogGames } from '../../state/reducer';
import type { State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';
import { PickCard } from './PickCard';
import { Rail } from './Rail';
import { Spotlight } from './Spotlight';

interface DiscoverProps {
  state: State;
  actions: LudosActions;
  scrollRef: RefObject<HTMLDivElement | null>;
}

export function Discover({ state, actions, scrollRef }: DiscoverProps) {
  const isPlaying = !!state.upNext || !!state.playingItem;
  const backlogCount = backlogGames(state).length;
  const spotVisible = CONFIG.showRecommendedCard && !state.spotDismissed;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
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
        <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Discover</span>
        <span style={{ flex: 1 }} />
        {/* The same avatar the Profile screen leads with, at header size — a
            blank circle read as an unfinished control rather than as "you".
            The Search tab already sits in the tab bar, so a second entry point
            up here was one control too many. */}
        <button
          type="button"
          onClick={() => actions.navigate('profile')}
          aria-label="Profile"
          style={{
            width: 36,
            height: 36,
            padding: 0,
            borderRadius: '50%',
            border: '1px solid var(--border-strong)',
            background: 'var(--surface-2)',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <Cover
            id="cv-profile-avatar"
            fallback={prInitials(state.prUsername)}
            style={{ display: 'block', width: '100%', height: '100%', fontSize: 12 }}
          />
        </button>
      </header>

      <div className="scroll-y" ref={scrollRef} style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <div style={{ padding: '18px 18px 6px' }}>
          {isPlaying ? (
            <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: '-0.01em' }}>
              Currently playing
            </div>
          ) : (
            <>
              <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: '-0.01em' }}>
                What to play next
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 3 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{backlogCount}</span> waiting in
                your backlog
              </div>
            </>
          )}
        </div>

        {spotVisible && <Spotlight state={state} actions={actions} />}

        <PickCard state={state} actions={actions} />

        {/* Head-to-head entry point */}
        <button
          type="button"
          className="u-outline"
          onClick={actions.goCompare}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            width: 'calc(100% - 28px)',
            textAlign: 'left',
            margin: '-8px 14px 22px',
            padding: '14px 15px',
            border: '1.5px solid var(--border-accent)',
            borderRadius: 16,
            background: 'var(--surface-1)',
            cursor: 'pointer',
            boxShadow: '0 8px 26px rgba(0,0,0,0.32)',
            transition: 'background 120ms var(--ease)',
          }}
        >
          <span
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              flex: 'none',
              width: 62,
              height: 44,
            }}
          >
            <span
              style={{
                width: 30,
                height: 44,
                borderRadius: '6px 3px 3px 6px',
                background: 'var(--accent-500)',
              }}
            />
            <span
              style={{
                width: 30,
                height: 44,
                borderRadius: '3px 6px 6px 3px',
                background: '#49566B',
                marginLeft: 2,
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 26,
                height: 26,
                borderRadius: 999,
                background: '#3A2C30',
                border: '1.5px solid var(--surface-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                lineHeight: 1,
                color: '#E8DCDD',
                textTransform: 'uppercase',
              }}
            >
              vs
            </span>
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                display: 'block',
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              {isPlaying ? 'Want to play something new?' : "Still can't decide?"}
            </span>
            <span
              style={{
                display: 'block',
                marginTop: 3,
                fontSize: 12.5,
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
              }}
            >
              Compare two games against each other to narrow down what to play
            </span>
          </span>
          <span style={{ flex: 'none', color: '#8A787C', display: 'inline-flex' }}>
            <IconChevronRight />
          </span>
        </button>

        {RAILS.map((rail) => (
          <Rail
            key={rail.prefix}
            title={rail.title}
            sub={
              rail.prefix === 'ts'
                ? `Other ${archetypePlural(CONFIG.archetype)} ${rail.sub}`
                : rail.requiresFriends && !friendsConnected
                  ? 'Connect to see friend activity'
                  : rail.sub
            }
            prefix={rail.prefix}
            items={rail.items}
            show={!rail.requiresFriends || friendsConnected}
            itemStatus={state.itemStatus}
            onOpenSheet={(item, slotId) =>
              actions.openSheet({ name: item.n, meta: item.p, slotId })
            }
            onOpen={(item) => (item.k === 'eldenring' ? actions.openDetail() : actions.demo())}
            onStub={actions.demo}
          />
        ))}

        <div style={{ height: 14 }} />
      </div>

      {state.timeSheet && (
        <BottomSheet
          closing={state.timeClosing}
          onClose={actions.closeTimeSheet}
          title="How much time do you have?"
          subtitle="We'll tune the pick to fit your session"
        >
          {TIME_OPTIONS.map((t, i) => {
            const active = i === state.time;
            return (
              <button
                key={t.label}
                type="button"
                className="u-outline"
                onClick={() => actions.pickTime(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  textAlign: 'left',
                  background: active ? 'var(--surface-2)' : 'transparent',
                  color: 'var(--text-primary)',
                  border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border)'}`,
                  borderRadius: 11,
                  padding: '13px 14px',
                  cursor: 'pointer',
                  marginBottom: 9,
                }}
              >
                <span style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, display: 'block' }}>{t.label}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{t.desc}</span>
                </span>
                {active && (
                  <span style={{ color: 'var(--accent-300)', fontSize: 15, flex: 'none' }}>✓</span>
                )}
              </button>
            );
          })}
        </BottomSheet>
      )}
    </div>
  );
}
