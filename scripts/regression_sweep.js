// Cross-scenario regression sweep — paste this whole file into the
// browser console (or a javascript_tool call) while the game is loaded
// at any URL. Requires window.game and the DebugOverlay scene to exist
// (both are always present — DebugOverlayScene launches at boot).
//
// This has been retyped from memory into the console repeatedly this
// project's history rather than run from one saved script, which risks
// silent drift between runs. This file is that fix — extend it in place
// rather than rewriting it fresh next time.
//
// Checks, for every valid (gender x graduate/dropout x path) combination:
//   - child avatar at Home
//   - default young-adult avatar at HomeAdult (pre-path)
//   - aged "final"/"military" avatar at Downtown (post-path)
//   - Ending computes a single-tier affordability result with no throw
//
// Usage: copy this whole file's contents into the console. Prints a
// JSON summary; every `allOk: true` is a pass.

(async () => {
  const gsMod = await import('/src/systems/GameState.js');
  const GameState = gsMod.default;
  const manager = window.game.scene;
  const overlay = manager.getScene('DebugOverlay');

  function jump(key) { overlay._jumpTo(key); }
  async function wait(ms) { await new Promise((r) => setTimeout(r, ms)); }

  async function checkAvatar(sceneKey, expectedVariantSuffix, gender) {
    jump(sceneKey);
    await wait(350);
    const scene = manager.getScene(sceneKey);
    const expected = `avatar_${gender}${expectedVariantSuffix}_1`;
    const actual = scene && scene.avatarKeys ? scene.avatarKeys[0] : 'NO SCENE/AVATARKEYS';
    return { sceneKey, expected, actual, ok: actual === expected };
  }

  const SCENARIOS = [
    { gender: 'male', grad: true, path: 'college' },
    { gender: 'male', grad: true, path: 'military' },
    { gender: 'male', grad: true, path: 'workforce' },
    { gender: 'male', grad: false, path: 'college' },
    { gender: 'male', grad: false, path: 'workforce' },
    { gender: 'female', grad: true, path: 'college' },
    { gender: 'female', grad: true, path: 'military' },
    { gender: 'female', grad: true, path: 'workforce' },
    { gender: 'female', grad: false, path: 'college' },
    { gender: 'female', grad: false, path: 'workforce' },
  ];

  const results = [];
  for (const sc of SCENARIOS) {
    const tag = `${sc.gender}/${sc.grad ? 'grad' : 'dropout'}/${sc.path}`;
    const rows = [];

    GameState.reset();
    GameState.character = sc.gender;
    GameState.annualIncome = sc.gender === 'male' ? 41500 : 22452;
    GameState.isHighSchoolGraduate = sc.grad;
    GameState.savingsJar = 10000;

    rows.push(await checkAvatar('Home', '_child', sc.gender));
    rows.push(await checkAvatar('HomeAdult', '', sc.gender));

    if (sc.path === 'college') GameState.pathTaken = 'college';
    else if (sc.path === 'military') { GameState.pathTaken = 'military'; GameState.isVeteran = true; }
    else GameState.pathTaken = 'workforce';

    const suffix = sc.path === 'military' ? '_military' : '_final';
    rows.push(await checkAvatar('Downtown', suffix, sc.gender));
    rows.push(await checkAvatar('Realty', suffix, sc.gender));

    jump('Ending');
    await wait(350);
    const endingOk = Array.isArray(GameState.affordabilityResults)
      && GameState.affordabilityResults.length === 1
      && !!GameState.affordabilityResults[0].tier;
    rows.push({ sceneKey: 'Ending computes', ok: endingOk });

    results.push({ tag, allOk: rows.every((r) => r.ok), failures: rows.filter((r) => !r.ok) });
  }

  console.log(JSON.stringify(results, null, 1));
  return results;
})();
