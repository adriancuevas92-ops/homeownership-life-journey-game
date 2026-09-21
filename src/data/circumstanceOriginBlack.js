import EventEngine from '../systems/EventEngine.js';

// black-1986's "how it happened" beat — reached right after Special-
// Circumstance names the circumstance, before DemographicContext. Per
// direction, rurality and disability are each "their own branching
// storyline," not added color: the two `when`-gated steps below give
// the SAME underlying circumstance (steered into a subprime loan)
// genuinely different causal framings depending on what got rolled —
// urban is a targeting story (reverse redlining: qualified borrowers in
// Black urban neighborhoods steered anyway), rural is a scarcity story
// (fewer lenders operating there at all, not one specific rate targeted
// at this family) — real, distinct, separately documented mechanisms,
// not the same paragraph with a place-name swapped in. The disability
// step is gated independently on top of whichever setting fired, its
// own real, distinct legal category (Fair Housing Act lending
// discrimination on the basis of disability), not reused race content.
const scenes = [
  {
    key: 'CircumstanceOriginBlack',
    backdrop: 'circumstance_origin_black',
    genderless: true,
    previousScene: 'SpecialCircumstance',
    nextScene: 'DemographicContext',
    steps: [
      { type: 'text', text: "Here's how it happened." },
      {
        type: 'text',
        when: (state) => !state.isRural,
        // [V] HMDA lending-pattern analyses and reverse-redlining
        // litigation (City of Memphis v. Wells Fargo, 2011; City of
        // Baltimore v. Wells Fargo, 2010-2012): documented steering of
        // qualified borrowers in Black urban neighborhoods into subprime
        // products specifically, not a general credit shortage.
        text: "This wasn't a shortage of options. Internal lending data from this era shows loan officers in Black neighborhoods specifically marketing subprime products to borrowers who qualified for better — a pattern lawyers later called \"reverse redlining.\" Same neighborhoods the maps once marked red, targeted again, differently.",
      },
      {
        type: 'text',
        when: (state) => state.isRural,
        // [V] Urban Institute / USDA rural mortgage-lending-access
        // research (same source already cited in demographicNarratives.
        // js's rural "mortgage desert" beat) — fewer conventional
        // lenders operating in rural markets at all, a distinct
        // mechanism from urban targeting.
        text: "Out here, it wasn't about being singled out — it was about who showed up at all. Rural markets like this one have measurably fewer conventional lenders competing for a loan in the first place. When the only offer on the table is a subprime one, \"no\" isn't really a choice.",
      },
      {
        type: 'text',
        when: (state) => state.hasDisability,
        // [V] Fair Housing Act, disability as a protected class; HUD
        // Office of Fair Housing and Equal Opportunity, lending-
        // discrimination enforcement actions on the basis of disability
        // — a distinct legal category from the racial-targeting pattern
        // above, not a restatement of it.
        text: "One more real condition on top of the rest: disability is its own protected category under the Fair Housing Act, and HUD's own enforcement record shows lenders denying accommodations and steering disabled applicants right alongside the racial pattern above — a separate, also-documented layer, not the same story twice.",
      },
      {
        type: 'effect',
        apply: (state) => EventEngine.applyPredatoryLendingPenalty(state),
        text: "None of it shows up as a single bad day. It shows up as a savings rate that never quite recovers — money that should have built equity instead spent on a rate that was never the real offer.",
      },
    ],
  },
];

export default scenes;
