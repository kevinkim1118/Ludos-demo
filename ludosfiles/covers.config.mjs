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
  'hades-ii':          { title: 'Hades II',                keys: ['hades', 'hades2'] },
  'outer-wilds':       { title: 'Outer Wilds',             keys: ['outer', 'outerwilds'] },
  'hollow-knight':     { title: 'Hollow Knight',           keys: ['hollow'] },
  'tunic':             { title: 'Tunic',                   keys: ['tunic'] },
  'celeste':           { title: 'Celeste',                 keys: ['celeste'] },
  'citizen-sleeper':   { title: 'Citizen Sleeper',         keys: ['citizen', 'citizensleeper'] },
  'slay-the-spire':    { title: 'Slay the Spire',          keys: ['sts', 'slaythespire'] },
  'disco-elysium':     { title: 'Disco Elysium',           keys: ['disco'] },
  'stray':             { title: 'Stray',                   keys: ['stray'] },
  'baldurs-gate-3':    { title: "Baldur's Gate 3",         keys: ['bg3'] },
  'zelda-totk':        { title: 'Zelda: Tears of the Kingdom', keys: ['totk', 'zelda'] },
  'dark-souls-3':      { title: 'Dark Souls III',          keys: ['ds3'] },

  // ── Elden Ring also fills the Discover spotlight ────────────────
  'elden-ring':        { title: 'Elden Ring',              keys: ['elden'], slots: ['cv-spotlight'] },

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
  'balatro':           { title: 'Balatro',                 slots: ['cv-played-blank-1'] },
  'mario-galaxy-2':    { title: 'Super Mario Galaxy 2',    slots: ['cv-played-blank-2'] },
  'katana-zero':       { title: 'Katana Zero',             slots: ['cv-played-blank-3'] },
  // Also the mock game-detail card on onboarding screen 3.
  'clair-obscur-33':   { title: 'Clair Obscur: Expedition 33', slots: ['cv-played-blank-4', 'intro-elden-cover'] },
  'lies-of-p':         { title: 'Lies of P',               slots: ['cv-played-blank-5'] },
  'dead-cells':        { title: 'Dead Cells',              slots: ['cv-played-blank-6'] },
  'nier-automata':     { title: 'NieR: Automata',          slots: ['cv-played-blank-7'] },
  'sea-of-stars':      { title: 'Sea of Stars',            keys: ['seaofstars'], slots: ['cv-played-blank-8'] },
  'until-then':        { title: 'Until Then',              slots: ['cv-played-blank-9'] },
  'ac-odyssey':        { title: "Assassin's Creed Odyssey", slots: ['cv-played-blank-10'] },

  // ── Brand ───────────────────────────────────────────────────────
  // Not a cover: the welcome screen logo. Transparent PNG works well here.
  'ludos-logo':        { title: 'Ludos logo',              slots: ['intro-logo'] },

  // The 18 onboarding marquee tiles (disc-r1-1 … disc-r3-6) are decorative and
  // stay on their exported art. To promote one, add its slot id to a game, e.g.
  //   'hades-ii': { title: 'Hades II', keys: ['hades','hades2'], slots: ['disc-r1-3'] },
};

/**
 * Slots that intentionally have no artwork.
 * Reviewer avatars render initials instead.
 */
export const NO_ARTWORK = ['cv-review-1', 'cv-review-2', 'cv-review-3'];
