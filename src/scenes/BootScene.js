import GameState from '../systems/GameState.js';
import Persistence from '../systems/Persistence.js';
import { IS_DEV_MODE } from '../systems/devMode.js';

class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    // Canvas text renders with whatever font is loaded at draw time and
    // never re-renders when a webfont finishes loading later — wait here
    // so DialogueBubble's comic lettering never flashes the fallback font.
    if (document.fonts && document.fonts.load) {
      document.fonts.load('16px Bangers').finally(() => this._proceed());
    } else {
      this._proceed();
    }
  }

  _proceed() {
    this.scene.launch('Persistence');
    if (IS_DEV_MODE) this.scene.launch('DebugOverlay');

    const saved = Persistence.load();
    if (saved) {
      this._showResumePrompt(saved);
    } else {
      this.scene.start('CharacterSelect');
    }
  }

  // Same convention as SpecialCircumstanceScene's title-card beats — dark
  // background, gold title, no illustration. This is the only place a
  // returning player sees before either continuing or wiping the save.
  _showResumePrompt(saved) {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f);

    this.add.text(width / 2, height * 0.32, 'PICK UP WHERE YOU LEFT OFF?', {
      fontFamily: 'Georgia, serif', fontSize: '24px', color: '#e8b23a', letterSpacing: 1,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.42, "A run in progress was found on this browser.", {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#e8e4d8',
    }).setOrigin(0.5);

    this._makeButton(width / 2, height * 0.56, 'Resume', () => this._resume(saved));
    this._makeButton(width / 2, height * 0.68, 'Start over', () => this._startOver());
  }

  _makeButton(x, y, label, onClick) {
    const box = this.add.rectangle(x, y, 220, 56, 0xf4ecd8).setStrokeStyle(3, 0xe8b23a).setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, { fontFamily: 'Georgia, serif', fontSize: '18px', color: '#1a1a1a' }).setOrigin(0.5);
    box.on('pointerdown', onClick);
    return { box, text };
  }

  _resume(saved) {
    Object.assign(GameState, saved.gameState);
    this.scene.start(saved.sceneKey);
  }

  _startOver() {
    Persistence.clear();
    this.scene.start('CharacterSelect');
  }
}

export default BootScene;
