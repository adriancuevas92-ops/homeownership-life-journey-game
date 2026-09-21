// The three Level 2 life-path pages, reached by walking to their hotspot
// on Downtown (college, military) or Business (workforce) — the same
// overworld screens the orphaned teen-avatar map already had hotspots
// for. Real, sourced comparative statistics per path; no path is framed
// as simply "correct" — each is a genuine trade-off, matching this
// project's established tone (see e.g. Section 21's income-factor work).

const paths = [
  {
    key: 'CollegeStats',
    title: 'THE COLLEGE PATH',
    stats: [
      "A bachelor's degree holder earns a median $1,533 a week. A high school diploma alone: $946.",
      "Georgetown's Center on Education and the Workforce puts a bachelor's degree at $2.8 million in career earnings — versus $1.6 million with a diploma alone. A 75% premium, paid out over decades, not up front.",
      "The average bachelor's-degree borrower leaves owing $35,530, typically over 10 to 25 years to repay.",
    ],
    source: '[V] BLS median weekly earnings, 2024; Georgetown CEW lifetime earnings by education; average bachelor’s debt, 2025 data',
    continueLabel: 'Go to Fresno City College',
    // ComingOfAge is Latino-archetype-specific (the DREAM Act narrative)
    // — a real gap found while building black-1986: the college path's
    // downstream content (ComingOfAge, DACA) was never actually
    // archetype-agnostic the way DemographicContext-onward is. Skip
    // straight to CollegeTest for any archetype without an immigration-
    // status circumstance to narrate there.
    nextScene: (state) => (state.archetypeId === 'latino-1986' ? 'ComingOfAge' : 'CollegeTest'),
    previousScene: 'Downtown',
    onContinue: (state) => { state.pathTaken = 'college'; },
  },
  {
    // Closed to a dropout — real enlistment policy, not an arbitrary
    // difficulty gate: the services require a high school diploma or GED
    // for the large majority of accessions. Same PathStatsScene, same
    // key, same hotspot — the content just reads differently and the
    // continue button sends you back instead of forward, resolved fresh
    // against GameState each time the scene starts (see
    // PathStatsScene._resolveConfig).
    key: 'MilitaryStats',
    title: (state) => (state.isHighSchoolGraduate === false ? 'THE MILITARY PATH — CLOSED' : 'THE MILITARY PATH'),
    stats: (state) => (state.isHighSchoolGraduate === false ? [
      "Enlistment requires a high school diploma or GED for the large majority of recruits. Without one, this door is closed to you right now.",
      "Veterans still own homes at a 78% rate nationally — about 13 points above the national average, largely on the strength of the VA loan's zero-down benefit. It's real. It's just not reachable from here without finishing school first.",
    ] : [
      'Veterans own homes at a 78% rate — about 13 points above the national average.',
      'The VA loan is why: zero down payment on over 74% of VA home purchases last year, and no mortgage insurance on top of that.',
      "Only about 3 in 10 veterans who qualify for the zero-down benefit actually use it. Most don't know it's there.",
    ]),
    source: (state) => (state.isHighSchoolGraduate === false
      ? '[E] DoD enlistment education-credential standards, current policy'
      : '[V] VA Loan Network / Realtor.com veteran homeownership data, current reporting year'),
    continueLabel: (state) => (state.isHighSchoolGraduate === false ? 'Back to Downtown' : 'Enlist'),
    nextScene: (state) => (state.isHighSchoolGraduate === false ? (state.overworldReturnScreen || 'Downtown') : 'MilitaryDrill'),
    previousScene: 'Downtown',
    // Only fires when nextScene above actually leads to MilitaryDrill —
    // a dropout bounced back to Downtown never "took" this path.
    onContinue: (state) => { if (state.isHighSchoolGraduate !== false) state.pathTaken = 'military'; },
  },
  {
    key: 'WorkforceStats',
    title: 'THE WORKFORCE PATH',
    stats: [
      "No tuition, no loans — income starts now instead of four years from now.",
      "But the ceiling is real: $946 a week median versus $1,533 for a bachelor's degree. That gap compounds every year you're not closing it.",
      "It isn't automatically the wrong choice. It's a real trade — years of earning now, against a steeper income curve later.",
    ],
    source: '[V] BLS median weekly earnings by education, 2024',
    continueLabel: 'Start Working',
    nextScene: 'PackingHouse',
    previousScene: 'Business',
    // Guarded, not unconditional: the college path also reaches
    // WorkforceStats later (via DACA -> Business) with pathTaken already
    // 'college' — this must not overwrite that.
    onContinue: (state) => { if (!state.pathTaken) state.pathTaken = 'workforce'; },
  },
];

export default paths;
