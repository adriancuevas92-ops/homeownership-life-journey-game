import EventEngine from '../systems/EventEngine.js';

// asian-1986's "how it happened" beat — reached right after Special-
// Circumstance names the circumstance, before DemographicContext. Same
// shape as circumstanceOriginBlack.js: an intro line, an urban/rural
// `when`-gated pair giving the SAME underlying circumstance (the Alien
// Land Law + WWII incarceration) genuinely different, real, separately
// documented framings, a `hasDisability`-gated step, and a closing
// effect step.
const scenes = [
  {
    key: 'CircumstanceOriginAsian',
    backdrop: 'circumstance_origin_asian',
    genderless: true,
    previousScene: 'SpecialCircumstance',
    nextScene: 'DemographicContext',
    steps: [
      { type: 'text', text: "Here's how it happened." },
      {
        type: 'text',
        when: (state) => !state.isRural,
        // [V] Densho Digital Archive / Mapping Inequality (Univ. of
        // Richmond): Japantowns and other Asian-majority neighborhoods
        // in cities like Los Angeles and San Francisco sat inside the
        // same HOLC "hazardous" grade Baseline2's maps drew — and, on
        // top of that redlining, the businesses and homes IN those
        // neighborhoods were the ones liquidated within days of forced
        // removal in 1942. Two separate structural facts stacking on
        // the same city blocks.
        text: "This family's neighborhood sat inside the same red lines Baseline2 already showed you — Japantowns and Chinatowns graded \"hazardous\" right alongside the Black neighborhoods those maps also marked. Then, in 1942, it was the homes and businesses inside those same blocks that got sold off or abandoned in days. The map and the removal weren't two different stories. They were the same one.",
      },
      {
        type: 'text',
        when: (state) => state.isRural,
        // [V] Densho Encyclopedia / National Archives: California's
        // Japanese American farmers held real agricultural land by the
        // 1930s despite the Alien Land Law — often through U.S.-citizen
        // children holding legal title, a documented workaround — only
        // to lose those farms entirely during incarceration, forced to
        // sell within days or simply lose them while gone.
        text: "Out here, this family's grandparents had actually done it — built a working farm despite a law that said they couldn't legally hold the deed, using their own children's citizenship to make it happen. Then 1942 took it anyway. Days to sell everything, or just gone while they were held somewhere else. The workaround worked, right up until it didn't matter.",
      },
      {
        type: 'text',
        when: (state) => state.hasDisability,
        // [V] Fair Housing Act, disability as a protected class; HUD
        // Office of Fair Housing and Equal Opportunity enforcement
        // record — same real, separate legal category
        // circumstanceOriginBlack.js/circumstanceOriginWhite.js each
        // cite, written distinctly here too.
        text: "One more real condition, independent of everything above: disability is its own protected category under the Fair Housing Act, and HUD's own enforcement record shows lenders denying accommodations and steering disabled applicants on top of whatever else is already stacked against a household — a separate, also-documented layer, not the same story twice.",
      },
      {
        type: 'effect',
        apply: (state) => EventEngine.applyGenerationalDispossessionPenalty(state),
        text: "None of it shows up as a single bad year. It shows up as two generations that should have compounded into something, and didn't — a savings rate that's still carrying land nobody was allowed to keep, twice over.",
      },
    ],
  },
];

export default scenes;
