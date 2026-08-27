import { describe, expect, it, vi } from "vitest";

import { createConsultationClient } from "../src/consultations";

describe("consultation API client", () => {
	it("requests experts and creates bookings against the configured API", async () => {
		const fetch = vi
			.fn()
			.mockResolvedValueOnce({ experts: [] })
			.mockResolvedValueOnce({ booking: {} });
		const client = createConsultationClient({
			apiBaseUrl: "http://localhost:8081/",
			fetch,
		});

		await client.listExperts();
		await client.createBooking({ availabilitySlotId: 42 });

		expect(fetch).toHaveBeenNthCalledWith(
			1,
			"http://localhost:8081/api/v1/experts",
			expect.objectContaining({ credentials: "include" }),
		);
		expect(fetch).toHaveBeenNthCalledWith(
			2,
			"http://localhost:8081/api/v1/client/bookings",
			{
				body: { availabilitySlotId: 42 },
				credentials: "include",
				method: "POST",
			},
		);
	});

	it("manages expert availability and client booking changes", async () => {
		const fetch = vi.fn().mockResolvedValue({});
		const client = createConsultationClient({
			apiBaseUrl: "http://localhost:8081",
			fetch,
		});
		const input = {
			endsAt: "2030-01-01T11:00:00.000Z",
			startsAt: "2030-01-01T10:00:00.000Z",
		};

		await client.createAvailability(input);
		await client.updateAvailability(7, input);
		await client.deleteAvailability(7);
		await client.cancelBooking("booking-1");
		await client.rescheduleBooking("booking-1", {
			availabilitySlotId: 19,
		});

		expect(fetch).toHaveBeenNthCalledWith(
			1,
			"http://localhost:8081/api/v1/expert/availability",
			{ body: input, credentials: "include", method: "POST" },
		);
		expect(fetch).toHaveBeenNthCalledWith(
			2,
			"http://localhost:8081/api/v1/expert/availability/7",
			{ body: input, credentials: "include", method: "PATCH" },
		);
		expect(fetch).toHaveBeenNthCalledWith(
			3,
			"http://localhost:8081/api/v1/expert/availability/7",
			{ credentials: "include", method: "DELETE" },
		);
		expect(fetch).toHaveBeenNthCalledWith(
			4,
			"http://localhost:8081/api/v1/client/bookings/booking-1",
			{ credentials: "include", method: "DELETE" },
		);
		expect(fetch).toHaveBeenNthCalledWith(
			5,
			"http://localhost:8081/api/v1/client/bookings/booking-1",
			{
				body: { availabilitySlotId: 19 },
				credentials: "include",
				method: "PATCH",
			},
		);
	});
});
