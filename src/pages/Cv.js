import { IDENTITY, BIO, STACK, SKILL_BANDS, CERTIFICATIONS, STATS } from '../ide/content';
import { PROJECTS, EXPERIENCE, EDUCATION } from '../ide/profile';
import {
  PageShell,
  SectionHead,
  Availability,
  SkillBars,
  WorkCard,
  CvActions,
} from '../shared/Page';
import './cv.css';

import { FiMail } from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

/**
 * The formal CV.
 *
 * This is the page for a hiring process: roles with dates, education and
 * certifications. The Profile page carries the friendlier, personal version.
 */
export default function Cv({ onNavigate, theme }) {
  const nav = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ];

  const linkedin = IDENTITY.links.find((l) => l.icon === 'linkedin');
  const github = IDENTITY.links.find((l) => l.icon === 'github');

  return (
    <PageShell
      current="cv"
      theme={theme}
      nav={nav}
      onNavigate={onNavigate}
      contactLead="I answer everything. If you are hiring, tell me what the problem is and I will tell you honestly whether I am the right person for it."
    >
      {/* ── hero ──────────────────────────────────────────────── */}
      <section className="cv-hero" aria-label="Introduction">
        <div className="cv-hero__inner">
          <div className="cv-hero__text">
            <Availability />

            <h1 className="cv-hero__name">{IDENTITY.name}</h1>
            <p className="cv-hero__role">{IDENTITY.role}</p>
            <p className="cv-hero__summary">{IDENTITY.summary}</p>

            <ul className="cv-hero__facts">
              <li>
                <span className="cv-hero__factlabel">Location</span>
                {IDENTITY.location}
              </li>
              <li>
                <span className="cv-hero__factlabel">Email</span>
                <a href={`mailto:${IDENTITY.email}`}>{IDENTITY.email}</a>
              </li>
            </ul>

            <div className="cv-hero__actions">
              <CvActions />
              <a className="page-cta" href={`mailto:${IDENTITY.email}`}>
                <FiMail aria-hidden="true" />
                Email me
              </a>
              {linkedin && (
                <a
                  className="page-cta"
                  href={linkedin.url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <FaLinkedin aria-hidden="true" />
                  LinkedIn
                </a>
              )}
              {github && (
                <a className="page-cta" href={github.url} target="_blank" rel="noreferrer noopener">
                  <FaGithub aria-hidden="true" />
                  GitHub
                </a>
              )}
            </div>
          </div>

          <div className="cv-hero__photo">
            <img src={process.env.PUBLIC_URL + '/profile-nobg.png'} alt={IDENTITY.name} />
          </div>
        </div>

        <ul className="cv-stats">
          {STATS.map((s) => (
            <li key={s.label}>
              <span className="cv-stats__value">{s.value}</span>
              <span className="cv-stats__label">{s.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── about ─────────────────────────────────────────────── */}
      <section className="page-section" aria-labelledby="about">
        <SectionHead eyebrow="About" title="Professional summary" id="about" />
        <div className="page-prose">
          {BIO.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </section>

      {/* ── experience ────────────────────────────────────────── */}
      <section className="page-section" aria-labelledby="experience">
        <SectionHead eyebrow="Experience" title="Professional experience" id="experience" />

        <ol className="cv-timeline">
          {EXPERIENCE.map((role) => (
            <li className="cv-role" key={`${role.company}-${role.period}`}>
              <div className="cv-role__head">
                <h3 className="cv-role__title">{role.title}</h3>
                <p className="cv-role__meta">
                  <strong>{role.company}</strong>
                  <span className="cv-sep">·</span>
                  {role.location}
                  <span className="cv-sep">·</span>
                  <span className="cv-role__period">{role.period}</span>
                </p>
              </div>

              <ul className="cv-bullets">
                {role.highlights.map((h) => (
                  <li key={h.slice(0, 24)}>{h}</li>
                ))}
              </ul>

              <ul className="page-tags" aria-label="Technologies used">
                {role.stack.map((t) => (
                  <li key={t} className="page-tag">
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* ── projects ──────────────────────────────────────────── */}
      <section className="page-section" aria-labelledby="projects">
        <SectionHead eyebrow="Projects" title="Selected projects" id="projects" />

        <div className="work-grid">
          {PROJECTS.map((p) => (
            <WorkCard item={p} key={p.name} />
          ))}
        </div>
      </section>

      {/* ── skills ────────────────────────────────────────────── */}
      <section className="page-section" aria-labelledby="skills">
        <SectionHead eyebrow="Skills" title="Technical skills" id="skills" />

        <div className="cv-skills">
          {SKILL_BANDS.map((band) => (
            <div className="cv-skillband" key={band.band}>
              <div className="cv-skillband__head">
                <h3>{band.band}</h3>
                <p>{band.note}</p>
              </div>
              <ul className="cv-skillband__items">
                {band.items.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <SkillBars groups={STACK} />
      </section>

      {/* ── education + certifications ────────────────────────── */}
      <section className="page-section cv-section--split" aria-labelledby="education">
        <div>
          <SectionHead eyebrow="Education" title="Academic background" id="education" />
          <ol className="cv-edu">
            {EDUCATION.map((e) => (
              <li className="cv-edu__item" key={e.school}>
                <h3>{e.qualification}</h3>
                <p className="cv-edu__school">{e.school}</p>
                <p className="cv-edu__detail">{e.detail}</p>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <SectionHead
            eyebrow="Certifications"
            title="Professional certifications"
            id="certifications"
          />
          <ol className="cv-edu">
            {CERTIFICATIONS.map((c) => (
              <li className="cv-edu__item" key={c.name}>
                <h3>{c.name}</h3>
                <p className="cv-edu__school">{c.issuer}</p>
                <p className="cv-edu__meta">{c.date}</p>
                <p className="cv-edu__detail">{c.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}
