import { Cover } from '../../components/Cover';
import { MARQUEE_ROWS, REVIEWS } from '../../data/content';

const screenBase = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  animation: 'introFade 340ms cubic-bezier(0.2,0,0,1)',
} as const;

const heading = {
  flex: 'none',
  fontSize: 30,
  fontWeight: 500,
  letterSpacing: '-0.02em',
  lineHeight: 1.15,
  textAlign: 'center',
  textWrap: 'balance',
} as const;

/**
 * Marquee sizing. The rows are the only part of the intro that can afford to
 * give up space, so they're the flexible element: the block asks for its full
 * height and shrinks from there, rather than holding 556px and pushing the
 * heading out of a short viewport. Safari's toolbar alone is enough to make a
 * phone that tall unavailable.
 */
const COVER_W = 128;
const COVER_H = 176;
const ROW_GAP = 14;
const MARQUEE_H = MARQUEE_ROWS.length * COVER_H + (MARQUEE_ROWS.length - 1) * ROW_GAP;

/** 1 · Welcome. */
export function IntroWelcome() {
  return (
    <div style={{ ...screenBase, padding: '24px 28px 12px' }}>
      <div style={{ flex: 1 }} />
      <Cover
        id="intro-logo"
        alt="Ludos"
        style={{
          width: '50%',
          height: 150,
          margin: '0 auto',
          background: 'transparent',
          borderRadius: 16,
        }}
      />
      <h1
        style={{
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.02,
          margin: '26px 0 16px',
          textAlign: 'center',
        }}
      >
        Welcome to Ludos
      </h1>
      <p
        style={{
          fontSize: 21,
          fontWeight: 400,
          color: 'var(--text-secondary)',
          lineHeight: 1.35,
          margin: 0,
          textAlign: 'center',
        }}
      >
        Uncover hidden gems
        <br />
        Figure out what to play next
        <br />
        Conquer your backlog
      </p>
      <div style={{ flex: 1.4, minHeight: 20 }} />
    </div>
  );
}

/** 2 · Discover — three cover rows scrolling right to left. */
export function IntroDiscover() {
  return (
    <div style={{ ...screenBase, padding: '26px 0 12px', overflow: 'hidden' }}>
      <div style={{ flex: 1 }} />
      <div
        style={{
          // Asks for its full height, yields it before the heading does.
          flex: `0 1 ${MARQUEE_H}px`,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: ROW_GAP,
        }}
      >
        {MARQUEE_ROWS.map((row, i) => (
          <div
            key={i}
            style={{
              flex: '1 1 0',
              minHeight: 0,
              overflow: 'hidden',
              maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
              WebkitMaskImage:
                'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
            }}
          >
            <div
              className="marquee-strip"
              style={{
                display: 'flex',
                gap: ROW_GAP,
                height: '100%',
                width: 'max-content',
                animation: `marqueeLeft ${row.duration} linear infinite`,
              }}
            >
              {/* Duplicated so the strip loops seamlessly at translateX(-50%). */}
              {[0, 1].map((copy) =>
                row.slots.map((slot) => (
                  <Cover
                    key={`${copy}-${slot}`}
                    id={slot}
                    style={{
                      // Height comes from the row; the ratio keeps the width.
                      height: '100%',
                      width: 'auto',
                      aspectRatio: `${COVER_W} / ${COVER_H}`,
                      flex: 'none',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                    }}
                  />
                )),
              )}
            </div>
          </div>
        ))}
      </div>
      <h2 style={{ ...heading, margin: '34px 28px 0' }}>
        Discover video games matched to your tastes
      </h2>
      <div style={{ flex: 1.6, minHeight: 20 }} />
    </div>
  );
}

const platformTag = {
  fontSize: 11,
  color: 'var(--text-secondary)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  padding: '3px 8px',
  background: 'var(--surface-1)',
} as const;

const menuRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 16px',
} as const;

