class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    // Canvas text renders with whatever font is loaded at draw time and
    // never re-renders when a webfont finishes loading later — wait here
    // so DialogueBubble's comic lettering never flashes the fallback font.
    if (document.fonts && document.fonts.load) {
      document.fonts.load('16px Bangers').finally(() => {
        this.scene.launch('DebugOverlay');
        this.scene.start('CharacterSelect');
      });
    } else {
      this.scene.launch('DebugOverlay');
      this.scene.start('CharacterSelect');
    }
  }
}

export default BootScene;
