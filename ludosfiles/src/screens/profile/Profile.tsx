import { Cover } from '../../components/Cover';
import { SentimentPill } from '../../components/SentimentPill';
import {
  IconChevronRight,
  IconClose,
  IconPencil,
  IconSearchSmall,
  IconSettings,
  IconSortLines,
} from '../../components/icons';
import { libCoverStrip } from '../../data/library';
import {
  PR_ACTIVITY,
  PR_REVIEWS,
  PR_SENTIMENTS,
  PR_SORTS,
  PR_STATS,
  PR_TABS,
  prInitials,
  prSortedLists,
  type PrActivityItem,
  type PrReview,
} from '../../data/profile';
import type { State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';
import { ProfileEdit } from './ProfileEdit';

/**
 * Your own profile: who you are at the top, then everything you've said about
 * games under three tabs. Every number on it is fixed demo content — what's
 * live is the tab, the list search and sort, and the two fields the editor
 * commits.
 */
export function Profile({ state, actions }: { state: State; actions: LudosActions }) {
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
      <div className="scroll-y" style={{ flex: 1, minHeight: 0 }}>
        <div style={{ position: 'relative' }}>
          <Cover
            id="cv-profile-cover"
            style={{ display: 'block', width: '100%', height: 196, background: 'var(--surface-2)' }}
          />
          {/* Darkens the foot of the banner so the avatar's ring reads against
              it whatever artwork lands there. */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(36,27,29,0) 55%, rgba(36,27,29,0.85) 100%)',
              pointerEvents: 'none',
            }}
          />
          <button
            type="button"
            className="u-scrim-btn"
            onClick={actions.demo}
            title="Settings"
            aria-label="Settings"
            style={{
              position: 'absolute',
              top: 12,
              right: 14,
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(8,5,6,0.5)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <IconSettings />
          </button>
        </div>

        {/* Pulled up over the banner, then pushed back down by the row's own
            margin — the avatar overlaps the art, the text below it does not. */}
        <div style={{ padding: '0 18px', marginTop: -34, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 40 }}>
            <Cover
              id="cv-profile-avatar"
              fallback={prInitials(state.prUsername)}
              style={{
                display: 'block',
                width: 80,
                height: 80,
                flex: 'none',
                background: 'var(--border)',
                border: '3px solid var(--surface-0)',
                borderRadius: '50%',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: '-0.01em' }}>
                {state.prUsername}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-voice)',
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginTop: 5,
                }}
              >
                {state.prBio}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 16,
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: '15px 6px',
            }}
          >
            {PR_STATS.map((stat, i) => (
              <div key={stat.label} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 19,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                  {stat.label}
                </div>
                {i < PR_STATS.length - 1 && (
                  <span
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 6,
                      bottom: 6,
                      width: 1,
                      background: 'var(--border)',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="u-outline"
            onClick={actions.openPrEdit}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              marginTop: 12,
              background: 'transparent',
              border: '1px solid var(--border-strong)',
              borderRadius: 999,
              padding: 12,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 140ms cubic-bezier(0.2,0,0,1)',
            }}
          >
            Edit profile
            <IconPencil size={15} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '16px 18px 4px' }}>
          {PR_TABS.map((tab) => {
            const active = tab.key === state.prTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => actions.setPrTab(tab.key)}
                aria-pressed={active}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 18px',
                  borderRadius: 999,
                  fontSize: 13.5,
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: active ? 'var(--text-primary)' : 'transparent',
                  color: active ? 'var(--surface-0)' : 'var(--text-secondary)',
                  border: `1px solid ${active ? 'var(--text-primary)' : 'var(--border)'}`,
                  transition: 'background 140ms cubic-bezier(0.2,0,0,1)',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <div style={{ height: 1, background: 'var(--surface-1)', margin: '8px 18px 0' }} />

        {state.prTab === 'reviews' && (
          <div style={{ padding: '4px 18px 8px', animation: 'cardFadeIn 220ms cubic-bezier(0.2,0,0,1)' }}>
            {PR_REVIEWS.map((review) => (
              <ReviewRow key={review.k} review={review} />
            ))}
          </div>
        )}

        {state.prTab === 'lists' && <ListsTab state={state} actions={actions} />}

        {state.prTab === 'activity' && (
          <div style={{ padding: '4px 18px 8px', animation: 'cardFadeIn 220ms cubic-bezier(0.2,0,0,1)' }}>
            {PR_ACTIVITY.map((item) => (
              <ActivityRow key={item.k} item={item} />
            ))}
          </div>
        )}

        <div style={{ height: 12 }} />
      </div>

      {/* Inside the screen's box rather than App's, so the sheet stops at the
          top of the tab bar — the list editor is the one that covers it. */}
      {state.prEditOpen && <ProfileEdit state={state} actions={actions} />}
    </div>
  );
}

/** Cover, title, when you finished it, how it went, and what you said. */
function ReviewRow({ review }: { review: PrReview }) {
  const lean = PR_SENTIMENTS[review.sent];
  return (
    <div
      style={{
        display: 'flex',
        gap: 13,
        padding: '18px 0',
        borderBottom: '1px solid var(--surface-1)',
      }}
    >
      <Cover
        id={`cv-rev-${review.k}`}
        alt={review.title}
        style={{
          width: 84,
          height: 'auto',
          aspectRatio: '2 / 3',
          flex: 'none',
          background: 'var(--border)',
          borderRadius: 8,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.15 }}
        >
          {review.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 9px' }}>
          {review.date}
        </div>
        <SentimentPill sentiment={lean.sentiment}>{lean.label}</SentimentPill>
        <div style={quote}>{review.quote}</div>
      </div>
    </div>
  );
}

/** Verb-first history — what you did, to what, and optionally how it went. */
function ActivityRow({ item }: { item: PrActivityItem }) {
  const lean = item.sent ? PR_SENTIMENTS[item.sent] : null;
  return (
    <div
      style={{
        display: 'flex',
        gap: 13,
        padding: '18px 0',
        borderBottom: '1px solid var(--surface-1)',
      }}
    >
      <Cover
        id={`cv-act-${item.k}`}
        alt={item.game}
        style={{
          width: 84,
          height: 'auto',
          aspectRatio: '2 / 3',
          flex: 'none',
          background: 'var(--border)',
          borderRadius: 8,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {item.verb} <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.game}</strong>
          {item.target && (
            <>
              {' to '}
              <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.target}</strong>
            </>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{item.date}</div>
        {lean && (
          <div style={{ marginTop: 10 }}>
            <SentimentPill sentiment={lean.sentiment}>{lean.label}</SentimentPill>
          </div>
        )}
        {item.quote && <div style={{ ...quote, fontSize: 13, marginTop: 10 }}>{item.quote}</div>}
      </div>
    </div>
  );
}

/**
 * Your lists, searchable and sortable. The cards are the profile's own copy of
 * the collections — a card that maps to a real Library list opens it *there*,
 * which means leaving this screen behind.
 */
function ListsTab({ state, actions }: { state: State; actions: LudosActions }) {
  const query = state.prListSearch.trim();
  const lists = prSortedLists(state.prListSearch, state.prListSort);
  const open = state.prListFilterOpen;

  return (
    <div
      style={{
        padding: '14px 18px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        animation: 'cardFadeIn 220ms cubic-bezier(0.2,0,0,1)',
      }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 11,
            padding: '0 12px',
            height: 42,
          }}
        >
          <span style={{ flex: 'none', display: 'flex', color: 'var(--text-muted)' }}>
            <IconSearchSmall size={16} />
          </span>
          <input
            value={state.prListSearch}
            onChange={(e) => actions.setPrListSearch(e.target.value)}
            placeholder="Search your lists"
            aria-label="Search your lists"
            style={{
              flex: 1,
              minWidth: 0,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 14,
            }}
          />
          {query.length > 0 && (
            <button
              type="button"
              className="u-link"
              onClick={() => actions.setPrListSearch('')}
              title="Clear"
              aria-label="Clear search"
              style={{
                flex: 'none',
                width: 20,
                height: 20,
                border: 'none',
                background: 'none',
                padding: 0,
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconClose />
            </button>
          )}
        </div>
        {/* The button itself carries the popover's open state — there's no
            other affordance saying the options below belong to it. */}
        <button
          type="button"
          onClick={actions.togglePrListFilter}
          title="Sort"
          aria-label="Sort lists"
          aria-expanded={open}
          style={{
            flex: 'none',
            width: 42,
            height: 42,
            borderRadius: 11,
            border: `1px solid ${open ? 'var(--border-accent)' : 'var(--border)'}`,
            background: open ? 'rgba(140,53,64,0.22)' : 'var(--surface-1)',
            color: open ? 'var(--text-primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 140ms cubic-bezier(0.2,0,0,1)',
          }}
        >
          <IconSortLines />
        </button>
      </div>

      {open && (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {PR_SORTS.map((option) => {
            const active = option.key === state.prListSort;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => actions.setPrListSort(option.key)}
                aria-pressed={active}
                style={{
                  fontSize: 12.5,
                  fontWeight: 500,
                  borderRadius: 999,
                  padding: '7px 14px',
                  cursor: 'pointer',
                  border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border)'}`,
                  background: active ? 'rgba(140,53,64,0.22)' : 'var(--surface-1)',
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'background 140ms cubic-bezier(0.2,0,0,1)',
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}

      {query.length > 0 && lists.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 13.5,
            padding: '28px 12px',
          }}
        >
          No lists match your search
        </div>
      )}

      {lists.map((list) => (
        <button
          key={list.k}
          type="button"
          className="u-border-hover"
          onClick={() => actions.openPrList(list.libKey)}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 14,
            cursor: 'pointer',
            transition: 'border-color 160ms cubic-bezier(0.2,0,0,1)',
          }}
        >
          {/* Bleeds off the card's right edge so the strip reads as scrollable
              rather than as a row that happens to end. */}
          <span
            className="scroll-x"
            style={{
              display: 'flex',
              margin: '0 -14px 13px 0',
              borderRadius: '8px 0 0 8px',
            }}
          >
            {libCoverStrip(list.k, list.count).map((id) => (
              <Cover
                key={id}
                id={id}
                style={{
                  display: 'block',
                  flex: 'none',
                  width: 56,
                  height: 84,
                  background: 'var(--border)',
                }}
              />
            ))}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  display: 'block',
                  fontSize: 16.5,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}
              >
                {list.name}
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: 12.5,
                  color: 'var(--text-muted)',
                  marginTop: 3,
                }}
              >
                {list.count} games · updated {list.updated}
              </span>
            </span>
            <span style={{ flex: 'none', color: '#8A787C', display: 'inline-flex' }}>
              <IconChevronRight />
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

/** The Newsreader excerpt behind a left rule, shared by both feeds. */
const quote = {
  fontFamily: 'var(--font-voice)',
  fontSize: 13.5,
  color: '#D8CACB',
  lineHeight: 1.5,
  borderLeft: '2px solid var(--border-strong)',
  paddingLeft: 11,
  marginTop: 11,
} as const;
