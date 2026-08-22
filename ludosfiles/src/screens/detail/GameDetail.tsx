import type { RefObject } from 'react';
import { Cover } from '../../components/Cover';
import { SentimentPill } from '../../components/SentimentPill';
import { VerdictBar } from '../../components/VerdictBar';
import {
  IconBack,
  IconCheck,
  IconListPlus,
  IconPencil,
  IconPlus,
  IconShare,
} from '../../components/icons';
import { CONFIG, archetypePlural, friendsConnected } from '../../config';
import {
  GD_ABOUT,
  GD_CREDIT,
  GD_DISCOVERY,
  GD_FRIEND_ACTIVITY,
  GD_FRIEND_FACES,
  GD_LENGTHS,
  GD_NAME,
  GD_PLATFORMS,
  GD_REVIEWS,
  GD_SCALE,
  GD_SHEET_META,
  GD_STORES,
  GD_TAGS,
  GD_TASTE,
  GD_GLOBAL,
  SENTIMENT_OF,
  toneLabel,
  verdictKey,
  type GdTab,
} from '../../data/detail';
import type { GameStatus, State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';

interface GameDetailProps {
  state: State;
  actions: LudosActions;
  /** The screen's own scroller, so a new review prompt can be scrolled to. */
  scrollRef: RefObject<HTMLDivElement | null>;
  promptRef: RefObject<HTMLDivElement | null>;
}

/** What the footer's tracked button reads once the game has a status. */
const TRACKED_LABEL: Record<GameStatus, string> = {
  backlog: 'In your backlog',
  playing: 'Playing',
  finished: 'Finished',
  dnf: 'Did not finish',
};

/**
 * One game, in full. Fixed to Elden Ring — the screen is a shape rather than a
 * template, so everything below the hero is static content bar the review the
 * user writes themselves.
 *
 * It takes over the whole screen: no tab bar, and back returns to Discover.
 */
export function GameDetail({ state, actions, scrollRef, promptRef }: GameDetailProps) {
  const plural = archetypePlural(CONFIG.archetype);
  const status = state.itemStatus[GD_NAME];
  const scale = GD_SCALE.find((c) => c.key === state.gdRating);
  const posted = state.gdPosted && !!state.gdRating;
  const canPost = !!state.gdRating;
  const reviewText = state.gdReviewText.trim();

  const openSheet = () =>
    actions.openSheet({
      name: GD_NAME,
      meta: GD_SHEET_META,
      slotId: 'cv-detail-hero',
      statusUpdate: !!status,
    });

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
      <button
        type="button"
        className="u-hero-btn"
        onClick={actions.goDiscover}
        title="Back"
        aria-label="Back"
        style={{ ...heroButton, left: 14 }}
      >
        <IconBack />
      </button>
      <button
        type="button"
        className="u-hero-btn"
        onClick={actions.demo}
        title="Share"
        aria-label="Share"
        style={{ ...heroButton, right: 14 }}
      >
        <IconShare size={17} />
      </button>

      <div className="scroll-y" ref={scrollRef} style={{ flex: 1, minHeight: 0 }}>
        {/* ── Hero ───────────────────────────────────────────── */}
        <div style={{ position: 'relative', height: 300 }}>
          <Cover
            id="cv-detail-hero"
            alt={`${GD_NAME} key art`}
            style={{ width: '100%', height: '100%', background: '#2B2023' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, var(--surface-0) 2%, rgba(36,27,29,0.72) 30%, rgba(36,27,29,0.05) 62%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 18px 4px' }}>
            <div
              style={{
                fontSize: 11.5,
                color: 'var(--text-secondary)',
                marginBottom: 5,
                letterSpacing: '0.01em',
              }}
            >
              {GD_CREDIT}
            </div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.02,
                margin: '0 0 11px',
              }}
            >
              {GD_NAME}
            </h1>
            <div style={{ display: 'flex', gap: 6, marginBottom: 11 }}>
              {GD_PLATFORMS.map((p) => (
                <span
                  key={p}
                  style={{
                    fontSize: 10.5,
                    fontWeight: 500,
                    padding: '3px 9px',
                    borderRadius: 6,
                    background: 'rgba(240,233,233,0.1)',
                    border: '1px solid rgba(240,233,233,0.2)',
                    color: '#E8DCDD',
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tag rail ───────────────────────────────────────── */}
        <div className="scroll-x" style={{ display: 'flex', gap: 7, padding: '2px 18px 6px' }}>
          {GD_TAGS.map((tag) => (
            <span
              key={tag}
              style={{
                flex: 'none',
                fontSize: 12,
                padding: '5px 12px',
                borderRadius: 999,
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div style={{ padding: '12px 14px 4px' }}>
          {/* ── About ──────────────────────────────────────── */}
          <div style={{ padding: '0 4px', marginBottom: 16 }}>
            <div style={{ height: 1, background: '#3E2F33', marginBottom: 16 }} />
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: '0.01em',
                margin: '0 0 11px',
              }}
            >
              About {GD_NAME}
            </h2>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.72 }}>
              {GD_ABOUT}
            </div>
          </div>

          {/* ── Review prompt ──────────────────────────────── */}
          {status === 'finished' && !posted && (
            <div
              ref={promptRef}
              style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--border-accent)',
                borderRadius: 16,
                padding: 16,
                marginBottom: 14,
                boxShadow: '0 6px 22px rgba(0,0,0,0.24)',
                animation: 'cardFadeIn 260ms cubic-bezier(0.2,0,0,1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span
                  style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-500)' }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-300)',
                  }}
                >
                  Your review
                </span>
              </div>
              <div
                style={{
                  fontSize: 19,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  padding: '4px 0 8px',
                }}
              >
                How was it?
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 13 }}>
                {GD_SCALE.map((choice) => {
                  const selected = choice.key === state.gdRating;
                  return (
                    <button
                      key={choice.key}
                      type="button"
                      onClick={() => actions.pickGdRating(choice.key)}
                      aria-pressed={selected}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '12px 4px',
                        borderRadius: 10,
                        fontSize: 10.5,
                        lineHeight: 1.25,
                        cursor: 'pointer',
                        transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
                        background: selected ? choice.color : '#2B2023',
                        color: selected ? choice.fg : 'var(--text-muted)',
                        border: `1px solid ${selected ? choice.color : '#3E2F33'}`,
                        fontWeight: selected ? 600 : 500,
                      }}
                    >
                      {choice.label}
                    </button>
                  );
                })}
              </div>
              <textarea
                className="u-focus-accent"
                value={state.gdReviewText}
                onChange={(e) => actions.setGdReviewText(e.target.value)}
                placeholder="Add a few words on what worked or didn't (optional)…"
                rows={3}
                aria-label="Your review"
                style={{
                  display: 'block',
                  width: '100%',
                  resize: 'none',
                  background: '#2B2023',
                  border: '1px solid #3E2F33',
                  borderRadius: 10,
                  padding: '12px 13px',
                  fontFamily: 'inherit',
                  fontSize: 12.5,
                  color: 'var(--text-primary)',
                  lineHeight: 1.55,
                  marginBottom: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={actions.postGdReview}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: '100%',
                  padding: 13,
                  borderRadius: 11,
                  fontSize: 13.5,
                  fontWeight: 600,
                  border: 'none',
                  cursor: canPost ? 'pointer' : 'not-allowed',
                  background: canPost ? 'var(--accent-500)' : '#2B2023',
                  color: canPost ? 'var(--on-accent)' : '#8A787C',
                }}
              >
                Post review
              </button>
              <div
                style={{
                  fontSize: 10.5,
                  color: '#8A787C',
                  marginTop: 9,
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}
              >
                {canPost
                  ? 'A written review is optional — post any time'
                  : 'Pick a rating to post · a written review is optional'}
              </div>
            </div>
          )}

          {/* ── Verdict ────────────────────────────────────── */}
          <div
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: 16,
              marginBottom: 14,
              boxShadow: '0 6px 22px rgba(0,0,0,0.24)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                marginBottom: 15,
              }}
            >
              <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>Verdict</span>
            </div>

            {/* Your own review outranks every other source. */}
            {posted && (
              <div
                style={{
                  background: '#2B2023',
                  border: '1px solid var(--border-accent)',
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 9,
                  animation: 'cardFadeIn 260ms cubic-bezier(0.2,0,0,1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginBottom: 9,
                  }}
                >
                  <span style={{ ...sourceLabel, color: 'var(--accent-300)' }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--accent-500)',
                      }}
                    />
                    Your review
                  </span>
                  <button
                    type="button"
                    className="u-link"
                    onClick={actions.editGdReview}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                    <IconPencil size={15} />
                  </button>
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.05,
                    color: 'var(--text-primary)',
                  }}
                >
                  {scale?.headline ?? ''}
                </div>
                {reviewText.length > 0 && (
                  <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                    <span
                      style={{
                        width: 2,
                        flex: 'none',
                        borderRadius: 1,
                        background: 'var(--border-accent)',
                      }}
                    />
                    <span
                      style={{
                        fontSize: 14,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.55,
                        fontStyle: 'italic',
                        fontFamily: "'Newsreader', Georgia, serif",
                      }}
                    >
                      “{reviewText}”
                    </span>
                  </div>
                )}
              </div>
            )}

            {friendsConnected && (
              <div style={sourceCard}>
                <div style={{ ...sourceHead, marginBottom: 9 }}>
                  <span style={sourceLabel}>
                    <span style={{ ...sourceDot, background: 'var(--trust-friends)' }} />
                    Friends
                  </span>
                  <span style={sourceVerdict}>Loved</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <span style={{ display: 'inline-flex', flex: 'none' }}>
                    {GD_FRIEND_FACES.map((face, i) => (
                      <span
                        key={face.initials}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: face.bg,
                          border: '2px solid #2B2023',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 9,
                          fontWeight: 600,
                          color: face.fg ?? 'var(--text-secondary)',
                          marginLeft: i === 0 ? 0 : -7,
                        }}
                      >
                        {face.initials}
                      </span>
                    ))}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>3 friends</span>{' '}
                    finished {GD_NAME}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 2, height: 8, margin: '11px 0 9px' }}>
                  <span
                    style={{
                      width: '100%',
                      background: 'var(--sent-really-liked)',
                      borderRadius: 3,
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px' }}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 10,
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 2,
                        background: 'var(--sent-really-liked)',
                      }}
                    />
                    3 {toneLabel('rl')}
                  </span>
                </div>
              </div>
            )}

            <div style={sourceCard}>
              <div style={sourceHead}>
                <span style={sourceLabel}>
                  <span style={{ ...sourceDot, background: 'var(--trust-taste)' }} />
                  {plural}
                </span>
                <span style={sourceVerdict}>Strongly positive</span>
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: 11,
                }}
              >
                Most players with your taste loved it.
              </div>
              <div style={{ marginBottom: 12 }}>
                <VerdictBar distribution={GD_TASTE} />
                <DistributionKey distribution={GD_TASTE} />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 9,
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '10px 11px',
                }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    background: 'var(--relate-tx)',
                    transform: 'rotate(45deg)',
                    borderRadius: 1,
                    flex: 'none',
                    marginTop: 4,
                  }}
                />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Strong match</span>{' '}
                  — high challenge and long sessions align with your taste in games.
                </span>
              </div>
            </div>

            <div style={{ ...sourceCard, marginBottom: 0 }}>
              <div style={sourceHead}>
                <span style={sourceLabel}>
                  <span style={{ ...sourceDot, background: 'var(--trust-global)' }} />
                  Global rating
                </span>
                <span style={sourceVerdict}>Mostly positive</span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <VerdictBar distribution={GD_GLOBAL} />
                <DistributionKey distribution={GD_GLOBAL} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Mixed feelings about difficulty — challenge seekers love it, casual players often
                drop the game entirely.
              </div>
            </div>
          </div>

          {/* ── Cost ───────────────────────────────────────── */}
          <div style={panel}>
            <div style={panelTitle}>Cost</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                marginBottom: 13,
              }}
            >
              {GD_LENGTHS.map((length) => (
                <div
                  key={length.label}
                  style={{
                    background: '#2B2023',
                    border: '1px solid #3E2F33',
                    borderRadius: 11,
                    padding: 12,
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>
                    {length.value}
                  </span>
                  <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 3 }}>
                    {length.label}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {GD_STORES.map((store) => (
                <div
                  key={store.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 13px',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span>{store.name}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {store.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Friend activity ────────────────────────────── */}
          {friendsConnected && (
            <div style={panel}>
              <div style={panelTitle}>Friend activity</div>
              {GD_FRIEND_ACTIVITY.map((row, i) => (
                <div
                  key={row.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    padding: '11px 0',
                    borderBottom:
                      i === GD_FRIEND_ACTIVITY.length - 1 ? undefined : '1px solid #3E2F33',
                  }}
                >
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: row.avBg,
                      flex: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 600,
                      color: row.avFg ?? 'var(--text-secondary)',
                    }}
                  >
                    {row.initials}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{row.name}</span>
                      <span
                        style={
                          row.playing
                            ? {
                                ...statusChip,
                                background: 'var(--surface-2)',
                                color: 'var(--text-muted)',
                                border: '1px solid var(--border)',
                              }
                            : {
                                ...statusChip,
                                background: 'var(--border)',
                                color: 'var(--text-secondary)',
                              }
                        }
                      >
                        {row.badge}
                      </span>
                    </div>
                    {row.quote ? (
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--text-muted)',
                          fontFamily: "'Newsreader', Georgia, serif",
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {row.quote}
                      </div>
                    ) : (
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{row.meta}</div>
                    )}
                  </div>
                  {row.tone ? (
                    <SentimentPill sentiment={SENTIMENT_OF[row.tone]}>{row.sentiment}</SentimentPill>
                  ) : (
                    <span
                      style={{
                        flex: 'none',
                        fontSize: 11,
                        fontWeight: 500,
                        padding: '4px 10px',
                        borderRadius: 999,
                        background: '#2B2023',
                        color: '#8A787C',
                        border: '1px solid #3E2F33',
                      }}
                    >
                      No rating
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Reviews ────────────────────────────────────── */}
          <div style={panel}>
            <div style={panelTitle}>Reviews</div>
            <div
              className="scroll-x"
              style={{
                display: 'flex',
                gap: 6,
                paddingBottom: 13,
                marginBottom: 13,
                borderBottom: '1px solid #3E2F33',
              }}
            >
              {([
                { key: 'friends', label: 'Friends' },
                { key: 'taste', label: plural },
                { key: 'all', label: 'All' },
              ] as { key: GdTab; label: string }[]).map((tab) => {
                const active = tab.key === state.gdTab;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => actions.setGdTab(tab.key)}
                    aria-pressed={active}
                    style={{
                      flex: 'none',
                      padding: '6px 14px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      background: active ? 'var(--text-primary)' : 'transparent',
                      color: active ? 'var(--surface-0)' : 'var(--text-secondary)',
                      border: `1px solid ${active ? 'var(--text-primary)' : 'var(--border)'}`,
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <div
              key={state.gdTab}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginBottom: 10,
                animation: 'cardFadeIn 240ms cubic-bezier(0.2,0,0,1)',
              }}
            >
              {GD_REVIEWS[state.gdTab].map((review) => (
                <div
                  key={review.name}
                  style={{ border: '1px solid #3E2F33', borderRadius: 12, padding: 13 }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 9 }}
                  >
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: review.avBg,
                        flex: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 600,
                        color: review.avFg ?? 'var(--text-secondary)',
                      }}
                    >
                      {review.initials}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          flexWrap: 'wrap',
                          marginBottom: 3,
                        }}
                      >
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{review.name}</span>
                        <span
                          style={{
                            ...statusChip,
                            background: 'var(--surface-2)',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          {review.type}
                        </span>
                      </div>
                      <div style={{ fontSize: 10, color: '#8A787C' }}>{review.meta}</div>
                    </div>
                    <SentimentPill sentiment={SENTIMENT_OF[review.tone]}>
                      {review.sentiment}
                    </SentimentPill>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      fontFamily: "'Newsreader', Georgia, serif",
                    }}
                  >
                    {review.body}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="u-quiet"
              onClick={actions.demo}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                padding: 12,
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              {state.gdTab === 'friends'
                ? 'See all friend reviews →'
                : state.gdTab === 'taste'
                  ? `See all reviews from ${plural} →`
                  : 'See all reviews →'}
            </button>
          </div>

          {/* ── Discovery rail ─────────────────────────────── */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 3, padding: '0 2px' }}>
              Played by {plural}
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                marginBottom: 12,
                padding: '0 2px',
              }}
            >
              Others with your taste also finished these
            </div>
            <div className="scroll-x" style={{ display: 'flex', gap: 12, padding: '2px 2px 4px' }}>
              {GD_DISCOVERY.map((game) => {
                const slotId = `cv-disc-${game.k}`;
                return (
                  <div
                    key={game.k}
                    className="u-lift"
                    onClick={actions.demo}
                    style={{
                      width: 138,
                      flex: 'none',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <Cover
                        id={slotId}
                        style={{ width: '100%', aspectRatio: '3 / 4', background: 'var(--border)' }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          actions.openSheet({ name: game.n, meta: game.p, slotId });
                        }}
                        aria-label={`Add ${game.n}`}
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
                        {state.itemStatus[game.n] ? (
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
                            className="u-add-badge"
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
                              transition:
                                'background 120ms var(--ease), border-color 120ms, color 120ms',
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
                          fontSize: 13,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {game.n}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {game.p}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ height: 12 }} />
      </div>

      {/* ── Action bar ─────────────────────────────────────── */}
      <div
        style={{
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px 16px',
          borderTop: '1px solid var(--surface-1)',
          background: 'var(--surface-0)',
        }}
      >
        {status ? (
          <button
            type="button"
            className="u-outline"
            onClick={openSheet}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 9,
              background: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-strong)',
              borderRadius: 11,
              padding: 14,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'var(--accent-500)',
                color: 'var(--on-accent)',
                flex: 'none',
              }}
            >
              <IconCheck size={12} />
            </span>
            {TRACKED_LABEL[status]}
            <span style={{ color: '#8A787C', fontSize: 11 }}>▾</span>
          </button>
        ) : (
          <button
            type="button"
            className="u-accent"
            onClick={openSheet}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'var(--accent-500)',
              color: 'var(--on-accent)',
              border: 'none',
              borderRadius: 11,
              padding: 14,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 120ms var(--ease)',
            }}
          >
            <IconPlus size={18} strokeWidth={1.8} />
            Add to list
          </button>
        )}
        <button
          type="button"
          className="u-quiet"
          onClick={actions.demo}
          title="Add to a list"
          aria-label="Add to a list"
          style={{
            width: 50,
            height: 50,
            flex: 'none',
            border: '1px solid var(--border)',
            borderRadius: 11,
            background: 'transparent',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <IconListPlus />
        </button>
      </div>
    </div>
  );
}

/** The percentage key under a verdict bar. */
function DistributionKey({ distribution }: { distribution: Parameters<typeof verdictKey>[0] }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 14,
        marginTop: 10,
        fontSize: 12,
        color: 'var(--text-secondary)',
      }}
    >
      {verdictKey(distribution).map((k) => (
        <span key={k.pctLabel} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 2,
              display: 'inline-block',
              background: k.color,
            }}
          />
          {k.pctLabel}
        </span>
      ))}
    </div>
  );
}

/** Back and Share, floating over the hero art. */
const heroButton = {
  position: 'absolute',
  top: 10,
  zIndex: 14,
  width: 38,
  height: 38,
  borderRadius: 11,
  border: '1px solid rgba(240,233,233,0.16)',
  background: 'rgba(18,11,13,0.5)',
  backdropFilter: 'blur(8px)',
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
} as const;

/** One source inside the Verdict card. */
const sourceCard = {
  background: '#2B2023',
  border: '1px solid #3E2F33',
  borderRadius: 12,
  padding: 13,
  marginBottom: 9,
} as const;

const sourceHead = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  marginBottom: 8,
} as const;

/** Trust-ladder label — the dot's brightness is what ranks the source. */
const sourceLabel = {
  display: 'flex',
  alignItems: 'center',
  gap: 7,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
} as const;

const sourceDot = { width: 8, height: 8, borderRadius: '50%' } as const;

const sourceVerdict = { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' } as const;

/** The plain cards below the Verdict — Cost, Friend activity, Reviews. */
const panel = {
  background: 'var(--surface-1)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: 16,
  marginBottom: 14,
} as const;

const panelTitle = {
  fontSize: 17,
  fontWeight: 600,
  letterSpacing: '-0.01em',
  marginBottom: 15,
} as const;

/** The small "Finished" / "Playing" / archetype chip beside a name. */
const statusChip = {
  fontSize: 9,
  fontWeight: 500,
  padding: '2px 7px',
  borderRadius: 999,
} as const;
