// Archetype #3 — same shape as latino1986.js/black1986.js on purpose:
// id, label, genders, homeTiers, specialCircumstanceText, synopsisRules.
// What's different here is structural, not just narrative: this
// archetype's "special circumstance" is the documented ABSENCE of a
// circumstance the other three archetypes each carry — no penalty
// function gets called for it anywhere (see circumstanceOriginWhite.js's
// closing step). That absence is itself the content, not a placeholder
// waiting for one.
//
// Avatar art needs nothing new here — same convention as black1986.js —
// OverworldScene/SynopsisScene key sprites off GameState.race
// (avatar_<gender>_white_<variant>_<n>.png), not archetypeId, and that
// sprite set already exists from the earlier avatar sweep.

// [V] Ira Katznelson, "When Affirmative Action Was White" (2005), citing
// VA/FHA records: in 1947, 2 of 3,229 VA home loans issued in Mississippi
// went to Black veterans; in the New York/northern New Jersey suburbs,
// fewer than 100 of 67,000 GI Bill-backed mortgages went to any
// non-white family. Same underwriting system this family used without
// friction.
const CIRCUMSTANCE_TEXT = [
  'You will play this story without a special circumstance.',
  "In 1947, Mississippi approved 3,229 VA home loans. Two went to Black veterans. In New York and New Jersey's suburbs, fewer than 100 of 67,000 GI Bill mortgages went to any non-white family. Your grandparents' generation didn't have to clear that bar. That's not a neutral starting line — it's underwriting policy working exactly as designed.",
].join('\n\n');

// [V] BLS Current Population Survey, median usual weekly earnings by
// race/ethnicity and sex, Q1 2025 (bls.gov/news.release/wkyeng): White
// men $1,342/wk, White women $1,103/wk — same release every other
// archetype's income already comes from.
const MALE_ANNUAL_INCOME = Math.round(1342 * 52);
const FEMALE_ANNUAL_INCOME = Math.round(1103 * 52);

export default {
  id: 'white-1986',
  label: 'Fresno, 1986 — a white family',
  selectPrompt: 'Choose your path',

  genders: {
    male: {
      label: 'Male',
      annualIncome: MALE_ANNUAL_INCOME,
      incomeSource: '[V] BLS CPS, median usual weekly earnings, white men, Q1 2025',
    },
    female: {
      label: 'Female',
      annualIncome: FEMALE_ANNUAL_INCOME,
      incomeSource: '[V] BLS CPS, median usual weekly earnings, white women, Q1 2025',
    },
  },

  // Same California setting as every other archetype — deliberate, not a
  // shortcut: keeps every archetype's Ending/Affordability numbers
  // directly comparable, which matters most for the point this specific
  // archetype is making.
  homeTiers: (state) => [
    state.isRural
      ? { name: 'Fresno, CA', homePrice: 430000 }
      : { name: 'Los Angeles, CA', homePrice: 1000000 },
  ],

  specialCircumstanceText: CIRCUMSTANCE_TEXT,

  // SynopsisScene's "rules of this run" page — same shape/count as every
  // other archetype's block. No penalty rule here on purpose, and that
  // absence is stated outright rather than left for the player to notice
  // on their own.
  synopsisRules: [
    'BORN 1981. GREW UP IN FRESNO, CALIFORNIA. NO ARRIVAL DATE, NO STEERED LOAN — NEITHER ONE IS THIS FAMILY’S STORY.',
    'STATUS — YOUR GRANDPARENTS BOUGHT INTO THE POSTWAR SUBURBAN BUILDOUT WITHOUT THE FRICTION MOST FAMILIES IN THIS GAME FACE AT THE SAME MOMENT.',
    'WEALTH — NO RULE HERE TAKES ANYTHING AWAY. THAT’S NOT NOTHING. IT’S THE ONE THING EVERY OTHER ARCHETYPE IN THIS GAME IS MISSING.',
    'CREDIT — NOTHING IN THIS FAMILY’S HISTORY MARKS THEIR FILE. NO RULE MADE SURE OF THAT. THAT ITSELF IS THE RULE.',
  ],
};
