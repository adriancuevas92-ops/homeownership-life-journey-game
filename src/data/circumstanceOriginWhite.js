// white-1986's "how it happened" beat — reached right after Special-
// Circumstance names the (absent) circumstance, before DemographicContext.
// Same shape as circumstanceOriginBlack.js on purpose: an intro line,
// an urban/rural `when`-gated pair giving the SAME underlying fact
// (frictionless access to the postwar mortgage system) genuinely
// different framings, a `hasDisability`-gated step, and a closing step.
// The closing step is `type: 'text'`, not `type: 'effect'`, because
// there is genuinely nothing to apply here — no EventEngine call, no
// penalty function, nothing. That absence is stated outright rather
// than left as an unexplained gap a player might read as a bug.
const scenes = [
  {
    key: 'CircumstanceOriginWhite',
    backdrop: 'circumstance_origin_white',
    genderless: true,
    previousScene: 'SpecialCircumstance',
    nextScene: 'DemographicContext',
    steps: [
      { type: 'text', text: "Here's how it happened." },
      {
        type: 'text',
        when: (state) => !state.isRural,
        // [V] FHA Underwriting Manual (1930s-1960s editions) explicitly
        // instructed appraisers to grade racially homogeneous white
        // neighborhoods as the most stable, most insurable risk — the
        // literal underwriting standard behind the green side of the
        // maps Baseline2 already showed. Not a fluke of this family's
        // paperwork; the paperwork itself was built around them.
        text: "The maps Baseline2 already showed you weren't only red. This family's side was green — and green wasn't luck. It was the underwriting manual's own top grade, written explicitly around neighborhoods that looked like this one. The system wasn't neutral toward this family. It was built with them in mind.",
      },
      {
        type: 'text',
        when: (state) => state.isRural,
        // Direct contrast to circumstanceOriginBlack.js's own rural
        // framing (fewer lenders competing at all) — same rural mortgage
        // market, opposite experience of it, which is itself the point:
        // scarcity isn't a fact about rural lending in general, it's a
        // fact about who rural lenders were competing for.
        text: "Out here, this family wasn't the exception lenders had to make room for — they were exactly who rural mortgage programs were built to serve. Every loan officer in town wanted this business. \"No\" was never really on the table.",
      },
      {
        type: 'text',
        when: (state) => state.hasDisability,
        // [V] Fair Housing Act, disability as a protected class; HUD
        // Office of Fair Housing and Equal Opportunity enforcement
        // record — same real, separate legal category
        // circumstanceOriginBlack.js cites, written distinctly rather
        // than restated, because it's a genuinely independent axis: it
        // doesn't care what else this family does or doesn't carry.
        text: "One condition here doesn't care what else this family has going for it: disability is its own protected category under the Fair Housing Act, and HUD's own enforcement record shows lenders denying accommodations and steering disabled applicants regardless of anything else on the application. Everything above made this family's path easier. This part of it isn't automatically easier for anyone.",
      },
      {
        type: 'text',
        text: "No line just executed to make this harder. No penalty just got applied. That's not a gap in how this game is built — it's the point: everyone else in this game carries an extra rule here. This family doesn't, and that absence is itself real, documented history, not a difficulty setting left unset.",
      },
    ],
  },
];

export default scenes;
