import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ConsultationService } from "../src/consultations/service.ts";
import { user } from "../src/db/auth-schema.js";
import { experts } from "../src/db/consultation-schema.ts";
import type { AppDatabase } from "../src/db/postgres.js";
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
				expertStatus: "pending_review",
				role: "expert",
			},
		});
		expect(String(response.headers["set-cookie"])).toContain(
			"better-auth.session_token=",
		);
	});

	it("does not require email verification in development", async () => {
		const application = await createTestApplication({
			NODE_ENV: "development",
		});
		closeTasks.push(() => application.close());
		const credentials = {
			email: "development-user@example.com",
			password: "correct-horse-battery-staple",
		};
		const signUp = await application.server.inject({
			method: "POST",
			payload: {
				...credentials,
				name: "Development User",
				role: "client",
			},
			url: "/api/auth/sign-up/email",
		});
		expect(signUp.statusCode).toBe(200);
		const signUpCookie = signUp.cookies
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join("; ");
		const signedUpUser = await application.server.inject({
			headers: { cookie: signUpCookie },
			method: "GET",
			url: "/api/v1/me",
		});
		expect(signedUpUser.statusCode).toBe(200);
		expect(signedUpUser.json().emailVerified).toBe(true);

		const signIn = await application.server.inject({
			method: "POST",
			payload: credentials,
			url: "/api/auth/sign-in/email",
		});
		expect(signIn.statusCode).toBe(200);

		const bookings = await application.server.inject({
			headers: {
				cookie: signIn.cookies
					.map((cookie) => `${cookie.name}=${cookie.value}`)
					.join("; "),
			},
			method: "GET",
			url: "/api/v1/client/bookings",
		});
		expect(bookings.statusCode).toBe(200);
		const currentUser = await application.server.inject({
			headers: {
				cookie: signIn.cookies
					.map((cookie) => `${cookie.name}=${cookie.value}`)
					.join("; "),
			},
			method: "GET",
			url: "/api/v1/me",
		});
		expect(currentUser.json().emailVerified).toBe(true);
	});

	it("auto-approves and provisions experts in development", async () => {
		const application = await createTestApplication({
			NODE_ENV: "development",
		});
		closeTasks.push(() => application.close());
		const credentials = {
			email: "development-expert@example.com",
			password: "correct-horse-battery-staple",
		};
		await application.server.inject({
			method: "POST",
			payload: {
				...credentials,
				name: "Development Expert",
				role: "expert",
			},
			url: "/api/auth/sign-up/email",
		});
		const signIn = await application.server.inject({
			method: "POST",
			payload: credentials,
			url: "/api/auth/sign-in/email",
		});
		const cookie = signIn.cookies
			.map((item) => `${item.name}=${item.value}`)
			.join("; ");

		const currentUser = await application.server.inject({
			headers: { cookie },
			method: "GET",
			url: "/api/v1/me",
		});
		expect(currentUser.json()).toMatchObject({
			allowedAreas: ["expert"],
			expertStatus: "approved",
			primaryRole: "expert",
		});
		const { userId } = currentUser.json<{ userId: string }>();
		await application.database
			.update(experts)
			.set({ displayName: "Custom Development Profile" })
			.where(eq(experts.id, userId));
		await application.server.inject({
			headers: { cookie },
			method: "GET",
			url: "/api/v1/me",
		});
		const [profile] = await application.database
			.select({ displayName: experts.displayName })
			.from(experts)
			.where(eq(experts.id, userId));
		expect(profile?.displayName).toBe("Custom Development Profile");

		const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const availability = await application.server.inject({
			headers: { cookie },
			method: "POST",
			payload: {
				endsAt: new Date(startsAt.getTime() + 60 * 60 * 1000).toISOString(),
				startsAt: startsAt.toISOString(),
			},
			url: "/api/v1/expert/availability",
		});
		expect(availability.statusCode).toBe(201);

		const developmentAvailability = await application.server.inject({
			method: "GET",
			url: `/api/v1/experts/${userId}/availability`,
		});
		expect(developmentAvailability.json().slots).toHaveLength(1);
		const productionView = new ConsultationService(
			application.database as unknown as AppDatabase,
		);
		expect(await productionView.listExperts()).not.toContainEqual(
			expect.objectContaining({ id: userId }),
		);
		expect(await productionView.listAvailability(userId, new Date(0))).toEqual(
			[],
		);
	});

	it("requires email verification outside development", async () => {
		const application = await createTestApplication();
		closeTasks.push(() => application.close());
		const credentials = {
			email: "unverified-user@example.com",
			password: "correct-horse-battery-staple",
		};
		await application.server.inject({
			method: "POST",
			payload: {
				...credentials,
				name: "Unverified User",
				role: "client",
			},
			url: "/api/auth/sign-up/email",
		});

		const signIn = await application.server.inject({
			method: "POST",
			payload: credentials,
			url: "/api/auth/sign-in/email",
		});
		expect(signIn.statusCode).toBe(403);
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
		const sendEmail = vi
			.fn()
			.mockResolvedValue(new Response(null, { status: 202 }));
		vi.stubGlobal("fetch", sendEmail);
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
		expect(sendEmail).toHaveBeenCalledOnce();
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
