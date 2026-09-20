// The narrative half of the demographic-attribute system (Demographics.js
// rolls the numbers; this is what gets said about them). Reached by
// DemographicContextScene, right after SpecialCircumstanceScene reveals
// documentation status — the primary circumstance stays primary; this is
// "and here's what else is true," not a replacement for it.
//
// SCOPE NOTE, stated plainly: these are single, concise beats (matching
// SpecialCircumstanceScene's own brevity), not full PathConsequences-
// style 3-part sequences — four races, two settings, one disability beat
// would be 21 beats otherwise. Also: this is the narrative/mechanical
// layer only. SchoolTest's "Fresno High," CollegeStats' "Fresno City
// College," every overworld backdrop — all of it still says Fresno
// regardless of the setting rolled here, until the LA art/content pass
// happens. Rolling "urban" today changes the home-price tier and the
// income math; it doesn't yet change the rest of the game's scenery.

// [V] BLS CPS, median usual weekly earnings by race/ethnicity, Q1 2025
// (race-level, not broken further by sex): White $1,219, Black $1,000,
// Hispanic/Latino $929, Asian $1,585 — same release Demographics.js's
// sex-specific table comes from.
const RACE_BEATS = {
  white: {
    text: "This household is white. Race still measurably shapes who gets ahead in this country, and white workers post the highest median earnings of any group this game tracks. That doesn't erase anything else true about this family — it's one more real condition sitting alongside the rest.",
  },
  black: {
    text: 'This household is Black. Black workers earn a median 82 cents for every dollar white workers make — a gap that has held, with only small movement, for decades. Not this family\'s whole story. One more real condition they start from.',
  },
  latino: {
    text: 'This household is Latino. Latino workers earn a median 76 cents for every dollar white workers make — the widest race-based earnings gap this game tracks, layered on top of whatever else this family carries.',
  },
  asian: {
    text: "This household is Asian American. Asian workers post the highest median earnings of any group this game tracks, well above white workers' — real, and also not the whole picture: that single median hides enormous variation by origin and immigration history no one number can carry.",
  },
};
const RACE_SOURCE = '[V] BLS CPS, median usual weekly earnings by race, Q1 2025';

// [V] U.S. Census Bureau, 2023 median household income, rural vs. urban;
// [V] Redfin, Los Angeles city median sale price, 2026.
const SETTING_BEATS = {
  rural: {
    cityLabel: 'Fresno, CA',
    text: 'This family is in Fresno — the Central Valley, agricultural country as much as it is a city. Rural households earn a median $66,600 a year against $80,600 in urban America, and every job this game has you look for sits inside that gap.',
    source: '[V] U.S. Census Bureau, 2023 median household income, rural vs. urban',
  },
  urban: {
    cityLabel: 'Los Angeles, CA',
    text: "This family is in Los Angeles instead of Fresno — a much bigger, much more expensive city. The median home here runs roughly $1,000,000, more than double what the same wages would face in Fresno.",
    source: '[V] Redfin, Los Angeles median sale price, 2026',
  },
};

// [V] U.S. Bureau of Labor Statistics / Kessler Foundation nTIDE, 2024.
const DISABILITY_BEAT = {
  text: 'Someone in this household lives with a disability. Nationally, people with disabilities are employed at less than half the rate of people without one — 38% versus 75% — and when they do work, earn a median 83 cents for every dollar a nondisabled worker makes.',
  source: '[V] U.S. Bureau of Labor Statistics / Kessler Foundation nTIDE, 2024',
};

export default { RACE_BEATS, RACE_SOURCE, SETTING_BEATS, DISABILITY_BEAT };
