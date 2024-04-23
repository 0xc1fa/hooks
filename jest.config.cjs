/** @type {import('ts-jest').JestConfigWithTsJest} */

const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  preset: "ts-jest",
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "react/jsx-runtime": "<rootDir>/node_modules/react/jsx-runtime",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
