import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { COMMAND_NAMES, resolveCommand } from './commands';

const PROMPT_USER = 'faran71';
const PROMPT_PATH = '~/portfolio';

/** ASCII wordmark for the terminal banner. */
const BANNER = [
  '╔═╗╔═╗╦═╗╔═╗╔╗╔  ┌┬┐ ┬',
  '╠╣ ╠═╣╠╦╝╠═╣║║║  │││ │',
  '╚  ╩ ╩╩╚═╩ ╩╝╚╝  ─┴┘ o',
];

/** Lines printed once, before anything the visitor types. */
function introLines() {
  return [
    { kind: 'banner', text: BANNER.join('\n') },
    { kind: 'dim', text: 'Full Stack Developer · London · open to work' },
    {
      kind: 'out',
      text: 'Astrophysics at Cambridge, now building production software end to end.',
    },
    { kind: 'dim', text: '' },
    { kind: 'out', text: 'This terminal is real - type a command and it runs.' },
    { kind: 'dim', text: 'Try `stack` for the full picture, or `help` for everything.' },
    { kind: 'dim', text: '' },
  ];
}

export default function Terminal({
  collapsed,
  onToggle,
  openFile,
  runSignal,
  onRan,
}) {
  const [entries, setEntries] = useState(introLines);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [ghost, setGhost] = useState('');

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const ranSignal = useRef(null);

  // Command objects get stable identity per render pass but read fresh state
  // through this context bag.
  const ctx = useMemo(
    () => ({
      openFile,
      clear: () => setEntries([]),
    }),
    [openFile]
  );

  const push = useCallback((lines) => {
    if (!lines || lines.length === 0) return;
    setEntries((prev) => [...prev, ...lines]);
  }, []);

  const execute = useCallback(
    (raw) => {
      const resolved = resolveCommand(raw);
      if (!resolved) return;

      const { cmd, args, name } = resolved;

      // Echo the command exactly as typed.
      push([{ kind: 'in', text: raw, prompt: true }]);

      if (!cmd) {
        push([
          { kind: 'err', text: `command not found: ${name}` },
          { kind: 'dim', text: 'Type `help` to see what is available.' },
        ]);
        return;
      }

      const output = cmd.run(args, ctx);
      if (output) push(output);
      push([{ kind: 'dim', text: '' }]);
    },
    [ctx, push]
  );

  // The hero has buttons that run commands on the visitor's behalf.
  // Guarded by id so a re-render can never re-run the same request twice.
  useEffect(() => {
    if (!runSignal || ranSignal.current === runSignal.id) return;
    ranSignal.current = runSignal.id;
    setValue('');
    execute(runSignal.command);
    onRan?.(runSignal.id);
  }, [runSignal, execute, onRan]);

  // Keep the newest output in view.
  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [entries, collapsed]);

  const onSubmit = (e) => {
    e.preventDefault();
    const raw = value.trim();
    setValue('');
    setGhost('');
    setHistoryIndex(-1);
    if (!raw) {
      setEntries((prev) => [...prev, { kind: 'in', text: '', prompt: true }]);
      return;
    }
    setHistory((prev) => [...prev.filter((h) => h !== raw), raw]);
    execute(raw);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setValue(history[history.length - 1 - next]);
      setGhost('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setValue('');
        return;
      }
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setValue(history[history.length - 1 - next]);
      setGhost('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const stem = value.trim().toLowerCase();
      if (!stem) return;
      const match = COMMAND_NAMES.find((c) => c.startsWith(stem));
      if (match) {
        setValue(`${match} `);
        setGhost('');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  };

  // Inline autocomplete hint - the greyed-out remainder of the command.
  const onChange = (e) => {
    const next = e.target.value;
    setValue(next);
    const stem = next.trim().toLowerCase();
    if (!stem || next.includes(' ')) {
      setGhost('');
      return;
    }
    const match = COMMAND_NAMES.find((c) => c.startsWith(stem) && c !== stem);
    setGhost(match ? match.slice(stem.length) : '');
  };

  const focusInput = () => inputRef.current?.focus();

  return (
    <section
      className={`terminal${collapsed ? ' is-collapsed' : ''}`}
      aria-label="Interactive terminal"
    >
      <div className="terminal__bar">
        <span className="terminal__tab is-active">Terminal</span>
        <span className="terminal__tab">Output</span>
        <span className="terminal__bar-spacer" />
        <span className="term-hint">↑↓ history · Tab complete</span>
        <button
          type="button"
          className="terminal__toggle"
          onClick={onToggle}
          aria-expanded={!collapsed}
        >
          {collapsed ? '▲ show' : '▼ hide'}
        </button>
      </div>

      {!collapsed && (
        <div
          className="terminal__scroll"
          ref={scrollRef}
          onClick={focusInput}
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
        >
          {entries.map((entry, i) => (
            <div className={`term-line term-line--${entry.kind}`} key={i}>
              {entry.prompt && (
                <span className="term-prompt">
                  <span className="user">{PROMPT_USER}</span>
                  <span className="path"> {PROMPT_PATH}</span> ❯{' '}
                </span>
              )}
              {entry.text}
            </div>
          ))}

          <form className="terminal__input-row" onSubmit={onSubmit}>
            <span className="term-prompt">
              <span className="user">{PROMPT_USER}</span>
              <span className="path"> {PROMPT_PATH}</span> ❯
            </span>
            <span style={{ position: 'relative', flex: 1, display: 'flex' }}>
              <input
                ref={inputRef}
                className="terminal__input"
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                spellCheck="false"
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Terminal command input"
                placeholder="help"
              />
              {ghost && (
                <span
                  className="term-hint"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: `${value.length}ch`,
                    top: 0,
                    pointerEvents: 'none',
                  }}
                >
                  {ghost}
                </span>
              )}
            </span>
          </form>
        </div>
      )}
    </section>
  );
}
