import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it, vi } from "vitest";

import { user } from "../src/db/auth-schema.js";
import { createTestApplication } from "./application.js";

const closeTasks: Array<() => Promise<unknown>> = [];

afterEach(async () => {
	await Promise.all(closeTasks.splice(0).map((close) => close()));
	vi.unstubAllGlobals();
});

async function createAuthServer() {
	const application = await createTestApplication();
	closeTasks.push(() => application.close());

	return application.server;
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
		expect(response.headers["set-cookie"]).toBeUndefined();
	});

	it("signs in a registered user with email and password", async () => {
		const application = await createTestApplication();
		closeTasks.push(() => application.close());
		const server = application.server;
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
		await application.database
			.update(user)
			.set({ emailVerified: true })
			.where(eq(user.email, credentials.email));

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
		const application = await createTestApplication();
		closeTasks.push(() => application.close());
		const server = application.server;
		await server.inject({
			method: "POST",
			payload: {
				email: "session@example.com",
				name: "Session User",
				password: "correct-horse-battery-staple",
				role: "client",
			},
			url: "/api/auth/sign-up/email",
		});
		await application.database
			.update(user)
			.set({ emailVerified: true })
			.where(eq(user.email, "session@example.com"));
		const signIn = await server.inject({
			method: "POST",
			payload: {
				email: "session@example.com",
				password: "correct-horse-battery-staple",
			},
			url: "/api/auth/sign-in/email",
		});

		const response = await server.inject({
			headers: {
				cookie: signIn.cookies
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
		const application = await createTestApplication();
		closeTasks.push(() => application.close());
		const server = application.server;
		await server.inject({
			method: "POST",
			payload: {
				email: "role-change@example.com",
				name: "Client User",
				password: "correct-horse-battery-staple",
				role: "client",
			},
			url: "/api/auth/sign-up/email",
		});
		await application.database
			.update(user)
			.set({ emailVerified: true })
			.where(eq(user.email, "role-change@example.com"));
		const signIn = await server.inject({
			method: "POST",
			payload: {
				email: "role-change@example.com",
				password: "correct-horse-battery-staple",
			},
			url: "/api/auth/sign-in/email",
		});
		const cookie = signIn.cookies
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

	it("uses secure cross-site session cookies in production", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 202 })));
		const application = await createTestApplication({
			BETTER_AUTH_SECRET: "production-secret-that-is-at-least-32-characters",
			BETTER_AUTH_URL: "https://api.example.com",
			DATABASE_URL: "postgres://production.example.com/laxiriir",
			EMAIL_FROM: "Laxiriir <auth@example.com>",
			NODE_ENV: "production",
			RESEND_API_KEY: "resend-test-key",
			TRUSTED_ORIGINS: "https://web.example.net",
		});
		closeTasks.push(() => application.close());

		const credentials = {
			email: "production-cookie@example.com",
			password: "correct-horse-battery-staple",
		};
		await application.server.inject({
			method: "POST",
			payload: {
				...credentials,
				name: "Production User",
				role: "client",
			},
			url: "/api/auth/sign-up/email",
		});
		await application.database
			.update(user)
			.set({ emailVerified: true })
			.where(eq(user.email, credentials.email));

		const response = await application.server.inject({
			method: "POST",
			payload: credentials,
			url: "/api/auth/sign-in/email",
		});
		const sessionCookie = String(response.headers["set-cookie"]);

		expect(response.statusCode).toBe(200);
		expect(sessionCookie).toContain("SameSite=None");
		expect(sessionCookie).toContain("Secure");
	});
});
