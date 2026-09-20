// Every rate below is cited to its source in the Concept & MVP Plan doc.
// This is the actual mechanism behind "life can't be completely controlled" —
// each roll is an independent check against a real, sourced probability,
// not a scripted certainty either way.

// 1996 Hispanic unemployment rate, U.S. Census Bureau Statistical Abstract
// of the United States: 1999, Table 680 (BLS-sourced).
const CHILDHOOD_DEPENDENCY_RATE = 0.089;

// Base job-disruption rate per sub-period (Concept doc Section 11/Script
// Scene 5), reflecting the real lifetime layoff-rate gender gap (45% men /
// 36% women), converted to a per-sub-period chance, times the macro
// multiplier for that period (Concept doc Section 12).
const JOB_DISRUPTION_RATES = {
  male: { '2012-2015': 0.11, '2016-2019': 0.09, '2020': 0.32 },
  female: { '2012-2015': 0.09, '2016-2019': 0.08, '2020': 0.26 },
};

// [V] 1980 unemployment rate, Hispanic origin vs. total civilian labor
// force: 10.1% vs. 7.1% (U.S. Census Bureau Statistical Abstract of the
// United States: 1999, Table 680 — same table CHILDHOOD_DEPENDENCY_RATE
// above is drawn from, closest available data point bracketing the
// mid-1980s recovery this story opens in). Ratio applied as a standing
// multiplier on every later job-disruption roll, not a one-time event —
// this is a population-level rate, not an individual household's luck,
// so Baseline1 applies it deterministically (`type: 'effect'`) rather
// than rolling it.
const RECESSION_EXPOSURE_MULTIPLIER = 10.1 / 7.1;

// [E] design simplification, not itself a directly sourced percentage —
// represents the real structural fact that the 1986 Tax Reform Act
// stripped the deduction from every kind of debt except a home mortgage:
// every year spent renting instead of owning is a year of foregone
// tax-advantaged wealth-building relative to a homeowner. Applied as a
// flat haircut to the savings rate for as long as the character hasn't
// closed on a home.
const TAX_ACT_SAVINGS_RATE_PENALTY = 0.02;

// [V] Among households earning $30-50k, 28.5% of Hispanic households had
// no mainstream credit history at all vs. 16.2% of white households at
// the same income (FDIC/Census — Concept doc Section 21.2). A genuine
// per-household circumstance, not a population-wide rate, so this rolls.
const CREDIT_ACCESS_GAP_RATE = 0.285;

function rollChildhoodDependency() {
  const roll = Math.random();
  const disrupted = roll < CHILDHOOD_DEPENDENCY_RATE;
  return {
    disrupted,
    rate: CHILDHOOD_DEPENDENCY_RATE,
    // [E] design simplification, not itself a sourced dollar figure —
    // a household disruption this early costs real, ongoing ground later.
    savingsDelta: disrupted ? -2000 : 0,
  };
}

function rollJobDisruption(character, subPeriod, multiplier = 1) {
  const rate = JOB_DISRUPTION_RATES[character][subPeriod] * multiplier;
  const roll = Math.random();
  const disrupted = roll < rate;
  return { disrupted, rate, subPeriod };
}

function applyRecessionExposure(state) {
  state.disruptionRateMultiplier = RECESSION_EXPOSURE_MULTIPLIER;
}

function applyTaxActPenalty(state) {
  state.savingsRatePenalty = TAX_ACT_SAVINGS_RATE_PENALTY;
}

function rollCreditAccess() {
  const roll = Math.random();
  const disrupted = roll < CREDIT_ACCESS_GAP_RATE; // disrupted = no mainstream credit
  return { disrupted, rate: CREDIT_ACCESS_GAP_RATE };
}

export default {
  rollChildhoodDependency,
  rollJobDisruption,
  applyRecessionExposure,
  applyTaxActPenalty,
  rollCreditAccess,
};
