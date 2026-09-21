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

// Baseline1's amnesty-miss content is Latino-1986-archetype-specific — a
// fixed biographical fact of THAT archetype (always undocumented, always
// three years too late), gated below by `when: archetypeId === 'latino-
// 1986'`. It used to carry a per-race variant dict here for when race
// was just a modifier on one shared archetype; now that race SELECTS
// the archetype (2026-09-20 — "each race needs its own experience"),
// only latino-archetype players ever reach this step at all, and within
// that archetype race is always 'latino', so the other variants were
// dead code and got removed rather than left stale. The black-1986
// archetype gets its own sibling step below instead of a variant here.
const AMNESTY_PERSONAL_TEXT = "For a family like this one, the miss lands right next to a program that helped many others: roughly three-quarters of everyone legalized under this same 1986 law were Mexican-born — just not the family that arrived three years too late for it."; // [V] DHS Office of Immigration Statistics / Migration Policy Institute, IRCA legalization by country of origin

// black-1986's own Baseline1 beat, in the same "this year" slot the
// amnesty content occupies for the Latino archetype — real, different
// 1986-era history, not a placeholder. Sets up Baseline2's redlining
// throughline as directly as the Latino archetype's own DemographicContext
// beats already do, rather than waiting to make that connection later.
// [V] Census Bureau Historical Census of Housing Tables / Housing
// Vacancy Survey: Black homeownership ~44% in 1986, essentially flat
// since 1980 after nearly doubling 1940-1980 — real trajectory, not
// invented for drama: the eventual climb to a real peak (49.1% in 2004)
// and the housing bust that erases much of it afterward.
const BLACK_1986_TEXT = "This year, Black homeownership sits around 44% — a rate that's barely moved since 1980, after nearly doubling in the four decades before that. It will finally climb again, reaching a real peak by 2004, the highest ever recorded. Within five years after that, a housing bust built on who got steered into which loan will erase most of that gain — the how of that comes later, once you know more about this family.";

// white-1986's own Baseline1 beat. [V] Historical Census of Housing
// Tables: white homeownership hit 69.1% in the 1990 Census, the closest
// decennial data point to this exact year (no year-1986-specific figure
// exists outside a Census year) — already close to double the Black
// figure above at essentially the same moment. Framed as a fact about
// the country's housing market this year, same register as
// BLACK_1986_TEXT, not yet the "why" — that's SpecialCircumstance/
// CircumstanceOriginWhite's job.
const WHITE_1986_TEXT = "This year, white homeownership sits close to 69% — already close to double the Black rate at this same moment, and already the rate most other groups in this country won't reach for decades, if ever. The programs that built it aren't a 1986 story. They're already forty years old by now.";

// asian-1986's own Baseline1 beat. [V] Commission on Wartime Relocation
// and Internment of Civilians issued its findings and a $20,000-per-
// survivor recommendation in 1983; the Civil Liberties Act carrying that
// recommendation into law wasn't introduced in Congress until 1987 and
// wasn't signed until 1988 — so in 1986 specifically, three years have
// passed with nothing enacted, and two more are still ahead. Stated as
// a fact in progress, not yet resolved, matching the actual chronology
// rather than skipping ahead to a resolution this exact year hasn't
// reached yet.
const ASIAN_1986_TEXT = "This year, it's been three years since the federal commission investigating what happened to Japanese American families in 1942 recommended $20,000 per survivor and a formal apology. Nothing has passed yet. It will take two more years before Congress agrees the government owes anything at all.";

const scenes = [
  {
    key: 'Baseline1',
    backdrop: 'baseline_news',
    genderless: true,
    previousScene: 'CharacterSelect',
    nextScene: 'Baseline2',
    steps: [
      { type: 'text', text: "1986. Six years into Reagan's presidency, the country is still climbing out of the worst recession since the Great Depression — but not everywhere, and not for everyone." },
      {
        type: 'text',
        when: (state) => state.archetypeId === 'latino-1986',
        text: "This year, Congress passes the first major amnesty for undocumented immigrants in American history — and, for the next four decades, the last one it will manage to pass.",
      },
      {
        type: 'text',
        when: (state) => state.archetypeId === 'black-1986',
        text: BLACK_1986_TEXT,
      },
      {
        type: 'text',
        when: (state) => state.archetypeId === 'white-1986',
        text: WHITE_1986_TEXT,
      },
      {
        type: 'text',
        when: (state) => state.archetypeId === 'asian-1986',
        text: ASIAN_1986_TEXT,
      },
      { type: 'text', text: "Congress also passes the most sweeping rewrite of the tax code in a generation. It strips the tax deduction from nearly every kind of debt in America — except one. A home mortgage keeps its privilege. Starting this year, owning a home isn't just shelter. It's the one debt the government will still help you afford." },
      {
        type: 'effect',
        apply: (state) => {
          EventEngine.applyRecessionExposure(state);
          EventEngine.applyTaxActPenalty(state);
        },
        // The "papers" callback only makes sense disclaiming against the
        // amnesty content two steps up — which only the Latino archetype
        // just saw. The underlying effect (recession + tax-act exposure)
        // stays universal either way.
        text: (state) => (state.archetypeId === 'latino-1986'
          ? "None of this is about anyone's papers. A labor market that recovers unevenly, and a tax code that just made renting a permanently more expensive way to build wealth than owning — this family starts the climb already carrying both."
          : "A labor market that recovers unevenly, and a tax code that just made renting a permanently more expensive way to build wealth than owning — this family starts the climb already carrying both."),
      },
      {
        type: 'text',
        when: (state) => state.archetypeId === 'latino-1986',
        text: AMNESTY_PERSONAL_TEXT,
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
      { type: 'text', text: "Those maps didn't only mark Black neighborhoods red — and they didn't only take from the families inside the red lines. Whoever this family turns out to be, this is part of the ground they're standing on. How, exactly, comes back once you know more about who they are." },
      {
        type: 'roll',
        roll: (state) => {
          const result = EventEngine.rollCreditAccess(state);
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
    // The one seam where the archetypes' stories actually diverge — see
    // ComicScene._advance()'s function-nextScene support. Baseline1-3 are
    // shared, real, race-neutral national history; what comes next is
    // this specific family's own circumstance, which is where the
    // archetypes stop being the same story.
    nextScene: (state) => {
      if (state.archetypeId === 'black-1986') return 'IntroConversationBlack';
      if (state.archetypeId === 'white-1986') return 'IntroConversationWhite';
      if (state.archetypeId === 'asian-1986') return 'IntroConversationAsian';
      return 'IntroConversation';
    },
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
