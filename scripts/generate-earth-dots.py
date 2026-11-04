#!/usr/bin/env python3
"""Build public/media/earth-dots.bin (+ colors) from the equirectangular landmask.

Sampling is Fibonacci-sphere filtered by land, plus a coastal densify pass.
Coordinate convention matches src/components/home/EarthGlobe.tsx latLonToVec3.
"""

from __future__ import annotations

import math
import struct
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MASK = ROOT / "public/media/earth-landmask.png"
OUT = ROOT / "public/media/earth-dots.bin"
OUT_COLORS = ROOT / "public/media/earth-dot-colors.bin"


def latlon_to_vec(lat: float, lon: float) -> tuple[float, float, float]:
    phi = math.radians(90.0 - lat)
    theta = math.radians(lon + 180.0)
    return (
        -math.sin(phi) * math.cos(theta),
        math.cos(phi),
        math.sin(phi) * math.sin(theta),
    )


def main() -> None:
    im = Image.open(MASK).convert("L")
    w, h = im.size
    pix = im.load()

    def is_land(lat: float, lon: float, thresh: int = 100) -> bool:
        u = (lon + 180.0) / 360.0
        v = (90.0 - lat) / 180.0
        x = int(u * (w - 1)) % w
        y = max(0, min(h - 1, int(v * (h - 1))))
        return pix[x, y] > thresh

    positions: list[tuple[float, float, float]] = []
    brightness: list[float] = []
    seen: set[tuple[float, float]] = set()

    def add_point(lat: float, lon: float) -> None:
        key = (round(lat, 3), round(lon, 3))
        if key in seen or not is_land(lat, lon):
            return
        seen.add(key)
        positions.append(latlon_to_vec(lat, lon))
        edge = sum(
            1
            for dlon, dlat in (
                (0.35, 0),
                (-0.35, 0),
                (0, 0.35),
                (0, -0.35),
                (0.25, 0.25),
                (-0.25, -0.25),
            )
            if not is_land(lat + dlat, lon + dlon)
        )
        b = 0.70 + 0.22 * min(1.0, edge / 4.0) + 0.06 * ((lat + 90) / 180.0)
        brightness.append(min(1.0, b))

    n = 420_000
    golden = math.pi * (3 - math.sqrt(5))
    for i in range(n):
        y = 1 - (i / (n - 1)) * 2
        radius_at_y = math.sqrt(max(0.0, 1 - y * y))
        theta = golden * i
        x = math.cos(theta) * radius_at_y
        z = math.sin(theta) * radius_at_y
        lat = math.degrees(math.asin(max(-1.0, min(1.0, y))))
        lon = math.degrees(math.atan2(z, x))
        add_point(lat, lon)

    for lat_i in range(-89, 90):
        lat = lat_i + 0.5
        steps = max(180, int(720 * math.cos(math.radians(lat))))
        for j in range(steps):
            lon = -180 + (360.0 * j / steps)
            if not is_land(lat, lon):
                continue
            coastal = any(
                not is_land(lat + dlat, lon + dlon)
                for dlon, dlat in ((0.5, 0), (-0.5, 0), (0, 0.5), (0, -0.5))
            )
            if coastal:
                add_point(lat, lon)

    with OUT.open("wb") as f:
        for x, y, z in positions:
            f.write(struct.pack("<fff", x, y, z))
    with OUT_COLORS.open("wb") as f:
        for b in brightness:
            f.write(struct.pack("<fff", b, b, b))

    print(f"wrote {len(positions)} points → {OUT}")


if __name__ == "__main__":
    main()
