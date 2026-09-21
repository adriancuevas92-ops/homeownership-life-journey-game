// Gates the staging dev menu (DebugOverlayScene) out of what a real
// player loads. No bundler/build step exists in this project (static
// ES modules served by `python -m http.server`), so there's no
// environment-variable injection to key off — a URL flag is the
// equivalent that works identically under that setup. QA/development
// keeps full access at http://localhost:8458/?dev=1; the bare URL never
// even loads the scene.
export const IS_DEV_MODE = new URLSearchParams(window.location.search).has('dev');
