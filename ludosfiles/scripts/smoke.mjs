import { existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const OUT = process.env.SMOKE_OUT ?? join(tmpdir(), 'ludos-smoke');
mkdirSync(OUT, { recursive: true });

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';

// Falls back to whatever `npx playwright install chromium` put on this machine.
const BROWSER = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const browser = await chromium.launch(
  existsSync(BROWSER) ? { executablePath: BROWSER } : {},
);
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));

const text = () => page.locator('.screen').innerText();
// innerText reflects text-transform, so compare case-insensitively.
const has = async (s) => (await text()).toLowerCase().includes(s.toLowerCase());
const ok = (label, cond) => console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}`);

// ── Onboarding walkthrough ────────────────────────────────────
await page.goto(BASE, { waitUntil: 'domcontentloaded' });
ok('starts on welcome', await has('Welcome to Ludos'));

for (const expect of ['Discover video games', 'Find video games to play', 'Read honest reviews']) {
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.waitForTimeout(150);
  ok(`intro → ${expect}`, await has(expect));
}

await page.getByRole('button', { name: 'Get started' }).click();
await page.waitForTimeout(200);
ok('reaches played-games picker', await has('What games have you played?'));
ok('Next disabled at 0 picks', await has("Pick at least 5 more games"));

// Select the five the picker asks for.
const cards = page.locator('.scroll-y button[aria-pressed]');
for (let i = 0; i < 5; i++) await cards.nth(i).click();
await page.waitForTimeout(200);
ok('counter flips at 5', await has('5 games ready for your Finished list'));

await page.getByRole('button', { name: 'Next', exact: true }).click();
await page.waitForTimeout(200);
ok('shows analyzing beat', await has("Analyzing what you've played"));

await page.waitForTimeout(2600);
ok('lands on result', await has('The Completionist'));
ok('result shows seeded backlog', await has('6 games in your backlog'));

await page.getByRole('button', { name: 'Continue' }).click();
await page.waitForTimeout(200);
ok('reaches done', await has("You're all set!"));

await page.getByRole('button', { name: 'Enter Ludos' }).click();
await page.waitForTimeout(300);
ok('enters Discover', await has('What to play next'));

// ── Discover: re-roll and start playing ───────────────────────
const firstPick = (await text()).includes('Hollow Knight');
await page.getByRole('button', { name: 'Another' }).click();
await page.waitForTimeout(400);
ok('Another re-rolls the pick', firstPick && !(await text()).includes('From your Backlog\nHollow Knight'));

await page.getByRole('button', { name: 'Start playing' }).click();
await page.waitForTimeout(300);
ok('flips to Currently playing', await has('Currently playing'));
ok('shows now-playing toast', await has('Now playing'));
ok('h2h card copy changes', await has('Want to play something new?'));

await page.getByRole('button', { name: 'Update Status' }).click();
await page.waitForTimeout(250);
ok('status dropdown opens', await has('Mark as finished') && (await has('Move to backlog')));

await page.getByRole('button', { name: 'Move to backlog' }).click();
await page.waitForTimeout(300);
ok('clears back to What to play next', await has('What to play next'));
ok('backlog toast fires', await has('Moved'));

// ── Rail → status sheet → playing ─────────────────────────────
await page.waitForTimeout(1800);
await page.getByRole('button', { name: 'Add Celeste' }).click();
await page.waitForTimeout(400);
ok('status sheet opens for rail game', await has('Add Celeste to…'));

await page.getByRole('button', { name: 'Mark as playing' }).click();
await page.waitForTimeout(600);
ok('rail game becomes currently playing', (await text()).includes('Currently playing') && (await text()).includes('Celeste'));

// ── Head-to-head ──────────────────────────────────────────────
await page.waitForTimeout(1600);
await page.getByRole('button', { name: /Want to play something new/ }).click();
await page.waitForTimeout(300);
ok('opens head-to-head intent', await has('what are you in the mood for?'));

// "Long haul" matches only 3 backlog games, so the champion runs out of
// challengers and wins by exhaustion.
await page.getByRole('button', { name: /Chip away at a larger game/ }).click();
await page.getByRole('button', { name: 'Start comparing' }).click();
await page.waitForTimeout(400);
ok('duel starts', await has('Which would you rather play?'));

const pickLeft = async () => {
  await page.locator('.screen [style*="grid-template-columns: 1fr 1fr"] > button').first().click();
  await page.waitForTimeout(650);
};

for (let i = 0; i < 5 && (await has('Which would you rather play?')); i++) await pickLeft();
ok('short pool resolves to an outcome', await has('Your pick to play next'));
ok('outcome reason is "last one standing"', await has('Last one standing'));

// "Fast & fun" matches 4 games, so three straight wins ends it early.
await page.getByRole('button', { name: 'Keep comparing' }).click();
await page.waitForTimeout(300);
if (await has('what are you in the mood for?')) {
  await page.getByRole('button', { name: /Something fast & fun/ }).click();
  await page.getByRole('button', { name: 'Start comparing' }).click();
  await page.waitForTimeout(400);
}
ok('second duel starts', await has('Which would you rather play?'));

for (let i = 0; i < 5 && (await has('Which would you rather play?')); i++) await pickLeft();
ok('streak path resolves', await has('Your pick to play next'));

const markBtn = page.getByRole('button', { name: /Mark .* as playing/ });
const winner = (await markBtn.innerText()).replace(/^Mark\s+|\s+as playing$/gi, '').trim();
await markBtn.click();
await page.waitForTimeout(700);
ok('winner lands on Discover as playing', (await text()).includes('Currently playing'));
await page.screenshot({ path: `${OUT}/flow-final.png` });

// ── Persistence across a cold load ────────────────────────────
// The point of the localStorage save: an installed app must not replay
// onboarding, and must not forget what's in flight.
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(600);
ok('reload does not replay onboarding', !(await has('Welcome to Ludos')));
ok('reload lands on Discover', await has('Currently playing'));
ok('reload keeps the playing game', (await text()).includes(winner));

// The pick card can only offer "From your Backlog" if the backlog survived too.
await page.getByRole('button', { name: 'Update Status' }).click();
await page.waitForTimeout(250);
await page.getByRole('button', { name: 'Move to backlog' }).click();
await page.waitForTimeout(400);
ok('reload keeps the backlog', await has('From your Backlog'));

await page.goto(`${BASE}/?reset`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
ok('?reset returns to onboarding', await has('Welcome to Ludos'));

// ── iOS install hint ──────────────────────────────────────────
// This browser isn't iOS, so the hint must stay away — showing "tap Share" to
// everyone is the failure mode worth guarding.
const hint = page.locator('[role="note"]');
await page.goto(`${BASE}/?screen=home:discover`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1900);
ok('install hint stays hidden off iOS', (await hint.count()) === 0);

await page.goto(`${BASE}/?hint&screen=home:discover`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
ok('?hint forces the install hint', await has('Add to Home Screen'));

await page.getByRole('button', { name: 'Dismiss' }).click();
await page.waitForTimeout(700);
ok('dismissing unmounts the hint', (await hint.count()) === 0);

// ── Update prompt ─────────────────────────────────────────────
// A new worker used to take over silently and reload the page under whoever was
// using it. It waits now, and this is what asks. `?update` fakes one, the way
// `?hint` fakes the install hint — a real one needs two deploys to look at.
await page.goto(`${BASE}/?screen=home:discover`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
ok('update prompt stays hidden with nothing waiting', !(await has('new version')));

await page.goto(`${BASE}/?update&screen=home:discover`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
ok('?update forces the update prompt', await has('A new version of Ludos is ready'));

await page.getByRole('button', { name: 'Reload' }).click();
await page.waitForTimeout(900);
ok(
  'Reload reloads onto the new build',
  (await page.evaluate(() => performance.getEntriesByType('navigation')[0]?.type)) === 'reload' &&
    (await has('What to play next')),
);

await page.getByRole('button', { name: 'Not now' }).click();
await page.waitForTimeout(700);
ok('dismissing unmounts the update prompt', !(await has('new version')));

// ── Phone layout fills the viewport ───────────────────────────
// The installed app used to leave a gap under the tab bar until you scrolled:
// iOS resolves dvh against Safari's viewport on an installed app's first paint.
// The phone path uses a percentage chain now, so the screen must match the
// viewport exactly, with nothing left over.
for (const [w, h] of [[402, 874], [390, 844], [375, 667]]) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`${BASE}/?screen=home:discover`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  const fill = await page.evaluate(() => ({
    screenH: Math.round(document.querySelector('.screen').getBoundingClientRect().height),
    innerH: window.innerHeight,
    scrolls: document.documentElement.scrollHeight > window.innerHeight + 1,
  }));
  ok(`phone ${w}x${h} screen fills the viewport`, fill.screenH === fill.innerH && !fill.scrolls);
}

// ── Desktop framing ───────────────────────────────────────────
await page.setViewportSize({ width: 1200, height: 1000 });
await page.goto(`${BASE}/?screen=home:discover`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const frame = await page.locator('.phone').boundingBox();
ok('desktop keeps the 402px iPhone-width frame', Math.round(frame.width) === 402);
ok('tall desktop keeps the full 868px screen', Math.round(frame.height) === 890);
await page.screenshot({ path: `${OUT}/desktop.png` });

// A laptop viewport is shorter than the 938px the frame wants. It has to fit
// rather than push the tab bar below the fold.
await page.setViewportSize({ width: 1200, height: 760 });
await page.waitForTimeout(400);
const short = await page.locator('.phone').boundingBox();
const overflow = await page.evaluate(
  () => document.documentElement.scrollHeight - window.innerHeight,
);
ok('short desktop fits the frame in the viewport', short.y + short.height <= 760);
ok('short desktop needs no page scroll', overflow <= 0);

// ── Intro screens on a short screen ───────────────────────────
// Each intro pairs a fixed-size illustration with a heading under it. The
// illustration has to give up the height, never the words.
const clearanceBelowCopy = () =>
  page.evaluate(() => {
    const scroller = document.querySelector('.scroll-y');
    const copy = document.querySelector('h1') ? document.querySelector('p') : document.querySelector('h2');
    if (!scroller || !copy) return null;
    return scroller.getBoundingClientRect().bottom - copy.getBoundingClientRect().bottom;
  });

await page.setViewportSize({ width: 402, height: 730 });
for (const step of ['intro1', 'intro2', 'intro3', 'intro4']) {
  await page.goto(`${BASE}/?reset&screen=onboarding:${step}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(450);
  const clearance = await clearanceBelowCopy();
  ok(`${step} copy clears the step dots on a short screen`, clearance !== null && clearance >= 0);
}

