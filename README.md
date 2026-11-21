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
| `works` | 作品：`src` / `title` / `meta` / `cat`（分类 id）/ `focus`（裁切重心） |
| `categories` | 分类：`id` / `label`，顺序就是页面上筛选按钮的顺序，`id` 必须和作品的 `cat` 对上 |
| `notes` | 笔记（当前在页面上隐藏，数据保留）：`title` / `date` / `summary` / `href` |
| `projects` | GitHub 小項目：`name`（仓库名）/ `desc` / `tags` / `href` |
| `contact` | 第一条是大号邮箱，其余是下面的小链接 |

### 换成你自己的照片

1. 图片放进 `public/photos/`（建议长边 1600–2000 px、JPEG quality 85，单张 300 KB 以内）；
2. 在 `content/site.js` 里把 `src` 改成 `/photos/你的文件名.jpg`；
3. 竖图横图都可以，**瀑布流按自然比例排**，不用手动指定尺寸；
4. `focus` 控制裁切重心，比如 `'center 30%'` 让人脸留在上方（只在灯箱/裁切场景生效）；
5. 想加分类：`categories` 里加一项，再把作品的 `cat` 设成那个 `id`，按钮和计数会自动出现。

### 分类与瀑布流

- 筛选是纯客户端状态：点分类只切换列表，不刷新页面；数量角标自动统计。
- 瀑布流用 CSS `columns`（桌面 3 栏 / ≤960px 2 栏 / ≤620px 1 栏），靠 `break-inside: avoid` 让每张图不被切开。
- 灯箱在筛选后的列表里工作：`←/→` 只翻当前分类，右上角显示「序号/总数」。

> 子路径部署（仓库型站点）时 `src` 要带前缀：`` `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/photos/x.jpg` ``，否则图片 404。

### 现在仓库里的照片

- `public/photos/thunder/`：21 张（风景 10 / 鸟类 5 / 城市 4 / 静物 1 / 夜景 1），来源是 `D:\迅雷下载` 里那批照片；
- 首屏 `mountain-grass.jpg`（2400px），关于区 `about-portrait.jpg`（从 lake-snow 裁 4:5）；
- 处理脚本 `tools/process_thunder.py`：自动裁掉相机白边（`CROP` 里是按图实测的内缩像素）、长边 1800、JPEG q84。

`tools/render_xj.py` 是早前新疆 DNG 那批的 RAW 渲染脚本，保留备用。

### 关于颜色

rawpy 的默认输出是"平"的（只有相机矩阵 + gamma，没有色调曲线、没有饱和，还带 auto-bright），所以直接转出来会比机内 JPEG / Lightroom 修过的版本淡很多。`tools/render_xj.py` 改成：

```
linear sRGB(16bit) → 分位归一化 → ACES 近似色调映射 → 对比 1.02 / 饱和 1.12
```

改口味就调 `DEFAULT` 里的 `exposure / contrast / saturation`，然后：

```bash
python tools/render_xj.py
```

需要和你在 Lightroom 里修的那版完全一致，就把那 7 张导出成 JPEG（长边 2000、quality 85+）丢进 `public/photos/xinjiang/`，文件名保持一致即可覆盖 —— 这是唯一能 1:1 还原你调色的办法，因为 DNG 本身只存原始/线性数据和预览，不存你的调色。

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


### 发布与自检

- `powershell -NoProfile -ExecutionPolicy Bypass -File tools\publish.ps1` —— 一键：检查仓库 → 设 remote → 推送 → 打开 Pages 设置
- `python tools\check_site.py <站点地址>` —— 部署后自检（首页/内容/照片/贴图/CSS 是否都 200）
- GitHub Actions 每次部署完也会自动跑同样的自检，失败会让 Actions 标红
- 详细步骤见 `docs/deploy-howto.md`，免费域名见 `docs/free-domain-eu-org.md`

### 切到自定义域名（skyvault.eu.org 批下来之后）

```
python tools\switch_domain.py                # 先预览要改什么、要加哪些 DNS 记录
python tools\switch_domain.py --apply        # 真的切：设 SITE_DOMAIN 变量 → 写 CNAME → 推送 → 设 Pages 域名
python tools\switch_domain.py --apply --wait 20   # 切完顺便等域名生效
```

切换后 workflow 看到仓库变量 `SITE_DOMAIN` 非空，会自动把 `basePath` 置空（站点从根路径提供）。

### git 推不上去时的备用通道

国内网络有时会掐掉 github.com 的 443（报 Recv failure: Connection was reset），
但 pi.github.com 通常还通。这时用：

```
python tools\api_push.py            # 预览要推哪些文件
python tools\api_push.py --apply    # 走 REST API 提交（blob→tree→commit→移动分支）
```

它按**内容哈希**比对远端，内容一致的文件会自动跳过，可重复执行。
