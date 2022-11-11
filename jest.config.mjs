export default {
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: [
    "json",
    "text",
    "lcov",
    "clover"
  ],
  // força um coverage para todos os arquivos
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/index.js",
  ],
   coverageThreshold: {
     global: {
       branch: 100,
       functions: 100,
       lines: 100,
       statements:100
     }
   },

  maxWorkers: "50%",
  testEnvironment: "node",
  watchPathIgnorePatterns: [
    "node_modules"
  ],
  transformIgnorePatterns: ["node_modules"],
  testMatch: [
    '**/__tests__/**/*.spec.js',
    '!**/src/**'
  ]
};