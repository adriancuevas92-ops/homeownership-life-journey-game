// The second Level 1 -> Level 2 transition beat: "in the same way we did
// in the introduction" (baselineWorld.js's Baseline1-3) but for the world
// this character is walking into as an adult, not a child. Universal —
// genderless: true — same convention as the opening baseline sequence.
// Real, sourced turn-of-the-millennium history, continuing the same
// documentation-status throughline SpecialCircumstance already stated:
// the DREAM Act that finally offers a path (ComingOfAge, already built)
// is still two years off from where this scene leaves the character.

const scenes = [
  {
    key: 'AdulthoodWorld1',
    backdrop: 'adulthood_millennium',
    genderless: true,
    previousScene: 'GraduateAdvantage',
    nextScene: 'HomeAdult',
    steps: [
      { type: 'text', text: "By the time you finish high school, it's the turn of the millennium — and by the numbers, the best labor market in a generation. National unemployment: 4.2%, a 30-year low." },
      { type: 'text', text: "For Hispanic workers, unemployment also hits a record low that year — 6.1%. A record low, and still nearly double the white unemployment rate of 3.5%. Even the best labor market in decades doesn't close the gap. It just narrows it." },
      { type: 'text', text: "Four years earlier, a new federal law cut off undocumented immigrants from most public assistance and made the path back from any unlawful stay longer and harder. It's still the law. The DREAM Act that might finally offer a way through hasn't been written yet — that's still two years off." },
      { type: 'text', text: "This is the country you're an adult in now. Three doors are open to you today: the military, college, or the workforce. None of them erase what's already stacked against you. Choose the one that gives you the best ground to climb from." },
    ],
  },
  {
    // Dropout mirror of AdulthoodWorld1 — same world, same year, same
    // backdrop, same closing structure. Only the framing (no claim of
    // finishing school) and the last line (one door shut, not three open)
    // differ from here.
    key: 'AdulthoodWorld1Dropout',
    backdrop: 'adulthood_millennium',
    genderless: true,
    previousScene: 'DropoutDisadvantage',
    nextScene: 'HomeAdult',
    steps: [
      { type: 'text', text: "By the time you're out on your own, it's the turn of the millennium — and by the numbers, the best labor market in a generation. National unemployment: 4.2%, a 30-year low." },
      { type: 'text', text: "For Hispanic workers, unemployment also hits a record low that year — 6.1%. A record low, and still nearly double the white unemployment rate of 3.5%. Even the best labor market in decades doesn't close the gap. It just narrows it." },
      { type: 'text', text: "Four years earlier, a new federal law cut off undocumented immigrants from most public assistance and made the path back from any unlawful stay longer and harder. It's still the law. The DREAM Act that might finally offer a way through hasn't been written yet — that's still two years off." },
      { type: 'text', text: "This is the country you're an adult in now. Two doors are open to you today: college or the workforce. Enlistment is closed — the military won't take you without a diploma or GED. None of them erase what's already stacked against you. Choose the one that gives you the best ground to climb from." },
    ],
  },
];

export default scenes;
