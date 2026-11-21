# 申请 skyvault.eu.org（免费、永久、可绑定 GitHub Pages）

> 2026-11 核对：`nic.eu.org` 可访问（HTTP 200）；`skyvault.eu.org` 当前 **NXDOMAIN = 未被占用**。
> 备用名（同样未占用）：`skyvault-photo.eu.org` / `skyvaultgallery.eu.org` / `vaultsky.eu.org`

---

## 0. 先看三条实情

1. **不是马上能用**：人工审核，社区反馈 1–4 周，没有加急。
2. **whois 是公开的**：申请时要填真实姓名、邮箱、国家、（可能）地址。eu.org 的 whois 能看到这些。不想公开就用一个专用邮箱（如 `skyvault.contact@qq.com` 之类的新号），地址写到「城市 + 国家」粒度即可。
3. **不能备案**，所以国内速度依旧取决于你最终放在哪个 CDN（GitHub Pages / Cloudflare Pages 都在海外）。

---

## 1. 先去备好 DNS 服务商（关键，别跳）

eu.org 申请时必须填 **2 个以上 nameserver**，而且审核时会去查这些 NS 是否真的**在响应**你的域名。

| 方案 | 会不会卡审核 | 说明 |
|---|---|---|
| **Hurricane Electric（推荐）** | 不会，加完立即响应 | 免费、老牌；`dns.he.net` 注册后 Add a new domain 即生效，立刻能在 `ns1-ns5.he.net` 上服务 |
| Cloudflare 免费版 | **会**| CF 要等域名委派过来才激活 zone，审核期间大概率是 pending，eu.org 那边查 NS 可能查不到 |

**结论：申请阶段用 HE，一步到位。** 步骤：

1. https://dns.he.net/ 注册账号（免费）
2. **Add a new domain** → 填 `skyvault.eu.org`
3. 记下它给的 NS，通常是：
   ```
   ns1.he.net
   ns2.he.net
   ns3.he.net
   ```
   （建议把 ns1–ns3 都填进 eu.org，冗余多一些）

---

## 2. 建 NIC handle（申请人档案）

打开 https://nic.eu.org/ → 界面上是 **「New handle」/「Request a domain」** 两个入口，先建 handle。

要填的内容（照抄改）：

| 字段 | 建议值 |
|---|---|
| Name | `Fly forY` 或你的真名（拼音也行） |
| Email | 一个你**长期在用**的邮箱（审核结果会发这里） |
| Address | `City, Province, CN` 这种粒度就够 |
| Country | `CN` |
| Phone | 可不填或填手机号 |

提交后会立刻给一个**handle 编号**（形如 `XX-XXXX`）和一个密码——**存好，后面申请域名要用它登录**。

---

## 3. 申请域名

同一站点进 **「Request a domain」**：

| 字段 | 填什么 |
|---|---|
| Complete domain name | **`skyvault.eu.org`** |
| Nameservers | `ns1.he.net` / `ns2.he.net` / `ns3.he.net` |
| Description / Comment（有就填） | 见下面英文模板 |

英文模板（直接粘贴，别写营销话术，eu.org 只想知道你会不会真用）：

```
Personal photography portfolio (static site, Next.js).
Landscape and wildlife photography, ~24 photos.
Currently served from GitHub Pages; this domain would be its permanent home.
No commercial use, no parking, single domain only.
```

提交后状态是 `in progress` / `not delegated`，剩下的就是等。

---

## 4. 等待期（1–4 周）怎么不浪费时间

**先把站点发布到 GitHub Pages 的默认地址**，等域名批下来再切——两步而已：

1. 建仓库 `personal-site`，推到 `main`；
2. Settings → Pages → Source 选 **GitHub Actions**；
3. `.github/workflows/deploy.yml` 里已经写好 `NEXT_PUBLIC_BASE_PATH: /${{ github.event.repository.name }}`，所以能直接访问：
   `https://ccfly-flyfor-y.github.io/personal-site/`

> 现在就想要一个短地址：仓库命名成 `ccfly-flyfor-y.github.io`，地址就是 `https://ccfly-flyfor-y.github.io/`。

---

## 5. 批下来之后：把域名指到 GitHub Pages

在 HE 的 `skyvault.eu.org` zone 里加这几条（GitHub 官方地址，已核对 `api.github.com/meta`）：

| 类型 | 名称 | 值 |
|---|---|---|
| A | `@`（skyvault.eu.org） | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `ccfly-flyfor-y.github.io` |

然后在仓库 **Settings → Pages → Custom domain** 填 `skyvault.eu.org` → Save
→ 等 DNS 检查通过（几分钟到数小时）→ 勾上 **Enforce HTTPS**（证书自动签，Let's Encrypt）。

---

## 6. ⚠️ 切自定义域名时必须改的一个地方

GitHub Pages 一旦绑了自定义域名，站点就从**域名根路径**提供，`/<仓库名>/` 这个前缀会消失。

所以：

| 场景 | `NEXT_PUBLIC_BASE_PATH` |
|---|---|
| 用 `ccfly-flyfor-y.github.io/personal-site/` | `/personal-site`（workflow 自动注入，不用改） |
| 用 `skyvault.eu.org`（自定义域名） | **必须留空** |

改法：`.github/workflows/deploy.yml` 里那行 `NEXT_PUBLIC_BASE_PATH: /${{ ... }}` 删掉/置空，再推一次。
不改的症状：页面能打开但**样式和图片全 404**。

---

## 7. 万一被拒

eu.org 拒绝通常有三种：名字像商标/钓鱼、申请人囤了一堆域名、NS 检查没过。
- NS 没过 → 换 HE 的 NS 重新提交；
- 名字被认为有问题 → 换 `skyvault-photo.eu.org` 之类；
- 彻底不想等 → 走 `xxx.is-a.dev`（GitHub 提 PR，当天到几天），或直接用 `xxx.pages.dev` / `xxx.vercel.app`。

---

## 参考

- nic.eu.org 官方政策与申请入口：https://nic.eu.org/
- 免费域名现状与 eu.org 流程说明：https://arynjennen1989-stack.github.io/guides/how-to-get-a-free-eu-org-domain.html
- GitHub Pages 自定义域名与 IP：https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site
