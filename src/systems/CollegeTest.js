import StructuralDrag from './StructuralDrag.js';

// The Level 2 college-path gate — a real pass/fail test again, like
// SchoolTest, but the difficulty knob is different on purpose. SchoolTest
// raises the CONTENT's grade level for a harder profile; here the
// content stays flat (general-knowledge, college-level sophistication,
// nothing a course-specific curriculum would be needed for) and instead
// the PASS BAR moves — same three Structural Drag signals SchoolTest's
// grade level and PackingHouse's belt speed already use
// (StructuralDrag.countHits), so all three Level 1/2 gates still breathe
// from one shared difficulty source.
//
// [V] NCES, first-time full-time bachelor's-seeking students, 6-year
// completion, 2014 cohort: 60% of men, 67% of women
// (nces.ed.gov/fastfacts/display.asp?id=40) — real gap, real direction
// (female = better odds), matching why Structural Drag counts
// `character === 'female'` as a HIT elsewhere but here it's this test's
// one built-in exception: a female character does not get a harder bar
// on this specific gate, because the real data says her odds are better,
// not worse. See computeInitialThreshold.
//
// [V] UC Davis Center for Poverty & Inequality Research: 14.7% of
// undocumented adults hold a bachelor's degree or higher, versus 28%+ of
// all U.S. adults — roughly half the attainment rate. Every character in
// this game carries that same documentation-status special circumstance
// (SpecialCircumstanceScene), so it isn't one of the three variable
// Structural Drag signals; it's folded into BASE_PASS_THRESHOLD itself
// (7 of 10 — already harder than a 50/50 bar) rather than re-counted per
// playthrough.
//
// Each failed attempt drops the bar by one question, floored at
// MIN_PASS_THRESHOLD — [E] design simplification: persistence lowering
// the bar isn't a literal college policy, it's this game's way of saying
// repeated attempts matter as much as raw content mastery, without ever
// making the test free.
const QUESTION_COUNT = 10;
const BASE_PASS_THRESHOLD = 7;
const MIN_PASS_THRESHOLD = 4;
// [V] BLS median weekly earnings, 2024 (same figures already shown on
// CollegeStats): $1,533/wk bachelor's vs $946/wk diploma alone. Passing
// applies that exact ratio to GameState.annualIncome rather than a new,
// separately-invented number.
const BACHELORS_WAGE_MULTIPLIER = 1533 / 946;

function computeInitialThreshold(state) {
  // Cancel Structural Drag's female signal out again right here: real
  // completion data runs the other way for this specific gate (see file
  // header), so only the other two signals (credit access, childhood
  // deficit) push the bar up for this test. Both always land >= 0, so
  // BASE_PASS_THRESHOLD (7) is the true floor for attempt one, 9 the cap.
  const hits = StructuralDrag.countHits(state) - (state.character === 'female' ? 1 : 0);
  return Math.min(9, BASE_PASS_THRESHOLD + hits);
}

function computeThresholdForAttempt(state, attemptNumber) {
  const initial = computeInitialThreshold(state);
  return Math.max(MIN_PASS_THRESHOLD, initial - (attemptNumber - 1));
}

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// `bank` is injected, same reasoning as SchoolTest.buildTest — easy to
// unit-test against a small fake pool instead of the full curated one.
function buildTest(bank) {
  return { questions: shuffle(bank).slice(0, QUESTION_COUNT) };
}

function scoreTest(test, answers, threshold) {
  const correctCount = test.questions.reduce((total, question, index) => (
    total + (answers[index] === question.answer ? 1 : 0)
  ), 0);
  return { correctCount, passed: correctCount >= threshold, threshold };
}

export default {
  QUESTION_COUNT,
  BASE_PASS_THRESHOLD,
  MIN_PASS_THRESHOLD,
  BACHELORS_WAGE_MULTIPLIER,
  computeInitialThreshold,
  computeThresholdForAttempt,
  buildTest,
  scoreTest,
};
