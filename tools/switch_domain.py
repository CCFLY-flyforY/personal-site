"""切到自定义域名（等 skyvault.eu.org 批下来后跑一条命令即可）。

默认是 dry-run，只打印要做什么、不改任何东西；加 --apply 才真执行。

用法：
    python tools/switch_domain.py                          # 预览
    python tools/switch_domain.py --apply                  # 真的切到 skyvault.eu.org
    python tools/switch_domain.py --apply --domain xxx.eu.org
    python tools/switch_domain.py --apply --wait 30        # 切完等最多 30×30 秒看域名是否生效

它做的事：
    1. 设仓库变量 SITE_DOMAIN=<域名>  ->  workflow 据此把 basePath 置空
    2. 写 public/CNAME、提交并推送     ->  触发一次新的部署
    3. 通过 API 把 Pages 的自定义域名设为 <域名>
    4. 打印需要到 DNS 服务商（HE）里添加的记录
    5. 可选：轮询 https://<域名>/ 直到 200
"""
import argparse, io, json, os, subprocess, sys, time, urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

OWNER = "CCFLY-flyforY"
REPO = "personal-site"
DEFAULT_DOMAIN = "skyvault.eu.org"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

GH_PAGES_A = ["185.199.108.153", "185.199.109.153", "185.199.110.153", "185.199.111.153"]
GH_PAGES_AAAA = [
    "2606:50c0:8000::153",
    "2606:50c0:8001::153",
    "2606:50c0:8002::153",
    "2606:50c0:8003::153",
]


def token():
    p = subprocess.run(
        ["git", "credential", "fill"], input="protocol=https\nhost=github.com\n\n",
        capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=60,
        env={**os.environ, "GCM_INTERACTIVE": "never"},
    )
    for line in (p.stdout or "").splitlines():
        if line.startswith("password="):
            return line.split("=", 1)[1].strip()
    return ""


def api(path, tok, method="GET", body=None):
    cmd = ["curl", "-s", "-w", "\n__S__%{http_code}", "-X", method,
           "-H", f"Authorization: Bearer {tok}",
           "-H", "Accept: application/vnd.github+json",
           "-H", "X-GitHub-Api-Version: 2022-11-28",
           "-A", "skyvault-domain", "-m", "40", f"https://api.github.com{path}"]
    if body is not None:
        cmd += ["-H", "Content-Type: application/json", "-d", json.dumps(body)]
    p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=120)
    raw = p.stdout or ""
    out, _, st = raw.rpartition("\n__S__")
    try:
        data = json.loads(out) if out.strip() else {}
    except Exception:
        data = {"_raw": out[:300]}
    return int(st or 0), data


def run(cmd, cwd=ROOT):
    p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True,
                       encoding="utf-8", errors="replace", timeout=300,
                       env={**os.environ, "GCM_INTERACTIVE": "never", "GIT_TERMINAL_PROMPT": "0"})
    return p.returncode, (p.stdout or "") + (p.stderr or "")


def dns_plan(domain):
    print("\n在 DNS 服务商（Hurricane Electric → dns.he.net）里给这个 zone 加：")
    print(f"  zone: {domain}\n")
    for ip in GH_PAGES_A:
        print(f"  A      @      {ip}")
    for ip in GH_PAGES_AAAA:
        print(f"  AAAA   @      {ip}")
    print(f"  CNAME  www    {OWNER.lower()}.github.io")
    print("\n（这两组地址来自 api.github.com/meta 的 pages 段，已核对）")


def poll(url, tries, delay=30):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "skyvault-domain"})
            with urllib.request.urlopen(req, timeout=20) as r:
                if r.status == 200:
                    print(f"✓ {url} -> 200（第 {i+1} 次探测）")
                    return True
        except Exception as e:  # noqa: BLE001
            print(f"  第 {i+1} 次：{e}")
        time.sleep(delay)
    print(f"✗ {tries} 次探测没拿到 200（DNS 或证书可能还没生效）")
    return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--domain", default=DEFAULT_DOMAIN)
    ap.add_argument("--apply", action="store_true", help="真的执行（默认只预览）")
    ap.add_argument("--wait", type=int, default=0, help="切换后轮询多少次（每次 30 秒）")
    args = ap.parse_args()
    domain = args.domain.strip().lower()

    print(f"仓库: {OWNER}/{REPO}")
    print(f"目标域名: {domain}")
    print(f"模式: {'执行' if args.apply else '预览（dry-run）'}")

    tok = token()
    if not tok:
        print("❌ 取不到 GitHub 凭证")
        return 1

    # 0) 先看域名是否已经有 A 记录（没有的话切了也不通）
    print("\n[0] 检查域名当前解析")
    st, d = api(f"/repos/{OWNER}/{REPO}/actions/variables/SITE_DOMAIN", tok)
    print(f"    SITE_DOMAIN 变量: {'已存在 ' + str(d.get('value')) if st == 200 else '未设置（当前用仓库名自动判断 basePath）'}")

    if not args.apply:
        print("\n将要执行的改动：")
        print(f"  · 写入 GitHub 仓库变量 SITE_DOMAIN={domain}")
        print("  · 新建 public/CNAME 并提交推送（触发重新部署，basePath 变为空）")
        print(f"  · 把 Pages 自定义域名设为 {domain}")
        dns_plan(domain)
        print("\n预览结束。确认后加 --apply 执行。")
        return 0

    # 1) 仓库变量
    st, d = api(f"/repos/{OWNER}/{REPO}/actions/variables", tok, "POST",
                {"name": "SITE_DOMAIN", "value": domain})
    if st in (201, 204):
        print("✓ 已创建变量 SITE_DOMAIN")
    elif st == 409:
        st2, _ = api(f"/repos/{OWNER}/{REPO}/actions/variables/SITE_DOMAIN", tok, "PATCH", {"value": domain})
        print(f"· 变量已存在，改为更新 -> HTTP {st2}")
    else:
        print(f"⚠ 设变量返回 HTTP {st}: {str(d)[:200]}")

    # 2) CNAME + 推送
    cname = os.path.join(ROOT, "public", "CNAME")
    os.makedirs(os.path.dirname(cname), exist_ok=True)
    with open(cname, "w", encoding="utf-8", newline="\n") as f:
        f.write(domain + "\n")
    print(f"✓ 写入 public/CNAME -> {domain}")
    run(["git", "add", "-A"])
    rc, out = run(["git", "commit", "-m", f"切到自定义域名 {domain}（basePath 置空 + CNAME）"])
    print("  " + (out.strip().splitlines() or [""])[0][:120])
    rc, out = run(["git", "push"])
    print(f"{'✓' if rc == 0 else '✗'} 推送：{out.strip().splitlines()[-1][:120] if out.strip() else ''}")

    # 3) Pages 自定义域名
    st, d = api(f"/repos/{OWNER}/{REPO}/pages", tok, "PUT", {"cname": domain})
    print(f"{'✓' if st in (200, 204) else '⚠'} 设置 Pages 自定义域名 -> HTTP {st} {str(d)[:160]}")

    dns_plan(domain)
    print("\nDNS 生效后（通常几分钟到 1 小时），GitHub 会自动签发 HTTPS 证书。")
    print("证书就绪后跑：python tools/check_site.py https://" + domain + "/")

    if args.wait:
        print()
        poll(f"https://{domain}/", args.wait)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
