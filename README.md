# faran71.github.io

Personal portfolio for **Muhammad Faran Sarwar** — Full Stack Developer.

The site is built as a fake code editor: a file tree, tabs, a syntax-highlighted
source pane, and a genuinely working terminal. The point is that the medium is
the claim — instead of *saying* "I write software", the page *is* software you
can type into.

Live at [faran71.github.io](https://faran71.github.io).

## Running it

```bash
npm install
npm start          # dev server on http://localhost:3000
npm test           # jest + testing-library, 6 tests
npm run build      # production bundle into build/
```

Deployment is via `gh-pages`:

```bash
npm run deploy     # builds, then pushes build/ to the gh-pages branch
```

## Editing the content

**Everything you would want to change lives in one file:**
[`src/ide/content.js`](src/ide/content.js).

| Export | What it drives |
| --- | --- |
| `IDENTITY` | Name, role, location, email, GitHub/LinkedIn links |
| `STACK` | The stack grid — grouped, with per-technology proficiency |
| `FILES` | The editor tabs. Each `code` string is the literal text displayed |
| `STATS` | The four numbers under the hero |

The `code` strings are real source text, not templates — they are tokenised and
highlighted at runtime, so you can edit them like any other code and the colours
follow automatically.

To add a technology, add an entry to `STACK` and make sure its `icon` key exists
in [`src/ide/skills.js`](src/ide/skills.js).

## How it is put together

```
src/
  index.js              entry point
  App.js                renders <Ide />
  index.css             base reset
  App.css               (kept, intentionally near-empty)
  ide/
    Ide.js              shell: titlebar, activity bar, file tree, tabs, status bar
    Hero.js             name, typewriter, CTAs, stats
    Stack.js            the stack grid with animated proficiency bars
    CodeView.js         renders highlighted source with a line-number gutter
    Terminal.js         the interactive terminal
    CommandPalette.js   ⌘K palette (files, commands, technologies)
    syntax.js           dependency-free tokeniser
    commands.js         terminal command definitions
    content.js          ← all content lives here
    skills.js           brand icon registry + colour handling
    hooks.js            useTypewriter, useInView, useMediaQuery
    ide.css             the theme
```

### Notable details

- **No syntax-highlighting dependency.** `syntax.js` compiles the language rules
  into one master regex with a capture group per token type, then reads off which
  group matched. That matters for rules that rely on lookahead — `key:` for
  object properties, `call(` for functions — because re-testing a token in
  isolation loses the character that justified the match. It also returns
  `[class, text]` tuples rather than HTML, so there is no
  `dangerouslySetInnerHTML` anywhere.

- **The terminal is real.** `commands.js` defines the command set; the terminal
  echoes input, keeps history (`↑`/`↓`), autocompletes on `Tab`, and `Ctrl+L`
  clears. Commands like `open <file>` and `projects` drive the editor panes.

- **Proficiency bars fail open.** `useInView` starts visible and only flips to
  hidden if the element is genuinely below the fold, so the bars and their
  numbers always agree even if `IntersectionObserver` never fires.

- **Brand icons stay legible.** `dimColor()` blends a brand hue toward the card
  background, then raises HSL *lightness* (holding hue and saturation) until it
  clears a luminance floor. Straight blending turned Angular red and Rails red
  into indistinguishable grey, and lifting toward white desaturated them into
  pastel mush.

## Accessibility

- The terminal exposes `role="log"` with `aria-live="polite"`, so output is
  announced; its input is labelled and keyboard-navigable.
- `prefers-reduced-motion` disables the typewriter and all animation.
- Visible focus rings, and a `<noscript>` block carrying the full content for
  anyone without JavaScript.

## Testing

`src/App.test.js` covers the things most likely to break silently: the hero
renders the name, all twenty technologies appear, the terminal executes a real
command and prints output, unknown commands fail loudly, `stack` prints its bar
chart, and `open` actually switches the active tab.

`src/setupTests.js` stubs `matchMedia` and `IntersectionObserver`, which jsdom
does not implement.
