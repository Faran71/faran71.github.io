import { useEffect } from 'react';
import {
  FiMail,
  FiCode,
  FiFileText,
  FiUser,
  FiExternalLink,
  FiChevronDown,
  FiDownload,
  FiEye,
} from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { IDENTITY } from '../ide/content';
import { getSkillIcon } from '../ide/skills';
import ThemeToggle from '../theme/ThemeToggle';
import './page.css';

/** Where the downloadable CV lives — a file in public/. */
export const CV_FILE = '/Faran_Sarwar_CV.pdf';

/**
 * Generated filename for the download. Browsers otherwise save it as the URL
 * basename, which is fine, but an explicit name is friendlier in a downloads
 * folder and on a recruiter's desktop.
 */
export const CV_DOWNLOAD_NAME = 'Muhammad-Faran-Sarwar-CV.pdf';

/* ==========================================================================
   The three views of the site.
   `id` matches the URL hash, so each page can be linked directly.
   ========================================================================== */

export const PAGE_LABELS = {
  profile: 'Profile',
  cv: 'CV',
  ide: 'Code',
};

/* ==========================================================================
   Header
   ========================================================================== */

export function PageHeader({ nav = [], onNavigate, current = 'profile', theme }) {
  return (
    <header className="page-header">
      <a
        className="page-header__brand"
        href="#profile"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('profile');
        }}
      >
        <span className="page-header__mark">FS</span>
        <span className="page-header__name">{IDENTITY.shortName}</span>
      </a>

      <nav className="page-header__nav" aria-label="Sections">
        {nav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="page-header__actions">
        {theme && (
          <ThemeToggle
            pref={theme.pref}
            onChange={theme.set}
            systemTheme={theme.systemTheme}
          />
        )}

        {/* The other reading of this site, one click away. */}
        {current !== 'profile' && (
          <button
            type="button"
            className="page-cta page-cta--ghost"
            onClick={() => onNavigate('profile')}
          >
            <FiUser aria-hidden="true" />
            Profile
          </button>
        )}

        {current !== 'cv' && (
          <button
            type="button"
            className="page-cta page-cta--ghost"
            onClick={() => onNavigate('cv')}
          >
            <FiFileText aria-hidden="true" />
            CV
          </button>
        )}

        <button
          type="button"
          className="page-cta page-cta--ghost"
          onClick={() => onNavigate('ide')}
          title="Open this site as a code editor"
        >
          <FiCode aria-hidden="true" />
          <span className="page-header__ide-label">View as VS Code</span>
          <span className="page-header__ide-label-short" aria-hidden="true">
            Code
          </span>
        </button>
      </div>
    </header>
  );
}

/* ==========================================================================
   Section heading
   ========================================================================== */

export function SectionHead({ eyebrow, title, id }) {
  return (
    <header className="page-section__head">
      <p className="page-eyebrow">{eyebrow}</p>
      <h2 className="page-section__title" id={id}>
        {title}
      </h2>
    </header>
  );
}

/* ==========================================================================
   Availability pill
   ========================================================================== */

export function Availability({ children = 'Open to full stack and backend roles' }) {
  return (
    <p className="page-availability">
      <span className="page-dot" />
      {children}
    </p>
  );
}

/* ==========================================================================
   CV download
   Two options on purpose: recruiters often want the file, but anyone who would
   rather read it in the browser first gets a preview link.
   ========================================================================== */

export function CvActions({ compact = false }) {
  return (
    <>
      <a
        className={`page-cta${compact ? '' : ' page-cta--primary'}`}
        href={process.env.PUBLIC_URL + CV_FILE}
        download={CV_DOWNLOAD_NAME}
      >
        <FiDownload aria-hidden="true" />
        Download CV
      </a>

      <a
        className="page-cta"
        href={process.env.PUBLIC_URL + CV_FILE}
        target="_blank"
        rel="noreferrer noopener"
      >
        <FiEye aria-hidden="true" />
        View PDF
      </a>
    </>
  );
}

/* ==========================================================================
   Proficiency bars
   ========================================================================== */

