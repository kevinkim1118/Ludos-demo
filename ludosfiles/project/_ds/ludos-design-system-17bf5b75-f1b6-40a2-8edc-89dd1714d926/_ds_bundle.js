/* @ds-bundle: {"format":4,"namespace":"LudosDesignSystem_17bf5b","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"ThemeRoot","sourcePath":"components/core/ThemeRoot.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"RelateChip","sourcePath":"components/sentiment/RelateChip.jsx"},{"name":"SentimentPill","sourcePath":"components/sentiment/SentimentPill.jsx"},{"name":"TrustBadge","sourcePath":"components/sentiment/TrustBadge.jsx"},{"name":"VerdictBar","sourcePath":"components/sentiment/VerdictBar.jsx"}],"sourceHashes":{"components/core/Button.jsx":"c168750ba488","components/core/ThemeRoot.jsx":"7c4cdeb0515c","components/icons/Icon.jsx":"00f1681fa1a6","components/sentiment/RelateChip.jsx":"931bbf948730","components/sentiment/SentimentPill.jsx":"4b6b7875a655","components/sentiment/TrustBadge.jsx":"a25de668921f","components/sentiment/VerdictBar.jsx":"c9013cba6520","ui_kits/app/AppShell.jsx":"4b2c03b32b3f","ui_kits/app/GameDetailScreen.jsx":"3114fbc970f5","ui_kits/app/LibraryScreen.jsx":"34d646a819e5","ui_kits/app/LogVerdictModal.jsx":"dcca542f91ff","ui_kits/app/data.js":"42c2b051fcb1","ui_kits/app/helpers.jsx":"1106cc132194"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LudosDesignSystem_17bf5b = window.LudosDesignSystem_17bf5b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Primary action control. Crimson `primary` is the brand's one loud signal per
 * view — use at most one per screen. `danger` is a quiet outline, not a fill.
 *
 * @startingPoint section="Core" subtitle="Action button — primary / secondary / ghost / danger" viewport="700x120"
 */
