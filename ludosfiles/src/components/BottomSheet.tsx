import type { ReactNode } from 'react';

interface BottomSheetProps {
  /** True while the exit animation plays, before the sheet unmounts. */
  closing: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
}

/** Scrimmed sheet that slides up from the bottom of the screen. */
export function BottomSheet({ closing, onClose, title, subtitle, children }: BottomSheetProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30 }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(8,5,6,0.62)',
          animation: closing ? 'fadeOut 180ms ease forwards' : 'fadeIn 180ms ease',
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          background: 'var(--surface-1)',
          borderTop: '1px solid var(--border-strong)',
          borderRadius: '22px 22px 0 0',
          padding: '10px 18px 24px',
          boxShadow: '0 -14px 44px rgba(0,0,0,0.55)',
          animation: closing
            ? 'sheetDown 280ms cubic-bezier(0.2,0,0,1) forwards'
            : 'sheetUp 280ms cubic-bezier(0.2,0,0,1)',
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: 'var(--border-strong)',
            margin: '0 auto 16px',
          }}
        />
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</div>
        {subtitle != null && (
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '3px 0 16px' }}>
            {subtitle}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
