// The Level 2 military-path gate — an order-drill, not a sort. Arrange
// the same four items in the same fixed sequence, correctly, 20 times in
// a row-by-row sense (each rep independent; a wrong attempt just resets
// that rep, it doesn't cost anything). No timer, no Structural Drag
// scaling, no accuracy-based wage roll — deliberately the only difficulty
// -free mechanic in the game. The point isn't aptitude, it's compliance:
// do the same right thing over and over and you get through, no matter
// how long it takes. Reaching REPS_REQUIRED sets GameState.isVeteran,
// which Affordability.check() reads for the real advantage this
// symbolizes — the VA loan's zero-down, no-mortgage-insurance terms
// already stated on the Military path's stats page (78% vs 65% veteran
// vs. national homeownership rate, VA Loan Network / Realtor.com).
const SEQUENCE = ['rifle', 'boots', 'pack', 'canteen'];
const REPS_REQUIRED = 20;

function isCorrectOrder(submittedTypes) {
  return submittedTypes.length === SEQUENCE.length
    && submittedTypes.every((type, i) => type === SEQUENCE[i]);
}

export default { SEQUENCE, REPS_REQUIRED, isCorrectOrder };
