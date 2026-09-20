import GameState from '../systems/GameState.js';
import SchoolTest from '../systems/SchoolTest.js';
import BANK from '../data/schoolTestBank.js';

// The Level 1 -> Level 2 gate: the graduate path through Fresno High.
// Grade level and pass threshold come from SchoolTest.js (baseline 6th,
// up to 9th via the Structural Drag signals; pass at >= 7 of 10 correct
// — both locked this session). This scene is purely the question-by-
// question UI and scoring loop; the actual grade-level/bank logic lives
// in the systems layer so it stays testable without a running Scene.
const QUESTION_COUNT = SchoolTest.QUESTION_COUNT_PER_SUBJECT * 2;

class SchoolTestScene extends Phaser.Scene {
  constructor() {
    super('SchoolTest');
  }

  create() {
    this._startTest();
  }

  _startTest() {
    this.test = SchoolTest.buildTest(GameState, BANK);
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

    this.add.text(width / 2, 50, 'FRESNO HIGH SCHOOL — GRADUATION TEST', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#888888', letterSpacing: 1,
    }).setOrigin(0.5);

    this.add.text(width / 2, 90, `Question ${this.currentIndex + 1} of ${QUESTION_COUNT}  —  ${question.subject === 'math' ? 'Math' : 'Spelling'}`, {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#555555',
    }).setOrigin(0.5);

    this.add.text(width / 2, 170, question.prompt, {
      fontFamily: 'Georgia, serif',
      fontSize: '22px',
      color: '#1a1a1a',
      align: 'center',
      wordWrap: { width: 600 },
    }).setOrigin(0.5);

    const startY = 280;
    const spacing = 65;
    question.choices.forEach((choice, i) => {
      this._makeButton(width / 2, startY + i * spacing, choice, () => this._selectAnswer(choice));
    });

    this.backButton = this.add.text(20, height - 16, '‹ back', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true });
    this.backButton.on('pointerdown', (pointer, x, y, event) => {
      event.stopPropagation();
      this.scene.start('FresnoHigh');
    });

    // Nobody should have to grind through questions they don't want to
    // answer just to reach the dropout option — it's available from
    // question 1, not only after a failed attempt.
    this.dropOutLink = this.add.text(width - 20, height - 16, 'Drop out instead ›', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
    }).setOrigin(1, 1).setInteractive({ useHandCursor: true });
    this.dropOutLink.on('pointerdown', (pointer, x, y, event) => {
      event.stopPropagation();
      this._dropOut();
    });
  }

  _dropOut() {
    GameState.isHighSchoolGraduate = false;
    this.scene.start('DropoutDisadvantage');
  }

  _makeButton(x, y, label, onClick) {
    const box = this.add.rectangle(x, y, 480, 50, 0xf4ecd8).setStrokeStyle(3, 0x1a1a1a).setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, { fontFamily: 'Georgia, serif', fontSize: '18px', color: '#1a1a1a' }).setOrigin(0.5);
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
    const result = SchoolTest.scoreTest(this.test, this.answers);

    this.add.rectangle(width / 2, height / 2, width, height, 0xf4ecd8);

    this.add.text(width / 2, height * 0.25, result.passed ? 'YOU PASSED' : "YOU DIDN'T PASS THIS TIME", {
      fontFamily: 'Georgia, serif',
      fontSize: '30px',
      color: result.passed ? '#3b6d11' : '#a32d2d',
    }).setOrigin(0.5);

    this.add.text(
      width / 2, height * 0.25 + 50,
      `${result.correctCount} of ${QUESTION_COUNT} correct  —  ${SchoolTest.PASS_THRESHOLD} needed to pass`,
      { fontFamily: 'Georgia, serif', fontSize: '16px', color: '#444444' },
    ).setOrigin(0.5);

    if (result.passed) {
      this._makeButton(width / 2, height * 0.55, 'Continue', () => this.scene.start('GraduateAdvantage'));
    } else {
      this.add.text(
        width / 2, height * 0.42,
        'Every failed attempt, you can try again or take the dropout route instead.',
        { fontFamily: 'Georgia, serif', fontSize: '14px', color: '#666666', align: 'center', wordWrap: { width: 500 } },
      ).setOrigin(0.5);
      this._makeButton(width / 2, height * 0.58, 'Try Again', () => this._startTest());
      this._makeButton(width / 2, height * 0.7, 'Drop Out Instead', () => this._dropOut());
    }

    this.backButton = this.add.text(20, height - 16, '‹ back', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true });
    this.backButton.on('pointerdown', (pointer, x, y, event) => {
      event.stopPropagation();
      this.scene.start('FresnoHigh');
    });
  }
}

export default SchoolTestScene;
