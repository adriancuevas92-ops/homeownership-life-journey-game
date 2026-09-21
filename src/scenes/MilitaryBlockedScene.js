// Reached from Downtown's Recruiting Station hotspot instead of
// MilitaryStats, latino-1986 only. Per direction (2026-09-21, following
// a player audit that found the Military path offered identically to
// every archetype with no gate): latino-1986's own synopsisRules state
// the player character is personally undocumented until DACA arrives in
// 2012; the Level 2 path choice happens at "the turn of the millennium"
// (AdulthoodWorld1's own framing) — a decade-plus before that. Standard
// enlistment has always required citizenship or lawful permanent
// residency; the one narrow historical exception (MAVNI, opened to DACA
// recipients specifically in October 2014, suspended 2016) doesn't exist
// yet either at this point in the story, and wouldn't have covered an
// undocumented — not-yet-DACA — status regardless. Rather than silently
// allowing a choice this specific family's own circumstance rules out,
// the door itself becomes content: a real, sourced, in-world reason,
// same register as everything else this game blocks or costs a player.
//
// Text only, no illustration — same convention as SpecialCircumstance
// Scene/KitchenTablePreEndingScene: a title card the player sits with
// and dismisses themselves. Single exit (back to Downtown) — there's no
// "continue forward" from a door that doesn't open.
const BODY_TEXT = [
  "You can't enlist. Not today, and not for years — the recruiter can't waive federal law, and undocumented status has never been a way around it.",
  "Even the one narrow exception the military will eventually carve out — a program letting some DACA recipients enlist — doesn't exist yet either. That's still about fourteen years off, and the country will only run it for two before shutting it down.",
  "This isn't the only door closed to this family right now. It's just the one with a uniform on the other side of it.",
].join('\n\n');

class MilitaryBlockedScene extends Phaser.Scene {
  constructor() {
    super('MilitaryBlocked');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x14181f);

    this.add.text(width / 2, height * 0.22, "THIS DOOR ISN'T OPEN TO YOU YET", {
      fontFamily: 'Georgia, serif',
      fontSize: '24px',
      color: '#e8b23a',
      letterSpacing: 1,
      align: 'center',
      wordWrap: { width: 620 },
    }).setOrigin(0.5, 0);

    this.add.text(width / 2, height * 0.38, BODY_TEXT, {
      fontFamily: 'Georgia, serif',
      fontSize: '16px',
      color: '#e8e4d8',
      align: 'center',
      wordWrap: { width: 560 },
      lineSpacing: 10,
    }).setOrigin(0.5, 0);

    this.add.text(
      width / 2, height - 70,
      '[V] DoD enlistment eligibility (citizenship/lawful permanent residency); MAVNI program, DACA-eligible Oct. 2014, suspended 2016',
      { fontFamily: 'Georgia, serif', fontSize: '10px', color: '#555555', align: 'center', wordWrap: { width: 560 } },
    ).setOrigin(0.5);

    const backBox = this.add.rectangle(width / 2, height - 30, 260, 40, 0xf4ecd8).setStrokeStyle(3, 0xe8b23a).setInteractive({ useHandCursor: true });
    this.add.text(width / 2, height - 30, '‹ back to town', {
      fontFamily: 'Georgia, serif', fontSize: '14px', color: '#1a1a1a',
    }).setOrigin(0.5);
    backBox.on('pointerdown', () => this.scene.start('Downtown'));
  }
}

export default MilitaryBlockedScene;
