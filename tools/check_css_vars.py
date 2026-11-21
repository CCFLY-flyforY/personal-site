"""检查 app/globals.css 里所有 var(--x) 引用的变量都有定义。

为什么需要：CSS 里只要有一个 var() 指向未定义的自定义属性，整条声明在浏览器里
就会**整体失效**（chromium 行为），而且控制台不报错——排查起来非常隐蔽。
这轮就是 `--accent-soft` 被误删，导致整条 background-image（石纹 + 金斑）失效。

用法：python tools/check_css_vars.py
"""
import os, re, sys

if __name__ == "__main__":
    sys.stdout = open(sys.stdout.fileno(), "w", encoding="utf-8", errors="replace")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS = os.path.join(ROOT, "app", "globals.css")

# 允许例外：这些变量是在 JSX 里通过内联 style 设置的
ALLOW = {"--i"}


def main():
    css = open(CSS, encoding="utf-8").read()
    used = set(re.findall(r"var\((--[a-z0-9-]+)", css))
    defined = set(re.findall(r"^\s*(--[a-z0-9-]+)\s*:", css, re.M))
    missing = sorted((used - defined) - ALLOW)
    if missing:
        print("❌ 未定义的变量（会让整条 CSS 声明失效）：")
        for m in missing:
            print("   ", m)
        return 1
    print(f"✅ CSS 变量齐全：引用 {len(used)} 个，定义 {len(defined)} 个")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
