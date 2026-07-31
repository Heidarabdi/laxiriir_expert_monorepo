import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		fileParallelism: false,
		hookTimeout: 45_000,
		maxWorkers: 1,
		testTimeout: 45_000,
	},
});
