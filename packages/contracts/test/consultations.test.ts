import { describe, expect, it } from "vitest";

import {
	availabilityInputSchema,
	bookingResponseSchema,
} from "../src/consultations";

describe("consultation contracts", () => {
	it("accepts the booking response returned to clients", () => {
		const result = bookingResponseSchema.safeParse({
			booking: {
				availabilitySlotId: 42,
				clientUserId: "client-1",
				createdAt: "2030-01-01T09:00:00.000Z",
				endsAt: "2030-01-01T11:00:00.000Z",
				expert: {
					avatarUrl: "https://example.com/avatar.png",
					bio: "Career guidance",
					category: "Career",
					createdAt: "2030-01-01T08:00:00.000Z",
					displayName: "Amina Hassan",
					hourlyRateCents: 3500,
					id: "expert-1",
					title: "Career Coach",
					updatedAt: "2030-01-01T08:00:00.000Z",
				},
				id: "booking-1",
				startsAt: "2030-01-01T10:00:00.000Z",
				status: "confirmed",
			},
		});

		expect(result.success).toBe(true);
	});

	it("rejects availability whose end is not after its start", () => {
		const result = availabilityInputSchema.safeParse({
			endsAt: "2030-01-01T10:00:00.000Z",
			startsAt: "2030-01-01T11:00:00.000Z",
		});

		expect(result.success).toBe(false);
	});
});
