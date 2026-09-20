// Curated question pool for the college-path test (CollegeTest.js).
// College-level sophistication — reading, civics, science literacy,
// numeracy — but deliberately nothing a specific course of study would
// be needed for: everything here sits inside "the general knowledge base
// of the adult population of the United States," same bar the U.S.
// naturalization civics test aims for, just broader in subject. 8
// questions per category, 32 total; a test draws 10 at random across the
// whole pool (CollegeTest.buildTest), so a retry doesn't repeat the same
// set. Every answer was hand-checked, same convention as
// schoolTestBank.js's math items.

const BANK = [
  // Civics / history
  { subject: 'Civics', prompt: 'How many amendments does the U.S. Constitution have?', choices: ['27', '10', '21', '33'], answer: '27' },
  { subject: 'Civics', prompt: 'Which branch of the federal government is primarily responsible for interpreting laws?', choices: ['Judicial', 'Legislative', 'Executive', 'Administrative'], answer: 'Judicial' },
  { subject: 'Civics', prompt: 'The Emancipation Proclamation was issued by which U.S. president?', choices: ['Abraham Lincoln', 'Andrew Jackson', 'Ulysses S. Grant', 'Theodore Roosevelt'], answer: 'Abraham Lincoln' },
  { subject: 'Civics', prompt: 'The stock market crash that triggered the Great Depression happened in what year?', choices: ['1929', '1913', '1941', '1933'], answer: '1929' },
  { subject: 'Civics', prompt: 'The Bill of Rights refers to the first how many amendments to the Constitution?', choices: ['10', '5', '27', '13'], answer: '10' },
  { subject: 'Civics', prompt: 'Which document begins with the words "We the People"?', choices: ['The U.S. Constitution', 'The Declaration of Independence', 'The Federalist Papers', 'The Bill of Rights'], answer: 'The U.S. Constitution' },
  { subject: 'Civics', prompt: 'The right to vote regardless of race is specifically protected by which amendment?', choices: ['The 15th Amendment', 'The 19th Amendment', 'The 13th Amendment', 'The 1st Amendment'], answer: 'The 15th Amendment' },
  { subject: 'Civics', prompt: 'Which of these is NOT one of the three branches of the U.S. federal government?', choices: ['The Federal Reserve', 'The Legislative branch', 'The Executive branch', 'The Judicial branch'], answer: 'The Federal Reserve' },

  // Science literacy
  { subject: 'Science', prompt: 'What gas do plants primarily absorb from the atmosphere during photosynthesis?', choices: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], answer: 'Carbon dioxide' },
  { subject: 'Science', prompt: 'At sea level, water boils at what temperature in Fahrenheit?', choices: ['212°F', '100°F', '32°F', '180°F'], answer: '212°F' },
  { subject: 'Science', prompt: 'Which planet in our solar system is closest to the sun?', choices: ['Mercury', 'Venus', 'Earth', 'Mars'], answer: 'Mercury' },
  { subject: 'Science', prompt: 'Which structure is often called the "powerhouse of the cell"?', choices: ['The mitochondria', 'The nucleus', 'The ribosome', 'The chloroplast'], answer: 'The mitochondria' },
  { subject: 'Science', prompt: 'Sound cannot travel through which of the following?', choices: ['A vacuum (outer space)', 'Water', 'Steel', 'Air'], answer: 'A vacuum (outer space)' },
  { subject: 'Science', prompt: 'What is the chemical formula for water?', choices: ['H2O', 'CO2', 'O2', 'H2O2'], answer: 'H2O' },
  { subject: 'Science', prompt: 'In a human cell, DNA is primarily found in which structure?', choices: ['The nucleus', 'The cytoplasm', 'The cell wall', 'The ribosome'], answer: 'The nucleus' },
  { subject: 'Science', prompt: 'Which of these is a renewable energy source?', choices: ['Solar power', 'Coal', 'Natural gas', 'Petroleum'], answer: 'Solar power' },

  // Reading / vocabulary
  { subject: 'Reading', prompt: '"Ubiquitous" most nearly means:', choices: ['Present everywhere', 'Very rare', 'Extremely loud', 'Old-fashioned'], answer: 'Present everywhere' },
  { subject: 'Reading', prompt: '"Candid" most nearly means:', choices: ['Honest and direct', 'Secretive', 'Angry', 'Confusing'], answer: 'Honest and direct' },
  { subject: 'Reading', prompt: '"Skeptical" most nearly means:', choices: ['Doubtful', 'Convinced', 'Excited', 'Careless'], answer: 'Doubtful' },
  { subject: 'Reading', prompt: 'Which sentence is grammatically correct?', choices: ['She and I went to the store.', 'Her and me went to the store.', 'Me and her went to the store.', 'She and myself went to the store.'], answer: 'She and I went to the store.' },
  { subject: 'Reading', prompt: '"Ambiguous" most nearly means:', choices: ['Open to more than one interpretation', 'Perfectly clear', 'Very short', 'Extremely large'], answer: 'Open to more than one interpretation' },
  { subject: 'Reading', prompt: '"Concise" most nearly means:', choices: ['Brief and clear', 'Long-winded', 'Confusing', 'Poetic'], answer: 'Brief and clear' },
  { subject: 'Reading', prompt: '"Benevolent" most nearly means:', choices: ['Kind and generous', 'Cruel', 'Indifferent', 'Nervous'], answer: 'Kind and generous' },
  { subject: 'Reading', prompt: 'Which sentence is correctly punctuated?', choices: ["It's important to know your rights.", "Its important to know you're rights.", "It's important to know you're rights.", "Its important to know your rights."], answer: "It's important to know your rights." },

  // Math / reasoning
  { subject: 'Reasoning', prompt: 'A jacket priced at $80 is discounted 25%. What is the sale price?', choices: ['$60', '$55', '$65', '$70'], answer: '$60' },
  { subject: 'Reasoning', prompt: 'A car travels 240 miles using 8 gallons of gas. What is its fuel efficiency?', choices: ['30 mpg', '25 mpg', '32 mpg', '20 mpg'], answer: '30 mpg' },
  { subject: 'Reasoning', prompt: 'At 5% simple interest, how much interest accrues on a $2,000 loan after one year?', choices: ['$100', '$50', '$200', '$500'], answer: '$100' },
  { subject: 'Reasoning', prompt: 'A poll of 500 people shows 60% support a proposal. How many people is that?', choices: ['300', '250', '350', '200'], answer: '300' },
  { subject: 'Reasoning', prompt: 'Which of these represents the largest value?', choices: ['0.4', '3/8', '35%', '1/3'], answer: '0.4' },
  { subject: 'Reasoning', prompt: 'A rectangle has a length of 12 feet and a width of 5 feet. What is its perimeter?', choices: ['34 feet', '60 feet', '17 feet', '30 feet'], answer: '34 feet' },
  { subject: 'Reasoning', prompt: 'If you save $150 a month, how much will you have saved after 8 months?', choices: ['$1,200', '$1,050', '$1,350', '$900'], answer: '$1,200' },
  { subject: 'Reasoning', prompt: 'What is the average (mean) of 4, 8, 15, and 9?', choices: ['9', '8', '10', '36'], answer: '9' },
];

export default BANK;
