import { useEffect } from 'react';
import { IosInstallHint } from './components/IosInstallHint';
import { PhoneShell } from './components/PhoneShell';
import { StatusSheet } from './components/StatusSheet';
import { Toast } from './components/Toast';
import { UpdatePrompt } from './components/UpdatePrompt';
import { useAppUpdate } from './lib/appUpdate';
import { GameDetail } from './screens/detail/GameDetail';
import { Friends } from './screens/friends/Friends';
import { Library } from './screens/library/Library';
import { ListEdit } from './screens/library/ListEdit';
import { HeadToHead } from './screens/h2h/HeadToHead';
import { Discover } from './screens/home/Discover';
import { TabBar } from './screens/home/TabBar';
import { Onboarding } from './screens/onboarding/Onboarding';
import { Profile } from './screens/profile/Profile';
import { Search } from './screens/search/Search';
import { TAB_FLOWS, type Flow } from './state/types';
import { useBackNavigation } from './state/useBackNavigation';
import { jumpPatch, useLudos } from './state/useLudos';

const SCREEN_LABELS: Record<Flow, string> = {
  onboarding: 'Onboarding',
  home: 'Discover',
  detail: 'Game detail',
  library: 'Library',
  friends: 'Friends',
  profile: 'Profile',
  search: 'Search',
  h2h: 'Head-to-head',
};

/** Game detail, onboarding and head-to-head all take over the whole screen. */
function hasTabBar(flow: Flow): boolean {
  return (TAB_FLOWS as readonly Flow[]).includes(flow);
}

export function App() {
  const { state, actions, homeScroll, detailScroll, reviewPrompt } = useLudos();
  const update = useAppUpdate();

  // Back closes what's open rather than exiting the installed app.
  useBackNavigation(state, actions);

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
      {state.flow === 'detail' && (
        <GameDetail
          state={state}
          actions={actions}
          scrollRef={detailScroll}
          promptRef={reviewPrompt}
        />
      )}
      {state.flow === 'library' && <Library state={state} actions={actions} />}
      {state.flow === 'friends' && <Friends state={state} actions={actions} />}
      {state.flow === 'search' && <Search state={state} actions={actions} />}
      {state.flow === 'profile' && <Profile state={state} actions={actions} />}
      {state.flow === 'h2h' && <HeadToHead state={state} actions={actions} />}

      {/* One tab bar for every tabbed flow, rather than one per screen — the
          active tab and the routing then can't drift between them. */}
      {hasTabBar(state.flow) && <TabBar active={state.flow} onNavigate={actions.navigate} />}

      {/* Opened from Discover, Game detail and Search, so it's mounted above
          all three rather than inside any one of them. */}
      <StatusSheet state={state} actions={actions} />

      {/* Full-screen over the tab bar, which the Library's own box excludes. */}
      {state.libEditOpen && <ListEdit state={state} actions={actions} />}

      {/* Both live in the same spot above the tab bar, so only one shows. A
          waiting build outranks the install hint: the hint returns next time
          it's dismissed, an unreloaded build keeps the session on old code.
          The hint is also held back until Discover — mid-onboarding is too
          early to ask someone to install anything. */}
      {update.ready ? (
        <UpdatePrompt onReload={update.apply} onDismissed={update.dismiss} />
      ) : (
        state.flow === 'home' && <IosInstallHint />
      )}

      {state.toast && <Toast message={state.toast} toastKey={state.toastKey} />}
    </PhoneShell>
  );
}
