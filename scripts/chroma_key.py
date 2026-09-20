import sys
from PIL import Image

def remove_green(in_path, out_path, tolerance=60):
    img = Image.open(in_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    # Sample the corner to get the actual chroma color used (robust to
    # slight rendering variance rather than assuming exact 00FF00).
    key_r, key_g, key_b, _ = pixels[2, 2]

    min_x, min_y, max_x, max_y = width, height, 0, 0

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            dist = ((r - key_r) ** 2 + (g - key_g) ** 2 + (b - key_b) ** 2) ** 0.5
            if dist < tolerance:
                pixels[x, y] = (r, g, b, 0)
            else:
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y

    padding = 10
    box = (
        max(0, min_x - padding),
        max(0, min_y - padding),
        min(width, max_x + 1 + padding),
        min(height, max_y + 1 + padding),
    )
    cropped = img.crop(box)
    cropped.save(out_path)
    print(f"{in_path} -> {out_path}: cropped to {cropped.size}, key color ({key_r},{key_g},{key_b})")

if __name__ == "__main__":
    remove_green(sys.argv[1], sys.argv[2])
