// The narrative half of the demographic-attribute system (Demographics.js
// rolls the numbers; this is what gets said about them). Reached by
// DemographicContextScene, right after SpecialCircumstanceScene reveals
// documentation status — the primary circumstance stays primary; this is
// "and here's what else is true," not a replacement for it.
//
// Same 3-beat shape as pathConsequences.js's CONSEQUENCES bank — statistic
// / uncertainty / qualitative, `text` a string or function of GameState,
// `source` a real [V] citation (omitted on uncertainty beats, same as
// pathConsequences.js's own convention) — per direction, so race/setting/
// disability carry the same narrative weight PathConsequenceScene already
// gives the military/college/workforce paths, not a lighter single-line
// version of it. This project's earlier scope note ("single, concise
// beats... four races, two settings, one disability beat would be 21
// beats otherwise") is the scope this file now deliberately fills in.
//
// Every qualitative beat below was chosen to tie back into this game's
// actual subject — homeownership — rather than a generic demographic
// fact: the racial homeownership-rate gap is the direct present-day
// legacy of the redlining maps Baseline1 opens on; the setting beats bear
// on the same down-payment-saving mechanic the whole game tracks; the
// disability beat is about the housing stock itself, not just income.

// [V] BLS CPS, median usual weekly earnings by race/ethnicity, Q1 2025
// (race-level, not broken further by sex): White $1,219, Black $1,000,
// Hispanic/Latino $929, Asian $1,585 — same release Demographics.js's
// sex-specific table comes from.
const RACE_STATISTIC_SOURCE = '[V] BLS CPS, median usual weekly earnings by race, Q1 2025';

const RACE_BEATS = {
  white: [
    {
      id: 'race-white-statistic',
      category: 'statistic',
      text: 'This household is white. White workers post a median $1,219 a week — second only to Asian workers among the groups this game tracks, and still well above Black, Latino, or the population as a whole.',
      source: RACE_STATISTIC_SOURCE,
    },
    {
      id: 'race-white-uncertainty',
      category: 'uncertainty',
      text: "That median hides real range underneath it. Being the highest-earning group on average doesn't mean every white household clears this game's numbers — plenty land well below them.",
    },
    {
      id: 'race-white-qualitative',
      category: 'qualitative',
      text: "Redlining's maps — the ones this story opened on — marked white neighborhoods \"desirable\" by design. The loans, the equity, and the wealth that system was built to protect flowed to families who looked like this one. That's not a moral judgment on any individual — it's the documented mechanism behind why white homeownership sits at 72% today, the highest of any group this game tracks, against roughly 44% for Black households and 50% for Latino households.",
      source: '[V] U.S. Census Bureau, Housing Vacancy Survey, homeownership rate by race, 2024',
    },
  ],
  black: [
    {
      id: 'race-black-statistic',
      category: 'statistic',
      text: 'This household is Black. Black workers earn a median 82 cents for every dollar white workers make — a gap that has held, with only small movement, for decades.',
      source: RACE_STATISTIC_SOURCE,
    },
    {
      id: 'race-black-uncertainty',
      category: 'uncertainty',
      text: "That 82 cents is a median gap, not this family's individual outcome — real households on both sides of it land above and below what the average predicts.",
    },
    {
      id: 'race-black-qualitative',
      category: 'qualitative',
      text: 'The wage gap is the smaller of the two numbers. Black homeownership sits at roughly 44% nationally, against about 72% for white households — a nearly 30-point gap that traces straight back to the same redlining maps this story opened on, not to income alone.',
      source: '[V] U.S. Census Bureau, Housing Vacancy Survey, homeownership rate by race, 2024',
    },
  ],
  latino: [
    {
      id: 'race-latino-statistic',
      category: 'statistic',
      text: 'This household is Latino. Latino workers earn a median 76 cents for every dollar white workers make — the widest race-based earnings gap this game tracks.',
      source: RACE_STATISTIC_SOURCE,
    },
    {
      id: 'race-latino-uncertainty',
      category: 'uncertainty',
      text: "That 76-cent figure is a national median across a huge range of jobs and regions — this family's actual gap could run wider or narrower than it.",
    },
    {
      id: 'race-latino-qualitative',
      category: 'qualitative',
      text: "The same maps that redlined Black neighborhoods marked immigrant neighborhoods red too — \"hazardous,\" the same grade, the same boundary line this story already opened on. One of that system's lasting effects: Latino households are disproportionately \"credit invisible\" today — no mainstream credit file at all, not just a thin one — at nearly twice the rate of white households. For this family specifically, that compounds directly with the mainstream-banking lockout their own undocumented years already caused.",
      source: '[V] Urban Institute / Consumer Financial Protection Bureau, credit invisibility by race',
    },
  ],
  asian: [
    {
      id: 'race-asian-statistic',
      category: 'statistic',
      text: 'This household is Asian American. Asian workers post the highest median earnings of any group this game tracks, well above white workers’.',
      source: RACE_STATISTIC_SOURCE,
    },
    {
      id: 'race-asian-uncertainty',
      category: 'uncertainty',
      text: "That single median hides enormous variation by origin and immigration history — it is not one uniform experience, and no one number can carry it.",
    },
    {
      // Found live during a narrative audit (2026-09-21): this used to
      // say the high income figure above reflects "immigration policy
      // [that] shifted toward the high-skilled pathways that shape THIS
      // household's income today" — a recent-arrival framing that
      // quietly contradicts asian-1986's own established backstory
      // (Baseline1/CircumstanceOriginAsian/Synopsis all agree: a
      // multi-generational California farming family present since
      // before the 1913 Alien Land Law, not a recent high-skilled
      // arrival). This beat predates the archetype — it's leftover
      // pan-Asian content from before race selected a specific
      // archetype (2026-09-20) — and was never reconciled with the
      // specific family history built on top of it since. Rewritten to
      // hold both true things without conflating them: this family's
      // own history is the older, land-law/incarceration one; the
      // high-skilled-pathway story belongs to OTHER Asian American
      // households and is part of what makes the aggregate figure above
      // not this one household's own story either.
      id: 'race-asian-qualitative',
      category: 'qualitative',
      text: "Asian American neighborhoods sat inside the same red lines too — Chinatowns and Japantowns up and down the West Coast were graded \"hazardous\" by the same maps this story opened on, decades before immigration policy shifted toward the high-skilled pathways that shape the income figure above. That's a separate story from this specific family's own, which goes back further than any of it. The homeownership picture still splits the way the income figure hides: Asian American homeownership runs close to the white rate on average, but Census data on specific origin groups — Hmong, Cambodian, and other Southeast Asian American communities in particular — shows rates and incomes far below that headline number.",
      source: '[V] Mapping Inequality (Univ. of Richmond), HOLC residential security maps; U.S. Census Bureau / Pew Research Center, homeownership and income by detailed Asian origin group',
    },
  ],
};

