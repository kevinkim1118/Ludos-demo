import { INTRO_STEPS, type State } from '../../state/types';
import type { LudosActions } from '../../state/useLudos';
import { IntroAddToList, IntroDiscover, IntroReviews, IntroWelcome } from './IntroScreens';
import { PlayedGames } from './PlayedGames';
import { Done, Reading, Result } from './ResultScreens';

/**
 * First-run flow: four intro screens, then the played-games picker, an
 * analysis beat, the player-type result, and the handoff into Discover.
 */
export function Onboarding({ state, actions }: { state: State; actions: LudosActions }) {
  const introIndex = INTRO_STEPS.indexOf(state.obStep);
  const isIntro = introIndex >= 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div className="scroll-y" style={{ flex: 1, minHeight: 0 }}>
        {state.obStep === 'intro1' && <IntroWelcome />}
        {state.obStep === 'intro2' && <IntroDiscover />}
        {state.obStep === 'intro3' && <IntroAddToList />}
        {state.obStep === 'intro4' && <IntroReviews />}
        {state.obStep === 'played' && <PlayedGames state={state} actions={actions} />}
        {state.obStep === 'reading' && <Reading />}
        {state.obStep === 'result' && <Result state={state} actions={actions} />}
        {state.obStep === 'done' && <Done state={state} actions={actions} />}
      </div>

      {isIntro && (
        <div style={{ flex: 'none', padding: '0 24px 26px' }}>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: 18 }}
            aria-hidden="true"
          >
            {INTRO_STEPS.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === introIndex ? 20 : 6,
                  height: 6,
                  borderRadius: 999,
                  background: i === introIndex ? 'var(--accent-500)' : 'var(--border-strong)',
                  transition: 'all 200ms cubic-bezier(0.2,0,0,1)',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {introIndex > 0 && (
              <button
                type="button"
                className="u-outline"
                onClick={actions.introBack}
                style={{
                  border: '1.5px solid var(--border-strong)',
                  color: 'var(--text-primary)',
                  borderRadius: 999,
                  padding: '16px 30px',
                  fontSize: 15,
                  fontWeight: 500,
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'background 120ms var(--ease)',
                }}
              >
                Back
              </button>
            )}
            <button
              type="button"
              className="u-accent"
              onClick={actions.introNext}
              style={{
                flex: 1,
                background: 'var(--accent-500)',
                color: 'var(--on-accent)',
                border: 'none',
                borderRadius: 999,
                padding: 16,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 120ms var(--ease)',
              }}
            >
              {state.obStep === 'intro4' ? 'Get started' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
