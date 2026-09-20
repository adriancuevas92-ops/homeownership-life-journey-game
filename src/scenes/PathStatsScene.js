import GameState from '../systems/GameState.js';

// One reusable scene class for all three "walk to it, read the real
// numbers before you commit" life-path pages (military/college/
// workforce) at the Level 2 fork — config-driven, same shape as
// ComicScene/OverworldScene, so a fourth path later is a data file, not
// a new class. Text-card convention (SpecialCircumstanceScene/
// KitchenTablePreEndingScene), not comic-panel dialogue, since this is
// reference data the player is meant to actually read and compare, not
// a story beat.
class PathStatsScene extends Phaser.Scene {
  constructor(config) {
    super(config.key);
    this.config = config;
  }

  create() {
    const { width, height } = this.scale;
    // A path's content can differ by run state (e.g. MilitaryStats reads
    // differently — and goes nowhere — for a player who dropped out) —
    // config fields may be a plain value or a function of GameState,
    // resolved fresh each time the scene starts.
    const cfg = this._resolveConfig();

    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f);

    this.add.text(width / 2, height * 0.14, cfg.title, {
      fontFamily: 'Georgia, serif',
      fontSize: '26px',
      color: '#e8b23a',
      letterSpacing: 2,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.24, cfg.stats.join('\n\n'), {
      fontFamily: 'Georgia, serif',
      fontSize: '16px',
      color: '#e8e4d8',
      align: 'center',
      wordWrap: { width: 580 },
      lineSpacing: 10,
    }).setOrigin(0.5, 0);

    this.add.text(width / 2, height - 90, cfg.source, {
      fontFamily: 'Georgia, serif', fontSize: '11px', color: '#555555', align: 'center', wordWrap: { width: 560 },
    }).setOrigin(0.5);

    this._makeButton(width / 2, height - 50, cfg.continueLabel || 'Choose this path', () => {
      if (cfg.nextScene) {
        if (this.config.onContinue) this.config.onContinue(GameState);
        this.scene.start(cfg.nextScene);
      } else {
        // No downstream content for this path yet — same "clearly labeled,
        // not a silent dead end" convention as SchoolTestScene's dropout
        // button, rather than pretending a choice exists that doesn't.
        this._showNotImplemented();
      }
    });

    this.backButton = this.add.text(20, height - 16, '‹ back', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true });
    this.backButton.on('pointerdown', (pointer, x, y, event) => {
      event.stopPropagation();
      // WorkforceStats is reached from multiple hotspots across two
      // screens (Downtown and Business, Section 26) — OverworldScene
      // already records which one in GameState.overworldReturnScreen on
      // every hotspot entry, so back goes to wherever the player actually
      // came from instead of a single hardcoded screen.
      this.scene.start(GameState.overworldReturnScreen || this.config.previousScene);
    });
  }

  _resolveConfig() {
    const resolve = (v) => (typeof v === 'function' ? v(GameState) : v);
    return {
      title: resolve(this.config.title),
      stats: resolve(this.config.stats),
      source: resolve(this.config.source),
      continueLabel: resolve(this.config.continueLabel),
      nextScene: resolve(this.config.nextScene),
    };
  }

  _showNotImplemented() {
    if (this.notBuiltShown) return;
    this.notBuiltShown = true;
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height - 130, 560, 50, 0xfaf6ec).setStrokeStyle(3, 0x1a1a1a);
    this.add.text(width / 2, height - 130, "This path isn't built yet — come back later.", {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#1a1a1a',
    }).setOrigin(0.5);
  }

  _makeButton(x, y, label, onClick) {
    const box = this.add.rectangle(x, y, 260, 40, 0xf4ecd8).setStrokeStyle(3, 0xe8b23a).setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, { fontFamily: 'Georgia, serif', fontSize: '15px', color: '#1a1a1a' }).setOrigin(0.5);
    box.on('pointerdown', (pointer, px, py, event) => {
      event.stopPropagation();
      onClick();
    });
    return { box, text };
  }
}

export default PathStatsScene;