// ── Played-games search ───────────────────────────────────────
// The hand-authored cards used to sit in a second list the filter never
// touched, so ten titles vanished the moment you typed their name.
{
  const sq = await browser.newPage({ viewport: { width: 402, height: 874 } });
  await sq.goto(`${BASE}/?reset&screen=onboarding:played`, { waitUntil: 'networkidle' });
  await sq.waitForTimeout(700);
  const box = sq.getByPlaceholder('Search for a game');
  const count = () => sq.locator('.scroll-y button[aria-pressed]').count();

  let missing = [];
  for (const q of ['balatro', 'katana zero', 'lies of p', 'dead cells', 'nier automata',
                   'sea of stars', 'until then', 'super mario galaxy 2', 'clair obscur']) {
    await box.fill(q);
    await sq.waitForTimeout(200);
    if ((await count()) === 0) missing.push(q);
  }
  ok(`every picker card is searchable${missing.length ? ` (missing: ${missing})` : ''}`, missing.length === 0);

  // Punctuation in the title shouldn't have to be typed.
  await box.fill('assassins creed odyssey');
  await sq.waitForTimeout(220);
  ok('search ignores punctuation in titles', (await count()) > 0);

  await box.fill('zzzqqq');
  await sq.waitForTimeout(220);
  ok('a genuine miss still shows the empty state', await sq.locator('.screen').innerText().then((t) => t.includes('Nothing matches')));

  await box.fill('');
  await sq.waitForTimeout(250);
  ok('clearing the query restores the whole grid', (await count()) >= 30);
  await sq.close();
}

