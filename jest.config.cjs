module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/client/src/components/__test__/setupJest.ts"],
  globals: {
    "import.meta.env.VITE_API_URL": "http://localhost:5173"
  },
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": ["babel-jest", { configFile: "./babel.config.js" }]
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transformIgnorePatterns: [
    "/node_modules/(?!wouter|regexparam)"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/client/src/$1"
  },
};
