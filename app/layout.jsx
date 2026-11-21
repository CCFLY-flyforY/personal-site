import './globals.css';
import ThemeToggle from '../components/ThemeToggle';
import { site } from '../content/site';

// 分享卡片（og:image）需要绝对地址。
// 注意：site.heroPhoto.src 里已经带了 NEXT_PUBLIC_BASE_PATH 前缀，
// 所以这里只拼「域名」，不能再交给 metadataBase 解析一次，否则会 /repo/repo/ 双前缀。
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://ccfly-flyfory.github.io';
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
const SITE_URL = `${ORIGIN}${BASE_PATH}/`;
const OG_IMAGE = `${ORIGIN}${site.heroPhoto.src}`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${site.name} — ${site.role}`,
  description: site.heroLine,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.heroLine,
    type: 'website',
    url: SITE_URL,
    siteName: site.name,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.role}`,
    description: site.heroLine,
    images: [OG_IMAGE],
  },
};

const themeScript = `
(function () {
  try {
    var forced = new URLSearchParams(location.search).get('theme');
    var saved = localStorage.getItem('theme');
    var theme = forced || saved || 'dark';
    document.documentElement.dataset.theme = theme;
    if (new URLSearchParams(location.search).get('stone') === 'off') {
      document.documentElement.dataset.stone = 'off';
    }
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="zh-Hant"
      data-theme="dark"
      suppressHydrationWarning
      style={{
        '--tex-dust': `url('${process.env.NEXT_PUBLIC_BASE_PATH || ''}/textures/stone-dust.png')`,
      }}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body>
        <header className="site-head">
          <a className="mark" href="#top">
            {site.name}
          </a>
          <nav>
            <a href="#works">作品</a>
            <a href="#about">關於</a>
            <a href="#projects">項目</a>
            <a href="#contact">聯繫</a>
          </nav>
          <ThemeToggle />
        </header>
        {children}
      </body>
    </html>
  );
}
