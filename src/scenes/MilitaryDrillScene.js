import GameState from '../systems/GameState.js';
import MilitaryDrill from '../systems/MilitaryDrill.js';

// Placeholder-shapes build, same convention PackingHouseScene went
// through before its art pass — mechanic first, illustration later.
const LABELS = { rifle: 'RIFLE', boots: 'BOOTS', pack: 'PACK', canteen: 'CANTEEN' };
const SLOT_XS = [230, 340, 450, 560];
const SLOT_Y = 280;
const SLOT_W = 100;
const SLOT_H = 80;
const TILE_Y = 430;
const TILE_W = 90;
const TILE_H = 70;

class MilitaryDrillScene extends Phaser.Scene {
  constructor() {
    super('MilitaryDrill');
  }

  create() {
    const { width, height } = this.scale;
    this.completed = 0;
    this.locked = false;

    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f);

    this.add.text(width / 2, 40, 'BASIC TRAINING — SUPPLY DRILL', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#e8b23a', letterSpacing: 2,
    }).setOrigin(0.5);
    this.add.text(width / 2, 68, "Arrange the gear in the correct order, every time. Speed doesn't matter — only doing it right.", {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#e8e4d8',
    }).setOrigin(0.5);

    const orderLabel = MilitaryDrill.SEQUENCE.map((t) => LABELS[t]).join('  →  ');
    this.add.text(width / 2, 100, `ORDER:  ${orderLabel}`, {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#a8c6e8',
    }).setOrigin(0.5);

    this.progressText = this.add.text(width / 2, 140, '', {
      fontFamily: 'Georgia, serif', fontSize: '16px', color: '#f4ecd8',
    }).setOrigin(0.5);

    this.slots = SLOT_XS.map((x, i) => {
      this.add.rectangle(x, SLOT_Y, SLOT_W, SLOT_H, 0x1f242e).setStrokeStyle(2, 0x555555);
      this.add.text(x, SLOT_Y - SLOT_H / 2 - 14, String(i + 1), {
        fontFamily: 'Georgia, serif', fontSize: '13px', color: '#777777',
      }).setOrigin(0.5);
      return { index: i, x, y: SLOT_Y, occupiedBy: null };
    });

    this.flashRect = this.add.rectangle(width / 2, height / 2, width, height, 0xffffff, 0)
      .setDepth(60);

    this.input.on('drag', (pointer, go, dragX, dragY) => {
      go.x = dragX;
      go.y = dragY;
    });
    this.input.on('dragstart', (pointer, go) => go.setDepth(50));
    this.input.on('dragend', (pointer, go) => this._resolveDrop(go));

    this._updateProgress();
    this._spawnRound();
  }

  _updateProgress() {
    this.progressText.setText(`Assembled: ${this.completed} / ${MilitaryDrill.REPS_REQUIRED}`);
  }

  _spawnRound() {
    if (this.tiles) this.tiles.forEach((t) => t.destroy());
    this.slots.forEach((s) => { s.occupiedBy = null; });

    const shuffled = Phaser.Utils.Array.Shuffle([...MilitaryDrill.SEQUENCE]);
    this.tiles = shuffled.map((type, i) => this._makeTile(type, SLOT_XS[i], TILE_Y));
  }

  _makeTile(type, x, y) {
    const rect = this.add.rectangle(0, 0, TILE_W, TILE_H, 0x2a2f3a).setStrokeStyle(2, 0xe8b23a);
    const label = this.add.text(0, 0, LABELS[type], {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#f4ecd8',
    }).setOrigin(0.5);
    const container = this.add.container(x, y, [rect, label]);
    container.setSize(TILE_W, TILE_H);
    container.setInteractive({ useHandCursor: true });
    this.input.setDraggable(container);
    container.itemType = type;
    container.homeX = x;
    container.homeY = y;
    container.slotIndex = null;
    return container;
  }

  _resolveDrop(go) {
    if (this.locked || !go.itemType) return;

    const slot = this.slots.find((s) => (
      !s.occupiedBy && Math.abs(go.x - s.x) < SLOT_W / 2 && Math.abs(go.y - s.y) < SLOT_H / 2
    ));

    if (go.slotIndex !== null) this.slots[go.slotIndex].occupiedBy = null;

    if (slot) {
      slot.occupiedBy = go;
      go.slotIndex = slot.index;
      go.setPosition(slot.x, slot.y);
    } else {
      go.slotIndex = null;
      go.setPosition(go.homeX, go.homeY);
    }

    this._checkComplete();
  }

  _checkComplete() {
    if (this.slots.some((s) => !s.occupiedBy)) return;

    const submitted = this.slots.map((s) => s.occupiedBy.itemType);
    this.locked = true;

    if (MilitaryDrill.isCorrectOrder(submitted)) {
      this.completed += 1;
      this._updateProgress();
      this._flash(0x3b6d11);
      if (this.completed >= MilitaryDrill.REPS_REQUIRED) {
        this.time.delayedCall(400, () => this._showResults());
      } else {
        this.time.delayedCall(400, () => {
          this.locked = false;
          this._spawnRound();
        });
      }
    } else {
      this._flash(0xa32d2d);
      this.time.delayedCall(500, () => {
        this.locked = false;
        this._spawnRound();
      });
    }
  }

  _flash(color) {
    this.flashRect.setFillStyle(color, 0.35);
    this.tweens.add({ targets: this.flashRect, alpha: { from: 0.35, to: 0 }, duration: 350 });
  }

  _showResults() {
    GameState.isVeteran = true;

    this.children.removeAll();
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f);

    this.add.text(width / 2, height * 0.28, "DRILL COMPLETE — YOU'RE IN", {
      fontFamily: 'Georgia, serif', fontSize: '26px', color: '#e8b23a', letterSpacing: 2,
    }).setOrigin(0.5);

    this.add.text(
      width / 2, height * 0.4,
      "Twenty for twenty, however long it took. That's the whole system: follow the order, every time, and it lets you through — no belt speed, no credit check, no test.\n\nThe VA loan carries the same shape forward: 0% down, no mortgage insurance, financed on terms this game's other paths don't get.",
      { fontFamily: 'Georgia, serif', fontSize: '16px', color: '#e8e4d8', align: 'center', wordWrap: { width: 560 }, lineSpacing: 10 },
    ).setOrigin(0.5, 0);

    this.add.text(
      width / 2, height - 90,
      '[V] VA Loan Network / Realtor.com veteran homeownership data, current reporting year',
      { fontFamily: 'Georgia, serif', fontSize: '11px', color: '#555555' },
    ).setOrigin(0.5);

    const box = this.add.rectangle(width / 2, height - 50, 260, 44, 0xf4ecd8).setStrokeStyle(3, 0xe8b23a).setInteractive({ useHandCursor: true });
    const text = this.add.text(width / 2, height - 50, 'Continue', { fontFamily: 'Georgia, serif', fontSize: '16px', color: '#1a1a1a' }).setOrigin(0.5);
    box.on('pointerdown', () => this.scene.start('PathConsequence'));
  }
}

export default MilitaryDrillScene;
