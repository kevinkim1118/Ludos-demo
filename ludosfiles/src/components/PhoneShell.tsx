import type { ReactNode } from 'react';
import { IconBattery, IconSignal } from './icons';

/**
 * The device shell. On desktop this is the 430×868 mockup the designs were
 * drawn in; below 540px the frame and the simulated status bar drop away
 * (see app.css) and the app runs full-bleed against the real device chrome.
 */
export function PhoneShell({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="backdrop">
      <div className="phone">
        <div className="screen" data-screen-label={label}>
          <div className="status-bar" aria-hidden="true">
            <span>9:41</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <IconSignal />
              <IconBattery />
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
