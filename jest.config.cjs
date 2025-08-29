module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/client/src/components/__test__/setupJest.ts"],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: [
    "/node_modules/(?!(wouter|@tanstack/react-query)/)"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/client/src/$1"
  },
};
