import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { afterEach, describe, expect, it } from "vitest";

import { createAuth } from "../src/auth/factory.js";
import * as schema from "../src/db/schema.js";
import { buildServer } from "../src/server.js";
import { createTestConfig } from "./helpers.js";

const closeTasks: Array<() => Promise<unknown>> = [];

afterEach(async () => {
	await Promise.all(closeTasks.splice(0).map((close) => close()));
});

async function createAuthServer() {
	const client = new PGlite();
	const db = drizzle({ client, schema });
	await migrate(db, {
		migrationsFolder: path.join(
			fileURLToPath(new URL("..", import.meta.url)),
			"drizzle",
		),
	});

	const config = createTestConfig();
	const auth = createAuth(db, config);
	const server = buildServer({
		auth,
		config,
	});

	closeTasks.push(
		() => server.close(),
		() => client.close(),
	);

	return server;
}

describe("authentication", () => {
	it("registers a client with email and password", async () => {
		const server = await createAuthServer();

		const response = await server.inject({
			method: "POST",
			payload: {
				email: "client@example.com",
				name: "Example Client",
				password: "correct-horse-battery-staple",
				role: "client",
			},
			url: "/api/auth/sign-up/email",
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toMatchObject({
			user: {
				email: "client@example.com",
				name: "Example Client",
				role: "client",
			},
		});
		expect(String(response.headers["set-cookie"])).toContain(
			"better-auth.session_token=",
		);
	});

	it("signs in a registered user with email and password", async () => {
		const server = await createAuthServer();
		const credentials = {
			email: "expert@example.com",
			password: "correct-horse-battery-staple",
		};

		await server.inject({
			method: "POST",
			payload: {
				...credentials,
				name: "Example Expert",
				role: "expert",
			},
			url: "/api/auth/sign-up/email",
		});

		const response = await server.inject({
			method: "POST",
			payload: credentials,
			url: "/api/auth/sign-in/email",
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toMatchObject({
			user: {
				email: "expert@example.com",
				role: "expert",
			},
		});
		expect(String(response.headers["set-cookie"])).toContain(
			"better-auth.session_token=",
		);
	});

	it("rejects roles outside client and expert", async () => {
		const server = await createAuthServer();

		const response = await server.inject({
			method: "POST",
			payload: {
				email: "admin@example.com",
				name: "Not An Admin",
				password: "correct-horse-battery-staple",
				role: "admin",
			},
			url: "/api/auth/sign-up/email",
		});

		expect(response.statusCode).toBe(400);
		expect(response.json()).toMatchObject({
			message: "Role must be client or expert",
		});
	});

	it("returns the current session from its cookie", async () => {
		const server = await createAuthServer();
		const registration = await server.inject({
			method: "POST",
			payload: {
				email: "session@example.com",
				name: "Session User",
				password: "correct-horse-battery-staple",
				role: "client",
			},
			url: "/api/auth/sign-up/email",
		});

		const response = await server.inject({
			headers: {
				cookie: registration.cookies
					.map((cookie) => `${cookie.name}=${cookie.value}`)
					.join("; "),
			},
			method: "GET",
			url: "/api/auth/get-session",
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toMatchObject({
			user: {
				email: "session@example.com",
				role: "client",
			},
		});
	});

	it("does not allow a user to change their own role", async () => {
		const server = await createAuthServer();
		const registration = await server.inject({
			method: "POST",
			payload: {
				email: "role-change@example.com",
				name: "Client User",
				password: "correct-horse-battery-staple",
				role: "client",
			},
			url: "/api/auth/sign-up/email",
		});
		const cookie = registration.cookies
			.map((item) => `${item.name}=${item.value}`)
			.join("; ");

		const response = await server.inject({
			headers: { cookie },
			method: "POST",
			payload: { role: "expert" },
			url: "/api/auth/update-user",
		});

		expect(response.statusCode).toBe(403);
		expect(response.json()).toMatchObject({
			message: "Role cannot be changed through profile updates",
		});
	});
});
