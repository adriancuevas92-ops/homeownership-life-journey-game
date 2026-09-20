import StructuralDrag from './StructuralDrag.js';

// The Fresno High graduate-path gate (Level 1 -> Level 2). Baseline is a
// 6th-grade-difficulty test; per direction, it expands up to 3 grade
// levels higher based on "the mechanic that makes the game more
// difficult" — read literally, that's the same compounding-disadvantage
// signals the "Structural Drag" system (Phaser Technical Architecture
// doc Section 21) already tracks in GameState by the time a player
// reaches this gate, not a new roll invented for this feature. The
// signal count itself (which three factors, why disruptionRateMultiplier/
// savingsRatePenalty are excluded) now lives in StructuralDrag.js, shared
// with PackingHouseScene's belt-speed escalator.
//
// 0 hits = 6th grade (baseline). 3 hits = 9th grade (max, "probably the
// most difficult run through" per direction) — a female character whose
// household also drew the bad roll on both Baseline2 and Baseline3.

const BASELINE_GRADE = 6;
const MAX_GRADE_BUMP = StructuralDrag.MAX_HITS;
const QUESTION_COUNT_PER_SUBJECT = 5;
const PASS_THRESHOLD = 7; // out of 10, locked earlier this session

function computeGradeLevel(state) {
  return BASELINE_GRADE + StructuralDrag.countHits(state);
}

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function drawQuestions(pool, count, subject) {
  return shuffle(pool).slice(0, count).map((q) => ({ ...q, subject }));
}

// `bank` is injected (rather than imported directly) so this stays easy
// to unit-test with a small fake bank instead of the full curated one.
function buildTest(state, bank) {
  const gradeLevel = computeGradeLevel(state);
  const gradeBank = bank[gradeLevel];
  const math = drawQuestions(gradeBank.math, QUESTION_COUNT_PER_SUBJECT, 'math');
  const spelling = drawQuestions(gradeBank.spelling, QUESTION_COUNT_PER_SUBJECT, 'spelling');
  return { gradeLevel, questions: shuffle([...math, ...spelling]) };
}

function scoreTest(test, answers) {
  const correctCount = test.questions.reduce((total, question, index) => (
    total + (answers[index] === question.answer ? 1 : 0)
  ), 0);
  return { correctCount, passed: correctCount >= PASS_THRESHOLD };
}

export default {
  computeGradeLevel,
  buildTest,
  scoreTest,
  BASELINE_GRADE,
  MAX_GRADE_BUMP,
  QUESTION_COUNT_PER_SUBJECT,
  PASS_THRESHOLD,
};
