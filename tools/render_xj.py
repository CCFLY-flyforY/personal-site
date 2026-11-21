"""新疆 DNG -> 网站用 JPEG。

为什么需要这一步：rawpy 默认 postprocess 输出是"平"的（相机矩阵 + gamma，没有色调曲线、
没有饱和），看起来比机内 JPEG / Lightroom 修过的版本淡很多。这里改成：
linear sRGB(16bit) -> 分位归一化 -> ACES 近似色调映射 -> 对比/饱和微调
默认参数 B：contrast=1.02, saturation=1.12（自然，不塑料）。

用法：
  python render_xj.py            # 重渲染全部（7 张 + 首屏 + 关于区竖构图）
"""
import os, sys, io

import numpy as np
import rawpy
from PIL import Image, ImageEnhance

SRC = r"D:\新疆"
OUT = r"C:\Users\cy\Documents\deepseek-harness\default-workspace\personal-site\public\photos\xinjiang"

# 文件名 -> 标题（仅用于日志）
FILES = {
    "P1010197": "高原湖",
    "P1010406": "牧场的午后",
    "P1010473": "云谷",
    "P1010507": "河谷台地",
    "P1010527": "雪线之上",
    "P1010798": "沙丘",
    "P1010800": "逆光",
}

DEFAULT = dict(pct=99.6, exposure=1.0, contrast=1.02, saturation=1.12)


def linear_rgb(path):
    """解码成线性 sRGB 16bit（不做任何 auto bright / gamma）"""
    raw = rawpy.imread(path)
    lin = raw.postprocess(
        use_camera_wb=True,
        no_auto_bright=True,
        output_bps=16,
        gamma=(1, 1),
        output_color=rawpy.ColorSpace.sRGB,
        demosaic_algorithm=rawpy.DemosaicAlgorithm.AHD,
    )
    raw.close()
    return lin


def tonemap(lin, pct=99.6, exposure=1.0, contrast=1.02, saturation=1.12):
    x = np.clip(lin.astype(np.float32) / 65535.0, 0, None)
    lum = 0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2]
    ref = np.percentile(lum, pct)
    if ref > 1e-6:
        x *= 0.78 / ref          # 让高光留余量，不靠 auto-bright 拉
    x *= exposure
    a, b, c, d, e = 2.51, 0.03, 2.43, 0.59, 0.14        # ACES 近似
    y = np.clip((x * (a * x + b)) / (x * (c * x + d) + e), 0, 1)
    im = Image.fromarray((y * 255.0 + 0.5).astype(np.uint8))
    if contrast != 1.0:
        im = ImageEnhance.Contrast(im).enhance(contrast)
    if saturation != 1.0:
        im = ImageEnhance.Color(im).enhance(saturation)
    return im


def save(im, name, max_side, quality=88):
    im = im.copy()
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    p = os.path.join(OUT, name)
    im.save(p, quality=quality, optimize=True, progressive=True)
    return im.size, os.path.getsize(p) // 1024


def build_one(base, **kw):
    src = os.path.join(SRC, base + "-已增强-降噪.dng")
    im = tonemap(linear_rgb(src), **kw)
    return im


def main():
    os.makedirs(OUT, exist_ok=True)
    print("== 作品 ==")
    for base, title in FILES.items():
        size, kb = save(build_one(base, **DEFAULT), base + ".jpg", 2000)
        print(f"  {base} {title}: {size[0]}x{size[1]} {kb}KB")

    print("== 首屏（沙丘，2600px）==")
    dunes = build_one("P1010798", pct=99.6, exposure=1.06, contrast=1.06, saturation=1.10)
    print("  hero-dunes.jpg", *save(dunes, "hero-dunes.jpg", 2600, 88))

    print("== 关于区竖构图（牧场 4:5）==")
    horses = build_one("P1010406", **DEFAULT)
    w, h = horses.size
    tw = int(h * 4 / 5)
    left = (w - tw) // 2
    crop = horses.crop((left, 0, left + tw, h)).resize((900, 1125), Image.LANCZOS)
    print("  about-horses.jpg", *save(crop, "about-horses.jpg", 1200, 88))


if __name__ == "__main__":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    main()
