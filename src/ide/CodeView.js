import { useMemo } from 'react';
import { tokenizeLines } from './syntax';

/**
 * Renders source with line numbers and syntax colouring.
 *
 * `litThrough` lets sibling components spotlight a line range - used by the
 * command palette when you jump to a file.
 */
export default function CodeView({ code, litThrough = -1 }) {
  const lines = useMemo(() => tokenizeLines(code), [code]);

  return (
    <div className="code">
      <div className="code__gutter" aria-hidden="true">
        {lines.map((_, i) => (
          <span key={i} className={i <= litThrough ? 'is-lit' : undefined}>
            {i + 1}
          </span>
        ))}
      </div>

      {/* Owns the horizontal scroll so long lines are reachable, not clipped. */}
      <div className="code__scroll">
        <pre className="code__pre" tabIndex={0}>
          <code>
            {lines.map((tokens, i) => (
              <span className="code__line" key={i}>
                {tokens.map(([cls, text], j) => (
                  <span key={j} className={`tok tok--${cls}`}>
                    {text}
                  </span>
                ))}
                {'\n'}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
