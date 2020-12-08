module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/seedutil/*.spec.[jt]s?(x)',
    '**/test/jest/**/*.spec.[jt]s?(x)'
  ],
};
