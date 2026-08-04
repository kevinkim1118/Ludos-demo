export function Toast({ message, toastKey }: { message: string; toastKey: number }) {
  return (
    <div
      key={toastKey}
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 82,
        transform: 'translateX(-50%)',
        background: 'var(--surface-2)',
        border: '1px solid var(--border-strong)',
        color: 'var(--text-primary)',
        fontSize: 12.5,
        fontWeight: 500,
        padding: '10px 16px',
        borderRadius: 999,
        boxShadow: '0 8px 28px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap',
        animation: 'toastUp 200ms cubic-bezier(0.2,0,0,1)',
        zIndex: 50,
      }}
    >
      {message}
    </div>
  );
}
