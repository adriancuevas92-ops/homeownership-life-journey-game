import latino1986 from './latino1986.js';
import black1986 from './black1986.js';
import white1986 from './white1986.js';
import asian1986 from './asian1986.js';

// The character registry — the single place that answers "what
// archetypes can this game play." CharacterSelectScene, Special-
// CircumstanceScene, and EndingScene all read from here instead of each
// holding their own hardcoded copy of one archetype's numbers.
//
// Race now SELECTS which archetype a run plays, not just a modifier on
// one fixed story (2026-09-20 direction: "each race needs its own
// experience... not just narration... every experience needs to be
// represented as unique"). ARCHETYPE_BY_RACE is the map CharacterSelect-
// Scene rolls against — deliberately only races that have a real,
// built archetype behind them. As of white-1986/asian-1986 (same day),
// that's now all four of Demographics.js's RACE_WEIGHTS categories, so
// the weights below stop being a renormalized subset and just mirror
// that full table directly — but the mechanism (only list what's
// actually built) stays the same for whenever a 5th archetype exists.
export const ARCHETYPE_BY_RACE = {
  latino: latino1986.id,
  black: black1986.id,
  white: white1986.id,
  asian: asian1986.id,
};

// [V] U.S. Census Bureau population estimates, 2024 (as reported): White
// 57.5%, Hispanic/Latino 20.0%, Black 12.6%, Asian/Pacific Islander
// 6.7%. Renormalized across just these 4 categories (96.8% of the
// total) since this is a bounded v1, not the full Census taxonomy — same
// figures and same renormalization Demographics.js's own RACE_WEIGHTS
// uses; duplicated here rather than imported to avoid a circular
// dependency (Demographics.js imports FROM this file).
export const ARCHETYPE_RACE_WEIGHTS = {
  white: 0.575 / 0.968,
  latino: 0.200 / 0.968,
  black: 0.126 / 0.968,
  asian: 0.067 / 0.968,
};

// WHAT'S ALREADY GENERIC because of the registry (true today, not
// aspirational):
//   - CharacterSelectScene renders one button per entry in the active
//     archetype's `genders` object — a new gender option is a data
//     change, not a scene-class change.
//   - SpecialCircumstanceScene reads its text via GameState.archetypeId.
//   - EndingScene reads its home-price tiers the same way.
//   - Every Level 2+ system (Affordability's formula, StructuralDrag,
//     SchoolTest/CollegeTest/JackpotTest/PackingHouse/MilitaryDrill,
//     PathConsequences, CareerAdvancement) is archetype-agnostic — about
//     the American labor market in general, not any one character's
//     specific circumstance — so a new archetype inherits all of them
//     for free, same as black-1986 just did.
//   - Avatar art is keyed off GameState.race, not archetypeId, so a new
//     archetype needs no new sprite work as long as its race already has
//     one (the full 2026-09-20 race sweep covers white/black/asian/latino
//     already).
//
// All four of this game's Census-tracked race categories now have a
// built archetype behind them (2026-09-20). A 5th (a Census category
// this v1 deliberately left out, or a split within one of these four —
// see asian1986.js's own comment on the real variance a single "Asian"
// aggregate hides) would still need exactly the four things white-1986/
// asian-1986 each needed:
//   1. A new file here, same shape as the other four: id, label,
//      genders, homeTiers, specialCircumstanceText — grounded in its
//      own real, distinct, documented circumstance, not a re-skin.
//   2. A new entry in ARCHETYPE_BY_RACE / ARCHETYPE_RACE_WEIGHTS above
//      (and, if it's a genuinely new race category rather than a split
//      of an existing one, a new entry in Demographics.js's RACE_WEIGHTS/
//      DISABILITY_RATE_BY_RACE too).
//   3. That archetype's own intro-conversation-equivalent and circumstance-
//      origin scene (see introConversationBlack.js/circumstanceOrigin
//      Black.js for the pattern; baselineWorld.js's `when`-gated Baseline1
//      step and kitchenTableBeats.js's `when`-gated KitchenTable2008 beat
//      for how the *shared* timeline scenes branch per archetype without
//      forking the whole 1986-2020 story).
//   4. 1-2 new comic-panel backdrops for those new scenes specifically —
//      NOT a full new overworld backdrop set (Home/FresnoHigh/Downtown/
//      Business/Realty all stay shared/California across every archetype
//      by design, so those costs don't multiply per archetype).
const CHARACTERS = {
  [latino1986.id]: latino1986,
  [black1986.id]: black1986,
  [white1986.id]: white1986,
  [asian1986.id]: asian1986,
};

export const DEFAULT_CHARACTER_ID = latino1986.id;

export default CHARACTERS;
