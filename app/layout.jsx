import './globals.css';
import ThemeToggle from '../components/ThemeToggle';
import { site } from '../content/site';

export const metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.heroLine,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.heroLine,
    type: 'website',
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
    <html lang="zh-Hant" data-theme="dark" suppressHydrationWarning>
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
