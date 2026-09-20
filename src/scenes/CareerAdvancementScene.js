import GameState from '../systems/GameState.js';
import CareerAdvancement from '../systems/CareerAdvancement.js';

// One class, two configs (careerAdvancementPages.js) — same shape as
// PathStatsScene, and deliberately reusing its text-card look. Each
// hotspot that reaches this scene (Downtown's college door, any business
// door on Downtown/Business) sends the same `kind` every time, so the
// scene doesn't need to know which specific building the player walked
// into — only whether it's the college mechanic or the business one.
class CareerAdvancementScene extends Phaser.Scene {
  constructor(config) {
    super(config.key);
    this.config = config;
  }

  create() {
    this._render();
  }

  _hasAttempted() {
    // College is a single mechanism, gated as a whole. Business carries
    // two independent one-shot mechanisms (the safe move, and the
    // jackpot) — see _renderBusinessActions, which gates each on its own
    // flag rather than hiding one because the other was already used.
    return this.config.kind === 'college' && GameState.hasAttemptedCollegeAdvancement;
  }

  _render() {
    this.children.removeAll();
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f);

    this.add.text(width / 2, height * 0.12, this.config.title, {
      fontFamily: 'Georgia, serif', fontSize: '26px', color: '#e8b23a', letterSpacing: 2,
    }).setOrigin(0.5);

    if (this._hasAttempted()) {
      this._renderAlreadyDone();
    } else {
      this._renderPitch();
    }

    this.backButton = this.add.text(20, height - 16, '‹ back', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true });
    this.backButton.on('pointerdown', (pointer, x, y, event) => {
      event.stopPropagation();
      this.scene.start(GameState.overworldReturnScreen || this.config.previousScene);
    });

    this._makeButton(width - 20, height - 16, "Check in at the realtor's office ›", () => {
      this.scene.start('KitchenTablePreEnding');
    }, 300, 1, 1);
  }

  _renderPitch() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height * 0.22, this.config.stats.join('\n\n'), {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#e8e4d8', align: 'center',
      wordWrap: { width: 580 }, lineSpacing: 6,
    }).setOrigin(0.5, 0);

    this.add.text(width / 2, height * 0.56, this.config.source, {
      fontFamily: 'Georgia, serif', fontSize: '11px', color: '#555555', align: 'center', wordWrap: { width: 560 },
    }).setOrigin(0.5);

    if (this.config.kind === 'college') {
      this._renderCollegeAction();
    } else {
      this._renderBusinessActions();
    }
  }

  _renderCollegeAction() {
    const { width, height } = this.scale;
    if (!CareerAdvancement.canAffordCollege(GameState)) {
      this.add.text(width / 2, height * 0.65,
        `You'd need $${CareerAdvancement.COLLEGE_TUITION_COST.toLocaleString()} saved to enroll — the jar isn't there yet.`,
        { fontFamily: 'Georgia, serif', fontSize: '14px', color: '#a32d2d' }).setOrigin(0.5);
      return;
    }
    this._makeButton(width / 2, height * 0.65, 'Enroll', () => this._attempt());
  }

  _renderBusinessActions() {
    const { width, height } = this.scale;

    if (!GameState.hasAttemptedCareerMove) {
      this._makeButton(width / 2, height * 0.64, 'Put in for it', () => this._attempt());
    } else {
      this.add.text(width / 2, height * 0.64, 'Already put in for a move once this run.', {
        fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
      }).setOrigin(0.5);
    }

    if (!GameState.hasAttemptedJackpotTest) {
      this.add.text(width / 2, height * 0.74, "Or go for the real thing — one shot, a real 7/10, no retry:", {
        fontFamily: 'Georgia, serif', fontSize: '12px', color: '#888888',
      }).setOrigin(0.5);
      this._makeButton(width / 2, height * 0.82, 'Try for the jackpot', () => this.scene.start('JackpotTest'));
    } else {
      this.add.text(width / 2, height * 0.82, 'Already took the jackpot shot once this run.', {
        fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
      }).setOrigin(0.5);
    }
  }

  _attempt() {
    const result = this.config.kind === 'college'
      ? CareerAdvancement.attemptCollege(GameState)
      : CareerAdvancement.attemptCareerMove(GameState);
    this._render();
    this._showResult(result);
  }

  _showResult(result) {
    const { width, height } = this.scale;
    const text = result.succeeded
      ? (this.config.kind === 'college'
        ? `You finished it. Income's up $${CareerAdvancement.COLLEGE_WAGE_GAIN.toLocaleString()}/yr.`
        : `The move paid off. Income's up to $${GameState.annualIncome.toLocaleString()}/yr.`)
      : (this.config.kind === 'college'
        ? "You started, but didn't finish it. The tuition's spent either way."
        : "It didn't come through this time. No change, no cost.");
    this.add.text(width / 2, height * 0.84, text, {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: result.succeeded ? '#8fbf5f' : '#c98a8a', align: 'center', wordWrap: { width: 560 },
    }).setOrigin(0.5);
  }

  _renderAlreadyDone() {
    const { width, height } = this.scale;
    const text = this.config.kind === 'college'
      ? "You already spent this run's shot at going back to school."
      : "You already put in for a move once this run.";
    this.add.text(width / 2, height * 0.35, text, {
      fontFamily: 'Georgia, serif', fontSize: '16px', color: '#888888', align: 'center', wordWrap: { width: 500 },
    }).setOrigin(0.5);
  }

  _makeButton(x, y, label, onClick, w = 240, originX = 0.5, originY = 0.5) {
    const box = this.add.rectangle(x, y, w, 44, 0xf4ecd8).setStrokeStyle(3, 0xe8b23a).setInteractive({ useHandCursor: true }).setOrigin(originX, originY);
    const text = this.add.text(x, y, label, { fontFamily: 'Georgia, serif', fontSize: '16px', color: '#1a1a1a' }).setOrigin(originX, originY);
    box.on('pointerdown', (pointer, px, py, event) => {
      event.stopPropagation();
      onClick();
    });
    return { box, text };
  }
}

export default CareerAdvancementScene;
