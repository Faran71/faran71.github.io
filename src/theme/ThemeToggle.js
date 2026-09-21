import { useCallback, useEffect, useState } from 'react';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import './theme.css';

/**
 * Theme preference: `system` | `light` | `dark`.
 *
 * `system` follows the browser/OS setting live, `light`/`dark` pin it. The
 * choice is written to <html data-theme> and persisted; `system` is stored as
 * the absence of an attribute so the CSS media query can take over.
 *
 * localStorage is right here — unlike the view switcher, a remembered theme is
 * a preference the visitor chose, not a side effect of which page they clicked.
 */

const STORAGE_KEY = 'theme';
const VALID = ['system', 'light', 'dark'];

export function readStoredTheme() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (VALID.includes(saved)) return saved;
  } catch {
    /* storage can be blocked */
  }
  return 'system';
}

/** Applies the preference to <html>. Exported so tests can assert on it. */
export function applyTheme(pref) {
  const root = document.documentElement;
  if (pref === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', pref);
  }
}

/** Resolves the preference to the theme actually showing right now. */
export function resolvedTheme(pref) {
  if (pref !== 'system') return pref;
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function useTheme() {
  const [pref, setPref] = useState(readStoredTheme);
  // Tracks the OS preference so the toggle's highlight is correct in `system`.
  const [systemTheme, setSystemTheme] = useState(() =>
    resolvedTheme('system')
  );

  useEffect(() => {
    applyTheme(pref);
    try {
      window.localStorage.setItem(STORAGE_KEY, pref);
    } catch {
      /* ignore */
    }
  }, [pref]);

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e) => setSystemTheme(e.matches ? 'light' : 'dark');
    setSystemTheme(mql.matches ? 'light' : 'dark');
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const set = useCallback((next) => {
    if (VALID.includes(next)) setPref(next);
  }, []);

  return {
    pref,
    set,
    systemTheme,
    resolved: pref === 'system' ? systemTheme : pref,
  };
}

const OPTIONS = [
  { value: 'system', label: 'System theme', Icon: FiMonitor },
  { value: 'light', label: 'Light theme', Icon: FiSun },
  { value: 'dark', label: 'Dark theme', Icon: FiMoon },
];

export default function ThemeToggle({ pref, onChange, systemTheme, className = '' }) {
  return (
    <div
      className={`theme-toggle ${className}`.trim()}
      role="group"
      aria-label="Colour theme"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = pref === value;
        return (
          <button
            key={value}
            type="button"
            className="theme-toggle__btn"
            aria-pressed={active}
            title={
              value === 'system' && systemTheme
                ? `${label} (currently ${systemTheme})`
                : label
            }
            onClick={() => onChange(value)}
          >
            <Icon aria-hidden="true" />
            <span className="theme-toggle__label">
              {label}
              {value === 'system' && systemTheme ? `, currently ${systemTheme}` : ''}
            </span>
          </button>
        );
      })}
    </div>
  );
}
