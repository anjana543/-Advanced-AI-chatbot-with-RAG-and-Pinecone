module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ["<rootDir>/src/"],
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/tests/**/*.test.ts"],
  verbose: true,
  reporters: ["default", "jest-junit"],
  coverageReporters: ["text", "cobertura"],
  coverageDirectory: ".",
};
