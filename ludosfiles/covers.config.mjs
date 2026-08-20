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
  'hades-ii':          { title: 'Hades II',                keys: ['hades', 'hades2'], slots: ['cv-coll-fav-5'] },
  'outer-wilds':       { title: 'Outer Wilds',             keys: ['outer', 'outerwilds'], slots: ['cv-coll-cozy-3'] },
  'hollow-knight':     { title: 'Hollow Knight',           keys: ['hollow'] },
  'tunic':             { title: 'Tunic',                   keys: ['tunic'] },
  'celeste':           { title: 'Celeste',                 keys: ['celeste'] },
  'citizen-sleeper':   { title: 'Citizen Sleeper',         keys: ['citizen', 'citizensleeper'], slots: ['cv-coll-cozy-5'] },
  'slay-the-spire':    { title: 'Slay the Spire',          keys: ['sts', 'slaythespire'] },
  'disco-elysium':     { title: 'Disco Elysium',           keys: ['disco'], slots: ['cv-coll-fav-7'] },
  'stray':             { title: 'Stray',                   keys: ['stray', 'strayss'] },
  'baldurs-gate-3':    { title: "Baldur's Gate 3",         keys: ['bg3'], slots: ['cv-coll-cozy-4'] },
  'zelda-totk':        { title: 'Zelda: Tears of the Kingdom', keys: ['totk', 'zelda'] },
  'dark-souls-3':      { title: 'Dark Souls III',          keys: ['ds3'], slots: ['cv-coll-fav-3'] },

  // ── Elden Ring also fills the Discover spotlight ────────────────
  'elden-ring':        { title: 'Elden Ring',              keys: ['elden'], slots: ['cv-spotlight', 'cv-list-fav5', 'cv-coll-fav-4'] },

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

  // ── Played-games catalogue ──────────────────────────────────────
  'sekiro':            { title: 'Sekiro: Shadows Die Twice', keys: ['sekiro'] },
  'ac-black-flag':     { title: "Assassin's Creed Black Flag", keys: ['acbf'] },
  'gamble-with-your-friends': { title: 'Gamble With Your Friends', keys: ['gamble'] },
  'meccha-chameleon':  { title: 'Meccha Chameleon',        keys: ['meccha'] },
  'mina-the-hollower': { title: 'Mina the Hollower',       keys: ['mina'] },

  // ── Hand-authored picker cards ──────────────────────────────────
  'balatro':           { title: 'Balatro',                 slots: ['cv-played-blank-1', 'cv-coll-hh-3'] },
  'mario-galaxy-2':    { title: 'Super Mario Galaxy 2',    slots: ['cv-played-blank-2', 'cv-list-fav7'] },
  'katana-zero':       { title: 'Katana Zero',             slots: ['cv-played-blank-3', 'cv-list-fav3'] },
  // Also the mock game-detail card on onboarding screen 3.
  'clair-obscur-33':   { title: 'Clair Obscur: Expedition 33', slots: ['cv-played-blank-4', 'intro-elden-cover', 'cv-list-fav0'] },
  'lies-of-p':         { title: 'Lies of P',               slots: ['cv-played-blank-5'] },
  'dead-cells':        { title: 'Dead Cells',              slots: ['cv-played-blank-6'] },
  'nier-automata':     { title: 'NieR: Automata',          slots: ['cv-played-blank-7', 'cv-list-fav4', 'cv-coll-fav-6'] },
  'sea-of-stars':      { title: 'Sea of Stars',            keys: ['seaofstars'], slots: ['cv-played-blank-8', 'cv-coll-cozy-6'] },
  'until-then':        { title: 'Until Then',              slots: ['cv-played-blank-9', 'cv-list-fav2', 'cv-coll-cozy-7'] },
  'ac-odyssey':        { title: "Assassin's Creed Odyssey", slots: ['cv-played-blank-10'] },

  // ── Brand ───────────────────────────────────────────────────────
  // Not a cover: the welcome screen logo. Transparent PNG works well here.
  'ludos-logo':        { title: 'Ludos logo',              slots: ['intro-logo'] },

  // The 18 onboarding marquee tiles (disc-r1-1 … disc-r3-6) are decorative and
  // stay on their exported art. To promote one, add its slot id to a game, e.g.
  //   'hades-ii': { title: 'Hades II', keys: ['hades','hades2'], slots: ['disc-r1-3'] },
};

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
