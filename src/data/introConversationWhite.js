// white-1986's own intro conversation — same role as introConversation.js
// (establish the family, right after Baseline1-3, right before Special-
// Circumstance), different content: no arrival, no steered loan, no
// tension about qualifying. That absence is the point, and it's shown
// rather than stated — the dialogue's actual subject is schools and
// commute distance, not financing, because financing isn't where this
// family's attention has to go. Single new backdrop (intro_family_white),
// same reasoning introConversationBlack.js's header gives for its own
// single backdrop: this family isn't moving between an arrival scene and
// a first apartment, they're already settled, the tension here is
// entirely elsewhere.

const beats = [
  {
    backdrop: 'intro_family_white',
    speakers: {
      father: { x: 260, y: 200, side: 'left' },
      mother: { x: 560, y: 160, side: 'right' },
    },
    lines: [
      { speaker: 'father', text: "Loan officer says we're pre-approved, no trouble. Same rate the Petersons got last spring." },
      { speaker: 'mother', text: "That's one thing off the list, then. I care more about which elementary school this ends up zoned for." },
      { speaker: 'father', text: 'Fair. Money side of it was never going to be the hard part.' },
      { speaker: 'mother', text: "It never really is, is it." },
    ],
  },
  {
    backdrop: 'intro_family_white',
    speakers: {
      father: { x: 260, y: 200, side: 'left' },
      mother: { x: 560, y: 160, side: 'right' },
    },
    lines: [
      { speaker: 'father', text: "So — commute distance, or the extra bedroom. Pick one, we can't have both at this price." },
      { speaker: 'mother', text: "Extra bedroom. You can leave twenty minutes earlier." },
      { speaker: 'father', text: "Deal." },
    ],
  },
];

export default {
  key: 'IntroConversationWhite',
  nextScene: 'SpecialCircumstance',
  beats,
};
