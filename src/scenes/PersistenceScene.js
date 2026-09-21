import Persistence from '../systems/Persistence.js';

const AUTOSAVE_INTERVAL_MS = 2000;
const EXCLUDED_KEYS = new Set(['Persistence', 'DebugOverlay']);

// Always-on, no visuals — same "launched once at boot, never stopped"
// pattern DebugOverlayScene uses. Ships to every player (unlike
// DebugOverlay, which is gated behind ?dev=1): this is what makes
// resume-after-refresh work for a real player, not a QA tool.
class PersistenceScene extends Phaser.Scene {
  constructor() {
    super('Persistence');
  }

  create() {
    this.time.addEvent({
      delay: AUTOSAVE_INTERVAL_MS,
      loop: true,
      callback: this._autosave,
      callbackScope: this,
    });
  }

  _autosave() {
    const active = this.scene.manager.getScenes(true).find((s) => !EXCLUDED_KEYS.has(s.scene.key));
    if (active) Persistence.save(active.scene.key);
  }
}

export default PersistenceScene;
