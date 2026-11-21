'use client';

import { useCallback, useEffect, useState } from 'react';

export default function Lightbox({ photos }) {
  const [index, setIndex] = useState(-1);
  const open = index >= 0;

  const close = useCallback(() => setIndex(-1), []);
  const step = useCallback(
    (dir) => setIndex((i) => (i + dir + photos.length) % photos.length),
    [photos.length]
  );

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    }
    if (open) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, step]);

  const current = open ? photos[index] : null;

  return (
    <>
      <div className="works">
        {photos.map((p, i) => (
          <figure
            key={p.src + i}
            className={`shot${p.wide ? ' wide' : ''}`}
            onClick={() => setIndex(i)}
            style={{ '--i': i }}
          >
            <div className="shot-frame">
              <img src={p.src} alt={p.title} loading={i < 2 ? 'eager' : 'lazy'} style={{ objectPosition: p.focus || 'center' }} />
              <span className="shot-zoom" aria-hidden>查看</span>
            </div>
            <figcaption>
              <span className="shot-title">{p.title}</span>
              <span className="shot-meta">{p.meta}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {open ? (
        <div className="lb" onClick={close} role="dialog" aria-modal="true" aria-label={current.title}>
          <div className="lb-inner" onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.title} />
            <div className="lb-cap">
              <span className="shot-title">{current.title}</span>
              <span className="shot-meta">{current.meta}</span>
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
