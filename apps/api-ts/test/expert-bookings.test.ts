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

async function approveExpert(
	application: Awaited<ReturnType<typeof createTestApplication>>,
	adminCookie: string,
	expertId: string,
) {
	const response = await application.server.inject({
		headers: { cookie: adminCookie },
		method: "PATCH",
		url: `/api/v1/admin/experts/${expertId}/approve`,
	});
	expect(response.statusCode).toBe(200);
}

describe("expert bookings", () => {
	it("returns only the signed-in expert's upcoming and past sessions", async () => {
		const application = await createTestApplication({
			AUTH_BOOTSTRAP_ADMIN_EMAILS: "admin@example.com",
		});
		cleanupTasks.push(() => application.close());
		const admin = await registerVerifiedUser(application, {
			email: "admin@example.com",
			name: "Platform Admin",
			role: "client",
		});
		const expert = await registerVerifiedUser(application, {
			email: "bookings-expert@example.com",
			name: "Bookings Expert",
			role: "expert",
		});
		const otherExpert = await registerVerifiedUser(application, {
			email: "other-bookings-expert@example.com",
			name: "Other Expert",
			role: "expert",
		});
		const client = await registerVerifiedUser(application, {
			email: "expert-client@example.com",
			name: "Session Client",
			role: "client",
		});
		await approveExpert(application, admin.cookie, expert.userId);
		await approveExpert(application, admin.cookie, otherExpert.userId);

		const consultations = new ConsultationService(
			application.database as unknown as AppDatabase,
		);
		const pastStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
		const pastSlot = await consultations.createAvailability(
			expert.userId,
			pastStart,
			new Date(pastStart.getTime() + 60 * 60 * 1000),
			new Date(pastStart.getTime() - 24 * 60 * 60 * 1000),
		);
		await consultations.createBooking(
			client.userId,
			pastSlot.id,
			new Date(pastStart.getTime() - 12 * 60 * 60 * 1000),
		);

		const futureStart = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
		const futureSlot = await consultations.createAvailability(
			expert.userId,
			futureStart,
			new Date(futureStart.getTime() + 60 * 60 * 1000),
		);
		const upcomingBooking = await consultations.createBooking(
			client.userId,
			futureSlot.id,
		);
		const otherSlot = await consultations.createAvailability(
			otherExpert.userId,
			new Date(futureStart.getTime() + 2 * 60 * 60 * 1000),
			new Date(futureStart.getTime() + 3 * 60 * 60 * 1000),
		);
		await consultations.createBooking(client.userId, otherSlot.id);

		const upcoming = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "GET",
			url: "/api/v1/expert/bookings?scope=upcoming",
		});
		const past = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "GET",
			url: "/api/v1/expert/bookings?scope=past",
		});

		expect(upcoming.statusCode).toBe(200);
		expect(upcoming.json().bookings).toEqual([
			expect.objectContaining({
				client: { displayName: "Session Client", id: client.userId },
				id: upcomingBooking.id,
			}),
		]);
		expect(past.statusCode).toBe(200);
		expect(past.json().bookings).toHaveLength(1);
	});

	it("summarizes sessions and blocks unauthenticated or client access", async () => {
		const application = await createTestApplication({
			AUTH_BOOTSTRAP_ADMIN_EMAILS: "admin@example.com",
		});
		cleanupTasks.push(() => application.close());
		const admin = await registerVerifiedUser(application, {
			email: "admin@example.com",
			name: "Platform Admin",
			role: "client",
		});
		const expert = await registerVerifiedUser(application, {
			email: "summary-expert@example.com",
			name: "Summary Expert",
			role: "expert",
		});
		const client = await registerVerifiedUser(application, {
			email: "summary-client@example.com",
			name: "Summary Client",
			role: "client",
		});
		await approveExpert(application, admin.cookie, expert.userId);

		const consultations = new ConsultationService(
			application.database as unknown as AppDatabase,
		);
		const futureStart = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
		const bookedSlot = await consultations.createAvailability(
			expert.userId,
			futureStart,
			new Date(futureStart.getTime() + 60 * 60 * 1000),
		);
		const booking = await consultations.createBooking(
			client.userId,
			bookedSlot.id,
		);
		await consultations.createAvailability(
			expert.userId,
			new Date(futureStart.getTime() + 2 * 60 * 60 * 1000),
			new Date(futureStart.getTime() + 3 * 60 * 60 * 1000),
		);

		const summary = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "GET",
			url: "/api/v1/expert/bookings/summary",
		});
		const clientAccess = await application.server.inject({
			headers: { cookie: client.cookie },
			method: "GET",
			url: "/api/v1/expert/bookings",
		});
		const anonymousAccess = await application.server.inject({
			method: "GET",
			url: "/api/v1/expert/bookings",
		});

		expect(summary.statusCode).toBe(200);
		expect(summary.json()).toMatchObject({
			nextBooking: { id: booking.id },
			openAvailability: 1,
			pastBookings: 0,
			upcomingBookings: 1,
		});
		expect(clientAccess.statusCode).toBe(403);
		expect(anonymousAccess.statusCode).toBe(401);
	});
});
