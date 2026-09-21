import GameState from '../systems/GameState.js';
import CHARACTERS, { ARCHETYPE_BY_RACE } from '../data/characters/index.js';
import Demographics from '../systems/Demographics.js';

// Expanded from "roll race, then just pick gender" to a real character-
// creation screen — direction: "expand the selection screen... to be
// able to pick any character circumstance, race, and gender." Every axis
// (race, gender, setting, disability) is independently pickable; leaving
// one untouched keeps it random, same odds Demographics.js always used,
// so a player who touches nothing and hits Begin gets exactly the
// original randomized-circumstance experience. This also closes a real
// exploit a player audit found (2026-09-21): the old flow rolled race
// fresh every time this scene's create() ran, and its own "‹ back"
// button (reachable from Baseline1) routed straight back here — a
// player could freely re-roll their whole circumstance by backing out
// and re-entering until they got one they liked, undermining the game's
// own "your circumstance isn't something you choose" premise. Explicit
// picks now live in this scene's own local state and only commit to
// GameState on "Begin the run" — there's no more mid-flow scene restart
// for a "back" button to exploit.
const RACE_OPTIONS = [
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
  { value: 'latino', label: 'Latino' },
  { value: 'asian', label: 'Asian American' },
];
const SETTING_OPTIONS = [
  { value: false, label: 'Urban' },
  { value: true, label: 'Rural' },
];
const DISABILITY_OPTIONS = [
  { value: false, label: 'No' },
  { value: true, label: 'Yes' },
];

