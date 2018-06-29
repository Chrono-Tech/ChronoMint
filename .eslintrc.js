module.exports = {
  root: true,
  extends: ['plugin:chronobank-react/recommended'],
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
  },
};
