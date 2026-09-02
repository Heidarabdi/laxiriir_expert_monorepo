import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import { getDevelopmentSeedPassword, readApiConfig } from "../src/config.js";

describe("API configuration", () => {
	it("does not enable demo identities without an explicit local password", () => {
		expect(
			getDevelopmentSeedPassword(readApiConfig({ NODE_ENV: "development" })),
		).toBeUndefined();
	});

	it("only supplies configured demo credentials for enabled development seeding", () => {
		const password = randomBytes(24).toString("base64url");
		const config = readApiConfig({
			NODE_ENV: "development",
			DEVELOPMENT_DEMO_PASSWORD: password,
		});
		expect(getDevelopmentSeedPassword(config)).toBe(password);
		expect(
			getDevelopmentSeedPassword({ ...config, SEED_DEVELOPMENT_DATA: false }),
		).toBeUndefined();
		expect(
			getDevelopmentSeedPassword({ ...config, NODE_ENV: "production" }),
		).toBeUndefined();
		expect(
			getDevelopmentSeedPassword({ ...config, NODE_ENV: "test" }),
		).toBeUndefined();
	});

	it("rejects too-short demo credentials without a fallback", () => {
		expect(() =>
			readApiConfig({
				DEVELOPMENT_DEMO_PASSWORD: randomBytes(4).toString("hex"),
			}),
		).toThrow();
	});
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

	it("requires HTTPS authentication origins in production", () => {
		expect(() =>
			readApiConfig({
				BETTER_AUTH_SECRET: "a-secure-production-secret-with-32-characters",
				BETTER_AUTH_URL: "http://api.example.com",
				NODE_ENV: "production",
				TRUSTED_ORIGINS: "https://app.example.com",
			}),
		).toThrow("BETTER_AUTH_URL must use HTTPS in production");

		expect(() =>
			readApiConfig({
				BETTER_AUTH_SECRET: "a-secure-production-secret-with-32-characters",
				BETTER_AUTH_URL: "https://api.example.com",
				NODE_ENV: "production",
				TRUSTED_ORIGINS: "http://app.example.com",
			}),
		).toThrow("TRUSTED_ORIGINS must use HTTPS in production");
	});

	it("requires an explicit database in production", () => {
		expect(() =>
			readApiConfig({
				BETTER_AUTH_SECRET: "a-secure-production-secret-with-32-characters",
				BETTER_AUTH_URL: "https://api.example.com",
				NODE_ENV: "production",
				TRUSTED_ORIGINS: "https://app.example.com",
			}),
		).toThrow("DATABASE_URL must be configured in production");
	});
});
