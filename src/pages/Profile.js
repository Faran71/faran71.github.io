import { IDENTITY, BIO, STACK, STATS } from '../ide/content';
import { PROJECTS, EXPERIENCE } from '../ide/profile';
import {
  PageShell,
  SectionHead,
  Availability,
  SkillBars,
  WorkCard,
  CvActions,
} from '../shared/Page';
import './profile.css';

import { FiMail, FiArrowDown, FiCode, FiFileText } from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

/**
 * What I actually do, in the order I normally touch it.
 *
 * Kept deliberately short — this is the scannable version of the CV's
 * experience section, not a duplicate of it.
 */
const WHAT_I_DO = [
  {
    title: 'Frontend',
    body:
      'Interfaces in React, Angular and Svelte. I care about the parts users actually feel — ' +
      'load time, clear states, and layouts that do not fall apart on a phone.',
    stack: ['React', 'Angular', 'Svelte', 'TypeScript'],
  },
  {
    title: 'Backend & APIs',
    body:
      'Services in NestJS, FastAPI, Express and Rails. Schema design, validation, auth, and ' +
      'APIs that are predictable enough to build a frontend against.',
    stack: ['NestJS', 'FastAPI', 'Express.js', 'Ruby on Rails'],
  },
  {
    title: 'Data',
    body:
      'PostgreSQL and MongoDB. Modelling the data is usually the hard part of a feature, ' +
      'so I would rather get that right than paper over it later.',
    stack: ['PostgreSQL', 'MongoDB'],
  },
  {
    title: 'Cloud & AI integration',
    body:
      'Deployment on AWS, and wiring AI into real products — AWS Bedrock for generation, ' +
      'Twilio for voice, Deepgram for transcription.',
    stack: ['AWS', 'Bedrock', 'Twilio', 'Deepgram'],
  },
];

export default function Profile({ onNavigate }) {
  const nav = [
    { label: 'About', href: '#about' },
    { label: 'What I do', href: '#work' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ];

  const currentRole = EXPERIENCE[0];

  return (
    <PageShell
      current="profile"
      nav={nav}
      onNavigate={onNavigate}
      contactLead="I answer everything. If you are hiring, tell me what the problem is and I will tell you honestly whether I am the right person for it."
    >
      {/* ── hero ──────────────────────────────────────────────── */}
      <section className="pf-hero" aria-label="Introduction">
        <div className="pf-hero__inner">
          <div className="pf-hero__text">
            <Availability />

            <h1 className="pf-hero__name">{IDENTITY.name}</h1>
            <p className="pf-hero__role">
              {IDENTITY.role}
              {currentRole && (
                <span className="pf-hero__now">
                  {' '}
                  · currently at <strong>{currentRole.company}</strong>
                </span>
              )}
            </p>

            <p className="pf-hero__summary">{IDENTITY.summary}</p>

            <div className="pf-hero__actions">
              <CvActions />
              <a className="page-cta" href={`mailto:${IDENTITY.email}`}>
                <FiMail aria-hidden="true" />
                Email me
              </a>
              <a
                className="page-cta"
                href={IDENTITY.links.find((l) => l.icon === 'linkedin')?.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <FaLinkedin aria-hidden="true" />
                LinkedIn
              </a>
              <a
                className="page-cta"
                href={IDENTITY.links.find((l) => l.icon === 'github')?.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <FaGithub aria-hidden="true" />
                GitHub
              </a>
            </div>

            <p className="pf-hero__hint">
              For the full breakdown — roles, dates and certifications — read the{' '}
              <button type="button" className="page-linkish" onClick={() => onNavigate('cv')}>
                CV
              </button>
            </p>
          </div>

          <div className="pf-hero__photo">
            <img src={process.env.PUBLIC_URL + '/profile-nobg.png'} alt={IDENTITY.name} />
          </div>
        </div>

        <ul className="pf-stats">
          {STATS.map((s) => (
            <li key={s.label}>
              <span className="pf-stats__value">{s.value}</span>
              <span className="pf-stats__label">{s.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── about ─────────────────────────────────────────────── */}
      <section className="page-section" aria-labelledby="about">
        <SectionHead eyebrow="About" title="Astrophysics, then production software" id="about" />
        <div className="page-prose">
          {BIO.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </section>

      {/* ── what I do ─────────────────────────────────────────── */}
      <section className="page-section" aria-labelledby="work">
        <SectionHead eyebrow="What I do" title="The work, end to end" id="work" />

        <div className="pf-focus">
          {WHAT_I_DO.map((area) => (
            <article className="pf-focus__card" key={area.title}>
              <h3 className="pf-focus__title">{area.title}</h3>
              <p className="pf-focus__body">{area.body}</p>
              <ul className="page-tags">
                {area.stack.map((t) => (
                  <li key={t} className="page-tag">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ── selected work ─────────────────────────────────────── */}
      <section className="page-section" aria-labelledby="projects">
        <SectionHead eyebrow="Selected work" title="Things I have built" id="projects" />

        <div className="work-grid">
          {PROJECTS.map((p) => (
            <WorkCard item={p} key={p.name} />
          ))}
        </div>

        <p className="pf-more">
          Roles, dates and responsibilities are on the{' '}
          <button type="button" className="page-linkish" onClick={() => onNavigate('cv')}>
            CV page
          </button>
          .
        </p>
      </section>

      {/* ── skills ────────────────────────────────────────────── */}
      <section className="page-section" aria-labelledby="skills">
        <SectionHead eyebrow="Skills" title="What I build with" id="skills" />
        <SkillBars groups={STACK} />
      </section>

      {/* Nudge toward the CV for anyone who wants the formal version. */}
      <section className="page-section pf-cta-strip" aria-label="Read the CV">
        <div>
          <h2 className="pf-cta-strip__title">Want the formal version?</h2>
          <p className="pf-cta-strip__body">
            Roles with dates, education and certifications — everything a hiring process
            usually asks for.
          </p>
        </div>
        <button type="button" className="page-cta page-cta--primary" onClick={() => onNavigate('cv')}>
          <FiFileText aria-hidden="true" />
          Read the CV
          <FiArrowDown aria-hidden="true" style={{ transform: 'rotate(-90deg)' }} />
        </button>
      </section>
    </PageShell>
  );
}
