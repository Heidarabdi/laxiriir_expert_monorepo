import { describe, expect, it } from "vitest";

import {
	notificationListResponseSchema,
	savedExpertListResponseSchema,
} from "../src/engagements";

const expert = {
	avatarUrl: "https://example.com/avatar.png",
	bio: "Career guidance for growing teams and experienced leaders.",
	category: "Career",
	createdAt: "2030-01-01T08:00:00.000Z",
	displayName: "Amina Hassan",
	hourlyRateCents: 3500,
	id: "expert-1",
	title: "Career Coach",
	updatedAt: "2030-01-01T08:00:00.000Z",
};

describe("engagement contracts", () => {
	it("accepts persisted saved experts", () => {
		expect(
			savedExpertListResponseSchema.safeParse({
				savedExperts: [{ expert, savedAt: "2030-01-02T08:00:00.000Z" }],
			}).success,
		).toBe(true);
	});

	it("accepts notification read state", () => {
		expect(
			notificationListResponseSchema.safeParse({
				notifications: [
					{
						createdAt: "2030-01-02T08:00:00.000Z",
						href: "/client/bookings/booking-1",
						id: "notification-1",
						message: "Your booking is confirmed.",
						readAt: null,
						title: "Booking confirmed",
						type: "booking_confirmed",
					},
				],
				unreadCount: 1,
			}).success,
		).toBe(true);
	});
});
