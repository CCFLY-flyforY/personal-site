"""当 git 协议连不上 github.com 时，改用 GitHub REST API 把本地领先的提交推上去。

只依赖 api.github.com（国内通常可用），做的是：
  1. 取远端 main 的 head 与 tree
  2. 把本地 origin/main..HEAD 之间改动的文件做成 blob
  3. 生成新 tree + 新 commit（parent = 远端 head）
  4. 移动 main 引用
  5. 把本地 origin/main 更新到新提交（git update-ref，不联网）

用法：
    python tools/api_push.py            # 预览将推送哪些文件
    python tools/api_push.py --apply    # 真的推
"""
import argparse, base64, io, json, os, subprocess, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

OWNER, REPO, BRANCH = "CCFLY-flyforY", "personal-site", "main"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def token():
    p = subprocess.run(["git", "credential", "fill"], input="protocol=https\nhost=github.com\n\n",
                       capture_output=True, text=True, encoding="utf-8", errors="replace",
                       timeout=60, env={**os.environ, "GCM_INTERACTIVE": "never"})
    for line in (p.stdout or "").splitlines():
        if line.startswith("password="):
            return line.split("=", 1)[1].strip()
    return ""


def api(path, tok, method="GET", body=None):
    cmd = ["curl", "-s", "-w", "\n__S__%{http_code}", "-X", method,
           "-H", f"Authorization: Bearer {tok}",
           "-H", "Accept: application/vnd.github+json",
           "-H", "X-GitHub-Api-Version: 2022-11-28",
           "-A", "skyvault-push", "-m", "60", f"https://api.github.com{path}"]
    if body is not None:
        cmd += ["-H", "Content-Type: application/json", "-d", json.dumps(body)]
    p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=180)
    raw = p.stdout or ""
    out, _, st = raw.rpartition("\n__S__")
    try:
        data = json.loads(out) if out.strip() else {}
    except Exception:
        data = {"_raw": out[:300]}
    return int(st or 0), data


