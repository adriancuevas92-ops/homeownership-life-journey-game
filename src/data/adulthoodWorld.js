// The second Level 1 -> Level 2 transition beat: "in the same way we did
// in the introduction" (baselineWorld.js's Baseline1-3) but for the world
// this character is walking into as an adult, not a child. genderless:
// true, same convention as the opening baseline sequence — but NOT
// archetype-neutral the way that comment used to claim: two of its four
// steps were Latino/immigration-specific text hardcoded into a scene
// every archetype reaches (a real gap found while building black-1986,
// same shape as Baseline1's and KitchenTable2008's). Fixed the same way:
// function-valued text per archetype, not a duplicate scene.
//
// [V] BLS: Black unemployment rate 2000 annual average 7.6% (white 3.5%
// the same release the existing Hispanic-rate line already cites) — a
// multi-decade low at the time, not claimed as an all-time record the
// way the Hispanic figure's own "record low" framing is (that specific
// superlative wasn't independently verified for the Black series and
// left out rather than guessed).
// [V] BLS: White unemployment 2000 annual average 3.5% (the same figure
// already cited as the comparison baseline in both lines below — this
// entry states it from white-1986's own perspective instead). [V] BLS
// FRED series LNU04032183 ("Unemployment Rate - Asian"): 2000 annual
// average of the 12 published monthly rates ≈ 3.6% — worth noting, this
// is the FIRST year BLS published a standalone Asian unemployment
// series at all, so unlike the Hispanic/Black lines above there's no
// decades of prior data to call this a "record" or "multi-decade" low
// against; that absence of comparison is stated rather than glossed
// over.
const UNEMPLOYMENT_2000_TEXT = {
  'latino-1986': "For Hispanic workers, unemployment also hits a record low that year — 6.1%. A record low, and still nearly double the white unemployment rate of 3.5%. Even the best labor market in decades doesn't close the gap. It just narrows it.",
  'black-1986': "For Black workers, unemployment also falls to a multi-decade low that year — 7.6%. A real low, and still more than double the white unemployment rate of 3.5%. Even the best labor market in decades doesn't close the gap. It just narrows it.",
  'white-1986': "For white workers, unemployment sits at 3.5% that year — the lowest of any group measured, same as it's been through most of this recovery. The best labor market in a generation doesn't close a gap this family was never on the far side of.",
  'asian-1986': "For Asian workers, unemployment lands close by — 3.6%, among the lowest of any group measured. This is the first year the government tracked it as its own number at all, so there's no decades-long record to compare it against the way the other figures here have. The headline number also doesn't say which Asian family it's describing — Southeast Asian refugee communities who arrived after 1975 show poverty and unemployment rates several times this aggregate figure. 'Asian' the census category isn't the same as any one family's actual position.",
};

const LAW_2000_TEXT = {
  'latino-1986': "Four years earlier, a new federal law cut off undocumented immigrants from most public assistance and made the path back from any unlawful stay longer and harder. It's still the law. The DREAM Act that might finally offer a way through hasn't been written yet — that's still two years off.",
  // Not a documentation-status circumstance for this archetype — the
  // parallel beat is forward-looking instead of backward-looking here:
  // CircumstanceOriginBlack already previewed the lending circumstance
  // (same "rules of this run" convention SpecialCircumstance/Synopsis
  // use for DACA-2012 well before the Latino archetype reaches it), but
  // the actual subprime-steering wave (2004-2007) is still ahead of
  // this specific year-2000 moment, not behind it — this line has to
  // say so accurately, not claim it's already happened.
  'black-1986': "The mortgage market this family is about to grow into doesn't look dangerous yet — rates are falling, credit is loosening, and in a few years lenders will start offering deals that look like opportunity to families who look like this one. They won't be. That's still ahead.",
  // Both white-1986 and asian-1986's defining circumstances are already
  // resolved by the year 2000 (the postwar programs behind white-1986's
  // ease are decades old; the Civil Liberties Act settled in 1988,
  // Baseline1's own foreshadowing already covered) — so, unlike the
  // other two lines above, neither of these is describing a live 2000
  // event. They're describing what a resolved circumstance actually
  // looks like twelve and forty years out, which is its own real point.
  'white-1986': "None of what set this family up happened recently. The last GI Bill mortgages closed decades ago. What they built didn't need renewing, though — a paid-off house from the 1950s is still a paid-off house in 2000, whether it's the one standing behind this family or the equity that came from it.",
  'asian-1986': "The $20,000 checks from the 1988 apology finished going out years ago — one generation, one payment, decades after the loss it was meant to answer for. It was never sized to replace two generations of compounding. It was sized to be an apology, and by most accounts of the people who received it, it read as exactly that: real, and not enough.",
};

const scenes = [
  {
    key: 'AdulthoodWorld1',
    backdrop: 'adulthood_millennium',
    genderless: true,
    previousScene: 'GraduateAdvantage',
    nextScene: 'HomeAdult',
    steps: [
      { type: 'text', text: "By the time you finish high school, it's the turn of the millennium — and by the numbers, the best labor market in a generation. National unemployment: 4.2%, a 30-year low." },
      { type: 'text', text: (state) => UNEMPLOYMENT_2000_TEXT[state.archetypeId] || UNEMPLOYMENT_2000_TEXT['latino-1986'] },
      { type: 'text', text: (state) => LAW_2000_TEXT[state.archetypeId] || LAW_2000_TEXT['latino-1986'] },
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
      { type: 'text', text: (state) => UNEMPLOYMENT_2000_TEXT[state.archetypeId] || UNEMPLOYMENT_2000_TEXT['latino-1986'] },
      { type: 'text', text: (state) => LAW_2000_TEXT[state.archetypeId] || LAW_2000_TEXT['latino-1986'] },
      { type: 'text', text: "This is the country you're an adult in now. Two doors are open to you today: college or the workforce. Enlistment is closed — the military won't take you without a diploma or GED. None of them erase what's already stacked against you. Choose the one that gives you the best ground to climb from." },
    ],
  },
];

export default scenes;
