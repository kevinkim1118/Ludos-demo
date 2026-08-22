import { IconDragHandle, IconPlus } from '../../components/icons';
import { activeList } from '../../state/reducer';
import type { State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';

/**
 * The list editor — a full-screen sheet over everything, tab bar included, so
 * it's mounted at app level rather than inside the Library's own box. Every
 * field is a draft: Cancel drops them, Save commits title, description, order,
 * the ranked flag and profile visibility.
 */
export function ListEdit({ state, actions }: { state: State; actions: LudosActions }) {
  const { list } = activeList(state);
  const order =
    state.libEditOrderDraft.length === list.games.length
      ? state.libEditOrderDraft
      : list.games.map((_, i) => i);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        background: 'var(--surface-0)',
        transform: state.libEditIn ? 'translateY(0%)' : 'translateY(100%)',
        transition: 'transform 300ms cubic-bezier(0.2,0,0,1)',
        display: 'flex',
        flexDirection: 'column',
        // `.screen` carries the safe-area insets as padding, but an absolutely
        // positioned child is laid out against its *padding box* — so this
        // overlay covered them, and on a notched phone the device clock and
        // battery sat on top of Cancel and Save, swallowing both taps. Every
        // other editor is mounted inside a screen's own box and inherits the
        // insets; this one is at app level, so it has to repeat them.
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        style={{
          flex: 'none',
          height: 54,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 14px',
          borderBottom: '1px solid var(--surface-1)',
        }}
      >
        <button
          type="button"
          className="u-link"
          onClick={actions.cancelLibEdit}
          style={{
            background: 'none',
            border: 'none',
            padding: '6px 4px',
            fontSize: 15,
            fontWeight: 500,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 600 }}>Edit list</span>
        <button
          type="button"
          className="u-link-accent"
          onClick={actions.saveLibEdit}
          style={{
            background: 'none',
            border: 'none',
            padding: '6px 4px',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--accent-300)',
            cursor: 'pointer',
          }}
        >
          Save
        </button>
      </div>

      <div className="scroll-y" style={{ flex: 1, minHeight: 0, padding: '20px 16px 32px' }}>
        <label htmlFor="lib-edit-title" style={fieldLabel}>
          Title
        </label>
        <input
          id="lib-edit-title"
          value={state.libEditTitleDraft}
          onChange={(e) => actions.setLibEditTitle(e.target.value)}
          style={{
            display: 'block',
            width: '100%',
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '12px 14px',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 20,
            boxSizing: 'border-box',
          }}
        />

        <label htmlFor="lib-edit-desc" style={fieldLabel}>
          Description
        </label>
        <textarea
          id="lib-edit-desc"
          value={state.libEditDescDraft}
          onChange={(e) => actions.setLibEditDesc(e.target.value)}
          rows={3}
          style={{
            display: 'block',
            width: '100%',
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '12px 14px',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            fontSize: 14,
            lineHeight: 1.45,
            marginBottom: 22,
            boxSizing: 'border-box',
            resize: 'none',
          }}
        />

        <div style={{ ...toggleRow, borderTop: '1px solid var(--surface-1)' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Ranked list</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Show position numbers for each game
            </div>
          </div>
          <Toggle
            on={state.libEditOrderedDraft}
            onClick={actions.toggleLibRanked}
            label="Toggle ranked list"
          />
        </div>

        <div
          style={{
            ...toggleRow,
            borderTop: '1px solid var(--surface-1)',
            borderBottom: '1px solid var(--surface-1)',
            marginBottom: 22,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Display on Profile</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {state.libEditProfileDraft
                ? 'Visible to others on your profile'
                : 'Hidden — only you can see this list'}
            </div>
          </div>
          <Toggle
            on={state.libEditProfileDraft}
            onClick={actions.toggleLibProfile}
            label="Toggle display on profile"
          />
        </div>

        <div style={{ ...fieldLabel, marginBottom: 10 }}>Games — drag to reorder</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {order.map((sourceIndex, position) => (
            <div
              key={list.games[sourceIndex]?.k ?? position}
              draggable
              onDragStart={() => actions.libDragStart(position)}
              onDragOver={(e) => {
                e.preventDefault();
                actions.libDragOver(position);
              }}
              onDragEnd={actions.libDragEnd}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '11px 12px',
                cursor: 'grab',
              }}
            >
              {state.libEditOrderedDraft && (
                <span
                  style={{
                    width: 20,
                    flex: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textAlign: 'right',
                  }}
                >
                  {position + 1}.
                </span>
              )}
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>
                {list.games[sourceIndex]?.name ?? ''}
              </span>
              <span style={{ display: 'inline-flex', color: '#6E5A5E' }}>
                <IconDragHandle />
              </span>
            </div>
          ))}
          <button
            type="button"
            className="u-dashed"
            onClick={actions.demo}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              background: 'transparent',
              border: '1px dashed var(--border-accent)',
              borderRadius: 10,
              padding: 13,
              color: 'var(--accent-300)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <IconPlus size={18} strokeWidth={1.8} />
            Add games
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="switch"
      aria-checked={on}
      aria-label={label}
      style={{
        width: 46,
        height: 28,
        borderRadius: 999,
        border: 'none',
        background: on ? '#8C3540' : 'var(--border)',
        position: 'relative',
        cursor: 'pointer',
        flex: 'none',
        transition: 'background 160ms',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 20 : 2,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'var(--text-primary)',
          transition: 'left 160ms cubic-bezier(0.2,0,0,1)',
        }}
      />
    </button>
  );
}

const fieldLabel = {
  display: 'block',
  fontSize: 11.5,
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: 8,
} as const;

const toggleRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '14px 2px',
} as const;