// ── Library ───────────────────────────────────────────────────
// The shelf is fixed demo content, so what's worth guarding is the machinery
// around it: the chip filter, the two-pane slide, and the editor's drafts. The
// editor commits into four per-list override maps at once — a Save that only
// half-lands leaves a list wearing one edit's title and another's order.
{
  const lib = await browser.newPage({ viewport: { width: 402, height: 874 } });
  const ltext = () => lib.locator('.screen').innerText();
  const lhas = async (t) => (await ltext()).includes(t);
  // Shelf cards are the only thing carrying the lift treatment on this screen.
  const cards = () => lib.locator('.u-lift').count();

  await lib.goto(`${BASE}/?screen=library`, { waitUntil: 'networkidle' });
  await lib.waitForTimeout(500);
  ok('library opens on the backlog shelf', (await lhas('Your library')) && (await cards()) === 6);

  const chips = (await lib.locator('[aria-pressed]').allInnerTexts()).join(',').replace(/\n/g, '');
  ok('chip counts read 6/4/4/2/16', chips === 'Backlog6,Playing4,Finished4,DNF2,All16');

  for (const [chip, n, title] of [
    ['Playing', 4, 'Playing now'],
    ['Finished', 4, 'Finished'],
    ['DNF', 2, 'Did not finish'],
    ['All', 16, 'All games'],
  ]) {
    await lib.locator('[aria-pressed]', { hasText: new RegExp(`^${chip}`) }).first().click();
    await lib.waitForTimeout(300);
    ok(`${chip} filters to ${n} and retitles`, (await cards()) === n && (await lhas(title)));
  }

  // Each status shows a different fact, and picking the wrong one reads as a
  // bug rather than a blank: hours played under a game you never started.
  const shelf = await ltext();
  ok(
    'each status carries its own meta line',
    shelf.includes('~21 hours') &&
      shelf.includes('40h played') &&
      shelf.includes("Aug '24") &&
      shelf.includes('9h played'),
  );

  // A slot with no registry entry renders an empty box rather than a broken
  // image, so missing artwork is silent — worth asserting outright.
  const art = await lib.evaluate(() => {
    const cards = [...document.querySelectorAll('.u-lift')];
    return {
      cards: cards.length,
      withArt: cards.filter((c) => c.querySelector('img')).length,
      broken: [...document.querySelectorAll('img')].filter(
        (i) => i.complete && i.naturalWidth === 0,
      ).length,
    };
  });
  ok(
    'every shelf card resolves its cover',
    art.cards === 16 && art.withArt === 16 && art.broken === 0,
  );

  // Both panes are mounted at once and the track slides between them, so a
  // broken transform leaves the wrong pane on screen with no error.
  await lib.goto(`${BASE}/?screen=library:lists`, { waitUntil: 'networkidle' });
  await lib.waitForTimeout(500);
  const track = await lib.evaluate(
    () => [...document.querySelectorAll('div')].find((d) => d.style.width === '200%')?.style.transform,
  );
  ok('?screen=library:lists lands on the lists pane', track === 'translateX(-50%)');
  ok('collections list their counts', await lhas('8 games · updated 2d ago'));

  const strips = await lib.evaluate(() =>
    [...document.querySelectorAll('.scroll-x')]
      .filter((el) => el.querySelector('img, span'))
      .map((el) => el.children.length),
  );
  ok('cover strips fill from the collection count', strips.join(',').endsWith('8,8,4'));

  // A ranked list numbers its rows; an unranked one must not.
  await lib.locator('button', { hasText: 'Favorite Games' }).click();
  await lib.waitForTimeout(600);
  ok(
    'a ranked list opens with numbered rows',
    (await lhas('Ranking of my favorite games')) && (await lhas('1.')),
  );

  await lib.getByLabel('Back to your library').click();
  await lib.waitForTimeout(500);
  await lib.locator('button', { hasText: 'Cozy night-ins' }).click();
  await lib.waitForTimeout(600);
  ok('an unranked list shows no positions', !(await lhas('1.')) && (await lhas('Spiritfarer')));

  // Cancel has to drop every draft, not just the ones left untouched.
  await lib.getByLabel('Edit list').click();
  await lib.waitForTimeout(500);
  ok('the editor opens prefilled', (await lib.locator('#lib-edit-title').inputValue()) === 'Cozy night-ins');
  ok('profile toggle copy follows the toggle', await lhas('Visible to others on your profile'));
  await lib.getByLabel('Toggle display on profile').click();
  await lib.waitForTimeout(200);
  ok('flipping it hides the list instead', await lhas('Hidden — only you can see this list'));

  await lib.locator('#lib-edit-title').fill('Scratch title');
  await lib.locator('button', { hasText: /^Cancel$/ }).click();
  await lib.waitForTimeout(500);
  ok('cancel discards the drafts', (await lhas('Cozy night-ins')) && !(await lhas('Scratch title')));

  // Reordering is applied through CSS `order`, so a row never remounts — and
  // the saved order has to survive the panel closing and reopening.
  await lib.getByLabel('Edit list').click();
  await lib.waitForTimeout(500);
  await lib.locator('#lib-edit-title').fill('Rainy days');
  await lib.getByLabel('Toggle ranked list').click();
  await lib.waitForTimeout(150);
  const rows = () =>
    lib.evaluate(() =>
      [...document.querySelectorAll('[draggable="true"]')].map((r) => r.innerText.replace(/\n/g, ' ').trim()),
    );
  const before = (await rows())[0];
  await lib.locator('[draggable="true"]').nth(0).dragTo(lib.locator('[draggable="true"]').nth(2));
  await lib.waitForTimeout(300);
  const after = await rows();
  ok('dragging a row reorders and renumbers the draft', after[0] !== before && after[0].startsWith('1.'));

  await lib.locator('button', { hasText: /^Save$/ }).click();
  await lib.waitForTimeout(600);
  ok(
    'save commits title, ranked flag and order together',
    (await lhas('Rainy days')) && (await lhas('1.')) && (await lhas(after[0].replace(/^1\.\s*/, ''))),
  );
  await lib.close();
}

// ── Friends ───────────────────────────────────────────────────
// The feed is fixed content, so what's worth guarding is the arithmetic
// around it: chip counts are taken across the whole feed rather than the group
// they sit above, and a group with nothing left in it drops out instead of
// leaving a bare rule behind.
{
  const fr = await browser.newPage({ viewport: { width: 402, height: 874 } });
  const ftext = () => fr.locator('.screen').innerText();
  // The group rules are uppercased in CSS and innerText reflects that.
  const fhas = async (t) => (await ftext()).toLowerCase().includes(t.toLowerCase());
  // One cover per feed row, and nothing else on the screen carries art.
  const rows = () => fr.locator('.screen img').count();

  await fr.goto(`${BASE}/?screen=friends`, { waitUntil: 'networkidle' });
  await fr.waitForTimeout(500);
  ok(
    'friends opens on the grouped feed',
    (await fhas('Today')) && (await fhas('This week')) && (await rows()) === 7,
  );

  const chips = (await fr.locator('[aria-pressed]').allInnerTexts()).join(',').replace(/\n/g, '');
  ok(
    'chip counts read across the whole feed',
    chips === 'All activity7,Finishes & reviews3,Ratings2,Playing1',
  );

  ok('the footer counts your friends', await fhas("You're all caught up · 8 friends"));

  const art = await fr.evaluate(() => {
    const img = [...document.querySelectorAll('.screen img')];
    return { n: img.length, broken: img.filter((i) => i.complete && i.naturalWidth === 0).length };
  });
  ok('every feed row resolves its cover', art.n === 7 && art.broken === 0);

  // Ratings has one row in each group; Playing has one, in Today only.
  await fr.locator('[aria-pressed]', { hasText: /^Ratings/ }).first().click();
  await fr.waitForTimeout(350);
  ok(
    'a filter keeps the groups that still have rows',
    (await rows()) === 2 && (await fhas('Today')) && (await fhas('This week')),
  );

  await fr.locator('[aria-pressed]', { hasText: /^Playing/ }).first().click();
  await fr.waitForTimeout(350);
  ok(
    'an emptied group drops out entirely',
    (await rows()) === 1 && (await fhas('Today')) && !(await fhas('This week')),
  );

  // The friends sheet and the add panel are the tab's two dismissible layers.
  await fr.getByLabel('Friends list').click();
  await fr.waitForTimeout(450);
  ok(
    'the friends sheet lists everyone and who is online',
    (await fhas('8 Friends · 5 online')) && (await fhas('Last seen 3d ago')),
  );

  await fr.locator('[role="dialog"]').evaluate((el) => el.previousElementSibling.click());
  await fr.waitForTimeout(450);
  await fr.getByLabel('Add friends').click();
  await fr.waitForTimeout(450);
  ok(
    'the add panel slides in over the feed',
    (await fhas('Or invite directly')) && (await fhas('2 mutual friends')),
  );

  await fr.getByLabel('Search by username').fill('em');
  await fr.waitForTimeout(250);
  ok(
    'the username search filters the directory',
    (await fhas('EmberFox')) && !(await fhas('WrenTactics')),
  );

  await fr.getByLabel('Search by username').fill('');
  await fr.waitForTimeout(250);
  await fr.getByLabel('Add GhostLantern').click();
  await fr.waitForTimeout(400);
  ok(
    'Add flips that row to Requested and toasts',
    (await fhas('Requested')) && (await fhas('Friend request sent')),
  );

  // The clipboard rejects without permission in a headless browser — the toast
  // has to fire on that path too, or the button reads as broken offline.
  await fr.waitForTimeout(1700);
  await fr.locator('button', { hasText: /^Copy$/ }).click();
  await fr.waitForTimeout(400);
  ok('copying the invite link toasts either way', await fhas('Invite link copied'));

  // The connect card is the one thing on this screen the config gates.
  ok('no connect card while friends are connected', !(await fhas('Quiet feed?')));

  await fr.goto(`${BASE}/?screen=friends&friends=0`, { waitUntil: 'networkidle' });
  await fr.waitForTimeout(500);
  ok('?friends=0 puts the connect card in Today', await fhas('Quiet feed?'));

  await fr.locator('[aria-pressed]', { hasText: /^Ratings/ }).first().click();
  await fr.waitForTimeout(350);
  ok('the connect card is unfiltered-feed only', !(await fhas('Quiet feed?')));
  await fr.close();
}

