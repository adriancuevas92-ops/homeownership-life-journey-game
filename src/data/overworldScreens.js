// Bounding boxes are in the SOURCE image's native 2048x2048 pixel space,
// eyeballed against the generated art and refined by hover-testing in the
// browser (Phaser Technical Architecture doc Section 8.3) — not measured
// with pixel-exact tooling. OverworldScene transforms these at render time
// using the same cover-fit scale/offset it applies to the backdrop image.

const screens = [
  {
    // Stage 1's actual starting point: the child avatar's home. The player
    // walks right, off the edge, straight into FresnoHigh. The front door
    // is a dead-end peek at the Synopsis screen (avatar + "rules of this
    // run") — `returnTo` tells Synopsis to send both continue and back
    // straight to Home instead of forward into the Baseline1-3 intro.
    key: 'Home',
    backdrop: 'overworld_home',
    avatarVariant: 'child',
    edges: { left: null, right: 'FresnoHigh' },
    hotspots: [
      {
        id: 'front-door',
        label: 'Go inside',
        box: { x: 820, y: 1050, width: 300, height: 500 },
        targetType: 'narrative',
        targetKey: 'Synopsis',
        returnTo: 'Home',
      },
    ],
  },
  {
    // Level 1's destination: a small child avatar arrives at the only
    // available option (Concept doc's locked stage-1 plan). The hotspot
    // gates into SchoolTestScene, which itself forks into the graduate
    // path (pass the test) or the dropout path (drop out at any point,
    // or after failing) — see DropoutDisadvantageScene / GameState.
    // isHighSchoolGraduate.
    key: 'FresnoHigh',
    backdrop: 'overworld_school',
    avatarVariant: 'child',
    // This backdrop's sidewalk sits lower than the shared default ground
    // plane — without this override the avatar floats up near the power
    // lines instead of standing on the ground in front of the building.
    walkY: 500,
    walkYMin: 480,
    walkYMax: 520,
    edges: { left: 'Home', right: null },
    hotspots: [
      {
        id: 'school-entrance',
        label: 'Fresno High School',
        box: { x: 780, y: 1150, width: 520, height: 550 },
        targetType: 'narrative',
        targetKey: 'SchoolTest',
      },
    ],
  },
  {
    // Level 2's actual starting point: the same home, the same screen key
    // pattern as child-stage Home, but the grown-up avatar (no
    // avatarVariant override — falls back to the default adult sprite)
    // and no front-door hotspot back to Synopsis; that peek belongs to
    // the child stage. Skips straight to Downtown rather than routing
    // through Residential — see the note on Residential below.
    key: 'HomeAdult',
    backdrop: 'overworld_home',
    edges: { left: null, right: 'Downtown' },
    hotspots: [],
  },
  {
    // The player's home neighborhood — flavor and culture (Concept doc
    // Section 19), not institutions, so no hotspots. Still not wired into
    // any path: this backdrop turned out, on inspection (Section 19.2),
    // to actually be an unrelated nighttime commercial strip, not a
    // residential street — visually wrong for either the child or adult
    // Home's daytime neighborhood. Left in the file, unreachable, pending
    // either a real regeneration or removal, rather than wiring a known
    // mismatch into a path players will now actually walk.
    key: 'Residential',
    backdrop: 'overworld_residential',
    edges: { left: null, right: 'Downtown' },
    hotspots: [],
  },
  {
    // Also Level 3's own map, reused rather than duplicated: once
    // GameState.pathTaken is set (any path — see pathStats.js's
    // onContinue), the college and every business door here stop leading
    // to the Level 2 stats pages and start leading to CareerAdvancement's
    // "go back to school" / "look for a better position" pages instead.
    // WorkingYears.nextScene sends every path back through here for
    // exactly that reason. Recruiting is deliberately left alone — there
    // is no re-enlistment mechanic — so it always shows MilitaryStats.
    key: 'Downtown',
    backdrop: 'overworld_downtown',
    avatarVariant: (state) => (state.pathTaken ? (state.isVeteran ? 'military' : 'final') : undefined),
    // Left edge closes once GameState.pathTaken is set (Level 3): there's
    // no narrative reason to let the player wander back to "their
    // original home" — HomeAdult — once they're deciding their own.
    // Right (Business) stays open both stages; that's still part of the
    // Level 3 map.
    edges: { left: (state) => (state.pathTaken ? null : 'HomeAdult'), right: 'Business' },
    hotspots: [
      {
        id: 'college',
        label: 'Fresno City College',
        box: { x: 0, y: 700, width: 360, height: 1050 },
        targetType: 'narrative',
        targetKey: (state) => (state.pathTaken ? 'CareerAdvancementCollege' : 'CollegeStats'),
      },
      // Every building here that isn't the college or the recruiting
      // station is a workforce-path door — the player can check any of
      // them looking for work, same destination for now (WorkforceStats)
      // until the job-search/skill-building mechanic replaces it.
      {
        id: 'bank',
        label: 'Valley Bank',
        box: { x: 440, y: 680, width: 380, height: 1070 },
        targetType: 'narrative',
        targetKey: (state) => (state.pathTaken ? 'CareerAdvancementBusiness' : 'WorkforceStats'),
      },
      {
        id: 'checks-cashed',
        label: 'Checks Cashed / QuickCash Loans',
        box: { x: 820, y: 780, width: 370, height: 970 },
        targetType: 'narrative',
        targetKey: (state) => (state.pathTaken ? 'CareerAdvancementBusiness' : 'WorkforceStats'),
      },
      {
        id: 'recruiting',
        label: 'Recruiting Station',
        box: { x: 1190, y: 840, width: 320, height: 910 },
        targetType: 'narrative',
        targetKey: 'MilitaryStats',
      },
      {
        id: 'property-management',
        label: 'Valley Property Management',
        box: { x: 1510, y: 820, width: 440, height: 930 },
        targetType: 'narrative',
        targetKey: (state) => (state.pathTaken ? 'CareerAdvancementBusiness' : 'WorkforceStats'),
      },
    ],
  },
  {
    key: 'Business',
    backdrop: 'overworld_business_district',
    avatarVariant: (state) => (state.pathTaken ? (state.isVeteran ? 'military' : 'final') : undefined),
    edges: { left: 'Downtown', right: null },
    hotspots: [
      {
        id: 'panaderia',
        label: 'Panadería La Esperanza',
        box: { x: 0, y: 860, width: 630, height: 890 },
        targetType: 'narrative',
        targetKey: (state) => (state.pathTaken ? 'CareerAdvancementBusiness' : 'WorkforceStats'),
      },
      {
        id: 'corporate-plaza',
        label: 'Meridian Corporate Plaza',
        box: { x: 1300, y: 610, width: 748, height: 1140 },
        targetType: 'narrative',
        targetKey: (state) => (state.pathTaken ? 'CareerAdvancementBusiness' : 'WorkforceStats'),
      },
    ],
  },
  {
    // Level 3's whole stage: wherever a run's path actually took the
    // character (military/college/workforce, KitchenTablePreEnding's
    // "what it added up to" reflection right before this), they all land
    // here the same way every other narrative jump in this game works —
    // arriving fresh via the standard edge-entry animation, not a
    // literal walk from a specific prior building. One destination: the
    // realty office. Entering it is the whole game's final scene
    // (Ending) — content/results there are tuned separately from this
    // stage's own interface.
    key: 'Realty',
    backdrop: 'overworld_realty',
    // Older, "final" civilian look by default; the uniformed sprite for a
    // run that completed the Military drill (GameState.isVeteran) — see
    // OverworldScene.preload's dynamic avatarVariant resolution.
    avatarVariant: (state) => (state.isVeteran ? 'military' : 'final'),
    // This backdrop is a close-in storefront shot, not a wide street —
    // the shared default avatar height (130px) reads as too small here.
    avatarHeight: 240,
    // Same reasoning as FresnoHigh's override: this backdrop's sidewalk
    // sits much lower in frame than the shared default ground plane.
    walkY: 540,
    walkYMin: 500,
    walkYMax: 570,
    edges: { left: null, right: null },
    hotspots: [
      {
        id: 'realty-office',
        label: 'Valley Realty',
        // Door only, not the whole storefront — the player spawns at the
        // left edge (see KitchenTablePreEndingScene's _continue) and has
        // to actually walk across the sidewalk to reach it. y-range
        // matches this screen's own walkY/walkYMin/walkYMax band above,
        // not the shared default (native-coordinate math, not a straight
        // eyeball guess, since the walk band sits well below FresnoHigh's).
        box: { x: 1080, y: 1500, width: 320, height: 260 },
        targetType: 'narrative',
        targetKey: 'Ending',
      },
    ],
  },
];

export default screens;
