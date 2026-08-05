import { afterEach, describe, expect, it } from "vitest";
import { buildServer } from "../src/server.js";
import { createTestConfig } from "./helpers.js";

const servers: Array<ReturnType<typeof buildServer>> = [];

afterEach(async () => {
	await Promise.all(servers.splice(0).map((server) => server.close()));
});

describe("GET /health", () => {
	it("reports the same healthy contract as the current API", async () => {
		const server = buildServer({
			config: createTestConfig(),
		});
		servers.push(server);

		const response = await server.inject({
			method: "GET",
			url: "/health",
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toEqual({
			env: "test",
			status: "ok",
		});
	});
});

describe("GET /api/v1/ping", () => {
	it("preserves the current API ping contract", async () => {
		const server = buildServer({
			config: createTestConfig(),
		});
		servers.push(server);

		const response = await server.inject({
			method: "GET",
			url: "/api/v1/ping",
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toEqual({
			message: "pong",
		});
	});
});

describe("unknown routes", () => {
	it("returns the shared JSON error contract", async () => {
		const server = buildServer({
			config: createTestConfig(),
		});
		servers.push(server);

		const response = await server.inject({
			method: "GET",
			url: "/missing",
		});

		expect(response.statusCode).toBe(404);
		expect(response.json()).toEqual({
			error: "Not Found",
			message: "Route GET /missing not found",
			statusCode: 404,
		});
	});
});

describe("OpenAPI", () => {
	it("publishes the migrated HTTP interface", async () => {
		const server = buildServer({
			config: createTestConfig(),
		});
		servers.push(server);

		const response = await server.inject({
			method: "GET",
			url: "/documentation/json",
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toMatchObject({
			info: {
				title: "Laxiriir Expert API",
			},
			paths: {
				"/api/v1/ping": {},
				"/health": {},
			},
		});
	});
});
