import './globals.css';
import ThemeToggle from '../components/ThemeToggle';
import { site } from '../content/site';

// 站点对外地址：抓取分享卡片（og:image）时需要绝对地址，否则会落成 localhost。
// 绑自定义域名后把 NEXT_PUBLIC_SITE_URL 换成 https://skyvault.eu.org/
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  `https://ccfly-flyfory.github.io${process.env.NEXT_PUBLIC_BASE_PATH || ''}/`;

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
    images: [site.heroPhoto.src],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.role}`,
    description: site.heroLine,
    images: [site.heroPhoto.src],
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
