import { site } from '../content/site';

function SectionHead({ index, title, note }) {
  return (
    <div className="sec-head">
      <span className="sec-index">{index}</span>
      <h2>{title}</h2>
      {note ? <span className="sec-note">{note}</span> : null}
    </div>
  );
}

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <main id="top">
      <section className="hero">
        <p className="hero-kicker">
          <span className="mono">{site.latin}</span>
          <span className="sep">/</span>
          {site.role}
        </p>
        <h1 className="hero-title">
          {site.name}
          <span className="hero-dot">.</span>
        </h1>
        <p className="hero-tagline">{site.tagline}</p>
        <p className="hero-now">{site.now}</p>
        <div className="hero-links">
          {site.contact.slice(0, 2).map((c) => (
            <a key={c.label} className="btn" href={c.href} target="_blank" rel="noreferrer">
              {c.label} <span aria-hidden>↗</span>
            </a>
          ))}
        </div>
      </section>

      <section id="about" className="section">
        <SectionHead index="01" title="关于" note="在做的事 / 关心的事" />
        <div className="about">
          {site.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section id="work" className="section">
        <SectionHead index="02" title="项目" note={`${site.projects.length} 个`} />
        <ul className="projects">
          {site.projects.map((p) => (
            <li className="project" key={p.title}>
              <a href={p.href}>
                <div className="project-top">
                  <h3>{p.title}</h3>
                  <span className="mono year">{p.year}</span>
                </div>
                <p>{p.desc}</p>
                <div className="tags">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="photos" className="section">
        <SectionHead index="03" title="照片" note="静物 / 模型 / 光线" />
        <div className="photos">
          {site.photos.map((ph, i) => (
            <figure className={`photo tone-${ph.tone}`} key={ph.title} style={{ '--i': i }}>
              <div className="photo-canvas" aria-hidden>
                <span className="photo-hint">替换成你的照片</span>
              </div>
              <figcaption>
                <strong>{ph.title}</strong>
                <span className="mono">{ph.meta}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="writing" className="section">
        <SectionHead index="04" title="写作" note="踩过的坑与记下的结论" />
        <ul className="posts">
          {site.posts.map((post) => (
            <li key={post.title}>
              <a href={post.href}>
                <span className="mono date">{post.date}</span>
                <span className="post-body">
                  <strong>{post.title}</strong>
                  <span>{post.summary}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className="section">
        <SectionHead index="05" title="联系" note="随时找我聊天" />
        <ul className="contact">
          {site.contact.map((c) => (
            <li key={c.label}>
              <span className="mono label">{c.label}</span>
              <a href={c.href} target="_blank" rel="noreferrer">
                {c.value} <span aria-hidden>↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="footer">
        <span className="mono">© {year} {site.name}</span>
        <span className="mono dim">Next.js 静态导出 · GitHub Pages</span>
      </footer>
    </main>
  );
}
