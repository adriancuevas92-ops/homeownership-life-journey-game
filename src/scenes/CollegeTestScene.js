import GameState from '../systems/GameState.js';
import CollegeTest from '../systems/CollegeTest.js';
import BANK from '../data/collegeTestBank.js';

// The Level 2 college-path gate — see CollegeTest.js for why the pass
// bar (not the content) is what scales with the character's profile, and
// why it drops one question per failed attempt. Question-by-question UI
// and scoring loop only; the actual threshold/bank logic lives in the
// systems layer, same split SchoolTestScene uses.
class CollegeTestScene extends Phaser.Scene {
  constructor() {
    super('CollegeTest');
  }

  create() {
    this.attemptNumber = 1;
    this._startTest();
  }

  _startTest() {
    this.threshold = CollegeTest.computeThresholdForAttempt(GameState, this.attemptNumber);
    this.test = CollegeTest.buildTest(BANK);
    this.currentIndex = 0;
    this.answers = [];
    this._renderQuestion();
  }

  _clearScreen() {
    this.children.removeAll();
  }

  _renderQuestion() {
    this._clearScreen();
    const { width, height } = this.scale;
    const question = this.test.questions[this.currentIndex];

    this.add.rectangle(width / 2, height / 2, width, height, 0xf4ecd8);

    this.add.text(width / 2, 40, 'FRESNO CITY COLLEGE — QUALIFYING EXAM', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#888888', letterSpacing: 1,
    }).setOrigin(0.5);

    this.add.text(
      width / 2, 68,
      `Attempt ${this.attemptNumber} — need ${this.threshold} of ${CollegeTest.QUESTION_COUNT} to pass`,
      { fontFamily: 'Georgia, serif', fontSize: '13px', color: '#777777' },
    ).setOrigin(0.5);

    this.add.text(width / 2, 100, `Question ${this.currentIndex + 1} of ${CollegeTest.QUESTION_COUNT}  —  ${question.subject}`, {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#555555',
    }).setOrigin(0.5);

    this.add.text(width / 2, 180, question.prompt, {
      fontFamily: 'Georgia, serif',
      fontSize: '21px',
      color: '#1a1a1a',
      align: 'center',
      wordWrap: { width: 620 },
    }).setOrigin(0.5);

    const startY = 290;
    const spacing = 65;
    question.choices.forEach((choice, i) => {
      this._makeButton(width / 2, startY + i * spacing, choice, () => this._selectAnswer(choice));
    });

    this.backButton = this.add.text(20, height - 16, '‹ back', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true });
    this.backButton.on('pointerdown', (pointer, x, y, event) => {
      event.stopPropagation();
      this.scene.start('CollegeStats');
    });
  }

  _makeButton(x, y, label, onClick) {
    const box = this.add.rectangle(x, y, 520, 50, 0xf4ecd8).setStrokeStyle(3, 0x1a1a1a).setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, { fontFamily: 'Georgia, serif', fontSize: '17px', color: '#1a1a1a' }).setOrigin(0.5);
    box.on('pointerdown', onClick);
    return { box, text };
  }

  _selectAnswer(choice) {
    this.answers.push(choice);
    this.currentIndex += 1;
    if (this.currentIndex >= this.test.questions.length) {
      this._showResults();
    } else {
      this._renderQuestion();
    }
  }

  _showResults() {
    this._clearScreen();
    const { width, height } = this.scale;
    const result = CollegeTest.scoreTest(this.test, this.answers, this.threshold);

    this.add.rectangle(width / 2, height / 2, width, height, 0xf4ecd8);

    this.add.text(width / 2, height * 0.22, result.passed ? 'YOU PASSED' : "YOU DIDN'T PASS THIS TIME", {
      fontFamily: 'Georgia, serif',
      fontSize: '30px',
      color: result.passed ? '#3b6d11' : '#a32d2d',
    }).setOrigin(0.5);

    this.add.text(
      width / 2, height * 0.22 + 50,
      `${result.correctCount} of ${CollegeTest.QUESTION_COUNT} correct  —  ${result.threshold} needed to pass`,
      { fontFamily: 'Georgia, serif', fontSize: '16px', color: '#444444' },
    ).setOrigin(0.5);

    if (result.passed) {
      GameState.annualIncome = Math.round(GameState.annualIncome * CollegeTest.BACHELORS_WAGE_MULTIPLIER);
      this.add.text(
        width / 2, height * 0.36,
        `A bachelor's degree earns a median $1,533/wk versus $946/wk with a diploma alone — that premium is now baked into your income: $${GameState.annualIncome.toLocaleString()}/yr.`,
        { fontFamily: 'Georgia, serif', fontSize: '14px', color: '#666666', align: 'center', wordWrap: { width: 560 } },
      ).setOrigin(0.5, 0);
      this._makeButton(width / 2, height * 0.62, 'Continue', () => this.scene.start('KitchenTable2008'));
    } else {
      const nextThreshold = CollegeTest.computeThresholdForAttempt(GameState, this.attemptNumber + 1);
      this.add.text(
        width / 2, height * 0.36,
        `Next attempt, you'll only need ${nextThreshold} of ${CollegeTest.QUESTION_COUNT} — persistence counts here too.`,
        { fontFamily: 'Georgia, serif', fontSize: '14px', color: '#666666', align: 'center', wordWrap: { width: 500 } },
      ).setOrigin(0.5, 0);
      this._makeButton(width / 2, height * 0.58, 'Try Again', () => {
        this.attemptNumber += 1;
        this._startTest();
      });
    }

    this.backButton = this.add.text(20, height - 16, '‹ back', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true });
    this.backButton.on('pointerdown', (pointer, x, y, event) => {
      event.stopPropagation();
      this.scene.start('CollegeStats');
    });
  }
}

export default CollegeTestScene;
