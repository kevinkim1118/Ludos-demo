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
ok('Next disabled at 0 picks', await has("Pick at least 10 more games"));

// Select ten covers.
const cards = page.locator('.scroll-y button[aria-pressed]');
for (let i = 0; i < 10; i++) await cards.nth(i).click();
await page.waitForTimeout(200);
ok('counter flips at 10', await has('10 games ready for your Finished list'));

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
