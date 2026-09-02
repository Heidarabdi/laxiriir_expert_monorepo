import { describe, expect, it } from "vitest";

import {
	conversationResponseSchema,
	supportCaseResponseSchema,
	workspacePreferencesResponseSchema,
} from "../src/workspace";

describe("workspace contracts", () => {
	it("validates persisted workspace responses", () => {
		const createdAt = "2030-01-01T08:00:00.000Z";
		expect(
			conversationResponseSchema.safeParse({
				conversation: {
					bookingId: "booking-1",
					bookingStartsAt: createdAt,
					bookingStatus: "confirmed",
					counterpart: { avatarUrl: null, displayName: "Amina", id: "user-2" },
					lastMessage: null,
					unreadCount: 0,
				},
				messages: [],
			}).success,
		).toBe(true);
		expect(
			workspacePreferencesResponseSchema.safeParse({
				preferences: {
					emailBookingUpdates: true,
					inAppBookingUpdates: true,
					timezone: "UTC",
				},
			}).success,
		).toBe(true);
		expect(
			supportCaseResponseSchema.safeParse({
				case: {
					assignedAdminUserId: null,
					bookingId: null,
					createdAt,
					description: "A sufficiently detailed support case description.",
					id: "case-1",
					priority: "normal",
					requester: { displayName: "Amina", email: "amina@example.com", id: "user-1" },
					status: "open",
					subject: "Booking help",
					updatedAt: createdAt,
				},
			}).success,
		).toBe(true);
	});
});
