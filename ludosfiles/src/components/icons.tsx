/** Inline icons, transcribed from the design prototype. */

interface IconProps {
  size?: number;
  className?: string;
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export const IconSearch = ({ size = 24, strokeWidth = 1.8 }: IconProps & { strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} strokeWidth={strokeWidth}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <line x1="15.5" y1="15.5" x2="21" y2="21" />
  </svg>
);

export const IconSearchSmall = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 18 18" {...stroke} strokeWidth={1.6}>
    <circle cx="7.5" cy="7.5" r="5" />
    <line x1="11.4" y1="11.4" x2="16" y2="16" />
  </svg>
);

export const IconChevronDown = ({ size = 15 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...stroke} strokeWidth={2}>
    <path d="M4 6l4 4 4-4" />
  </svg>
);

export const IconChevronRight = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...stroke} strokeWidth={1.75}>
    <path d="M6 3.5L10.5 8L6 12.5" />
  </svg>
);

export const IconBack = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" {...stroke} strokeWidth={1.8}>
    <path d="M12 4l-6 6 6 6" />
  </svg>
);

export const IconArrowRight = ({ size = 17 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" {...stroke} strokeWidth={1.9}>
    <path d="M4 10h11" />
    <path d="M10 5l5 5-5 5" />
  </svg>
);

export const IconPlay = ({ size = 15 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 3l9 5-9 5V3z" />
  </svg>
);

export const IconPlayLarge = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
    <path d="M6 4l11 6-11 6V4z" />
  </svg>
);

export const IconCheck = ({ size = 15, strokeWidth = 2 }: IconProps & { strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...stroke} strokeWidth={strokeWidth}>
    <path d="M3 8.5l3.2 3.2L13 4.5" />
  </svg>
);

export const IconCheckWide = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" {...stroke} strokeWidth={1.7}>
    <path d="M4 10.5l4 4 8-9" />
  </svg>
);

export const IconBookmark = ({ size = 20, strokeWidth = 1.6 }: IconProps & { strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" {...stroke} strokeWidth={strokeWidth}>
    <path d="M5 3h10v14l-5-3.4L5 17V3z" />
  </svg>
);

export const IconBookmarkSmall = ({ size = 15 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...stroke} strokeWidth={1.9}>
    <path d="M4 2.5h8v11l-4-3-4 3z" />
  </svg>
);

export const IconPlus = ({ size = 20, strokeWidth = 1.7 }: IconProps & { strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" {...stroke} strokeWidth={strokeWidth}>
    <path d="M10 4v12M4 10h12" />
  </svg>
);

/** Edit a list. */
export const IconPencil = ({ size = 17 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 18 18" {...stroke} strokeWidth={1.6}>
    <path d="M12.5 2.5l3 3L6 15l-3.5.5L3 12z" />
  </svg>
);

/** Add a game to one of your lists — the list glyph with a plus. */
export const IconListPlus = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" {...stroke} strokeWidth={1.6}>
    <path d="M4 6h9M4 10h9M4 14h6" />
    <path d="M15.5 12v5M13 14.5h5" />
  </svg>
);

/** Grab handle on a reorderable row. */
export const IconDragHandle = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 18 18" {...stroke} strokeWidth={1.6}>
    <line x1="4" y1="6" x2="14" y2="6" />
    <line x1="4" y1="9" x2="14" y2="9" />
    <line x1="4" y1="12" x2="14" y2="12" />
  </svg>
);

/** Profile settings — the gear over the cover banner. */
export const IconSettings = ({ size = 19 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} strokeWidth={1.75}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

/** Sort — three centred rules, longest first. */
export const IconSortLines = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" {...stroke} strokeWidth={1.75}>
    <path d="M3 5h14M6 10h8M8.5 15h3" />
  </svg>
);

/** "Did not finish" — a circle struck through. */
export const IconCircleSlash = ({
  size = 20,
  strokeWidth = 1.6,
}: IconProps & { strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" {...stroke} strokeWidth={strokeWidth}>
    <circle cx="10" cy="10" r="7" />
    <path d="M7 7l6 6" />
  </svg>
);

export const IconRefresh = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...stroke} strokeWidth={1.6}>
    <path d="M13 8a5 5 0 1 1-1.5-3.5" />
    <path d="M13 2.5V5h-2.5" />
  </svg>
);

export const IconUndo = ({ size = 15 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...stroke} strokeWidth={1.7}>
    <path d="M3 8a5 5 0 1 1 1.5 3.5" />
    <path d="M3 5v3h3" />
  </svg>
);

export const IconSkip = ({ size = 15 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...stroke} strokeWidth={1.7}>
    <path d="M4 3l6 5-6 5z" />
    <path d="M12 3v10" />
  </svg>
);

export const IconBigCheck = ({ size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} strokeWidth={2.2}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);

