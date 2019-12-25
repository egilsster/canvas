'use strict';

const ERROR = 2;
const WARN = 1;
const OFF = 0;

module.exports = {
  parser: '@typescript-eslint/parser',
  root: true,
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    'prettier/prettier': ERROR,
  },
  parserOptions: {
    ecmaVersion: 2018,
    project: './tsconfig.json',
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  globals: {
    $: true,
  },
  overrides: [
    {
      files: ['webpack/**/*.js'],
      rules: {
        'no-console': OFF,
      },
      env: {
        node: true,
      },
    },
  ],
};
