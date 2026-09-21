import { render, screen, within, fireEvent } from '@testing-library/react';
import App from './App';

test('renders the name in the hero', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /faran sarwar/i })).toBeInTheDocument();
});
test('shows every technology in the stack', () => {
  render(<App />);

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

/** Type a line into the terminal and submit it. */
function runCommand(text) {
  const input = screen.getByLabelText(/terminal command input/i);
  fireEvent.change(input, { target: { value: text } });
  fireEvent.submit(input.closest('form'));
}

test('the terminal runs real commands and prints output', () => {
  render(<App />);
  const term = screen.getByRole('region', { name: /interactive terminal/i });

  runCommand('skills react');

  // Echoed input, then the command's own output.
  expect(within(term).getByText('skills react')).toBeInTheDocument();
  expect(within(term).getByText('React')).toBeInTheDocument();
  expect(within(term).getByText(/proficiency/)).toBeInTheDocument();
});

test('unknown commands fail loudly instead of silently', () => {
  render(<App />);
  const term = screen.getByRole('region', { name: /interactive terminal/i });

  runCommand('nonsense');

  expect(within(term).getByText(/command not found: nonsense/i)).toBeInTheDocument();
});

test('`stack` prints the full stack with levels', () => {
  render(<App />);
  const term = screen.getByRole('region', { name: /interactive terminal/i });

  runCommand('stack');

  expect(within(term).getByText(/Languages\s+·\s+What I think in/i)).toBeInTheDocument();
  expect(within(term).getByText(/TypeScript\s+█+░+\s+92%/)).toBeInTheDocument();
});

test('`open` switches the active editor tab', () => {
  render(<App />);

  runCommand('open contact');

  expect(screen.getByRole('tab', { name: /contact\.md/i })).toHaveAttribute(
    'aria-selected',
    'true'
  );
});
