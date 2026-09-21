import GameState from '../systems/GameState.js';
import NARRATIVES from '../data/demographicNarratives.js';

// "And here's what else is true" — the narrative half of the
// demographic-attribute system, right after SpecialCircumstanceScene
// reveals documentation status. Race and setting always show their full
// 3-beat bank; the disability bank only shows if GameState.hasDisability
// rolled true — "randomly attributed... or not at all" extends to
// whether it gets narrated at all, not just whether it happened.
//
// Same category-label/progress-counter treatment as PathConsequenceScene
// — deliberately, per direction: these conditions should carry the same
// narrative weight PathConsequenceScene gives the military/college/
// workforce paths, not a lighter single-line version of it. The title
// stays this scene's own ("AND HERE'S WHAT ELSE IS TRUE" — the primary
// circumstance stays primary, this is additive to it); only the per-beat
// category/axis labeling is shared with PathConsequenceScene.
const CATEGORY_LABELS = {
  statistic: 'WHAT YOUR NUMBERS SAY',
  uncertainty: 'BUT NOTHING HERE IS 100%',
  qualitative: "WHAT THE NUMBERS DON'T SHOW",
};

const AXIS_LABELS = { race: 'RACE', setting: 'SETTING', disability: 'DISABILITY' };

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
    const resolve = (bank, axis) => bank.map((beat) => ({
      ...beat,
      axis,
      resolvedText: typeof beat.text === 'function' ? beat.text(GameState) : beat.text,
    }));
    const beats = [
      ...resolve(NARRATIVES.RACE_BEATS[GameState.race], 'race'),
      ...resolve(NARRATIVES.SETTING_BEATS[GameState.isRural ? 'rural' : 'urban'], 'setting'),
    ];
    if (GameState.hasDisability) {
      beats.push(...resolve(NARRATIVES.DISABILITY_BEATS, 'disability'));
    }
    return beats;
  }

  _buildStaticUI() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f);

    this.titleText = this.add.text(width / 2, height * 0.16, 'AND HERE’S WHAT ELSE IS TRUE', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#e8b23a', letterSpacing: 2,
    }).setOrigin(0.5);

    this.categoryText = this.add.text(width / 2, height * 0.24, '', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#b08a3e', letterSpacing: 1,
    }).setOrigin(0.5);

    this.bodyText = this.add.text(width / 2, height * 0.34, '', {
      fontFamily: 'Georgia, serif', fontSize: '17px', color: '#e8e4d8', align: 'center',
      wordWrap: { width: 560 }, lineSpacing: 10,
    }).setOrigin(0.5, 0);

    this.sourceText = this.add.text(width / 2, height - 70, '', {
      fontFamily: 'Georgia, serif', fontSize: '11px', color: '#555555', align: 'center', wordWrap: { width: 560 },
    }).setOrigin(0.5);

    this.progressText = this.add.text(width / 2, height - 90, '', {
      fontFamily: 'Georgia, serif', fontSize: '11px', color: '#444444',
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
    const axisLabel = AXIS_LABELS[beat.axis] || '';
    const categoryLabel = CATEGORY_LABELS[beat.category] || '';
    this.categoryText.setText([axisLabel, categoryLabel].filter(Boolean).join(' — '));
    this.bodyText.setText(beat.resolvedText);
    this.sourceText.setText(beat.source || '');
    this.progressText.setText(`${this.index + 1} / ${this.beats.length}`);
  }
}

export default DemographicContextScene;
