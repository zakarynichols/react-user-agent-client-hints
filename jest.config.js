module.exports = {
  collectCoverage: true,
  rootDir: "./",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss)$": "babel-jest"
  },
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!<rootDir>/node_modules/"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"]
}
