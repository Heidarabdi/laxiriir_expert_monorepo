import { describe, expect, it, vi } from "vitest";

import { createAuthClient } from "../src/auth";

describe("authentication API client", () => {
	it("gets the current user and performs encoded expert moderation actions", async () => {
		const fetch = vi.fn().mockResolvedValue({});
		const client = createAuthClient({
			apiBaseUrl: "https://api.example.com/",
			fetch,
			headers: { "x-client": "web" },
		});

		await client.getCurrentUser();
		await client.approveExpert("expert/one");

		expect(fetch).toHaveBeenNthCalledWith(
			1,
			"https://api.example.com/api/v1/me",
			{
				credentials: "include",
				headers: { "x-client": "web" },
			},
		);
		expect(fetch).toHaveBeenNthCalledWith(
			2,
			"https://api.example.com/api/v1/admin/experts/expert%2Fone/approve",
			{
				credentials: "include",
				headers: { "x-client": "web" },
				method: "PATCH",
			},
		);
	});
});
