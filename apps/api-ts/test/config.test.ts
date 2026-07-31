import { describe, expect, it } from "vitest";
import { readApiConfig } from "../src/config.js";

describe("API configuration", () => {
	it("validates and normalizes trusted browser origins", () => {
		const config = readApiConfig({
			NODE_ENV: "test",
			TRUSTED_ORIGINS: "http://localhost:3000, https://app.example.com",
		});

		expect(config.TRUSTED_ORIGINS).toEqual([
			"http://localhost:3000",
			"https://app.example.com",
		]);
	});

	it("rejects the development auth secret in production", () => {
		expect(() =>
			readApiConfig({
				BETTER_AUTH_SECRET: "development-only-secret-change-me",
				NODE_ENV: "production",
			}),
		).toThrow("BETTER_AUTH_SECRET must be changed in production");
	});
});
