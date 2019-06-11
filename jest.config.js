module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/seedutil/*.[jt]s?(x)',
    '**/test/jest/**/*.[jt]s?(x)'
  ],
};
