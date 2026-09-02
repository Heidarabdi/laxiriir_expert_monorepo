import { describe, expect, it, vi } from "vitest";

import { createEngagementClient } from "../src/engagements";

describe("engagement API client", () => {
	it("manages saved experts", async () => {
		const fetch = vi.fn().mockResolvedValue({});
		const client = createEngagementClient({
			apiBaseUrl: "http://localhost:8081",
			fetch,
		});

		await client.listSavedExperts();
		await client.saveExpert("expert/one");
		await client.removeSavedExpert("expert/one");

		expect(fetch).toHaveBeenNthCalledWith(
			1,
			"http://localhost:8081/api/v1/client/saved-experts",
			{ credentials: "include" },
		);
		expect(fetch).toHaveBeenNthCalledWith(
			2,
			"http://localhost:8081/api/v1/client/saved-experts/expert%2Fone",
			{ credentials: "include", method: "PUT" },
		);
		expect(fetch).toHaveBeenNthCalledWith(
			3,
			"http://localhost:8081/api/v1/client/saved-experts/expert%2Fone",
			{ credentials: "include", method: "DELETE" },
		);
	});

	it("lists and marks notifications as read", async () => {
		const fetch = vi.fn().mockResolvedValue({});
		const client = createEngagementClient({
			apiBaseUrl: "http://localhost:8081",
			fetch,
		});

		await client.listNotifications();
		await client.markNotificationRead("notice/one");
		await client.markAllNotificationsRead();

		expect(fetch).toHaveBeenNthCalledWith(
			1,
			"http://localhost:8081/api/v1/notifications",
			{ credentials: "include" },
		);
		expect(fetch).toHaveBeenNthCalledWith(
			2,
			"http://localhost:8081/api/v1/notifications/notice%2Fone",
			{ credentials: "include", method: "PATCH" },
		);
		expect(fetch).toHaveBeenNthCalledWith(
			3,
			"http://localhost:8081/api/v1/notifications/read-all",
			{ credentials: "include", method: "PATCH" },
		);
	});
});
