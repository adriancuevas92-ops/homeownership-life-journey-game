import EventEngine from '../systems/EventEngine.js';

const scenes = [
  {
    key: 'ComingOfAge',
    backdrop: 'scene3',
    nextScene: 'CollegeTest',
    steps: [
      { type: 'text', text: "You're twenty — a student at Fresno City College, piecing together tuition however your family can." },
      { type: 'text', text: "In Washington, a bill is introduced that would finally offer a path: in-state tuition, legal status, for people brought here as kids like you." },
      { type: 'text', text: "It doesn't get the votes it needs. It won't pass — not this year, not for over a decade." },
    ],
  },
  {
    key: 'DACA',
    backdrop: 'scene4',
    nextScene: 'Business',
    steps: [
      { type: 'text', text: "June 2012. You're thirty. The federal government creates DACA — an executive action, because Congress never passed one." },
      { type: 'text', text: "If you arrived before your 16th birthday and you're under 31 today, you qualify. You do — with less than a year to spare." },
      { type: 'text', text: "WORK AUTHORIZATION: GRANTED. MORTGAGE ELIGIBILITY: STILL CLOSED." },
    ],
  },
  {
    key: 'WorkingYears',
    backdrop: 'scene5',
    // Detours through Downtown first, not straight to the reflection —
    // Level 3's "advance your education or career" mechanism
    // (CareerAdvancementScene) lives on the same college/business
    // hotspots every path already walked past, now that there's actually
    // a savingsJar to spend on it. Either advancement page's own
    // Continue button is what actually reaches KitchenTablePreEnding.
    nextScene: 'Downtown',
    steps: [
      { type: 'text', text: "Nine years. You work, you save toward a down payment, and — like everyone else in this game — you're not fully in control of what the economy does to you while you do it." },
      {
        type: 'roll',
        roll: (state) => {
          const result = EventEngine.rollJobDisruption(state.character, '2012-2015', state.disruptionRateMultiplier);
          applyWorkingYearsSavings(state, result, 4);
          return result;
        },
        success: '2012–2015: steady work. The jar fills, slowly.',
        fail: '2012–2015: a disruption you didn\'t choose costs you months of savings.',
      },
      {
        type: 'roll',
        roll: (state) => {
          const result = EventEngine.rollJobDisruption(state.character, '2016-2019', state.disruptionRateMultiplier);
          applyWorkingYearsSavings(state, result, 4);
          return result;
        },
        success: '2016–2019: steady work continues.',
        fail: '2016–2019: another setback, not of your making.',
      },
      {
        type: 'roll',
        roll: (state) => {
          const result = EventEngine.rollJobDisruption(state.character, '2020', state.disruptionRateMultiplier);
          applyWorkingYearsSavings(state, result, 1);
          return result;
        },
        success: '2020: the pandemic hits the country, but not you directly. You keep working.',
        fail: '2020: the pandemic economy catches you. The jar takes a real hit.',
      },
    ],
  },
];

function applyWorkingYearsSavings(state, result, years) {
  // [E] design simplification: 15% savings rate in steady years, 5% in a
  // disrupted year — not sourced figures, a transparent placeholder for
  // real household budget modeling. `savingsRatePenalty` (Baseline1's Tax
  // Reform Act "Structural Drag" modifier) is subtracted on top, floored
  // at 1% so a bad combination never turns saving into an actual net loss.
  const baseRate = result.disrupted ? 0.05 : 0.15;
  const rate = Math.max(0.01, baseRate - state.savingsRatePenalty);
  state.savingsJar += Math.round(state.annualIncome * rate * years);
}

export default scenes;
