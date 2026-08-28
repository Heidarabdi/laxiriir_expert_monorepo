import type { CurrentUserResponse } from "@repo/contracts/auth";
import { describe, expect, it } from "vitest";

import { getAuthRedirectPath, getRoleHomePath, userHasRole } from "./auth";

function user(
	overrides: Partial<CurrentUserResponse> = {},
): CurrentUserResponse {
	return {
		allowedAreas: ["client"],
		displayName: "Test User",
		email: "user@example.com",
		emailVerified: true,
		expertStatus: "not_applicable",
		primaryRole: "client",
		userId: "user-1",
		...overrides,
	};
}

describe("web role routing", () => {
	it("routes each verified role to its workspace", () => {
		expect(getRoleHomePath(user())).toBe("/client");
		expect(getRoleHomePath(user({ primaryRole: "admin" }))).toBe("/admin");
		expect(
			getRoleHomePath(
				user({ expertStatus: "approved", primaryRole: "expert" }),
			),
		).toBe("/expert");
		expect(
			getRoleHomePath(
				user({ expertStatus: "pending_review", primaryRole: "expert" }),
			),
		).toBe("/expert/pending");
	});

	it("sends unverified users to email verification", () => {
		expect(getAuthRedirectPath(user({ emailVerified: false }))).toBe(
			"/verify-email",
		);
	});

	it("checks role access without trusting the route", () => {
		expect(userHasRole(user(), ["client"])).toBe(true);
		expect(userHasRole(user(), ["admin", "expert"])).toBe(false);
	});
});
