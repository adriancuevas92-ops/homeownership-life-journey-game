import sys
from PIL import Image

def equalize(path_a, path_b):
    a = Image.open(path_a).convert("RGBA")
    b = Image.open(path_b).convert("RGBA")

    w = max(a.width, b.width)
    h = max(a.height, b.height)

    for path, img in [(path_a, a), (path_b, b)]:
        canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        x = (w - img.width) // 2
        y = h - img.height  # bottom-align (feet stay planted)
        canvas.paste(img, (x, y), img)
        canvas.save(path)
        print(f"{path}: padded to {canvas.size}")

if __name__ == "__main__":
    equalize(sys.argv[1], sys.argv[2])