/** 3 · Add to list — a miniature game detail with the add menu raised. */
export function IntroAddToList() {
  return (
    <div style={{ ...screenBase, padding: '20px 24px 12px', overflow: 'hidden' }}>
      <div style={{ flex: 0.5 }} />
      <div
        style={{
          position: 'relative',
          // Yields height before the heading does. The card already clips, and
          // what goes first is the description under the gradient — the
          // overlay stays pinned to whatever height is left.
          flex: '0 1 auto',
          minHeight: 0,
          alignSelf: 'center',
          width: 340,
          borderRadius: 18,
          overflow: 'hidden',
          border: '1px solid var(--border)',
          background: 'var(--surface-0)',
        }}
      >
        <div
          style={{
            position: 'relative',
            height: 200,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(20,13,14,0.85) 100%), var(--surface-3)',
          }}
        >
          <Cover
            id="intro-elden-cover"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: '12px 14px',
              pointerEvents: 'none',
            }}
          >
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: 11, color: 'rgba(240,233,233,0.8)', marginBottom: 2 }}>
                Sandfall Interactive · 2025 · Turn Based RPG
              </div>
              <div style={{ fontSize: 23, fontWeight: 700, letterSpacing: '-0.02em' }}>
                Clair Obscur: Expedition 33
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 14px 130px' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <span style={platformTag}>PC</span>
            <span style={platformTag}>PS5</span>
            <span style={platformTag}>Xbox</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
            About Clair Obscur: Expedition 33
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55 }}>
            An action RPG open-world masterpiece that blends FromSoftware's combat with vast
            exploration — a world of grandeur that rewards curiosity, discovery, and patience at
            every turn.
          </div>
        </div>

        {/* Decorative: illustrates the flow rather than driving it. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(12,9,10,0.12) 0%, rgba(12,9,10,0.30) 32%, rgba(12,9,10,0.74) 58%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 16,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              background: 'var(--accent-500)',
              color: 'var(--on-accent)',
              textAlign: 'center',
              borderRadius: 14,
              padding: 15,
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            Add to List
          </div>
          <div
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              overflow: 'hidden',
            }}
          >
            <div style={{ ...menuRow, borderBottom: '1px solid var(--border)' }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                stroke="var(--accent-500)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 3h10v14l-5-3.5L5 17z" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Add to library</span>
            </div>
            <div style={{ ...menuRow, borderBottom: '1px solid var(--border)' }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="var(--text-secondary)">
                <path d="M6 4l10 6-10 6z" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>
                Mark as playing
              </span>
            </div>
            <div style={menuRow}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                stroke="var(--text-secondary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 10.5l4 4 8-9" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>
                Mark as finished
              </span>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ ...heading, margin: '32px 4px 0' }}>
        Find video games to play, add them to your lists
      </h2>
      <div style={{ flex: 1, minHeight: 20 }} />
    </div>
  );
}

/** 4 · Reviews. */
export function IntroReviews() {
  return (
    <div style={{ ...screenBase, padding: '24px 24px 12px', overflow: 'hidden' }}>
      <div style={{ flex: 1 }} />
      <div
        style={{
          // Same deal as the other intros: the sample reviews are an
          // illustration, so they give up room before the heading does. The
          // last card crops rather than the heading vanishing.
          flex: '0 1 auto',
          minHeight: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {REVIEWS.map((r) => (
          <div
            key={r.slotId}
            style={{
              // Keep their own height so the container crops the last card,
              // rather than every card squashing its text.
              flex: 'none',
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '14px 15px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Cover
                id={r.slotId}
                fallback={r.initials}
                style={{
                  width: 40,
                  height: 40,
                  flex: 'none',
                  borderRadius: '50%',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}
              />
              <span style={{ minWidth: 0, flex: 1 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</span>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: 'var(--relate-tx)',
                      background: 'var(--relate-bg)',
                      border: '1px solid var(--relate-border)',
                      borderRadius: 999,
                      padding: '2px 9px',
                    }}
                  >
                    {r.archetype}
                  </span>
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: 11.5,
                    color: 'var(--text-muted)',
                    marginTop: 2,
                  }}
                >
                  {r.meta}
                </span>
              </span>
              <span className={`ds-sentiment-pill ${r.pillClass}`} style={{ flex: 'none', fontSize: 11 }}>
                {r.verdict}
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-voice)',
                fontStyle: 'italic',
                fontSize: 14.5,
                lineHeight: 1.5,
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
              {r.text}
            </p>
          </div>
        ))}
      </div>
      <h2 style={{ ...heading, margin: '32px 4px 0' }}>Read honest reviews from players like you</h2>
      <div style={{ flex: 1.4, minHeight: 20 }} />
    </div>
  );
}
