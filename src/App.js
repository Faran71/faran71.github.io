import { useCallback, useEffect, useState } from 'react';
import './App.css';

import Profile from './pages/Profile';
import Cv from './pages/Cv';
import Ide from './ide/Ide';
import { useTheme } from './theme/ThemeToggle';

/**
 * Three views of the same person.
 *
 *  - `profile` — the main landing page, and ALWAYS what you get on a plain
 *    visit to the domain. Personal and scannable, for anyone arriving cold:
 *    recruiters, other engineers, a link from a message. Deliberately has no
 *    education or dates — the CV carries those.
 *  - `cv` — the formal CV for a hiring process: roles with dates, education,
 *    certifications.
 *  - `ide` — the site rendered as a code editor, for engineers.
 *
 * Resolution order on load:
 *   1. an explicit `#hash` (so `…/#cv` always opens the CV — shared links work)
 *   2. otherwise the Profile page
 *
 * The last view is deliberately NOT remembered in localStorage. Doing that made
 * the home page depend on browsing history: once someone opened the CV, every
 * later visit to the bare domain served them the CV instead of the Profile.
 * The hash still updates as you navigate, so any view stays linkable and the
 * Back button still works.
 */

const VALID = ['profile', 'cv', 'ide'];
const DEFAULT_MODE = 'profile';

function readHash() {
  const raw = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  return VALID.includes(raw) ? raw : null;
}

function initialMode() {
  return readHash() || DEFAULT_MODE;
}

export default function App() {
  const [mode, setMode] = useState(initialMode);
  // Theme is owned here and passed down, so the toggle stays in sync across views.
  const theme = useTheme();

  // Keep the hash in step with the current view so it stays shareable.
  useEffect(() => {
    if (readHash() !== mode) {
      window.location.hash = `#${mode}`;
    }
  }, [mode]);

  // Support hand-edited hashes and the browser Back button.
  useEffect(() => {
    const onHashChange = () => {
      const next = readHash();
      if (next) setMode(next);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((next) => {
    if (VALID.includes(next)) setMode(next);
  }, []);

  if (mode === 'ide') return <Ide onShowProfile={() => navigate('profile')} theme={theme} />;
  if (mode === 'cv') return <Cv onNavigate={navigate} theme={theme} />;
  return <Profile onNavigate={navigate} theme={theme} />;
}
