/**
 * Stands in for a screen the delta specifies but this build hasn't ported yet,
 * so navigation and deep links can be exercised before the screens land.
 */
export function Placeholder({ name }: { name: string }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: 15,
      }}
    >
      {name}
    </div>
  );
}
