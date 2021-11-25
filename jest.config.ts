export default {
  clearMocks: true,
  roots: ["<rootDir>/test"],
  modulePathIgnorePatterns: ["<rootDir>/test/utils"],
  testEnvironment: "node",
  preset: "ts-jest",
};