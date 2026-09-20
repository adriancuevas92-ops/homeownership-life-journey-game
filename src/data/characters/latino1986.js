// Archetype #1 — the only character this game has ever played, now
// gathered under one manifest instead of scattered across hardcoded
// constants in CharacterSelectScene, SpecialCircumstanceScene, and
// Affordability.js. This file doesn't duplicate the narrative content
// that already lived in its own data files (baselineWorld.js,
// introConversation.js, kitchenTableBeats.js, adulthoodWorld.js,
// scenes.js) — those stay put and get referenced from main.js exactly
// as before. What lives HERE is specifically the stuff that was
// previously hardcoded inline in a scene class, with no data file of its
// own: gender/income options, home-price tiers, and the special-
// circumstance text.
//
// See src/data/characters/index.js for what adding a second archetype
// actually requires — this file is the template for it.

const CIRCUMSTANCE_TEXT = [
  'You will play this story undocumented.',
  "Every choice ahead — school, work, a lease, a loan — carries a risk most players never have to weigh. That isn't a difficulty setting. It's the real, documented experience of millions of families who arrived the way yours just did, three years too late for the one law that could have changed everything.",
].join('\n\n');

// [V] BLS OEWS May 2025 (Concept doc Section 17): $19.89-$19.99/hr,
// full-time equivalent, blended ~$41,500.
const MALE_ANNUAL_INCOME = 41500;
// [V] Latina wage ratio vs. white non-Hispanic men, IWPR/NWLC 2025
// (Concept doc Section 4): 54.1 cents per dollar. [E]: applied as a flat
// ratio for MVP simplicity — see CharacterSelectScene's prior note on
// the age-banded real version being future work.
const FEMALE_ANNUAL_INCOME = Math.round(MALE_ANNUAL_INCOME * 0.541);

export default {
  id: 'latino-1986',
  label: 'Fresno, 1986',
  selectPrompt: 'Choose your path',

  // CharacterSelectScene builds one button per entry here, in
  // declaration order — a third entry with its own key/income/source is
  // the entire diff needed to add a gender option, no scene-class change.
  genders: {
    male: {
      label: 'Male',
      annualIncome: MALE_ANNUAL_INCOME,
      incomeSource: '[V] BLS OEWS, May 2025 — Fresno entry-level blended wage',
    },
    female: {
      label: 'Female',
      annualIncome: FEMALE_ANNUAL_INCOME,
      incomeSource: '[V] IWPR/NWLC 2025 — Latina-to-white-male wage ratio, 54.1 cents/$1, applied flat',
    },
  },

  // Affordability.check() itself is archetype-agnostic (takes homePrice
  // as a parameter); only which price(s) to show was ever specific to
  // this character's setting. Per direction: no relocate-to-somewhere-
  // cheaper escape valve (Peoria, the national blend) — the question is
  // just whether homeownership in California is possible, so this is a
  // single tier, not three. Which California city depends on
  // GameState.isRural (Demographics.js): rural stays Fresno, urban is
  // Los Angeles. NOTE: this is the mechanical/narrative layer only —
  // SchoolTest, CollegeStats, PackingHouse, and every overworld backdrop
  // still say "Fresno" regardless of this roll until the LA art/content
  // pass happens (see DemographicContextScene's note on the same gap).
  homeTiers: (state) => [
    state.isRural
      ? { name: 'Fresno, CA', homePrice: 430000 } // [V] Zillow/Movoto/Houzeo, 2026 range $391k-435k
      : { name: 'Los Angeles, CA', homePrice: 1000000 }, // [V] Redfin, LA city median sale price, 2026
  ],

  specialCircumstanceText: CIRCUMSTANCE_TEXT,
};
