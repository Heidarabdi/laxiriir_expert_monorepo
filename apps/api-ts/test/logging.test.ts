import { PassThrough } from "node:stream";
import { once } from "node:events";
import { describe, expect, it } from "vitest";

import { createLoggerOptions } from "../src/logger.js";
import { buildServer } from "../src/server.js";
import { createTestConfig } from "./helpers.js";

describe("API logging", () => {
	it("uses pretty output only in development", () => {
		const development = createLoggerOptions(
			createTestConfig({ LOG_LEVEL: "debug", NODE_ENV: "development" }),
		) as { transport?: { target?: string } };
		const production = createLoggerOptions(
			createTestConfig({
				BETTER_AUTH_SECRET: "a-secure-production-secret-with-32-characters",
				BETTER_AUTH_URL: "https://api.example.com",
				DATABASE_URL: "https://database.example.com",
				EMAIL_FROM: "support@example.com",
				NODE_ENV: "production",
				RESEND_API_KEY: "configured",
				TRUSTED_ORIGINS: "https://app.example.com",
			}),
		) as { transport?: unknown };

		expect(development.transport?.target).toBe("pino-pretty");
		expect(production.transport).toBeUndefined();
	});

	it("writes one correlated completion record per request", async () => {
		const stream = new PassThrough();
		let output = "";
		stream.on("data", (chunk) => {
			output += chunk.toString();
		});
		const server = buildServer({
			config: createTestConfig({ LOG_LEVEL: "info" }),
			logger: { level: "info", stream },
		});

		const firstLog = once(stream, "data");
		await server.inject({ method: "GET", url: "/api/v1/ping" });
		await firstLog;
		await server.close();

		const records = output
			.trim()
			.split("\n")
			.filter(Boolean)
			.map((line) => JSON.parse(line) as { msg: string });
		expect(
			records.filter(({ msg }) => msg.includes("GET /api/v1/ping")),
		).toHaveLength(1);
		expect(output).not.toContain("incoming request");
	});
});
