import type { ReactNode } from 'react';
import type { Sentiment } from '../data/detail';

/**
 * What the pill says when nothing overrides it. The wording tracks `GD_SCALE`
 * in `data/detail.ts`, which is the app's one sentiment vocabulary — the
 * `Sentiment` keys stay `really-liked` / `really-disliked` because they are
 * also the vendored CSS class names, and those are not ours to rename.
 */
const LABELS: Record<Sentiment, string> = {
  'really-liked': 'Loved it',
  liked: 'Liked it',
  'didnt-like': "Didn't like it",
  'really-disliked': 'Strongly disliked it',
};

/**
 * An individual's four-point sentiment lean, shown as a tinted pill.
 * Warm = liked, cool slate = disliked — never a numeric score.
 *
 * Ported from the design system's `SentimentPill`.
 */
export function SentimentPill({
  sentiment,
  children,
  style,
}: {
  sentiment: Sentiment;
  children?: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`ds-sentiment-pill ds-sentiment-pill--${sentiment}`} style={style}>
      {children ?? LABELS[sentiment]}
    </span>
  );
}
