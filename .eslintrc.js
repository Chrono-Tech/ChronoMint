module.exports = {
    "env": {
        "browser": true,
        "jest": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    // "extends": ["standard"],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "parser": "babel-eslint",
    "plugins": [
        "react",
        "async-await"
    ],
    "rules": {
        "indent": [
          "error", 2, {
            "SwitchCase": 1
          }
        ],
        "semi": ["error", "never"],
        "react/prop-types": 1,
        "react/no-string-refs": 1,
        "no-console": 1,
        "react/display-name": 1,
        "no-unused-vars": 1,
        "react/no-unescaped-entities": 1,
        "react/jsx-key": 1,
        "no-case-declarations": 1,
        "react/jsx-no-target-blank": 1,
        "react/no-find-dom-node": 1,
        "react/no-deprecated": 1
    }
};
