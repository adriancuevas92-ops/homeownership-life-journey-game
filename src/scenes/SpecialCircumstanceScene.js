import GameState from '../systems/GameState.js';
import CHARACTERS from '../data/characters/index.js';

// Text only, no illustration — a deliberate title-card beat the player
// should sit with and dismiss themselves, not autoplay through. The copy
// now comes from the active archetype's registry entry
// (specialCircumstanceText) rather than a local constant, so a second
// archetype's own circumstance is a data change, not a scene edit. Per
// direction: the female wage-gap compounding is NOT called out here —
// it's baked into the mechanics (CharacterSelectScene's income split,
// the Ending's affordability table) rather than stated on its own screen.
class SpecialCircumstanceScene extends Phaser.Scene {
  constructor() {
    super('SpecialCircumstance');
  }

  create() {
    const { width, height } = this.scale;
    const archetype = CHARACTERS[GameState.archetypeId];

    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f);

    this.add.text(width / 2, height * 0.32, 'A SPECIAL CIRCUMSTANCE', {
      fontFamily: 'Georgia, serif',
      fontSize: '24px',
      color: '#e8b23a',
      letterSpacing: 2,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.5, archetype.specialCircumstanceText, {
      fontFamily: 'Georgia, serif',
      fontSize: '17px',
      color: '#e8e4d8',
      align: 'center',
      wordWrap: { width: 560 },
      lineSpacing: 10,
    }).setOrigin(0.5, 0.5);

    this.add.text(width / 2, height - 40, 'press SPACE or click to continue', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#777777',
    }).setOrigin(0.5);

    this.backButton = this.add.text(20, height - 16, '‹ back', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true });
    this.backButton.on('pointerdown', (pointer, x, y, event) => {
      event.stopPropagation();
      this.scene.start('IntroConversation');
    });

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this._continue());
    this.input.on('pointerdown', () => this._continue());
  }

  _continue() {
    this.scene.start('DemographicContext');
  }
}

export default SpecialCircumstanceScene;
