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
// Per-archetype back/continue routing — the intro-conversation scene to
// return to, and the circumstance-origin scene (if any) to continue
// into. latino-1986 has no circumstance-origin scene (no equivalent
// exists for it), so its CONTINUE_SCENE_BY_ARCHETYPE entry is simply
// absent and falls through to the DemographicContext default below.
const BACK_SCENE_BY_ARCHETYPE = {
  'black-1986': 'IntroConversationBlack',
  'white-1986': 'IntroConversationWhite',
  'asian-1986': 'IntroConversationAsian',
};
const CONTINUE_SCENE_BY_ARCHETYPE = {
  'black-1986': 'CircumstanceOriginBlack',
  'white-1986': 'CircumstanceOriginWhite',
  'asian-1986': 'CircumstanceOriginAsian',
};

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
      this.scene.start(BACK_SCENE_BY_ARCHETYPE[GameState.archetypeId] || 'IntroConversation');
    });

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this._continue());
    this.input.on('pointerdown', () => this._continue());
  }

  _continue() {
    // Archetypes with their own "how it happened" beat right after this
    // one route there; latino-1986 has no equivalent circumstance-origin
    // scene, so it goes straight to DemographicContext same as before
    // any archetype had one.
    this.scene.start(CONTINUE_SCENE_BY_ARCHETYPE[GameState.archetypeId] || 'DemographicContext');
  }
}

export default SpecialCircumstanceScene;