// ── Profile ───────────────────────────────────────────────────
// Almost everything here is fixed content, so what's worth guarding is where
// the profile deliberately disagrees with the rest of the app: its own
// sentiment wording, its own copy of the lists, and an editor that stops short
// of the tab bar instead of covering it like the list editor does.
{
  const pr = await browser.newPage({ viewport: { width: 402, height: 874 } });
  const ptext = () => pr.locator('.screen').innerText();
  const phas = async (t) => (await ptext()).toLowerCase().includes(t.toLowerCase());
  const tab = (name) => pr.locator('[aria-pressed]', { hasText: new RegExp(`^${name}$`) }).first();

  await pr.goto(`${BASE}/?screen=profile`, { waitUntil: 'networkidle' });
  await pr.waitForTimeout(500);
  ok(
    'profile opens on your reviews',
    (await phas('ColinVolt')) && (await phas('obsessed with action RPGs')),
  );

  // Four hardcoded cells, and the labels have to stay paired with the numbers.
  const stats = await pr.evaluate(() =>
    [...document.querySelectorAll('div')]
      .filter((d) => getComputedStyle(d).fontFamily.includes('mono'))
      .map((d) => `${d.innerText}${d.nextElementSibling?.innerText ?? ''}`)
      .join(' '),
  );
  ok('the stat card reads 3/42/16/2 in mono', stats === '3Playing 42Finished 16Backlogged 2DNF');

  // Three review rows, plus the banner and the avatar. Those two are the only
  // slots in the app with no game behind them, so name them separately —
  // Cover falls back silently, and a missing one would just read as styling.
  const art = await pr.evaluate(() => {
    const img = [...document.querySelectorAll('.screen img')];
    return {
      n: img.length,
      broken: img.filter((i) => i.complete && i.naturalWidth === 0).length,
      profile: img.filter((i) => i.getAttribute('src').includes('/profile-')).length,
    };
  });
  ok('every review row resolves its cover', art.n === 5 && art.broken === 0);
  ok('the banner and avatar resolve their own art', art.profile === 2);

  // A third sentiment vocabulary: not SentimentPill's defaults and not the
  // friends feed's "Loved it" either.
  const pills = await pr.locator('.ds-sentiment-pill').allInnerTexts();
  ok('reviews use the profile’s own pill wording', pills.join(',') === 'Loved,Loved,Disliked');

  await tab('Activity').click();
  await pr.waitForTimeout(350);
  const activity = await ptext();
  ok(
    'activity reads verb-first, with a list target where there is one',
    activity.includes('Started Persona 4 Golden') && activity.includes('to Action RPGs'),
  );
  ok(
    'an activity row with no verdict shows no pill or quote',
    (await pr.locator('.ds-sentiment-pill').count()) === 3 &&
      (await pr.locator('.screen img').count()) === 7,
  );

  // PR_LISTS is its own copy, not a view of LIB_COLLECTIONS — the two disagree
  // on both the name and the relative time for the very same list.
  await tab('Lists').click();
  await pr.waitForTimeout(350);
  ok(
    'the lists tab uses the profile’s own copy',
    (await phas('Cozy nights in')) && (await phas('8 games · updated 5 days ago')),
  );

  const strips = await pr.evaluate(() =>
    [...document.querySelectorAll('.scroll-x')].map((el) => el.children.length),
  );
  ok('list cards reuse the library’s cover strips', strips.join(',') === '8,8,4');

  await pr.getByLabel('Search your lists').fill('hand');
  await pr.waitForTimeout(250);
  ok(
    'the list search narrows to one card',
    (await phas('Handheld / Travel')) && !(await phas('Cozy nights in')),
  );

  await pr.getByLabel('Search your lists').fill('zzz');
  await pr.waitForTimeout(250);
  ok('a search matching nothing says so', await phas('No lists match your search'));

  await pr.getByLabel('Clear search').click();
  await pr.waitForTimeout(250);
  ok('clearing the search brings every list back', await phas('Cozy nights in'));

  // The sort button is the only thing saying the options below belong to it,
  // so it has to change while the popover is open. The three orders happen to
  // coincide for this data, so what's assertable is the state, not the order.
  const sortBg = () =>
    pr.locator('[aria-label="Sort lists"]').evaluate((el) => getComputedStyle(el).backgroundColor);
  const closedBg = await sortBg();
  await pr.getByLabel('Sort lists').click();
  await pr.waitForTimeout(250);
  const openBg = await sortBg();
  ok(
    'the sort button changes while its popover is open',
    openBg !== closedBg && (await phas('Recently updated')) && (await phas('Most games')),
  );

  await pr.locator('[aria-pressed]', { hasText: 'Name (A–Z)' }).click();
  await pr.waitForTimeout(250);
  ok(
    'picking a sort moves the selection off Recently updated',
    (await pr.locator('[aria-pressed="true"]', { hasText: 'Name (A–Z)' }).count()) === 1 &&
      (await pr.locator('[aria-pressed="true"]', { hasText: 'Recently updated' }).count()) === 0,
  );

  // Cancel has to drop both drafts, and Save has to commit both.
  await tab('Reviews').click();
  await pr.waitForTimeout(300);
  await pr.getByRole('button', { name: 'Edit profile' }).click();
  await pr.waitForTimeout(500);
  ok(
    'the editor opens prefilled from what is committed',
    (await pr.locator('#pr-edit-username').inputValue()) === 'ColinVolt',
  );

  // The list editor covers the tab bar; this one deliberately does not.
  const clearsTabBar = await pr.evaluate(() => {
    const sheet = document.querySelector('[role="dialog"][aria-label="Edit profile"]');
    const bar = document.querySelector('nav');
    return Math.round(sheet.getBoundingClientRect().bottom) <= Math.round(bar.getBoundingClientRect().top);
  });
  ok('the profile editor stops short of the tab bar', clearsTabBar);

  await pr.locator('#pr-edit-username').fill('Scratch');
  await pr.locator('#pr-edit-bio').fill('Scratch bio');
  await pr.locator('button', { hasText: /^Cancel$/ }).click();
  await pr.waitForTimeout(500);
  ok(
    'cancel discards both drafts',
    (await phas('ColinVolt')) && !(await phas('Scratch')),
  );

  await pr.getByRole('button', { name: 'Edit profile' }).click();
  await pr.waitForTimeout(500);
  await pr.locator('#pr-edit-username').fill('VoltColin');
  await pr.locator('#pr-edit-bio').fill('Back on the JRPGs.');
  await pr.locator('button', { hasText: /^Save$/ }).click();
  await pr.waitForTimeout(500);
  ok(
    'save commits the username and bio together',
    (await phas('VoltColin')) && (await phas('Back on the JRPGs.')),
  );

  // A mapped list leaves the profile behind for the real Library list; the
  // unmapped one only toasts.
  await tab('Lists').click();
  await pr.waitForTimeout(350);
  await pr.locator('button', { hasText: 'Handheld / Travel' }).click();
  await pr.waitForTimeout(400);
  ok('the unmapped list only toasts', await phas('Not available in this demo'));

  await pr.waitForTimeout(1700);
  await pr.locator('button', { hasText: 'Cozy nights in' }).click();
  await pr.waitForTimeout(700);
  ok(
    'a mapped list opens its Library detail',
    (await phas('Games for a rainy day or a night in')) && (await phas('Spiritfarer')),
  );

  await pr.goto(`${BASE}/?screen=profile:activity`, { waitUntil: 'networkidle' });
  await pr.waitForTimeout(500);
  ok('?screen=profile:activity lands on the activity tab', await phas('Reviewed Hades II'));
  await pr.close();
}

