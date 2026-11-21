# 个人主页

Next.js（App Router）+ 静态导出，部署到 GitHub Pages。构建产物就是 `out/` 里的一堆静态文件，扔到任何静态托管都能跑。

## 本地预览

```bash
npm install             # 已装好，改依赖后再跑
npm run dev             # http://localhost:4173
npm run build           # 生成 out/
npm run serve           # 本地预览 out/（npx serve）
```

## 改内容

**只改一个文件：`content/site.js`**

| 字段 | 说明 |
| --- | --- |
| `name` / `latin` / `role` | 名字、英文名、一行身份 |
| `tagline` / `now` | 首屏那句话、最近在做什么 |
| `about` | 关于，字符串数组，一段一条 |
| `projects` | 项目卡片：title / year / desc / tags / href |
| `photos` | 照片：title / meta / tone（tone 是占位渐变的代号 a–d） |
| `posts` | 文章列表：title / date / summary / href |
| `contact` | 联系方式：label / value / href |

### 换真照片

1. 图片放进 `public/photos/`；
2. 在 `content/site.js` 里把对应的 `tone` 换成 `src: '/photos/rx78.jpg'`；
3. `app/page.jsx` 里 `<figure>` 内的 `.photo-canvas` 占位 div 换成 `<img src={ph.src} alt={ph.title} />`（用 `<img>` 而不是 `next/image`，因为静态导出下图片优化是关掉的，没必要）。

子路径部署时，`src` 要带上前缀：`` `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/photos/rx78.jpg` ``。

## 部署到 GitHub Pages

1. 建仓库，把本目录推上去（分支 `main`）；
2. 仓库 **Settings → Pages → Source** 选 **GitHub Actions**；
3. push 后 `.github/workflows/deploy.yml` 自动构建并发布；
4. 访问 `https://<用户名>.github.io/<仓库名>/`。

### 两种站点类型（最容易踩的坑）

| 你的地址 | `NEXT_PUBLIC_BASE_PATH` |
| --- | --- |
| `https://user.github.io/my-site/`（仓库型） | `/my-site` ← workflow 里已自动注入仓库名 |
| `https://user.github.io/`（用户型，仓库名必须是 `user.github.io`） | 留空，**删掉 workflow 里两处 `env:`** |

设错的典型症状：页面能打开但 CSS/JS 全 404，样式全丢。

### 自定义域名

1. 仓库 **Settings → Pages → Custom domain** 填 `example.com`；
2. 在 `public/` 下加一个 `CNAME` 文件，内容就一行域名（构建会复制到 `out/CNAME`）；
3. DNS 加 `CNAME` 记录指向 `<user>.github.io`（根域名用 A 记录指向 GitHub 的 IP）。

注意：自定义域名后站点在根路径，`NEXT_PUBLIC_BASE_PATH` 要留空。

## 结构

```
app/
  layout.jsx      顶栏、主题（暗/亮，支持 ?theme=light 强制）、metadata
  page.jsx        首页五个区块：关于 / 项目 / 照片 / 写作 / 联系
  globals.css     全部样式（设计变量都在顶部 :root）
  icon.svg        favicon
content/site.js   站点内容（唯一需要日常修改的文件）
components/       ThemeToggle
public/           静态资源（照片、CNAME、.nojekyll）
out/              npm run build 的产物，可直接部署
```

## 说明

- 主题默认跟随系统，右上角可手动切换，选择记在 `localStorage`。
- 响应式断点 900px / 560px；动效遵循 `prefers-reduced-motion`。
- 没有引入任何 UI 框架和 CSS 库，样式全在 `globals.css`，改配色只动 `:root` / `[data-theme="light"]` 两组变量。
