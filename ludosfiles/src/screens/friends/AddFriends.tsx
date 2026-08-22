import type { ReactNode } from 'react';
import {
  IconBack,
  IconCopy,
  IconGmail,
  IconMessages,
  IconMessenger,
  IconSearchSmall,
  IconShareNodes,
  IconX,
} from '../../components/icons';
import { FR_DIRECTORY, FR_INVITE_LINK } from '../../data/friends';
import type { State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';

const SHARE_TARGETS: { label: string; icon: ReactNode }[] = [
  { label: 'Messages', icon: <IconMessages /> },
  { label: 'Messenger', icon: <IconMessenger /> },
  { label: 'Gmail', icon: <IconGmail /> },
  { label: 'X', icon: <IconX /> },
  { label: 'More', icon: <IconShareNodes /> },
];

/**
 * Three ways to add someone, in descending order of how well the app knows
 * them: search the directory, copy an invite link, or hand it to another app.
 * Slides in over the feed from the right, stopping short of the tab bar.
 */
export function AddFriends({ state, actions }: { state: State; actions: LudosActions }) {
  const query = state.frAddQuery.trim().toLowerCase();
  const results = query
    ? FR_DIRECTORY.filter((person) => person.name.toLowerCase().includes(query))
    : FR_DIRECTORY;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: state.frAddIn ? '0%' : '100%',
        width: '100%',
        bottom: 0,
        zIndex: 32,
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
          onClick={actions.closeFrAdd}
          aria-label="Back to friends"
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
        <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>Add friends</span>
      </div>

      <div className="scroll-y" style={{ flex: 1, minHeight: 0, padding: '16px 18px 24px' }}>
        <div style={{ position: 'relative', marginBottom: 22 }}>
          <span
            style={{
              position: 'absolute',
              left: 13,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'inline-flex',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          >
            <IconSearchSmall size={17} />
          </span>
          <input
            type="text"
            value={state.frAddQuery}
            onChange={(e) => actions.setFrAddQuery(e.target.value)}
            placeholder="Search by username"
            aria-label="Search by username"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 11,
              padding: '12px 14px 12px 38px',
              fontFamily: 'inherit',
              fontSize: 14,
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ ...eyebrow, margin: '0 2px 10px' }}>Suggested</div>

        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 26 }}>
          {results.map((person) => {
            const requested = !!state.frAdded[person.key];
            return (
              <div
                key={person.key}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 2px' }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#E8DCDD',
                    background: person.bg,
                  }}
                >
                  {person.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{person.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>
                    {person.mutual}
                  </div>
                </div>
                {requested ? (
                  <span
                    style={{
                      flex: 'none',
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      padding: '8px 14px',
                    }}
                  >
                    Requested
                  </span>
                ) : (
                  <button
                    type="button"
                    className="u-outline"
                    onClick={() => actions.requestFriend(person.key)}
                    aria-label={`Add ${person.name}`}
                    style={{
                      flex: 'none',
                      background: 'transparent',
                      color: 'var(--accent-300)',
                      border: '1px solid var(--border-accent)',
                      borderRadius: 999,
                      padding: '8px 16px',
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 140ms',
                    }}
                  >
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 2px 16px' }}>
          <span style={eyebrow}>Or invite directly</span>
          <span style={{ height: 1, flex: 1, background: 'var(--surface-1)' }} />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 11,
            padding: '12px 12px 12px 14px',
            marginBottom: 22,
          }}
        >
          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: 13.5,
              color: 'var(--text-secondary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-mono, ui-monospace, monospace)',
            }}
          >
            {FR_INVITE_LINK}
          </span>
          <button
            type="button"
            className="u-accent"
            onClick={actions.copyInvite}
            style={{
              flex: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--accent-500)',
              color: 'var(--on-accent)',
              border: 'none',
              borderRadius: 8,
              padding: '8px 13px',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <IconCopy />
            Copy
          </button>
        </div>

        <div style={{ ...eyebrow, margin: '0 2px 12px' }}>Share via</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {SHARE_TARGETS.map((target) => (
            <button
              key={target.label}
              type="button"
              className="u-outline"
              onClick={actions.demo}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 7,
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '13px 4px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {target.icon}
              <span style={{ fontSize: 10.5, fontWeight: 500 }}>{target.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The uppercase rules over each block. */
const eyebrow = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
} as const;
