import DialogueBubble from '../ui/DialogueBubble.js';
import GameState from '../systems/GameState.js';

const LINE_PAUSE_MS = 900;
const BEAT_PAUSE_MS = 1400;

// Autoplaying conversation: backdrop images change beat to beat, dialogue
// advances itself line by line without requiring input — each line appears
// instantly (no typewriter reveal) and holds for a fixed reading pause
// before auto-advancing. Clicking/SPACE just fires that pending pause
// early; it never blocks progress the way the rest of the game's
// click-to-advance scenes do, per the "autoplay itself" requirement this
// replaced the old narrator-caption Arrival scene to satisfy.
class ConversationScene extends Phaser.Scene {
  constructor(config) {
    super(config.key);
    this.config = config;
  }

  preload() {
    this.config.beats.forEach((beat) => {
      if (!this.textures.exists(beat.backdrop)) {
        this.load.image(beat.backdrop, `assets/images/${beat.backdrop}.png`);
      }
    });
  }

  // A beat with a `when: (state) => boolean` field only plays when it
  // returns true — same convention ComicScene's steps use — so one
  // shared scene (e.g. KitchenTable2008) can carry a different beat per
  // archetype instead of needing a whole separate scene/key.
  _isBeatActive(beat) {
    return !beat.when || beat.when(GameState);
  }

  create() {
    this.bg = null;
    this.bubbles = {};
    this.beatIndex = -1;
    this.pendingAdvance = null;
    this.pendingFn = null;

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this._onInteract());
    this.input.on('pointerdown', () => this._onInteract());

    this._advanceBeat();
  }

  _setBackdrop(key) {
    if (this.bg) this.bg.destroy();
    const { width, height } = this.scale;
    this.bg = this.add.image(width / 2, height / 2, key).setDepth(0);
    const scale = Math.min(width / this.bg.width, height / this.bg.height);
    this.bg.setScale(scale);
  }

  _buildBubbles(speakers) {
    Object.values(this.bubbles).forEach((bubble) => bubble.destroy());
    this.bubbles = {};
    Object.entries(speakers).forEach(([role, cfg]) => {
      this.bubbles[role] = new DialogueBubble(this, cfg.x, cfg.y, cfg.side);
    });
  }

  _advanceBeat() {
    do {
      this.beatIndex += 1;
    } while (this.config.beats[this.beatIndex] && !this._isBeatActive(this.config.beats[this.beatIndex]));

    if (this.beatIndex >= this.config.beats.length) {
      const next = typeof this.config.nextScene === 'function' ? this.config.nextScene(GameState) : this.config.nextScene;
      this.scene.start(next);
      return;
    }
    const beat = this.config.beats[this.beatIndex];
    this._setBackdrop(beat.backdrop);
    this._buildBubbles(beat.speakers);
    this.lineIndex = -1;
    this._advanceLine();
  }

  _advanceLine() {
    this.lineIndex += 1;
    const beat = this.config.beats[this.beatIndex];

    if (this.lineIndex >= beat.lines.length) {
      this._scheduleNext(BEAT_PAUSE_MS, () => this._advanceBeat());
      return;
    }

    const line = beat.lines[this.lineIndex];
    this.currentSpeaker = line.speaker;
    Object.entries(this.bubbles).forEach(([role, bubble]) => {
      if (role !== line.speaker) bubble.hide();
    });
    this.bubbles[line.speaker].show(line.text, () => this._scheduleNext(LINE_PAUSE_MS, () => this._advanceLine()));
  }

  _scheduleNext(delay, fn) {
    this.pendingFn = fn;
    this.pendingAdvance = this.time.delayedCall(delay, () => {
      this.pendingAdvance = null;
      this.pendingFn = null;
      fn();
    });
  }

  _onInteract() {
    const bubble = this.bubbles[this.currentSpeaker];
    if (bubble && bubble.isTyping()) {
      bubble.skipToEnd();
      return;
    }
    if (this.pendingAdvance) {
      this.pendingAdvance.remove(false);
      const fn = this.pendingFn;
      this.pendingAdvance = null;
      this.pendingFn = null;
      fn();
    }
  }
}

export default ConversationScene;
