// Archetype #4 — same shape as the other three. Named specifically
// (Japanese American) in the circumstance text rather than left as a
// vague pan-Asian claim: the best-documented, most specific structural
// circumstance available for this Census race category is Japanese
// American, not a fact true of every ethnicity the "Asian" label
// aggregates — same reasoning latino1986.js/black1986.js already used to
// pick one real, sourced circumstance over a generic one.
//
// Avatar art needs nothing new here — same convention as black1986.js —
// OverworldScene/SynopsisScene key sprites off GameState.race
// (avatar_<gender>_asian_<variant>_<n>.png), not archetypeId, and that
// sprite set already exists from the earlier avatar sweep.

// [V] California Alien Land Law, enacted 1913, tightened 1920/1923,
// struck down by the California Supreme Court in 1952 (Sei Fujii v.
// California) — barred "aliens ineligible for citizenship" (which, per
// federal naturalization law until the 1952 McCarran-Walter Act, meant
// Asian immigrants specifically) from owning land at all. [V] National
// Archives / Civil Liberties Act of 1988 findings: Executive Order 9066
// (1942) forced roughly 120,000 Japanese Americans into incarceration
// camps; property was sold, leased, or abandoned within days, at an
// estimated $1.3-5 billion in today's dollars depending on the
// inflation adjustment used — a loss the 1988 Act itself found was not
// justified by military necessity.
const CIRCUMSTANCE_TEXT = [
  'You will play this story rebuilding from zero, twice.',
  "Your grandparents couldn't legally own the land they farmed — California barred it outright from 1913 to 1952. What little they built around that ban, the government took anyway: in 1942, forced removal gave families days to sell or abandon everything, an estimated $1.3 to $5 billion in today's dollars. Both barriers are gone now. What that generation would have built in the meantime isn't.",
].join('\n\n');

// [V] BLS Current Population Survey, median usual weekly earnings by
// race/ethnicity and sex, Q1 2025 (bls.gov/news.release/wkyeng): Asian
// men $1,822/wk, Asian women $1,455/wk — same release every other
// archetype's income already comes from. High relative to the other
// three archetypes' figures on purpose, not smoothed down to look more
// "disadvantaged" — the aggregate number is real, and the point this
// archetype's own content makes (see CircumstanceOriginAsian.js) is that
// the aggregate hides real range underneath it, not that the aggregate
// itself is wrong.
const MALE_ANNUAL_INCOME = Math.round(1822 * 52);
const FEMALE_ANNUAL_INCOME = Math.round(1455 * 52);

export default {
  id: 'asian-1986',
  label: 'Fresno, 1986 — a Japanese American family',
  selectPrompt: 'Choose your path',

  genders: {
    male: {
      label: 'Male',
      annualIncome: MALE_ANNUAL_INCOME,
      incomeSource: '[V] BLS CPS, median usual weekly earnings, Asian men, Q1 2025',
    },
    female: {
      label: 'Female',
      annualIncome: FEMALE_ANNUAL_INCOME,
      incomeSource: '[V] BLS CPS, median usual weekly earnings, Asian women, Q1 2025',
    },
  },

  // Same California setting as every other archetype — deliberate, not a
  // shortcut, and here also literally accurate: California is where the
  // Alien Land Law and the largest share of the WWII incarceration
  // camps' population actually were.
  homeTiers: (state) => [
    state.isRural
      ? { name: 'Fresno, CA', homePrice: 430000 }
      : { name: 'Los Angeles, CA', homePrice: 1000000 },
  ],

  specialCircumstanceText: CIRCUMSTANCE_TEXT,

  // SynopsisScene's "rules of this run" page — same shape/count as every
  // other archetype's block.
  synopsisRules: [
    'BORN 1981. GREW UP IN FRESNO, CALIFORNIA. NO ARRIVAL DATE, NO STEERED LOAN — THIS FAMILY’S CIRCUMSTANCE IS OLDER THAN EITHER ONE.',
    'STATUS — YOUR GRANDPARENTS WERE LEGALLY BARRED FROM OWNING LAND UNTIL 1952, AND LOST WHAT THEY’D BUILT ANYWAY IN 1942. TWO SEPARATE RULES, NOT ONE.',
    'WEALTH — WHATEVER TWO GENERATIONS MIGHT HAVE COMPOUNDED SINCE 1942, THIS FAMILY IS STARTING WITHOUT IT.',
    'CREDIT — NOTHING IN THIS RULESET DAMAGES THIS FAMILY’S CREDIT DIRECTLY. WHAT IT COST THEM SHOWS UP AS MISSING WEALTH, NOT A MARKED FILE.',
  ],
};
