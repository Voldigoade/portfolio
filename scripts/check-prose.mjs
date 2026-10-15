import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const extensions = /\.(md|mdx|ts|tsx|js|jsx|mjs|cjs|rs|toml|astro|yml|yaml)$/i;
const excluded =
  /(^|\/)(node_modules|target|dist|\.astro|\.vercel|licenses|vendor)\/|(^|\/)(LICENSE|COPYING|NOTICE)|(?:^|[/.])lock(?:\.|$)/i;
const files = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { encoding: 'utf8' },
).split('\0');
const failures = [];
for (const file of new Set(files)) {
  if (!extensions.test(file) || excluded.test(file) || !existsSync(file))
    continue;
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, index) => {
      if (line.includes('\u2014'))
        failures.push(
          `${file}:${index + 1}: use ordinary sentence punctuation`,
        );
    });
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else console.log('Authored prose: no em dashes');
