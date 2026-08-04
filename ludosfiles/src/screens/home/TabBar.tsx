import type { ReactNode } from 'react';
import {
  IconTabDiscover,
  IconTabFriends,
  IconTabLibrary,
  IconTabProfile,
  IconTabSearch,
} from '../../components/icons';

const TABS: { label: string; icon: ReactNode }[] = [
  { label: 'Discover', icon: <IconTabDiscover /> },
  { label: 'Library', icon: <IconTabLibrary /> },
  { label: 'Friends', icon: <IconTabFriends /> },
  { label: 'Search', icon: <IconTabSearch /> },
  { label: 'Profile', icon: <IconTabProfile /> },
];

/**
 * Discover is the only tab this build implements; the rest are stubs that
 * report as much, matching the prototype.
 */
export function TabBar({ onStub }: { onStub: () => void }) {
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
        const active = tab.label === 'Discover';
        return (
          <button
            key={tab.label}
            type="button"
            className={active ? undefined : 'u-tab'}
            onClick={active ? undefined : onStub}
            aria-current={active ? 'page' : undefined}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              cursor: active ? 'default' : 'pointer',
              color: active ? 'var(--accent-300)' : 'var(--text-muted)',
            }}
          >
            {tab.icon}
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 500 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
