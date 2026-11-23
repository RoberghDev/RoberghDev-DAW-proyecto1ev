import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'playwright-report/**', 'test-results/**', 'public/js/vendor/**']
  },
  js.configs.recommended,
  {
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': ['error', { caughtErrors: 'none' }]
    }
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    }
  },
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: { react },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': 'off'
    }
  },
  {
    files: ['eslint.config.js', 'playwright.config.js', 'vite.config.js'],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ['src/visual/relojes3d.js'],
    rules: {
      // The dial renderer intentionally skips the 3 o'clock marker.
      'no-empty': 'off'
    }
  }
];
