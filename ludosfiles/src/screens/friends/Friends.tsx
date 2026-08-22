import { Cover } from '../../components/Cover';
import { SentimentPill } from '../../components/SentimentPill';
import {
  IconChevronRight,
  IconFriendsPair,
  IconPlus,
  IconTabFriends,
} from '../../components/icons';
import { friendsConnected } from '../../config';
import {
  FR_CHIPS,
  FR_FEED,
  FR_FRIENDS,
  FR_GROUPS,
  FR_SENTIMENTS,
  frMatches,
  type FrFeedItem,
} from '../../data/friends';
import type { State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';
import { AddFriends } from './AddFriends';
import { FriendsSheet } from './FriendsSheet';

interface FriendsProps {
  state: State;
  actions: LudosActions;
}

/**
 * The Friends tab: what the people you follow have been playing, grouped by
 * how recent it is. Everything here is fixed demo content — the only live
 * parts are the filter, the two panels, and the friend requests you send.
 */
export function Friends({ state, actions }: FriendsProps) {
  // Chip counts read across the whole feed, not the group they sit above:
  // "Ratings 3" has to mean three ratings exist, whichever rule they file under.
  const countOf = (key: (typeof FR_CHIPS)[number]['key']) =>
    FR_FEED.filter((item) => frMatches(key, item.type)).length;

  // The connect card lives in Today, and only on the unfiltered feed — it's an
  // invitation to fill the whole feed, not a note about one slice of it.
  const showConnect = !friendsConnected;

  const groups = FR_GROUPS.map((group) => ({
    ...group,
    items: FR_FEED.filter((item) => item.g === group.key && frMatches(state.frFilter, item.type)),
    connect: group.key === 'today' && state.frFilter === 'all' && showConnect,
  })).filter((group) => group.items.length > 0 || group.connect);

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
          gap: 10,
          padding: '0 18px',
          borderBottom: '1px solid var(--surface-1)',
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Friends</span>
        <span style={{ flex: 1 }} />
        <button
          type="button"
          className="u-quiet"
          onClick={actions.openFrSheet}
          title="Friends list"
          aria-label="Friends list"
          style={{
            width: 36,
            height: 36,
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
          <IconTabFriends size={19} />
        </button>
        <button
          type="button"
          className="u-accent"
          onClick={actions.openFrAdd}
          title="Add friends"
          aria-label="Add friends"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: 'none',
            background: 'var(--accent-500)',
            color: 'var(--on-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <IconPlus size={18} strokeWidth={2} />
        </button>
      </header>

      <div
        className="scroll-x"
        style={{
          flex: 'none',
          display: 'flex',
          gap: 8,
          padding: '12px 18px',
          borderBottom: '1px solid var(--surface-1)',
        }}
      >
        {FR_CHIPS.map((chip) => {
          const active = chip.key === state.frFilter;
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => actions.setFrFilter(chip.key)}
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
              {chip.label}
              <span style={{ fontSize: 11, opacity: 0.62 }}>{countOf(chip.key)}</span>
            </button>
          );
        })}
      </div>

      {/* Keyed on the filter so switching chips replays the feed's fade-in
          rather than swapping rows in place. */}
      <div
        key={state.frFilter}
        className="scroll-y"
        style={{
          flex: 1,
          minHeight: 0,
          padding: '14px 16px 6px',
          animation: 'cardFadeIn 220ms cubic-bezier(0.2,0,0,1)',
        }}
      >
        {groups.map((group) => (
          <div key={group.key}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                margin: '4px 2px 12px',
              }}
            >
              <span>{group.label}</span>
              <span style={{ height: 1, flex: 1, background: 'var(--surface-1)' }} />
            </div>

            {group.items.map((item) => (
              <FeedRow key={item.key} item={item} onOpen={actions.demo} />
            ))}

            {group.connect && <ConnectCard onAdd={actions.openFrAdd} />}
          </div>
        ))}

        <div
          style={{
            textAlign: 'center',
            fontSize: 11,
            color: '#6B5A5E',
            padding: '10px 0 4px',
            letterSpacing: '0.02em',
          }}
        >
          You're all caught up · {FR_FRIENDS.length} friends
        </div>
        <div style={{ height: 8 }} />
      </div>

      {state.frSheet && <FriendsSheet state={state} actions={actions} />}
      {state.frAddOpen && <AddFriends state={state} actions={actions} />}
    </div>
  );
}

/** One thing one friend did — cover, sentence, and whatever else they left. */
function FeedRow({ item, onOpen }: { item: FrFeedItem; onOpen: () => void }) {
  const sentiment = item.sentiment ? FR_SENTIMENTS[item.sentiment] : null;

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        display: 'flex',
        gap: 13,
        width: '100%',
        textAlign: 'left',
        padding: '18px 2px',
        background: 'none',
        border: 'none',
        borderBottom: '1px solid var(--surface-1)',
        cursor: 'pointer',
      }}
    >
      <Cover
        id={`ff-${item.key}`}
        alt={item.target}
        style={{
          width: 92,
          height: 'auto',
          aspectRatio: '2 / 3',
          flex: 'none',
          background: 'var(--border)',
          borderRadius: 8,
        }}
      />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: 16,
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.who}</span>{' '}
            {item.verb}{' '}
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.target}</span>
            {item.type === 'list' && (
              <>
                {' to '}
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  {item.listName}
                </span>
              </>
            )}
          </span>
          <span
            style={{ flex: 'none', marginTop: 2, color: '#6B5A5E', display: 'inline-flex' }}
          >
            <IconChevronRight size={15} />
          </span>
        </span>

        <span style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          {item.time}
        </span>

        {item.meta && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: 'var(--text-muted)',
              marginTop: 8,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--accent-300)',
                flex: 'none',
              }}
            />
            {item.meta}
          </span>
        )}

        {sentiment && (
          <span style={{ display: 'block', marginTop: 10 }}>
            <SentimentPill sentiment={sentiment.sentiment}>{sentiment.label}</SentimentPill>
          </span>
        )}

        {item.snippet && (
          <span
            style={{
              display: 'block',
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 14,
              color: '#D8CACB',
              lineHeight: 1.5,
              borderLeft: '2px solid var(--border-strong)',
              paddingLeft: 11,
              marginTop: 10,
            }}
          >
            {item.snippet}
          </span>
        )}
      </span>
    </button>
  );
}

/** Shown in Today while no accounts are connected — see `friendsConnected`. */
function ConnectCard({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      style={{
        border: '1.5px dashed var(--border-strong)',
        borderRadius: 14,
        padding: 16,
        background: '#2B2023',
        margin: '12px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 13 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <IconFriendsPair />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>Quiet feed?</div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              lineHeight: 1.45,
              marginTop: 2,
            }}
          >
            Add some friends to see what they're playing and finishing.
          </div>
        </div>
      </div>
      <button
        type="button"
        className="u-accent"
        onClick={onAdd}
        style={{
          display: 'block',
          width: '100%',
          background: 'var(--accent-500)',
          color: 'var(--on-accent)',
          border: 'none',
          borderRadius: 9,
          padding: 11,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 120ms cubic-bezier(0.2,0,0,1)',
        }}
      >
        Add friends
      </button>
    </div>
  );
}
