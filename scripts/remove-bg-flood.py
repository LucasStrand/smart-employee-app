"""Remove black background via edge flood-fill; preserves enclosed black (shirts)."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "assets" / "images" / "people-together.png"
OUTPUT = ROOT / "assets" / "images" / "people-together.png"
TOLERANCE = 28


def close(r1: int, g1: int, b1: int, r2: int, g2: int, b2: int, tol: int) -> bool:
    return (
        abs(r1 - r2) <= tol
        and abs(g1 - g2) <= tol
        and abs(b1 - b2) <= tol
    )


def flood_remove(path: Path, out: Path, tol: int = TOLERANCE) -> None:
    img = Image.open(path).convert("RGBA")
    px = img.load()
    w, h = img.size
    ref = px[0, 0][:3]

    visited: set[tuple[int, int]] = set()
    remove: set[tuple[int, int]] = set()
    q: deque[tuple[int, int]] = deque()

    for x in range(w):
        for y in (0, h - 1):
            c = px[x, y]
            if close(c[0], c[1], c[2], ref[0], ref[1], ref[2], tol):
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            c = px[x, y]
            if close(c[0], c[1], c[2], ref[0], ref[1], ref[2], tol):
                q.append((x, y))

    while q:
        x, y = q.popleft()
        if x < 0 or x >= w or y < 0 or y >= h:
            continue
        if (x, y) in visited:
            continue
        c = px[x, y]
        if not close(c[0], c[1], c[2], ref[0], ref[1], ref[2], tol):
            continue
        visited.add((x, y))
        remove.add((x, y))
        q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    for x, y in remove:
        px[x, y] = (0, 0, 0, 0)

    img.save(out, optimize=True)

    opaque = sum(1 for p in img.getdata() if p[3] > 10)
    print(f"Opaque pixels: {opaque} / {w * h} ({opaque / (w * h) * 100:.1f}%)")
    print(f"Removed background pixels: {len(remove)}")


if __name__ == "__main__":
    flood_remove(INPUT, OUTPUT)
