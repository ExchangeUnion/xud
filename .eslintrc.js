module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  rules: {
    'no-empty': 'off',
    "object-curly-newline": 0,
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'plugin:import/errors',
    'plugin:import/warnings',
    'eslint:recommended',
    'prettier',
  ],
};
