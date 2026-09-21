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
    // DACA is Latino-archetype-specific content (same gap CollegeStats'
    // nextScene fix addresses) — black-1986 skips straight to Business,
    // same destination DACA itself would have sent them to anyway.
    nextScene: (state) => (state.archetypeId === 'latino-1986' ? 'DACA' : 'Business'),
    beats: [
      {
        when: (state) => state.archetypeId === 'latino-1986',
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
      {
        // black-1986's own version of the same beat — this is the
        // moment their circumstance (CircumstanceOriginBlack, already
        // resolved by now) actually crystallizes into "this is still
        // costing us," not background noise about a recession that
        // happened to someone else.
        when: (state) => state.archetypeId === 'black-1986',
        backdrop: 'intro_family_black',
        speakers: {
          mother: { x: 216, y: 140, side: 'left' },
          father: { x: 600, y: 220, side: 'right' },
        },
        lines: [
          { speaker: 'mother', text: "Twenty-two years in this state, and the news is using our neighborhood as the example again." },
          { speaker: 'father', text: "Not 'our neighborhood.' Our loan. There's a difference, and they never make it." },
          { speaker: 'mother', text: "Doesn't feel like much of one from where we're sitting." },
          { speaker: 'father', text: "No. It doesn't. That's still what we're paying for." },
        ],
      },
      {
        // white-1986's own version — this family is watching the same
        // recession on the same TV, but from a real, documented
        // different position: post-2008 research (Fed Survey of
        // Consumer Finances) found white homeowners carried more equity
        // going in and recovered faster after, largely because they
        // were far less likely to have been steered into the subprime
        // products driving the crash in the first place. Not smugness —
        // this beat is about the family noticing the gap between what
        // the news describes and what's actually happening to them.
        when: (state) => state.archetypeId === 'white-1986',
        backdrop: 'intro_family_white',
        speakers: {
          mother: { x: 216, y: 140, side: 'left' },
          father: { x: 600, y: 220, side: 'right' },
        },
        lines: [
          { speaker: 'mother', text: "The news makes it sound like everyone's underwater. We're not underwater." },
          { speaker: 'father', text: "We're not, no. I keep waiting for it to catch up to us and it just... doesn't." },
          { speaker: 'mother', text: "Should it, though? We didn't do anything different than anyone else." },
          { speaker: 'father', text: "That's kind of the point. We didn't have to." },
        ],
      },
      {
        // asian-1986's own version — ties back to circumstanceOriginAsian.
        // js's own throughline (two generations trying to compound into
        // something) rather than the 2008 crisis itself, since this
        // family's defining circumstance predates 2008 by decades; the
        // crisis year is just where the gap becomes visible again.
        when: (state) => state.archetypeId === 'asian-1986',
        backdrop: 'intro_family_asian',
        speakers: {
          mother: { x: 216, y: 140, side: 'left' },
          father: { x: 600, y: 220, side: 'right' },
        },
        lines: [
          { speaker: 'mother', text: "Everyone at the market keeps saying Asian families are 'doing fine' through all this." },
          { speaker: 'father', text: "Some are. Doesn't mean we started where 'fine' usually starts from." },
          { speaker: 'mother', text: "No one asks which family. They just ask which box." },
          { speaker: 'father', text: "Same as it ever was. We keep going either way." },
        ],
      },
    ],
  },
];

export default beats;
