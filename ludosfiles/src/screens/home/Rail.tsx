import { Cover } from '../../components/Cover';
import {
  IconBookmark,
  IconCheckWide,
  IconCircleSlash,
  IconPlayLarge,
} from '../../components/icons';
import type { RailItem } from '../../data/content';
import type { GameStatus } from '../../state/types';

const badgeBase = {
  display: 'flex',
  width: 28,
  height: 28,
  borderRadius: 8,
  background: 'var(--accent-500)',
  color: 'var(--on-accent)',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'popIn 240ms cubic-bezier(0.2,0,0,1)',
} as const;

function StatusBadge({ status }: { status: GameStatus | undefined }) {
  if (status === 'backlog') return <span style={badgeBase}><IconBookmark size={15} strokeWidth={1.8} /></span>;
  if (status === 'playing') return <span style={badgeBase}><IconPlayLarge size={15} /></span>;
  if (status === 'finished') return <span style={badgeBase}><IconCheckWide size={15} /></span>;
  if (status === 'dnf')
    return <span style={badgeBase}><IconCircleSlash size={15} strokeWidth={1.9} /></span>;

  return (
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
        transition: 'background 120ms var(--ease), border-color 120ms, color 120ms',
      }}
    >
      +
    </span>
  );
}

interface RailProps {
  title: string;
  sub: string;
  prefix: string;
  items: RailItem[];
  /** False for the friends rail until friends connect. */
  show: boolean;
  itemStatus: Record<string, GameStatus>;
  onOpenSheet: (item: RailItem, slotId: string) => void;
  /** Tapping the card itself. Only Elden Ring has a detail screen to open. */
  onOpen: (item: RailItem) => void;
  onStub: () => void;
}

export function Rail({
  title,
  sub,
  prefix,
  items,
  show,
  itemStatus,
  onOpenSheet,
  onOpen,
  onStub,
}: RailProps) {
  return (
    <section style={{ marginTop: 30, marginBottom: 30 }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', marginBottom: 3 }}
      >
        <h2 style={{ fontSize: 21, fontWeight: 600, margin: 0 }}>{title}</h2>
      </div>
      <div
        style={{
          fontSize: 14,
          color: 'var(--text-muted)',
          padding: '0 18px',
          marginBottom: 11,
        }}
      >
        {sub}
      </div>

      {show ? (
        <div
          className="scroll-x"
          style={{ display: 'flex', gap: 12, padding: '2px 18px 4px' }}
        >
          {items.map((item) => {
            const slotId = `cv-${prefix}-${item.k}`;
            return (
              <div
                key={item.k}
                className="u-lift"
                onClick={() => onOpen(item)}
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
                    style={{ width: '100%', height: 178, background: 'var(--border)' }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSheet(item, slotId);
                    }}
                    aria-label={`Add ${item.n}`}
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
                    <StatusBadge status={itemStatus[item.n]} />
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
                    {item.n}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {item.p}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            margin: '0 18px',
            border: '1.5px dashed var(--border-strong)',
            borderRadius: 12,
            padding: 16,
            background: '#2B2023',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600 }}>Empty… for now.</div>
          <div
            style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.4,
              marginTop: 2,
            }}
          >
            Add some friends to see what they've been playing.
          </div>
          <button
            type="button"
            className="u-accent"
            onClick={onStub}
            style={{
              display: 'block',
              width: '100%',
              marginTop: 13,
              background: 'var(--accent-500)',
              color: 'var(--on-accent)',
              border: 'none',
              borderRadius: 9,
              padding: 11,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Add Friends
          </button>
        </div>
      )}
    </section>
  );
}
