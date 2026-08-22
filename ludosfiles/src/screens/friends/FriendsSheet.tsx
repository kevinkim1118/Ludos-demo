import { BottomSheet } from '../../components/BottomSheet';
import { FR_FRIENDS } from '../../data/friends';
import type { State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';

/**
 * Everyone you follow, in the same bottom sheet the rest of the app uses.
 * The prototype capped it at 78% of the screen; the sheet sizes to its content
 * here and caps the scrolling list instead, which comes to the same thing for
 * eight rows and degrades the same way past that.
 */
export function FriendsSheet({ state, actions }: { state: State; actions: LudosActions }) {
  const online = FR_FRIENDS.filter((friend) => friend.online).length;

  return (
    <BottomSheet
      closing={state.frSheetClosing}
      onClose={actions.closeFrSheet}
      title={
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
          <span style={{ fontSize: 17 }}>Friends</span>
          <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>
            {FR_FRIENDS.length} Friends · {online} online
          </span>
        </span>
      }
    >
      {/* Negative margins undo the sheet's own padding, so the rows sit on the
          prototype's tighter gutter and a row's hover tint reads as a row
          rather than a chip floating inside one. */}
      <div
        className="scroll-y"
        style={{ maxHeight: '62vh', margin: '16px -6px -24px', padding: '0 0 22px' }}
      >
        {FR_FRIENDS.map((friend) => (
          <div
            key={friend.name}
            className="u-row-soft"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 8px',
              borderRadius: 12,
            }}
          >
            <div style={{ position: 'relative', flex: 'none' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#E8DCDD',
                  background: friend.bg,
                }}
              >
                {friend.initials}
              </div>
              {friend.online && (
                <span
                  style={{
                    position: 'absolute',
                    right: -1,
                    bottom: -1,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: 'var(--accent-500)',
                    border: '2.5px solid var(--surface-1)',
                  }}
                />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{friend.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>
                {friend.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
}
