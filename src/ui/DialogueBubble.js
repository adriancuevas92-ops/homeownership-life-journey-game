const PADDING_X = 20;
const PADDING_Y = 15;
const MAX_WIDTH = 400;
const TAIL_SIZE = 18;
const BORDER_COLOR = 0x000000;
const BORDER_WIDTH = 4;
const EDGE_MARGIN = 8;

// A single comic-style speech bubble anchored near a speaker's head. Locked
// to the classic Silver/Bronze Age comic-lettering convention (reference
// supplied by the user): bold all-caps display lettering, black-outlined
// pill-shaped bubble, cream fill — not a per-speaker color scheme. Speaker
// identity comes from position and tail direction, same as real comics,
// not bubble color. Only one speaker's bubble is shown at a time
// (ConversationScene hides the previous one before showing the next) — a
// deliberate simplification over keeping both on screen at once.
class DialogueBubble {
  constructor(scene, anchorX, anchorY, side) {
    this.scene = scene;
    this.anchorX = anchorX;
    this.anchorY = anchorY;
    this.side = side; // 'left' | 'right' — which side of anchorX the bubble grows toward

    this.graphics = scene.add.graphics().setDepth(20).setVisible(false);
    this.text = scene.add.text(0, 0, '', {
      fontFamily: 'Bangers, Impact, sans-serif',
      fontSize: '18px',
      color: '#000000',
      wordWrap: { width: MAX_WIDTH - PADDING_X * 2 },
      lineSpacing: 8,
    }).setDepth(21).setVisible(false);

    this.fullText = '';
  }

  // Text appears and disappears instantly rather than typing itself out —
  // per direction, the typewriter reveal cost more than it added. No timer
  // needed at all now, which also removes the Clock null-reference race
  // this class used to work around (Phaser Technical Architecture doc
  // Section 13.4) — there's nothing left to pause/orphan.
  show(fullText, onComplete) {
    this.fullText = fullText.toUpperCase();
    this.onComplete = onComplete;
    this.text.setText(this.fullText).setVisible(true);
    this.graphics.setVisible(true);
    this._redraw();
    if (this.onComplete) this.onComplete();
  }

  skipToEnd() {
    // No-op: text is never mid-reveal. Kept so call sites that still check
    // isTyping()/skipToEnd() (ComicScene, ConversationScene) don't need to
    // change their click-handling shape.
  }

  isTyping() {
    return false;
  }

  hide() {
    this.graphics.setVisible(false);
    this.text.setVisible(false);
  }

  destroy() {
    this.graphics.destroy();
    this.text.destroy();
  }

  _redraw() {
    const w = Math.min(MAX_WIDTH, Math.max(this.text.width + PADDING_X * 2, 120));
    const h = this.text.height + PADDING_Y * 2;
    const radius = h / 2; // pill/oval shape, not a lightly-rounded rectangle

    // Anchor position first, then clamp to the canvas — a bubble anchored
    // near an edge (or grown wide by a long line) would otherwise render
    // partly off-canvas, which reads as dialogue "cut off by the border."
    // The tail is computed from the clamped box, not the raw anchor, so it
    // stays attached to the bubble even when the box has been nudged in.
    const { width: canvasWidth, height: canvasHeight } = this.scene.scale;
    let x = this.side === 'left' ? this.anchorX : this.anchorX - w;
    let y = this.anchorY - h - TAIL_SIZE;
    x = Phaser.Math.Clamp(x, EDGE_MARGIN, canvasWidth - w - EDGE_MARGIN);
    y = Phaser.Math.Clamp(y, EDGE_MARGIN, canvasHeight - h - EDGE_MARGIN);

    this.text.setPosition(x + PADDING_X, y + PADDING_Y);

    const tailX = this.side === 'left' ? x + radius + 14 : x + w - radius - 14;

    this.graphics.clear();

    // Fill and stroke the pill first, then fill the tail on top — the tail
    // fill paints over the short stretch of the pill's own bottom border
    // that would otherwise cut across the tail's base, which is what made
    // the tail look like a separate floating triangle instead of a single
    // continuous shape. The tail's slanted edges are stroked last, on top
    // of everything, so they read as clean lines merging into the bubble.
    this.graphics.fillStyle(0xfaf6ec, 1);
    this.graphics.fillRoundedRect(x, y, w, h, radius);
    this.graphics.lineStyle(BORDER_WIDTH, BORDER_COLOR, 1);
    this.graphics.strokeRoundedRect(x, y, w, h, radius);

    this.graphics.fillStyle(0xfaf6ec, 1);
    this.graphics.fillTriangle(
      tailX - 11, y + h - 4,
      tailX + 11, y + h - 4,
      tailX, y + h + TAIL_SIZE,
    );

    this.graphics.lineStyle(BORDER_WIDTH, BORDER_COLOR, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(tailX - 11, y + h - 4);
    this.graphics.lineTo(tailX, y + h + TAIL_SIZE);
    this.graphics.lineTo(tailX + 11, y + h - 4);
    this.graphics.strokePath();
  }
}

export default DialogueBubble;
