const BOX_WIDTH = 640;
const MIN_HEIGHT = 90;
const PADDING = 20;
const HINT_ROW_HEIGHT = 22;

class CaptionBox {
  constructor(scene, x, y) {
    this.scene = scene;
    // `y` is the box's position at MIN_HEIGHT — its bottom edge (baseY +
    // MIN_HEIGHT) is the fixed anchor. Longer wrapped text grows the box
    // upward from there instead of downward off the bottom of the canvas.
    this.baseY = y;
    this.container = scene.add.container(x, y);

    this.bg = scene.add.rectangle(0, 0, BOX_WIDTH, MIN_HEIGHT, 0xfaf6ec)
      .setOrigin(0, 0)
      .setStrokeStyle(4, 0x000000);

    this.text = scene.add.text(PADDING, PADDING, '', {
      fontFamily: 'Bangers, Impact, sans-serif',
      fontSize: '20px',
      color: '#000000',
      wordWrap: { width: BOX_WIDTH - PADDING * 2 },
      lineSpacing: 10,
    });

    this.hint = scene.add.text(BOX_WIDTH - 90, 0, 'click to continue', {
      fontFamily: 'Georgia, serif',
      fontSize: '12px',
      color: '#888888',
    }).setVisible(false);

    this.container.add([this.bg, this.text, this.hint]);
    this.container.setVisible(false);

    this.fullText = '';
  }

  // Text appears and disappears instantly rather than typing itself out —
  // per direction, the typewriter reveal cost more than it added. No timer
  // needed at all now, which also removes the Clock null-reference race
  // this class used to work around (Phaser Technical Architecture doc
  // Section 13.4) — there's nothing left to pause/orphan.
  show(fullText, onComplete) {
    this.container.setVisible(true);
    this.fullText = fullText.toUpperCase();
    this.text.setText(this.fullText);
    this._resize();
    this.hint.setVisible(true);
    this.onComplete = onComplete;
    if (this.onComplete) this.onComplete();
  }

  skipToEnd() {
    // No-op: text is never mid-reveal. Kept so call sites that still check
    // isTyping()/skipToEnd() (ComicScene, OverworldScene) don't need to
    // change their click-handling shape.
  }

  isTyping() {
    return false;
  }

  hide() {
    this.container.setVisible(false);
  }

  _resize() {
    const height = Math.max(MIN_HEIGHT, this.text.height + PADDING * 2 + HINT_ROW_HEIGHT);
    this.bg.setSize(BOX_WIDTH, height);
    this.hint.setPosition(BOX_WIDTH - 90, height - 24);
    this.container.y = this.baseY - (height - MIN_HEIGHT);
  }
}

export default CaptionBox;
