# Art generation style guide — locked process

This is the process that produced every backdrop and avatar sprite in
`assets/images/`. It was never written down before 2026-09-20 — every
batch of art this project generated got its prompt re-derived from
scratch by reading an existing sprite and re-describing it, which worked
because it was done carefully, but was never a locked, reusable process.
This file is that lock. Read it before generating any new art for this
project — especially the Level 3 art sweep (new races, Los Angeles
setting) this guide was written ahead of.

## The style, verbatim

Every asset in this game uses **one** consistent illustration style.
Use this exact phrase (or a close paraphrase of it) as the opening of
every generation prompt:

> Bronze Age comic book illustration, bold black ink linework, halftone
> dot shading, warm vector-flat coloring

"Bronze Age" refers to the ~1970s mainstream-comics era specifically —
the reference point (documented in the Concept doc, Section 5) is the
early-1970s Green Lantern/Green Arrow social-issue run: bold ink
outlines, flat color fills, halftone-dot shading printed as actual dots,
not smooth gradients, dramatic but grounded composition. Not manga, not
modern digital painting, not photorealism.

## Technical specs

- **Model**: `ideogram/ideogram-4.0`, called directly against Together.ai's
  Images REST API (`https://api.together.xyz/v1/images/generations`),
  bypassing the LiteLLM proxy entirely (it has no image-generation lane —
  confirmed by reading its `config.yaml` directly, not assumed).
- **Size**: `2048x2048`. `1024x1024` returns a 400 error from this
  endpoint — confirmed, not guessed.
- **Auth**: `Authorization: Bearer $TOGETHERAI_API_KEY`, sourced via
  `set -a && source "/c/Users/adria/Claude/ai-proxy/.env" && set +a`
  before the curl/python call. This `.env` file is an *external*
  dependency this project relies on but doesn't own — if it moves, every
  generation script in this project breaks silently until re-pointed.
- **Sequential calls**, not parallel — avoids 429 rate limits. A short
  `time.sleep(2)` between calls in a batch script is enough.
- **Response shape**: `data[0].url` — a *separate* URL that must be
  downloaded (`curl -sL` or `requests.get`), not the image itself.

## Sprite (character) generation specifically

- **Background**: a solid **magenta** background, not green. This
  project uses magenta by default for anything with skin tones, warm
  clothing colors, or fine details (leaves, hair) that could sit close to
  green in color space — a real bug already happened here (see "Known
  pitfalls" below). Green screen is acceptable only for subjects with no
  green/warm-toned details at all.
- **Pose**: three-quarter front view, walking mid-stride, arms swinging
  naturally, one full-body character, nothing else in frame. Every
  character needs **two frames** — `_1` (left foot forward) and `_2`
  (right foot forward) — generated as two separate calls, each prompt
  identical except the one word describing which foot is forward. This
  is a walk-cycle fake: `OverworldScene` just swaps between the two
  textures on a timer, not a real animation.
- **No background elements, no shadow, no text, no watermark** — always
  state this explicitly; the model will otherwise add environmental
  detail that then has to survive (or fights with) the chroma-key pass.

## Post-processing pipeline (both scripts already exist, don't rewrite them)

1. `python scripts/chroma_key.py <in.png> <out.png>` — samples the corner
   pixel as the key color (robust to slight per-generation background
   variance rather than assuming exact `#FF00FF`), removes every pixel
   within a Euclidean-distance threshold (default 60) of it, sets alpha
   to 0, then auto-crops to the non-transparent bounding box with 10px
   padding.
2. For any two-frame character, run
   `python scripts/equalize_frames.py <frame1.png> <frame2.png>` — pads
   both to a shared canvas, **bottom-aligned** (so the feet stay planted
   at the same y when the game swaps textures — this is the fix for a
   real bug: unequal crop heights made the character visibly jump on
   every walk-frame swap before this script existed).
3. Save the result to `assets/images/<key>.png` **and** copy it to the
   vault backup folder: `C:/Vaults/MyBrain/MyBrain/02 - Projects/
   Homeownership Life-Journey Game Assets/<key>.png`. Always both, every
   time — the vault copy is the only backup this project's art has;
   there's no git history for the binary assets (see the Technical
   Architecture doc's operational-gaps section for the git question
   generally).
4. Delete any one-off generation script (e.g. `scripts/gen_*.py`) after a
   successful run — **but first make sure any style/prompt language worth
   reusing has been folded back into this file.** A real gap this
   document exists to close: `gen_level3_avatars.py`'s `STYLE_PREFIX`
   constant was written well, used successfully for 8 sprites, then
   deleted with the script — nothing else in the repo captured it until
   now.

## Filename convention

`avatar_<gender>_<variant>_<frame>.png` — `<gender>` is `male` or
`female`; `<variant>` is empty-string (young-adult default, Level 2
start), `child` (Level 1), `final` (older civilian, Level 3), or
`military` (veteran uniform, Level 3); `<frame>` is `1` or `2`. Backdrops:
`overworld_<screenKey>.png` matching the screen's `key` in
`overworldScreens.js`, or a descriptive name for a non-overworld backdrop
(`packinghouse_floor.png`, `adulthood_millennium.png`).

## Known pitfalls (all real, all already hit once)

- **Green-hued details get eaten on a green background.** A leaf on a
  green screen, a green shirt, hair with green undertones — the
  distance-threshold key can't tell the difference. Regenerate on
  magenta instead of trying to tighten the threshold; tightening the
  threshold just leaves green fringing around the edges instead.
- **A native (non-MSYS) binary can silently fail on a long Windows path**
  (~260 char `MAX_PATH` limit) with a misleading "file not found," even
  though the file genuinely exists — check path length before assuming
  corruption if a processing step inexplicably can't find its own input.
- **The Read tool's image preview does not respect the alpha channel** —
  a correctly-chroma-keyed transparent PNG can preview as if the
  background is still there. Verify with a direct pixel/alpha check
  (PIL, `img.getpixel(...)`) before concluding the key failed; this has
  produced a false "still broken" read at least once.
- **Race/ethnicity descriptors need to be specific and respectful, not a
  single adjective.** When generating the Level 3 race-variant sprites,
  describe build, hair, skin tone, and expression the same level of
  detail already used for the existing sprites — not just "a Black man"
  — to avoid flattening into stereotype. Cross-check the result visually
  before accepting it, same as the existing QC-pass discipline (Concept
  doc Section 5).

## What still isn't parameterized

This guide is the *style* lock. It is not yet a single reusable script
that takes `{ ageStage, gender, race, setting }` and emits a finished,
chroma-keyed, vault-backed sprite in one call — every batch so far has
still been a bespoke one-off Python script written per session, deleted
after use, with this guide as the reference a human (or a future Claude
session) re-derives the actual prompt strings from. Worth building if the
race/setting sweep turns out to need many more than the ~8-16 sprites
already done — not built now because the sweep's exact scope (how many
race × life-stage × setting combinations are actually needed) isn't
locked yet.
