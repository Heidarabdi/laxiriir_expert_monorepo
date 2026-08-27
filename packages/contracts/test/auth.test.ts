import { describe, expect, it } from "vitest";

import { currentUserSchema, signUpInputSchema } from "../src/auth";

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
});