// ── Discover header ───────────────────────────────────────────
// The header carries one control, not two: Search already has a tab, so a
// second entry point up here was removed. What is left is the same avatar the
// Profile screen leads with, and it has to actually go there — a round button
// that only toasted was indistinguishable from an unfinished one.
{
  const hd = await browser.newPage({ viewport: { width: 402, height: 874 } });
  await hd.goto(`${BASE}/?screen=home`, { waitUntil: 'networkidle' });
  await hd.waitForTimeout(500);

  const header = hd.locator('.screen header');
  ok('the header has no Search control', (await header.getByLabel('Search').count()) === 0);

  const avatar = await hd.evaluate(() => {
    const img = document.querySelector('.screen header button[aria-label="Profile"] img');
    return { src: img?.getAttribute('src') ?? null, broken: img ? img.complete && img.naturalWidth === 0 : true };
  });
  ok(
    'the header avatar is the profile art, resolved',
    avatar.src === '/covers/profile-avatar.webp' && !avatar.broken,
  );

  await header.getByLabel('Profile').click();
  await hd.waitForTimeout(500);
  ok(
    'the header avatar opens the profile',
    (await hd.locator('.screen').innerText()).includes('obsessed with action RPGs'),
  );
  await hd.close();
}

// ── Replay onboarding ─────────────────────────────────────────
// The profile editor can send you back through the intro. It has to clear the
// persisted `onboardingComplete`, or a cold launch mid-replay would snap back
// to Discover — and it has to leave the library alone, since this is a request
// to see the intro again rather than to reset the demo.
{
  const rp = await browser.newPage({ viewport: { width: 402, height: 874 } });
  await rp.goto(`${BASE}/?screen=profile`, { waitUntil: 'networkidle' });
  await rp.waitForTimeout(500);
  await rp.evaluate(() => {
    const save = JSON.parse(localStorage.getItem('ludos.state') ?? '{}');
    save.backlog = { 'Elden Ring': true };
    localStorage.setItem('ludos.state', JSON.stringify(save));
  });

  await rp.getByRole('button', { name: 'Edit profile' }).click();
  await rp.waitForTimeout(500);
  await rp.locator('button', { hasText: /^Replay onboarding$/ }).click();
  await rp.waitForTimeout(600);

  ok('replay lands on the first intro screen', (await rp.locator('.screen').innerText()).includes('Welcome to'));
  ok(
    'replay closes the editor behind it',
    (await rp.locator('[role="dialog"][aria-label="Edit profile"]').count()) === 0,
  );

  const saved = await rp.evaluate(() => JSON.parse(localStorage.getItem('ludos.state')));
  ok('replay clears the persisted completion flag', saved.onboardingComplete === false);
  ok('replay keeps the library', Object.keys(saved.backlog).length > 0);

  // The flag is persisted, so the replay has to survive a cold launch.
  await rp.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await rp.waitForTimeout(500);
  ok(
    'a cold launch mid-replay stays in onboarding',
    (await rp.locator('.screen').innerText()).includes('Welcome to'),
  );
  await rp.close();
}

