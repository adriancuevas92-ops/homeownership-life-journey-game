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
  // CollegeTestScene's own "persistence counts here too" progression —
  // the pass bar drops one question per failed attempt. Used to live on
  // the scene instance (`this.attemptNumber`), which meant refreshing
  // mid-retry-sequence reset it back to attempt 1's harder bar — the
  // opposite of an exploit (it punishes a refreshing player, not
  // rewards one), but still not what the screen's own text promises.
  // Moved here so it survives a refresh the same way stepOutcomes does.
  collegeTestAttemptNumber: 1,

  // Four general-condition modifiers, set once during the baseline 1986
  // world (Baseline1-3) and felt for the rest of the game — see Phaser
  // Technical Architecture doc's "Structural Drag" section. These are
  // universal-era conditions, not this character's specific documentation
  // circumstance; every future archetype rolls/applies the same four.
  disruptionRateMultiplier: 1, // Baseline1: uneven recession recovery
  savingsRatePenalty: 0, // Baseline1: 1986 Tax Reform Act's renter penalty
  hasMainstreamCredit: true, // Baseline2: redlining-era credit-access gap

  // Found live during a player audit (2026-09-21): ComicScene used to
  // cache a roll/effect step's resolved text on the SCENE INSTANCE
  // (`this.resolvedText`), which only guarantees "runs once" for as long
  // as that one instance stays alive. Backing all the way out of a scene
  // to its `previousScene` and returning spins up a brand-new instance
  // with an empty cache — confirmed live to double- and triple-apply
  // CircumstanceOriginBlack's `+=` penalty (0.02 -> 0.04 -> 0.06) just by
  // bouncing SpecialCircumstance <-> CircumstanceOriginBlack a few times,
  // and the same mechanism lets a `roll` step (Baseline2's credit-access
  // roll, Baseline3's childhood-dependency roll) be re-rolled for a
  // better outcome the same way. Fixed by moving the "has this exact
  // step already resolved, and to what" record here, on GameState, keyed
  // by `${sceneKey}:${stepIndex}` — survives a full scene teardown/
  // rebuild, cleared only by a real new playthrough (reset()).
  stepOutcomes: {},

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
    this.collegeTestAttemptNumber = 1;
    this.disruptionRateMultiplier = 1;
    this.savingsRatePenalty = 0;
    this.hasMainstreamCredit = true;
    this.stepOutcomes = {};
  },
};

export default GameState;
