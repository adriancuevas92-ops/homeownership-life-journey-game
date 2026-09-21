// Dropout-path mirror of GraduateAdvantageScene — same beat (the numbers,
// before anything about adulthood or the three life paths), same source
// dataset, framed for someone leaving without a diploma rather than with
// one. From here the path rejoins the graduate route: same adulthood
// world-setup style (AdulthoodWorld1Dropout), same overworld map, same
// college/workforce doors — only the military door and the difficulty
// curve (PackingHouse.computeBeltSpeed) differ from here on.
const STATS_TEXT = [
  'Householders with a high school diploma: 32.3% own their home. Without one: 23.0%. That gap is the one you just chose to carry.',
  "A bachelor's degree adds another 10 points on top of a dropout's odds — a diploma alone would already have put you about 9 points ahead of where you're starting.",
  "None of the choices ahead undo the disadvantage already stacked against you. They just set how steep the next climb is — and this one starts steeper.",
].join('\n\n');

class DropoutDisadvantageScene extends Phaser.Scene {
  constructor() {
    super('DropoutDisadvantage');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f);

    this.add.text(width / 2, height * 0.18, 'WHAT LEAVING SCHOOL COSTS', {
      fontFamily: 'Georgia, serif',
      fontSize: '24px',
      color: '#e8b23a',
      letterSpacing: 2,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.3, STATS_TEXT, {
      fontFamily: 'Georgia, serif',
      fontSize: '17px',
      color: '#e8e4d8',
      align: 'center',
      wordWrap: { width: 560 },
      lineSpacing: 10,
    }).setOrigin(0.5, 0);

    this.add.text(
      width / 2, height - 70,
      '[V] U.S. Census Bureau, young householders by education, 2019',
      { fontFamily: 'Georgia, serif', fontSize: '11px', color: '#555555' },
    ).setOrigin(0.5);

    this.add.text(width / 2, height - 40, 'press SPACE or click to continue', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#777777',
    }).setOrigin(0.5);

    this.backButton = this.add.text(20, height - 16, '‹ back', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true });
    this.backButton.on('pointerdown', (pointer, x, y, event) => {
      event.stopPropagation();
      this.scene.start('SchoolTest');
    });

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this._continue());
    this.input.on('pointerdown', () => this._continue());
  }

  _continue() {
    this.scene.start('AdulthoodWorld1Dropout');
  }
}

export default DropoutDisadvantageScene;
