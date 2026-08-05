import { asc, desc, eq } from "drizzle-orm";
import { afterEach, describe, expect, it } from "vitest";

import { ConsultationService } from "../src/consultations/service.js";
import { availabilitySlots } from "../src/db/consultation-schema.js";
import { user } from "../src/db/auth-schema.js";
import { createTestApplication } from "./application.js";

const cleanupTasks: Array<() => Promise<void>> = [];

afterEach(async () => {
	await Promise.all(cleanupTasks.splice(0).map((cleanup) => cleanup()));
});

async function registerVerifiedClient(
	application: Awaited<ReturnType<typeof createTestApplication>>,
	email: string,
) {
	await application.server.inject({
		method: "POST",
		payload: {
			email,
			name: "Booking Client",
			password: "correct-horse-battery-staple",
			role: "client",
		},
		url: "/api/auth/sign-up/email",
	});
	await application.database
		.update(user)
		.set({ emailVerified: true })
		.where(eq(user.email, email));
	const signIn = await application.server.inject({
		method: "POST",
		payload: { email, password: "correct-horse-battery-staple" },
		url: "/api/auth/sign-in/email",
	});
	return signIn.cookies
		.map((item) => `${item.name}=${item.value}`)
		.join("; ");
}

describe("client bookings", () => {
	it("creates, lists, and prevents duplicate bookings", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		const registration = await application.server.inject({
			method: "POST",
			payload: {
				email: "booking-client@example.com",
				name: "Booking Client",
				password: "correct-horse-battery-staple",
				role: "client",
			},
			url: "/api/auth/sign-up/email",
		});
		expect(registration.statusCode).toBe(200);
		await application.database
			.update(user)
			.set({ emailVerified: true })
			.where(eq(user.email, "booking-client@example.com"));
		const signIn = await application.server.inject({
			method: "POST",
			payload: {
				email: "booking-client@example.com",
				password: "correct-horse-battery-staple",
			},
			url: "/api/auth/sign-in/email",
		});
		const cookie = signIn.cookies
			.map((item) => `${item.name}=${item.value}`)
			.join("; ");

		const consultations = new ConsultationService(
			application.database as never,
		);
		await consultations.seedDemoData();
		const [slot] = await application.database
			.select()
			.from(availabilitySlots)
			.limit(1);

		const created = await application.server.inject({
			headers: { cookie },
			method: "POST",
			payload: { availabilitySlotId: slot.id },
			url: "/api/v1/client/bookings",
		});
		expect(created.statusCode).toBe(201);
		expect(created.json()).toMatchObject({
			booking: {
				availabilitySlotId: slot.id,
				expert: { id: slot.expertId },
				status: "confirmed",
			},
		});

		const duplicate = await application.server.inject({
			headers: { cookie },
			method: "POST",
			payload: { availabilitySlotId: slot.id },
			url: "/api/v1/client/bookings",
		});
		expect(duplicate.statusCode).toBe(409);

		const listed = await application.server.inject({
			headers: { cookie },
			method: "GET",
			url: "/api/v1/client/bookings",
		});
		expect(listed.statusCode).toBe(200);
		expect(listed.json().bookings).toHaveLength(1);
	});

	it("lets the owning client cancel an upcoming booking and releases its slot", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		const registration = await application.server.inject({
			method: "POST",
			payload: {
				email: "cancelling-client@example.com",
				name: "Cancelling Client",
				password: "correct-horse-battery-staple",
				role: "client",
			},
			url: "/api/auth/sign-up/email",
		});
		expect(registration.statusCode).toBe(200);
		await application.database
			.update(user)
			.set({ emailVerified: true })
			.where(eq(user.email, "cancelling-client@example.com"));
		const signIn = await application.server.inject({
			method: "POST",
			payload: {
				email: "cancelling-client@example.com",
				password: "correct-horse-battery-staple",
			},
			url: "/api/auth/sign-in/email",
		});
		const cookie = signIn.cookies
			.map((item) => `${item.name}=${item.value}`)
			.join("; ");

		const consultations = new ConsultationService(
			application.database as never,
		);
		await consultations.seedDemoData();
		const [nearSlot] = await application.database
			.select()
			.from(availabilitySlots)
			.orderBy(asc(availabilitySlots.startsAt))
			.limit(1);
		const nearBooking = await application.server.inject({
			headers: { cookie },
			method: "POST",
			payload: { availabilitySlotId: nearSlot.id },
			url: "/api/v1/client/bookings",
		});
		const lateCancellation = await application.server.inject({
			headers: { cookie },
			method: "DELETE",
			url: `/api/v1/client/bookings/${nearBooking.json().booking.id}`,
		});
		expect(lateCancellation.statusCode).toBe(409);

		const [slot] = await application.database
			.select()
			.from(availabilitySlots)
			.orderBy(desc(availabilitySlots.startsAt))
			.limit(1);
		const created = await application.server.inject({
			headers: { cookie },
			method: "POST",
			payload: { availabilitySlotId: slot.id },
			url: "/api/v1/client/bookings",
		});
		const bookingId = created.json().booking.id as string;
		const otherClientCookie = await registerVerifiedClient(
			application,
			"other-client@example.com",
		);
		const forbidden = await application.server.inject({
			headers: { cookie: otherClientCookie },
			method: "DELETE",
			url: `/api/v1/client/bookings/${bookingId}`,
		});
		expect(forbidden.statusCode).toBe(404);

		const cancelled = await application.server.inject({
			headers: { cookie },
			method: "DELETE",
			url: `/api/v1/client/bookings/${bookingId}`,
		});
		expect(cancelled.statusCode).toBe(200);
		expect(cancelled.json()).toMatchObject({
			booking: { id: bookingId, status: "cancelled" },
		});

		const availability = await application.server.inject({
			method: "GET",
			url: `/api/v1/experts/${slot.expertId}/availability`,
		});
		expect(availability.json().slots).toContainEqual(
			expect.objectContaining({ id: slot.id }),
		);
		const rebooked = await application.server.inject({
			headers: { cookie: otherClientCookie },
			method: "POST",
			payload: { availabilitySlotId: slot.id },
			url: "/api/v1/client/bookings",
		});
		expect(rebooked.statusCode).toBe(201);

		const repeated = await application.server.inject({
			headers: { cookie },
			method: "DELETE",
			url: `/api/v1/client/bookings/${bookingId}`,
		});
		expect(repeated.statusCode).toBe(409);
	});

	it("lets the owning client reschedule to another open slot with the same expert", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		await application.server.inject({
			method: "POST",
			payload: {
				email: "rescheduling-client@example.com",
				name: "Rescheduling Client",
				password: "correct-horse-battery-staple",
				role: "client",
			},
			url: "/api/auth/sign-up/email",
		});
		await application.database
			.update(user)
			.set({ emailVerified: true })
			.where(eq(user.email, "rescheduling-client@example.com"));
		const signIn = await application.server.inject({
			method: "POST",
			payload: {
				email: "rescheduling-client@example.com",
				password: "correct-horse-battery-staple",
			},
			url: "/api/auth/sign-in/email",
		});
		const cookie = signIn.cookies
			.map((item) => `${item.name}=${item.value}`)
			.join("; ");

		const consultations = new ConsultationService(
			application.database as never,
		);
		await consultations.seedDemoData();
		const expertSlots = await application.database
			.select()
			.from(availabilitySlots)
			.where(eq(availabilitySlots.expertId, "marcus-thorne"))
			.orderBy(asc(availabilitySlots.startsAt));
		const originalSlot = expertSlots[1];
		const targetSlot = expertSlots[2];
		const [otherExpertSlot] = await application.database
			.select()
			.from(availabilitySlots)
			.where(eq(availabilitySlots.expertId, "sarah-jenkins"))
			.orderBy(desc(availabilitySlots.startsAt))
			.limit(1);
		const created = await application.server.inject({
			headers: { cookie },
			method: "POST",
			payload: { availabilitySlotId: originalSlot.id },
			url: "/api/v1/client/bookings",
		});
		const bookingId = created.json().booking.id as string;
		const wrongExpert = await application.server.inject({
			headers: { cookie },
			method: "PATCH",
			payload: { availabilitySlotId: otherExpertSlot.id },
			url: `/api/v1/client/bookings/${bookingId}`,
		});
		expect(wrongExpert.statusCode).toBe(409);

		const rescheduled = await application.server.inject({
			headers: { cookie },
			method: "PATCH",
			payload: { availabilitySlotId: targetSlot.id },
			url: `/api/v1/client/bookings/${bookingId}`,
		});
		expect(rescheduled.statusCode).toBe(200);
		expect(rescheduled.json()).toMatchObject({
			booking: {
				availabilitySlotId: targetSlot.id,
				endsAt: targetSlot.endsAt.toISOString(),
				id: bookingId,
				startsAt: targetSlot.startsAt.toISOString(),
				status: "confirmed",
			},
		});

		const availability = await application.server.inject({
			method: "GET",
			url: "/api/v1/experts/marcus-thorne/availability",
		});
		expect(availability.json().slots).toContainEqual(
			expect.objectContaining({ id: originalSlot.id }),
		);
		expect(availability.json().slots).not.toContainEqual(
			expect.objectContaining({ id: targetSlot.id }),
		);
	});

	it("allows rescheduling to a slot exactly 24 hours ahead", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		const consultations = new ConsultationService(
			application.database as never,
		);
		const now = new Date("2030-01-01T10:00:00.000Z");
		await consultations.seedDemoData(now);
		const expertSlots = await application.database
			.select()
			.from(availabilitySlots)
			.where(eq(availabilitySlots.expertId, "marcus-thorne"))
			.orderBy(asc(availabilitySlots.startsAt));
		const replacement = expertSlots[0];
		const original = expertSlots[1];
		const booking = await consultations.createBooking(
			"boundary-client",
			original.id,
			now,
		);

		const rescheduled = await consultations.rescheduleBooking(
			"boundary-client",
			booking.id,
			replacement.id,
			now,
		);

		expect(rescheduled.availabilitySlotId).toBe(replacement.id);
		expect(rescheduled.startsAt).toBe("2030-01-02T10:00:00.000Z");
	});
});
