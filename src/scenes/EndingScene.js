import GameState from '../systems/GameState.js';
import Affordability from '../systems/Affordability.js';
import CHARACTERS from '../data/characters/index.js';

// The Realty office door leads here every time, not just once. Per
// direction: "if they can buy a house they can end the game, but if they
// can't buy a house then they can try to improve." So this is a
// check-in, not a one-shot ending — the only truly terminal states are
// (a) the player deliberately closes on a home, or (b) every improvement
// avenue (CareerAdvancement's college/business moves, the one-shot
// jackpot) has already been spent and it still doesn't pass. Anything
// else routes back to Downtown to go try one of those.
//
// Single question now, not a 3-tier comparison table — per direction, no
// relocate-to-somewhere-cheaper escape valve (Peoria, the national
// blend). Just: is homeownership in California — whichever city this
// run rolled, see the archetype's homeTiers — possible or not.
class EndingScene extends Phaser.Scene {
  constructor() {
    super('Ending');
  }

  create() {
    this._render();
  }

  _hasMoreToTry() {
    return !GameState.hasAttemptedCollegeAdvancement
      || !GameState.hasAttemptedCareerMove
      || !GameState.hasAttemptedJackpotTest;
  }

  _render() {
    this.children.removeAll();
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0xf4ecd8);

    const tierConfig = CHARACTERS[GameState.archetypeId].homeTiers;
    const homeTiers = typeof tierConfig === 'function' ? tierConfig(GameState) : tierConfig;
    const tier = homeTiers[0];
    const result = {
      tier: tier.name,
      homePrice: tier.homePrice,
      ...Affordability.check(tier.homePrice, GameState.savingsJar, GameState.annualIncome, GameState.hasMainstreamCredit, GameState.isVeteran),
    };
    GameState.affordabilityResults = [result];
    this.result = result;

    this.add.text(width / 2, 40, 'Where you stand', {
      fontFamily: 'Georgia, serif', fontSize: '30px', color: '#1a1a1a',
    }).setOrigin(0.5, 0);

    this.add.text(
      width / 2, 90,
      `Savings jar: $${GameState.savingsJar.toLocaleString()}    Annual income: $${GameState.annualIncome.toLocaleString()}`,
      { fontFamily: 'Georgia, serif', fontSize: '16px', color: '#444444' },
    ).setOrigin(0.5, 0);

    this.add.text(width / 2, 160, `Homeownership in ${tier.name}?`, {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#1a1a1a',
    }).setOrigin(0.5, 0);

    const color = result.passes ? 0x639922 : 0xe24b4a;
    this.add.text(width / 2, 200, result.passes ? 'YES' : 'NOT YET', {
      fontFamily: 'Georgia, serif', fontSize: '40px', color: result.passes ? '#3b6d11' : '#a32d2d', letterSpacing: 3,
    }).setOrigin(0.5, 0);

    this.add.rectangle(width / 2, 280, 500, 2, color, 0.5);
    this.add.text(
      width / 2, 300,
      `Home price: $${tier.homePrice.toLocaleString()}   Cash to close: $${result.cashToClose.toLocaleString()}   Income needed: $${result.incomeNeeded.toLocaleString()}/yr`,
      { fontFamily: 'Georgia, serif', fontSize: '14px', color: '#555555', align: 'center', wordWrap: { width: 560 } },
    ).setOrigin(0.5, 0);

    if (result.passes) {
      this._renderQualifiedFooter(360);
    } else {
      this._renderNotYetFooter(360);
    }
  }

  _renderQualifiedFooter(y) {
    const { width, height } = this.scale;
    this.add.text(width / 2, y, "You qualify. Close here, or keep pushing to see if you can do better.", {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#1a1a1a', align: 'center', wordWrap: { width: 560 },
    }).setOrigin(0.5, 0);
    this._makeButton(width / 2, y + 60, 'Close here', () => this._closeOnHome(this.result), 0x639922);
    if (this._hasMoreToTry()) {
      this._makeButton(width / 2, height - 40, 'Keep pushing for something better ‹ back to town', () => this.scene.start('Downtown'));
    }
  }

  _renderNotYetFooter(y) {
    const { width, height } = this.scale;
    if (this._hasMoreToTry()) {
      this.add.text(width / 2, y, 'Not yet. You still have moves left.', {
        fontFamily: 'Georgia, serif', fontSize: '15px', color: '#1a1a1a', align: 'center', wordWrap: { width: 560 },
      }).setOrigin(0.5, 0);
      this._makeButton(width / 2, height - 40, 'Go try to improve your chances ‹ back to town', () => this.scene.start('Downtown'));
    } else {
      this.add.text(
        width / 2, y,
        "Not yet, and that's the whole hand — college, the career move, the jackpot shot, all spent. The median first-time homebuyer bought their first home at 29 in 1981. That held roughly flat for forty years, then jumped to 40 by 2025 — the same stretch this run just lived through.",
        { fontFamily: 'Georgia, serif', fontSize: '14px', color: '#444444', align: 'center', wordWrap: { width: 580 }, lineSpacing: 6 },
      ).setOrigin(0.5, 0);
      // Found live during a player audit (2026-09-21): this was a real
      // dead end — no button anywhere on this screen, and the only way
      // out was a manual refresh, which then hits the resume prompt
      // instead of a clean new run. Same fix as the win state below.
      this._makeButton(width / 2, height - 40, 'Play again', () => this.scene.start('CharacterSelect'));
    }
  }

  _closeOnHome(result) {
    this.children.removeAll();
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f);
    this.add.text(width / 2, height * 0.35, 'YOU CLOSED', {
      fontFamily: 'Georgia, serif', fontSize: '32px', color: '#e8b23a', letterSpacing: 2,
    }).setOrigin(0.5);
    this.add.text(
      width / 2, height * 0.48,
      `${result.tier} — $${result.homePrice.toLocaleString()}.\nCash to close: $${result.cashToClose.toLocaleString()}. Monthly: $${result.monthlyHousing.toLocaleString()}.`,
      { fontFamily: 'Georgia, serif', fontSize: '17px', color: '#e8e4d8', align: 'center', wordWrap: { width: 520 }, lineSpacing: 10 },
    ).setOrigin(0.5);
    this.add.text(
      width / 2, height * 0.7,
      "The median first-time homebuyer bought their first home at 29 in 1981.\nThat held roughly flat for forty years, then jumped to 40 by 2025 —\nthe same stretch this run just lived through.",
      { fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888', align: 'center' },
    ).setOrigin(0.5);
    // Found live during a player audit (2026-09-21): reaching this
    // screen was a genuine dead end — no button, no acknowledged "the
    // end" state, just a manual refresh away from the resume prompt
    // instead of a clean new run.
    this._makeButton(width / 2, height * 0.85, 'Play again', () => this.scene.start('CharacterSelect'));
  }

  _makeButton(x, y, label, onClick, fillColor = 0xf4ecd8) {
    const textColor = fillColor === 0xf4ecd8 ? '#1a1a1a' : '#ffffff';
    const box = this.add.rectangle(x, y, 420, 40, fillColor).setStrokeStyle(3, 0xe8b23a).setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, { fontFamily: 'Georgia, serif', fontSize: '14px', color: textColor }).setOrigin(0.5);
    box.on('pointerdown', () => onClick());
    return { box, text };
  }
}

export default EndingScene;
