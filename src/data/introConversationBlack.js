// black-1986's own intro conversation — same role as introConversation.js
// (establish the family, right after Baseline1-3, right before Special-
// Circumstance), different content: no arrival, no immigration framing.
// Single new backdrop (intro_family_black) rather than introConversation.
// js's three, since this family isn't moving between an arrival scene,
// a first apartment, and a TV news bulletin — they're already settled in
// Fresno; the tension here is about the mortgage market they're up
// against, not a place they're getting to. Foreshadows Special-
// Circumstance/CircumstanceOriginBlack without naming the outcome yet,
// same restraint IntroConversation's own TV-news beat uses.

// Speaker x/y match where the two figures actually land in
// intro_family_black.png (father left, mother right) — not copy-pasted
// from introConversation.js's blocking, which has them reversed.
const beats = [
  {
    backdrop: 'intro_family_black',
    speakers: {
      father: { x: 260, y: 200, side: 'left' },
      mother: { x: 560, y: 160, side: 'right' },
    },
    lines: [
      { speaker: 'mother', text: "Mama never owned a thing with her name on the deed. If we do this right, our kids won't be renting either." },
      { speaker: 'father', text: "\"Right\" means the bank offers us what they'd offer the Hendersons down the street for the same numbers. That hasn't been my experience of banks." },
      { speaker: 'mother', text: 'We qualify. Good credit, steady income, savings besides.' },
      { speaker: 'father', text: "Qualifying and getting offered the same thing are two different things. I've watched it happen to people who qualified same as us." },
    ],
  },
  {
    backdrop: 'intro_family_black',
    speakers: {
      father: { x: 260, y: 200, side: 'left' },
      mother: { x: 560, y: 160, side: 'right' },
    },
    lines: [
      { speaker: 'mother', text: "So we keep saving, and we ask every question before we sign anything. That's the only leverage we've got." },
      { speaker: 'father', text: "It shouldn't have to be a whole campaign just to get a fair rate." },
      { speaker: 'mother', text: "Should isn't where we live. Is, is where we live." },
    ],
  },
];

export default {
  key: 'IntroConversationBlack',
  nextScene: 'SpecialCircumstance',
  beats,
};
