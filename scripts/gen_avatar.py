"""Parameterized avatar sprite generator.

Locked style, per scripts/ART_STYLE_GUIDE.md — read that file before
changing anything here. This is the "worth building once the sweep needs
many more than ~8-16 sprites" script that guide flagged; the Level 3
race/life-stage sweep is that trigger.

Usage:
    python scripts/gen_avatar.py <gender> <race> <lifeStage> <frame>

    gender:    male | female
    race:      white | black | asian | latino
    lifeStage: child | adult | final | military   (adult = no filename suffix)
    frame:     1 | 2   (left-foot-forward | right-foot-forward)

Writes the raw generation to assets/images/_raw/, chroma-keys it in
place, and leaves the keyed file for equalize_frames.py + manual review
before it gets moved into assets/images/ under its real filename
(avatar_<gender>_<lifeStage-or-nothing>_<frame>.png). Deliberately does
NOT auto-promote to the final path — every sprite this project has
shipped went through a visual QC pass first (Concept doc Section 5's
"QC pass" discipline), and this script doesn't skip that.
"""
import os
import sys
import time
import subprocess
import requests

API_KEY = os.environ["TOGETHERAI_API_KEY"]
SCRIPT_DIR = os.path.dirname(__file__)
RAW_DIR = os.path.join(SCRIPT_DIR, "..", "assets", "images", "_raw")
os.makedirs(RAW_DIR, exist_ok=True)

STYLE_PREFIX = (
    "Bronze Age comic book illustration, bold black ink linework, halftone "
    "dot shading, warm vector-flat coloring, full-body character walking "
    "mid-stride, three-quarter front view, solid magenta background, no "
    "ground shadow, no text, no watermark. "
)

# [E] Descriptive, not a single flattening adjective, per the style
# guide's own pitfall note — build, hair, skin tone are named the same
# way the original archetype's sprites were.
RACE_DESCRIPTORS = {
    "white": "white American, fair skin, light brown hair",
    "black": "Black American, deep brown skin, black hair",
    "asian": "Asian American, warm tan skin, straight black hair",
    "latino": "Latino, warm brown skin, dark brown hair",
}

LIFE_STAGE = {
    "child": {
        "age_desc": "a child, about 8 years old",
        "clothing": "a simple t-shirt, shorts, and a small backpack",
        "gender_noun": {"male": "boy", "female": "girl"},
    },
    "adult": {
        "age_desc": "a young adult in their early twenties",
        "clothing": "a casual t-shirt and jeans, sneakers",
        "gender_noun": {"male": "man", "female": "woman"},
    },
    "final": {
        "age_desc": "a person in their early forties with some gray at the temples",
        "clothing": "a collared shirt tucked into slacks, leather shoes",
        "gender_noun": {"male": "man", "female": "woman"},
    },
    "military": {
        "age_desc": "a person in their early forties",
        "clothing": (
            "a plain olive-green military service uniform with no name tape, "
            "no rank insignia, no medals, no unit patches, and no visible text "
            "anywhere on the uniform, short military haircut, polished black boots"
        ),
        "gender_noun": {"male": "man", "female": "woman"},
    },
}

FOOT = {"1": "left foot forward", "2": "right foot forward"}


def build_prompt(gender, race, life_stage, frame):
    stage = LIFE_STAGE[life_stage]
    race_desc = RACE_DESCRIPTORS[race]
    noun = stage["gender_noun"][gender]
    foot = FOOT[frame]
    return (
        f"{STYLE_PREFIX}A {race_desc} {noun}, {stage['age_desc']}, wearing "
        f"{stage['clothing']}, walking with {foot}, arms swinging naturally."
    )


def filename_key(gender, race, life_stage, frame):
    suffix = "" if life_stage == "adult" else f"_{life_stage}"
    race_infix = "" if race == "latino" else f"_{race}"
    # latino stays unsuffixed (the existing, already-shipped baseline);
    # every other race gets its own filename segment so it never collides.
    return f"avatar_{gender}{race_infix}{suffix}_{frame}"


def generate(gender, race, life_stage, frame):
    key = filename_key(gender, race, life_stage, frame)
    prompt = build_prompt(gender, race, life_stage, frame)
    print(f"[{key}] generating...")
    resp = requests.post(
        "https://api.together.xyz/v1/images/generations",
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        json={"model": "ideogram/ideogram-4.0", "prompt": prompt, "width": 2048, "height": 2048},
        timeout=120,
    )
    resp.raise_for_status()
    url = resp.json()["data"][0]["url"]
    img = requests.get(url, timeout=60)
    img.raise_for_status()
    raw_path = os.path.join(RAW_DIR, f"{key}.png")
    with open(raw_path, "wb") as f:
        f.write(img.content)
    keyed_path = os.path.join(RAW_DIR, f"{key}_keyed.png")
    subprocess.run(["python", os.path.join(SCRIPT_DIR, "chroma_key.py"), raw_path, keyed_path], check=True)
    print(f"[{key}] saved -> {keyed_path}")
    return keyed_path


if __name__ == "__main__":
    gender, race, life_stage, frame = sys.argv[1:5]
    generate(gender, race, life_stage, frame)
