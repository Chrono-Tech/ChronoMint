module.exports = {
  root: true,
  extends: ['plugin:chronobank-react/recommended'],
  rules: {
    'import/no-extraneous-dependencies': 'off' // TODO Use webpack resolver possible to solve issues with aliased modules
  }
};
