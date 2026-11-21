import './globals.css';
import ThemeToggle from '../components/ThemeToggle';
import { site } from '../content/site';

export const metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.tagline,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    type: 'website',
  },
};

const themeScript = `
(function () {
  try {
    var forced = new URLSearchParams(location.search).get('theme');
    var saved = localStorage.getItem('theme');
    var theme = forced || saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body>
        <header className="topbar">
          <a className="brand" href="#top">
            <span className="brand-dot" />
            {site.name}
          </a>
          <nav className="nav">
            <a href="#about">关于</a>
            <a href="#work">项目</a>
            <a href="#photos">照片</a>
            <a href="#writing">写作</a>
            <a href="#contact">联系</a>
          </nav>
          <ThemeToggle />
        </header>
        {children}
      </body>
    </html>
  );
}
