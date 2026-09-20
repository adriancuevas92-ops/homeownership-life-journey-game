// Curated question bank for the workforce "jackpot" test (JackpotTest.js).
// Four tiers, 0 (baseline) through 3 (max Structural Drag hits) — unlike
// schoolTestBank.js's grade levels, tier 0 here already starts at real
// workplace/financial-literacy difficulty on purpose (see JackpotTest.js).
// 10 hand-verified questions per tier; since this test is one attempt
// only, each tier's full set IS the test (shuffled for presentation),
// not a draw from a larger pool.

const BANK = {
  0: [
    { prompt: 'Your pay stub shows gross pay of $1,200 and total deductions of $310. What is your net pay?', choices: ['$890', '$910', '$1,510', '$310'], answer: '$890' },
    { prompt: 'You work 40 hours at $18/hour. What is your gross weekly pay?', choices: ['$720', '$700', '$740', '$680'], answer: '$720' },
    { prompt: "Your employer matches 50% of your 401(k) contribution, up to 6% of pay. You earn $50,000 and contribute 6%. How much does your employer add?", choices: ['$1,500', '$3,000', '$500', '$6,000'], answer: '$1,500' },
    { prompt: 'Which of these is a pre-tax payroll deduction?', choices: ['A 401(k) contribution', 'Union dues paid in cash', 'A personal loan repayment', 'A parking ticket'], answer: 'A 401(k) contribution' },
    { prompt: 'Overtime pay is 1.5x your hourly rate. At $20/hour, what do you earn for 5 hours of overtime?', choices: ['$150', '$100', '$120', '$200'], answer: '$150' },
    { prompt: "What does \"PTO\" commonly stand for in a workplace benefits package?", choices: ['Paid Time Off', 'Personal Tax Obligation', 'Part-Time Only', 'Payroll Transfer Order'], answer: 'Paid Time Off' },
    { prompt: 'One job offers $22/hour. Another offers $45,000/year. At 2,080 work hours a year, which pays more per hour?', choices: ['The $22/hour job', 'The $45,000 salary', 'They pay exactly the same', 'Not enough information'], answer: 'The $22/hour job' },
    { prompt: '"Take-home pay" best describes:', choices: ['The amount left after taxes and deductions', 'Your gross annual salary', "Your employer's total labor cost", 'Your hourly wage before taxes'], answer: 'The amount left after taxes and deductions' },
    { prompt: 'Inflation is 3% and your raise is 2%. What happened to your real (inflation-adjusted) buying power?', choices: ['It decreased', 'It increased', 'It stayed exactly the same', 'Raises always outpace inflation'], answer: 'It decreased' },
    { prompt: 'A $5,000 signing bonus is taxed at roughly 22% (federal supplemental rate). About how much do you actually receive?', choices: ['About $3,900', 'About $5,000', 'About $4,750', 'About $3,500'], answer: 'About $3,900' },
  ],
  1: [
    { prompt: 'You get a 4% raise on a $45,000 salary, then a 3% raise the next year on your new salary. What is your salary after both raises, to the nearest dollar?', choices: ['$48,204', '$47,700', '$48,600', '$46,800'], answer: '$48,204' },
    { prompt: 'Your health insurance premium is $220/month, and your employer covers 70% of it. How much do you pay monthly?', choices: ['$66', '$154', '$220', '$44'], answer: '$66' },
    { prompt: 'You contribute 10% of a $60,000 salary to a 401(k). How much is contributed per year?', choices: ['$6,000', '$600', '$10,000', '$5,400'], answer: '$6,000' },
    { prompt: "A job's total compensation is $50,000 salary plus $8,000 in benefits value. What share of total compensation is the salary?", choices: ['About 86%', 'About 80%', 'About 94%', 'About 75%'], answer: 'About 86%' },
    { prompt: 'Which factor most directly determines eligibility for unpaid FMLA leave?', choices: ['Having worked for the employer at least 12 months and 1,250 hours', 'Being a full-time salaried employee only', 'Working for any employer with at least 1 employee', 'Being employed for at least 30 days'], answer: 'Having worked for the employer at least 12 months and 1,250 hours' },
    { prompt: 'Your effective tax rate differs from your marginal tax rate because:', choices: ["Only income above each bracket's threshold is taxed at that bracket's rate", 'All your income is taxed at your highest bracket’s rate', 'Effective rate is always higher than marginal rate', 'They are always the same number'], answer: "Only income above each bracket's threshold is taxed at that bracket's rate" },
    { prompt: 'A union contract raises the base wage by $1.25/hour for 2,000 annual hours. What is the annual raise?', choices: ['$2,500', '$1,250', '$2,000', '$3,125'], answer: '$2,500' },
    { prompt: "Your 401(k) match vests over 3 years, 1/3 per year. You leave after 18 months. How much of the match do you keep?", choices: ['1/3', '1/2', 'All of it', 'None of it'], answer: '1/3' },
    { prompt: "Which of these is used to calculate a household's debt-to-income ratio for a mortgage?", choices: ['Monthly debt payments divided by gross monthly income', 'Total debt divided by net worth', 'Annual income divided by total debt', 'Credit score divided by income'], answer: 'Monthly debt payments divided by gross monthly income' },
    { prompt: 'A 2.5% cost-of-living raise is applied to a $52,000 salary. What is the new salary?', choices: ['$53,300', '$52,500', '$54,600', '$53,000'], answer: '$53,300' },
  ],
  2: [
    { prompt: "You're choosing between a $65,000 salary with no bonus, or a $58,000 salary plus a 15% annual bonus on base. Which offers more first-year total pay?", choices: ['The $58,000 + 15% bonus offer', 'The $65,000 flat offer', "They're equal", 'Cannot be determined'], answer: 'The $58,000 + 15% bonus offer' },
    { prompt: 'Your marginal tax rate is 22% and you take $3,000 in extra overtime. About how much do you keep after federal income tax alone?', choices: ['About $2,340', 'About $3,000', 'About $2,000', 'About $2,700'], answer: 'About $2,340' },
    { prompt: "A company's annual turnover rate is 18%. Roughly how many of 250 employees leave in a year?", choices: ['45', '18', '25', '60'], answer: '45' },
    { prompt: 'Nominal wages rose 4.5% and inflation was 3.1%. What was real (inflation-adjusted) wage growth?', choices: ['1.4%', '4.5%', '7.6%', '1.6%'], answer: '1.4%' },
    { prompt: 'A worker negotiates a raise from $24/hour to $26.50/hour. What percentage raise is that, to the nearest whole percent?', choices: ['10%', '9%', '11%', '8%'], answer: '10%' },
    { prompt: 'Which best explains why job switchers sometimes out-earn job stayers in wage growth?', choices: ["Employers often raise new-hire offers faster than they raise current employees' pay", 'Job stayers always receive smaller total compensation', 'Switching jobs guarantees a raise', 'Legally, new hires must be paid more'], answer: "Employers often raise new-hire offers faster than they raise current employees' pay" },
    { prompt: "A simplified tax bracket taxes income above $47,150 at 22%. A worker earning $52,000 has which portion taxed at 22%?", choices: ['Only the amount above $47,150', 'Their entire $52,000 income', 'Nothing, since they are near the threshold', 'Only the first $47,150'], answer: 'Only the amount above $47,150' },
    { prompt: 'A household spends 35% of $5,200 gross monthly income on housing. What is the monthly housing spend?', choices: ['$1,820', '$1,500', '$2,000', '$1,680'], answer: '$1,820' },
    { prompt: "Comparing real average earnings for a bachelor's degree holder and an associate degree holder applying for the same promotion:", choices: ["Both typically out-earn a diploma-only worker, and the bachelor's holder out-earns the associate holder on average", 'They typically earn the same on average', 'The associate degree holder typically earns more on average', 'Neither typically out-earns a diploma-only worker'], answer: "Both typically out-earn a diploma-only worker, and the bachelor's holder out-earns the associate holder on average" },
    { prompt: "What most directly increases a worker's real purchasing power over time?", choices: ['Wage growth that consistently outpaces inflation', 'Any nominal raise, regardless of size', 'Working more overtime hours at the same rate', 'A one-time signing bonus'], answer: 'Wage growth that consistently outpaces inflation' },
  ],
  3: [
    { prompt: 'A worker earning $48,000 is promoted to $58,000, and the extra $10,000 is taxed at a 24% marginal rate. About how much of that $10,000 is kept after federal tax on that portion?', choices: ['About $7,600', 'About $10,000', 'About $8,500', 'About $6,000'], answer: 'About $7,600' },
    { prompt: "Economist Raj Chetty's research found a child born into the bottom U.S. income quintile has roughly what chance of reaching the top quintile as an adult?", choices: ['About 1 in 12 (8%)', 'About 1 in 3 (33%)', 'About 1 in 2 (50%)', 'About 1 in 100 (1%)'], answer: 'About 1 in 12 (8%)' },
    { prompt: "A worker's total compensation grows from $60,000 to $69,000 over 3 years. What is the approximate average annual (compounding) growth rate?", choices: ['About 4.8%', 'About 3%', 'About 7.5%', 'About 15%'], answer: 'About 4.8%' },
    { prompt: "A household's debt-to-income ratio is 38%. Mortgage lenders commonly cap DTI at what standard threshold for a typical qualified loan?", choices: ['43%', '28%', '50%', '36%'], answer: '43%' },
    { prompt: "If a raise exactly matches inflation every year for a decade, what happens to the worker's real wage?", choices: ['It stays flat in real terms', 'It grows substantially', 'It falls significantly', 'It doubles'], answer: 'It stays flat in real terms' },
    { prompt: 'An employer offers $12,000 in RSUs vesting evenly over 4 years. About how much vests per year?', choices: ['$3,000', '$12,000', '$4,000', '$2,000'], answer: '$3,000' },
    { prompt: "Which statement about the college wage premium is most accurate, based on real data?", choices: ['It varies enormously by major, and some majors earn less than the typical diploma-only wage', 'It is identical across every major', 'It only applies to graduate degrees', 'It has shrunk to zero in recent years'], answer: 'It varies enormously by major, and some majors earn less than the typical diploma-only wage' },
    { prompt: "A worker's real hourly wage is $24, up from $22 five years ago in real terms. What is the real percentage increase?", choices: ['About 9%', 'About 2%', 'About 20%', 'About 11%'], answer: 'About 9%' },
    { prompt: 'In simple terms, why does a $10,000 raise not increase take-home pay by a full $10,000?', choices: ['Payroll and income taxes take a portion of the additional income', 'Raises are never taxed', 'Take-home pay always equals gross pay', 'Because $10,000 raises are illegal'], answer: 'Payroll and income taxes take a portion of the additional income' },
    { prompt: 'Based on recent Atlanta Fed wage-growth tracking, do job switchers reliably out-earn job stayers?', choices: ['No — the gap has flipped direction more than once in recent years', 'Yes, switchers always out-earn stayers', 'No, stayers always out-earn switchers', 'Wage growth is always identical for both'], answer: 'No — the gap has flipped direction more than once in recent years' },
  ],
};

export default BANK;
