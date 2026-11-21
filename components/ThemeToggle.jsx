'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || 'dark');
  }, []);

  function toggle() {
    const next = (document.documentElement.dataset.theme || 'dark') === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
    setTheme(next);
  }

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="切换明暗主题" title="切换明暗主题">
      {theme === 'light' ? '☾' : '☀'}
    </button>
  );
}
