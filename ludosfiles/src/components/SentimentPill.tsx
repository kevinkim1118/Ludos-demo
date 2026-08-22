import type { ReactNode } from 'react';
import type { Sentiment } from '../data/detail';

/** What the pill says when nothing overrides it. */
const LABELS: Record<Sentiment, string> = {
  'really-liked': 'Really liked it',
  liked: 'Liked it',
  'didnt-like': "Didn't like it",
  'really-disliked': 'Really disliked it',
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
