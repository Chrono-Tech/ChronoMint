/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

const path = require('path')

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    // parserOptions is a hack for ESLint error 'Please use `export @dec class` instead'
    ecmaFeatures: { legacyDecorators: true },
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve('config/webpack.dev.babel.js'),
      },
    },
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      version: '16.4.1',
    },
    propWrapperFunctions: ['forbidExtraProps'],
  },
  plugins: [
    'babel',
    'import',
    'jsx-a11y',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:monorepo/recommended',
  ],
  globals: {
    i18nJson: true,
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    indent: ['warn', 2],
    'arrow-parens': 'warn',
    'comma-dangle': ['error', 'always-multiline'],
    complexity: 'warn',
    'eol-last': 'warn',
    'global-require': 'warn',
    'import/first': 'warn',
    'import/no-extraneous-dependencies': 'off', // TODO Use webpack resolver possible to solve issues with aliased modules
    'import/no-named-as-default-member': 'warn',
    'import/prefer-default-export': 'warn',
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/anchor-is-valid': [
      'warn',
      { components: ['Link'], specialLink: ['to'] },
    ],
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'jsx-a11y/no-static-element-interactions': 'off',
    'monorepo/no-internal-import': 'off',
    'monorepo/no-relative-import': 'off',
    'no-console': 'error',
    'no-multiple-empty-lines': 'error',
    'no-param-reassign': 'warn',
    'no-return-await': 'warn',
    'no-underscore-dangle': 'warn',
    'no-unused-vars': 'error',
    'prefer-const': 'warn',
    'react/default-props-match-prop-types': 'warn',
    'react/forbid-prop-types': 'warn',
    'react/jsx-boolean-value': 'warn',
    'react/jsx-curly-brace-presence': 'warn',
    'react/jsx-handler-names': 'warn',
    'react/jsx-no-bind': 'warn',
    'react/no-array-index-key': 'warn',
    'react/prop-types': 'warn',
    semi: ['warn', 'never'],
    'space-before-function-paren': ['error', 'always'],
  },
}
