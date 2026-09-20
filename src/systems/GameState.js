import { DEFAULT_CHARACTER_ID } from '../data/characters/index.js';

const GameState = {
  // Which archetype (src/data/characters/) is being played — distinct
  // from `character` below, which is this archetype's gender selection,
  // not which archetype. Only one archetype exists today, so this is
  // always DEFAULT_CHARACTER_ID, but every archetype-aware read
  // (CharacterSelectScene, SpecialCircumstanceScene, EndingScene) already
  // goes through this field rather than assuming latino1986 directly.
  archetypeId: DEFAULT_CHARACTER_ID,
  character: null,
  // The demographic-attribute layer (Demographics.js) — rolled once at
  // CharacterSelectScene, independent of archetype/gender. `race` is
  // never null after a real playthrough starts (every run rolls one);
  // `hasDisability`/`isRural` are booleans that can come back false,
  // per direction ("randomly attributed... or not at all").
  race: null,
  hasDisability: false,
  isRural: false,
  savingsJar: 0,
  annualIncome: 0,
  scene2Deficit: false,
  scene5Rolls: [],
  affordabilityResults: null,
  overworldReturnScreen: null,

  // Set when the player leaves Fresno High without passing the test
  // (either by choosing to drop out mid-test, or after a failed attempt).
  // Defaults true so any scene reached via the dev menu, or any scene that
  // doesn't care about this fork, behaves like the graduate path.
  isHighSchoolGraduate: true,
  // Set on completing the Military path's supply drill (20/20, no matter
  // how long it took) — read by Affordability.check() for the VA loan's
  // zero-down, no-mortgage-insurance terms.
  isVeteran: false,
  // Which Level 2 door the player actually walked through — 'college' |
  // 'military' | 'workforce'. Set once, at the path's stats page (see
  // PathStatsScene's onContinue hook / pathStats.js), and never
  // overwritten afterward, even though the college path also passes
  // through WorkforceStats later (DACA -> Business). Read by
  // PathConsequenceScene to pick which content bank applies — this is
  // the hinge the whole "mechanize the narrative" framework turns on.
  pathTaken: null,
  // Level 3's advancement mechanism (CareerAdvancement.js) — one shot
  // each per playthrough, regardless of how many times the player walks
  // back into the college/business hotspots that offer them.
  hasAttemptedCollegeAdvancement: false,
  hasAttemptedCareerMove: false,
  hasAttemptedJackpotTest: false,

  // Four general-condition modifiers, set once during the baseline 1986
  // world (Baseline1-3) and felt for the rest of the game — see Phaser
  // Technical Architecture doc's "Structural Drag" section. These are
  // universal-era conditions, not this character's specific documentation
  // circumstance; every future archetype rolls/applies the same four.
  disruptionRateMultiplier: 1, // Baseline1: uneven recession recovery
  savingsRatePenalty: 0, // Baseline1: 1986 Tax Reform Act's renter penalty
  hasMainstreamCredit: true, // Baseline2: redlining-era credit-access gap

  reset() {
    this.archetypeId = DEFAULT_CHARACTER_ID;
    this.character = null;
    this.race = null;
    this.hasDisability = false;
    this.isRural = false;
    this.savingsJar = 0;
    this.annualIncome = 0;
    this.scene2Deficit = false;
    this.scene5Rolls = [];
    this.affordabilityResults = null;
    this.overworldReturnScreen = null;
    this.isHighSchoolGraduate = true;
    this.isVeteran = false;
    this.pathTaken = null;
    this.hasAttemptedCollegeAdvancement = false;
    this.hasAttemptedCareerMove = false;
    this.hasAttemptedJackpotTest = false;
    this.disruptionRateMultiplier = 1;
    this.savingsRatePenalty = 0;
    this.hasMainstreamCredit = true;
  },
};

export default GameState;
