module.exports = {
  env: {
    es6: true,
    browser: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'react-app'],
  rules: {
    'prefer-const': 'error',
    'no-console': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
  },
  parser: 'babel-eslint',
  parserOptions: {
    jsx: true,
  },
  plugins: ['react'],
  overrides: [
    {
      files: '**/*.spec.js',
      env: {
        jest: true,
      },
    },
  ],
};
