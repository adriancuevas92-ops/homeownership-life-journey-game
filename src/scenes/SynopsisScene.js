import GameState from '../systems/GameState.js';

// Rewritten from a narrative bio into something closer to a rule book —
// the mechanical facts governing this playthrough, not a story. Draws
// directly on the five locked factors (Concept doc Section 21): income,
// marital status, wealth/savings, race/ethnicity, and — gender-
// conditionally — the same wage-gap modifier already in
// CharacterSelectScene. `SpecialCircumstanceScene` (immediately before
// this one) still carries the thematic "you will play this undocumented"
// statement; this page's job is different — state the constraints
// plainly, like a player would expect from an actual rules page. It sits
// last in the pre-game sequence, right before the avatar overworld
// screen (Home) — the final "here's what you're playing with" beat
// before control hands over to the player.
const RACE_LABELS = { white: 'WHITE', black: 'BLACK', latino: 'LATINO', asian: 'ASIAN AMERICAN' };

// `state` used to just be the character (gender) string — now the full
// GameState, since the RACE/SETTING/DISABILITY rules below are real
// rolled facts (Demographics.js), not a fixed placeholder line. The
// "would have applied regardless" framing on RACE stays literally true:
// it's rolled independently of documentation status, income, or any of
// the other rules above it.
function buildRules(state) {
  const rules = [
    'BORN 1981. ARRIVED FRESNO, CALIFORNIA, 1986 — THREE YEARS AFTER THE CUTOFF FOR THE ONE AMNESTY LAW THAT COULD HAVE CHANGED EVERYTHING BELOW.',
    'STATUS — UNDOCUMENTED UNTIL DACA, 2012. THIS IS THE HINGE MOST OF THE OTHER RULES SWING ON.',
    'INCOME — REDUCED BY A REAL, DOCUMENTED WAGE PENALTY UNTIL WORK AUTHORIZATION ARRIVES.',
    'CREDIT — LOCKED OUT OF MAINSTREAM BANKING FOR MOST OF EARLY ADULTHOOD. SAVINGS DON’T BUILD A CREDIT HISTORY THE WAY THEY WOULD FOR A BANKED HOUSEHOLD.',
    'MARRIAGE — BEFORE 2013, MARRYING A U.S. CITIZEN DID NOT FIX THIS. IT MEANT A REAL LEGAL RISK INSTEAD.',
    `RACE — ${RACE_LABELS[state.race] || 'UNSET'}. A SEPARATE RULE, NOT CAUSED BY ANY OF THE ABOVE. THIS ONE WOULD HAVE APPLIED REGARDLESS.`,
    `SETTING — ${state.isRural ? 'FRESNO. RURAL CALIFORNIA, AGRICULTURAL AS MUCH AS URBAN.' : 'LOS ANGELES INSTEAD OF FRESNO. BIGGER CITY, BIGGER PRICES.'}`,
  ];
  if (state.character === 'female') {
    rules.push('GENDER — ON TOP OF EVERYTHING ABOVE, WAGES ARE FURTHER REDUCED RELATIVE TO THE SAME WORK DONE BY A MAN.');
  }
  if (state.hasDisability) {
    rules.push('DISABILITY — ONE MORE REAL RULE, NOT CAUSED BY ANY ABOVE IT: LOWER ODDS OF WORKING AT ALL, LOWER PAY WHEN WORKING.');
  }
  rules.push('THIS IS NOT A DIFFICULTY SETTING. IT’S THE DOCUMENTED EXPERIENCE OF MILLIONS OF FAMILIES WHO ARRIVED THE SAME YEAR YOURS DID.');
  return rules.join('\n');
}

class SynopsisScene extends Phaser.Scene {
  constructor() {
    super('Synopsis');
  }

  preload() {
    // Reuses the overworld walk-cycle's first frame as a standing portrait
    // rather than generating a dedicated pose — a mid-stride comic-style
    // pose still reads fine as a character reveal.
    this.avatarKey = `avatar_${GameState.character}_1`;
    if (!this.textures.exists(this.avatarKey)) {
      this.load.image(this.avatarKey, `assets/images/${this.avatarKey}.png`);
    }
  }

  create(data) {
    const { width, height } = this.scale;

    // Reached mid-game (e.g. the Home screen's front door) as a dead-end
    // status check rather than the pre-intro character reveal — continuing
    // or going back both just return to wherever the player came from,
    // instead of re-triggering the Baseline1-3 intro sequence.
    this.returnTo = data && data.returnTo;

    this.add.rectangle(width / 2, height / 2, width, height, 0xf4ecd8);

    const avatar = this.add.image(150, height / 2, this.avatarKey);
    const tex = this.textures.get(this.avatarKey).getSourceImage();
    avatar.setScale(300 / tex.height);
    avatar.setOrigin(0.5);

    this.add.text(300, 45, 'THE RULES OF THIS RUN', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#1a1a1a',
    });

    this.add.text(300, 80, buildRules(GameState), {
      fontFamily: 'Georgia, serif',
      fontSize: '12px',
      color: '#333333',
      wordWrap: { width: 480 },
      lineSpacing: 7,
    });

    this.add.text(width / 2, height - 40, this.returnTo ? 'press SPACE or click to return' : 'press SPACE or click to continue', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
    }).setOrigin(0.5);

    if (!this.returnTo) {
      this.backButton = this.add.text(20, height - 16, '‹ back', {
        fontFamily: 'Georgia, serif', fontSize: '13px', color: '#888888',
      }).setOrigin(0, 1).setInteractive({ useHandCursor: true });
      this.backButton.on('pointerdown', (pointer, x, y, event) => {
        event.stopPropagation();
        this.scene.start('DemographicContext');
      });
    }

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this._continue());
    this.input.on('pointerdown', () => this._continue());
  }

  _continue() {
    this.scene.start(this.returnTo || 'Home');
  }
}

export default SynopsisScene;
