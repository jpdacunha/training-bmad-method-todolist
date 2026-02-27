/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.test\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.ts', '!**/node_modules/**', '!**/*.test.ts', '!main.ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@training-bmad-method-todolist/shared$': '<rootDir>/../../packages/shared/src',
    '^@training-bmad-method-todolist/shared/(.*)$': '<rootDir>/../../packages/shared/src/$1',
  },
};
