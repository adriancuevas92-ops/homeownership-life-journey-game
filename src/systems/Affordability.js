// Formula and constants from the Concept & MVP Plan, Section 13
// (FHA rules, current mortgage rate) and Section 17 (Fresno real prices).
// [E] marks a design estimate rather than a directly sourced figure —
// see the doc for the full citation on every [V] figure.

const DOWN_PAYMENT_RATE = 0.035; // FHA minimum, credit 580+ [V]
// [E] common conventional-loan minimum without an FHA-qualifying credit
// history — the redlining-era "Structural Drag" modifier (Baseline2)
// routes a household with no mainstream credit here instead of the FHA
// minimum above, since access to that cheaper path depends on exactly
// the credit history the legacy of redlining makes less likely.
const NO_CREDIT_DOWN_PAYMENT_RATE = 0.10;
// The VA loan's real advantage, already stated to the player on the
// Military path's stats page and again on drill completion: 0% down, no
// mortgage insurance. [E] simplification — over 74% of actual VA
// purchases use the zero-down option, not literally all of them, but
// GameState.isVeteran is a binary flag (same modeling choice as
// hasMainstreamCredit above), not a probability roll.
const VA_DOWN_PAYMENT_RATE = 0;
const CLOSING_COST_RATE = 0.03; // [E] midpoint of the common 2-5% range
const UFMIP_RATE = 0.0175; // FHA upfront mortgage insurance, financed [V]
const ANNUAL_MIP_RATE = 0.0055; // FHA annual mortgage insurance [V]
const TAX_INSURANCE_RATE = 0.012; // [E] common planning estimate
const CURRENT_MORTGAGE_RATE = 0.0695; // Freddie Mac PMMS, Sept 2026 [V]
// [V] VA Loan Network, 2026: VA-backed rates average 0.25-0.5 points below
// conventional, because the VA's 25% guaranty lowers the lender's risk —
// not a benefit tied to a veteran's income or credit, structurally
// distinct from (and additive to) the down-payment/MIP difference below.
// Midpoint of that sourced range, same convention as CLOSING_COST_RATE's
// midpoint-of-a-range choice above.
const VA_MORTGAGE_RATE = CURRENT_MORTGAGE_RATE - 0.00375;
const LOAN_TERM_MONTHS = 360;
const DTI_CEILING = 0.43; // FHA standard back-end ratio [V]

// Home-price tiers used to live here as a hardcoded export. They moved
// to each archetype's own registry entry (src/data/characters/) since
// they're specific to where this character is house-hunting, not to the
// mortgage math itself — check() below never referenced TIERS directly,
// so this function was already archetype-agnostic. See EndingScene.js.

function monthlyPrincipalAndInterest(loanAmount, annualRate, termMonths) {
  const r = annualRate / 12;
  const factor = Math.pow(1 + r, termMonths);
  return loanAmount * ((r * factor) / (factor - 1));
}

function check(homePrice, savingsJar, annualIncome, hasMainstreamCredit = true, isVeteran = false) {
  const downPaymentRate = isVeteran ? VA_DOWN_PAYMENT_RATE
    : (hasMainstreamCredit ? DOWN_PAYMENT_RATE : NO_CREDIT_DOWN_PAYMENT_RATE);
  const downPayment = downPaymentRate * homePrice;
  const closingCosts = CLOSING_COST_RATE * homePrice;
  const cashToClose = downPayment + closingCosts;

  const baseLoan = homePrice - downPayment;
  const financedLoan = baseLoan * (1 + (isVeteran ? 0 : UFMIP_RATE));

  const rate = isVeteran ? VA_MORTGAGE_RATE : CURRENT_MORTGAGE_RATE;
  const pAndI = monthlyPrincipalAndInterest(financedLoan, rate, LOAN_TERM_MONTHS);
  const monthlyMip = isVeteran ? 0 : (ANNUAL_MIP_RATE * financedLoan) / 12;
  const monthlyTaxIns = (TAX_INSURANCE_RATE * homePrice) / 12;
  const monthlyHousing = pAndI + monthlyMip + monthlyTaxIns;

  const incomeNeeded = (monthlyHousing / DTI_CEILING) * 12;
  const monthlyIncome = annualIncome / 12;
  const dtiPasses = monthlyHousing / monthlyIncome <= DTI_CEILING;
  const cashPasses = savingsJar >= cashToClose;

  return {
    passes: dtiPasses && cashPasses,
    cashToClose: Math.round(cashToClose),
    monthlyHousing: Math.round(monthlyHousing),
    incomeNeeded: Math.round(incomeNeeded),
    dtiPasses,
    cashPasses,
  };
}

export default { check };
