import GameState from '../systems/GameState.js';
import CHARACTERS from '../data/characters/index.js';
import Demographics from '../systems/Demographics.js';

// Staging-only dev tool: a persistent scene launched once at boot alongside
// everything else, never stopped, so it can jump the game straight to any
// registered scene without replaying Level 1's test/baseline gate every
// time. Toggle with the backtick key or the "DEV" tab in the corner.
//
// Reads the live scene registry (this.scene.manager.keys) rather than a
// hand-maintained list, so it never drifts out of sync as scenes are added.

const TOGGLE_KEY = 'BACKTICK';
const PANEL_WIDTH = 760;
const PANEL_HEIGHT = 560;
const ROW_HEIGHT = 26;
const COL_WIDTH = 230;
const COLS = 3;
const EXCLUDED_KEYS = new Set(['Boot', 'DebugOverlay']);

class DebugOverlayScene extends Phaser.Scene {
  constructor() {
    super('DebugOverlay');
  }

  create() {
    const { width, height } = this.scale;
    this.isOpen = false;

    this.tab = this.add.text(width - 6, height - 6, 'DEV (`)', {
      fontFamily: 'Georgia, serif', fontSize: '11px', color: '#e8b23a', backgroundColor: '#000000',
      padding: { x: 6, y: 3 },
    }).setOrigin(1, 1).setDepth(2000).setInteractive({ useHandCursor: true });
    this.tab.on('pointerdown', () => this._toggle());

    this.container = this.add.container(0, 0).setDepth(2001).setVisible(false);

    const dim = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75).setInteractive();
    const panel = this.add.rectangle(width / 2, height / 2, PANEL_WIDTH, PANEL_HEIGHT, 0x14181f).setStrokeStyle(2, 0xe8b23a);
    const title = this.add.text(width / 2, height / 2 - PANEL_HEIGHT / 2 + 18, 'STAGING DEV MENU — jump to any scene', {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#e8b23a',
    }).setOrigin(0.5);
    this.hintText = this.add.text(width / 2, height / 2 - PANEL_HEIGHT / 2 + 38, '', {
      fontFamily: 'Georgia, serif', fontSize: '11px', color: '#f4ecd8',
    }).setOrigin(0.5);

    const closeBtn = this._makeButton(width / 2 + PANEL_WIDTH / 2 - 34, height / 2 - PANEL_HEIGHT / 2 + 18, 'X', () => this._toggle());
    const maleBtn = this._makeButton(width / 2 - PANEL_WIDTH / 2 + 65, height / 2 - PANEL_HEIGHT / 2 + 38, 'Set Male', () => this._setCharacter('male'));
    const femaleBtn = this._makeButton(width / 2 - PANEL_WIDTH / 2 + 165, height / 2 - PANEL_HEIGHT / 2 + 38, 'Set Female', () => this._setCharacter('female'));
    const resetBtn = this._makeButton(width / 2 - PANEL_WIDTH / 2 + 270, height / 2 - PANEL_HEIGHT / 2 + 38, 'Reset State', () => this._resetState());

    this.container.add([dim, panel, title, this.hintText, closeBtn.box, closeBtn.text, maleBtn.box, maleBtn.text, femaleBtn.box, femaleBtn.text, resetBtn.box, resetBtn.text]);

    this.listContainer = this.add.container(0, 0);
    this.container.add(this.listContainer);

    const listTop = height / 2 - PANEL_HEIGHT / 2 + 60;
    const listBottom = height / 2 + PANEL_HEIGHT / 2 - 12;
    const listLeft = width / 2 - PANEL_WIDTH / 2 + 16;

    const maskShape = this.make.graphics();
    maskShape.fillRect(listLeft, listTop, PANEL_WIDTH - 32, listBottom - listTop);
    this.listContainer.setMask(maskShape.createGeometryMask());

    this._buildSceneButtons(listLeft, listTop);
    this.listScrollMax = 0;
    this.listScrollMin = Math.min(0, (listBottom - listTop) - this.listHeight);

    dim.on('wheel', (pointer, dx, dy) => {
      this.listContainer.y = Phaser.Math.Clamp(this.listContainer.y - dy, this.listScrollMin, this.listScrollMax);
    });

    this.input.keyboard.on(`keydown-${TOGGLE_KEY}`, () => this._toggle());
  }

  update() {
    // Every other scene in the game is started after this one at some
    // point (each scene transition re-adds a scene to the top of the
    // render stack), so without this the tab/menu would end up drawn
    // underneath whatever scene is currently playing.
    this.scene.bringToTop();
  }

  _buildSceneButtons(startX, startY) {
    const keys = Object.keys(this.scene.manager.keys).filter((k) => !EXCLUDED_KEYS.has(k));
    let maxRow = 0;
    keys.forEach((key, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      maxRow = Math.max(maxRow, row);
      const x = startX + col * COL_WIDTH + 100;
      const y = startY + row * ROW_HEIGHT + 10;
      const btn = this._makeButton(x, y, key, () => this._jumpTo(key), 190, 22, '10px');
      this.listContainer.add([btn.box, btn.text]);
    });
    this.listHeight = (maxRow + 1) * ROW_HEIGHT;
  }

  _makeButton(x, y, label, onClick, w = 100, h = 24, fontSize = '12px') {
    const box = this.add.rectangle(x, y, w, h, 0x2a2f3a).setStrokeStyle(1, 0xe8b23a).setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, { fontFamily: 'Georgia, serif', fontSize, color: '#f4ecd8' }).setOrigin(0.5);
    box.on('pointerdown', () => onClick());
    return { box, text };
  }

  _setCharacter(character) {
    const archetype = CHARACTERS[GameState.archetypeId];
    GameState.character = character;
    GameState.annualIncome = archetype.genders[character].annualIncome;
    Demographics.rollAndApply(GameState);
    this._refreshHint();
  }

  _resetState() {
    GameState.reset();
    this._setCharacter('male');
  }

  _refreshHint() {
    if (!this.hintText) return; // called before create() finished (e.g. automated testing)
    const traits = [
      GameState.race || '(no race rolled)',
      GameState.hasDisability ? 'disability' : null,
      GameState.isRural ? 'rural' : null,
    ].filter(Boolean).join(', ');
    this.hintText.setText(
      `Character: ${GameState.character || '(none — set one before jumping)'}   Income: $${GameState.annualIncome || 0}   [${traits}]   [ \` to close ]`,
    );
  }

  _jumpTo(key) {
    if (!GameState.character) this._setCharacter('male');
    const manager = this.scene.manager;
    manager.getScenes(true).forEach((s) => {
      if (s.scene.key !== 'DebugOverlay') manager.stop(s.scene.key);
    });
    manager.start(key);
    this._toggle(false);
  }

  _toggle(force) {
    this.isOpen = force !== undefined ? force : !this.isOpen;
    this.container.setVisible(this.isOpen);
    this.scene.manager.getScenes(true).forEach((s) => {
      if (s.scene.key !== 'DebugOverlay') s.input.enabled = !this.isOpen;
    });
    if (this.isOpen) {
      this.scene.bringToTop();
      this._refreshHint();
    }
  }
}

export default DebugOverlayScene;
