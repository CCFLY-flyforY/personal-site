"""把迅雷下载的照片处理成网站素材：
- 自动裁掉均匀白边（带 E-M5 边框的那几张）
- 长边缩到 2000（hero 2600），JPEG q88
- 输出到 personal-site/public/photos/thunder/
"""
import os, sys, io
import numpy as np
from PIL import Image

if __name__ == "__main__":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

STAGE = r"C:\Users\cy\Documents\deepseek-harness\default-workspace\thunder-stage"
OUT = r"C:\Users\cy\Documents\deepseek-harness\default-workspace\personal-site\public\photos\thunder"


def trim_border(im, thr=245, guard=0.08):
    """只在四周环带几乎全白、且裁掉面积 > guard 时才裁，避免把白天空当边框"""
    g = np.asarray(im.convert("L"))
    h, w = g.shape
    ring = max(2, int(min(h, w) * 0.02))
    edges = np.concatenate([g[:ring, :].ravel(), g[-ring:, :].ravel(),
                            g[:, :ring].ravel(), g[:, -ring:].ravel()])
    if (edges > thr).mean() < 0.95:
        return im, False
    mask = g < thr
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    if len(rows) == 0:
        return im, False
    box = (cols[0], rows[0], cols[-1] + 1, rows[-1] + 1)
    area_ratio = (box[2] - box[0]) * (box[3] - box[1]) / (w * h)
    if area_ratio > 1 - guard:
        return im, False
    return im.crop(box), True


# (left, top, right, bottom) 内缩像素——实测出来的白框/白条
CROP = {
    "06.jpg": (0, 0, 0, 462),
    "07.jpg": (100, 100, 100, 435),
    "08.jpg": (130, 130, 130, 417),
    "10.jpg": (0, 0, 0, 438),
    "11.jpg": (0, 0, 0, 534),
    "12.jpg": (0, 0, 0, 462),
}


def process(name, out_name, max_side=1800, quality=84):
    src = os.path.join(STAGE, name)
    im = Image.open(src).convert("RGB")
    trimmed = False
    if name in CROP:
        l, t, r, b = CROP[name]
        w, h = im.size
        im = im.crop((l, t, w - r, h - b))
        trimmed = True
    im, _ = trim_border(im)
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    dst = os.path.join(OUT, out_name)
    im.save(dst, quality=quality, optimize=True, progressive=True)
    return im.size, os.path.getsize(dst) // 1024, trimmed


PLAN = [
    # (stage 文件, 输出名, 长边)
    ("01.jpg", "mountain-grass.jpg", 2400),
    ("02.jpg", "lake-snow.jpg", 1800),
    ("03.jpg", "sunset-slope.jpg", 1800),
    ("04.jpg", "clouds-peaks.jpg", 1800),
    ("05.jpg", "river-terrace.jpg", 1800),
    ("06.jpg", "valley-cloud.jpg", 1800),
    ("07.jpg", "egret-box.jpg", 1800),
    ("08.jpg", "egret-portrait.jpg", 1800),
    ("09.jpg", "canton-tower.jpg", 1800),
    ("10.jpg", "green-hills.jpg", 1800),
    ("11.jpg", "cable-car-bw.jpg", 1800),
    ("12.jpg", "valley-green.jpg", 1800),
    ("13.jpg", "dunes-abstract.jpg", 1800),
    ("14.jpg", "pelican.jpg", 1800),
    ("15.jpg", "bird-snag.jpg", 1800),
    ("16.jpg", "heron.jpg", 1800),
    ("17.jpg", "rose-dark.jpg", 1800),
    ("18.jpg", "star-ferry.jpg", 1800),
    ("19.jpg", "pier-boat.jpg", 1800),
    ("20.jpg", "harbour-boat.jpg", 1800),
    ("21.jpg", "star-trails.jpg", 1800),
]


def main():
    os.makedirs(OUT, exist_ok=True)
    for src, dst, ms in PLAN:
        size, kb, trimmed = process(src, dst, ms)
        flag = " [裁边]" if trimmed else ""
        print(f"  {dst:22s} {size[0]:5d}x{size[1]:<5d} {kb:4d}KB{flag}")

    # 关于区竖构图：从 02（湖与雪山）裁 4:5
    im = Image.open(os.path.join(OUT, "lake-snow.jpg")).convert("RGB")
    w, h = im.size
    tw = int(h * 4 / 5)
    left = (w - tw) // 2
    im.crop((left, 0, left + tw, h)).resize((900, 1125), Image.LANCZOS).save(
        os.path.join(OUT, "about-portrait.jpg"), quality=88, optimize=True, progressive=True)
    print("  about-portrait.jpg 900x1125")


if __name__ == "__main__":
    main()



