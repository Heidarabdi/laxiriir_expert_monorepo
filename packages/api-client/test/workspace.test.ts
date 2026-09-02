import { describe, expect, it, vi } from "vitest";

import { createWorkspaceClient } from "../src/workspace";

describe("workspace API client", () => {
	it("targets the message, settings, and support routes", async () => {
		const fetch = vi.fn().mockResolvedValue({});
		const client = createWorkspaceClient({
			apiBaseUrl: "http://localhost:8081",
			fetch,
		});

		await client.sendMessage("booking/one", { body: "Hello" });
		await client.updatePreferences({
			emailBookingUpdates: true,
			inAppBookingUpdates: true,
			timezone: "Africa/Nairobi",
		});
		await client.createSupportCase({
			description: "I need help with an existing consultation booking.",
			priority: "normal",
			subject: "Booking help",
		});
		await client.updateAdminSupportCase("case/one", {
			assignToMe: true,
			status: "resolved",
		});

		expect(fetch).toHaveBeenNthCalledWith(
			1,
			"http://localhost:8081/api/v1/messages/booking%2Fone",
			{ body: { body: "Hello" }, credentials: "include", method: "POST" },
		);
		expect(fetch).toHaveBeenNthCalledWith(
			2,
			"http://localhost:8081/api/v1/settings",
			expect.objectContaining({ method: "PATCH" }),
		);
		expect(fetch).toHaveBeenNthCalledWith(
			3,
			"http://localhost:8081/api/v1/support",
			expect.objectContaining({ method: "POST" }),
		);
		expect(fetch).toHaveBeenNthCalledWith(
			4,
			"http://localhost:8081/api/v1/admin/support/case%2Fone",
			expect.objectContaining({ method: "PATCH" }),
		);
	});
});
