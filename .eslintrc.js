module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  rules: {
    'no-empty': 'off',
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
