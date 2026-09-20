// "Kitchen table" cutaways — short returns to the parents' point of view
// after the child avatar takes over as the player, per the narrative
// framework locked alongside the "Structural Drag" mechanic (Phaser
// Technical Architecture doc). Their job is to keep the general,
// era-wide conditions from Baseline1-3 audible at the moments they'd
// realistically resurface, not to re-litigate the thesis IntroConversation
// already stated. Reuses ConversationScene and DialogueBubble as-is —
// zero new engine code — and, deliberately, the same `intro_apartment`
// backdrop IntroConversation's second beat used: this family is still in
// the same apartment, years later, which is itself part of the point.
//
// Slotted into the existing ComingOfAge -> DACA gap (~2002 -> 2012) rather
// than at an invented date — an earlier plan called for a beat around
// 1991 (the minimum-wage freeze finally ending), but the current game
// has no scene covering childhood/adolescence for that to attach to
// without adding a new entry point earlier than ComingOfAge. That beat's
// content was folded into KitchenTablePreEndingScene's reflection instead
// of being dropped silently.

const beats = [
  {
    key: 'KitchenTable2008',
    nextScene: 'DACA',
    beats: [
      {
        backdrop: 'intro_apartment',
        speakers: {
          mother: { x: 216, y: 140, side: 'left' },
          father: { x: 600, y: 220, side: 'right' },
        },
        lines: [
          { speaker: 'mother', text: "Twenty-two years since we got here, and the news sounds the same as it did that first year." },
          { speaker: 'father', text: 'Different recession. Same kind of year.' },
          { speaker: 'mother', text: "You'd think one of us would've landed somewhere the ground doesn't move." },
          { speaker: 'father', text: "It's not that we didn't work for it. It's that this keeps happening to people who do." },
        ],
      },
    ],
  },
];

export default beats;
