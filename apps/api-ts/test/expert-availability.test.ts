import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it } from "vitest";

import { user } from "../src/db/auth-schema.js";
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

describe("expert availability management", () => {
	it("lets an approved expert create a slot that clients can see", async () => {
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
			email: "expert@example.com",
			name: "Available Expert",
			role: "expert",
		});
		await approveExpert(application, admin.cookie, expert.userId);

		const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);
		const created = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "POST",
			payload: {
				endsAt: endsAt.toISOString(),
				startsAt: startsAt.toISOString(),
			},
			url: "/api/v1/expert/availability",
		});

		expect(created.statusCode).toBe(201);
		expect(created.json()).toMatchObject({
			slot: {
				booked: false,
				expertId: expert.userId,
			},
		});

		const publicAvailability = await application.server.inject({
			method: "GET",
			url: `/api/v1/experts/${expert.userId}/availability`,
		});
		expect(publicAvailability.statusCode).toBe(200);
		expect(publicAvailability.json().slots).toEqual([
			created.json().slot,
		]);
	});

	it("rejects overlapping slots when creating or editing availability", async () => {
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
			email: "conflict-expert@example.com",
			name: "Conflict Expert",
			role: "expert",
		});
		await approveExpert(application, admin.cookie, expert.userId);

		const firstStart = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const firstEnd = new Date(firstStart.getTime() + 60 * 60 * 1000);
		await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "POST",
			payload: {
				endsAt: firstEnd.toISOString(),
				startsAt: firstStart.toISOString(),
			},
			url: "/api/v1/expert/availability",
		});

		const overlappingCreate = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "POST",
			payload: {
				endsAt: new Date(firstEnd.getTime() + 30 * 60 * 1000).toISOString(),
				startsAt: new Date(
					firstStart.getTime() + 30 * 60 * 1000,
				).toISOString(),
			},
			url: "/api/v1/expert/availability",
		});
		expect(overlappingCreate.statusCode).toBe(409);

		const secondStart = new Date(firstEnd.getTime() + 60 * 60 * 1000);
		const secondEnd = new Date(secondStart.getTime() + 60 * 60 * 1000);
		const second = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "POST",
			payload: {
				endsAt: secondEnd.toISOString(),
				startsAt: secondStart.toISOString(),
			},
			url: "/api/v1/expert/availability",
		});
		const overlappingUpdate = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "PATCH",
			payload: {
				endsAt: firstEnd.toISOString(),
				startsAt: firstStart.toISOString(),
			},
			url: `/api/v1/expert/availability/${second.json().slot.id}`,
		});
		expect(overlappingUpdate.statusCode).toBe(409);
	});

	it("serializes concurrent overlapping slot creation", async () => {
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
			email: "concurrent-expert@example.com",
			name: "Concurrent Expert",
			role: "expert",
		});
		await approveExpert(application, admin.cookie, expert.userId);

		const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const createSlot = (offsetMinutes: number) =>
			application.server.inject({
				headers: { cookie: expert.cookie },
				method: "POST",
				payload: {
					endsAt: new Date(
						startsAt.getTime() + (offsetMinutes + 60) * 60 * 1000,
					).toISOString(),
					startsAt: new Date(
						startsAt.getTime() + offsetMinutes * 60 * 1000,
					).toISOString(),
				},
				url: "/api/v1/expert/availability",
			});

		const responses = await Promise.all([createSlot(0), createSlot(30)]);
		expect(responses.map(({ statusCode }) => statusCode).sort()).toEqual([
			201, 409,
		]);
	});

	it("prevents clients and other experts from changing an expert slot", async () => {
		const application = await createTestApplication({
			AUTH_BOOTSTRAP_ADMIN_EMAILS: "admin@example.com",
		});
		cleanupTasks.push(() => application.close());
		const admin = await registerVerifiedUser(application, {
			email: "admin@example.com",
			name: "Platform Admin",
			role: "client",
		});
		const owner = await registerVerifiedUser(application, {
			email: "owner@example.com",
			name: "Slot Owner",
			role: "expert",
		});
		const otherExpert = await registerVerifiedUser(application, {
			email: "other@example.com",
			name: "Other Expert",
			role: "expert",
		});
		const client = await registerVerifiedUser(application, {
			email: "client@example.com",
			name: "Client User",
			role: "client",
		});
		await approveExpert(application, admin.cookie, owner.userId);
		await approveExpert(application, admin.cookie, otherExpert.userId);

		const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);
		const created = await application.server.inject({
			headers: { cookie: owner.cookie },
			method: "POST",
			payload: {
				endsAt: endsAt.toISOString(),
				startsAt: startsAt.toISOString(),
			},
			url: "/api/v1/expert/availability",
		});
		const slotId = created.json().slot.id as number;

		const clientCreate = await application.server.inject({
			headers: { cookie: client.cookie },
			method: "POST",
			payload: {
				endsAt: endsAt.toISOString(),
				startsAt: startsAt.toISOString(),
			},
			url: "/api/v1/expert/availability",
		});
		expect(clientCreate.statusCode).toBe(403);

		const otherUpdate = await application.server.inject({
			headers: { cookie: otherExpert.cookie },
			method: "PATCH",
			payload: {
				endsAt: endsAt.toISOString(),
				startsAt: startsAt.toISOString(),
			},
			url: `/api/v1/expert/availability/${slotId}`,
		});
		expect(otherUpdate.statusCode).toBe(404);

		const otherDelete = await application.server.inject({
			headers: { cookie: otherExpert.cookie },
			method: "DELETE",
			url: `/api/v1/expert/availability/${slotId}`,
		});
		expect(otherDelete.statusCode).toBe(404);
	});

	it("lets an approved expert edit and delete an unbooked slot", async () => {
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
			email: "editing-expert@example.com",
			name: "Editing Expert",
			role: "expert",
		});
		await approveExpert(application, admin.cookie, expert.userId);

		const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);
		const created = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "POST",
			payload: {
				endsAt: endsAt.toISOString(),
				startsAt: startsAt.toISOString(),
			},
			url: "/api/v1/expert/availability",
		});
		const slotId = created.json().slot.id as number;
		const updatedStart = new Date(startsAt.getTime() + 2 * 60 * 60 * 1000);
		const updatedEnd = new Date(updatedStart.getTime() + 90 * 60 * 1000);

		const updated = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "PATCH",
			payload: {
				endsAt: updatedEnd.toISOString(),
				startsAt: updatedStart.toISOString(),
			},
			url: `/api/v1/expert/availability/${slotId}`,
		});
		expect(updated.statusCode).toBe(200);
		expect(updated.json().slot).toMatchObject({
			endsAt: updatedEnd.toISOString(),
			startsAt: updatedStart.toISOString(),
		});

		const deleted = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "DELETE",
			url: `/api/v1/expert/availability/${slotId}`,
		});
		expect(deleted.statusCode).toBe(204);

		const remaining = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "GET",
			url: "/api/v1/expert/availability",
		});
		expect(remaining.json().slots).toEqual([]);
	});

	it("prevents changing or deleting a booked slot", async () => {
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
			email: "booked-expert@example.com",
			name: "Booked Expert",
			role: "expert",
		});
		const client = await registerVerifiedUser(application, {
			email: "booking-client@example.com",
			name: "Booking Client",
			role: "client",
		});
		await approveExpert(application, admin.cookie, expert.userId);

		const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);
		const created = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "POST",
			payload: {
				endsAt: endsAt.toISOString(),
				startsAt: startsAt.toISOString(),
			},
			url: "/api/v1/expert/availability",
		});
		const slotId = created.json().slot.id as number;
		const booking = await application.server.inject({
			headers: { cookie: client.cookie },
			method: "POST",
			payload: { availabilitySlotId: slotId },
			url: "/api/v1/client/bookings",
		});
		expect(booking.statusCode).toBe(201);

		const updated = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "PATCH",
			payload: {
				endsAt: new Date(endsAt.getTime() + 60 * 60 * 1000).toISOString(),
				startsAt: new Date(startsAt.getTime() + 60 * 60 * 1000).toISOString(),
			},
			url: `/api/v1/expert/availability/${slotId}`,
		});
		const deleted = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "DELETE",
			url: `/api/v1/expert/availability/${slotId}`,
		});
		expect(updated.statusCode).toBe(409);
		expect(deleted.statusCode).toBe(409);
	});

	it("hides and blocks availability after an expert is suspended", async () => {
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
			email: "suspended-expert@example.com",
			name: "Suspended Expert",
			role: "expert",
		});
		const client = await registerVerifiedUser(application, {
			email: "suspension-client@example.com",
			name: "Suspension Client",
			role: "client",
		});
		await approveExpert(application, admin.cookie, expert.userId);

		const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);
		const created = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "POST",
			payload: {
				endsAt: endsAt.toISOString(),
				startsAt: startsAt.toISOString(),
			},
			url: "/api/v1/expert/availability",
		});
		const slotId = created.json().slot.id as number;

		const suspended = await application.server.inject({
			headers: { cookie: admin.cookie },
			method: "PATCH",
			url: `/api/v1/admin/experts/${expert.userId}/suspend`,
		});
		expect(suspended.statusCode).toBe(200);

		const experts = await application.server.inject({
			method: "GET",
			url: "/api/v1/experts",
		});
		const availability = await application.server.inject({
			method: "GET",
			url: `/api/v1/experts/${expert.userId}/availability`,
		});
		const booking = await application.server.inject({
			headers: { cookie: client.cookie },
			method: "POST",
			payload: { availabilitySlotId: slotId },
			url: "/api/v1/client/bookings",
		});

		expect(experts.json().experts).not.toContainEqual(
			expect.objectContaining({ id: expert.userId }),
		);
		expect(availability.json().slots).toEqual([]);
		expect(booking.statusCode).toBe(409);
	});
});
