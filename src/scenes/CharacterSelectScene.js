import GameState from '../systems/GameState.js';
import CHARACTERS from '../data/characters/index.js';
import Demographics from '../systems/Demographics.js';

// Fully data-driven: one button per entry in the active archetype's
// `genders` object, built in a loop rather than hardcoded per-option
// calls. A second gender option on any archetype (or a second archetype
// entirely, once main.js supports selecting between them — see
// src/data/characters/index.js's roadmap note) needs no change here.
class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelect');
  }

  create() {
    const { width, height } = this.scale;
    this.archetype = CHARACTERS[GameState.archetypeId];

    this.add.rectangle(width / 2, height / 2, width, height, 0xf4ecd8);

    this.add.text(width / 2, height * 0.3, this.archetype.selectPrompt, {
      fontFamily: 'Georgia, serif',
      fontSize: '32px',
      color: '#1a1a1a',
    }).setOrigin(0.5);

    const genderKeys = Object.keys(this.archetype.genders);
    const startY = height * 0.5;
    const spacing = 75;
    genderKeys.forEach((key, i) => {
      const gender = this.archetype.genders[key];
      this._makeButton(width / 2, startY + i * spacing, gender.label, () => this._select(key, gender.annualIncome));
    });
  }

  _makeButton(x, y, label, onClick) {
    const box = this.add.rectangle(x, y, 220, 60, 0xf4ecd8).setStrokeStyle(3, 0x1a1a1a).setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, { fontFamily: 'Georgia, serif', fontSize: '22px', color: '#1a1a1a' }).setOrigin(0.5);
    box.on('pointerdown', onClick);
    return { box, text };
  }

  _select(character, annualIncome) {
    const archetypeId = GameState.archetypeId;
    GameState.reset();
    GameState.archetypeId = archetypeId;
    GameState.character = character;
    GameState.annualIncome = annualIncome;
    // Race, disability, and rurality roll here, independent of the
    // archetype/gender pick above — see Demographics.js for why race
    // ='latino' reproduces this archetype's existing tested income
    // exactly, and every other combination is real BLS/Census-sourced.
    Demographics.rollAndApply(GameState);
    this.scene.start('Baseline1');
  }
}

export default CharacterSelectScene;