class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelect');
  }

  create() {
    GameState.reset();
    // null on any of these four means "leave it random" — resolved only
    // when Begin is pressed, same real odds Demographics.js always used.
    this.picked = { race: null, gender: null, isRural: null, hasDisability: null };
    this._render();
  }

  _render() {
    this.children.removeAll();
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0xf4ecd8);

    this.add.text(width / 2, 12, 'Choose your character', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#1a1a1a',
    }).setOrigin(0.5, 0);
    this.add.text(width / 2, 39, 'Pick as much as you want. Anything left unset is randomly assigned — same real odds either way.', {
      fontFamily: 'Georgia, serif', fontSize: '12px', color: '#777777',
    }).setOrigin(0.5, 0);

    const randomizeBox = this.add.rectangle(width / 2, 62, 220, 26, 0xf4ecd8).setStrokeStyle(2, 0xa32d2d).setInteractive({ useHandCursor: true });
    this.add.text(width / 2, 62, '🎲 Randomize everything', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#a32d2d',
    }).setOrigin(0.5);
    randomizeBox.on('pointerdown', () => this._randomizeAll());

    this._renderRow(94, 'RACE', RACE_OPTIONS, this.picked.race, (value) => {
      this.picked.race = value;
      // A gender/setting/disability pick doesn't depend on race, but the
      // archetype LABEL preview below does — re-render so it updates.
      this._render();
    });

    const raceForPreview = this.picked.race;
    if (raceForPreview) {
      const archetype = CHARACTERS[ARCHETYPE_BY_RACE[raceForPreview]];
      this.add.text(width / 2, 152, archetype.label, {
        fontFamily: 'Georgia, serif', fontSize: '12px', color: '#a32d2d', fontStyle: 'italic',
      }).setOrigin(0.5, 0);
    }

    const genderOptions = this._genderOptions();
    this._renderRow(178, 'GENDER', genderOptions, this.picked.gender, (value) => {
      this.picked.gender = value;
      this._render();
    });

    this._renderRow(248, 'SETTING', SETTING_OPTIONS, this.picked.isRural, (value) => {
      this.picked.isRural = value;
      this._render();
    });

    this._renderRow(318, 'DISABILITY', DISABILITY_OPTIONS, this.picked.hasDisability, (value) => {
      this.picked.hasDisability = value;
      this._render();
    });

    this.add.text(width / 2, 394, this._summaryText(), {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#444444', align: 'center', wordWrap: { width: 620 },
    }).setOrigin(0.5, 0);

    const beginBox = this.add.rectangle(width / 2, height - 45, 300, 52, 0x1a1a1a).setInteractive({ useHandCursor: true });
    this.add.text(width / 2, height - 45, 'Begin the run', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#f4ecd8',
    }).setOrigin(0.5);
    beginBox.on('pointerdown', () => this._begin());
  }

  // "add an option that will create a random roll and assign everything
  // randomly" — distinct from just leaving every row untouched (which
  // already does the same thing silently at Begin): this rolls
  // immediately, using the exact same Demographics functions the real
  // random path uses, and SHOWS the result as this run's picks so the
  // player can see what they got and still override any one axis before
  // committing. Since every axis ends up non-null here, _begin() won't
  // re-roll anything afterward — what you see is what you'll get.
  _randomizeAll() {
    const race = Demographics.rollArchetypeRace();
    const archetype = CHARACTERS[ARCHETYPE_BY_RACE[race]];
    const genderKeys = Object.keys(archetype.genders);
    this.picked = {
      race,
      gender: genderKeys[Math.floor(Math.random() * genderKeys.length)],
      isRural: Demographics.rollRurality(),
      hasDisability: Demographics.rollDisability(race),
    };
    this._render();
  }

  // Every archetype today shares the same {male, female} shape (see
  // characters/index.js), but this reads it from the actual selected
  // archetype rather than hardcoding it, so a future archetype with a
  // different gender set is still handled correctly. With no race picked
  // yet, every archetype's gender keys are identical anyway, so latino's
  // is a safe stand-in for "what genders exist at all."
  _genderOptions() {
    const archetype = CHARACTERS[this.picked.race ? ARCHETYPE_BY_RACE[this.picked.race] : ARCHETYPE_BY_RACE.latino];
    return Object.keys(archetype.genders).map((key) => ({ value: key, label: archetype.genders[key].label }));
  }

  _summaryText() {
    const race = this.picked.race ? RACE_OPTIONS.find((o) => o.value === this.picked.race).label : 'a random race';
    const gender = this.picked.gender ? this._genderOptions().find((o) => o.value === this.picked.gender).label.toLowerCase() : 'a random gender';
    const setting = this.picked.isRural === null ? 'a random setting' : (this.picked.isRural ? 'rural' : 'urban');
    const disability = this.picked.hasDisability === null ? 'a random disability status' : (this.picked.hasDisability ? 'with a disability' : 'without a disability');
    return `This run: ${race}, ${gender}, ${setting}, ${disability}.`;
  }

  _renderRow(y, label, options, currentValue, onSelect) {
    const { width } = this.scale;
    this.add.text(width / 2, y, label, {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888', letterSpacing: 1,
    }).setOrigin(0.5, 0);

    const btnWidth = 150;
    const gap = 12;
    const totalWidth = options.length * btnWidth + (options.length - 1) * gap;
    const startX = width / 2 - totalWidth / 2 + btnWidth / 2;
    const btnY = y + 34;

    options.forEach((option, i) => {
      const x = startX + i * (btnWidth + gap);
      const selected = currentValue === option.value;
      const box = this.add.rectangle(x, btnY, btnWidth, 40, selected ? 0x1a1a1a : 0xf4ecd8)
        .setStrokeStyle(2, selected ? 0x1a1a1a : 0x999999)
        .setInteractive({ useHandCursor: true });
      this.add.text(x, btnY, option.label, {
        fontFamily: 'Georgia, serif', fontSize: '14px', color: selected ? '#f4ecd8' : '#1a1a1a',
      }).setOrigin(0.5);
      box.on('pointerdown', () => onSelect(option.value));
    });
  }

  _begin() {
    const race = this.picked.race || Demographics.rollArchetypeRace();
    const archetypeId = ARCHETYPE_BY_RACE[race];
    const archetype = CHARACTERS[archetypeId];
    const genderKeys = Object.keys(archetype.genders);
    const gender = this.picked.gender && archetype.genders[this.picked.gender]
      ? this.picked.gender
      : genderKeys[Math.floor(Math.random() * genderKeys.length)];

    GameState.race = race;
    GameState.archetypeId = archetypeId;
    GameState.character = gender;
    GameState.annualIncome = archetype.genders[gender].annualIncome;

    // Same building blocks Demographics.rollAndApply() already used
    // internally, just letting an explicit pick stand in for the roll on
    // whichever axis the player actually touched.
    GameState.hasDisability = this.picked.hasDisability !== null ? this.picked.hasDisability : Demographics.rollDisability(race);
    GameState.isRural = this.picked.isRural !== null ? this.picked.isRural : Demographics.rollRurality();
    Demographics.applyIncomeModifiers(GameState);

    this.scene.start('Baseline1');
  }
}

export default CharacterSelectScene;
