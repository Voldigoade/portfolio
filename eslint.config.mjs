import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  { ignores: ['dist/**', '.astro/**', '.vercel/**'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  ...astro.configs.recommended,
  {
    files: [
      'tests/browser.mjs',
      'tests/spoor-e2e.mjs',
      'tests/spoor-visibility.mjs',
    ],
    languageOptions: {
      globals: {
        fetch: 'readonly',
        document: 'readonly',
        window: 'readonly',
        requestAnimationFrame: 'readonly',
        getComputedStyle: 'readonly',
        performance: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
      },
    },
  },
  {
    languageOptions: {
      globals: {
        process: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly',
        console: 'readonly',
        Response: 'readonly',
        AbortController: 'readonly',
        AbortSignal: 'readonly',
      },
    },
  },
);
