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

// [V] 1980 unemployment rate by race vs. total civilian labor force —
// applied as a standing multiplier on every later job-disruption roll,
// not a one-time event: this is a population-level rate, not an
// individual household's luck, so Baseline1 applies it deterministically
// (`type: 'effect'`) rather than rolling it. Found live 2026-09-20: this
// was a single fixed constant (the Hispanic figure below) applied to
// EVERY archetype regardless of race — accurate only for latino-1986,
// silently wrong for black-1986 and about to be silently wrong for
// white-1986/asian-1986 too, since the whole point of this statistic is
// that it differs by race. Race-keyed instead, one query per source:
//   - latino: 10.1% vs. 7.1% (U.S. Census Bureau Statistical Abstract of
//     the United States: 1999, Table 680 — same table
//     CHILDHOOD_DEPENDENCY_RATE above is drawn from).
//   - black: 14.3% (FRED LNS14000006, 1980 annual average of the 12
//     published monthly rates) vs. the same 7.1% total.
//   - white: 6.3% (FRED LNS14000003, same 1980 monthly-average method)
//     vs. the same 7.1% total — below 1.0, a real, lower-than-average
//     exposure, not a design choice to make white-1986 easier.
//   - asian: no equivalent. BLS did not publish a disaggregated Asian
//     unemployment series until 2000 (see UNEMPLOYMENT_2000_TEXT's own
//     note in adulthoodWorld.js) — there is no comparably-sourced 1980
//     figure to cite, so asian-1986 gets 1.0 (no adjustment) rather than
//     a guessed number standing in as if it were real.
const RECESSION_EXPOSURE_MULTIPLIER_BY_RACE = {
  latino: 10.1 / 7.1,
  black: 14.3 / 7.1,
  white: 6.3 / 7.1,
  asian: 1,
};

// [E] design simplification, not itself a directly sourced percentage —
// represents the real structural fact that the 1986 Tax Reform Act
// stripped the deduction from every kind of debt except a home mortgage:
// every year spent renting instead of owning is a year of foregone
// tax-advantaged wealth-building relative to a homeowner. Applied as a
// flat haircut to the savings rate for as long as the character hasn't
// closed on a home.
const TAX_ACT_SAVINGS_RATE_PENALTY = 0.02;

// [V] Share of consumers who are "credit invisible" (no file at a
// nationwide credit reporting agency) plus "unscorable" (a file too thin
// to score), by race — CFPB, "Data Point: Credit Invisibles," May 2015.
// Same fix as RECESSION_EXPOSURE_MULTIPLIER_BY_RACE above and same
// discovery moment: this was one fixed Hispanic-sourced constant applied
// to every archetype. The CFPB report itself only disaggregates
// Black/Hispanic/White — Asian consumers are reported combined with
// White in this particular release, not a separately measured figure,
// noted here rather than silently reusing white's number as if it were
// Asian's own. A genuine per-household circumstance, not a
// population-wide rate, so this rolls rather than applies deterministically.
const CREDIT_ACCESS_GAP_RATE_BY_RACE = {
  latino: 0.285, // 15% invisible + 12% unscorable, Hispanic consumers
  black: 0.28, // 15% invisible + 13% unscorable, Black consumers
  white: 0.162, // 9% invisible + 7% unscorable, White consumers
  asian: 0.162, // same CFPB release groups Asian with White for this metric
};

// [E] design simplification, same convention as TAX_ACT_SAVINGS_RATE_
// PENALTY above — represents the real, documented lasting wealth effect
// of a steered subprime loan (extra interest and fees paid, and for the
// share who lost the home outright, forgone equity) on top of whatever
// else is already dragging on this household's savings rate. black-1986
// archetype-specific; applied additively, not as an override, since the
// universal Tax Reform Act penalty above still applies to this family too.
const PREDATORY_LENDING_SAVINGS_RATE_PENALTY = 0.02;

// [E] design simplification, same convention and same 0.02 magnitude as
// PREDATORY_LENDING_SAVINGS_RATE_PENALTY above — represents the real,
// documented lasting wealth effect of two compounding structural
// exclusions specific to asian-1986's circumstance: California's Alien
// Land Law (1913-1952) barring land ownership outright, and the $1.3-5
// billion (inflation-adjusted range; Civil Liberties Act of 1988
// findings) in property WWII incarceration cost Japanese American
// families in 1942, sold or abandoned in days. Applied additively, same
// as Black's, on top of the universal Tax Reform Act penalty.
const GENERATIONAL_DISPOSSESSION_SAVINGS_RATE_PENALTY = 0.02;

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
  state.disruptionRateMultiplier = RECESSION_EXPOSURE_MULTIPLIER_BY_RACE[state.race]
    ?? RECESSION_EXPOSURE_MULTIPLIER_BY_RACE.latino;
}

function applyTaxActPenalty(state) {
  state.savingsRatePenalty = TAX_ACT_SAVINGS_RATE_PENALTY;
}

function rollCreditAccess(state) {
  const rate = CREDIT_ACCESS_GAP_RATE_BY_RACE[state.race] ?? CREDIT_ACCESS_GAP_RATE_BY_RACE.latino;
  const roll = Math.random();
  const disrupted = roll < rate; // disrupted = no mainstream credit
  return { disrupted, rate };
}

function applyPredatoryLendingPenalty(state) {
  state.savingsRatePenalty += PREDATORY_LENDING_SAVINGS_RATE_PENALTY;
}

function applyGenerationalDispossessionPenalty(state) {
  state.savingsRatePenalty += GENERATIONAL_DISPOSSESSION_SAVINGS_RATE_PENALTY;
}

export default {
  rollChildhoodDependency,
  rollJobDisruption,
  applyRecessionExposure,
  applyTaxActPenalty,
  rollCreditAccess,
  applyPredatoryLendingPenalty,
  applyGenerationalDispossessionPenalty,
};
