import { SpoorError, type LookupTarget } from './types';

export function parseTarget(input: string): LookupTarget {
  let value = input.trim();
  if (/^(?:https?:\/\/)?(?:www\.)?github\.com\//i.test(value)) {
    value = value
      .replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//i, '')
      .replace(/\/$/, '');
  }
  const parts = value.split('/');
  if (parts.length === 2 && parts[1].endsWith('.git')) {
    parts[1] = parts[1].slice(0, -4);
    value = parts.join('/');
  }
  const user = /^(?!-)[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;
  const repo = /^(?!\.{1,2}$)[a-z\d_.-]{1,100}$/i;
  if (
    !user.test(parts[0]) ||
    parts.length > 2 ||
    (parts.length === 2 && !repo.test(parts[1]))
  ) {
    throw new SpoorError('invalidTarget');
  }
  return {
    value,
    kind: parts.length === 2 ? 'repository' : 'user',
    githubUrl: `https://github.com/${value}`,
  };
}
