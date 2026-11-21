'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export default function Gallery({ photos, categories }) {
  const [cat, setCat] = useState('all');
  const [index, setIndex] = useState(-1);

  const list = useMemo(
    () => (cat === 'all' ? photos : photos.filter((p) => p.cat === cat)),
    [photos, cat]
  );

  const countOf = useCallback(
    (id) => (id === 'all' ? photos.length : photos.filter((p) => p.cat === id).length),
    [photos]
  );

  const close = useCallback(() => setIndex(-1), []);
  const step = useCallback(
    (dir) => setIndex((i) => (i + dir + list.length) % list.length),
    [list.length]
  );

  useEffect(() => {
    if (index >= 0 && index > list.length - 1) setIndex(-1);
  }, [list.length, index]);

  useEffect(() => {
    function onKey(e) {
      if (index < 0) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    }
    window.addEventListener('keydown', onKey);
    if (index >= 0) document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, close, step]);

  const current = index >= 0 ? list[index] : null;

  return (
    <>
      <div className="filters" role="tablist" aria-label="作品分类">
        {categories.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={cat === c.id}
            className={`chip${cat === c.id ? ' on' : ''}`}
            onClick={() => {
              setCat(c.id);
              setIndex(-1);
            }}
          >
            {c.label}
            <span className="chip-n">{countOf(c.id)}</span>
          </button>
        ))}
      </div>

      <div className="masonry">
        {list.map((p, i) => (
          <figure className="shot" key={p.src} onClick={() => setIndex(i)} style={{ '--i': i }}>
            <div className="shot-frame">
              <img
                src={p.src}
                alt={p.title}
                loading={i < 3 ? 'eager' : 'lazy'}
                style={{ objectPosition: p.focus || 'center' }}
              />
              <span className="shot-zoom" aria-hidden>查看</span>
            </div>
            <figcaption>
              <span className="shot-title">{p.title}</span>
              <span className="shot-meta">{p.meta}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {current ? (
        <div className="lb" onClick={close} role="dialog" aria-modal="true" aria-label={current.title}>
          <div className="lb-inner" onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.title} />
            <div className="lb-cap">
              <span className="shot-title">{current.title}</span>
              <span className="shot-meta">
                {current.meta} · {index + 1}/{list.length}
              </span>
            </div>
          </div>
          <button className="lb-close" onClick={close} aria-label="关闭">×</button>
          <button className="lb-nav prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="上一张">‹</button>
          <button className="lb-nav next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="下一张">›</button>
        </div>
      ) : null}
    </>
  );
}
