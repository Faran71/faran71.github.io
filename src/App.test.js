import { render, screen, within, fireEvent } from '@testing-library/react';
import App from './App';

/** App opens on the Profile page; these move between the three views. */
const goTo = (name) =>
  fireEvent.click(screen.getAllByRole('button', { name: new RegExp(`^${name}$`, 'i') })[0]);

const goToIde = () =>
  fireEvent.click(screen.getAllByRole('button', { name: /view as vs code/i })[0]);

beforeEach(() => {
  window.location.hash = '';
  window.localStorage.clear();
  // Tests must not inherit a theme attribute from a previous case.
  document.documentElement.removeAttribute('data-theme');
});

/* ==========================================================================
   The home page is always the Profile
   ========================================================================== */

test('a plain visit always lands on Profile, regardless of browsing history', () => {
  // Regression: the last view used to be persisted, so once someone opened the
  // CV, every later visit to the bare domain served them the CV.
  window.localStorage.setItem('view', 'cv');
  window.localStorage.setItem('view', 'ide');

  render(<App />);

  expect(
    screen.getByRole('heading', { level: 1, name: /muhammad faran sarwar/i })
  ).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /academic background/i })).not.toBeInTheDocument();
  expect(screen.queryByLabelText(/terminal command input/i)).not.toBeInTheDocument();
});

test('App does not persist the current view to localStorage', () => {
  render(<App />);

  goTo('CV');
  expect(screen.getByRole('heading', { name: /academic background/i })).toBeInTheDocument();

  // Nothing should have been written under any key the app controls.
  expect(window.localStorage.getItem('view')).toBeNull();
});

test('an explicit hash still wins over the default', () => {
  window.location.hash = '#cv';
  render(<App />);
  expect(screen.getByRole('heading', { name: /academic background/i })).toBeInTheDocument();
});

/* ==========================================================================
   Profile — the main page
   ========================================================================== */

test('opens on the Profile page, not the CV or the IDE', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { level: 1, name: /muhammad faran sarwar/i })
  ).toBeInTheDocument();
  // The terminal only exists in the IDE view.
  expect(screen.queryByLabelText(/terminal command input/i)).not.toBeInTheDocument();
  // And the CV-only section is not here.
  expect(screen.queryByRole('heading', { name: /academic background/i })).not.toBeInTheDocument();
});

test('Profile page has no education or certifications', () => {
  render(<App />);

  expect(screen.queryByRole('heading', { name: /academic background/i })).not.toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: /professional certifications/i })
  ).not.toBeInTheDocument();
  // No nav link to education either.
  expect(screen.queryByRole('link', { name: /education/i })).not.toBeInTheDocument();

  // And no CV-only content anywhere. Cambridge is legitimately named in the
  // About prose, so assert on the education-specific strings instead.
  expect(screen.queryByText(/A Levels/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/TOGAF/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/AWS Certified Cloud Practitioner/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/MSci \/ BA Astrophysics/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Upper Second-Class/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Newham Collegiate/i)).not.toBeInTheDocument();
});

