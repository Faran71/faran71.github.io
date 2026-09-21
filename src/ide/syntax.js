/**
 * A small, dependency-free syntax highlighter.
 *
 * Returns arrays of [tokenClass, text] tuples rather than raw HTML, so React
 * renders them as elements. No dangerouslySetInnerHTML, no injection surface.
 *
 * How it works: every pattern is one alternative of a single master regex,
 * wrapped in its own capture group. Whichever group is non-null tells us which
 * pattern matched — we never re-test a token in isolation. That matters for
 * patterns using lookahead (`foo:` for object keys, `foo(` for calls), because
 * a token string alone no longer carries the character that justified the match.
 */

const PATTERNS = [
  // Line and block comments across the languages shown: // # /* */
  ['comment', /\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\//],
  // String literals: '...'  "..."  `...`
  ['string', /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/],
  // JSX / HTML tags
  ['tag', /<\/?[A-Za-z][\w.]*/],
  // Numbers, including decimals
  ['number', /\b\d+(?:\.\d+)?\b/],
  // Decorators and annotations
  ['decorator', /@[A-Za-z_]\w*/],
  // Keywords across every language this site displays
  [
    'keyword',
    /\b(?:import|from|export|default|const|let|var|function|return|type|interface|enum|class|extends|implements|new|async|await|throw|try|catch|finally|if|else|for|while|switch|case|break|continue|public|private|protected|static|readonly|def|end|module|require|package|struct|fn|use|impl|self|True|False|None|null|undefined|true|false|this|super|yield|in|of|as|is|not|and|or|elif|lambda|pass|raise|with|do|then|extern|crate|pub|mut|match|where|loop|select|insert|update|delete|create|table|primary|key|foreign|references)\b/,
  ],
  // Capitalised identifiers read as types: React, List, UUID
  ['type', /\b[A-Z][A-Za-z0-9_]*\b/],
  // Calls: identifier immediately followed by an opening paren
  ['function', /\b[a-z_$][\w$]*(?=\s*\()/],
  // Object keys and serialised properties: identifier followed by a colon
  ['property', /\b[a-z_$][\w$]*(?=\s*:)/],
  // Anything else word-shaped
  ['plain', /[A-Za-z_$][\w$]*/],
  // Operators and punctuation
  ['punct', /[{}()[\];:,.<>=+\-*/%!?&|^~]+/],
  // Whitespace, preserved exactly
  ['space', /\s+/],
];

// One capture group per pattern, so `match[1 + i]` identifies the winner.
const MASTER = new RegExp(
  PATTERNS.map(([, re]) => `(${re.source})`).join('|'),
  'g'
);

/**
 * Tokenise source text.
 * @param {string} code
 * @returns {Array<[string, string]>} [tokenClass, text] pairs
 */
export function tokenize(code) {
  const out = [];
  let last = 0;
  MASTER.lastIndex = 0;

  let match;
  while ((match = MASTER.exec(code)) !== null) {
    const text = match[0];

    // A zero-length match would spin forever; skip past it.
    if (text.length === 0) {
      MASTER.lastIndex += 1;
      continue;
    }

    if (match.index > last) {
      out.push(['plain', code.slice(last, match.index)]);
    }

    let cls = 'plain';
    for (let i = 0; i < PATTERNS.length; i += 1) {
      if (match[1 + i] !== undefined) {
        cls = PATTERNS[i][0];
        break;
      }
    }

    out.push([cls, text]);
    last = match.index + text.length;
  }

  if (last < code.length) out.push(['plain', code.slice(last)]);
  return out;
}

/**
 * Split source into per-line token arrays.
 * @param {string} code
 * @returns {Array<Array<[string, string]>>}
 */
export function tokenizeLines(code) {
  return code.split('\n').map((line) => tokenize(line));
}
