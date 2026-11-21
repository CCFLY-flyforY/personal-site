"""生成两张无缝贴图，给页面加"粗石"质感：
  1) stone-grain.png  —— 分形噪声做石头颗粒，256px 无缝平铺（频率域生成，天然可平铺）
  2) gold-specks.png  —— 青金石里的金色小点，透明底，稀疏分布
用法：python tools/make_textures.py
"""
import os, sys, io

import numpy as np
from PIL import Image, ImageFilter

if __name__ == "__main__":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "textures")
SIZE = 512


def fractal_noise(size=512, beta=1.7, seed=7):
    """在频率域造 1/f^beta 噪声：结果本身是周期性的，平铺无接缝。"""
    rng = np.random.default_rng(seed)
    fy = np.fft.fftfreq(size)[:, None]
    fx = np.fft.fftfreq(size)[None, :]
    f = np.sqrt(fx ** 2 + fy ** 2)
    f[0, 0] = 1e-6
    amplitude = 1.0 / (f ** beta)
    phase = rng.uniform(0, 2 * np.pi, (size, size))
    spec = amplitude * np.exp(1j * phase)
    field = np.real(np.fft.ifft2(spec))
    field -= field.min()
    field /= field.max()
    return field


def make_grain():
    # 两个尺度叠加：细颗粒 + 稍大的斑块，像石头表面
    fine = fractal_noise(SIZE, beta=0.9, seed=11)
    coarse = fractal_noise(SIZE, beta=2.9, seed=23)
    field = 0.30 * fine + 0.70 * coarse
    # 拉一点对比，让颗粒"脆"一点
    field = np.clip((field - 0.5) * 1.25 + 0.5, 0, 1)
    # 映射到中灰附近（overlay 混合时中灰为无作用）
    gray = (128 + (field - 0.5) * 210).clip(0, 255).astype(np.uint8)
    img = Image.fromarray(gray, "L")
    path = os.path.join(OUT, "stone-grain.png")
    img.save(path, optimize=True)
    print(f"stone-grain.png {img.size} {os.path.getsize(path) // 1024}KB")


def make_specks(count=140, seed=3):
    rng = np.random.default_rng(seed)
    canvas = np.zeros((SIZE, SIZE, 4), dtype=np.uint8)
    gold = (217, 180, 95, 255)
    for _ in range(count):
        x, y = rng.integers(0, SIZE, 2)
        r = int(rng.choice([1, 1, 1, 2]))
        a = int(rng.integers(70, 190))
        y0, y1 = max(0, y - r), min(SIZE, y + r + 1)
        x0, x1 = max(0, x - r), min(SIZE, x + r + 1)
        block = canvas[y0:y1, x0:x1]
        block[..., 0] = gold[0]
        block[..., 1] = gold[1]
        block[..., 2] = gold[2]
        fade = np.linspace(a, max(20, a // 3), block.shape[0])[:, None]
        block[..., 3] = np.maximum(block[..., 3], fade.astype(np.uint8))
    img = Image.fromarray(canvas, "RGBA")
    img = img.filter(ImageFilter.GaussianBlur(0.4))
    path = os.path.join(OUT, "gold-specks.png")
    img.save(path, optimize=True)
    print(f"gold-specks.png {img.size} {os.path.getsize(path) // 1024}KB")


def make_dust():
    """浅色石粉层：深色底上 normal 混合，才能看出粗糙的石面"""
    fine = fractal_noise(SIZE, beta=1.0, seed=41)
    coarse = fractal_noise(SIZE, beta=2.6, seed=43)
    field = 0.55 * fine + 0.45 * coarse
    field = np.clip((field - 0.5) * 1.6 + 0.5, 0, 1)
    alpha = (field ** 1.5 * 130).astype(np.uint8)      # 上限约 30% 不透明度
    canvas = np.zeros((SIZE, SIZE, 4), dtype=np.uint8)
    canvas[..., 0] = 158
    canvas[..., 1] = 176
    canvas[..., 2] = 222
    canvas[..., 3] = alpha
    img = Image.fromarray(canvas, "RGBA")
    path = os.path.join(OUT, "stone-dust.png")
    img.save(path, optimize=True)
    print(f"stone-dust.png {img.size} {os.path.getsize(path) // 1024}KB")


def main():
    os.makedirs(OUT, exist_ok=True)
    make_grain()
    make_dust()
    make_specks()


if __name__ == "__main__":
    main()
