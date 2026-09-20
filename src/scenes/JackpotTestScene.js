import GameState from '../systems/GameState.js';
import JackpotTest from '../systems/JackpotTest.js';
import BANK from '../data/jackpotTestBank.js';

// The workforce jackpot — one attempt, ever, real 7/10, no retry button.
// Reached from the business advancement page (CareerAdvancementScene),
// not its own hotspot. See JackpotTest.js for why the content is hard by
// design rather than the bar being movable.
class JackpotTestScene extends Phaser.Scene {
  constructor() {
    super('JackpotTest');
  }

  create() {
    this.test = JackpotTest.buildTest(GameState, BANK);
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

    this.add.text(width / 2, 40, 'THE JACKPOT — ONE SHOT', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#888888', letterSpacing: 1,
    }).setOrigin(0.5);
    this.add.text(width / 2, 68, `Question ${this.currentIndex + 1} of ${JackpotTest.QUESTION_COUNT} — need ${JackpotTest.PASS_THRESHOLD} of ${JackpotTest.QUESTION_COUNT} to pass — no retry`, {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#a32d2d',
    }).setOrigin(0.5);

    this.add.text(width / 2, 170, question.prompt, {
      fontFamily: 'Georgia, serif',
      fontSize: '20px',
      color: '#1a1a1a',
      align: 'center',
      wordWrap: { width: 620 },
    }).setOrigin(0.5);

    const startY = 280;
    const spacing = 65;
    question.choices.forEach((choice, i) => {
      this._makeButton(width / 2, startY + i * spacing, choice, () => this._selectAnswer(choice));
    });
  }

  _makeButton(x, y, label, onClick) {
    const box = this.add.rectangle(x, y, 560, 50, 0xf4ecd8).setStrokeStyle(3, 0x1a1a1a).setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, { fontFamily: 'Georgia, serif', fontSize: '16px', color: '#1a1a1a' }).setOrigin(0.5);
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
    const result = JackpotTest.scoreTest(this.test, this.answers);
    GameState.hasAttemptedJackpotTest = true;

    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f);

    if (result.passed) {
      const before = GameState.annualIncome;
      GameState.annualIncome = Math.round(GameState.annualIncome * JackpotTest.JACKPOT_INCOME_MULTIPLIER);
      this.add.text(width / 2, height * 0.25, 'YOU HIT IT', {
        fontFamily: 'Georgia, serif', fontSize: '32px', color: '#e8b23a', letterSpacing: 2,
      }).setOrigin(0.5);
      this.add.text(
        width / 2, height * 0.4,
        `${result.correctCount} of ${JackpotTest.QUESTION_COUNT} correct. Income: $${before.toLocaleString()}/yr → $${GameState.annualIncome.toLocaleString()}/yr.\n\nThis is the outlier case, not the expected one — real, and rare.`,
        { fontFamily: 'Georgia, serif', fontSize: '16px', color: '#e8e4d8', align: 'center', wordWrap: { width: 560 }, lineSpacing: 10 },
      ).setOrigin(0.5, 0);
    } else {
      this.add.text(width / 2, height * 0.25, "DIDN'T HIT IT", {
        fontFamily: 'Georgia, serif', fontSize: '32px', color: '#a32d2d', letterSpacing: 2,
      }).setOrigin(0.5);
      this.add.text(
        width / 2, height * 0.4,
        `${result.correctCount} of ${JackpotTest.QUESTION_COUNT} correct — ${JackpotTest.PASS_THRESHOLD} needed. One shot, and this was it. No change, no cost.`,
        { fontFamily: 'Georgia, serif', fontSize: '16px', color: '#e8e4d8', align: 'center', wordWrap: { width: 560 }, lineSpacing: 10 },
      ).setOrigin(0.5, 0);
    }

    const box = this.add.rectangle(width / 2, height * 0.65, 300, 44, 0xf4ecd8).setStrokeStyle(3, 0xe8b23a).setInteractive({ useHandCursor: true });
    const text = this.add.text(width / 2, height * 0.65, 'Check in at the realtor’s office ›', { fontFamily: 'Georgia, serif', fontSize: '15px', color: '#1a1a1a' }).setOrigin(0.5);
    box.on('pointerdown', () => this.scene.start('KitchenTablePreEnding'));
  }
}

export default JackpotTestScene;
