import GameState from '../systems/GameState.js';
import PackingHouse from '../systems/PackingHouse.js';

// "The packing house floor" — the workforce-path job simulation. Ties
// back to IntroConversation's own established work ("packing houses,
// construction, whatever needs hands" / "I'll take every hour the
// packing house will give me") rather than an arbitrary minigame.
// Mouse-drag fruit off a moving belt into the matching bucket before it
// reaches the end. Belt speed is the only difficulty knob (PackingHouse.
// computeBeltSpeed); accuracy sets a permanent wage modifier on
// GameState.annualIncome, applied once, before WorkingYears.
//
// Restyled to match the rest of the game: a real illustrated backdrop
// (packinghouse_floor.png, same Bronze Age comic pipeline as every other
// backdrop) with the belt and the three labeled crates baked into the
// art itself — same convention as Downtown/FresnoHigh baking their own
// signage into the art rather than drawing UI labels over a blank scene.
// Bucket hit-zones below are calibrated to where those crates actually
// render after the same cover-fit scaling OverworldScene uses. Fruit are
// small illustrated sprites (fruit_apple/orange/lemon.png), not flat
// shapes.

const BACKDROP_KEY = 'packinghouse_floor';

// Calibrated against the backdrop's native 2048x2048 art, transformed by
// the same cover-fit scale/offset OverworldScene applies (Phaser
// Technical Architecture doc Section 8.3's convention) — the belt runs
// through the image's vertical middle, the three crates sit lower.
const BELT_Y = 320;
const BELT_LEFT = 60;
const BELT_RIGHT = 740;
const FRUIT_SIZE = 56; // display size, square
const SPAWN_INTERVAL_MS = 1100;

const BUCKETS = [
  { type: 'apple', x: 236 },
  { type: 'orange', x: 383 },
  { type: 'lemon', x: 527 },
];
const BUCKET_Y = 445;
const BUCKET_WIDTH = 140;
const BUCKET_HEIGHT = 100;

const FRUIT_TEXTURE = {
  apple: 'fruit_apple',
  orange: 'fruit_orange',
  lemon: 'fruit_lemon',
};

class PackingHouseScene extends Phaser.Scene {
  constructor() {
    super('PackingHouse');
  }

  preload() {
    if (!this.textures.exists(BACKDROP_KEY)) {
      this.load.image(BACKDROP_KEY, `assets/images/${BACKDROP_KEY}.png`);
    }
    Object.values(FRUIT_TEXTURE).forEach((key) => {
      if (!this.textures.exists(key)) {
        this.load.image(key, `assets/images/${key}.png`);
      }
    });
  }

