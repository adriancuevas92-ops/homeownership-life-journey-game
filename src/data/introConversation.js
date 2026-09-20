// Speaker identity comes from bubble position + tail direction only,
// matching the classic comic-lettering convention this was locked to
// (Phaser Technical Architecture doc Section 14) — no per-speaker color.

const beats = [
  {
    backdrop: 'intro_arrival',
    speakers: {
      father: { x: 369, y: 107, side: 'right' },
      mother: { x: 320, y: 134, side: 'left' },
    },
    lines: [
      { speaker: 'father', text: "We made it. Fresno's supposed to have work — packing houses, construction, whatever needs hands." },
      { speaker: 'mother', text: "Work is one thing. This building wants first, last, and deposit before we've even seen the inside — and we've still got a five-year-old to feed while we figure it out." },
      { speaker: 'father', text: 'We have four months saved if we\'re careful. Maybe five.' },
      { speaker: 'mother', text: "Four months isn't a plan. It's a countdown." },
    ],
  },
  {
    backdrop: 'intro_apartment',
    speakers: {
      mother: { x: 216, y: 140, side: 'left' },
      father: { x: 600, y: 220, side: 'right' },
    },
    lines: [
      { speaker: 'mother', text: 'Two rooms. A hot plate instead of a stove, until we can afford better.' },
      { speaker: 'father', text: "It's still more than what we had lined up back home." },
      { speaker: 'mother', text: "I'm not comparing it to back home. I'm telling you what it costs here." },
      { speaker: 'father', text: "I know. I'll take every hour the packing house will give me." },
    ],
  },
  {
    backdrop: 'intro_tv',
    speakers: {
      tv: { x: 384, y: 193, side: 'left' },
      father: { x: 496, y: 246, side: 'right' },
      mother: { x: 280, y: 257, side: 'left' },
    },
    lines: [
      { speaker: 'tv', text: '"...the new law offers legal status to those who can prove continuous residence since January 1st, 1982 — or ninety days of qualifying farm work in the year before it passed..."' },
      { speaker: 'father', text: 'That already happened. Back in November.' },
      { speaker: 'mother', text: "We weren't even packing our bags in November." },
      { speaker: 'father', text: "If we'd come for the summer harvest instead of waiting for the roads to be safer—" },
      { speaker: 'mother', text: "We didn't know there was a difference. Nobody tells you which year is going to matter until it's already the wrong one." },
    ],
  },
];

export default {
  key: 'IntroConversation',
  nextScene: 'SpecialCircumstance',
  beats,
};
