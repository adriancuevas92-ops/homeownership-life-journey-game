// asian-1986's own intro conversation — same role as introConversation.js
// (establish the family, right after Baseline1-3, right before Special-
// Circumstance). This family's history is generational rather than
// something happening to the player's own parents directly — the
// grandparents' incarceration and the Alien Land Law are 1942/pre-1952
// events, already history by 1986 — so the dialogue treats it as
// present, known family fact rather than breaking news, the same way a
// family actually would after forty years. Single new backdrop
// (intro_family_asian), same reasoning as every other archetype's own
// single intro backdrop.

const beats = [
  {
    backdrop: 'intro_family_asian',
    speakers: {
      father: { x: 260, y: 200, side: 'left' },
      mother: { x: 560, y: 160, side: 'right' },
    },
    lines: [
      { speaker: 'mother', text: "Grandpa never said much about the farm. Just that it was gone by the time they let them come back." },
      { speaker: 'father', text: "He said enough. 'Couldn't put my own name on it anyway' — that part I remember clearly." },
      { speaker: 'mother', text: "This one has our name on it. Both our names." },
      { speaker: 'father', text: "That's not nothing. I know it doesn't undo anything, but it's not nothing." },
    ],
  },
  {
    backdrop: 'intro_family_asian',
    speakers: {
      father: { x: 260, y: 200, side: 'left' },
      mother: { x: 560, y: 160, side: 'right' },
    },
    lines: [
      { speaker: 'mother', text: "Still catching up, though. Two generations is a long time to make up in one." },
      { speaker: 'father', text: "We're not starting where the Hendersons started. We're starting where we can." },
      { speaker: 'mother', text: "Where we can is still forward." },
    ],
  },
];

export default {
  key: 'IntroConversationAsian',
  nextScene: 'SpecialCircumstance',
  beats,
};
