// Archetype #2 — the first proof that the registry built for archetype #1
// actually generalizes. Same shape as latino1986.js on purpose: id,
// label, genders, homeTiers, specialCircumstanceText. What's DIFFERENT
// is the circumstance itself — not documentation status, but being
// steered into a subprime loan despite qualifying for prime terms. Real,
// distinct, and among the best-documented structural circumstances
// available, not a re-skin of the Latino archetype's story.
//
// Avatar art needs nothing new here — OverworldScene/SynopsisScene key
// sprites off GameState.race (avatar_<gender>_black_<variant>_<n>.png),
// not archetypeId, and the full black race sprite set already exists
// from this session's earlier avatar sweep. Only the narrative content
// (baselineWorld.js, introConversationBlack.js, circumstanceOriginBlack.js)
// and 2 new comic-panel backdrops are archetype-specific.

// Timing matters here: the actual subprime-steering wave was 2004-2007
// (see CircumstanceOriginBlack), which predates the shared WorkingYears
// mechanic's own fixed 2012-2020 window — same structural relationship
// Baseline1-3/documentation-status already has for the Latino archetype
// (a formative event that happens to the FAMILY before the player
// character is the one making adult economic decisions), not something
// that happens to the player personally mid-playthrough.
// Length matched to latino1986.js's own CIRCUMSTANCE_TEXT on purpose —
// SpecialCircumstanceScene centers this block vertically against a
// fixed-position title above it. Caught live: the FIRST paragraph is
// the one that actually matters here — latino1986's is short enough
// (39 chars, one line) that the block never grows tall enough to
// overlap the title; the first draft of this one word-wrapped to two
// lines and pushed straight into "A SPECIAL CIRCUMSTANCE." Kept short
// on purpose now, not just trimmed once and hoped.
const CIRCUMSTANCE_TEXT = [
  'You will play this story owing on a bad loan.',
  "Between 2004 and 2007, Black and Latino borrowers who qualified for prime-rate loans were given costlier subprime ones instead — at two to three times the rate. Your family's home was one of them. What that cost them is what you start life carrying — real, documented, not a difficulty setting.",
].join('\n\n');

// [V] BLS Current Population Survey, median usual weekly earnings by
// race/ethnicity and sex, Q1 2025 (bls.gov/news.release/wkyeng): Black
// men $1,017/wk, Black women $984/wk — same release Demographics.js's
// race-income figures already come from.
const MALE_ANNUAL_INCOME = Math.round(1017 * 52);
const FEMALE_ANNUAL_INCOME = Math.round(984 * 52);

export default {
  id: 'black-1986',
  label: 'Fresno, 1986 — a Black family',
  selectPrompt: 'Choose your path',

  genders: {
    male: {
      label: 'Male',
      annualIncome: MALE_ANNUAL_INCOME,
      incomeSource: '[V] BLS CPS, median usual weekly earnings, Black men, Q1 2025',
    },
    female: {
      label: 'Female',
      annualIncome: FEMALE_ANNUAL_INCOME,
      incomeSource: '[V] BLS CPS, median usual weekly earnings, Black women, Q1 2025',
    },
  },

  // Same California setting as latino1986 — deliberate, not a shortcut:
  // reuses the existing Realty/RealtyLA backdrops (no new art cost there)
  // and keeps both archetypes' Ending/Affordability numbers directly
  // comparable, which matters for the point this archetype is making.
  homeTiers: (state) => [
    state.isRural
      ? { name: 'Fresno, CA', homePrice: 430000 }
      : { name: 'Los Angeles, CA', homePrice: 1000000 },
  ],

  specialCircumstanceText: CIRCUMSTANCE_TEXT,

  // SynopsisScene's "rules of this run" page — same shape/count as
  // latino1986.js's block, different facts. No amnesty/DACA/marriage
  // lines here on purpose: this family's defining condition is the
  // lending circumstance, not documentation status.
  synopsisRules: [
    'BORN 1981. GREW UP IN FRESNO, CALIFORNIA. NO ARRIVAL DATE, NO AMNESTY LAW — THAT ISN’T WHAT PUTS THIS FAMILY BEHIND.',
    'STATUS — YOUR FAMILY WAS STEERED INTO A SUBPRIME LOAN, 2004-2007, DESPITE QUALIFYING FOR PRIME TERMS. THIS IS THE HINGE MOST OF THE OTHER RULES SWING ON.',
    'WEALTH — WHATEVER EQUITY THAT LOAN SHOULD HAVE BUILT INSTEAD, IT DIDN’T. YOU START ADULT LIFE WITHOUT IT.',
    'CREDIT — THE LOAN’S AFTERMATH LEFT A REAL MARK ON THIS FAMILY’S CREDIT HISTORY, NOT JUST THEIR SAVINGS.',
  ],
};
