// Counts how many of the three per-playthrough Structural Drag signals
// hit for this character (Phaser Technical Architecture doc Section 21) —
// shared by every Level 1/Level 2 gate that scales its difficulty off
// "the mechanic that makes the game more difficult" (SchoolTest's grade
// level, PackingHouseScene's belt speed), so the signal definition and
// the "which three factors count" decision live in exactly one place
// instead of drifting between two copies.
//
// disruptionRateMultiplier/savingsRatePenalty are deliberately excluded —
// both are deterministic Baseline1 effects applied identically to every
// playthrough, so they carry no per-run variation to scale difficulty
// with (see SchoolTest.js's original note on this).
function countHits(state) {
  let hits = 0;
  if (state.character === 'female') hits += 1;
  if (!state.hasMainstreamCredit) hits += 1;
  if (state.scene2Deficit) hits += 1;
  return hits;
}

export default { countHits, MAX_HITS: 3 };
