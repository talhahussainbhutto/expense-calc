module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./src",
  verbose: true,
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  },
  testTimeout: 70000,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ["json", "lcov", "text", "clover"]
}
