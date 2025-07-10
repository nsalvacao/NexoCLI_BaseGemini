/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '/0.ModelosOriginais/'],
};

export default config;
