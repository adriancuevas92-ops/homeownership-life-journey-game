// Text only, same convention as SpecialCircumstanceScene/
// KitchenTablePreEndingScene — a title card the player sits with. First
// of the two Level 1 -> Level 2 transition beats: right after passing
// the graduation test, before anything about adulthood or the three life
// paths, land what a diploma alone is actually worth in the numbers this
// game already scores.
// Found live during a narrative audit (2026-09-21): this line used to
// read "adds another 10 points on top of a dropout's odds — 3 more on
// top of a diploma alone," which states two different bachelor's-degree
// rates from the same sentence (23.0+10=33.0 vs. 32.3+3=35.3, a 2.3-
// point contradiction visible to anyone who does the arithmetic).
// DropoutDisadvantageScene's mirror of this same fact never had the
// problem — it only ever compares bachelor's-to-dropout, never chains a
// second delta through diploma-alone — so this is rewritten to match
// that same non-contradictory structure instead of inventing a new one.
const STATS_TEXT = [
  'Householders with a high school diploma: 32.3% own their home. Without one: 23.0%.',
  "A bachelor's degree adds another 10 points on top of a dropout's odds. The diploma you just earned already accounts for about 9 of those — the rest is still ahead of you.",
  "None of the choices ahead undo the disadvantages already stacked against you. They just set how steep the next climb is.",
].join('\n\n');

class GraduateAdvantageScene extends Phaser.Scene {
  constructor() {
    super('GraduateAdvantage');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f);

    this.add.text(width / 2, height * 0.18, 'WHAT A DIPLOMA IS WORTH', {
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
      this.scene.start('FresnoHigh');
    });

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this._continue());
    this.input.on('pointerdown', () => this._continue());
  }

  _continue() {
    this.scene.start('AdulthoodWorld1');
  }
}

export default GraduateAdvantageScene;
