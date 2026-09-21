/**
 * Terminal command set.
 *
 * Each command gets the full context and returns either a plain string, an
 * array of strings, or a JSX node (for rich output like the stack bars).
 * `run` may also be used purely for its side effect — e.g. opening a tab.
 */
import { STACK, IDENTITY, FILES } from './content';

const line = (text, kind = 'out') => ({ kind, text });

/** Flatten STACK into a lookup: lowercased skill name -> entry + group. */
export const SKILL_INDEX = new Map();
STACK.forEach((group) => {
  group.items.forEach((item) => {
    SKILL_INDEX.set(item.name.toLowerCase(), { ...item, group: group.group });
  });
});

export const COMMAND_NAMES = [
  'help',
  'whoami',
  'stack',
  'languages',
  'frameworks',
  'skills',
  'projects',
  'experience',
  'contact',
  'open',
  'ls',
  'clear',
];

export const COMMANDS = {
  help: {
    desc: 'list everything you can run',
    run: () => [
      line('Available commands', 'head'),
      line('  whoami        who I am, in one breath'),
      line('  stack         the full stack, with proficiency'),
      line('  languages     programming languages only'),
      line('  frameworks    frameworks and libraries only'),
      line('  skills <name> details for one technology, e.g. `skills react`'),
      line('  projects      what I have built'),
      line('  experience    where I have worked'),
      line('  contact       how to reach me'),
      line('  open <file>   open an editor tab'),
      line('  ls            list files'),
      line('  clear         wipe the screen'),
      line('', 'out'),
      line('Tip: use ↑ / ↓ for history, Tab to autocomplete.', 'dim'),
    ],
  },

  whoami: {
    desc: 'who I am',
    run: () => [
      line(`${IDENTITY.name} — ${IDENTITY.role}`),
      line(`${IDENTITY.location} · @${IDENTITY.handle}`, 'dim'),
      line('', 'out'),
      line('MSci Astrophysics (Cambridge), now a full stack developer.', 'out'),
      line('I own problems end to end: schema, API, interface, deployment.', 'out'),
      line('Type `stack` to see what I actually work in.', 'dim'),
    ],
  },

  stack: {
    desc: 'full stack with proficiency',
    run: () => {
      const out = [line('The stack', 'head')];
      STACK.forEach((group) => {
        out.push(line('', 'out'));
        out.push(line(`  ${group.group}  ·  ${group.blurb}`, 'dim'));
        group.items.forEach((item) => {
          const filled = Math.round(item.level / 10);
          const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
          out.push({
            kind: 'skill',
            text: `  ${item.name.padEnd(14)} ${bar}  ${item.level}%`,
            skill: item,
          });
        });
      });
      return out;
    },
  },

  languages: {
    desc: 'programming languages',
    run: () =>
      STACK.filter((g) => g.group === 'Languages').flatMap((g) => [
        line('Languages', 'head'),
        ...g.items.map((i) => line(`  ${i.name.padEnd(14)} ${i.level}%`)),
      ]),
  },

  frameworks: {
    desc: 'frameworks and libraries',
    run: () => {
      const out = [];
      STACK.filter((g) => g.group === 'Frontend' || g.group === 'Backend').forEach((g) => {
        out.push(line(g.group, 'head'));
        g.items.forEach((i) => out.push(line(`  ${i.name.padEnd(14)} ${i.level}%`)));
        out.push(line('', 'out'));
      });
      return out;
    },
  },

  skills: {
    desc: 'details for one technology',
    run: (args) => {
      const query = args.join(' ').toLowerCase().trim();
      if (!query) {
        return [
          line('Which one? Try `skills react`.', 'err'),
          line(`Known: ${[...SKILL_INDEX.keys()].join(', ')}`, 'dim'),
        ];
      }

      const exact = SKILL_INDEX.get(query);
      const partial = exact
        ? null
        : [...SKILL_INDEX.entries()].find(([k]) => k.includes(query));

      const found = exact || (partial && partial[1]);
      if (!found) {
        return [
          line(`No match for "${query}".`, 'err'),
          line(`Known: ${[...SKILL_INDEX.keys()].join(', ')}`, 'dim'),
        ];
      }

      const filled = Math.round(found.level / 10);
      return [
        line(`${found.name}`, 'head'),
        line(`  category     ${found.group}`),
        line(`  proficiency  ${'█'.repeat(filled)}${'░'.repeat(10 - filled)}  ${found.level}%`),
      ];
    },
  },

  projects: {
    desc: 'what I have built',
    run: (args, ctx) => {
      ctx.openFile('projects');
      return [line('Opening projects.ts …', 'dim'), line('See the editor pane for the full list.', 'dim')];
    },
  },

  experience: {
    desc: 'where I have worked',
    run: (args, ctx) => {
      ctx.openFile('experience');
      return [line('Opening experience.ts …', 'dim')];
    },
  },

  contact: {
    desc: 'how to reach me',
    run: (args, ctx) => {
      ctx.openFile('contact');
      return [
        line('Contact', 'head'),
        ...IDENTITY.links.map((l, i) => line(`  ${['GitHub ', 'LinkedIn'][i] || l.label.padEnd(8)} ${l.url}`)),
        line(`  Email    ${IDENTITY.email}`),
      ];
    },
  },

  open: {
    desc: 'open an editor tab',
    run: (args, ctx) => {
      const target = args.join(' ').toLowerCase().trim();
      if (!target) {
        return [line(`Try: open <${FILES.map((f) => f.name).join('|')}>`, 'err')];
      }
      const file =
        FILES.find((f) => f.name.toLowerCase() === target) ||
        FILES.find((f) => f.name.toLowerCase().startsWith(target));
      if (!file) return [line(`No such file: ${target}`, 'err')];
      ctx.openFile(file.id);
      return [line(`Opened ${file.name}`, 'dim')];
    },
  },

  ls: {
    desc: 'list files',
    run: () => [line(FILES.map((f) => f.name).join('   '))],
  },

  clear: {
    desc: 'wipe the screen',
    run: (args, ctx) => {
      ctx.clear();
      return null;
    },
  },
};

/** Resolve a raw input string into a command + args. */
export function resolveCommand(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const [name, ...args] = trimmed.split(/\s+/);
  const cmd = COMMANDS[name.toLowerCase()];
  return { name: name.toLowerCase(), args, cmd, raw: trimmed };
}
