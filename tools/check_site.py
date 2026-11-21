"""部署后自检：检查线上站点是否真的可访问。

用法：
    python tools/check_site.py                              # 默认查 https://ccfly-flyfor-y.github.io/personal-site/
    python tools/check_site.py https://skyvault.eu.org/     # 查别的地址
    python tools/check_site.py http://127.0.0.1:4173/       # 查本地预览

检查项：首页 200、页面含 SKYVAULT、首屏图 200、贴图 200、CSS 200、
        以及「页面里的资源路径是否与部署路径匹配」（子路径部署最常见的白屏原因）。
"""
import io
import re
import sys
import urllib.request
import urllib.error

__version__ = "2026-11-21"

DEFAULT = "https://ccfly-flyfor-y.github.io/personal-site/"


def fetch(url, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": "skyvault-site-check"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, r.read()


def resolve(base, rel):
    """页面里的资源路径可能已经带 basePath（/personal-site/photos/x.jpg），
    这种情况要按域名根解析；只有相对路径才用 urljoin 拼接。"""
    import urllib.parse
    if rel.startswith("http"):
        return rel
    parts = urllib.parse.urlsplit(base)
    origin = f"{parts.scheme}://{parts.netloc}"
    if rel.startswith("/"):
        return origin + rel
    return urllib.parse.urljoin(base, rel)


def head_ok(url, timeout=20):
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "skyvault-site-check"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return 0


def main(argv):
    base = (argv[1] if len(argv) > 1 else DEFAULT)
    if not base.endswith("/"):
        base += "/"
    print(f"目标: {base}\n")

    fails = []

    # 1) 首页
    try:
        code, body = fetch(base)
    except Exception as e:
        print(f"✗ 首页取不到: {e}")
        return 1
    html = body.decode("utf-8", "replace")
    print(f"{'✓' if code == 200 else '✗'} 首页 HTTP {code}")
    if code != 200:
        fails.append("首页")

    # 2) 内容校验（防止拿到 404 页却返回 200）
    has_mark = "SKYVAULT" in html
    print(f"{'✓' if has_mark else '✗'} 页面含 SKYVAULT")
    if not has_mark:
        fails.append("页面内容")

    # 3) 资源路径是否带对了前缀
    imgs = re.findall(r'src="([^"]+)"', html)
    photos = [u for u in imgs if "photos/" in u]
    textures = re.findall(r'url\(\\?[\'"]?([^\'")]*textures[^\'")]*)', html)
    print(f"  页面里照片 {len(photos)} 处，贴图 {len(textures)} 处")
    if photos:
        abs_photos = [resolve(base, u) for u in photos]
        # 子路径部署时，资源应带 /<repo>/ 前缀；这里直接请求前 3 张验证
        bad = []
        for u in abs_photos[:3]:
            st = head_ok(u)
            print(f"{'✓' if st == 200 else '✗'} {u} -> {st}")
            if st != 200:
                bad.append(u)
        if bad:
            fails.append("照片路径")
    else:
        print("✗ 页面里找不到照片路径")
        fails.append("照片路径")

    # 4) 贴图与 CSS
    for label, u in [
        ("贴图", resolve(base, "textures/stone-dust.png")),
    ]:
        st = head_ok(u)
        print(f"{'✓' if st == 200 else '✗'} {label} {u} -> {st}")
        if st != 200:
            fails.append(label)

    css = re.findall(r'href="([^"]+\.css)"', html)
    if css:
        u = resolve(base, css[0])
        st = head_ok(u)
        print(f"{'✓' if st == 200 else '✗'} CSS {u} -> {st}")
        if st != 200:
            fails.append("CSS")

    print()
    if fails:
        print("❌ 有问题：" + "、".join(fails))
        if "照片路径" in fails or "CSS" in fails:
            print("   提示：多半是 basePath 与部署路径不匹配——项目型站点要 /<repo>，自定义域名要留空。")
        return 1
    print("✅ 全绿，站点可以对外了")
    return 0


if __name__ == "__main__":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    import urllib.parse  # noqa: E402  (main 里用到)
    raise SystemExit(main(sys.argv))

