import { useMemo, useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FiMail, FiTerminal, FiArrowDown } from 'react-icons/fi';
import { IDENTITY, STATS } from './content';
import { useTypewriter } from './hooks';

export default function Hero({ onRunCommand }) {
  const [copied, setCopied] = useState(false);

  // The stack line leads on purpose - it is the first thing a visitor reads
  // after the name, and breadth is the differentiator here.
  const phrases = useMemo(
    () => [
      'Full Stack Developer',
      'React · Angular · Svelte  |  NestJS · FastAPI · Rails',
      'TypeScript · JavaScript · Python · Java · C++',
      'Astrophysicist turned production engineer.',
    ],
    []
  );

  const typed = useTypewriter(phrases);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(IDENTITY.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero__glow" />

      <div className="hero__inner">
        <div className="hero__portrait">
          <img src={process.env.PUBLIC_URL + '/profile-nobg.png'} alt={IDENTITY.name} />
        </div>

        <div className="hero__text">
          <div className="hero__prompt">
            <span className="arrow">➜</span> ~ whoami
          </div>

          <h1 className="hero__name">{IDENTITY.shortName || IDENTITY.name}</h1>

          <p className="hero__role">
            {typed}
            <span className="caret" />
          </p>

          <div className="hero__meta">
            <span>{IDENTITY.role}</span>
            <span className="sep">│</span>
            <span>{IDENTITY.location}</span>
            <span className="sep">│</span>
            <span>@{IDENTITY.handle}</span>
          </div>

          <div className="hero__actions">
            <button type="button" className="btn btn--primary" onClick={copyEmail}>
              <FiMail aria-hidden="true" />
              {copied ? 'copied!' : 'email me'}
            </button>

            <a
              className="btn"
              href={IDENTITY.links[0]?.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <FaGithub aria-hidden="true" />
              github
            </a>

            <a
              className="btn"
              href={IDENTITY.links[1]?.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <FaLinkedin aria-hidden="true" />
              linkedin
            </a>

            <button
              type="button"
              className="btn"
              onClick={() => onRunCommand('stack')}
            >
              <FiTerminal aria-hidden="true" />
              run `stack`
            </button>

            <a className="btn" href="#stack">
              <FiArrowDown aria-hidden="true" />
              the stack
            </a>
          </div>
        </div>
      </div>

      <div className="hero__stats">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="stat__value">{s.value}</div>
            <div className="stat__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
