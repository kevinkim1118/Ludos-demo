import type { SentimentDistribution } from '../data/detail';

/** The bar's buckets, warm to cool — the order the segments are laid out in. */
const SEGMENTS = [
  { key: 'really-liked', field: 'reallyLiked', label: 'really liked' },
  { key: 'liked', field: 'liked', label: 'liked' },
  { key: 'didnt-like', field: 'didntLike', label: "didn't like" },
  { key: 'really-disliked', field: 'reallyDisliked', label: 'really disliked' },
] as const;

/**
 * The aggregate four-bucket sentiment distribution — the core of "The verdict".
 * Always a distribution of leans, never a single averaged score.
 *
 * Ported from the design system's `VerdictBar`; its styles are vendored into
 * `ludos.css` alongside the other `ds-` classes.
 */
export function VerdictBar({
  distribution,
  showKey = false,
}: {
  distribution: SentimentDistribution;
  /** The bar's own percentage key. Detail's cards print their own instead. */
  showKey?: boolean;
}) {
  const total = SEGMENTS.reduce((sum, seg) => sum + (distribution[seg.field] || 0), 0) || 1;

  return (
    <div className="ds-verdict-bar">
      <div className="ds-verdict-bar__track">
        {SEGMENTS.map((seg) => {
          const pct = ((distribution[seg.field] || 0) / total) * 100;
          if (pct <= 0) return null;
          return (
            <div
              key={seg.key}
              className={`ds-verdict-bar__seg--${seg.key}`}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>
      {showKey && (
        <div className="ds-verdict-bar__key">
          {SEGMENTS.map((seg) => (
            <span key={seg.key} className="ds-verdict-bar__key-item">
              <span
                className="ds-verdict-bar__key-dot"
                style={{ background: `var(--sent-${seg.key})` }}
              />
              {Math.round(((distribution[seg.field] || 0) / total) * 100)}% {seg.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
