import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './ide.css';

import { FILES, IDENTITY } from './content';
import { getSkillIcon } from './skills';
import { COMMAND_NAMES } from './commands';
import CodeView from './CodeView';
import Hero from './Hero';
import Stack from './Stack';
import Terminal from './Terminal';
import CommandPalette from './CommandPalette';
import { useMediaQuery } from './hooks';
import ThemeToggle from '../theme/ThemeToggle';

import { VscFiles, VscSearch, VscSourceControl, VscSettingsGear } from 'react-icons/vsc';
import { FiTerminal, FiCommand, FiCode, FiArrowLeft } from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

export default function Ide({ onShowProfile, theme }) {
  const [activeId, setActiveId] = useState('profile');
  const [openTabs, setOpenTabs] = useState(['profile']);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const isNarrow = useMediaQuery('(max-width: 620px)');
  const [termCollapsed, setTermCollapsed] = useState(false);

  // A request handed to the terminal: { id, command }. The id makes repeats safe.
  const [runSignal, setRunSignal] = useState(null);
  const signalId = useRef(0);

  const activeFile = useMemo(
    () => FILES.find((f) => f.id === activeId) || FILES[0],
    [activeId]
  );

  // Narrow screens get more editor room; the terminal starts tucked away.
  // Only applied on a width *change* so a landscape phone rotated to desktop
  // width does not force the terminal closed.
  const wasNarrow = useRef(isNarrow);
  useEffect(() => {
    if (isNarrow !== wasNarrow.current) {
      wasNarrow.current = isNarrow;
      setTermCollapsed(isNarrow);
    }
  }, [isNarrow]);

  const openFile = useCallback((id) => {
    setActiveId(id);
    setOpenTabs((tabs) => (tabs.includes(id) ? tabs : [...tabs, id]));
  }, []);

  const runCommand = useCallback((command) => {
    signalId.current += 1;
    setTermCollapsed(false);
    setRunSignal({ id: signalId.current, command });
  }, []);

  const jumpToSkill = useCallback(
    (name) => {
      runCommand(`skills ${name}`);
      // Wait for the terminal to expand before measuring scroll targets.
      setTimeout(() => {
        document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 260);
    },
    [runCommand]
  );

  // Global shortcuts.
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (mod && e.key === '`') {
        e.preventDefault();
        setTermCollapsed((v) => !v);
      } else if (e.key === 'Escape') {
        setPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const lineCount = useMemo(() => activeFile.code.split('\n').length, [activeFile]);

  return (
    <div className="ide">
      {/* ── titlebar ─────────────────────────────────────────── */}
      <header className="titlebar">
        <span className="dots" aria-hidden="true">
          <span className="dot dot--r" />
          <span className="dot dot--y" />
          <span className="dot dot--g" />
        </span>

        <span className="titlebar__title">
          {IDENTITY.handle} — portfolio — {activeFile.name}
        </span>

        <span className="titlebar__spacer" />

        <span className="titlebar__right">
          {theme && (
            <ThemeToggle
              pref={theme.pref}
              onChange={theme.set}
              systemTheme={theme.systemTheme}
            />
          )}

          {onShowProfile && (
            <button
              type="button"
              className="kbd-btn kbd-btn--back"
              onClick={onShowProfile}
              title="Back to the standard profile page"
            >
              <FiArrowLeft aria-hidden="true" />
              Back to profile
            </button>
          )}

          <a
            className="icon-link"
            href={IDENTITY.links[0]?.url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            className="icon-link"
            href={IDENTITY.links[1]?.url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a className="icon-link" href={`mailto:${IDENTITY.email}`} aria-label="Email">
            <SiGmail />
          </a>

          <button
            type="button"
            className="kbd-btn"
            onClick={() => setPaletteOpen(true)}
            aria-label="Open command palette"
          >
            <FiCommand aria-hidden="true" />
            <kbd>K</kbd>
          </button>
        </span>
      </header>

      <div className="body">
        {/* ── activity bar ───────────────────────────────────── */}
        <nav className="activity" aria-label="Sections">
          <button
            type="button"
            className="activity__btn is-active"
            title="Explorer"
            aria-label="Explorer"
          >
            <VscFiles />
          </button>
          <button
            type="button"
            className="activity__btn"
            title="Search (⌘K)"
            aria-label="Search"
            onClick={() => setPaletteOpen(true)}
          >
            <VscSearch />
          </button>
          <a
            className="activity__btn"
            href={IDENTITY.links[0]?.url}
            target="_blank"
            rel="noreferrer noopener"
            title="GitHub"
            aria-label="GitHub"
          >
            <VscSourceControl />
          </a>
          <span style={{ flex: 1 }} />
          <button
            type="button"
            className="activity__btn"
            title="Terminal (⌘`)"
            aria-label="Toggle terminal"
            onClick={() => setTermCollapsed((v) => !v)}
          >
            <FiTerminal />
          </button>
          <button
            type="button"
            className="activity__btn"
            title="Settings"
            aria-label="Settings"
            onClick={() => setPaletteOpen(true)}
          >
            <VscSettingsGear />
          </button>
        </nav>

        {/* ── file tree ──────────────────────────────────────── */}
        <aside className="sidebar" aria-label="Files">
          <div className="sidebar__head">Explorer</div>
          <div className="tree__branch">▾ src/</div>
          <div className="tree">
            {FILES.map((file) => {
              const Icon = getSkillIcon(file.icon);
              return (
                <button
                  type="button"
                  key={file.id}
                  className={`tree__item${file.id === activeId ? ' is-active' : ''}`}
                  onClick={() => openFile(file.id)}
                >
                  <Icon className="tree__icon" aria-hidden="true" />
                  {file.name}
                </button>
              );
            })}
          </div>

          <div className="sidebar__head" style={{ marginTop: 18 }}>
            Shell
          </div>
          <div className="tree">
            {COMMAND_NAMES.slice(0, 6).map((name) => (
              <button
                type="button"
                key={name}
                className="tree__item"
                onClick={() => runCommand(name)}
              >
                <span className="tree__icon" style={{ fontFamily: 'var(--mono)' }}>
                  ❯
                </span>
                {name}
              </button>
            ))}
          </div>
        </aside>

        {/* ── editor column ──────────────────────────────────── */}
        <div className="main">
          <div className="tabs" role="tablist" aria-label="Open files">
            {openTabs.map((id) => {
              const file = FILES.find((f) => f.id === id);
              if (!file) return null;
              const Icon = getSkillIcon(file.icon);
              return (
                <button
                  type="button"
                  role="tab"
                  aria-selected={id === activeId}
                  key={id}
                  className={`tab${id === activeId ? ' is-active' : ''}`}
                  onClick={() => setActiveId(id)}
                >
                  <Icon className="tab__icon" aria-hidden="true" />
                  {file.name}
                </button>
              );
            })}
          </div>

          <div className="breadcrumb">
            <span>src</span>
            <span className="breadcrumb__sep">›</span>
            <span>portfolio</span>
            <span className="breadcrumb__sep">›</span>
            <span style={{ color: 'var(--text)' }}>{activeFile.name}</span>
          </div>

          <div className="editor">
            <Hero onRunCommand={runCommand} />

            <CodeView code={activeFile.code} />

            <Stack />

            <div className="section__sub" style={{ padding: '0 22px 40px' }}>
              <span className="section__num">02</span> — Projects, experience and contact live in
              the file tree. Press <kbd className="term-hint">⌘K</kbd> to jump anywhere, or run{' '}
              <button
                type="button"
                className="btn"
                style={{ padding: '5px 10px', fontSize: 11 }}
                onClick={() => runCommand('contact')}
              >
                <FiTerminal aria-hidden="true" /> contact
              </button>
            </div>
          </div>

          <Terminal
            collapsed={termCollapsed}
            onToggle={() => setTermCollapsed((v) => !v)}
            openFile={openFile}
            runSignal={runSignal}
            onRan={() => setRunSignal(null)}
          />
        </div>
      </div>

      {/* ── status bar ───────────────────────────────────────── */}
      <footer className="statusbar">
        <span className="statusbar__live">
          <span className="statusbar__pulse" />
          open to work
        </span>
        <span>{IDENTITY.location}</span>
        <span className="statusbar__spacer" />
        <span>
          <FiCode style={{ verticalAlign: -1, marginRight: 4 }} />
          {activeFile.name}
        </span>
        <span>{lineCount} lines</span>
        <span>UTF-8</span>
        <span>Ln 1, Col 1</span>
      </footer>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelectFile={openFile}
        onRunCommand={runCommand}
        onJumpToSkill={jumpToSkill}
        onToggleTerminal={() => setTermCollapsed((v) => !v)}
      />
    </div>
  );
}
