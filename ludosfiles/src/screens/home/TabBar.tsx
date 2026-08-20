import type { ReactNode } from 'react';
import {
  IconTabDiscover,
  IconTabFriends,
  IconTabLibrary,
  IconTabProfile,
  IconTabSearch,
} from '../../components/icons';
import type { Flow, TabFlow } from '../../state/types';

const TABS: { flow: TabFlow; label: string; icon: ReactNode }[] = [
  { flow: 'home', label: 'Discover', icon: <IconTabDiscover /> },
  { flow: 'library', label: 'Library', icon: <IconTabLibrary /> },
  { flow: 'friends', label: 'Friends', icon: <IconTabFriends /> },
  { flow: 'search', label: 'Search', icon: <IconTabSearch /> },
  { flow: 'profile', label: 'Profile', icon: <IconTabProfile /> },
];

interface TabBarProps {
  /** The flow currently on screen. Anything off the bar leaves no tab active. */
  active: Flow;
  onNavigate: (flow: TabFlow) => void;
}

/** Bottom navigation across the five tabbed flows. */
export function TabBar({ active, onNavigate }: TabBarProps) {
  return (
    <nav
      style={{
        flex: 'none',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: '0 4px 6px',
        borderTop: '1px solid var(--surface-1)',
        background: 'var(--surface-0)',
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.flow === active;
        return (
          <button
            key={tab.flow}
            type="button"
            className={isActive ? undefined : 'u-tab'}
            onClick={isActive ? undefined : () => onNavigate(tab.flow)}
            aria-current={isActive ? 'page' : undefined}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              cursor: isActive ? 'default' : 'pointer',
              color: isActive ? 'var(--accent-300)' : 'var(--text-muted)',
            }}
          >
            {tab.icon}
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 500 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
