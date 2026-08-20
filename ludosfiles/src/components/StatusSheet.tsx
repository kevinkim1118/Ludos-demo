import {
  IconBookmark,
  IconCheckWide,
  IconCircleSlash,
  IconPlayLarge,
  IconPlus,
} from './icons';
import type { State } from '../state/types';
import type { LudosActions } from '../state/useLudos';
import { BottomSheet } from './BottomSheet';

/**
 * The one sheet every status choice goes through, in two modes.
 *
 * **Add** — a game not tracked yet, opened from a rail, Search or Game detail.
 * **Status** — a game already in flight, opened from the pick card's "Update
 * Status" button. That button used to drop a floating menu inside a scrolling
 * card; three actions in that space were cramped, and every other status
 * choice in the app already happens here.
 *
 * It lives at app level because Discover, Game detail and Search all open it.
 */
export function StatusSheet({ state, actions }: { state: State; actions: LudosActions }) {
  const sheet = state.sheet;
  if (!sheet) return null;

  if (sheet.statusUpdate) {
    return (
      <BottomSheet
        closing={state.sheetClosing}
        onClose={actions.closeSheet}
        title={<>Update {sheet.name}</>}
        subtitle="Change how you're tracking it"
      >
        <button
          type="button"
          className="u-accent"
          onClick={() => actions.setPickStatus('finished')}
          style={{
            ...sheetButton,
            background: 'var(--accent-500)',
            color: 'var(--on-accent)',
            border: 'none',
            fontWeight: 600,
          }}
        >
          <IconCheckWide />
          Mark as finished
        </button>
        <button
          type="button"
          className="u-outline"
          onClick={() => actions.setPickStatus('backlog')}
          style={sheetButton}
        >
          <IconBookmark />
          Move to backlog
        </button>
        <button
          type="button"
          className="u-outline"
          onClick={() => actions.setPickStatus('dnf')}
          style={{ ...sheetButton, marginBottom: 0 }}
        >
          <IconCircleSlash />
          Did not finish
        </button>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet
      closing={state.sheetClosing}
      onClose={actions.closeSheet}
      title={<>Add {sheet.name} to…</>}
      subtitle="Set a status to start tracking it"
    >
      <button
        type="button"
        className="u-accent"
        onClick={() => actions.sheetAction('backlog', 'Added to backlog')}
        style={{
          ...sheetButton,
          background: 'var(--accent-500)',
          color: 'var(--on-accent)',
          border: 'none',
          fontWeight: 600,
        }}
      >
        <IconBookmark />
        Add to backlog
      </button>
      <button
        type="button"
        className="u-outline"
        onClick={() => actions.sheetAction('playing', 'Marked as playing')}
        style={sheetButton}
      >
        <IconPlayLarge />
        Mark as playing
      </button>
      <button
        type="button"
        className="u-outline"
        onClick={() => actions.sheetAction('finished', 'Marked as finished')}
        style={sheetButton}
      >
        <IconCheckWide />
        Mark as finished
      </button>
      <button
        type="button"
        className="u-dashed"
        onClick={actions.demo}
        style={{
          ...sheetButton,
          marginBottom: 0,
          color: 'var(--accent-300)',
          border: '1px dashed var(--border-accent)',
          fontWeight: 600,
        }}
      >
        <IconPlus />
        Add to a list
      </button>
    </BottomSheet>
  );
}

const sheetButton = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  width: '100%',
  textAlign: 'left',
  background: 'transparent',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-strong)',
  borderRadius: 11,
  padding: 14,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  marginBottom: 9,
} as const;