// ── Search ────────────────────────────────────────────────────
// The catalogue and the browse rows are fixed content, so what's worth
// guarding is the matching: it runs on a normalized query on both sides, which
// makes a punctuation-only query empty rather than unmatchable, and the empty
// state still quotes what was actually typed.
{
  const sr = await browser.newPage({ viewport: { width: 402, height: 874 } });
  const shas = async (t) => (await sr.locator('.screen').innerText()).includes(t);
  // One cover per result card, and nothing else on the screen carries art.
  const cards = () => sr.locator('.screen img').count();
  const box = () => sr.getByLabel('Search for a game');

  await sr.goto(`${BASE}/?screen=search`, { waitUntil: 'networkidle' });
  await sr.waitForTimeout(500);
  ok(
    'search opens on the browse rows',
    (await shas('Trending Right Now')) &&
      (await shas('Popular with Completionists')) &&
      (await shas('New Releases')) &&
      (await cards()) === 0,
  );

  // "!!!" normalizes to the empty string. It can't match a title, but it isn't
  // a failed search either — the browse rows stay.
  await box().fill('!!!');
  await sr.waitForTimeout(250);
  ok(
    'a query that normalizes to nothing keeps the browse rows',
    (await shas('Trending Right Now')) && !(await shas('No games found')),
  );

  await box().fill('hollow');
  await sr.waitForTimeout(250);
  ok(
    'a partial match filters the grid',
    (await shas('Hollow Knight')) && (await shas('Mina the Hollower')) && (await cards()) === 2,
  );

  const art = await sr.evaluate(() => {
    const img = [...document.querySelectorAll('.screen img')];
    return { n: img.length, broken: img.filter((i) => i.complete && i.naturalWidth === 0).length };
  });
  ok('every result resolves its cover', art.n === 2 && art.broken === 0);

  // Both sides drop the apostrophe, so the possessive closes up.
  await box().fill('baldurs gate');
  await sr.waitForTimeout(250);
  ok('the match ignores the apostrophe', (await shas('Baldur')) && (await cards()) === 1);

  await box().fill('zzz');
  await sr.waitForTimeout(250);
  ok(
    'no match quotes the query as it was typed',
    (await shas('No games found')) && (await shas('Nothing matches \u201Czzz\u201D')),
  );

  await sr.getByLabel('Clear search').click();
  await sr.waitForTimeout(250);
  ok(
    'clearing returns to the browse rows',
    (await shas('Trending Right Now')) && (await cards()) === 0,
  );

  // A browse row fills the field with the whole title, which then matches
  // only itself.
  await sr.locator('button', { hasText: 'Sekiro: Shadows Die Twice' }).first().click();
  await sr.waitForTimeout(300);
  ok(
    'a browse row lands on a one-card grid',
    (await box().inputValue()) === 'Sekiro: Shadows Die Twice' && (await cards()) === 1,
  );

  // The add badge opens the same sheet the rails do, and flips once tracked.
  await sr.getByLabel('Add Sekiro: Shadows Die Twice').click();
  await sr.waitForTimeout(400);
  ok('a result opens the status sheet in add mode', await shas('Add Sekiro: Shadows Die Twice to…'));

  await sr.getByRole('button', { name: 'Add to backlog' }).click();
  await sr.waitForTimeout(500);
  const badge = await sr.getByLabel('Add Sekiro: Shadows Die Twice').innerText();
  ok('adding flips the badge and stays on search', badge.trim() === '\u2713' && (await shas('Added to backlog')));

  // Session state, not a durable fact: the deep link lands on browse.
  await sr.goto(`${BASE}/?screen=search`, { waitUntil: 'networkidle' });
  await sr.waitForTimeout(500);
  ok(
    'the query does not survive a reload',
    (await box().inputValue()) === '' && (await shas('Trending Right Now')),
  );
  await sr.close();
}

// ── Cover fallback and recovery ───────────────────────────────
// A cover that fails falls back to an empty box, and nothing re-requests it —
// so the flag has to be tied to the source that failed, not a bare boolean.
// Covers whose `id` changes under them while mounted (the pick card across
// "Another", the duel cards each round) would otherwise show an empty box over
// the next slot's perfectly good art.
{
  const cv = await browser.newPage({ viewport: { width: 402, height: 874 } });
  const imgs = () => cv.locator('.screen img').count();
  // Fails the first cover in the scrolling content the way a dropped request
  // would. Scoped to `.scroll-y` rather than the whole screen because Discover's
  // header now carries the profile avatar, which is the first `img` in the DOM
  // and is not the cover either half of this block is about.
  const drop = () =>
    cv.evaluate(() =>
      document.querySelector('.screen .scroll-y img').dispatchEvent(new Event('error')),
    );

  await cv.goto(`${BASE}/?screen=search`, { waitUntil: 'networkidle' });
  await cv.waitForTimeout(500);
  await cv.getByLabel('Search for a game').fill('hollow');
  await cv.waitForTimeout(400);

  const before = await imgs();
  await drop();
  await cv.waitForTimeout(300);
  ok('a dropped cover request falls back to the empty box', before === 2 && (await imgs()) === 1);

  await cv.evaluate(() => window.dispatchEvent(new Event('online')));
  await cv.waitForTimeout(600);
  const healed = await cv.evaluate(() => {
    const img = [...document.querySelectorAll('.screen img')];
    return { n: img.length, broken: img.filter((i) => i.complete && i.naturalWidth === 0).length };
  });
  ok('the cover returns when connectivity does', healed.n === 2 && healed.broken === 0);

  // The pick card is one mounted Cover that takes a new slot on every re-roll.
  await cv.goto(`${BASE}/?screen=home`, { waitUntil: 'networkidle' });
  await cv.waitForTimeout(600);
  await drop();
  await cv.waitForTimeout(300);
  const blanked = await imgs();
  await cv.getByRole('button', { name: 'Another' }).click();
  await cv.waitForTimeout(700);
  ok(
    'a Cover reused for another slot does not inherit the failure',
    (await imgs()) === blanked + 1,
  );
  await cv.close();
}