export function SkillBars({ groups }) {
  return (
    <div className="skill-stack">
      {groups.map((group) => (
        <div key={group.group}>
          <h3 className="skill-stack__label">{group.group}</h3>
          <ul className="skill-stack__list">
            {group.items.map((item) => {
              const Icon = getSkillIcon(item.icon);
              return (
                <li
                  className="skill-stack__item"
                  key={item.name}
                  style={{ '--skill-color': item.color, '--skill-level': `${item.level}%` }}
                >
                  <Icon className="skill-stack__icon" aria-hidden="true" />
                  <span className="skill-stack__name">{item.name}</span>
                  <span className="skill-stack__bar" aria-hidden="true">
                    <span className="skill-stack__fill" />
                  </span>
                  <span className="skill-stack__pct">{item.level}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ==========================================================================
   Work / project cards
   ========================================================================== */

export function WorkCard({ item }) {
  const wip = /progress|ongoing/i.test(item.status || '');
  return (
    <article className="work-card">
      <div className="work-card__top">
        <h3 className="work-card__name">{item.name}</h3>
        {item.status && (
          <span className={`work-card__badge${wip ? ' work-card__badge--wip' : ''}`}>
            {item.status}
          </span>
        )}
      </div>

      {item.company && <p className="work-card__company">{item.company}</p>}
      <p className="work-card__summary">{item.summary}</p>
      {item.role && <p className="work-card__role">{item.role}</p>}

      <ul className="page-tags">
        {item.stack.map((t) => (
          <li key={t} className="page-tag">
            {t}
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ==========================================================================
   Contact
   ========================================================================== */

export function ContactSection({ lead }) {
  const linkedin = IDENTITY.links.find((l) => l.icon === 'linkedin');
  const github = IDENTITY.links.find((l) => l.icon === 'github');

  return (
    <section className="page-section" aria-labelledby="contact">
      <SectionHead eyebrow="Contact" title="Get in touch" id="contact" />
      {lead && <p className="page-contact__lead">{lead}</p>}

      <div className="contact-grid">
        <a className="contact-card" href={`mailto:${IDENTITY.email}`}>
          <FiMail aria-hidden="true" />
          <span className="contact-card__label">Email</span>
          <span className="contact-card__value">{IDENTITY.email}</span>
        </a>

        {linkedin && (
          <a
            className="contact-card"
            href={linkedin.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            <FaLinkedin aria-hidden="true" />
            <span className="contact-card__label">LinkedIn</span>
            <span className="contact-card__value">
              muhammad-faran-sarwar <FiExternalLink aria-hidden="true" />
            </span>
          </a>
        )}

        {github && (
          <a className="contact-card" href={github.url} target="_blank" rel="noreferrer noopener">
            <FaGithub aria-hidden="true" />
            <span className="contact-card__label">GitHub</span>
            <span className="contact-card__value">
              Faran71 <FiExternalLink aria-hidden="true" />
            </span>
          </a>
        )}
      </div>
    </section>
  );
}

/* ==========================================================================
   Footer + back-to-top
   ========================================================================== */

export function PageFooter({ onNavigate, current = 'profile' }) {
  return (
    <footer className="page-footer">
      <p className="page-footer__meta">
        {IDENTITY.name} · {IDENTITY.location}
      </p>

      <div className="page-footer__actions">
        {current !== 'profile' && (
          <button
            type="button"
            className="page-cta page-cta--ghost"
            onClick={() => onNavigate('profile')}
          >
            <FiUser aria-hidden="true" />
            Profile
          </button>
        )}
        {current !== 'cv' && (
          <button type="button" className="page-cta page-cta--ghost" onClick={() => onNavigate('cv')}>
            <FiFileText aria-hidden="true" />
            Read the CV
          </button>
        )}
        <button type="button" className="page-cta page-cta--ghost" onClick={() => onNavigate('ide')}>
          <FiCode aria-hidden="true" />
          Code editor view
        </button>
      </div>
    </footer>
  );
}

export function BackToTop() {
  return (
    <button
      type="button"
      className="page-totop"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <FiChevronDown aria-hidden="true" style={{ transform: 'rotate(180deg)' }} />
    </button>
  );
}

/* ==========================================================================
   Shared page wrapper — header, main, footer, scroll reset
   ========================================================================== */

export function PageShell({
  current,
  nav,
  onNavigate,
  children,
  contactLead,
  footer = true,
  theme,
}) {
  // Each page is a fresh document as far as the reader is concerned.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [current]);

  return (
    <div className="page">
      <PageHeader nav={nav} onNavigate={onNavigate} current={current} theme={theme} />
      <main id="top">{children}</main>
      {contactLead !== undefined && <ContactSection lead={contactLead} />}
      {footer && <PageFooter onNavigate={onNavigate} current={current} />}
      <BackToTop />
    </div>
  );
}
