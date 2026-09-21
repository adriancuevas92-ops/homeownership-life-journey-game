// The demographic-attribute system. Disability and rurality are each
// independently rolled onto a playthrough — "randomly attributed... or
// not at all," each roll can come back false/absent — and modify income
// on top of whichever archetype's base the player is already in.
//
// Race is different as of 2026-09-20: it's rolled BEFORE archetype/
// gender selection (see CharacterSelectScene.create()) via
// rollArchetypeRace() below, and *is* the archetype selector now, not a
// post-hoc modifier — "each race needs its own experience," not the
// same story with different stats. rollRace()/RACE_WEIGHTS (the full,
// real 4-race Census split) stay here as accurate reference data for
// when a third/fourth archetype exists; rollArchetypeRace() is the one
// CharacterSelectScene actually calls today, constrained to races that
// have a built archetype behind them.
import { ARCHETYPE_RACE_WEIGHTS } from '../data/characters/index.js';

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

// The archetype's base annualIncome (latino1986.js) is a Fresno-specific
// figure — [V] BLS OEWS May 2025, Fresno MSA, blended entry-level
// ~$19.89-$19.99/hr (~$41,500/yr). Until this fix, an `isRural: false`
// (Los Angeles) roll left that Fresno-sourced number completely
// unadjusted — the game would narrate "this family is in Los Angeles"
// while still paying them a Fresno wage, even as it priced them against
// LA's real $1,000,000 home-price tier. This multiplier re-bases urban
// rolls to an LA-specific figure instead: [V] BLS OEWS, Los Angeles-Long
// Beach-Anaheim MSA — Production Occupations mean $25.36/hr (May 2025)
// blended with Construction Laborers mean $29.14/hr (May 2023, the most
// recent detailed occupational table available) ≈ $27.25/hr ≈
// $56,680/yr, the same "packing houses, construction, whatever needs
// hands" blend IntroConversation's own flavor text describes, just
// re-sourced to LA's labor market instead of Fresno's. [E]: blending two
// different data years the same way the Fresno figure was already
// blended across occupations — a documented estimate, not a single
// clean BLS release, same as that original number.
const URBAN_INCOME_MULTIPLIER = (56680) / 41500;

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

// The roll CharacterSelectScene actually calls — constrained to races
// with a real archetype behind them (see characters/index.js's
// ARCHETYPE_RACE_WEIGHTS), so a player can never roll into a race with
// no story to tell yet.
function rollArchetypeRace() {
  return weightedRoll(ARCHETYPE_RACE_WEIGHTS);
}

function rollDisability(race) {
  const rate = DISABILITY_RATE_BY_RACE[race] ?? DISABILITY_RATE_BY_RACE.latino;
  return Math.random() < rate;
}

function rollRurality() {
  return Math.random() < RURAL_POPULATION_SHARE;
}

// Applied once, at character creation, on top of whatever the archetype
// + gender selection already set GameState.annualIncome to. No race
// multiplier anymore — race-specific pay now comes from WHICH
// archetype's own genders table got used (rolled before this runs, see
// rollArchetypeRace()), not a multiplier stacked on Latino's number.
function applyIncomeModifiers(state) {
  // Rural stays a straight rural/urban discount on the archetype's base
  // (unchanged); urban re-bases that same base to a real LA figure
  // instead of leaving it untouched — see URBAN_INCOME_MULTIPLIER above.
  const settingMultiplier = state.isRural ? RURAL_INCOME_MULTIPLIER : URBAN_INCOME_MULTIPLIER;
  const disabilityMultiplier = state.hasDisability ? DISABILITY_INCOME_MULTIPLIER : 1;
  state.annualIncome = Math.round(state.annualIncome * settingMultiplier * disabilityMultiplier);
}

// Rolls disability + rurality and applies every income effect —
// CharacterSelectScene calls this after gender/archetype income are set.
// state.race is already set by then (rollArchetypeRace(), called before
// archetype selection itself) — this does NOT re-roll it.
function rollAndApply(state) {
  state.hasDisability = rollDisability(state.race);
  state.isRural = rollRurality();
  applyIncomeModifiers(state);
}

export default {
  RACE_WEIGHTS,
  DISABILITY_RATE_BY_RACE,
  RURAL_POPULATION_SHARE,
  RURAL_INCOME_MULTIPLIER,
  URBAN_INCOME_MULTIPLIER,
  DISABILITY_INCOME_MULTIPLIER,
  rollRace,
  rollArchetypeRace,
  rollDisability,
  rollRurality,
  applyIncomeModifiers,
  rollAndApply,
};
