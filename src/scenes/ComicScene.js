import CaptionBox from '../ui/CaptionBox.js';
import GameState from '../systems/GameState.js';

class ComicScene extends Phaser.Scene {
  constructor(config) {
    super(config.key);
    this.config = config;
  }

  preload() {
    // Most ComicScenes are gendered (Dreamer arc: scene2_male vs
    // scene2_female). The baseline-1986 world scenes are universal —
    // every archetype sees the same three images — so `genderless: true`
    // skips the suffix instead of needing a duplicate asset per gender.
    this.textureKey = this.config.genderless
      ? this.config.backdrop
      : `${this.config.backdrop}_${GameState.character}`;
    if (!this.textures.exists(this.textureKey)) {
      this.load.image(this.textureKey, `assets/images/${this.textureKey}.png`);
    }
  }

  create(data) {
    const { width, height } = this.scale;
    const bg = this.add.image(width / 2, height / 2, this.textureKey);
    const scaleFactor = Math.min(width / bg.width, (height * 0.65) / bg.height);
    bg.setScale(scaleFactor);
    bg.setY(height * 0.35);

    this.captionBox = new CaptionBox(this, (width - 640) / 2, height - 140);
    // Resolved-text cache, keyed by step index — a 'roll' step only ever
    // actually rolls (and mutates GameState) the first time it's reached
    // going forward. Navigating back to it later just replays the same
    // cached outcome instead of rolling again, which would otherwise
    // double-apply savings/income effects.
    this.resolvedText = {};

    this._buildBackButton();

    this.input.on('pointerdown', () => this._onPointerDown());

    if (data && data.startAtEnd) {
      this.stepIndex = this.config.steps.length - 1;
      this._enterStep(this.stepIndex);
    } else {
      this.stepIndex = -1;
      this._advance();
    }
  }

  _buildBackButton() {
    if (!this.config.previousScene) return;
    const { height } = this.scale;
    this.backButton = this.add.text(20, height - 16, '‹ back', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true }).setDepth(30);
    this.backButton.on('pointerdown', (pointer, x, y, event) => {
      event.stopPropagation();
      this._goBack();
    });
  }

  _onPointerDown() {
    if (this.captionBox.isTyping()) {
      this.captionBox.skipToEnd();
    } else {
      this._advance();
    }
  }

  _goBack() {
    if (this.captionBox.isTyping()) {
      this.captionBox.skipToEnd();
      return;
    }
    if (this.stepIndex > 0) {
      this.stepIndex -= 1;
      this._enterStep(this.stepIndex);
    } else if (this.config.previousScene) {
      this.scene.start(this.config.previousScene, { startAtEnd: true });
    }
  }

  _advance() {
    this.stepIndex += 1;
    const step = this.config.steps[this.stepIndex];

    if (!step) {
      this.scene.start(this.config.nextScene);
      return;
    }

    this._enterStep(this.stepIndex);
  }

  _enterStep(index) {
    const step = this.config.steps[index];
    let text = this.resolvedText[index];

    if (text === undefined) {
      if (step.type === 'roll') {
        const result = step.roll(GameState);
        text = result.disrupted ? step.fail : step.success;
      } else if (step.type === 'effect') {
        // Deterministic, not a chance roll — for a structural/policy fact
        // that applies to every playthrough the same way (e.g. a tax-code
        // change), not an individual household's luck. Applied once and
        // cached same as a roll, so navigating back never re-applies it.
        step.apply(GameState);
        text = step.text;
      } else {
        text = step.text;
      }
      this.resolvedText[index] = text;
    }

    this.captionBox.show(text, () => {});
  }
}

export default ComicScene;
