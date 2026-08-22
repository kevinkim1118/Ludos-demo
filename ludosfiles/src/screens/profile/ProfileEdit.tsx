import type { CSSProperties } from 'react';
import { Cover } from '../../components/Cover';
import { IconRefresh } from '../../components/icons';
import { prInitials } from '../../data/profile';
import type { State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';

const fieldLabel: CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-sans)',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 8,
};

const field: CSSProperties = {
  display: 'block',
  width: '100%',
  background: 'var(--surface-1)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '12px 14px',
  color: 'var(--text-primary)',
};

/**
 * The profile editor — a sheet rising over the profile, and only the profile.
 * Unlike the list editor it stops short of the tab bar, so it's mounted inside
 * the screen's own box rather than at app level. Username and bio are drafts:
 * Cancel drops them, Save commits them.
 */
export function ProfileEdit({ state, actions }: { state: State; actions: LudosActions }) {
  return (
    <>
      <div
        onClick={actions.cancelPrEdit}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 39,
          background: 'rgba(8,5,6,0.62)',
          opacity: state.prEditIn ? 1 : 0,
          transition: 'opacity 300ms cubic-bezier(0.2,0,0,1)',
        }}
      />
      <div
        role="dialog"
        aria-label="Edit profile"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 40,
          background: 'var(--surface-0)',
          borderRadius: '20px 20px 0 0',
          overflow: 'hidden',
          transform: state.prEditIn ? 'translateY(0%)' : 'translateY(100%)',
          transition: 'transform 300ms cubic-bezier(0.2,0,0,1)',
          display: 'flex',
          flexDirection: 'column',
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
            onClick={actions.cancelPrEdit}
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
          <span style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 600 }}>
            Edit profile
          </span>
          <button
            type="button"
            className="u-link-accent"
            onClick={actions.savePrEdit}
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
          <span style={fieldLabel}>Cover banner</span>
          <Cover
            id="cv-profile-cover"
            style={{
              display: 'block',
              width: '100%',
              height: 118,
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              marginBottom: 22,
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <Cover
              id="cv-profile-avatar"
              fallback={prInitials(state.prUsernameDraft)}
              style={{
                display: 'block',
                width: 68,
                height: 68,
                flex: 'none',
                background: 'var(--border)',
                border: '2px solid var(--border-strong)',
                borderRadius: '50%',
              }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Profile picture</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Tap to replace
              </div>
            </div>
          </div>

          <label htmlFor="pr-edit-username" style={fieldLabel}>
            Username
          </label>
          <input
            id="pr-edit-username"
            className="u-focus-accent"
            value={state.prUsernameDraft}
            onChange={(e) => actions.setPrUsernameDraft(e.target.value)}
            style={{ ...field, fontSize: 16, fontWeight: 600, marginBottom: 20 }}
          />

          <label htmlFor="pr-edit-bio" style={fieldLabel}>
            Bio
          </label>
          <textarea
            id="pr-edit-bio"
            className="u-focus-accent"
            value={state.prBioDraft}
            onChange={(e) => actions.setPrBioDraft(e.target.value)}
            rows={3}
            // A textarea's UA default is monospace; every other one in the app
            // opts back into the page font the same way.
            style={{ ...field, fontFamily: 'inherit', fontSize: 14, lineHeight: 1.45, resize: 'none' }}
          />

          {/* Sits below the fields and behind a divider because it isn't one:
              the fields above are drafts that Save commits, while this takes
              effect immediately and leaves the sheet. Grouping it with them
              would imply it waits for Save too. */}
          <div
            style={{
              marginTop: 26,
              paddingTop: 22,
              borderTop: '1px solid var(--surface-1)',
            }}
          >
            <span style={fieldLabel}>Onboarding</span>
            <button
              type="button"
              className="u-quiet"
              onClick={actions.replayOnboarding}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 13,
                color: 'var(--text-primary)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <IconRefresh />
              Replay onboarding
            </button>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.45 }}>
              Runs the intro and the games picker again. Your library, statuses
              and reviews are kept.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
