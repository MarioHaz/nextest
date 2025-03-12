// jest.config.js

const nextJest = require("next/jest");

// This function will load your Next.js config and .env files
const createJestConfig = nextJest({
  dir: "./", // path to your Next.js app
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  // If you have any moduleNameMapper for aliases, e.g.:
  // moduleNameMapper: {
  //   '^@/components/(.*)$': '<rootDir>/components/$1',
  // },
};

module.exports = createJestConfig(customJestConfig);
