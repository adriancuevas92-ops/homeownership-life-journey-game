import CaptionBox from '../ui/CaptionBox.js';
import GameState from '../systems/GameState.js';

const EDGE_MARGIN = 40;
const WALK_Y = 420;
const WALK_Y_MIN = 385;
const WALK_Y_MAX = 460;
const SPEED = 220; // px/sec
const AVATAR_TARGET_HEIGHT = 130;
const WALK_FRAME_MS = 160;

class OverworldScene extends Phaser.Scene {
  constructor(config) {
    super(config.key);
    this.config = config;
  }

  preload() {
    this.textureKey = `overworld_${this.config.key}`;
    if (!this.textures.exists(this.textureKey)) {
      this.load.image(this.textureKey, `assets/images/${this.config.backdrop}.png`);
    }

    // Two mid-stride poses (left-foot-forward / right-foot-forward) toggled
    // in update() to fake a walk cycle — not a spritesheet animation, just
    // two full textures swapped on a timer. Both frames were padded to a
    // shared, bottom-aligned canvas (scripts/equalize_frames.py) so
    // swapping between them doesn't visibly resize/jump the character.
    //
    // avatarVariant can be a plain string ('child', same as always) or a
    // function of GameState, resolved fresh every time this scene starts
    // — Realty uses this to show the "final" older sprite normally, or
    // the "military" uniformed one for a run that completed the drill
    // (GameState.isVeteran), without needing a whole second scene class.
    const variant = typeof this.config.avatarVariant === 'function'
      ? this.config.avatarVariant(GameState)
      : this.config.avatarVariant;
    const variantSuffix = variant ? `_${variant}` : '';
    // 'latino' stays unsuffixed — it's the archetype's original, already-shipped
    // sprite set (scripts/gen_avatar.py's filename_key uses the same convention).
    const raceInfix = (GameState.race && GameState.race !== 'latino') ? `_${GameState.race}` : '';
    this.avatarKeys = [1, 2].map((n) => `avatar_${GameState.character}${raceInfix}${variantSuffix}_${n}`);
    this.avatarKeys.forEach((key) => {
      if (!this.textures.exists(key)) {
        this.load.image(key, `assets/images/${key}.png`);
      }
    });
  }

  create(data) {
    const { width, height } = this.scale;

    // Per-screen override — the shared default matches Downtown/Business's
    // flat framing, but not every backdrop's ground plane sits at the same
    // height (e.g. FresnoHigh's sidewalk sits noticeably lower than that
    // default, which made the avatar float near the power lines).
    this.walkY = this.config.walkY ?? WALK_Y;
    this.walkYMin = this.config.walkYMin ?? WALK_Y_MIN;
    this.walkYMax = this.config.walkYMax ?? WALK_Y_MAX;
    // Realty's backdrop is a much closer-in shot of a single storefront
    // than Downtown/Business's wide street view, so the shared default
    // height reads as too small against it.
    this.avatarTargetHeight = this.config.avatarHeight ?? AVATAR_TARGET_HEIGHT;

    const bg = this.add.image(width / 2, height / 2, this.textureKey);
    const coverScale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(coverScale);
    this.mapScale = coverScale;
    this.mapOffsetX = width / 2 - (bg.width * coverScale) / 2;
    this.mapOffsetY = height / 2 - (bg.height * coverScale) / 2;

    this._buildEdgeMarkers();
    this._buildPlayer(data);
    this._buildTooltip();
    this.messageBox = new CaptionBox(this, (width - 640) / 2, height - 140);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.interactKey.on('down', () => this._onInteractPressed());

    // Phaser's own device detection, not a new dependency. Keyboard-only
    // input left every touch device stuck the moment it reached the first
    // overworld screen — nothing here does anything on a mouse/keyboard
    // session (the block never renders), so desktop is unaffected.
    this.touchState = { left: false, right: false, up: false, down: false };
    this.isTouchDevice = this.sys.game.device.input.touch;
    if (this.isTouchDevice) this._buildTouchControls();

    this.overlappingHotspot = null;
  }

