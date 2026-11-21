/** GitHub Pages 是纯静态托管，所以用 output: 'export' 生成 out/ 目录。
 *  basePath：仓库型站点（https://<user>.github.io/<repo>/）需要填 /<repo>；
 *  用户型站点（https://<user>.github.io/）留空。构建时由环境变量注入，见 README。
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
