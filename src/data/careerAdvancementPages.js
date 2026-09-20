// The two Level 3 "advance your education or career" pages — one class
// (CareerAdvancementScene), two configs, same pattern as pathStats.js.
// Reached from Downtown's college hotspot and any of the business
// hotspots on Downtown/Business, once GameState.pathTaken is set (see
// overworldScreens.js). Every field may be a function of GameState.

const pages = [
  {
    key: 'CareerAdvancementCollege',
    kind: 'college',
    title: 'GO BACK TO SCHOOL',
    stats: [
      "Community college tuition runs about $3,990 a year in-state — real money out of the jar, not a free option.",
      "Adults who re-enroll after already working finish at real rates: 68% of returning community-college students complete what they start. That's not everyone.",
      "Finishing pays off, modestly: completers of a short-term credential earn about $2,000 a year more within two years — a real lever, just a smaller one than a first degree.",
    ],
    source: '[V] College Board average in-state tuition; RNL/NSC returning-adult completion rate; Community College Daily 2025 short-term-training earnings study',
    previousScene: 'Downtown',
  },
  {
    key: 'CareerAdvancementBusiness',
    kind: 'business',
    title: 'LOOK FOR A BETTER POSITION',
    stats: [
      "No tuition here — the cost is time, and the risk that it doesn't pan out.",
      "Right now, workers who switch jobs are out-earning workers who stay: 5.0% wage growth for switchers versus 3.6% for people who stayed put.",
      "That gap isn't permanent. For most of 2025, it ran the other way — staying paid better than switching, for the first time since 2010. Whether moving pays off depends on when you try it, not just whether you try.",
    ],
    source: '[V] Federal Reserve Bank of Atlanta, Wage Growth Tracker, August 2026',
    previousScene: 'Business',
  },
];

export default pages;
