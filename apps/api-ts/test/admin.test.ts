import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it } from "vitest";

import { user } from "../src/db/auth-schema.js";
import { createTestApplication } from "./application.js";

const cleanupTasks: Array<() => Promise<void>> = [];

afterEach(async () => {
	await Promise.all(cleanupTasks.splice(0).map((cleanup) => cleanup()));
});

describe("admin expert moderation", () => {
	it("allows a verified bootstrap admin to approve an expert", async () => {
		const application = await createTestApplication({
			AUTH_BOOTSTRAP_ADMIN_EMAILS: "admin@example.com",
		});
		cleanupTasks.push(() => application.close());

		await application.server.inject({
			method: "POST",
			payload: {
				email: "admin@example.com",
				name: "Platform Admin",
				password: "correct-horse-battery-staple",
				role: "client",
			},
			url: "/api/auth/sign-up/email",
		});
		const expertRegistration = await application.server.inject({
			method: "POST",
			payload: {
				email: "pending-expert@example.com",
				name: "Pending Expert",
				password: "correct-horse-battery-staple",
				role: "expert",
			},
			url: "/api/auth/sign-up/email",
		});
		const expertId = expertRegistration.json().user.id as string;
		await application.database
			.update(user)
			.set({ emailVerified: true })
			.where(eq(user.email, "admin@example.com"));
		const adminSignIn = await application.server.inject({
			method: "POST",
			payload: {
				email: "admin@example.com",
				password: "correct-horse-battery-staple",
			},
			url: "/api/auth/sign-in/email",
		});
		const cookie = adminSignIn.cookies
			.map((item) => `${item.name}=${item.value}`)
			.join("; ");

		const listResponse = await application.server.inject({
			headers: { cookie },
			method: "GET",
			url: "/api/v1/admin/experts",
		});

		expect(listResponse.statusCode).toBe(200);
		expect(listResponse.json()).toMatchObject({
			experts: [
				{
					displayName: "Pending Expert",
					expertStatus: "pending_review",
					identityUserId: expertId,
				},
			],
		});

		const response = await application.server.inject({
			headers: { cookie },
			method: "PATCH",
			url: `/api/v1/admin/experts/${expertId}/approve`,
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toMatchObject({
			message: "expert approved",
			profile: {
				expertStatus: "approved",
				identityUserId: expertId,
				primaryRole: "expert",
			},
		});
	});
});
