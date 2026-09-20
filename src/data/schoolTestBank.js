// Curated question banks for the Fresno High graduate-path test (Level 1
// -> Level 2 gate). Four grade levels, 6th (baseline) through 9th (max
// difficulty expansion) — see src/systems/SchoolTest.js for how a
// playthrough's grade level gets picked. Each grade has 8 math + 8
// spelling items; a test draws 5 of each without replacement, so the
// same grade level doesn't hand back an identical test every time.
//
// Math items are genuinely computed, not placeholder flavor text — every
// answer below was worked by hand and matches real grade-level curricula
// (CCSS 6th: ratios/fraction division/negatives/area; 7th: proportional
// relationships/percent change/probability; 8th: linear equations/
// exponents/Pythagorean theorem/slope; 9th: factoring/quadratics/
// inequalities/functions). Spelling items are multiple-choice (one
// correctly spelled option among three plausible misspellings) rather
// than free-text entry, to keep grading unambiguous.

const BANK = {
  6: {
    math: [
      { prompt: 'What is 3/4 ÷ 1/2?', choices: ['1 1/2', '3/8', '2/3', '1/4'], answer: '1 1/2' },
      { prompt: 'A recipe uses a ratio of 2 cups flour to 3 cups sugar. If you use 6 cups of flour, how many cups of sugar?', choices: ['9', '6', '12', '4'], answer: '9' },
      { prompt: 'What is -8 + 5?', choices: ['-3', '3', '-13', '13'], answer: '-3' },
      { prompt: 'Find the area of a rectangle with length 9 and width 4.', choices: ['36', '26', '13', '18'], answer: '36' },
      { prompt: 'Round 4.567 to the nearest tenth.', choices: ['4.6', '4.5', '4.57', '5.0'], answer: '4.6' },
      { prompt: 'What is 15% of 60?', choices: ['9', '6', '15', '12'], answer: '9' },
      { prompt: 'Simplify: 24 ÷ 6 × 2', choices: ['8', '2', '4', '72'], answer: '8' },
      { prompt: 'What is the value of x in: x + 7 = 15?', choices: ['8', '22', '7', '9'], answer: '8' },
    ],
    spelling: [
      { prompt: 'Which is spelled correctly?', choices: ['Necessary', 'Neccessary', 'Necessery', 'Neccesary'], answer: 'Necessary' },
      { prompt: 'Which is spelled correctly?', choices: ['Seperate', 'Separate', 'Separrate', 'Seperete'], answer: 'Separate' },
      { prompt: 'Which is spelled correctly?', choices: ['Definately', 'Definitely', 'Definitly', 'Deffinitely'], answer: 'Definitely' },
      { prompt: 'Which is spelled correctly?', choices: ['Goverment', 'Government', 'Governmant', 'Govermment'], answer: 'Government' },
      { prompt: 'Which is spelled correctly?', choices: ['Immediatly', 'Immeadiately', 'Immediately', 'Imediately'], answer: 'Immediately' },
      { prompt: 'Which is spelled correctly?', choices: ['Particulary', 'Particularly', 'Particullarly', 'Perticularly'], answer: 'Particularly' },
      { prompt: 'Which is spelled correctly?', choices: ['Vegtable', 'Vegetable', 'Vegatable', 'Vegetible'], answer: 'Vegetable' },
      { prompt: 'Which is spelled correctly?', choices: ['Beatiful', 'Beautiful', 'Beutiful', 'Beautifull'], answer: 'Beautiful' },
    ],
  },
  7: {
    math: [
      { prompt: 'Solve for x: 3x - 4 = 11', choices: ['5', '3', '7', '15'], answer: '5' },
      { prompt: "A shirt costs $40. It's on sale for 25% off. What's the sale price?", choices: ['$30', '$35', '$25', '$32'], answer: '$30' },
      { prompt: 'What is -6 × -7?', choices: ['42', '-42', '-13', '13'], answer: '42' },
      { prompt: 'If 3 workers build a fence in 12 hours, how many hours would 6 workers take at the same rate?', choices: ['6', '24', '18', '12'], answer: '6' },
      { prompt: 'A number cube (1-6) is rolled once. What is the probability of rolling an even number?', choices: ['1/2', '1/3', '2/3', '1/6'], answer: '1/2' },
      { prompt: 'Simplify: -12 ÷ 4 + 3', choices: ['0', '-3', '3', '-6'], answer: '0' },
      { prompt: 'What is 8²?', choices: ['64', '16', '32', '128'], answer: '64' },
      { prompt: 'Convert 3/5 to a percent.', choices: ['60%', '35%', '53%', '65%'], answer: '60%' },
    ],
    spelling: [
      { prompt: 'Which is spelled correctly?', choices: ['Concience', 'Conscience', 'Consciense', 'Conscence'], answer: 'Conscience' },
      { prompt: 'Which is spelled correctly?', choices: ['Aquaintance', 'Acquaintance', 'Acquaintence', 'Aquaintence'], answer: 'Acquaintance' },
      { prompt: 'Which is spelled correctly?', choices: ['Embarrass', 'Embarass', 'Emmbarrass', 'Embarras'], answer: 'Embarrass' },
      { prompt: 'Which is spelled correctly?', choices: ['Questionaire', 'Questionnaire', 'Questionnair', 'Questionaires'], answer: 'Questionnaire' },
      { prompt: 'Which is spelled correctly?', choices: ['Maintenance', 'Maintainance', 'Maintenence', 'Maintanance'], answer: 'Maintenance' },
      { prompt: 'Which is spelled correctly?', choices: ['Priviledge', 'Privilege', 'Privelege', 'Privilage'], answer: 'Privilege' },
      { prompt: 'Which is spelled correctly?', choices: ['Rhythem', 'Rhythm', 'Rythm', 'Rhythim'], answer: 'Rhythm' },
      { prompt: 'Which is spelled correctly?', choices: ['Occurance', 'Occurrence', 'Occurrance', 'Ocurrence'], answer: 'Occurrence' },
    ],
  },
  8: {
    math: [
      { prompt: 'Solve: 2(x + 3) = 16', choices: ['5', '8', '7', '11'], answer: '5' },
      { prompt: 'What is √81?', choices: ['9', '8', '81', '40.5'], answer: '9' },
      { prompt: 'A right triangle has legs 6 and 8. What is the length of the hypotenuse?', choices: ['10', '14', '48', '7'], answer: '10' },
      { prompt: 'What is the slope of the line through (2,3) and (4,9)?', choices: ['3', '2', '6', '1/3'], answer: '3' },
      { prompt: 'Simplify: 5³', choices: ['125', '15', '25', '8'], answer: '125' },
      { prompt: 'Write 0.00042 in scientific notation.', choices: ['4.2 × 10⁻⁴', '42 × 10⁻⁵', '4.2 × 10⁴', '0.42 × 10⁻³'], answer: '4.2 × 10⁻⁴' },
      { prompt: 'Solve the system: x + y = 10, x - y = 2. What is x?', choices: ['6', '4', '8', '5'], answer: '6' },
      { prompt: 'What is -3²?', choices: ['-9', '9', '-6', '6'], answer: '-9' },
    ],
    spelling: [
      { prompt: 'Which is spelled correctly?', choices: ['Bureaucracy', 'Beurocracy', 'Bureaucrasy', 'Beaurocracy'], answer: 'Bureaucracy' },
      { prompt: 'Which is spelled correctly?', choices: ['Camoflage', 'Camouflage', 'Camouflague', 'Cammouflage'], answer: 'Camouflage' },
      { prompt: 'Which is spelled correctly?', choices: ['Entreprenur', 'Entrepreneur', 'Entrepeneur', 'Entreprenuer'], answer: 'Entrepreneur' },
      { prompt: 'Which is spelled correctly?', choices: ['Hierarchy', 'Heirarchy', 'Hierarcy', 'Heirarchie'], answer: 'Hierarchy' },
      { prompt: 'Which is spelled correctly?', choices: ['Millenium', 'Millennium', 'Milennium', 'Millennnium'], answer: 'Millennium' },
      { prompt: 'Which is spelled correctly?', choices: ['Surveillance', 'Surveilance', 'Survaillance', 'Surveillence'], answer: 'Surveillance' },
      { prompt: 'Which is spelled correctly?', choices: ['Unnecesary', 'Unnecessary', 'Unecessary', 'Unnecessarry'], answer: 'Unnecessary' },
      { prompt: 'Which is spelled correctly?', choices: ['Liesure', 'Leisure', 'Leasure', 'Leisurre'], answer: 'Leisure' },
    ],
  },
  9: {
    math: [
      { prompt: 'Factor: x² - 9', choices: ['(x-3)(x+3)', '(x-9)(x+1)', '(x-3)²', 'x(x-9)'], answer: '(x-3)(x+3)' },
      { prompt: 'Solve: x² = 49', choices: ['x = ±7', 'x = 7', 'x = 24.5', 'x = ±24.5'], answer: 'x = ±7' },
      { prompt: 'Solve the inequality: 3x - 5 > 10', choices: ['x > 5', 'x > 5/3', 'x < 5', 'x > 15'], answer: 'x > 5' },
      { prompt: 'If f(x) = 2x + 1, what is f(4)?', choices: ['9', '8', '5', '7'], answer: '9' },
      { prompt: 'What is the y-intercept of y = -3x + 7?', choices: ['7', '-3', '0', '3'], answer: '7' },
      { prompt: 'Simplify: (x³)(x⁵)', choices: ['x⁸', 'x¹⁵', 'x²', '2x⁸'], answer: 'x⁸' },
      { prompt: 'Solve: x/3 + 4 = 10', choices: ['18', '6', '42', '2'], answer: '18' },
      { prompt: 'What is the discriminant of x² + 4x + 4 = 0? (b² - 4ac)', choices: ['0', '16', '4', '-16'], answer: '0' },
    ],
    spelling: [
      { prompt: 'Which is spelled correctly?', choices: ['Conscientious', 'Consciencious', 'Consciensious', 'Conscientous'], answer: 'Conscientious' },
      { prompt: 'Which is spelled correctly?', choices: ['Miscellaneous', 'Miscellanous', 'Miscelaneous', 'Miscellaneus'], answer: 'Miscellaneous' },
      { prompt: 'Which is spelled correctly?', choices: ['Prerogative', 'Perogative', 'Prerogitive', 'Prerrogative'], answer: 'Prerogative' },
      { prompt: 'Which is spelled correctly?', choices: ['Renaissance', 'Renaisance', 'Rennaissance', 'Reneissance'], answer: 'Renaissance' },
      { prompt: 'Which is spelled correctly?', choices: ['Vacillate', 'Vaccilate', 'Vascillate', 'Vacilate'], answer: 'Vacillate' },
      { prompt: 'Which is spelled correctly?', choices: ['Acquiesce', 'Aquiesce', 'Acquiece', 'Acquiesse'], answer: 'Acquiesce' },
      { prompt: 'Which is spelled correctly?', choices: ['Bourgeois', 'Bourgeoise', 'Burgeois', 'Bourgois'], answer: 'Bourgeois' },
      { prompt: 'Which is spelled correctly?', choices: ['Idiosyncrasy', 'Idiosyncracy', 'Idiosyncracyy', 'Idiosyncrassy'], answer: 'Idiosyncrasy' },
    ],
  },
};

export default BANK;
