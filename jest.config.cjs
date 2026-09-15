// Jest via next/jest — handles the SWC transform, tsconfig paths (@/…), CSS
// modules and next/font without hand-rolled babel config.
//
// This exists because a caret regression (bb579b5) reversed typed text in the
// admin compose editor and reached production: the feature it shipped was
// browser-verified, but nothing tested the ordinary typing path the feature
// shares state with. See website#42.
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  // Scoped deliberately: this is a component-test net, not a runner for
  // scripts/test-publish-post-corpus.js (which is a standalone node harness
  // with its own entry point and stays on `npm run test:corpus`).
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
};

module.exports = createJestConfig(config);
