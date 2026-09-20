// Level 3's "advance your education or career" mechanism — reachable
// from the same College/business hotspots on Downtown/Business every
// path already walks past, once GameState.pathTaken is set (see
// overworldScreens.js's conditional targetKey). Deliberately a smaller,
// one-shot lever layered on top of whichever Level 2 path already ran,
// not a redo of that choice — real, sourced, and — per direction —
// grounded the same way everything else in this game is: nothing here
// is guaranteed.

// [V] College Board, average published in-state tuition & fees,
// public two-year college, current academic year.
const COLLEGE_TUITION_COST = 3990;
// [V] RNL / National Student Clearinghouse: adult ("returning") learners
// who re-enroll finish at meaningfully higher rates than the overall
// community-college population (68% for community college, 70% for
// online four-year) — used here rather than the often-cited ~40% overall
// six-year completion figure, because this mechanic models someone
// already working and choosing to go back, not a fresh-out-of-high-school
// enrollment.
const COLLEGE_COMPLETION_RATE = 0.68;
// [V] Community College Daily, 2025, citing a study on short-term
// training completers: about $2,000/yr more within two years of
// completing, a real, modest lever — not the bachelor's-degree premium
// the original College path already applies.
const COLLEGE_WAGE_GAIN = 2000;

// [E] design estimate — the real, sourced fact this stands in for is that
// the switcher/stayer wage gap itself is volatile and has flipped sign
// repeatedly (2025 saw stayers briefly out-earn switchers for the first
// time since 2010), so "does the move pay off" is modeled as a roll, not
// a certainty, same as everything else in this game.
const CAREER_MOVE_SUCCESS_RATE = 0.55;
// [V] Federal Reserve Bank of Atlanta, Wage Growth Tracker, August 2026:
// job switchers 5.0% vs. job stayers 3.6% — the gap applied here, once,
// as the raise this move got you that staying wouldn't have.
const CAREER_MOVE_WAGE_MULTIPLIER = 1 + (0.050 - 0.036);

function canAffordCollege(state) {
  return state.savingsJar >= COLLEGE_TUITION_COST;
}

function attemptCollege(state) {
  if (!canAffordCollege(state)) return { attempted: false, reason: 'insufficient-savings' };
  state.savingsJar -= COLLEGE_TUITION_COST;
  const succeeded = Math.random() < COLLEGE_COMPLETION_RATE;
  if (succeeded) state.annualIncome += COLLEGE_WAGE_GAIN;
  state.hasAttemptedCollegeAdvancement = true;
  return { attempted: true, succeeded };
}

function attemptCareerMove(state) {
  const succeeded = Math.random() < CAREER_MOVE_SUCCESS_RATE;
  if (succeeded) state.annualIncome = Math.round(state.annualIncome * CAREER_MOVE_WAGE_MULTIPLIER);
  state.hasAttemptedCareerMove = true;
  return { attempted: true, succeeded };
}

export default {
  COLLEGE_TUITION_COST,
  COLLEGE_COMPLETION_RATE,
  COLLEGE_WAGE_GAIN,
  CAREER_MOVE_SUCCESS_RATE,
  CAREER_MOVE_WAGE_MULTIPLIER,
  canAffordCollege,
  attemptCollege,
  attemptCareerMove,
};
