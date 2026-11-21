# 发布到 GitHub Pages（到这一步只需要你做两件事）

> 站点已经改好、构建验证过：本地用 `http://127.0.0.1:4180/personal-site/` 模拟过子路径部署，
> 24 张照片、贴图、CSS 全部 200。

## 你只需要做两件事

### ① 建一个空仓库

打开 https://github.com/new ，填：

| 项 | 值 |
|---|---|
| Repository name | **`personal-site`** |
| Description | 可留空 |
| Public / Private | **Public**（免费账号私有仓库不能发 Pages） |
| Add a README / .gitignore / license | **全都不要勾** |

最终地址：`https://ccfly-flyfor-y.github.io/personal-site/`

> 想要更短的地址，仓库名就填 `ccfly-flyfor-y.github.io` →
> 站点变成 `https://ccfly-flyfor-y.github.io/`。
> 两种都能用，workflow 里已经写好了自动判断，不用改代码。

### ② 在这台机器上跑三条命令

打开 PowerShell（Win 键搜 PowerShell），整段粘进去：

```powershell
cd "C:\Users\cy\Documents\deepseek-harness\default-workspace\personal-site"
git remote add origin https://github.com/CCFLY-flyfor-y/personal-site.git
git push -u origin main
```

- 如果提示 `remote origin already exists`，改成 `git remote set-url origin ...` 再 push
- push 时会弹一个 **浏览器/窗口让你登录 GitHub**（Git for Windows 自带凭证管理），登录一次以后就不用再登
- 如果仓库名用了 `ccfly-flyfor-y.github.io`，把上面地址里的 `personal-site` 换掉

## 然后开 Pages（网页上点三下）

仓库 → **Settings** → 左侧 **Pages** →

1. **Source** 选 **GitHub Actions**（不要选 "Deploy from a branch"）
2. 回到仓库 **Actions** 标签，能看到 `Deploy to GitHub Pages` 正在跑，等它变绿（约 2 分钟）
3. 打开 `https://ccfly-flyfor-y.github.io/personal-site/`

## 常见问题

| 症状 | 原因 | 处理 |
|---|---|---|
| Actions 报 `npm ci` 失败 | 仓库里没有 `package-lock.json` | 本地跑一次 `npm install` 提交生成的 `package-lock.json` |
| 页面能开但 **样式/图片全 404** | basePath 与仓库名不匹配 | 项目仓库用 `/<repo>`，`<user>.github.io` 用空；workflow 已自动判断，改了仓库名要重跑 |
| 打开是 404 | Settings → Pages 的 Source 没选 GitHub Actions | 按上面第二步改 |
| 想绑自定义域名（如 `skyvault.eu.org`） | 见 `docs/free-domain-eu-org.md` | 绑完后 basePath 必须清空：把 workflow 里 `basepath` 那一步删掉，改成 `NEXT_PUBLIC_BASE_PATH: ''` |

## 之后每次更新

改完 `content/site.js`（或换照片）后：

```powershell
cd "C:\Users\cy\Documents\deepseek-harness\default-workspace\personal-site"
git add -A
git commit -m "更新内容"
git push
```

推上去 2 分钟自动重新发布，不用手动 build。

## 本地预览（不联网也能看）

```powershell
cd "C:\Users\cy\Documents\deepseek-harness\default-workspace\personal-site"
npx --yes next build
npx --yes serve out -p 4173
```
