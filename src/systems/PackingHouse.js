import StructuralDrag from './StructuralDrag.js';

// The Level 2 workforce-entry gate: sort fruit on a moving belt,
// mouse-drag each piece into its matching bucket before it reaches the
// end. Per direction, the only difficulty knob is belt speed — spawn
// rate and round length stay fixed regardless of difficulty. Belt speed
// scales off the same three Structural Drag signals SchoolTest's grade
// level uses (StructuralDrag.countHits), so both Level 1 and Level 2's
// gates breathe from one shared difficulty source instead of each
// inventing its own.
const BASELINE_SPEED = 90; // px/sec, 0 hits
const SPEED_PER_HIT = 25; // added per Structural Drag signal, up to 3
const DROPOUT_SPEED_PENALTY = 25; // same step as one Structural Drag hit

const FRUIT_TYPES = ['apple', 'orange', 'lemon'];
const ROUND_LENGTH = 15; // total fruit per round, fixed regardless of difficulty

// No hard fail — you always get hired somewhere, the round just decides
// how good the offer is. Wage modifier applies once, permanently, to
// GameState.annualIncome — "the minigame decides what the actual job
// pays," not a combat-only stat.
//
// The dropout path shares this exact gate with the graduate path (same
// floor, same crates, same wage math) — it's just harder to work: one
// extra flat bump to belt speed on top of whatever Structural Drag
// already added, kept separate from StructuralDrag.countHits itself so
// the locked 3-signal/grade-9-cap math in SchoolTest.js stays untouched.
function computeBeltSpeed(state) {
  const dropoutPenalty = state.isHighSchoolGraduate === false ? DROPOUT_SPEED_PENALTY : 0;
  return BASELINE_SPEED + StructuralDrag.countHits(state) * SPEED_PER_HIT + dropoutPenalty;
}

function computeWageModifier(accuracy) {
  if (accuracy >= 0.8) return 1.1;
  if (accuracy >= 0.5) return 1.0;
  return 0.9;
}

export default {
  computeBeltSpeed,
  computeWageModifier,
  FRUIT_TYPES,
  ROUND_LENGTH,
  BASELINE_SPEED,
  SPEED_PER_HIT,
};