// ── Tab bar ───────────────────────────────────────────────────
export const IconTabDiscover = ({ size = 22 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <circle cx="11" cy="11" r="8" />
    <circle cx="11" cy="11" r="1.7" fill="currentColor" stroke="none" />
  </svg>
);

export const IconTabLibrary = ({ size = 22 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="currentColor">
    <rect x="4" y="5" width="3.4" height="12" rx="1.2" />
    <rect x="9.3" y="5" width="3.4" height="12" rx="1.2" />
    <rect x="14.6" y="5" width="3.4" height="12" rx="1.2" />
  </svg>
);

export const IconTabFriends = ({ size = 22 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <circle cx="8.5" cy="9" r="3.4" />
    <circle cx="14.5" cy="9.5" r="2.8" />
    <path d="M3.5 17c0-2.5 2-4 5-4s5 1.5 5 4" />
  </svg>
);

export const IconTabSearch = ({ size = 22 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <circle cx="9.5" cy="9.5" r="6" />
    <line x1="14" y1="14" x2="19" y2="19" strokeLinecap="round" />
  </svg>
);

export const IconTabProfile = ({ size = 22 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <circle cx="11" cy="7.5" r="3.6" />
    <path d="M4 18.5c0-3.4 3.1-5.2 7-5.2s7 1.8 7 5.2" />
  </svg>
);

// ── Friends ───────────────────────────────────────────────────
/** The pair on the "Quiet feed?" card — heavier than the tab bar's glyph. */
export const IconFriendsPair = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <circle cx="8" cy="9" r="4" />
    <circle cx="15" cy="9" r="3.4" />
    <path d="M2.5 18c0-2.6 2.4-4 5.5-4" />
  </svg>
);

/** Copy the invite link. */
export const IconCopy = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...stroke} strokeWidth={1.7}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 5.5V3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9a1.5 1.5 0 0 0 1.5 1.5H5.5" />
  </svg>
);

// ── Share targets on the add-friends panel ────────────────────
export const IconMessages = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 22 22" {...stroke} strokeWidth={1.6}>
    <path d="M4 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H9l-4 3v-3H4A1.5 1.5 0 0 1 2.5 15V7A1.5 1.5 0 0 1 4 5.5Z" />
  </svg>
);

export const IconMessenger = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 22 22" {...stroke} strokeWidth={1.6}>
    <path d="M11 3.5c-4.7 0-8.5 3.4-8.5 7.7 0 2.5 1.3 4.8 3.4 6.2v2.6l2.7-1.5c0.75.2 1.55.3 2.4.3 4.7 0 8.5-3.4 8.5-7.6S15.7 3.5 11 3.5Z" />
  </svg>
);

export const IconGmail = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 22 22" {...stroke} strokeWidth={1.6}>
    <rect x="2.5" y="4.5" width="17" height="13" rx="1.8" />
    <path d="M3.2 5.3l7 5.6a1.3 1.3 0 0 0 1.6 0l7-5.6" />
  </svg>
);

export const IconX = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 22 22" {...stroke} strokeWidth={1.6}>
    <path d="M3.5 3.5l15 15" />
    <path d="M18.5 3.5l-15 15" />
  </svg>
);

/** The share sheet's catch-all — three linked nodes. */
export const IconShareNodes = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 22 22" {...stroke} strokeWidth={1.6}>
    <circle cx="17" cy="5" r="2.2" />
    <circle cx="5" cy="11" r="2.2" />
    <circle cx="17" cy="17" r="2.2" />
    <line x1="6.9" y1="10" x2="15.1" y2="6" />
    <line x1="6.9" y1="12" x2="15.1" y2="16" />
  </svg>
);

// ── Add to Home Screen hint ───────────────────────────────────
/** iOS Share glyph — the button the hint points at. */
export const IconShare = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...stroke} strokeWidth={1.6}>
    <path d="M8 10.5V2" />
    <path d="M5 4.8L8 1.8l3 3" />
    <path d="M4 7H2.8v6.5h10.4V7H12" />
  </svg>
);

export const IconClose = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 14 14" {...stroke} strokeWidth={1.8}>
    <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
  </svg>
);

// ── Status bar ────────────────────────────────────────────────
export const IconSignal = () => (
  <svg width="17" height="11" viewBox="0 0 17 11" fill="var(--text-primary)">
    <rect x="0" y="7" width="3" height="4" rx="1" />
    <rect x="4.5" y="5" width="3" height="6" rx="1" />
    <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
    <rect x="13.5" y="0" width="3" height="11" rx="1" />
  </svg>
);

export const IconBattery = () => (
  <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
    <rect x="0.6" y="0.6" width="20" height="10.8" rx="3" stroke="var(--text-primary)" strokeOpacity="0.5" />
    <rect x="2.2" y="2.2" width="14.5" height="7.6" rx="1.6" fill="var(--text-primary)" />
    <rect x="21.6" y="4" width="2" height="4" rx="1" fill="var(--text-primary)" fillOpacity="0.5" />
  </svg>
);
