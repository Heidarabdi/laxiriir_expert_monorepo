import { describe, expect, it } from "vitest";

import {
	accountProfileInputSchema,
	adminExpertListResponseSchema,
	currentUserSchema,
	signUpInputSchema,
} from "../src/auth";

describe("authentication contracts", () => {
	it("accepts the current-user response shared by the API and clients", () => {
		const result = currentUserSchema.safeParse({
			allowedAreas: ["expert_pending"],
			displayName: "Amina Hassan",
			email: "amina@example.com",
			emailVerified: true,
			expertStatus: "pending_review",
			primaryRole: "expert",
			userId: "expert-1",
		});

		expect(result.success).toBe(true);
	});

	it("does not allow public registration to create an admin", () => {
		const result = signUpInputSchema.safeParse({
			email: "admin@example.com",
			name: "Admin",
			password: "correct-horse-battery-staple",
			role: "admin",
		});

		expect(result.success).toBe(false);
	});

	it("accepts pending expert records in the admin moderation list", () => {
		const result = adminExpertListResponseSchema.safeParse({
			experts: [
				{
					createdAt: "2026-01-01T00:00:00.000Z",
					displayName: "Pending Expert",
					email: "expert@example.com",
					expertStatus: "pending_review",
					identityUserId: "expert-1",
					updatedAt: "2026-01-01T00:00:00.000Z",
				},
			],
		});

		expect(result.success).toBe(true);
	});

	it("validates account display-name updates", () => {
		expect(
			accountProfileInputSchema.safeParse({ displayName: "Amina Hassan" })
				.success,
		).toBe(true);
		expect(
			accountProfileInputSchema.safeParse({ displayName: " " }).success,
		).toBe(false);
	});
});
