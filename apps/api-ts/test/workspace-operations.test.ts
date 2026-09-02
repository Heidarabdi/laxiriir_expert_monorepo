import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it } from "vitest";

import { ConsultationService } from "../src/consultations/service.js";
import { user } from "../src/db/auth-schema.js";
import type { AppDatabase } from "../src/db/postgres.js";
import { createTestApplication } from "./application.js";

const cleanupTasks: Array<() => Promise<void>> = [];

afterEach(async () => {
	await Promise.all(cleanupTasks.splice(0).map((cleanup) => cleanup()));
});

async function registerVerifiedUser(
	application: Awaited<ReturnType<typeof createTestApplication>>,
	input: { email: string; name: string; role: "client" | "expert" },
) {
	const password = "correct-horse-battery-staple";
	const registration = await application.server.inject({
		method: "POST",
		payload: { ...input, password },
		url: "/api/auth/sign-up/email",
	});
	await application.database
		.update(user)
		.set({ emailVerified: true })
		.where(eq(user.email, input.email));
	const signIn = await application.server.inject({
		method: "POST",
		payload: { email: input.email, password },
		url: "/api/auth/sign-in/email",
	});
	return {
		cookie: signIn.cookies
			.map((item) => `${item.name}=${item.value}`)
			.join("; "),
		userId: registration.json().user.id as string,
	};
}

describe("workspace operations", () => {
	it("updates the expert profile and lets an admin inspect users and bookings", async () => {
		const application = await createTestApplication({
			AUTH_BOOTSTRAP_ADMIN_EMAILS: "operations-admin@example.com",
		});
		cleanupTasks.push(() => application.close());
		const admin = await registerVerifiedUser(application, {
			email: "operations-admin@example.com",
			name: "Operations Admin",
			role: "client",
		});
		const expert = await registerVerifiedUser(application, {
			email: "profile-expert@example.com",
			name: "Profile Expert",
			role: "expert",
		});
		const client = await registerVerifiedUser(application, {
			email: "operations-client@example.com",
			name: "Operations Client",
			role: "client",
		});

		const approval = await application.server.inject({
			headers: { cookie: admin.cookie },
			method: "PATCH",
			url: `/api/v1/admin/experts/${expert.userId}/approve`,
		});
		expect(approval.statusCode).toBe(200);

		const profile = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "PATCH",
			payload: {
				avatarUrl: "https://example.com/expert.png",
				bio: "I help product teams turn complex strategy into focused and measurable execution plans.",
				category: "Product Strategy",
				displayName: "Amina Strategy",
				hourlyRateCents: 25_000,
				title: "Product Strategy Advisor",
			},
			url: "/api/v1/expert/profile",
		});
		expect(profile.statusCode).toBe(200);
		expect(profile.json()).toMatchObject({
			expert: {
				displayName: "Amina Strategy",
				hourlyRateCents: 25_000,
			},
		});

		const consultations = new ConsultationService(
			application.database as unknown as AppDatabase,
		);
		const startsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
		const slot = await consultations.createAvailability(
			expert.userId,
			startsAt,
			new Date(startsAt.getTime() + 60 * 60 * 1000),
		);
		const booking = await consultations.createBooking(client.userId, slot.id);

		const [users, bookings] = await Promise.all([
			application.server.inject({
				headers: { cookie: admin.cookie },
				method: "GET",
				url: "/api/v1/admin/users",
			}),
			application.server.inject({
				headers: { cookie: admin.cookie },
				method: "GET",
				url: "/api/v1/admin/bookings",
			}),
		]);

		expect(users.statusCode).toBe(200);
		expect(users.json().users).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					displayName: "Amina Strategy",
					id: expert.userId,
					primaryRole: "expert",
				}),
			]),
		);
		expect(bookings.statusCode).toBe(200);
		expect(bookings.json().bookings).toEqual([
			expect.objectContaining({
				client: expect.objectContaining({ id: client.userId }),
				expert: expect.objectContaining({ displayName: "Amina Strategy" }),
				id: booking.id,
			}),
		]);
	});
});
