import { createPlatformConsultationClient } from "@repo/platform/consultations";
import { describe, expect, it, vi } from "vitest";

describe("platform consultation client", () => {
	it("requests the persisted expert directory from the configured API", async () => {
		const fetch = vi.fn().mockResolvedValue({ experts: [] });
		const client = createPlatformConsultationClient({
			apiBaseUrl: "http://localhost:8080/",
			fetch,
		});

		await client.listExperts();

		expect(fetch).toHaveBeenCalledWith(
			"http://localhost:8080/api/v1/experts",
			expect.objectContaining({ credentials: "include" }),
		);
	});

	it("creates an authenticated booking for the selected availability slot", async () => {
		const fetch = vi.fn().mockResolvedValue({ booking: {} });
		const client = createPlatformConsultationClient({
			apiBaseUrl: "http://localhost:8080",
			fetch,
		});

		await client.createBooking({ availabilitySlotId: 42 });

		expect(fetch).toHaveBeenCalledWith(
			"http://localhost:8080/api/v1/client/bookings",
			{
				body: { availabilitySlotId: 42 },
				credentials: "include",
				method: "POST",
			},
		);
	});
});
