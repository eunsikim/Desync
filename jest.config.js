const nextJest = require("next/jest");

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: "./",
});

// Add any custom config to be passed to Jest
const config = {
	coverageProvider: "v8",
	testEnvironment: "jsdom",
	// Add more setup options before each test is run
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	preset: "ts-jest",
	transformIgnorePatterns: [
		"<rootDir>/node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)",
		"./src/(?!@ngrx|(?!deck.gl)|ng-dynamic)",
	],
	moduleNameMapper: {
		"^lodash-es$": "lodash",
		"^jose": require.resolve("jose"),
		"^@/(.*)$": "<rootDir>/src/$1",
	},
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);
