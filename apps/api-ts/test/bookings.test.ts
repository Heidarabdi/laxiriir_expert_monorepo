import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it } from "vitest";

import { ConsultationService } from "../src/consultations/service.js";
import { availabilitySlots } from "../src/db/consultation-schema.js";
import { user } from "../src/db/auth-schema.js";
import { createTestApplication } from "./application.js";

const cleanupTasks: Array<() => Promise<void>> = [];

afterEach(async () => {
	await Promise.all(cleanupTasks.splice(0).map((cleanup) => cleanup()));
});

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
});
