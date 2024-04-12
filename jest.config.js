/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "/^@\/(.*)$/": "<rootDir>/$1"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
