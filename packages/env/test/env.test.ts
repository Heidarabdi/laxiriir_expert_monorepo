import { afterEach, describe, expect, it, vi } from "vitest";

describe("client environment", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.resetModules();
	});

	it("reads the web API URL from the Vite public environment", async () => {
		vi.stubEnv("VITE_API_BASE_URL", "https://api.example.com");

		const { webEnv } = await import("../src/web");

		expect(webEnv.VITE_API_BASE_URL).toBe("https://api.example.com");
	});

	it("rejects an invalid Expo public API URL", async () => {
		vi.stubEnv("EXPO_PUBLIC_API_BASE_URL", "not-a-url");

		await expect(import("../src/native")).rejects.toThrow();
	});
});
