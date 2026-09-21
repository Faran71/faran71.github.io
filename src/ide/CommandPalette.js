import { useEffect, useMemo, useRef, useState } from 'react';
import { FILES, STACK } from './content';
import { COMMAND_NAMES } from './commands';
import { getSkillIcon } from './skills';

/**
 * ⌘K palette. Fuzzy-ish prefix matching over three kinds of action:
 * open a file, run a terminal command, or jump to a technology.
 */
export default function CommandPalette({
  open,
  onClose,
  onSelectFile,
  onRunCommand,
  onJumpToSkill,
  onToggleTerminal,
}) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);

  const items = useMemo(() => {
    const list = [];

    FILES.forEach((f) => {
      list.push({
        kind: 'file',
        label: f.name,
        hint: 'open in editor',
        action: () => onSelectFile(f.id),
      });
    });

    COMMAND_NAMES.forEach((name) => {
      list.push({
        kind: 'cmd',
        label: name,
        hint: 'run in terminal',
        action: () => onRunCommand(name),
      });
    });

    STACK.forEach((group) => {
      group.items.forEach((item) => {
        list.push({
          kind: 'tech',
          label: item.name,
          hint: `${group.group} · ${item.level}%`,
          icon: item.icon,
          action: () => onJumpToSkill(item.name),
        });
      });
    });

    list.push({
      kind: 'view',
      label: 'toggle terminal',
      hint: 'show / hide',
      action: () => onToggleTerminal(),
    });

    return list;
  }, [onSelectFile, onRunCommand, onJumpToSkill, onToggleTerminal]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 40);
    return items
      .filter((i) => i.label.toLowerCase().includes(q))
      .sort((a, b) => {
        // Prefix matches first, then shorter labels.
        const ap = a.label.toLowerCase().startsWith(q) ? 0 : 1;
        const bp = b.label.toLowerCase().startsWith(q) ? 0 : 1;
        return ap - bp || a.label.length - b.label.length;
      })
      .slice(0, 40);
  }, [items, query]);

  // Reset each time the palette opens.
  useEffect(() => {
    if (open) {
      setQuery('');
      setCursor(0);
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  const run = (item) => {
    if (!item) return;
    onClose();
    item.action();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[cursor]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="palette__scrim" onMouseDown={onClose} role="presentation">
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="palette__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search files, commands, technologies…"
          spellCheck="false"
          autoComplete="off"
          aria-label="Search"
        />

        <div className="palette__list" role="listbox">
          {results.length === 0 && (
            <div className="palette__empty">no matches for “{query}”</div>
          )}

          {results.map((item, i) => {
            const Icon = item.icon ? getSkillIcon(item.icon) : null;
            return (
              <button
                type="button"
                role="option"
                aria-selected={i === cursor}
                className={`palette__item${i === cursor ? ' is-sel' : ''}`}
                key={`${item.kind}-${item.label}-${i}`}
                onMouseEnter={() => setCursor(i)}
                onClick={() => run(item)}
              >
                <span className="palette__kind">{item.kind}</span>
                {Icon && (
                  <span style={{ display: 'grid', placeItems: 'center', fontSize: 14 }}>
                    <Icon aria-hidden="true" />
                  </span>
                )}
                <span className="palette__label">{item.label}</span>
                <span className="palette__hint">{item.hint}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
