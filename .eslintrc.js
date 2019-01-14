/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

module.exports = {
  root: true,
  extends: [
    "plugin:chronobank-react/recommended",
    "plugin:monorepo/recommended",
  ],
  globals: {
    "i18nJson": true,
  },
  rules: {
    "arrow-parens": "warn",
    "comma-dangle": "warn",
    "complexity": "warn",
    "eol-last": "warn",
    "global-require": "warn",
    "import/first": "warn",
    "import/no-extraneous-dependencies": "off", // TODO Use webpack resolver possible to solve issues with aliased modules
    "import/no-named-as-default-member": "warn",
    "import/prefer-default-export": "warn",
    "indent": "warn",
    "jsx-a11y/alt-text": "warn",
    "jsx-a11y/anchor-is-valid": ["warn", { "components": ["Link"], "specialLink": ["to"] }],
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-noninteractive-element-interactions": "warn",
    "jsx-a11y/no-static-element-interactions": "warn",
    "monorepo/no-internal-import": "off",
    "monorepo/no-relative-import": "error",
    "no-console": "error",
    "no-multiple-empty-lines": "error",
    "no-param-reassign": "warn",
    "no-return-await": "warn",
    "no-underscore-dangle": "warn",
    "no-unused-vars": "error",
    "prefer-const": "warn",
    "react/default-props-match-prop-types": "warn",
    "react/forbid-prop-types": "warn",
    "react/jsx-boolean-value": "warn",
    "react/jsx-curly-brace-presence": "warn",
    "react/jsx-handler-names": "warn",
    "react/jsx-no-bind": "warn",
    "react/no-array-index-key": "warn",
    "react/prop-types": "warn",
    "semi": ["error", "never"],
    "space-before-function-paren": ["error", "always"],
  },
}
