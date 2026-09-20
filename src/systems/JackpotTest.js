import StructuralDrag from './StructuralDrag.js';

// The "workforce jackpot" — a real but rare shot at closing the income
// gap nothing else in this game can close (see Affordability.js: the
// Fresno tier is out of reach for every other path, even the best
// realistic run of it). One attempt, ever, no retry, no declining bar
// like CollegeTest — you pass at a real 7/10 or you don't.
//
// The reason it's scored this way instead of a dice roll: this is a
// skill test, and its baseline difficulty is deliberately NOT a 6th-grade
// floor like SchoolTest's. It starts at real workplace/financial-
// literacy difficulty (reading a pay stub, marginal vs. effective tax
// rate, DTI) and gets harder from there — Structural Drag's hit count
// (the same signals SchoolTest/CollegeTest/PackingHouse already read)
// selects which of 4 tiers of content the player draws, tier 0 through 3,
// compounding on that already-hard baseline exactly the way SchoolTest's
// grade level compounds on its own baseline.
//
// [V] Chetty et al., Opportunity Insights: a child born into the bottom
// U.S. income quintile has roughly an 8% chance of reaching the top
// quintile as an adult. Not used as a probability roll here — this test
// is skill-scored — but it's the real number this mechanic is named for:
// a jackpot-sized jump is rare, and the test is built hard on purpose,
// not tuned to be winnable on average.
const QUESTION_COUNT = 10;
const PASS_THRESHOLD = 7; // locked, one attempt only

// [V] BLS Occupational Employment & Wage Statistics / Modeled Wage
// Estimates: entry-to-experienced wage progression within a single
// occupation regularly runs 100-150% (e.g., accountants & auditors,
// 2023: $29.67/hr entry vs. $63.39/hr experienced, +114%; median
// management wage vs. median of all occupations, May 2025: $126,520 vs
// $50,980, +148%). 80% is set below that real range on purpose — a real,
// large, still-plausible jump, not the most extreme case in the data.
const JACKPOT_INCOME_MULTIPLIER = 1.8;

function computeTier(state) {
  return StructuralDrag.countHits(state); // 0-3, indexes directly into the bank
}

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// `bank` injected, same reasoning as SchoolTest/CollegeTest.
function buildTest(state, bank) {
  const tier = computeTier(state);
  return { tier, questions: shuffle(bank[tier]) };
}

function scoreTest(test, answers) {
  const correctCount = test.questions.reduce((total, question, index) => (
    total + (answers[index] === question.answer ? 1 : 0)
  ), 0);
  return { correctCount, passed: correctCount >= PASS_THRESHOLD };
}

export default {
  QUESTION_COUNT,
  PASS_THRESHOLD,
  JACKPOT_INCOME_MULTIPLIER,
  computeTier,
  buildTest,
  scoreTest,
};
