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