// ── Game detail ───────────────────────────────────────────────
// The screen is fixed content bar one thing: the review you write yourself.
// So what's worth guarding is that path — the prompt only appears once the
// game is finished, the rating gates the post, and posting moves the review
// into the verdict card at the top of the trust ladder.
{
  const gd = await browser.newPage({ viewport: { width: 402, height: 874 } });
  const gtext = () => gd.locator('.screen').innerText();
  const ghas = async (t) => (await gtext()).includes(t);

  await gd.goto(`${BASE}/?screen=detail`, { waitUntil: 'networkidle' });
  await gd.waitForTimeout(500);
  ok('?screen=detail opens the game', (await ghas('About Elden Ring')) && (await ghas('Verdict')));

  // Detail takes over the whole screen — it is not one of the tabs.
  ok('game detail hides the tab bar', (await gd.locator('nav [aria-current]').count()) === 0);

  // The hero is landscape key art, not a cover, and the rail below it is the
  // only other artwork on the screen.
  const art = await gd.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')];
    return { count: imgs.length, broken: imgs.filter((i) => i.complete && !i.naturalWidth).length };
  });
  ok('hero and discovery rail resolve their art', art.count === 5 && art.broken === 0);

  // Both friend-gated blocks: the Friends source at the top of the Verdict
  // card's trust ladder, and the activity list further down.
  ok(
    'friend blocks show when friends are connected',
    (await ghas('3 friends finished Elden Ring')) && (await ghas('Friend activity')),
  );

  // ?friends=0 is the only route back to the disconnected state now that the
  // build ships connected. Showing an empty "3 friends finished" would be
  // worse than showing nothing, so both blocks have to drop out together.
  {
    const cold = await browser.newPage({ viewport: { width: 402, height: 874 } });
    await cold.goto(`${BASE}/?friends=0&screen=detail`, { waitUntil: 'networkidle' });
    await cold.waitForTimeout(450);
    const t = await cold.locator('.screen').innerText();
    ok(
      '?friends=0 drops both friend blocks',
      !t.includes('Friend activity') && !t.includes('3 friends finished'),
    );
    await cold.close();
  }

  ok('an untracked game offers to be added', await ghas('Add to list'));
  ok('no review prompt before the game is finished', !(await ghas('How was it?')));

  await gd.getByRole('button', { name: 'Add to list' }).click();
  await gd.waitForTimeout(400);
  ok('the footer opens the sheet in add mode', await ghas('Add Elden Ring to…'));

  await gd.getByRole('button', { name: 'Mark as finished' }).click();
  await gd.waitForTimeout(1200);
  ok('finishing reveals the review prompt', await ghas('How was it?'));

  // The prompt mounts below the fold, so it is scrolled to — and centred
  // rather than pinned to the top, or the rating row sits under the edge.
  const centred = await gd.evaluate(() => {
    const scroller = document.querySelector('.scroll-y');
    const card = [...scroller.querySelectorAll('div')].find((d) =>
      d.innerText?.startsWith('YOUR REVIEW\nHow was it?'),
    );
    if (!card) return null;
    const cr = card.getBoundingClientRect();
    const sr = scroller.getBoundingClientRect();
    return Math.abs((cr.top + cr.height / 2) - (sr.top + sr.height / 2));
  });
  ok('the prompt is scrolled to the middle of the screen', centred !== null && centred < 24);

  await gd.getByRole('button', { name: 'Post review' }).click();
  await gd.waitForTimeout(400);
  ok('posting without a rating is refused', await ghas('Pick a rating first'));

  // Picking the rating you already picked clears it, so the scale is never a
  // one-way door.
  await gd.getByRole('button', { name: 'Loved', exact: true }).click();
  await gd.waitForTimeout(200);
  const lovedPressed = () =>
    gd.getByRole('button', { name: 'Loved', exact: true }).getAttribute('aria-pressed');
  ok('picking a rating selects it', (await lovedPressed()) === 'true');
  await gd.getByRole('button', { name: 'Loved', exact: true }).click();
  await gd.waitForTimeout(200);
  ok('picking it again clears it', (await lovedPressed()) === 'false');

  await gd.getByRole('button', { name: 'Loved', exact: true }).click();
  await gd.getByLabel('Your review').fill('Every death taught me something.');
  await gd.waitForTimeout(150);
  await gd.getByRole('button', { name: 'Post review' }).click();
  await gd.waitForTimeout(600);
  ok(
    'posting moves the review into the verdict card',
    !(await ghas('How was it?')) &&
      (await ghas('Loved it')) &&
      (await ghas('Every death taught me something.')),
  );

  await gd.getByRole('button', { name: /^Edit/ }).click();
  await gd.waitForTimeout(400);
  ok('Edit hands the review back to the prompt', await ghas('How was it?'));

  // The tab swap is a keyed re-render; a broken key leaves the old list up.
  // Scoped to the Reviews card: ColinVolt also writes a row in Friend activity,
  // so reading the whole screen would never see him leave.
  const reviewsText = () =>
    gd.evaluate(
      () =>
        [...document.querySelectorAll('div')].find(
          (d) => d.firstElementChild?.textContent === 'Reviews',
        )?.innerText ?? '',
    );
  ok('the friends tab starts on friend reviews', (await reviewsText()).includes('ColinVolt'));
  await gd.getByRole('button', { name: 'All', exact: true }).click();
  await gd.waitForTimeout(400);
  const swapped = await reviewsText();
  ok(
    'the review tabs swap the list',
    swapped.includes('MorningCoffee') && !swapped.includes('ColinVolt'),
  );

  // A tracked game's footer names its status and opens the sheet in the other
  // mode — updating what is already tracked, not adding it again.
  ok('a tracked game names its status in the footer', await ghas('Finished'));
  // The only chevron on the screen — the footer's own status button.
  await gd.locator('button', { hasText: '▾' }).click();
  await gd.waitForTimeout(400);
  ok('the footer opens the sheet in status mode', await ghas('Update Elden Ring'));

  await gd.getByRole('button', { name: 'Did not finish' }).click();
  await gd.waitForTimeout(600);
  ok('the status sheet carries dnf through', await ghas('did not finish'));

  await gd.getByLabel('Back', { exact: true }).click();
  await gd.waitForTimeout(400);
  ok('back leaves game detail for Discover', await ghas('What to play next'));
  await gd.close();
}

// ── The review survives a cold launch ─────────────────────────
// `itemStatus` persists, so without the review persisting too the app would
// remember you finished the game, forget your verdict, and ask "How was it?"
// about something you'd already reviewed.
{
  const rv = await browser.newPage({ viewport: { width: 402, height: 874 } });
  const rhas = async (t) => (await rv.locator('.screen').innerText()).includes(t);

  await rv.goto(`${BASE}/?reset`, { waitUntil: 'networkidle' });
  await rv.goto(`${BASE}/?screen=detail`, { waitUntil: 'networkidle' });
  await rv.waitForTimeout(500);
  await rv.getByRole('button', { name: 'Add to list' }).click();
  await rv.waitForTimeout(400);
  await rv.getByRole('button', { name: 'Mark as finished' }).click();
  await rv.waitForTimeout(1000);
  await rv.getByRole('button', { name: 'Loved', exact: true }).click();
  await rv.getByLabel('Your review').fill('Worth every hour.');
  await rv.waitForTimeout(150);
  await rv.getByRole('button', { name: 'Post review' }).click();
  await rv.waitForTimeout(600);

  await rv.goto(`${BASE}/?screen=detail`, { waitUntil: 'networkidle' });
  await rv.waitForTimeout(700);
  ok(
    'a posted review survives a cold launch',
    (await rhas('Loved it')) && (await rhas('Worth every hour.')) && !(await rhas('How was it?')),
  );

  // An unposted draft rides along on the same slice, so picking a rating and
  // walking away doesn't lose it either.
  await rv.getByRole('button', { name: /^Edit/ }).click();
  await rv.waitForTimeout(400);
  await rv.getByLabel('Your review').fill('Second thoughts, still great.');
  await rv.waitForTimeout(250);
  await rv.goto(`${BASE}/?screen=detail`, { waitUntil: 'networkidle' });
  await rv.waitForTimeout(700);
  ok(
    'an unposted draft survives too',
    (await rv.getByLabel('Your review').inputValue()) === 'Second thoughts, still great.' &&
      (await rv.getByRole('button', { name: 'Loved', exact: true }).getAttribute('aria-pressed')) ===
        'true',
  );
  await rv.close();
}

