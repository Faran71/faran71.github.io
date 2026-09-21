# faran71.github.io

Personal site for **Muhammad Faran Sarwar** - Full Stack Developer.

Live at [faran71.github.io](https://faran71.github.io).

## Three views of the same person

The site has three front doors, because it has three jobs to do:

| View | Hash | Default? | For |
| --- | --- | --- | --- |
| **Profile** | `#profile` | ✅ yes | The main landing page. Personal and scannable - who you are, what you build, selected work, skills, contact. |
| **CV** | `#cv` | no | The formal hiring document. Roles with dates, education, certifications. |
| **Code** | `#ide` | no | The site rendered as a code editor, with a working terminal. For engineers. |

The split is deliberate:

- **The Profile page carries no education or dates.** It is the friendly front
  door for anyone arriving cold - a recruiter skimming, another engineer
  following a link, someone who found you through a message. It answers "what
  does this person do and can they do it well?"
- **The CV page is the one you send into a hiring process.** It has exactly the
  sections an application asks for: professional experience with dates,
  education, certifications.
- **The Code view is a flex.** It proves the claim rather than stating it, but
  nobody is forced through it.

Both reading views are one click apart: the header switches between Profile and
CV, and the "View as VS Code" button opens the editor. The editor has a
**"Back to profile"** button, so it is never a one-way trip.

### Navigation and deep links

Resolution order on load, then:

1. **An explicit hash wins.** `…/#cv` opens the CV, `…/#ide` opens the editor.
   Shared links therefore always open what they say.
2. **Otherwise you get Profile.** Always. A plain visit to the domain - no hash,
   any browser, any history - lands on the Profile page.

The current view is written into the URL hash as you navigate, so every view
stays linkable and the browser Back button works.

It is deliberately **not** persisted to `localStorage`. An earlier version
remembered your last view, which made the home page depend on browsing history:
once someone opened the CV, every later visit to the bare domain served them the
CV instead of the Profile. That is a regression test now.


## Colour and themes

Four palette colours drive everything:

| Token name | Hex | Role |
| --- | --- | --- |
| sand | `#bbab9b` | Warm neutral - body text on dark |
| brown | `#8b6f47` | Mid brown - panels, borders, link text on light |
| gold | `#d4ac6e` | Highlight - accents, primary button fill |
| dark | `#4f3222` | Deep brown - borders, dark surfaces, text on light |

Everything else is a tonal variation of those four. There are **two themes**,
and all colour lives in one file: [`src/theme/theme.css`](src/theme/theme.css).

### How the theme is picked

1. An explicit choice - `:root[data-theme="light" | "dark"]`, set on `<html>`
2. Otherwise the **browser / OS preference**, via `@media (prefers-color-scheme)`
   - scoped to `:root:not([data-theme])` so it can never override (1)
3. Otherwise dark

The toggle sits in the header of every view and has three options: **System**
(the default), **Light** and **Dark**. `System` stores the preference as the
*absence* of an attribute, so the media query keeps following the OS live.

A tiny inline script in `public/index.html` applies a saved `light`/`dark`
choice during `<head>` parsing, before anything paints - so pinning a theme
never flashes the other one.

### Two rules that keep the palette honest

- **Gold is a fill, not text.** It reads at 1.97:1 on the light background.
  So `--accent` is the *text/link* colour (brown on light, gold on dark) and
  `--accent-strong` is the *filled-button* background (gold on both, always
  paired with `--accent-ink`). Every theme token pair in the file was checked
  for WCAG AA; the worst case is 4.71:1.
- **Never hardcode a colour in a component.** That is how a theme breaks. Use
  `--tint` / `--tint-weak` / `--tint-line` for translucent accent washes, and
  `--grid`, `--scrim`, `--header-bg`, `--shadow` for page furniture.

Adding a theme means adding one token block; no component changes.

## Running it

```bash
npm install
npm start          # dev server on http://localhost:3000
npm test           # jest + testing-library, 13 tests
npm run build      # production bundle into build/
```

Deployment is via `gh-pages`:

```bash
npm run deploy     # builds, then pushes build/ to the gh-pages branch
```

## Editing the content

### The downloadable CV

`public/Faran_Sarwar_CV.pdf` is the file recruiters download. It is a static
asset, so replacing it is just a matter of overwriting that file - the buttons
pick it up with no code change.

Both the Profile and CV pages offer it two ways, via `CvActions` in
`src/shared/Page.js`:

- **Download CV** - `download="Muhammad-Faran-Sarwar-CV.pdf"`, so it lands in the
  downloads folder with a sensible name rather than `Faran_Sarwar_CV.pdf`
- **View PDF** - opens in a new tab for anyone who would rather read it first

To point at a different filename, change `CV_FILE` at the top of
`src/shared/Page.js`.

> If the PDF changes, keep `src/ide/content.js` and `src/ide/profile.js` in step
> with it. The PDF and the site currently agree: both list Jaid and Firewood,
> Resonate / Lumina / FAST, Cambridge, and the two certifications. Both also
> omit the phone number.

### Content files

Content is split by shape, not by page:

| File | Holds |
| --- | --- |
| [`src/ide/content.js`](src/ide/content.js) | Contact details, the stack, the hero stats, the "about" prose, skill bands, certifications, and the `code` strings the Code view renders as editor tabs |
| [`src/ide/profile.js`](src/ide/profile.js) | Experience, projects and education as plain structured data |

| Export | Used by |
| --- | --- |
| `IDENTITY` | All three views - name, role, location, email, links |
| `BIO` | Profile and CV "about" sections |
| `STACK` | The proficiency bars on Profile, CV and the Code view |
| `SKILL_BANDS` | The "Proficient" / "Intermediate" lists on the CV |
| `CERTIFICATIONS` | The CV only |
| `STATS` | The four numbers in the hero on Profile and CV |
| `FILES` | The Code view's editor tabs. Each `code` string is the literal text shown |
| `profile.js` exports | Experience, projects and education across Profile and CV |

> **Note on duplication.** The Code view's `code` strings are hand-written to
> look like real source, so they are not generated from the structured data.
> That is a deliberate trade - it keeps the code view authentic. Keep the two
> roughly in step when you change a fact.

To add a technology, add an entry to `STACK` and make sure its `icon` key exists
in [`src/ide/skills.js`](src/ide/skills.js).

## How it is put together

```
src/
  index.js              entry point
  App.js                view switcher: profile | cv | ide
  index.css             base reset
  App.css               (kept, intentionally near-empty)
  theme/
    theme.css           ALL colour: both token sets + the toggle styles
    ThemeToggle.js      useTheme + the System / Light / Dark control
  shared/
    Page.js             PageShell, PageHeader, PageFooter, SectionHead,
                        Availability, CvActions, SkillBars, WorkCard,
                        ContactSection
    page.css            everything the two reading views share
  pages/
    Profile.js          the main landing page
    profile.css         profile-only styles
    Cv.js               the formal CV
    cv.css              cv-only styles
  ide/
    Ide.js              editor shell: titlebar, tree, tabs, status bar
    Hero.js             name, typewriter, stats
    Stack.js            stack grid with animated proficiency bars
    CodeView.js         highlighted source with a line-number gutter
    Terminal.js         the interactive terminal
    CommandPalette.js   ⌘K palette
    syntax.js           dependency-free tokeniser
    commands.js         terminal command definitions
    content.js          ← content + Code-view source strings
    profile.js          ← structured experience / projects / education
    skills.js           brand icon registry + colour handling
    hooks.js            useTypewriter, useInView, useMediaQuery
    ide.css             the editor theme
```

All three views sit on the same CSS custom properties (`src/theme/theme.css`),
so they share a palette and both themes without sharing a layout. Profile and CV are built from the same shared
components in `src/shared/Page.js` - that is why changing, say, the contact
cards updates both at once.

### Notable details

- **No syntax-highlighting dependency.** `syntax.js` compiles the language rules
  into one master regex with a capture group per token type, then reads off which
  group matched. That matters for rules that rely on lookahead - `key:` for
  object properties, `call(` for functions - because re-testing a token in
  isolation loses the character that justified the match. It also returns
  `[class, text]` tuples rather than HTML, so there is no
  `dangerouslySetInnerHTML` anywhere.

- **The terminal is real.** `commands.js` defines the command set; the terminal
  echoes input, keeps history (`↑`/`↓`), autocompletes on `Tab`, and `Ctrl+L`
  clears. Commands like `open <file>` and `projects` drive the editor panes.

- **Proficiency bars fail open.** `useInView` starts visible and only flips to
  hidden if the element is genuinely below the fold, so the bars and their
  numbers always agree even if `IntersectionObserver` never fires. (This was a
  real bug: they previously rendered at zero width, so `level: 92` had no visual
  representation at all.)

- **Brand icons stay legible.** `dimColor()` blends a brand hue toward the card
  background, then raises HSL *lightness* (holding hue and saturation) until it
  clears a luminance floor. Straight blending turned Angular red and Rails red
  into indistinguishable grey, and lifting toward white desaturated them into
  pastel mush.

## Accessibility

- The terminal exposes `role="log"` with `aria-live="polite"`, so output is
  announced; its input is labelled and keyboard-navigable.
- Sections on the Profile and CV pages are labelled regions, so screen-reader
  users can jump between them.
- `prefers-reduced-motion` disables the typewriter and all animation.
- Visible focus rings throughout.
- A `<noscript>` block carries the full content as plain HTML, including contact
  details, for anyone without JavaScript.

## Privacy note

The **phone number is deliberately not on the site.** It was added once and
removed; if you want it back, add it to `IDENTITY` in `src/ide/content.js` and
render it in `src/shared/Page.js`.

## Testing

`src/App.test.js` (22 tests) covers what breaks silently:

- **A plain visit always lands on Profile**, even with stale view state in
  `localStorage` - the regression guard
- The app never writes the current view to `localStorage`
- An explicit `#cv` / `#ide` hash still wins over the default
- Opens on **Profile**, not CV or the IDE
- **Profile has no education or certifications** - asserted on the
  education-specific strings, since Cambridge is legitimately named in the bio
- Contact details are present on both reading views, and **no phone number**
  appears anywhere
- The CV is downloadable from both reading views, with the right `href` and a
  generated `download` filename
- Moving Profile → CV → Profile, and Profile → IDE → Profile
- Deep links (`#cv`, `#ide`) open what they say
- The Code view lists all twenty technologies
- The terminal executes a real command and prints output; unknown commands fail
  loudly; `open` switches the active tab
- The theme toggle offers system/light/dark, sets `data-theme` correctly,
  removes it for `system`, and persists the choice
- The theme toggle is reachable in all three views

`src/setupTests.js` stubs `matchMedia` and `IntersectionObserver`, which jsdom
does not implement.
