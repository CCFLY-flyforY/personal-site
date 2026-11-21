# 一键发布到 GitHub Pages
# 用法：右键 → 使用 PowerShell 运行；或在 PowerShell 里：
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools\publish.ps1
#
# 它会做四件事：
#   1. 检查仓库是否已经在 GitHub 上（没有就提示你去建，并打开页面）
#   2. 设好 remote
#   3. 推送（首次会弹浏览器让你登录 GitHub）
#   4. 打开 Settings → Pages 页面，让你把 Source 选成 GitHub Actions

$ErrorActionPreference = 'Stop'
$user   = 'CCFLY-flyfor-y'
$repo   = 'personal-site'          # 想用短地址就改成 "$user.github.io"
$branch = 'main'

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root
Write-Host "工作目录: $root" -ForegroundColor Cyan

# ---------- 1. 本地状态检查 ----------
if (-not (Test-Path 'package-lock.json')) {
    Write-Host "缺少 package-lock.json，GitHub Actions 的 npm ci 会失败，先跑 npm install" -ForegroundColor Yellow
    Write-Host "  npm install --registry=https://registry.npmmirror.com"
    exit 1
}
$dirty = (git status --porcelain)
if ($dirty) {
    Write-Host "有未提交的改动，先提交：" -ForegroundColor Yellow
    git add -A
    git commit -m "更新内容" | Out-Null
}

# ---------- 2. 仓库是否存在 ----------
$url = "https://github.com/$user/$repo"
$exists = $false
try {
    Invoke-RestMethod -Uri "https://api.github.com/repos/$user/$repo" -Headers @{ 'User-Agent' = 'publish' } -TimeoutSec 20 | Out-Null
    $exists = $true
} catch { $exists = $false }

if (-not $exists) {
    Write-Host ""
    Write-Host "仓库还不存在：$url" -ForegroundColor Yellow
    Write-Host "请打开下面这个页面建一个【Public】空仓库，名字填： $repo" -ForegroundColor Yellow
    Write-Host "  （README / .gitignore / license 一个都不要勾）"
    Start-Process "https://github.com/new?name=$repo&visibility=public"
    Read-Host "建好后按回车继续"
    try {
        Invoke-RestMethod -Uri "https://api.github.com/repos/$user/$repo" -Headers @{ 'User-Agent' = 'publish' } -TimeoutSec 20 | Out-Null
    } catch {
        Write-Host "还是查不到仓库，先退出。确认名字拼写和 Public 可见性。" -ForegroundColor Red
        exit 1
    }
}

# ---------- 3. remote + 推送 ----------
$gitUrl = "https://github.com/$user/$repo.git"
$existing = (git remote)
if ($existing -contains 'origin') {
    git remote set-url origin $gitUrl
} else {
    git remote add origin $gitUrl
}
Write-Host "remote origin -> $gitUrl" -ForegroundColor Cyan

git branch --show-current | Out-Null
Write-Host "开始推送（会弹窗让你登录 GitHub，登录一次即可）..." -ForegroundColor Cyan
git push -u origin $branch
if ($LASTEXITCODE -ne 0) {
    Write-Host "推送失败。常见原因：① 没登录 ② 仓库是 Private 且无权限 ③ 远端已有内容需要先 pull" -ForegroundColor Red
    exit 1
}

# ---------- 4. 打开 Pages 设置 ----------
Write-Host ""
Write-Host "推送成功 ✅" -ForegroundColor Green
$pagesUrl = "https://github.com/$user/$repo/settings/pages"
Write-Host "接下来在打开的设置页里：Source 选 GitHub Actions" -ForegroundColor Yellow
Start-Process $pagesUrl

Write-Host ""
Write-Host "等 Actions 变绿（约 2 分钟）后，运行自检：" -ForegroundColor Cyan
$siteBase = if ($repo -eq "$user.github.io") { "https://$user.github.io/" } else { "https://$user.github.io/$repo/" }
Write-Host "  python tools\check_site.py $siteBase"
Write-Host "站点地址：$siteBase" -ForegroundColor Green