// ── Back navigation ───────────────────────────────────────────
// Installed there's no browser chrome, so Android's back button goes to the OS.
// Each dismissible layer owns a history entry so back closes it instead of
// killing the app — and closing one from inside must retire its entry, or back
// would silently do nothing later.
{
  const nav = await browser.newPage({ viewport: { width: 402, height: 874 } });
  const nhas = async (t) =>
    (await nav.locator('.screen').innerText()).toLowerCase().includes(t.toLowerCase());
  await nav.goto('about:blank');
  await nav.goto(`${BASE}/?reset&screen=home:discover`, { waitUntil: 'networkidle' });
  await nav.waitForTimeout(700);

  await nav.getByRole('button', { name: 'Add Celeste' }).click();
  await nav.waitForTimeout(400);
  await nav.goBack();
  await nav.waitForTimeout(600);
  ok(
    'back closes the status sheet, not the app',
    !(await nhas('Add Celeste to…')) && (await nhas('What to play next')),
  );

  await nav.getByRole('button', { name: /Still can't decide/ }).click();
  await nav.waitForTimeout(400);
  await nav.goBack();
  await nav.waitForTimeout(500);
  ok('back leaves head-to-head for Discover', await nhas('What to play next'));

  await nav.getByRole('button', { name: 'Add Celeste' }).click();
  await nav.waitForTimeout(400);
  await nav.getByRole('button', { name: 'Mark as playing' }).click();
  await nav.waitForTimeout(800);
  await nav.goBack();
  await nav.waitForTimeout(700);
  ok('closing in-app leaves no orphan history entry', nav.url().startsWith('about:blank'));
  await nav.close();
}

// ── Back navigation through the library ───────────────────────
// The library stacks two panels on top of a tab, so back has three things to
// unwind before it may leave. Each must come off on its own press, and a panel
// mid-slide has to count as already gone — otherwise closing one pushes a
// fresh entry instead of spending the one it owns, and back starts no-opping.
{
  const lnav = await browser.newPage({ viewport: { width: 402, height: 874 } });
  const lhas = async (t) => (await lnav.locator('.screen').innerText()).includes(t);
  await lnav.goto('about:blank');
  await lnav.goto(`${BASE}/?screen=library:lists`, { waitUntil: 'networkidle' });
  await lnav.waitForTimeout(600);

  await lnav.locator('button', { hasText: 'Favorite Games' }).click();
  await lnav.waitForTimeout(600);
  await lnav.getByLabel('Edit list').click();
  await lnav.waitForTimeout(500);

  await lnav.goBack();
  await lnav.waitForTimeout(600);
  ok(
    'back closes the list editor first',
    !(await lhas('Edit list')) && (await lhas('Ranking of my favorite games')),
  );

  await lnav.goBack();
  await lnav.waitForTimeout(600);
  ok('back then closes the list detail', !(await lhas('Ranking of my favorite games')));

  await lnav.goBack();
  await lnav.waitForTimeout(600);
  ok('back then leaves the library for Discover', await lhas('What to play next'));

  // Three layers opened, three retired: one more press leaves the app.
  await lnav.goBack();
  await lnav.waitForTimeout(600);
  ok('the library stack leaves no orphan history entries', lnav.url().startsWith('about:blank'));
  await lnav.close();
}

// ── Back navigation through friends ───────────────────────────
// Both friends layers animate out, and neither may be counted while it's
// leaving: the sheet fades for 280ms and the add panel slides for 300ms. Count
// one of those and closing it pushes a fresh entry instead of spending its own,
// which a later back press then silently swallows.
{
  const fnav = await browser.newPage({ viewport: { width: 402, height: 874 } });
  const fhas = async (t) =>
    (await fnav.locator('.screen').innerText()).toLowerCase().includes(t.toLowerCase());
  await fnav.goto('about:blank');
  await fnav.goto(`${BASE}/?screen=friends`, { waitUntil: 'networkidle' });
  await fnav.waitForTimeout(600);

  await fnav.getByLabel('Friends list').click();
  await fnav.waitForTimeout(450);
  await fnav.goBack();
  await fnav.waitForTimeout(600);
  ok(
    'back closes the friends sheet first',
    !(await fhas('8 Friends · 5 online')) && (await fhas('This week')),
  );

  await fnav.getByLabel('Add friends').click();
  await fnav.waitForTimeout(450);
  await fnav.goBack();
  await fnav.waitForTimeout(700);
  ok('back then closes the add panel', !(await fhas('Or invite directly')));

  await fnav.goBack();
  await fnav.waitForTimeout(600);
  ok('back then leaves friends for Discover', await fhas('What to play next'));

  // Two layers opened, two retired: one more press leaves the app.
  await fnav.goBack();
  await fnav.waitForTimeout(600);
  ok('the friends stack leaves no orphan history entries', fnav.url().startsWith('about:blank'));
  await fnav.close();
}

// ── Back navigation through the profile ───────────────────────
// openLayers() counted the editor on `prEditOpen` alone, with no `…In` guard —
// so while the sheet animated out it pushed a fresh entry instead of spending
// its own, and the next back press silently did nothing.
{
  const pnav = await browser.newPage({ viewport: { width: 402, height: 874 } });
  const phas = async (t) =>
    (await pnav.locator('.screen').innerText()).toLowerCase().includes(t.toLowerCase());
  await pnav.goto('about:blank');
  await pnav.goto(`${BASE}/?screen=profile`, { waitUntil: 'networkidle' });
  await pnav.waitForTimeout(600);

  await pnav.getByRole('button', { name: 'Edit profile' }).click();
  await pnav.waitForTimeout(500);
  await pnav.goBack();
  await pnav.waitForTimeout(700);
  ok('back closes the profile editor first', !(await phas('Tap to replace')) && (await phas('ColinVolt')));

  await pnav.goBack();
  await pnav.waitForTimeout(600);
  ok('back then leaves the profile for Discover', await phas('What to play next'));

  // One layer opened, one retired: the next press leaves the app.
  await pnav.goBack();
  await pnav.waitForTimeout(600);
  ok('the profile stack leaves no orphan history entries', pnav.url().startsWith('about:blank'));
  await pnav.close();
}

// ── Installed-app viewport height ─────────────────────────────
// Launched from the home screen, iOS sizes its containing block as though
// Safari's bottom toolbar were still there — ~56pt short — so the tab bar used
// to sit above a dead strip. Simulated here by giving the page a viewport
// shorter than the screen it claims to be on.
{
  const sa = await browser.newPage({ viewport: { width: 402, height: 818 } });
  await sa.addInitScript(() => {
    Object.defineProperty(navigator, 'standalone', { get: () => true, configurable: true });
    Object.defineProperty(window.screen, 'height', { get: () => 874, configurable: true });
  });
  await sa.goto(`${BASE}/?screen=home:discover`, { waitUntil: 'networkidle' });
  await sa.waitForTimeout(400);
  const corrected = await sa.evaluate(
    () => Math.round(document.querySelector('.screen').getBoundingClientRect().height),
  );
  ok('installed app corrects a short containing block', corrected === 874);

  // The iOS keyboard shrinks innerHeight; the app must not collapse with it.
  await sa.setViewportSize({ width: 402, height: 400 });
  await sa.waitForTimeout(300);
  const held = await sa.evaluate(
    () => Math.round(document.querySelector('.screen').getBoundingClientRect().height),
  );
  ok('installed app height survives the keyboard', held === 874);
  await sa.close();
}

// The shim must stay out of the way everywhere else.
const shimOff = await page.evaluate(
  () => getComputedStyle(document.documentElement).getPropertyValue('--app-height').trim(),
);
ok('height shim is inert in a normal browser', shimOff === '');

console.log(errors.length ? `\nPAGE ERRORS:\n${errors.join('\n')}` : '\nno page errors');
await browser.close();
