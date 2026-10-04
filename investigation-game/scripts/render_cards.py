"""Render one PNG per content card for a location video.

Usage: python render_cards.py <cards.json> <out_dir>
cards.json: [{"h": "...", "p": "..."}, ...]
"""
import json
import os
import sys
from PIL import Image, ImageDraw, ImageFont

W, H = 1280, 720
CREAM = (250, 246, 236)
BLACK = (0, 0, 0)
GRAY = (95, 95, 95)
FONT_BOLD = r"C:\Windows\Fonts\ARIALNB.TTF"
FONT_REG = r"C:\Windows\Fonts\ARIALN.TTF"


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=font) <= max_w:
            cur = test
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def render(card, path, index, total):
    img = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(img)
    d.rectangle([24, 24, W - 24, H - 24], outline=BLACK, width=6)
    f_head = ImageFont.truetype(FONT_BOLD, 56)
    f_body = ImageFont.truetype(FONT_REG, 34)
    f_count = ImageFont.truetype(FONT_REG, 22)
    margin = 90
    max_w = W - 2 * margin
    y = 110
    for line in wrap(d, card["h"], f_head, max_w):
        d.text((margin, y), line, font=f_head, fill=BLACK)
        y += 68
    y += 26
    for line in wrap(d, card["p"], f_body, max_w):
        d.text((margin, y), line, font=f_body, fill=BLACK)
        y += 46
    d.text((margin, H - 70), f"{index + 1} / {total}", font=f_count, fill=GRAY)
    img.save(path)


if __name__ == "__main__":
    cards_path, out_dir = sys.argv[1], sys.argv[2]
    with open(cards_path, encoding="utf-8") as f:
        cards = json.load(f)
    os.makedirs(out_dir, exist_ok=True)
    for i, card in enumerate(cards):
        render(card, os.path.join(out_dir, f"card{i:02d}.png"), i, len(cards))
    print(f"rendered {len(cards)} cards to {out_dir}")
