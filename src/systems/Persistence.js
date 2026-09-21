import GameState from './GameState.js';

// Autosave/resume — there was previously no localStorage use anywhere in
// this project and no beforeunload warning, so a refresh, crash, or
// accidental tab close at any point in the ~20-30 minute playthrough lost
// everything silently. PersistenceScene calls save() on a timer rather
// than this module hooking every individual scene's create(), so adding
// a new scene never risks forgetting to wire it in.
const STORAGE_KEY = 'homeownership-save';

function save(sceneKey) {
  try {
    // JSON.stringify silently drops function-valued properties, so
    // GameState.reset (its only method) is never written — no manual
    // field exclusion needed.
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ gameState: GameState, sceneKey }));
  } catch (e) {
    // Private-browsing/storage-full/etc. — autosave is a convenience,
    // never something that should break the game if it fails.
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.sceneKey || !parsed.gameState) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

function clear() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Nothing to do if storage itself is unavailable.
  }
}

export default { save, load, clear };
