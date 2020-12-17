module.exports = {
  preset: 'ts-jest',
  testMatch: ["<rootDir>/test/jest/**/*.ts"],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json'

    }
  },
  testEnvironment: 'node',
};
