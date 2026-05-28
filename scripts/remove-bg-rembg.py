"""Remove background from people-together.png using rembg (U2Net)."""
from pathlib import Path

from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "assets" / "images" / "people-together.png"
OUTPUT = ROOT / "assets" / "images" / "people-together.png"

if __name__ == "__main__":
    data = remove(INPUT.read_bytes())
    OUTPUT.write_bytes(data)
    print(f"Saved transparent PNG to {OUTPUT} ({len(data)} bytes)")
