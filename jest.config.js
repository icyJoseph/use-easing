module.exports = {
  transform: { "^.+\\.ts(x)?$": "ts-jest" },
  testEnvironment: "jest-environment-jsdom",
  testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFiles: ["@testing-library/react/dont-cleanup-after-each"]
};
