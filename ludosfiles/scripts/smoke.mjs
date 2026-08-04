import { chromium } from 'playwright';

const OUT = '/tmp/claude-0/-home-claude-repo/14c9009e-ea44-5f6c-a9e1-65c984ac57b3/scratchpad';
const BASE = process.env.BASE_URL ?? 'http://localhost:5173';

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
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

await page.getByRole('button', { name: /Mark .* as playing/ }).click();
await page.waitForTimeout(700);
ok('winner lands on Discover as playing', (await text()).includes('Currently playing'));
await page.screenshot({ path: `${OUT}/flow-final.png` });

// ── Desktop framing ───────────────────────────────────────────
await page.setViewportSize({ width: 1200, height: 1000 });
await page.goto(`${BASE}/?screen=home:discover`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const frame = await page.locator('.phone').boundingBox();
ok('desktop keeps 430px device frame', Math.round(frame.width) === 430);
await page.screenshot({ path: `${OUT}/desktop.png` });

console.log(errors.length ? `\nPAGE ERRORS:\n${errors.join('\n')}` : '\nno page errors');
await browser.close();