function Button({
  variant = "secondary",
  className,
  children,
  ...rest
}) {
  const cls = ["ds-button", `ds-button--${variant}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/ThemeRoot.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Root surface that establishes the Ludos token context.
 * Every component must render inside a ThemeRoot to be styled — it sets the
 * page background, base text color, font, and the active theme.
 *
 * @startingPoint section="Core" subtitle="Themed surface wrapper (dark / light)" viewport="700x200"
 */
function ThemeRoot({
  theme = "dark",
  className,
  children,
  ...rest
}) {
  const cls = ["ds-root", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    "data-theme": theme === "light" ? "light" : undefined
  }, rest), children);
}
Object.assign(__ds_scope, { ThemeRoot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ThemeRoot.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
/**
 * The official Ludos icon. Renders a Lucide glyph at the brand's 1.75px stroke.
 * Requires the Lucide UMD script to be loaded on the page (window.lucide);
 * consumers add <script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js">.
 *
 * Icons stay neutral (currentColor, inherits text color) — never tint an icon
 * crimson unless it IS the primary action.
 *
 * @startingPoint section="Core" subtitle="Lucide icon at brand stroke weight" viewport="700x120"
 */
function Icon({
  name,
  size = 18,
  strokeWidth = 1.75,
  className,
  style
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const host = ref.current;
    if (!host || !window.lucide) return;
    host.innerHTML = "";
    const el = document.createElement("i");
    el.setAttribute("data-lucide", name);
    host.appendChild(el);
    window.lucide.createIcons({
      attrs: {
        width: size,
        height: size,
        "stroke-width": strokeWidth
      },
      nameAttr: "data-lucide"
    });
  }, [name, size, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    className: className,
    style: {
      display: "inline-flex",
      lineHeight: 0,
      color: "currentColor",
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/sentiment/RelateChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Alignment chip — how closely a viewer's taste matches a source, as a neutral
 * label ("83% aligned"). Alignment is NEUTRAL and never borrows sentiment hue.
 *
 * @startingPoint section="Sentiment" subtitle="Neutral taste-alignment chip" viewport="700x120"
 */
function RelateChip({
  children,
  dot = true,
  className,
  ...rest
}) {
  const cls = ["ds-relate-chip", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "ds-relate-chip__dot"
  }), children);
}
Object.assign(__ds_scope, { RelateChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sentiment/RelateChip.jsx", error: String((e && e.message) || e) }); }

// components/sentiment/SentimentPill.jsx
try { (() => {
const LABELS = {
  "really-liked": "Really liked it",
  liked: "Liked it",
  "didnt-like": "Didn't like it",
  "really-disliked": "Really disliked it"
};

/**
 * An individual's four-point sentiment lean, shown as a tinted pill.
 * Warm = liked, cool slate = disliked — never a numeric score.
 *
 * @startingPoint section="Sentiment" subtitle="Four-point sentiment lean pill" viewport="700x120"
 */
function SentimentPill({
  sentiment,
  children,
  className
}) {
  const cls = ["ds-sentiment-pill", `ds-sentiment-pill--${sentiment}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", {
    className: cls
  }, children ?? LABELS[sentiment]);
}
Object.assign(__ds_scope, { SentimentPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sentiment/SentimentPill.jsx", error: String((e && e.message) || e) }); }

// components/sentiment/TrustBadge.jsx
try { (() => {
const LABELS = {
  friends: "Friends",
  taste: "Your taste",
  global: "Everyone"
};

/**
 * Trust badge — labels WHOSE verdict you're reading along the trust ladder.
 * A neutral BRIGHTNESS axis (friends brightest → global dimmest), never a color.
 *
 * @startingPoint section="Sentiment" subtitle="Trust-ladder source label" viewport="700x120"
 */
function TrustBadge({
  level,
  children,
  className
}) {
  const cls = ["ds-trust-badge", `ds-trust-badge--${level}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", {
    className: cls
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-trust-badge__dot"
  }), children ?? LABELS[level]);
}
Object.assign(__ds_scope, { TrustBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sentiment/TrustBadge.jsx", error: String((e && e.message) || e) }); }

// components/sentiment/VerdictBar.jsx
try { (() => {
const SEGMENTS = [{
  key: "really-liked",
  field: "reallyLiked",
  label: "really liked"
}, {
  key: "liked",
  field: "liked",
  label: "liked"
}, {
  key: "didnt-like",
  field: "didntLike",
  label: "didn't like"
}, {
  key: "really-disliked",
  field: "reallyDisliked",
  label: "really disliked"
}];

/**
 * The aggregate four-bucket sentiment distribution — the core of "The verdict."
 * Always a distribution of leans, never a single averaged score.
 *
 * @startingPoint section="Sentiment" subtitle="Aggregate four-bucket verdict distribution" viewport="700x160"
 */
function VerdictBar({
  distribution,
  showKey = false,
  className
}) {
  const total = SEGMENTS.reduce((sum, seg) => sum + (distribution[seg.field] || 0), 0) || 1;
  const cls = ["ds-verdict-bar", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", {
    className: cls
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-verdict-bar__track"
  }, SEGMENTS.map(seg => {
    const pct = (distribution[seg.field] || 0) / total * 100;
    if (pct <= 0) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: seg.key,
      className: `ds-verdict-bar__seg--${seg.key}`,
      style: {
        width: `${pct}%`
      }
    });
  })), showKey && /*#__PURE__*/React.createElement("div", {
    className: "ds-verdict-bar__key"
  }, SEGMENTS.map(seg => {
    const pct = Math.round((distribution[seg.field] || 0) / total * 100);
    return /*#__PURE__*/React.createElement("span", {
      key: seg.key,
      className: "ds-verdict-bar__key-item"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ds-verdict-bar__key-dot",
      style: {
        background: `var(--sent-${seg.key})`
      }
    }), pct, "% ", seg.label);
  })));
}
Object.assign(__ds_scope, { VerdictBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sentiment/VerdictBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppShell.jsx
try { (() => {
// App shell: fixed left nav rail + top bar. Composes DS tokens only.
const {
  Button: DSButton
} = window.LudosDesignSystem_17bf5b;
const Button = DSButton;
function NavItem({
  icon,
  label,
  active,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      padding: "9px 12px",
      borderRadius: "var(--r-control)",
      border: "none",
      background: active ? "var(--surface-2)" : "transparent",
      color: active ? "var(--text-primary)" : "var(--text-secondary)",
      font: "500 14px var(--font-sans)",
      cursor: "pointer",
      textAlign: "left",
      transition: "background var(--dur-fast) var(--ease)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18
  }), " ", label);
}
function AppShell({
  theme,
  setTheme,
  view,
  setView,
  onLog,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      minHeight: 720
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 224,
      flex: "none",
      borderRight: "1px solid var(--border)",
      padding: "20px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-voice)",
      fontWeight: 500,
      fontSize: 26,
      color: "var(--text-primary)",
      padding: "2px 12px 18px"
    }
  }, "Ludos"), /*#__PURE__*/React.createElement(NavItem, {
    icon: "library",
    label: "Library",
    active: view === "library",
    onClick: () => setView("library")
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "bookmark",
    label: "Want to play",
    active: view === "want",
    onClick: () => setView("want")
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "users",
    label: "Friends",
    active: false,
    onClick: () => {}
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "compass",
    label: "Discover",
    active: false,
    onClick: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "9px 12px",
      borderRadius: "var(--r-control)",
      border: "none",
      background: "transparent",
      color: "var(--text-secondary)",
      font: "500 14px var(--font-sans)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: theme === "dark" ? "sun" : "moon",
    size: 18
  }), theme === "dark" ? "Light" : "Dark"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "16px 28px",
      borderBottom: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 380,
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "8px 13px",
      borderRadius: "var(--r-control)",
      background: "var(--surface-1)",
      border: "1px solid var(--border)",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "400 14px var(--font-sans)"
    }
  }, "Search games, people\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onLog
  }, "Log a game")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: "var(--r-pill)",
      flex: "none",
      background: "var(--surface-3)",
      border: "1px solid var(--border-strong)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      font: "600 13px var(--font-sans)",
      color: "var(--text-secondary)"
    }
  }, "KJ")), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: "28px"
    }
  }, children)));
}
Object.assign(window, {
  AppShell,
  NavItem
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/GameDetailScreen.jsx
try { (() => {
// Game detail — "The verdict" page. The one screen where the full sentiment /
// trust / relate system comes together.
function TrustSwitch({
  level,
  setLevel
}) {
  const {
    TrustBadge
  } = window.LudosDesignSystem_17bf5b;
  const levels = ["friends", "taste", "global"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      gap: 2,
      padding: 3,
      background: "var(--surface-1)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-pill)"
    }
  }, levels.map(l => /*#__PURE__*/React.createElement("button", {
    key: l,
    onClick: () => setLevel(l),
    style: {
      border: "none",
      cursor: "pointer",
      borderRadius: "var(--r-pill)",
      padding: "5px 12px",
      background: level === l ? "var(--surface-3)" : "transparent"
    }
  }, /*#__PURE__*/React.createElement(TrustBadge, {
    level: l
  }))));
}
function ReviewRow({
  r
}) {
  const {
    SentimentPill,
    TrustBadge
  } = window.LudosDesignSystem_17bf5b;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 0",
      borderTop: "1px solid var(--border)",
      display: "flex",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      flex: "none",
      borderRadius: "var(--r-pill)",
      background: "var(--surface-3)",
      border: "1px solid var(--border-strong)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      font: "600 13px var(--font-sans)",
      color: "var(--text-secondary)"
    }
  }, r.who.slice(0, 2)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "600 14px var(--font-sans)",
      color: "var(--text-primary)"
    }
  }, r.who), /*#__PURE__*/React.createElement(TrustBadge, {
    level: r.trust
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement(SentimentPill, {
    sentiment: r.sentiment
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "400 17px/1.5 var(--font-voice)",
      color: "var(--text-secondary)",
      margin: 0,
      fontStyle: "italic"
    }
  }, "\u201C", r.text, "\u201D")));
}
function GameDetailScreen({
  game,
  onBack,
  onLog
}) {
  const {
    VerdictBar,
    Button,
    RelateChip,
    SentimentPill
  } = window.LudosDesignSystem_17bf5b;
  const [trust, setTrust] = React.useState("friends");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      border: "none",
      background: "transparent",
      color: "var(--text-secondary)",
      font: "500 13px var(--font-sans)",
      cursor: "pointer",
      marginBottom: 20,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 16
  }), " Library"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 28,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 236,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Cover, {
    game: game,
    height: 314,
    size: 30
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, game.archetype && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "500 12px var(--font-sans)",
      letterSpacing: ".05em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      marginBottom: 8
    }
  }, game.archetype), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "500 40px/1.05 var(--font-voice)",
      color: "var(--text-primary)",
      margin: 0
    }
  }, game.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 15px var(--font-sans)",
      color: "var(--text-secondary)",
      margin: "10px 0 0"
    }
  }, game.studio, " \xB7 ", game.year, " \xB7 ", game.genre), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "400 19px/1.5 var(--font-voice)",
      color: "var(--text-secondary)",
      margin: "16px 0 0",
      maxWidth: 440
    }
  }, game.blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onLog
  }, game.mySentiment ? "Update your verdict" : "Log your verdict"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, game.status === "want" ? "On your want list" : "Add to want list")), game.mySentiment && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "400 13px var(--font-sans)",
      color: "var(--text-muted)"
    }
  }, "You logged"), /*#__PURE__*/React.createElement(SentimentPill, {
    sentiment: game.mySentiment
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-1)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-card)",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginBottom: 18,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "500 22px var(--font-voice)",
      color: "var(--text-primary)",
      margin: 0
    }
  }, "The verdict"), /*#__PURE__*/React.createElement(RelateChip, null, game.dist.reallyLiked + game.dist.liked, "% lean positive"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement(TrustSwitch, {
    level: trust,
    setLevel: setTrust
  }))), /*#__PURE__*/React.createElement(VerdictBar, {
    distribution: game.dist,
    showKey: true
  })), game.reviews.length > 0 && /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "500 22px var(--font-voice)",
      color: "var(--text-primary)",
      margin: "0 0 6px"
    }
  }, "From people you trust"), game.reviews.map((r, i) => /*#__PURE__*/React.createElement(ReviewRow, {
    key: i,
    r: r
  }))));
}
Object.assign(window, {
  GameDetailScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/GameDetailScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/LibraryScreen.jsx
try { (() => {
// Library grid — the default view. A wall of game cards, each showing the
// user's own lean (crimson pill) or a neutral status.
const {
  SentimentPill: SP_lib
} = window.LudosDesignSystem_17bf5b;
function StatusTag({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      font: "500 11px var(--font-sans)",
      letterSpacing: ".03em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-pill)",
      padding: "3px 9px"
    }
  }, children);
}
function GameCard({
  game,
  onOpen
}) {
  const {
    SentimentPill,
    VerdictBar
  } = window.LudosDesignSystem_17bf5b;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpen(game),
    style: {
      textAlign: "left",
      padding: 0,
      border: "1px solid var(--border)",
      background: "var(--surface-1)",
      borderRadius: "var(--r-card)",
      overflow: "hidden",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      transition: "border-color var(--dur-base) var(--ease)"
    },
    onMouseEnter: e => e.currentTarget.style.borderColor = "var(--border-strong)",
    onMouseLeave: e => e.currentTarget.style.borderColor = "var(--border)"
  }, /*#__PURE__*/React.createElement(Cover, {
    game: game,
    height: 132,
    radius: 0,
    size: 22
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "13px 15px 15px",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 15px var(--font-sans)",
      color: "var(--text-primary)"
    }
  }, game.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 12px var(--font-sans)",
      color: "var(--text-muted)",
      marginTop: 2
    }
  }, game.studio, " \xB7 ", game.year)), /*#__PURE__*/React.createElement(VerdictBar, {
    distribution: game.dist
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 2
    }
  }, game.mySentiment ? /*#__PURE__*/React.createElement(SentimentPill, {
    sentiment: game.mySentiment
  }) : /*#__PURE__*/React.createElement(StatusTag, null, game.status === "want" ? "Want to play" : "Playing"))));
}
function LibraryScreen({
  games,
  onOpen,
  title,
  subtitle
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "500 30px var(--font-voice)",
      color: "var(--text-primary)",
      margin: 0
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "400 14px var(--font-sans)",
      color: "var(--text-secondary)",
      margin: "6px 0 0"
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(232px, 1fr))",
      gap: 18
    }
  }, games.map(g => /*#__PURE__*/React.createElement(GameCard, {
    key: g.id,
    game: g,
    onOpen: onOpen
  }))));
}
Object.assign(window, {
  LibraryScreen,
  GameCard,
  StatusTag
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/LibraryScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/LogVerdictModal.jsx
try { (() => {
// Log-a-verdict modal — pick one of the four leans, add an optional note, save.
// The chosen sentiment is the only place crimson focus appears here.
function LogVerdictModal({
  game,
  onClose,
  onSave
}) {
  const {
    Button,
    SentimentPill
  } = window.LudosDesignSystem_17bf5b;
  const [sentiment, setSentiment] = React.useState(game.mySentiment || null);
  const options = ["really-liked", "liked", "didnt-like", "really-disliked"];
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(10,6,8,0.62)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 468,
      maxWidth: "100%",
      background: "var(--surface-1)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-card)",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Cover, {
    game: game,
    height: 68,
    size: 0
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 13px var(--font-sans)",
      color: "var(--text-muted)"
    }
  }, "Log your verdict"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "500 20px var(--font-voice)",
      color: "var(--text-primary)"
    }
  }, game.title)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      border: "none",
      background: "transparent",
      color: "var(--text-muted)",
      cursor: "pointer",
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "500 12px var(--font-sans)",
      letterSpacing: ".04em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      marginBottom: 10
    }
  }, "How did you feel about it?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginBottom: 20
    }
  }, options.map(o => {
    const on = sentiment === o;
    return /*#__PURE__*/React.createElement("button", {
      key: o,
      onClick: () => setSentiment(o),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "12px 13px",
        cursor: "pointer",
        borderRadius: "var(--r-control)",
        textAlign: "left",
        background: on ? "var(--bg-accent)" : "var(--surface-2)",
        border: `1px solid ${on ? "var(--border-accent)" : "var(--border)"}`,
        color: on ? "var(--text-accent)" : "var(--text-secondary)",
        font: "500 14px var(--font-sans)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        flex: "none",
        borderRadius: "var(--r-pill)",
        border: `2px solid ${on ? "var(--accent-500)" : "var(--border-strong)"}`,
        background: on ? "var(--accent-500)" : "transparent"
      }
    }), SENT_LABEL[o]);
  })), /*#__PURE__*/React.createElement("textarea", {
    placeholder: "Add a note in your own words (optional)",
    style: {
      width: "100%",
      boxSizing: "border-box",
      minHeight: 74,
      resize: "vertical",
      background: "var(--surface-2)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-control)",
      padding: "11px 13px",
      color: "var(--text-primary)",
      font: "400 15px/1.5 var(--font-voice)",
      marginBottom: 20
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    disabled: !sentiment,
    onClick: () => onSave(game.id, sentiment)
  }, "Save verdict"))));
}
Object.assign(window, {
  LogVerdictModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/LogVerdictModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
// Ludos sample library data. Cover art is represented by a flat tinted block +
// title (no generated imagery); `tint` is a warm neutral, never a brand hue.
window.LUDOS_GAMES = [{
  id: "hollow",
  title: "Hollow Reverie",
  studio: "Anvil & Ash",
  year: 2021,
  genre: "Metroidvania",
  hours: 34,
  tint: "#3A2D30",
  initial: "H",
  status: "played",
  mySentiment: "really-liked",
  dist: {
    reallyLiked: 61,
    liked: 27,
    didntLike: 8,
    reallyDisliked: 4
  },
  archetype: "The Completionist",
  blurb: "A hand-drawn descent that trusts you to get lost.",
  reviews: [{
    who: "mara",
    trust: "friends",
    sentiment: "really-liked",
    text: "I didn't expect to still be thinking about the ending three weeks later."
  }, {
    who: "dfoster",
    trust: "taste",
    sentiment: "liked",
    text: "The traversal never stopped feeling good. Story lost me in the third act."
  }]
}, {
  id: "signal",
  title: "Signal Garden",
  studio: "Low Orbit",
  year: 2023,
  genre: "Sim",
  hours: 52,
  tint: "#33282E",
  initial: "S",
  status: "playing",
  mySentiment: null,
  dist: {
    reallyLiked: 38,
    liked: 41,
    didntLike: 15,
    reallyDisliked: 6
  },
  archetype: "The Tinkerer",
  blurb: "A quiet systems game about tending signals until they bloom.",
  reviews: [{
    who: "june",
    trust: "friends",
    sentiment: "liked",
    text: "Cozy in the way that sneaks up on you. I lost a weekend."
  }]
}, {
  id: "verdance",
  title: "Verdance",
  studio: "Tall Grass",
  year: 2019,
  genre: "RPG",
  hours: 88,
  tint: "#2E2B33",
  initial: "V",
  status: "played",
  mySentiment: "liked",
  dist: {
    reallyLiked: 44,
    liked: 33,
    didntLike: 14,
    reallyDisliked: 9
  },
  archetype: "The Wanderer",
  blurb: "Enormous, uneven, and impossible to stop thinking about.",
  reviews: [{
    who: "kestrel",
    trust: "taste",
    sentiment: "really-liked",
    text: "The first ten hours are the best in the genre. Then it just… keeps going."
  }]
}, {
  id: "carbon",
  title: "Carbon Line",
  studio: "Redshift",
  year: 2024,
  genre: "Racing",
  hours: 12,
  tint: "#33262A",
  initial: "C",
  status: "want",
  mySentiment: null,
  dist: {
    reallyLiked: 29,
    liked: 46,
    didntLike: 18,
    reallyDisliked: 7
  },
  archetype: null,
  blurb: "Neon-slick arcade racing with a stubborn simulation streak.",
  reviews: []
}, {
  id: "atlas",
  title: "Atlas Undone",
  studio: "Meridian",
  year: 2020,
  genre: "Strategy",
  hours: 120,
  tint: "#2C2C31",
  initial: "A",
  status: "want",
  mySentiment: null,
  dist: {
    reallyLiked: 52,
    liked: 30,
    didntLike: 12,
    reallyDisliked: 6
  },
  archetype: null,
  blurb: "A grand-strategy heartbreaker for the patient.",
  reviews: []
}, {
  id: "lantern",
  title: "Lantern, Softly",
  studio: "Paper Lantern",
  year: 2022,
  genre: "Narrative",
  hours: 6,
  tint: "#38292D",
  initial: "L",
  status: "played",
  mySentiment: "really-liked",
  dist: {
    reallyLiked: 71,
    liked: 19,
    didntLike: 6,
    reallyDisliked: 4
  },
  archetype: "The Feeler",
  blurb: "Six hours that ask one honest question and wait for your answer.",
  reviews: [{
    who: "you",
    trust: "friends",
    sentiment: "really-liked",
    text: "The one I hand to people who say games can't move them."
  }]
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/app/helpers.jsx
try { (() => {
// Small helpers shared across Ludos app screens. Exported to window.
const SENT_LABEL = {
  "really-liked": "Really liked it",
  liked: "Liked it",
  "didnt-like": "Didn't like it",
  "really-disliked": "Really disliked it"
};

// Official Ludos icon — the design system's Lucide-backed Icon component.
const Icon = window.LudosDesignSystem_17bf5b.Icon;

// Flat tinted cover block with the title set in the editorial serif.
function Cover({
  game,
  height = 200,
  radius = "var(--r-card)",
  size = 34
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      borderRadius: radius,
      background: game.tint,
      border: "1px solid var(--border)",
      display: "flex",
      alignItems: "flex-end",
      padding: "14px",
      boxSizing: "border-box",
      overflow: "hidden",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 10,
      right: 14,
      fontFamily: "var(--font-voice)",
      fontSize: 64,
      lineHeight: 1,
      color: "var(--text-primary)",
      opacity: 0.14,
      fontWeight: 600
    }
  }, game.initial), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-voice)",
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1.05,
      color: "var(--text-primary)"
    }
  }, game.title));
}
Object.assign(window, {
  SENT_LABEL,
  Icon,
  Cover
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/helpers.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.ThemeRoot = __ds_scope.ThemeRoot;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.RelateChip = __ds_scope.RelateChip;

__ds_ns.SentimentPill = __ds_scope.SentimentPill;

__ds_ns.TrustBadge = __ds_scope.TrustBadge;

__ds_ns.VerdictBar = __ds_scope.VerdictBar;

})();
