module.exports = {
  root: true,
  extends: [
    'plugin:chronobank-react/recommended',
    'plugin:monorepo/recommended',
  ],
  globals: {
    "i18nJson": true,
  },
  rules: {
    'space-before-function-paren': ['error', 'always'],
    'import/no-extraneous-dependencies': 'off', // TODO Use webpack resolver possible to solve issues with aliased modules
    "jsx-a11y/anchor-is-valid": ["error", {
      "components": ["Link"],
      "specialLink": ["to"],
    }],
    "monorepo/no-internal-import": "off",
    "monorepo/no-relative-import": "error",
    "no-unused-vars": "error",
    "no-underscore-dangle": "warn",
    "no-param-reassign": "warn",
    "complexity": "warn",
    "indent": "warn",
    "no-console": "error",
    "react/jsx-no-bind": "warn",
    "react/prop-types": "error",
    "comma-dangle": "warn",
    "arrow-parens": "warn",
    "react/no-array-index-key": "warn",
    "react/jsx-boolean-value": "warn",
    "react/jsx-handler-names": "warn",
    "no-multiple-empty-lines": "error",
    "eol-last": "warn",
    "import/prefer-default-export": "warn",
    "no-return-await": "warn",
    "react/forbid-prop-types": "warn",
    "global-require": "warn",
    "import/no-named-as-default-member": "warn",
    "semi": "warn",
    "import/first": "warn",
    "jsx-a11y/alt-text": "warn",
    "react/jsx-curly-brace-presence": "warn"
  },
};
