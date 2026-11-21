'use client';

import { useEffect, useState } from 'react';
import Gallery from './Gallery';
import { site } from '../content/site';

/**
 * 作品区：默认收起，不主动展开。
 * 收起时不渲染 Gallery —— 24 张照片一张都不会下载，首屏只剩 hero 那张。
 * 点「展開」或点导航「作品」（跳到 #works）时才展开。
 */
export default function WorksSection() {
  const [open, setOpen] = useState(false);

  // 从别处点「作品」链接跳进来时展开一次
  useEffect(() => {
    function sync() {
      if (window.location.hash === '#works') setOpen(true);
    }
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const summary = site.categories
    .filter((c) => c.id !== 'all')
    .map((c) => {
      const n = site.works.filter((w) => w.cat === c.id).length;
      return n ? `${c.label} ${n}` : null;
    })
    .filter(Boolean)
    .join(' · ');

  return (
    <section id="works" className="band works-band">
      <div className="band-head works-head">
        <h2>作品</h2>
        <p className="eyebrow">Selected works · {site.works.length}</p>
        <button
          type="button"
          className="works-toggle"
          aria-expanded={open}
          aria-controls="works-body"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '收起' : '展開'}
          <span className={`works-chev${open ? ' is-open' : ''}`} aria-hidden />
        </button>
      </div>

      {!open && <p className="works-peek">{summary}</p>}

      {open && (
        <div id="works-body" className="works-body">
          <Gallery photos={site.works} categories={site.categories} />
        </div>
      )}
    </section>
  );
}
