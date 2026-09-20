import latino1986 from './latino1986.js';

// The character registry — the single place that answers "what
// archetypes can this game play." CharacterSelectScene, Special-
// CircumstanceScene, and EndingScene all read from here now instead of
// each holding their own hardcoded copy of one archetype's numbers.
//
// WHAT'S ALREADY GENERIC because of this (true today, not aspirational):
//   - CharacterSelectScene renders one button per entry in the active
//     archetype's `genders` object — a new gender option is a data
//     change, not a scene-class change.
//   - SpecialCircumstanceScene reads its text via GameState.archetypeId.
//   - EndingScene reads its home-price tiers the same way.
//   - Every Level 2+ system (Affordability's formula, StructuralDrag,
//     SchoolTest/CollegeTest/JackpotTest/PackingHouse/MilitaryDrill,
//     PathConsequences, CareerAdvancement) was already archetype-
//     agnostic — they're about the American labor market in general,
//     not this character's specific circumstance, so a second archetype
//     inherits all of them for free.
//
// WHAT ADDING A SECOND ARCHETYPE STILL ACTUALLY REQUIRES — this registry
// makes the *shared* mechanism layer free, it does not make new
// narrative content free:
//   1. A new file here (e.g. `formerlyIncarcerated2015.js`), same shape
//      as latino1986.js: id, label, genders, homeTiers, special-
//      circumstance text.
//   2. That archetype's OWN Baseline1-3 (baselineWorld.js is currently
//      one hardcoded array, not archetype-keyed) — the three-scene,
//      ends-in-a-roll STRUCTURE is reusable as a template; the 1986
//      IRCA/redlining/minimum-wage content is not.
//   3. That archetype's OWN IntroConversation, kitchen-table beats, and
//      ComingOfAge/DACA-equivalent narrative arc if the special
//      circumstance carries one — these currently live in
//      introConversation.js / kitchenTableBeats.js / scenes.js as single
//      fixed arrays, not archetype-keyed either.
//   4. main.js currently registers exactly one archetype's baseline/
//      intro/kitchen-table scenes under fixed keys ('Baseline1',
//      'IntroConversation', etc.). Supporting two archetypes SIDE BY
//      SIDE (not just swapping which one is "current") means namespacing
//      those keys per archetype and having CharacterSelectScene route to
//      the right one — not done yet, deliberately scoped out of this
//      pass so the safe, low-risk data-driven pieces above could land
//      without touching main.js's scene registration or risking the
//      one, already-tested archetype's flow.
//   5. A full new art set (child/adult/final/military sprites, any
//      archetype-specific backdrops) via the same Together.ai pipeline
//      used for every sprite in this game — no shortcut for this part.
const CHARACTERS = {
  [latino1986.id]: latino1986,
};

export const DEFAULT_CHARACTER_ID = latino1986.id;

export default CHARACTERS;
