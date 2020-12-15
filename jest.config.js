module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.json'
    }
  },
  testEnvironment: 'node',
};