test('Profile page still carries the things that matter', () => {
  render(<App />);

  expect(screen.getAllByText(/muhammadfaran01\.mfs@gmail\.com/i).length).toBeGreaterThan(0);
  expect(screen.getAllByRole('link', { name: /linkedin/i }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole('link', { name: /github/i }).length).toBeGreaterThan(0);

  // No phone number anywhere.
  expect(screen.queryByText(/\+44\s?750/)).not.toBeInTheDocument();

  ['About', 'What I do', 'Projects', 'Skills', 'Contact'].forEach((label) => {
    expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
  });
});

/* ==========================================================================
   CV download
   ========================================================================== */

test('Profile page offers the CV as a download and a preview', () => {
  render(<App />);

  const download = screen.getByRole('link', { name: /download cv/i });
  expect(download).toHaveAttribute('href', expect.stringContaining('/Faran_Sarwar_CV.pdf'));
  expect(download).toHaveAttribute('download', 'Muhammad-Faran-Sarwar-CV.pdf');

  const preview = screen.getByRole('link', { name: /view pdf/i });
  expect(preview).toHaveAttribute('href', expect.stringContaining('/Faran_Sarwar_CV.pdf'));
  expect(preview).toHaveAttribute('target', '_blank');
});

test('CV page offers the same download', () => {
  render(<App />);
  goTo('CV');

  const download = screen.getByRole('link', { name: /download cv/i });
  expect(download).toHaveAttribute('href', expect.stringContaining('/Faran_Sarwar_CV.pdf'));
  expect(download).toHaveAttribute('download', 'Muhammad-Faran-Sarwar-CV.pdf');
});

test('Profile page describes the work and shows real projects', () => {
  render(<App />);

  // "Frontend" also names a skill group, so scope to the focus cards.
  const focus = screen.getByRole('region', { name: /the work, end to end/i });
  ['Frontend', 'Backend & APIs', 'Data', 'Cloud & AI integration'].forEach((title) => {
    expect(within(focus).getByRole('heading', { name: title })).toBeInTheDocument();
  });

  const projects = screen.getByRole('region', { name: /things i have built/i });
  ['Resonate', 'Lumina', 'FAST'].forEach((p) => {
    expect(within(projects).getByRole('heading', { name: p })).toBeInTheDocument();
  });
});

/* ==========================================================================
   CV page
   ========================================================================== */

test('CV page shows experience, education and certifications', () => {
  render(<App />);
  goTo('CV');

  expect(screen.getByRole('heading', { name: /professional experience/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /academic background/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /professional certifications/i })).toBeInTheDocument();

  // Cambridge appears in both the About prose and the education entry.
  expect(screen.getAllByText(/University of Cambridge/i).length).toBeGreaterThan(0);
  expect(screen.getByRole('heading', { name: /MSci \/ BA Astrophysics/i })).toBeInTheDocument();
  expect(screen.getByText(/AWS Certified Cloud Practitioner/i)).toBeInTheDocument();
  expect(screen.getByText(/TOGAF/i)).toBeInTheDocument();

  expect(screen.getAllByText('Jaid').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Firewood').length).toBeGreaterThan(0);
  expect(screen.getByRole('heading', { name: 'Proficient' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Intermediate' })).toBeInTheDocument();

  // Still no phone number.
  expect(screen.queryByText(/\+44\s?750/)).not.toBeInTheDocument();
});

/* ==========================================================================
   Moving between the three views
   ========================================================================== */

test('moving Profile -> CV -> Profile works', () => {
  render(<App />);

  goTo('CV');
  expect(screen.getByRole('heading', { name: /academic background/i })).toBeInTheDocument();

  goTo('Profile');
  expect(screen.getByRole('heading', { name: /the work, end to end/i })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /academic background/i })).not.toBeInTheDocument();
});

test('moving Profile -> IDE -> Profile works', () => {
  render(<App />);

  goToIde();
  expect(screen.getByLabelText(/terminal command input/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /back to profile/i }));
  expect(
    screen.getByRole('heading', { level: 1, name: /muhammad faran sarwar/i })
  ).toBeInTheDocument();
  expect(screen.queryByLabelText(/terminal command input/i)).not.toBeInTheDocument();
});

test('each view can be deep linked', () => {
  window.location.hash = '#cv';
  const { unmount } = render(<App />);
  expect(screen.getByRole('heading', { name: /academic background/i })).toBeInTheDocument();
  unmount();

  window.location.hash = '#ide';
  render(<App />);
  expect(screen.getByLabelText(/terminal command input/i)).toBeInTheDocument();
});

/* ==========================================================================
   IDE view
   ========================================================================== */

test('IDE view shows every technology in the stack', () => {
  render(<App />);
  goToIde();
  const stack = screen.getByRole('region', { name: /technical stack/i });

  [
    'TypeScript',
    'JavaScript',
    'Python',
    'Java',
    'C++',
    'MATLAB',
    'React',
    'Angular',
    'Svelte',
    'NestJS',
    'FastAPI',
    'Express.js',
    'Ruby on Rails',
    'PostgreSQL',
    'MongoDB',
    'AWS',
    'Twilio',
    'Deepgram',
  ].forEach((tech) => {
    expect(within(stack).getByText(tech)).toBeInTheDocument();
  });
});

/** Type a line into the IDE terminal and submit it. */
function runCommand(text) {
  const input = screen.getByLabelText(/terminal command input/i);
  fireEvent.change(input, { target: { value: text } });
  fireEvent.submit(input.closest('form'));
}

test('the terminal runs real commands and prints output', () => {
  render(<App />);
  goToIde();
  const term = screen.getByRole('region', { name: /interactive terminal/i });

  runCommand('skills react');

  expect(within(term).getByText('skills react')).toBeInTheDocument();
  expect(within(term).getByText('React')).toBeInTheDocument();
  expect(within(term).getByText(/proficiency/)).toBeInTheDocument();
});

test('unknown commands fail loudly instead of silently', () => {
  render(<App />);
  goToIde();
  const term = screen.getByRole('region', { name: /interactive terminal/i });

  runCommand('nonsense');

  expect(within(term).getByText(/command not found: nonsense/i)).toBeInTheDocument();
});

test('`stack` prints the full stack with levels', () => {
  render(<App />);
  goToIde();
  const term = screen.getByRole('region', { name: /interactive terminal/i });

  runCommand('stack');

  expect(within(term).getByText(/Languages\s+·\s+What I think in/i)).toBeInTheDocument();
  expect(within(term).getByText(/TypeScript\s+█+░+\s+92%/)).toBeInTheDocument();
});

test('`open` switches the active editor tab', () => {
  render(<App />);
  goToIde();

  runCommand('open contact');

  expect(screen.getByRole('tab', { name: /contact\.md/i })).toHaveAttribute(
    'aria-selected',
    'true'
  );
});

/* ==========================================================================
   Theme
   ========================================================================== */

test('the toggle offers system, light and dark', () => {
  render(<App />);

  const group = screen.getByRole('group', { name: /colour theme/i });
  const labels = within(group)
    .getAllByRole('button')
    .map((b) => b.textContent.trim());

  expect(labels).toHaveLength(3);
  expect(labels.join(' ')).toMatch(/system/i);
  expect(labels.join(' ')).toMatch(/light/i);
  expect(labels.join(' ')).toMatch(/dark/i);
});

test('choosing light and dark sets data-theme on <html>', () => {
  render(<App />);

  const group = screen.getByRole('group', { name: /colour theme/i });
  const [systemBtn, lightBtn, darkBtn] = within(group).getAllByRole('button');

  fireEvent.click(lightBtn);
  expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  expect(lightBtn).toHaveAttribute('aria-pressed', 'true');

  fireEvent.click(darkBtn);
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  expect(darkBtn).toHaveAttribute('aria-pressed', 'true');

  // `system` removes the attribute so the CSS media query takes over again.
  fireEvent.click(systemBtn);
  expect(document.documentElement).not.toHaveAttribute('data-theme');
  expect(systemBtn).toHaveAttribute('aria-pressed', 'true');
});

test('the theme choice is persisted, and a stored choice is honoured on load', () => {
  render(<App />);

  const group = screen.getByRole('group', { name: /colour theme/i });
  const [, lightBtn] = within(group).getAllByRole('button');
  fireEvent.click(lightBtn);

  expect(window.localStorage.getItem('theme')).toBe('light');

  // A fresh mount should pick the stored preference straight up.
  document.documentElement.removeAttribute('data-theme');
  const { unmount } = render(<App />);
  unmount();
  expect(window.localStorage.getItem('theme')).toBe('light');
});

test('the theme toggle is available in every view', () => {
  render(<App />);
  expect(screen.getByRole('group', { name: /colour theme/i })).toBeInTheDocument();

  goTo('CV');
  expect(screen.getByRole('group', { name: /colour theme/i })).toBeInTheDocument();

  goToIde();
  expect(screen.getByRole('group', { name: /colour theme/i })).toBeInTheDocument();
});
