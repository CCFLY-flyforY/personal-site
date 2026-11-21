import { site } from '../content/site';
import WorksSection from '../components/WorksSection';

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <main id="top">
      {/* 首屏：整幅照片 */}
      <section className="hero">
        <img className="hero-img" src={site.heroPhoto.src} alt="" />
        <div className="hero-veil" />
        <div className="hero-copy">
          <p className="eyebrow">{site.role}</p>
          <h1>{site.name}</h1>
          <p className="hero-line">{site.heroLine}</p>
          <p className="hero-meta">{site.heroPhoto.meta}</p>
        </div>
        <a className="hero-down" href="#works" aria-label="往下看作品">
          <span />
        </a>
      </section>

      <WorksSection />

      <section id="about" className="band about">
        <div className="about-photo">
          <img src={site.aboutPhoto.src} alt={site.aboutPhoto.alt} loading="lazy" />
        </div>
        <div className="about-text">
          <div className="band-head tight">
            <h2>關於</h2>
            <p className="eyebrow">About</p>
          </div>
          {site.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <dl className="stats">
            {site.stats.map((s) => (
              <div key={s.k}>
                <dt>{s.k}</dt>
                <dd>{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="projects" className="band">
        <div className="band-head">
          <h2>項目</h2>
          <p className="eyebrow">Projects · {site.projects.length}</p>
        </div>
        <div className="projects">
          {site.projects.map((p, i) => (
            <a className="proj" key={p.name} href={p.href} target="_blank" rel="noreferrer" style={{ '--i': i }}>
              <span className="proj-name">{p.name}</span>
              <span className="proj-desc">{p.desc}</span>
              <span className="proj-foot">
                <span className="proj-tags">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </span>
                <span className="proj-arrow" aria-hidden>↗</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 笔记：暂时隐藏。想恢复就把下面这段取消注释，并把 layout.jsx 的「笔记」导航加回来。
          数据仍然在 content/site.js 的 notes 里。
      <section id="notes" className="band">
        <div className="band-head">
          <h2>笔记</h2>
          <p className="eyebrow">Notes</p>
        </div>
        <ul className="notes">
          {site.notes.map((n) => (
            <li key={n.title}>
              <a href={n.href}>
                <span className="note-date">{n.date}</span>
                <span className="note-body">
                  <strong>{n.title}</strong>
                  <span>{n.summary}</span>
                </span>
                <span className="note-arrow" aria-hidden>→</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      */}

      <section id="contact" className="band contact">
        <div className="band-head tight">
          <h2>聯繫</h2>
          <p className="eyebrow">Get in touch</p>
        </div>
        <a className="mail" href={site.contact[0].href}>
          {site.contact[0].value}
        </a>
        <ul className="links">
          {site.contact.slice(1).map((c) => (
            <li key={c.label}>
              <span className="eyebrow">{c.label}</span>
              <a href={c.href} target="_blank" rel="noreferrer">{c.value}</a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="foot">
        <span>© {year} {site.name}</span>
        <span>Next.js · GitHub Pages</span>
      </footer>
    </main>
  );
}