  create() {
    const { width, height } = this.scale;

    this.beltSpeed = PackingHouse.computeBeltSpeed(GameState);
    this.spawned = 0;
    this.resolved = 0;
    this.correctCount = 0;
    this.activeFruit = [];
    this.roundOver = false;

    const bg = this.add.image(width / 2, height / 2, BACKDROP_KEY);
    const coverScale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(coverScale);

    // Dark translucent bar behind the header so it stays legible over a
    // busy illustrated backdrop, same purpose CaptionBox's panel serves.
    this.add.rectangle(width / 2, 34, width, 56, 0x000000, 0.45);
    this.add.text(width / 2, 22, 'THE PACKING HOUSE FLOOR', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#e8b23a', letterSpacing: 2,
    }).setOrigin(0.5);
    this.add.text(width / 2, 48, 'Drag each piece into its crate before it reaches the end of the belt.', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#f4ecd8',
    }).setOrigin(0.5);

    this.progressBg = this.add.rectangle(110, 90, 200, 26, 0x000000, 0.45);
    this.progressText = this.add.text(20, 78, '', {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#f4ecd8',
    });
    this._updateProgressText();

    this.input.on('dragstart', (pointer, gameObject) => {
      gameObject.setDepth(50);
      gameObject.isDragging = true;
    });
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
    this.input.on('dragend', (pointer, gameObject) => {
      this._resolveDrop(gameObject);
    });

    this.spawnTimer = this.time.addEvent({
      delay: SPAWN_INTERVAL_MS,
      callback: this._spawnFruit,
      callbackScope: this,
      loop: true,
    });
    this._spawnFruit();
  }

  _updateProgressText() {
    this.progressText.setText(`Sorted: ${this.resolved} / ${PackingHouse.ROUND_LENGTH}    Correct: ${this.correctCount}`);
    this.progressBg.width = this.progressText.width + 24;
    this.progressBg.x = 20 + this.progressBg.width / 2;
  }

  _spawnFruit() {
    if (this.spawned >= PackingHouse.ROUND_LENGTH) {
      this.spawnTimer.paused = true;
      return;
    }
    this.spawned += 1;
    const type = PackingHouse.FRUIT_TYPES[Math.floor(Math.random() * PackingHouse.FRUIT_TYPES.length)];
    const y = BELT_Y + Phaser.Math.Between(-15, 15);
    const fruit = this.add.image(BELT_LEFT, y, FRUIT_TEXTURE[type])
      .setDisplaySize(FRUIT_SIZE, FRUIT_SIZE)
      .setInteractive({ draggable: true, useHandCursor: true });
    fruit.fruitType = type;
    fruit.isDragging = false;
    fruit.resolved = false;
    this.activeFruit.push(fruit);
  }

  _resolveDrop(fruit) {
    fruit.isDragging = false;
    const bucket = BUCKETS.find((b) => (
      Math.abs(fruit.x - b.x) < BUCKET_WIDTH / 2 && Math.abs(fruit.y - BUCKET_Y) < BUCKET_HEIGHT / 2
    ));
    if (!bucket) return; // missed the crates — stays put, keeps drifting from here
    this._finishFruit(fruit, bucket.type === fruit.fruitType);
  }

  _finishFruit(fruit, correct) {
    if (fruit.resolved) return;
    fruit.resolved = true;
    this.resolved += 1;
    if (correct) this.correctCount += 1;
    this._updateProgressText();
    fruit.destroy();
    this.activeFruit = this.activeFruit.filter((f) => f !== fruit);
    if (this.resolved >= PackingHouse.ROUND_LENGTH && !this.roundOver) {
      this.roundOver = true;
      this._showResults();
    }
  }

  update(time, delta) {
    if (this.roundOver) return;
    const dt = delta / 1000;
    this.activeFruit.slice().forEach((fruit) => {
      if (fruit.isDragging || fruit.resolved) return;
      fruit.x += this.beltSpeed * dt;
      if (fruit.x >= BELT_RIGHT) {
        this._finishFruit(fruit, false); // reached the end unsorted — a miss
      }
    });
  }

  _showResults() {
    this.spawnTimer.remove();
    this.activeFruit.forEach((f) => f.destroy());
    this.activeFruit = [];

    const { width, height } = this.scale;
    const accuracy = this.correctCount / PackingHouse.ROUND_LENGTH;
    const modifier = PackingHouse.computeWageModifier(accuracy);
    GameState.annualIncome = Math.round(GameState.annualIncome * modifier);

    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f).setDepth(60);

    const label = modifier > 1 ? 'A quicker hand than most — you start at a better rate.'
      : modifier < 1 ? "Slower going than the floor wanted — you start at a lower rate."
        : "Steady enough. You start at the going rate.";

    this.add.text(width / 2, height * 0.32, `${this.correctCount} of ${PackingHouse.ROUND_LENGTH} sorted correctly`, {
      fontFamily: 'Georgia, serif', fontSize: '24px', color: '#e8b23a',
    }).setOrigin(0.5).setDepth(61);

    this.add.text(width / 2, height * 0.32 + 45, label, {
      fontFamily: 'Georgia, serif', fontSize: '16px', color: '#e8e4d8', align: 'center', wordWrap: { width: 500 },
    }).setOrigin(0.5).setDepth(61);

    this.add.text(width / 2, height * 0.32 + 90, `Starting wage: $${GameState.annualIncome.toLocaleString()}/yr`, {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#888888',
    }).setOrigin(0.5).setDepth(61);

    const box = this.add.rectangle(width / 2, height * 0.6, 260, 44, 0xf4ecd8).setStrokeStyle(3, 0xe8b23a).setInteractive({ useHandCursor: true }).setDepth(61);
    const text = this.add.text(width / 2, height * 0.6, 'Continue', { fontFamily: 'Georgia, serif', fontSize: '16px', color: '#1a1a1a' }).setOrigin(0.5).setDepth(62);
    box.on('pointerdown', () => this.scene.start('PathConsequence'));
  }
}

export default PackingHouseScene;
