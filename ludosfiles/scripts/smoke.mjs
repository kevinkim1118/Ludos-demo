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

// ── Desktop framing ───────────────────────────────────────────
await page.setViewportSize({ width: 1200, height: 1000 });
await page.goto(`${BASE}/?screen=home:discover`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const frame = await page.locator('.phone').boundingBox();
ok('desktop keeps 430px device frame', Math.round(frame.width) === 430);
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

// ── Intro carousel on a short screen ──────────────────────────
// The marquee has to give up height so the heading underneath stays readable.
await page.setViewportSize({ width: 440, height: 730 });
await page.goto(`${BASE}/?reset&screen=onboarding:intro2`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
const clipped = await page.evaluate(() => {
  const h2 = document.querySelector('h2');
  const scroller = document.querySelector('.scroll-y');
  if (!h2 || !scroller) return null;
  return h2.getBoundingClientRect().bottom > scroller.getBoundingClientRect().bottom + 0.5;
});
ok('intro heading is not clipped on a short screen', clipped === false);

console.log(errors.length ? `\nPAGE ERRORS:\n${errors.join('\n')}` : '\nno page errors');
await browser.close();
