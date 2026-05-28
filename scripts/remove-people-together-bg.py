"""
Remove the outer black background from people-together.png while keeping
character fills (including black shirts). Uses edge-connected flood fill so
enclosed black areas (clothing) stay opaque.
"""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "assets" / "images" / "people-together.png"

# Pixels at or below this RGB value are treated as removable background black.
BG_THRESHOLD = 48


def is_removable_bg(r: int, g: int, b: int, a: int) -> bool:
    if a == 0:
        return False
    return r <= BG_THRESHOLD and g <= BG_THRESHOLD and b <= BG_THRESHOLD


def flood_remove_background(img: Image.Image) -> Image.Image:
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()

    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))

    while queue:
        x, y = queue.popleft()
        if x < 0 or x >= w or y < 0 or y >= h:
            continue
        if (x, y) in visited:
            continue
        visited.add((x, y))

        r, g, b, a = px[x, y]
        if not is_removable_bg(r, g, b, a):
            continue

        px[x, y] = (0, 0, 0, 0)
        queue.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    return rgba


def remove_decorative_specks(img: Image.Image) -> Image.Image:
    """Drop tiny disconnected light pixels left on former background areas."""
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()

    # Second pass: remove very light isolated dots not part of main subject bbox.
    # Find bounding box of non-transparent pixels with substantial alpha.
    coords = [
        (x, y)
        for y in range(h)
        for x in range(w)
        if px[x, y][3] > 40
    ]
    if not coords:
        return rgba

    xs = [c[0] for c in coords]
    ys = [c[1] for c in coords]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)

    margin = int(min(w, h) * 0.02)
    inner_min_x = min_x + margin
    inner_max_x = max_x - margin
    inner_min_y = min_y + margin
    inner_max_y = max_y - margin

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 40:
                continue
            # Keep everything inside the main illustration cluster.
            if inner_min_x <= x <= inner_max_x and inner_min_y <= y <= inner_max_y:
                continue
            # Remove outer decorative specks/icons outside the cluster.
            px[x, y] = (0, 0, 0, 0)

    return rgba


def main() -> None:
    source = Image.open(TARGET)
    result = flood_remove_background(source)
    result = remove_decorative_specks(result)
    result.save(TARGET, format="PNG", optimize=True)
    print(f"Updated {TARGET}")


if __name__ == "__main__":
    main()
