import GameState from '../systems/GameState.js';
import CONSEQUENCES from '../data/pathConsequences.js';

// The mechanized version of what ComingOfAge/KitchenTable2008/DACA used
// to do only for the college path: a real reflection beat between the
// Level 2 minigame and WorkingYears, for every path, not just one. Fully
// generic — reads GameState.pathTaken (set at each path's stats page,
// see pathStats.js's onContinue) to pick a content bank, and has no
// path-specific logic of its own. Adding a fourth path later is a bank
// entry in pathConsequences.js plus one line setting pathTaken at that
// path's decision point; this file doesn't change.
//
// Text-card convention (GraduateAdvantageScene/PathStatsScene), not
// CaptionBox's comic-panel dialogue — this is reference material the
// player is meant to actually read, same reasoning PathStatsScene's own
// header gives for the same choice, and CaptionBox's all-caps lettering
// would fight a paragraph with a citation in it.
const CATEGORY_LABELS = {
  statistic: 'WHAT YOUR NUMBERS SAY',
  uncertainty: 'BUT NOTHING HERE IS 100%',
  qualitative: "WHAT THE NUMBERS DON'T SHOW",
};

class PathConsequenceScene extends Phaser.Scene {
  constructor() {
    super('PathConsequence');
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
    const bank = CONSEQUENCES[GameState.pathTaken] || [];
    return bank
      .filter((beat) => !beat.when || beat.when(GameState))
      .map((beat) => ({
        ...beat,
        resolvedText: typeof beat.text === 'function' ? beat.text(GameState) : beat.text,
      }));
  }

  _buildStaticUI() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f);

    this.categoryText = this.add.text(width / 2, height * 0.16, '', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#e8b23a', letterSpacing: 2,
    }).setOrigin(0.5);

    this.bodyText = this.add.text(width / 2, height * 0.28, '', {
      fontFamily: 'Georgia, serif', fontSize: '17px', color: '#e8e4d8', align: 'center',
      wordWrap: { width: 580 }, lineSpacing: 10,
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
  }

  _advance() {
    this.index += 1;
    const beat = this.beats[this.index];
    if (!beat) {
      this.scene.start('WorkingYears');
      return;
    }
    this.categoryText.setText(CATEGORY_LABELS[beat.category] || '');
    this.bodyText.setText(beat.resolvedText);
    this.sourceText.setText(beat.source || '');
    this.progressText.setText(`${this.index + 1} / ${this.beats.length}`);
  }
}

export default PathConsequenceScene;
