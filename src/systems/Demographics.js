// The demographic-attribute system, per direction: race, disability, and
// rurality are each independently rolled onto a playthrough — on top of
// the existing gender choice and archetype's fixed special circumstance,
// not replacing them — with probabilities and effects grounded in real,
// population-specific statistics, not flat/generic ones. "Randomly
// attributed... or not at all" — each is an independent roll that can
// come back false/absent.
//
// Deliberately scoped this pass: the ROLLS and their INCOME effects are
// real and wired in. What's NOT done yet (see the report back to the
// user): narrative beats acknowledging what got rolled (no kitchen-table
// -style reveal for race/disability/rurality the way Structural Drag
// gets one), rural-specific home-price tiers (rurality only modifies
// income here), and — the biggest one — no avatar art varies by race
// yet. Flagged, not hidden.

// [V] U.S. Census Bureau population estimates, 2024 (as reported):
// White 57.5%, Hispanic/Latino 20.0%, Black 12.6%, Asian/Pacific
// Islander 6.7%. Renormalized across just these 4 categories (96.8% of
// the total) since this is a bounded v1, not the full Census taxonomy —
// noted here rather than silently passed off as the whole population.
const RACE_WEIGHTS = {
  white: 0.575 / 0.968,
  latino: 0.200 / 0.968,
  black: 0.126 / 0.968,
  asian: 0.067 / 0.968,
};

// [V] BLS Current Population Survey, median usual weekly earnings by
// race/ethnicity and sex, Q1 2025 (bls.gov/news.release/wkyeng): White
// men $1,342; Black men $1,017; Hispanic men $991; Asian men $1,822;
// White women $1,103; Black women $984; Hispanic women $879; Asian women
// $1,455. GameState.annualIncome's existing baseline (CharacterSelect ->
// the archetype's `genders` entry) already IS the Hispanic/Latino figure
// for this archetype (Fresno entry wage for men, Latina-vs-white-men
// ratio for women) — so these multipliers are expressed RELATIVE TO
// HISPANIC, same gender, not relative to white men, specifically so
// `race: 'latino'` reproduces the archetype's existing tested numbers
// exactly (multiplier 1.0) rather than silently changing them.
const RACE_INCOME_MULTIPLIER = {
  male: {
    white: 1342 / 991,
    black: 1017 / 991,
    latino: 1,
    asian: 1822 / 991,
  },
  female: {
    white: 1103 / 879,
    black: 984 / 879,
    latino: 1,
    asian: 1455 / 879,
  },
};

// [V] BLS, "Persons with a Disability: Labor Force Characteristics,"
// 2024: disability prevalence among the labor-force-age population by
// race/ethnicity — White 13.0%, Black 13.1%, Hispanic/Latino 8.7%, Asian
// 6.8%. Labor-force-specific rather than the broader CDC all-ages figure
// on purpose — this game is entirely about working-age economic outcomes.
const DISABILITY_RATE_BY_RACE = {
  white: 0.130,
  black: 0.131,
  latino: 0.087,
  asian: 0.068,
};

// [V] U.S. Census Bureau, 2020 Census urban/rural classification: about
// 20% of the U.S. population lives in a rural area.
const RURAL_POPULATION_SHARE = 0.20;
// [V] U.S. Census Bureau, 2023: median household income, rural ~$66,600
// vs. urban ~$80,600 — applied as a flat income multiplier. Home-price
// tiers are NOT adjusted for rurality in this pass (see file header).
const RURAL_INCOME_MULTIPLIER = 66600 / 80600;

// [V] BLS / Kessler Foundation nTIDE, 2024: workers with a disability
// earn a median $50,762/yr versus $60,915 for workers without one — 83
// cents per dollar. (The employment-RATE gap is much larger — 38% vs 75%
// employed at all — but this game only models people who are working, so
// the earnings ratio is what's mechanically applied here.)
const DISABILITY_INCOME_MULTIPLIER = 50762 / 60915;

function weightedRoll(weights) {
  const roll = Math.random();
  let cumulative = 0;
  const entries = Object.entries(weights);
  for (const [key, weight] of entries) {
    cumulative += weight;
    if (roll < cumulative) return key;
  }
  return entries[entries.length - 1][0]; // floating-point fallback
}

function rollRace() {
  return weightedRoll(RACE_WEIGHTS);
}

function rollDisability(race) {
  const rate = DISABILITY_RATE_BY_RACE[race] ?? DISABILITY_RATE_BY_RACE.latino;
  return Math.random() < rate;
}

function rollRurality() {
  return Math.random() < RURAL_POPULATION_SHARE;
}

// Applied once, at character creation, on top of whatever the archetype
// + gender selection already set GameState.annualIncome to.
function applyIncomeModifiers(state) {
  const raceMultiplier = RACE_INCOME_MULTIPLIER[state.character]?.[state.race] ?? 1;
  const ruralMultiplier = state.isRural ? RURAL_INCOME_MULTIPLIER : 1;
  const disabilityMultiplier = state.hasDisability ? DISABILITY_INCOME_MULTIPLIER : 1;
  state.annualIncome = Math.round(state.annualIncome * raceMultiplier * ruralMultiplier * disabilityMultiplier);
}

// Rolls all three and applies their income effects — the single entry
// point CharacterSelectScene calls after setting gender/archetype income.
function rollAndApply(state) {
  state.race = rollRace();
  state.hasDisability = rollDisability(state.race);
  state.isRural = rollRurality();
  applyIncomeModifiers(state);
}

export default {
  RACE_WEIGHTS,
  RACE_INCOME_MULTIPLIER,
  DISABILITY_RATE_BY_RACE,
  RURAL_POPULATION_SHARE,
  RURAL_INCOME_MULTIPLIER,
  DISABILITY_INCOME_MULTIPLIER,
  rollRace,
  rollDisability,
  rollRurality,
  applyIncomeModifiers,
  rollAndApply,
};
