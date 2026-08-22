// Cover art registry — maps one piece of artwork to every slot that shows it.
//
// Drop a full-resolution file in `public/covers/` named after the key below
// (e.g. `public/covers/hades-ii.webp`) and run `npm run covers`. Every slot
// listed for that game switches to it. Anything without a drop-in keeps the
// low-resolution art exported from the design tool.
//
// Recommended size: 600×900 (Steam vertical capsule). That covers the largest
// on-screen use — the head-to-head outcome at 3× — with headroom.
//
//   keys  — game keys expanded across the `cv-<prefix>-<key>` slot naming.
//           Several keys per game because the same title was named
//           inconsistently across screens in the original prototype.
//   slots — explicit slot ids that don't follow that convention.

export const COVER_SOURCES = {
  // ── Backlog / duel games ────────────────────────────────────────
  'hades-ii':          { title: 'Hades II',                keys: ['hades', 'hades2'], slots: ['cv-coll-fav-5', 'ff-maya', 'cv-act-a-hades'] },
  'outer-wilds':       { title: 'Outer Wilds',             keys: ['outer', 'outerwilds'], slots: ['cv-coll-cozy-3', 'ff-dana'] },
  'hollow-knight':     { title: 'Hollow Knight',           keys: ['hollow'], slots: ['ff-sam'] },
  'tunic':             { title: 'Tunic',                   keys: ['tunic'] },
  'celeste':           { title: 'Celeste',                 keys: ['celeste'] },
  'citizen-sleeper':   { title: 'Citizen Sleeper',         keys: ['citizen', 'citizensleeper'], slots: ['cv-coll-cozy-5', 'ff-jordan'] },
  'slay-the-spire':    { title: 'Slay the Spire',          keys: ['sts', 'slaythespire'] },
  'disco-elysium':     { title: 'Disco Elysium',           keys: ['disco'], slots: ['cv-coll-fav-7'] },
  'stray':             { title: 'Stray',                   keys: ['stray', 'strayss'] },
  'baldurs-gate-3':    { title: "Baldur's Gate 3",         keys: ['bg3'], slots: ['cv-coll-cozy-4', 'ff-chris'] },
  'zelda-totk':        { title: 'Zelda: Tears of the Kingdom', keys: ['totk', 'zelda'] },
  'dark-souls-3':      { title: 'Dark Souls III',          keys: ['ds3', 'darksouls'], slots: ['cv-coll-fav-3'] },

  // ── Elden Ring also fills the Discover spotlight ────────────────
  'elden-ring':        { title: 'Elden Ring',              keys: ['elden', 'eldenring'], slots: ['cv-spotlight', 'cv-list-fav5', 'cv-coll-fav-4', 'ff-alex', 'cv-rev-elden', 'cv-act-a-elden'] },

  // Game detail's hero is landscape key art, not a vertical capsule, so it
  // gets its own registry key — an `elden-ring` cover drop-in must never land
  // in the banner slot. Drop `public/covers/elden-ring-hero.webp` (any wide
  // landscape crop, ~1600x1200 or larger) and run `npm run covers`.
  'elden-ring-hero':   { title: 'Elden Ring — detail hero',  slots: ['cv-detail-hero'] },

  // ── Rail-only titles ────────────────────────────────────────────
  'pizza-tower':       { title: 'Pizza Tower',             keys: ['pizzatower'] },
  'cocoon':            { title: 'Cocoon',                  keys: ['cocoon'] },
  'inscryption':       { title: 'Inscryption',             keys: ['inscryption'] },
  'tetris-effect':     { title: 'Tetris Effect',           keys: ['tetriseffect'] },
  'silksong':          { title: 'Silksong',                keys: ['sflegends'] },
  '007-first-light':   { title: '007 First Light',         keys: ['firstlight'] },
  'forza-horizon-6':   { title: 'Forza Horizon 6',         keys: ['forza'] },
  'pragmata':          { title: 'PRAGMATA',                keys: ['pragmata'] },
  'subnautica-2':      { title: 'Subnautica 2',            keys: ['subnautica'] },

  // ── Library-only titles ─────────────────────────────────────────
  'starfield':         { title: 'Starfield',                keys: ['starfield'] },
  'ac-valhalla':       { title: "Assassin's Creed Valhalla", keys: ['ac'] },

  // ── Played-games catalogue ──────────────────────────────────────
  'sekiro':            { title: 'Sekiro: Shadows Die Twice', keys: ['sekiro'] },
  'ac-black-flag':     { title: "Assassin's Creed Black Flag", keys: ['acbf'] },
  'gamble-with-your-friends': { title: 'Gamble With Your Friends', keys: ['gamble'] },
  'meccha-chameleon':  { title: 'Meccha Chameleon',        keys: ['meccha'] },
  'mina-the-hollower': { title: 'Mina the Hollower',       keys: ['mina'] },

  // ── Hand-authored picker cards ──────────────────────────────────
  'balatro':           { title: 'Balatro',                 slots: ['cv-played-blank-1', 'cv-coll-hh-3', 'ff-priya'] },
  'mario-galaxy-2':    { title: 'Super Mario Galaxy 2',    slots: ['cv-played-blank-2', 'cv-list-fav7'] },
  'katana-zero':       { title: 'Katana Zero',             slots: ['cv-played-blank-3', 'cv-list-fav3'] },
  // Also the mock game-detail card on onboarding screen 3.
  'clair-obscur-33':   { title: 'Clair Obscur: Expedition 33', slots: ['cv-played-blank-4', 'intro-elden-cover', 'cv-list-fav0'] },
  'lies-of-p':         { title: 'Lies of P',               slots: ['cv-played-blank-5'] },
  'dead-cells':        { title: 'Dead Cells',              slots: ['cv-played-blank-6'] },
  'nier-automata':     { title: 'NieR: Automata',          slots: ['cv-played-blank-7', 'cv-list-fav4', 'cv-coll-fav-6', 'cv-act-a-nier'] },
  'sea-of-stars':      { title: 'Sea of Stars',            keys: ['seaofstars'], slots: ['cv-played-blank-8', 'cv-coll-cozy-6'] },
  'until-then':        { title: 'Until Then',              slots: ['cv-played-blank-9', 'cv-list-fav2', 'cv-coll-cozy-7'] },
  'ac-odyssey':        { title: "Assassin's Creed Odyssey", slots: ['cv-played-blank-10', 'cv-rev-acodyssey'] },

  // ── Profile-only titles ─────────────────────────────────────────
  // Neither appears anywhere else in the app — they exist because the profile
  // shows what *you* played, which is a different shelf from Discover's.
  'persona-3-reload':  { title: 'Persona 3 Reload',        slots: ['cv-rev-persona3', 'cv-act-a-persona3'] },
  'persona-4-golden':  { title: 'Persona 4 Golden',        slots: ['cv-act-a-persona4'] },

  // The profile's own two images, neither of them a 2:3 capsule, so each gets
  // its own registry key rather than borrowing a game's art. Both render as
  // their placeholder — a surface-2 band, initials in the circle — until the
  // files land. Drop `public/covers/profile-cover.webp` (wide, ~1600×900 or
  // larger) and `public/covers/profile-avatar.webp` (square) and run
  // `npm run covers`.
  'profile-cover':     { title: 'Profile cover banner',    slots: ['cv-profile-cover'] },
  'profile-avatar':    { title: 'Profile avatar',          slots: ['cv-profile-avatar'] },

  // ── Brand ───────────────────────────────────────────────────────
  // Not a cover: the welcome screen logo. Transparent PNG works well here.
  'ludos-logo':        { title: 'Ludos logo',              slots: ['intro-logo'] },

  // The 18 onboarding marquee tiles (disc-r1-1 … disc-r3-6) are decorative and
  // stay on their exported art. To promote one, add its slot id to a game, e.g.
  //   'hades-ii': { title: 'Hades II', keys: ['hades','hades2'], slots: ['disc-r1-3'] },
};

// ── Friends ─────────────────────────────────────────────────────
//
// The feed's covers are `ff-<person key>`, keyed by who did the thing rather
// than by the game — one row, one friend — so they sit outside the
// `cv-<prefix>-<game key>` convention and are mapped by hand above.

// ── Library ─────────────────────────────────────────────────────
//
// The shelf (`cv-lib-*`) and list rows (`cv-list-<key>`) follow the usual
// convention, so a game registered above already fills its Library slots.
// The positional slots — `cv-list-fav0…7` and the `cv-coll-*` strips — are
// attached to whichever game the design's own manifest put there.

/**
 * Slots that intentionally have no artwork.
 * Reviewer avatars render initials instead.
 */
export const NO_ARTWORK = ['cv-review-1', 'cv-review-2', 'cv-review-3'];
