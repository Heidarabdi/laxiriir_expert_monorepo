import { desc, eq } from "drizzle-orm";
import { afterEach, describe, expect, it } from "vitest";

import { ConsultationService } from "../src/consultations/service.js";
import { user } from "../src/db/auth-schema.js";
import { availabilitySlots, experts } from "../src/db/consultation-schema.js";
import { createTestApplication } from "./application.js";

const cleanupTasks: Array<() => Promise<void>> = [];
const password = "correct-horse-battery-staple";

afterEach(async () => {
	await Promise.all(cleanupTasks.splice(0).map((cleanup) => cleanup()));
});

async function registerVerifiedClient(
	application: Awaited<ReturnType<typeof createTestApplication>>,
	email: string,
) {
	const registration = await application.server.inject({
		method: "POST",
		payload: { email, name: "Engagement Client", password, role: "client" },
		url: "/api/auth/sign-up/email",
	});
	expect(registration.statusCode).toBe(200);
	await application.database
		.update(user)
		.set({ emailVerified: true })
		.where(eq(user.email, email));
	const signIn = await application.server.inject({
		method: "POST",
		payload: { email, password },
		url: "/api/auth/sign-in/email",
	});
	return signIn.cookies.map((item) => `${item.name}=${item.value}`).join("; ");
}

async function registerApprovedExpert(
	application: Awaited<ReturnType<typeof createTestApplication>>,
	email: string,
) {
	const registration = await application.server.inject({
		method: "POST",
		payload: { email, name: "Notification Expert", password, role: "expert" },
		url: "/api/auth/sign-up/email",
	});
	expect(registration.statusCode).toBe(200);
	const [identity] = await application.database
		.update(user)
		.set({ emailVerified: true, expertStatus: "approved" })
		.where(eq(user.email, email))
		.returning({ id: user.id });
	const now = new Date();
	await application.database.insert(experts).values({
		active: true,
		avatarUrl: "https://example.com/expert.png",
		bio: "An approved expert profile used to test booking notifications.",
		category: "Operations",
		createdAt: now,
		displayName: "Notification Expert",
		hourlyRateCents: 10_000,
		id: identity.id,
		title: "Operations Expert",
		updatedAt: now,
	});
	const signIn = await application.server.inject({
		method: "POST",
		payload: { email, password },
		url: "/api/auth/sign-in/email",
	});
	return {
		cookie: signIn.cookies
			.map((item) => `${item.name}=${item.value}`)
			.join("; "),
		id: identity.id,
	};
}

describe("engagement routes", () => {
	it("persists, lists, and removes a client's saved experts", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		const cookie = await registerVerifiedClient(
			application,
			"saved-client@example.com",
		);
		const consultations = new ConsultationService(
			application.database as never,
		);
		await consultations.seedDemoData();

		const saved = await application.server.inject({
			headers: { cookie },
			method: "PUT",
			url: "/api/v1/client/saved-experts/marcus-thorne",
		});
		expect(saved.statusCode).toBe(200);
		expect(saved.json()).toMatchObject({
			savedExpert: { expert: { id: "marcus-thorne" } },
		});

		const duplicate = await application.server.inject({
			headers: { cookie },
			method: "PUT",
			url: "/api/v1/client/saved-experts/marcus-thorne",
		});
		expect(duplicate.statusCode).toBe(200);

		const listed = await application.server.inject({
			headers: { cookie },
			method: "GET",
			url: "/api/v1/client/saved-experts",
		});
		expect(listed.statusCode).toBe(200);
		expect(listed.json().savedExperts).toHaveLength(1);

		const removed = await application.server.inject({
			headers: { cookie },
			method: "DELETE",
			url: "/api/v1/client/saved-experts/marcus-thorne",
		});
		expect(removed.statusCode).toBe(204);

		const empty = await application.server.inject({
			headers: { cookie },
			method: "GET",
			url: "/api/v1/client/saved-experts",
		});
		expect(empty.json().savedExperts).toEqual([]);
	});

	it("creates a booking notification and protects its read state", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		const cookie = await registerVerifiedClient(
			application,
			"notification-client@example.com",
		);
		const otherCookie = await registerVerifiedClient(
			application,
			"other-notification-client@example.com",
		);
		const consultations = new ConsultationService(
			application.database as never,
		);
		await consultations.seedDemoData();
		const [slot] = await application.database
			.select()
			.from(availabilitySlots)
			.orderBy(desc(availabilitySlots.startsAt))
			.limit(1);

		const booking = await application.server.inject({
			headers: { cookie },
			method: "POST",
			payload: { availabilitySlotId: slot.id },
			url: "/api/v1/client/bookings",
		});
		expect(booking.statusCode).toBe(201);

		const listed = await application.server.inject({
			headers: { cookie },
			method: "GET",
			url: "/api/v1/notifications",
		});
		expect(listed.statusCode).toBe(200);
		expect(listed.json()).toMatchObject({
			notifications: [
				{
					href: `/client/bookings/${booking.json().booking.id}`,
					readAt: null,
					type: "booking_confirmed",
				},
			],
			unreadCount: 1,
		});
		const notificationId = listed.json().notifications[0].id as string;

		const wrongOwner = await application.server.inject({
			headers: { cookie: otherCookie },
			method: "PATCH",
			url: `/api/v1/notifications/${notificationId}`,
		});
		expect(wrongOwner.statusCode).toBe(404);

		const marked = await application.server.inject({
			headers: { cookie },
			method: "PATCH",
			url: `/api/v1/notifications/${notificationId}`,
		});
		expect(marked.statusCode).toBe(200);
		expect(marked.json().notification.readAt).toEqual(expect.any(String));

		const relisted = await application.server.inject({
			headers: { cookie },
			method: "GET",
			url: "/api/v1/notifications",
		});
		expect(relisted.json().unreadCount).toBe(0);
	});

	it("requires an authenticated client for saved experts", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());

		const response = await application.server.inject({
			method: "GET",
			url: "/api/v1/client/saved-experts",
		});
		expect(response.statusCode).toBe(401);
	});

	it("notifies the expert when a client books their availability", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		const clientCookie = await registerVerifiedClient(
			application,
			"expert-notification-client@example.com",
		);
		const expert = await registerApprovedExpert(
			application,
			"notified-expert@example.com",
		);
		const consultations = new ConsultationService(
			application.database as never,
		);
		const now = new Date();
		const startsAt = new Date(now.getTime() + 72 * 60 * 60 * 1000);
		const slot = await consultations.createAvailability(
			expert.id,
			startsAt,
			new Date(startsAt.getTime() + 60 * 60 * 1000),
			now,
		);

		const booking = await application.server.inject({
			headers: { cookie: clientCookie },
			method: "POST",
			payload: { availabilitySlotId: slot.id },
			url: "/api/v1/client/bookings",
		});
		expect(booking.statusCode).toBe(201);

		const listed = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "GET",
			url: "/api/v1/notifications",
		});
		expect(listed.statusCode).toBe(200);
		expect(listed.json()).toMatchObject({
			notifications: [
				{
					href: "/expert/sessions",
					readAt: null,
					title: "New booking",
					type: "booking_confirmed",
				},
			],
			unreadCount: 1,
		});
	});
});
