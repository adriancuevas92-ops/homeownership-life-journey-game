import GameState from '../systems/GameState.js';
import NARRATIVES from '../data/demographicNarratives.js';

// "And here's what else is true" — the narrative half of the
// demographic-attribute system, right after SpecialCircumstanceScene
// reveals documentation status. Two beats always show (race, setting);
// the disability beat only shows if GameState.hasDisability rolled true
// — "randomly attributed... or not at all" extends to whether it gets
// narrated at all, not just whether it happened.
class DemographicContextScene extends Phaser.Scene {
  constructor() {
    super('DemographicContext');
  }

  create() {
    this.beats = this._resolveBeats();
    this.index = -1;
    this._buildStaticUI();
    this.input.on('pointerdown', () => this._advance());
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this._advance());
    this._advance();
  }

  _resolveBeats() {
    const raceBeat = NARRATIVES.RACE_BEATS[GameState.race];
    const settingBeat = NARRATIVES.SETTING_BEATS[GameState.isRural ? 'rural' : 'urban'];
    const beats = [
      { text: raceBeat.text, source: NARRATIVES.RACE_SOURCE },
      { text: settingBeat.text, source: settingBeat.source },
    ];
    if (GameState.hasDisability) {
      beats.push({ text: NARRATIVES.DISABILITY_BEAT.text, source: NARRATIVES.DISABILITY_BEAT.source });
    }
    return beats;
  }

  _buildStaticUI() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f);

    this.titleText = this.add.text(width / 2, height * 0.28, 'AND HERE’S WHAT ELSE IS TRUE', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#e8b23a', letterSpacing: 2,
    }).setOrigin(0.5);

    this.bodyText = this.add.text(width / 2, height * 0.42, '', {
      fontFamily: 'Georgia, serif', fontSize: '17px', color: '#e8e4d8', align: 'center',
      wordWrap: { width: 560 }, lineSpacing: 10,
    }).setOrigin(0.5, 0);

    this.sourceText = this.add.text(width / 2, height - 70, '', {
      fontFamily: 'Georgia, serif', fontSize: '11px', color: '#555555',
    }).setOrigin(0.5);

    this.hintText = this.add.text(width / 2, height - 40, 'press SPACE or click to continue', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#777777',
    }).setOrigin(0.5);

    this.backButton = this.add.text(20, height - 16, '‹ back', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true });
    this.backButton.on('pointerdown', (pointer, x, y, event) => {
      event.stopPropagation();
      this.scene.start('SpecialCircumstance');
    });
  }

  _advance() {
    this.index += 1;
    const beat = this.beats[this.index];
    if (!beat) {
      this.scene.start('Synopsis');
      return;
    }
    this.bodyText.setText(beat.text);
    this.sourceText.setText(beat.source || '');
  }
}

export default DemographicContextScene;
