import EventEngine from '../systems/EventEngine.js';

// The universal, character-agnostic "world in 1986" sequence — every
// future archetype sees these same three scenes, regardless of their own
// story. Grounded in real, sourced history (Concept doc Section 21):
// Congress passing IRCA and the Tax Reform Act, the redlining-era wealth
// gap, and the frozen minimum wage. `genderless: true` tells ComicScene
// not to look for gendered art variants — there's only one version of
// each of these.
//
// Each scene's final step now also plants one of the four "Structural
// Drag" modifiers (Phaser Technical Architecture doc, "the mechanic")
// that quietly shape every later system — EventEngine's disruption rolls,
// WorkingYears' savings rate, Affordability's down-payment math — for the
// rest of the playthrough. These are general, era-wide conditions, set
// here before SpecialCircumstance ever reveals this character's specific
// documentation status, precisely to keep the two kinds of disadvantage
// mechanically separate: everyone who plays this era carries these four;
// only this character additionally carries the documentation hinge.

const scenes = [
  {
    key: 'Baseline1',
    backdrop: 'baseline_news',
    genderless: true,
    previousScene: 'CharacterSelect',
    nextScene: 'Baseline2',
    steps: [
      { type: 'text', text: "1986. Six years into Reagan's presidency, the country is still climbing out of the worst recession since the Great Depression — but not everywhere, and not for everyone." },
      { type: 'text', text: "This year, Congress passes the first major amnesty for undocumented immigrants in American history — and, for the next four decades, the last one it will manage to pass." },
      { type: 'text', text: "Congress also passes the most sweeping rewrite of the tax code in a generation. It strips the tax deduction from nearly every kind of debt in America — except one. A home mortgage keeps its privilege. Starting this year, owning a home isn't just shelter. It's the one debt the government will still help you afford." },
      {
        type: 'effect',
        apply: (state) => {
          EventEngine.applyRecessionExposure(state);
          EventEngine.applyTaxActPenalty(state);
        },
        text: "None of this is about anyone's papers. A labor market that recovers unevenly, and a tax code that just made renting a permanently more expensive way to build wealth than owning — this family starts the climb already carrying both.",
      },
    ],
  },
  {
    key: 'Baseline2',
    backdrop: 'baseline_redlining',
    genderless: true,
    previousScene: 'Baseline1',
    nextScene: 'Baseline3',
    steps: [
      { type: 'text', text: "Fifty years before this story begins, the federal government graded American neighborhoods on maps — green for \"desirable,\" red for \"hazardous.\" The red lines almost always followed the same boundary: where Black and immigrant families lived." },
      { type: 'text', text: "Banks used those maps for decades to decide who got a loan. Congress finally outlawed the practice in 1968." },
      { type: 'text', text: "By the mid-1980s, the typical white family holds roughly three times the wealth of the typical Black family. Outlawing the maps didn't undo what they built. That gap will barely move for the next forty years." },
      {
        type: 'roll',
        roll: (state) => {
          const result = EventEngine.rollCreditAccess();
          state.hasMainstreamCredit = !result.disrupted;
          return result;
        },
        success: "This family banks somewhere with their name on the door. It's not a given — for a lot of households like theirs, it still isn't.",
        fail: "This family has never had a bank account with their name on a loan. Whatever they manage to save, no one currently keeping score will call it credit.",
      },
    ],
  },
  {
    key: 'Baseline3',
    backdrop: 'baseline_wagefreeze',
    genderless: true,
    previousScene: 'Baseline2',
    nextScene: 'IntroConversation',
    steps: [
      { type: 'text', text: "The federal minimum wage has been frozen at $3.35 an hour since 1981 — and it will stay frozen for nine years, the longest stretch without an increase in the law's history." },
      { type: 'text', text: "Every year it doesn't move, it buys a little less. By the time it finally rises again, it will have lost close to a third of its real value." },
      { type: 'text', text: "This is the economy the next generation is about to grow up inside." },
      {
        type: 'roll',
        roll: (state) => {
          const result = EventEngine.rollChildhoodDependency();
          state.savingsJar += result.savingsDelta;
          state.scene2Deficit = result.disrupted;
          return result;
        },
        success: "Money stays tight, but steady on a frozen wage. Some years, that's the whole victory.",
        fail: "There's no cushion under a bad month on a wage that hasn't moved in years. This is the year it costs them something real.",
      },
    ],
  },
];

export default scenes;
