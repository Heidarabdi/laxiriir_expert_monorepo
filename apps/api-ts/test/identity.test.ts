import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it } from "vitest";

import { user } from "../src/db/auth-schema.js";
import { createTestApplication } from "./application.js";

const cleanupTasks: Array<() => Promise<void>> = [];

afterEach(async () => {
	await Promise.all(cleanupTasks.splice(0).map((cleanup) => cleanup()));
});

describe("current user", () => {
	it("returns the Better Auth user in the existing platform contract", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		await application.server.inject({
			method: "POST",
			payload: {
				email: "current@example.com",
				name: "Current Client",
				password: "correct-horse-battery-staple",
				role: "client",
			},
			url: "/api/auth/sign-up/email",
		});
		await application.database
			.update(user)
			.set({ emailVerified: true })
			.where(eq(user.email, "current@example.com"));
		const signIn = await application.server.inject({
			method: "POST",
			payload: {
				email: "current@example.com",
				password: "correct-horse-battery-staple",
			},
			url: "/api/auth/sign-in/email",
		});
		const cookie = signIn.cookies
			.map((item) => `${item.name}=${item.value}`)
			.join("; ");

		const response = await application.server.inject({
			headers: { cookie },
			method: "GET",
			url: "/api/v1/me",
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toMatchObject({
			allowedAreas: ["client"],
			displayName: "Current Client",
			email: "current@example.com",
			emailVerified: true,
			expertStatus: "not_applicable",
			primaryRole: "client",
		});
	});

	it("updates the signed-in user's display name", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		await application.server.inject({
			method: "POST",
			payload: {
				email: "profile-client@example.com",
				name: "Original Client",
				password: "correct-horse-battery-staple",
				role: "client",
			},
			url: "/api/auth/sign-up/email",
		});
		await application.database
			.update(user)
			.set({ emailVerified: true })
			.where(eq(user.email, "profile-client@example.com"));
		const signIn = await application.server.inject({
			method: "POST",
			payload: {
				email: "profile-client@example.com",
				password: "correct-horse-battery-staple",
			},
			url: "/api/auth/sign-in/email",
		});
		const cookie = signIn.cookies
			.map((item) => `${item.name}=${item.value}`)
			.join("; ");

		const updated = await application.server.inject({
			headers: { cookie },
			method: "PATCH",
			payload: { displayName: "Updated Client" },
			url: "/api/v1/me",
		});
		expect(updated.statusCode).toBe(200);
		expect(updated.json().displayName).toBe("Updated Client");

		const refreshed = await application.server.inject({
			headers: { cookie },
			method: "GET",
			url: "/api/v1/me",
		});
		expect(refreshed.json().displayName).toBe("Updated Client");
	});
});