  // Four hold-to-move direction buttons (bottom-left) plus one interact
  // button (bottom-right) — same hold/tap semantics as a held arrow key
  // or a SPACE tap, just routed through touchState instead of Phaser's
  // keyboard plugin. Deliberately simple shapes/glyphs, not art assets —
  // this is a control, not a backdrop.
  _buildTouchControls() {
    const { width, height } = this.scale;
    const make = (x, y, label, onDown, onUp) => {
      const box = this.add.rectangle(x, y, 56, 56, 0x000000, 0.35)
        .setStrokeStyle(2, 0xf4ecd8, 0.6)
        .setInteractive({ useHandCursor: true })
        .setDepth(200)
        .setScrollFactor(0);
      const text = this.add.text(x, y, label, {
        fontFamily: 'Georgia, serif', fontSize: '22px', color: '#f4ecd8',
      }).setOrigin(0.5).setDepth(201).setScrollFactor(0);
      box.on('pointerdown', onDown);
      box.on('pointerup', onUp);
      box.on('pointerout', onUp);
      return { box, text };
    };

    const padX = 70;
    const padY = height - 100;
    make(padX, padY - 60, '▲', () => { this.touchState.up = true; }, () => { this.touchState.up = false; });
    make(padX, padY + 60, '▼', () => { this.touchState.down = true; }, () => { this.touchState.down = false; });
    make(padX - 60, padY, '◄', () => { this.touchState.left = true; }, () => { this.touchState.left = false; });
    make(padX + 60, padY, '►', () => { this.touchState.right = true; }, () => { this.touchState.right = false; });

    make(width - 60, height - 60, 'OK', () => this._onInteractPressed(), () => {});
  }

  _buildPlayer(data) {
    const enterFrom = data && data.enterFrom;
    const startX = enterFrom === 'right' ? this.scale.width - EDGE_MARGIN - 20
      : enterFrom === 'left' ? EDGE_MARGIN + 20
        : this.scale.width / 2;

    this.walkFrame = 0;
    this.walkFrameTimer = 0;

    this.player = this.add.image(startX, this.walkY, this.avatarKeys[0]);
    const tex = this.textures.get(this.avatarKeys[0]).getSourceImage();
    this.player.setScale(this.avatarTargetHeight / tex.height);
    this.player.setOrigin(0.5, 1);
    this.player.setDepth(10);
  }

  // edges.left/right may be a plain screen key or a function of
  // GameState — Downtown uses this to close the way back to HomeAdult
  // once GameState.pathTaken is set (Level 3): narratively, there's no
  // going back to "their original home" once they're deciding their own.
  // Re-resolved on every check rather than cached, since pathTaken can
  // become true partway through a screen's lifetime (the player walks in
  // before choosing a path, chooses it via a hotspot, comes back later).
  _resolveEdge(edgeValue) {
    return typeof edgeValue === 'function' ? edgeValue(GameState) : edgeValue;
  }

  _buildEdgeMarkers() {
    const { width, height } = this.scale;
    this.leftEdgeMarker = null;
    this.rightEdgeMarker = null;
    if (this._resolveEdge(this.config.edges.left)) {
      this.leftEdgeMarker = this.add.text(EDGE_MARGIN - 10, height / 2, '‹', {
        fontFamily: 'Georgia, serif', fontSize: '40px', color: '#f4ecd8',
        stroke: '#1a1a1a', strokeThickness: 4,
      }).setOrigin(0.5).setAlpha(0.7);
    }
    if (this._resolveEdge(this.config.edges.right)) {
      this.rightEdgeMarker = this.add.text(width - EDGE_MARGIN + 10, height / 2, '›', {
        fontFamily: 'Georgia, serif', fontSize: '40px', color: '#f4ecd8',
        stroke: '#1a1a1a', strokeThickness: 4,
      }).setOrigin(0.5).setAlpha(0.7);
    }
  }

  _buildTooltip() {
    this.tooltipBg = this.add.rectangle(0, 0, 10, 28, 0xf4ecd8)
      .setOrigin(0.5, 1)
      .setStrokeStyle(2, 0x1a1a1a)
      .setVisible(false)
      .setDepth(11);
    this.tooltipText = this.add.text(0, 0, '', {
      fontFamily: 'Georgia, serif',
      fontSize: '14px',
      color: '#1a1a1a',
    }).setOrigin(0.5, 1).setVisible(false).setDepth(12);
  }

  _toNativeCoords(x, y) {
    return {
      x: (x - this.mapOffsetX) / this.mapScale,
      y: (y - this.mapOffsetY) / this.mapScale,
    };
  }