// [V] U.S. Census Bureau, 2023 median household income, rural vs. urban;
// [V] Redfin, Los Angeles city median sale price, 2026.
const SETTING_BEATS = {
  rural: [
    {
      id: 'setting-rural-statistic',
      category: 'statistic',
      text: 'This family is in Fresno — the Central Valley, agricultural country as much as it is a city. Rural households earn a median $66,600 a year against $80,600 in urban America.',
      source: '[V] U.S. Census Bureau, 2023 median household income, rural vs. urban',
    },
    {
      id: 'setting-rural-uncertainty',
      category: 'uncertainty',
      text: "That's a national rural-vs-urban median, not a Fresno-specific number — some rural labor markets sit well above it, some well below.",
    },
    {
      // Found live during a shared-content sanity pass (2026-09-21):
      // this fixed "mortgage desert" framing — true in general, and
      // true for latino-1986/black-1986/asian-1986's own rural
      // circumstances — directly contradicted white-1986's own rural
      // branch (CircumstanceOriginWhite), which tells the SAME player
      // minutes earlier that this family was exactly who rural lenders
      // competed for, not a household lenders had to be talked into
      // serving ("every loan officer in town wanted this business...
      // 'no' was never really on the table"). One scene said scarcity;
      // the other said the opposite, both shown in the same run. `text`
      // is now a function so white-1986 gets the true version of this
      // fact instead of the generic one.
      id: 'setting-rural-qualitative',
      category: 'qualitative',
      text: (state) => (state.archetypeId === 'white-1986'
        ? "Scarcity isn't the whole story out here, either — it depends who's asking. The same mortgage-desert research shows conventional lenders concentrate their attention on the buyers they're confident about, which is exactly why this family didn't feel any scarcity at all. The shortage was real. It just wasn't a shortage this family had to compete against."
        : "The income gap isn't the only friction saving for a home in a place like this. Rural areas have measurably fewer conventional mortgage lenders per household than cities do — real 'mortgage deserts' that push rural buyers toward costlier, less-regulated financing more often."),
      source: '[V] Urban Institute / USDA, rural mortgage lending access research',
    },
  ],
  urban: [
    {
      id: 'setting-urban-statistic',
      category: 'statistic',
      text: "This family is in Los Angeles instead of Fresno — a much bigger, much more expensive city. The median home here runs roughly $1,000,000, more than double what the same wages would face in Fresno.",
      source: '[V] Redfin, Los Angeles median sale price, 2026',
    },
    {
      id: 'setting-urban-uncertainty',
      category: 'uncertainty',
      text: "A citywide median flattens a lot of range — plenty of Los Angeles listings sit well below that number, and plenty sit far above it.",
    },
    {
      id: 'setting-urban-qualitative',
      category: 'qualitative',
      text: "The home price is the number this game tracks, but the harder squeeze often comes first: Los Angeles renters spend a larger share of income on rent than almost any other major U.S. metro, which makes it that much harder to save toward a down payment before the price tag is even in play.",
      source: '[V] Harvard Joint Center for Housing Studies / California Housing Partnership, rent burden by metro',
    },
  ],
};

// [V] U.S. Bureau of Labor Statistics / Kessler Foundation nTIDE, 2024.
const DISABILITY_BEATS = [
  {
    id: 'disability-statistic',
    category: 'statistic',
    text: 'Someone in this household lives with a disability. Nationally, people with disabilities are employed at less than half the rate of people without one — 38% versus 75% — and when they do work, earn a median 83 cents for every dollar a nondisabled worker makes.',
    source: '[V] U.S. Bureau of Labor Statistics / Kessler Foundation nTIDE, 2024',
  },
  {
    id: 'disability-uncertainty',
    category: 'uncertainty',
    text: "Those figures average across every kind and severity of disability there is — a single household's actual employment and wage effects can land far from either number.",
  },
  {
    id: 'disability-qualitative',
    category: 'qualitative',
    text: "Income isn't the only cost this game's numbers don't carry. Housing that's actually accessible — no-step entries, wider doorways, adaptable layouts — is a small, undersupplied slice of the market, and typically carries a real price premium over otherwise-comparable homes that aren't.",
    source: '[V] HUD / Technical Assistance Collaborative, accessible housing supply and cost research',
  },
];

export default { RACE_BEATS, SETTING_BEATS, DISABILITY_BEATS };
