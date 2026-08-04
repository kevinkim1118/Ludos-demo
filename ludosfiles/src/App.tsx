import { useEffect } from 'react';
import { PhoneShell } from './components/PhoneShell';
import { Toast } from './components/Toast';
import { HeadToHead } from './screens/h2h/HeadToHead';
import { Discover } from './screens/home/Discover';
import { Onboarding } from './screens/onboarding/Onboarding';
import { jumpPatch, useLudos } from './state/useLudos';

const SCREEN_LABELS = {
  onboarding: 'Onboarding',
  home: 'Discover',
  h2h: 'Head-to-head',
} as const;

export function App() {
  const { state, actions, homeScroll } = useLudos();

  // Dev deep-link, e.g. ?screen=h2h:duel or ?screen=onboarding:result.
  // Replaces the prototype's "Jump to screen" tweak.
  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get('screen');
    if (!target) return;
    const patch = jumpPatch(state, target);
    if (patch) actions.dispatch({ type: 'jump', patch });
    // Runs once on mount; the URL is read as an initial condition only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PhoneShell label={SCREEN_LABELS[state.flow]}>
      {state.flow === 'onboarding' && <Onboarding state={state} actions={actions} />}
      {state.flow === 'home' && (
        <Discover state={state} actions={actions} scrollRef={homeScroll} />
      )}
      {state.flow === 'h2h' && <HeadToHead state={state} actions={actions} />}

      {state.toast && <Toast message={state.toast} toastKey={state.toastKey} />}
    </PhoneShell>
  );
}