def git(*args):
    p = subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True,
                       encoding="utf-8", errors="replace", timeout=120)
    return p.returncode, (p.stdout or "").strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--message", default="")
    a = ap.parse_args()

    rc, changed = git("diff", "--name-only", "origin/main..HEAD")
    if rc != 0 or not changed:
        print("没有需要推送的改动（或 origin/main 不存在）")
        return 1
    raw_files = [f for f in changed.splitlines() if f.strip()]

    # 取远端 tree 做内容比对：本地提交可能只是 SHA 不同、内容已经一致
    tok0 = token()
    files = raw_files
    if tok0:
        st, ref0 = api(f"/repos/{OWNER}/{REPO}/git/ref/heads/{BRANCH}", tok0)
        if st == 200:
            st, c0 = api(f"/repos/{OWNER}/{REPO}/git/commits/{ref0['object']['sha']}", tok0)
            if st == 200:
                st, tr0 = api(f"/repos/{OWNER}/{REPO}/git/trees/{c0['tree']['sha']}?recursive=1", tok0)
                remote_blobs = {t["path"]: t["sha"] for t in tr0.get("tree", []) if t.get("type") == "blob"} if st == 200 else {}

                def local_blob(path):
                    # 用提交里的 blob（已按 .gitattributes/autocrlf 归一化），
                    # 不能用 hash-object 磁盘文件——CRLF 会让哈希对不上
                    rc, sha = git("rev-parse", f"HEAD:{path}")
                    return sha if rc == 0 else None

                same = [f for f in raw_files if remote_blobs.get(f) and remote_blobs.get(f) == local_blob(f)]
                files = [f for f in raw_files if f not in same]
                if same:
                    print(f"跳过 {len(same)} 个（远端内容已一致）：" + ", ".join(same[:5]))

    if not files:
        print("远端内容已经是最新的，不需要推送")
        git("update-ref", "refs/remotes/origin/main", git("rev-parse", "HEAD")[1])
        return 0

    print(f"待推送 {len(files)} 个文件：")
    for f in files[:12]:
        print("  ", f)
    if len(files) > 12:
        print(f"   …还有 {len(files) - 12} 个")

    rc, msg = git("log", "-1", "--pretty=%B")
    message = a.message or msg or "update"

    if not a.apply:
        print(f"\n提交信息: {message.splitlines()[0]}")
        print("预览模式，加 --apply 执行")
        return 0

    tok = token()
    if not tok:
        print("❌ 取不到凭证")
        return 1

    # 1) 远端 head
    st, ref = api(f"/repos/{OWNER}/{REPO}/git/ref/heads/{BRANCH}", tok)
    if st != 200:
        print(f"✗ 取远端引用失败 HTTP {st}: {str(ref)[:200]}")
        return 1
    head_sha = ref["object"]["sha"]
    st, commit = api(f"/repos/{OWNER}/{REPO}/git/commits/{head_sha}", tok)
    if st != 200:
        print(f"✗ 取远端 commit 失败 HTTP {st}")
        return 1
    base_tree = commit["tree"]["sha"]
    print(f"远端 head: {head_sha[:8]}")

    # 2) blob
    tree_items = []
    for f in files:
        p = os.path.join(ROOT, f)
        if not os.path.exists(p):
            print(f"  · 跳过（本地已删除，API 流程暂不处理删除）: {f}")
            continue
        cp = subprocess.run(["git", "cat-file", "blob", f"HEAD:{f}"], cwd=ROOT, capture_output=True, timeout=180)
        if cp.returncode != 0:
            print(f"  · 跳过（git 里没有这个 blob）: {f}")
            continue
        content = cp.stdout
        st, blob = api(f"/repos/{OWNER}/{REPO}/git/blobs", tok, "POST",
                       {"content": base64.b64encode(content).decode(), "encoding": "base64"})
        if st not in (201, 200):
            print(f"✗ 上传 blob 失败 {f}: HTTP {st}")
            return 1
        tree_items.append({"path": f, "mode": "100644", "type": "blob", "sha": blob["sha"]})
        print(f"  ✓ blob {f} -> {blob['sha'][:8]}")

    # 3) tree
    st, tree = api(f"/repos/{OWNER}/{REPO}/git/trees", tok, "POST",
                   {"base_tree": base_tree, "tree": tree_items})
    if st not in (201, 200):
        print(f"✗ 建 tree 失败 HTTP {st}: {str(tree)[:200]}")
        return 1
    print(f"✓ 新 tree {tree['sha'][:8]}")

    # 4) commit
    st, newc = api(f"/repos/{OWNER}/{REPO}/git/commits", tok, "POST",
                   {"message": message, "tree": tree["sha"], "parents": [head_sha]})
    if st not in (201, 200):
        print(f"✗ 建 commit 失败 HTTP {st}: {str(newc)[:200]}")
        return 1
    print(f"✓ 新 commit {newc['sha'][:8]}")

    # 5) 移动分支
    st, upd = api(f"/repos/{OWNER}/{REPO}/git/refs/heads/{BRANCH}", tok, "PATCH",
                  {"sha": newc["sha"], "force": False})
    if st not in (200, 201):
        print(f"✗ 更新分支失败 HTTP {st}: {str(upd)[:200]}")
        return 1
    print(f"✓ 远端 {BRANCH} 已指向 {newc['sha'][:8]}")

    # 6) 本地 origin/main 跟上（不联网）
    git("update-ref", "refs/remotes/origin/main", newc["sha"])
    rc, ahead = git("rev-list", "--count", "origin/main..HEAD")
    print(f"本地相对 origin/main 剩余未推提交数: {ahead}（0 表示完全一致）")
    print("\nGitHub Actions 会自动开始部署，稍后用 python tools/check_site.py 验证。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
