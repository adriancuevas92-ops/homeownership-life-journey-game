// The content bank PathConsequenceScene reads from — the "mechanism"
// half of the mechanism/content split this file exists to make possible.
// Adding a fourth Level 2 path later means adding a key here and setting
// GameState.pathTaken at that path's decision point (see pathStats.js's
// onContinue / CollegeTestScene / MilitaryDrillScene); PathConsequenceScene
// itself never changes.
//
// Every path's bank carries exactly three beats, always in this order,
// because that order is the actual point of the mechanism (per direction):
//   1. statistic   — what THIS run's own numbers just did, in real,
//                     sourced terms (often quoting GameState back at the
//                     player, not a generic fact).
//   2. uncertainty — why that number is a distribution the player drew
//                     one result from, not a promise. "Nothing is 100%."
//   3. qualitative — a real, sourced complication the numbers alone don't
//                     carry, so the path doesn't read as simply "solved."
//
// `text` may be a plain string or a function of GameState, resolved once
// when the scene starts. `when` is an optional function of GameState — if
// present and it returns false, the beat is skipped entirely (for content
// that only applies to some runs, not "true for everyone but phrased
// differently," which `text`-as-function already covers).

const CONSEQUENCES = {
  military: [
    {
      id: 'military-statistic',
      category: 'statistic',
      text: () => "Every veteran in this simulation buys in on real terms, not a story: 0% down, and a lower mortgage rate than anyone else gets here. Veterans own homes at a 78% rate nationally — about 13 points above the national average.",
      source: '[V] VA Loan Network / Realtor.com veteran homeownership data',
    },
    {
      id: 'military-uncertainty',
      category: 'uncertainty',
      text: "None of that came from enlisting alone. The terms are real the day you qualify — reaching that day still took the same nine years of saving, and the same job-disruption rolls, as every other path in this game.",
    },
    {
      id: 'military-qualitative',
      category: 'qualitative',
      text: (state) => {
        const isFemale = state.character === 'female';
        return "The uniform carries a real cost the mortgage math never counts. About 7% of veterans experience PTSD at some point in their life, versus 6% of civilians overall — and for those who served in Iraq or Afghanistan specifically, that climbs to 11-20%. For women who serve, the lifetime rate runs more than double their male counterparts: 13% versus 6%."
          + (isFemale ? " That's the group this run is in." : '');
      },
      source: '[V] U.S. Dept. of Veterans Affairs, National Center for PTSD',
    },
  ],

  college: [
    {
      id: 'college-statistic',
      category: 'statistic',
      text: (state) => `That degree just moved your number: $${state.annualIncome.toLocaleString()}/yr, on the strength of the real bachelor's-vs-diploma wage gap — $1,533 a week median versus $946.`,
      source: '[V] BLS median weekly earnings by education, 2024',
    },
    {
      id: 'college-uncertainty',
      category: 'uncertainty',
      text: "That multiplier is a median across every major there is — not a floor. Plenty of degree-holders land below it. Plenty of people without a degree land above it.",
    },
    {
      id: 'college-qualitative',
      category: 'qualitative',
      text: "The premium depends enormously on what the degree is in. Lifetime, the gap between the highest- and lowest-paying majors is $3.4 million — wider than the gap between having a bachelor's degree at all and not. The lowest-paying majors, things like early childhood education and human services, median $39,000 to $41,000 a year — several thousand below what a diploma alone pays in this simulation.",
      source: '[V] Georgetown University Center on Education and the Workforce',
    },
  ],

  workforce: [
    {
      id: 'workforce-statistic',
      category: 'statistic',
      text: (state) => `The packing house set your starting rate: $${state.annualIncome.toLocaleString()}/yr. No tuition, no loans, no four years of waiting for it — the trade-off is everything above this number.`,
    },
    {
      id: 'workforce-uncertainty',
      category: 'uncertainty',
      text: "That starting number isn't fixed either. The next nine years carry the same disruption risk every path in this game carries — this route just starts taking those risks today instead of after a degree or a deployment.",
    },
    {
      id: 'workforce-qualitative',
      category: 'qualitative',
      text: "The paycheck isn't the whole picture. Among the lowest-paid tenth of private-sector workers, only 40% have access to an employer retirement plan at all, versus 94% for the highest-paid tenth. The wage gap in this simulation is real; the benefits gap sitting behind it is usually bigger.",
      source: '[V] U.S. Bureau of Labor Statistics, Employee Benefits in the United States, March 2025',
    },
  ],
};

export default CONSEQUENCES;