  _hotspotAt(nativeX, nativeY) {
    return this.config.hotspots.find(({ box }) => (
      nativeX >= box.x && nativeX <= box.x + box.width
      && nativeY >= box.y && nativeY <= box.y + box.height
    ));
  }

  update(time, delta) {
    if (this.messageBox.container.visible) return;

    const dt = delta / 1000;
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown || this.touchState.left) vx -= 1;
    if (this.cursors.right.isDown || this.wasd.D.isDown || this.touchState.right) vx += 1;
    if (this.cursors.up.isDown || this.wasd.W.isDown || this.touchState.up) vy -= 1;
    if (this.cursors.down.isDown || this.wasd.S.isDown || this.touchState.down) vy += 1;

    const isMoving = vx !== 0 || vy !== 0;

    if (isMoving) {
      const len = Math.sqrt(vx * vx + vy * vy);
      this.player.x += (vx / len) * SPEED * dt;
      this.player.y += (vy / len) * SPEED * dt;
      this.player.y = Phaser.Math.Clamp(this.player.y, this.walkYMin, this.walkYMax);
      if (vx < 0) this.player.setFlipX(true);
      if (vx > 0) this.player.setFlipX(false);

      this.walkFrameTimer += delta;
      if (this.walkFrameTimer >= WALK_FRAME_MS) {
        this.walkFrameTimer = 0;
        this.walkFrame = 1 - this.walkFrame;
        this.player.setTexture(this.avatarKeys[this.walkFrame]);
      }
    } else if (this.walkFrame !== 0) {
      this.walkFrame = 0;
      this.walkFrameTimer = 0;
      this.player.setTexture(this.avatarKeys[0]);
    }

    this._checkEdges();
    this._checkHotspotOverlap();
  }

  _checkEdges() {
    const left = this._resolveEdge(this.config.edges.left);
    const right = this._resolveEdge(this.config.edges.right);
    if (left && this.player.x <= EDGE_MARGIN) {
      this._goToScreen(left, 'right');
      return;
    }
    if (right && this.player.x >= this.scale.width - EDGE_MARGIN) {
      this._goToScreen(right, 'left');
      return;
    }
    this.player.x = Phaser.Math.Clamp(this.player.x, 4, this.scale.width - 4);
  }

  _checkHotspotOverlap() {
    const { x, y } = this._toNativeCoords(this.player.x, this.player.y);
    const hotspot = this._hotspotAt(x, y);

    if (!hotspot) {
      this.overlappingHotspot = null;
      this.tooltipBg.setVisible(false);
      this.tooltipText.setVisible(false);
      return;
    }

    this.overlappingHotspot = hotspot;
    const interactHint = this.isTouchDevice ? 'tap OK' : 'press SPACE';
    this.tooltipText.setText(`${hotspot.label} — ${interactHint}`)
      .setPosition(this.player.x, this.player.y - this.player.displayHeight - 10)
      .setVisible(true);
    this.tooltipBg.setPosition(this.tooltipText.x, this.tooltipText.y + 4)
      .setSize(this.tooltipText.width + 12, this.tooltipText.height + 8)
      .setVisible(true);
  }

  _onInteractPressed() {
    if (this.messageBox.container.visible) {
      if (this.messageBox.isTyping()) {
        this.messageBox.skipToEnd();
      } else {
        this.messageBox.hide();
      }
      return;
    }

    if (this.overlappingHotspot) {
      this._enterHotspot(this.overlappingHotspot);
    }
  }

  _enterHotspot(hotspot) {
    if (hotspot.targetType === 'narrative') {
      // targetKey may be a function of GameState — Downtown/Business's
      // college and business doors use this to route to Level 3's
      // CareerAdvancement pages instead of the original Level 2 stats
      // pages, once GameState.pathTaken is set (see overworldScreens.js).
      const targetKey = typeof hotspot.targetKey === 'function' ? hotspot.targetKey(GameState) : hotspot.targetKey;
      GameState.overworldReturnScreen = this.config.key;
      this.scene.start(targetKey, hotspot.returnTo ? { returnTo: hotspot.returnTo } : undefined);
      return;
    }
    this.messageBox.show("There's nothing here yet — come back later.", () => {});
  }

  _goToScreen(screenKey, enterFrom) {
    this.scene.start(screenKey, { enterFrom });
  }
}

export default OverworldScene;
