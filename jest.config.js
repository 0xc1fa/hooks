/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "/^@\/(.*)$/": "<rootDir>/$1"
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
