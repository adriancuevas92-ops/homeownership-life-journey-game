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
      this.stepIndex = this._lastActiveIndex();
      this._enterStep(this.stepIndex);
    } else {
      this.stepIndex = -1;
      this._advance();
    }
  }

  // A step with a `when: (state) => boolean` field only plays for
  // playthroughs where it returns true — e.g. Baseline1's amnesty-era
  // content only applies to the Latino archetype; a Black-archetype
  // sibling step covers the same beat differently. Steps with no `when`
  // always play, same as before this existed.
  _isStepActive(step) {
    return !step.when || step.when(GameState);
  }

  _lastActiveIndex() {
    let idx = this.config.steps.length - 1;
    while (idx >= 0 && !this._isStepActive(this.config.steps[idx])) idx -= 1;
    return idx;
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
    let idx = this.stepIndex - 1;
    while (idx >= 0 && !this._isStepActive(this.config.steps[idx])) idx -= 1;
    if (idx >= 0) {
      this.stepIndex = idx;
      this._enterStep(this.stepIndex);
    } else if (this.config.previousScene) {
      this.scene.start(this.config.previousScene, { startAtEnd: true });
    }
  }

  _advance() {
    do {
      this.stepIndex += 1;
    } while (this.config.steps[this.stepIndex] && !this._isStepActive(this.config.steps[this.stepIndex]));

    const step = this.config.steps[this.stepIndex];

    if (!step) {
      // `nextScene` may be a function of GameState too — lets a shared
      // scene (Baseline3) route to a different archetype's own next
      // scene (IntroConversation vs IntroConversationBlack) at the one
      // seam where their stories actually diverge.
      const next = typeof this.config.nextScene === 'function' ? this.config.nextScene(GameState) : this.config.nextScene;
      this.scene.start(next);
      return;
    }

    this._enterStep(this.stepIndex);
  }

  _enterStep(index) {
    const step = this.config.steps[index];
    let text = this.resolvedText[index];

    if (text === undefined) {
      // Keyed by scene + step, not just step index within this instance —
      // survives a full scene teardown/rebuild (see GameState.stepOutcomes'
      // own comment for why that distinction matters: `this.resolvedText`
      // alone only guarantees "runs once" for as long as THIS instance
      // stays alive, which backing all the way out and returning defeats).
      const stepKey = `${this.config.key}:${index}`;
      if (step.type === 'roll') {
        let outcome = GameState.stepOutcomes[stepKey];
        if (!outcome) {
          const result = step.roll(GameState);
          outcome = result.disrupted ? 'fail' : 'success';
          GameState.stepOutcomes[stepKey] = outcome;
        }
        text = outcome === 'fail' ? step.fail : step.success;
      } else if (step.type === 'effect') {
        // Deterministic, not a chance roll — for a structural/policy fact
        // that applies to every playthrough the same way (e.g. a tax-code
        // change), not an individual household's luck. `apply()` itself
        // only ever runs once per playthrough now (see stepKey above);
        // `text` still resolves fresh every visit since it's often a
        // function of state unrelated to the effect's own outcome.
        if (!GameState.stepOutcomes[stepKey]) {
          step.apply(GameState);
          GameState.stepOutcomes[stepKey] = 'applied';
        }
        text = step.text;
      } else {
        text = step.text;
      }
      // `text` may be a plain string or a function of GameState, same
      // convention pathConsequences.js already uses — lets a step read
      // back demographics rolled at CharacterSelect (race/isRural/
      // hasDisability are all set before Baseline1 ever starts).
      if (typeof text === 'function') text = text(GameState);
      this.resolvedText[index] = text;
    }

    this.captionBox.show(text, () => {});
  }
}

export default ComicScene;
