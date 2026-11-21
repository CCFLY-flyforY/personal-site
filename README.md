# 个人主页 · 摄影风

Next.js（App Router）+ 静态导出，部署到 GitHub Pages。产物是 `out/` 里的纯静态文件，扔任何静态托管都能跑。

## 本地预览

```bash
npm install      # 已装好
npm run dev      # http://localhost:4173
npm run build    # 生成 out/
```

## 改内容：只动 `content/site.js`

| 字段 | 说明 |
| --- | --- |
| `name` / `latin` / `role` | 名字、英文名、身份行（右上是导航） |
| `heroLine` / `heroPhoto` | 首屏那句话、首屏大图与它下面的器材行 |
| `aboutPhoto` | 「关于」左侧那张竖图 |
| `about` | 关于正文，字符串数组 |
| `stats` | 关于下面的三行小表（器材 / 偏好 / 后期） |
| `works` | 作品：`src` / `title` / `meta` / `focus`（object-position）/ `wide`（true 时整行 16:9 大图） |
| `notes` | 笔记：`title` / `date` / `summary` / `href` |
| `contact` | 第一条是大号邮箱，其余是下面的小链接 |

### 换成你自己的照片

1. 图片放进 `public/photos/`（建议长边 1600–2000 px、JPEG quality 85，单张 300 KB 以内）；
2. 在 `content/site.js` 里把 `src` 改成 `/photos/你的文件名.jpg`；
3. `wide: true` 的照片会占满整行（16:9 裁切），其余按 4:5 两栏排列 —— 一张竖图配一张横图会很整齐；
4. `focus` 控制裁切重心，比如 `'center 30%'` 让人脸留在上方。

> 子路径部署（仓库型站点）时 `src` 要带前缀：`` `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/photos/x.jpg` ``，否则图片 404。

### 现在仓库里的示例图

`public/photos/` 里是**用你自己 OM-1 素材裁的示例图**（双人偶、RX-78-2、微距纹理及其黑白版），只是为了让版式先立起来。正式发布前换成你真正想展示的片子，或者直接删掉。

## 部署到 GitHub Pages

1. 建仓库、推到 `main`；
2. 仓库 **Settings → Pages → Source** 选 **GitHub Actions**；
3. push 后 `.github/workflows/deploy.yml` 自动构建发布；
4. 访问 `https://<用户名>.github.io/<仓库名>/`。

### 两种站点类型（最容易踩的坑）

| 地址 | `NEXT_PUBLIC_BASE_PATH` |
| --- | --- |
| `https://user.github.io/my-site/`（仓库型） | `/my-site` ← workflow 已自动注入仓库名 |
| `https://user.github.io/`（用户型，仓库名须为 `user.github.io`） | 留空，**删掉 workflow 里两处 `env:`** |

设错的症状：页面能打开，但 CSS/JS/图片全 404。

### 自定义域名

1. Pages → Custom domain 填域名；
2. `public/` 下加 `CNAME` 文件，内容一行域名；
3. DNS 的 `CNAME` 指向 `<user>.github.io`（根域名用 A 记录）；
4. 自定义域名后站点在根路径，`NEXT_PUBLIC_BASE_PATH` 要留空。

## 结构

```
app/
  layout.jsx      顶栏（叠在首屏上）、主题、metadata
  page.jsx        首屏 / 作品 / 关于 / 笔记 / 联系
  globals.css     全部样式：:root（暗）与 [data-theme="light"]（亮）两组变量
  icon.svg        favicon
components/
  Lightbox.jsx    作品网格 + 点击放大（Esc 关闭、←/→ 翻页）
  ThemeToggle.jsx 明暗切换（记在 localStorage，支持 ?theme=light 强制）
content/site.js   站点内容（唯一日常要改的文件）
public/photos/    照片；public/.nojekyll 供 Pages 用
out/              npm run build 产物，可直接部署
```

## 说明

- 首屏大图始终是照片本身，明暗主题只影响正文区域，所以标题永远压在半透明黑幕上。
- 断点 960px / 560px；动效遵循 `prefers-reduced-motion`。
- 没有引入 UI 框架和 CSS 库，改配色只动两组 CSS 变量。
