import GameState from '../systems/GameState.js';

// Text only, no illustration — same convention as SpecialCircumstanceScene:
// a title card the player sits with and dismisses themselves. This is the
// last "kitchen table" cutaway (Phaser Technical Architecture doc's
// narrative framework) — it lands the renter's-tax-penalty and
// credit-access "Structural Drag" conditions in plain terms right before
// the Ending's affordability numbers, so those numbers read as the payoff
// of a stated thesis instead of a cold spreadsheet result out of nowhere.
// Also carries the minimum-wage-freeze callback an earlier plan wanted as
// its own 1991 scene — there's no chronological slot for that in the
// current game (nothing covers childhood/adolescence before ComingOfAge),
// so it's folded in here instead of being dropped.
//
// Found live during a narrative audit (2026-09-21): this was one fixed
// string shown to every archetype, including the line "policy worked
// against this family... saving still doesn't count the same
// everywhere" — true for latino-1986/black-1986/asian-1986 (each
// carries a real credit-access or savings-rate penalty), but flatly
// false for white-1986, which CircumstanceOriginWhite already told this
// same player, screens earlier, carries NO extra penalty on purpose
// ("No line just executed to make this harder... that absence is
// itself real, documented history"). One scene said the system worked
// against this family; this one said the opposite. Split into a
// default (unchanged, still accurate for the other three) and a
// white-1986 variant that keeps the one genuinely universal fact (the
// wage freeze, a Baseline1 condition every archetype carries) and
// replaces the credit-access line with what's actually true here.
const REFLECTION_TEXT_BY_ARCHETYPE = {
  // Kept close to the default's own length on purpose (see below) —
  // this text block sits in a fixed layout with "press SPACE" pinned
  // below it; a first draft ran noticeably longer than the default and
  // visibly overlapped that line.
  'white-1986': [
    "The wage that finally moved in 1991 never made up for the nine years it didn't — same as it did for every family in this game.",
    "The tax code has favored homeowners since 1986, same as it has for everyone here. What's different for this family is what else never happened: no steered loan, no locked door, nothing extra working against them in the background.",
    "None of that is the reason you haven't gotten here yet. It's the weather everyone did this in — just without the extra front most families here also had to walk through.",
  ].join('\n\n'),
  default: [
    "The wage that finally moved in 1991 never made up for the nine years it didn't.",
    "The tax code has favored homeowners since 1986. Every year spent renting instead of owning was a year that policy worked against this family, not for it. And however carefully they've kept their accounts, saving still doesn't count the same everywhere.",
    "None of that is the reason you haven't gotten here yet. It's the weather you did it in.",
  ].join('\n\n'),
};

class KitchenTablePreEndingScene extends Phaser.Scene {
  constructor() {
    super('KitchenTablePreEnding');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f);

    this.add.text(width / 2, height * 0.16, 'WHAT IT ADDED UP TO', {
      fontFamily: 'Georgia, serif',
      fontSize: '24px',
      color: '#e8b23a',
      letterSpacing: 2,
    }).setOrigin(0.5);

    // Anchored at its top edge (origin y: 0), not centered — this body is
    // three paragraphs, taller than SpecialCircumstanceScene's two, and a
    // center-anchored block that tall pushed its first line up into the
    // title above it.
    const reflectionText = REFLECTION_TEXT_BY_ARCHETYPE[GameState.archetypeId] || REFLECTION_TEXT_BY_ARCHETYPE.default;
    this.add.text(width / 2, height * 0.26, reflectionText, {
      fontFamily: 'Georgia, serif',
      fontSize: '17px',
      color: '#e8e4d8',
      align: 'center',
      wordWrap: { width: 560 },
      lineSpacing: 10,
    }).setOrigin(0.5, 0);

    this.add.text(width / 2, height - 40, 'press SPACE or click to continue', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#777777',
    }).setOrigin(0.5);

    this.backButton = this.add.text(20, height - 16, '‹ back', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true });
    this.backButton.on('pointerdown', (pointer, x, y, event) => {
      event.stopPropagation();
      // startAtEnd, same convention ComicScene's own back-nav uses — a
      // plain scene.start('WorkingYears') would restart its stepIndex at
      // -1 and re-roll its three job-disruption steps, double-applying
      // their savingsJar effects.
      this.scene.start('WorkingYears', { startAtEnd: true });
    });

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this._continue());
    this.input.on('pointerdown', () => this._continue());
  }

  _continue() {
    // Level 3's stage, not the results themselves — walk to the realty
    // office, then entering it is what actually triggers Ending. Spawn
    // at the left edge so there's an actual walk to the door, same
    // enterFrom convention every screen-to-screen edge transition uses.
    // Which office depends on the same rolled setting Synopsis's SETTING
    // rule and Ending's home-price tier already use — Fresno stays
    // Fresno, everyone else lands in the Los Angeles storefront.
    const destination = GameState.isRural ? 'Realty' : 'RealtyLA';
    this.scene.start(destination, { enterFrom: 'left' });
  }
}

export default KitchenTablePreEndingScene;
