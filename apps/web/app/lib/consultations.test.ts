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

	it("manages the signed-in expert availability through the expert API", async () => {
		const fetch = vi.fn().mockResolvedValue({ slot: {} });
		const client = createPlatformConsultationClient({
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

		expect(fetch).toHaveBeenNthCalledWith(
			1,
			"http://localhost:8081/api/v1/expert/availability",
			{
				body: input,
				credentials: "include",
				method: "POST",
			},
		);
		expect(fetch).toHaveBeenNthCalledWith(
			2,
			"http://localhost:8081/api/v1/expert/availability/7",
			{
				body: input,
				credentials: "include",
				method: "PATCH",
			},
		);
		expect(fetch).toHaveBeenNthCalledWith(
			3,
			"http://localhost:8081/api/v1/expert/availability/7",
			{
				credentials: "include",
				method: "DELETE",
			},
		);
	});

	it("cancels and reschedules an authenticated client booking", async () => {
		const fetch = vi.fn().mockResolvedValue({ booking: {} });
		const client = createPlatformConsultationClient({
			apiBaseUrl: "http://localhost:8081",
			fetch,
		});

		await client.cancelBooking("booking-1");
		await client.rescheduleBooking("booking-1", {
			availabilitySlotId: 19,
		});

		expect(fetch).toHaveBeenNthCalledWith(
			1,
			"http://localhost:8081/api/v1/client/bookings/booking-1",
			{
				credentials: "include",
				method: "DELETE",
			},
		);
		expect(fetch).toHaveBeenNthCalledWith(
			2,
			"http://localhost:8081/api/v1/client/bookings/booking-1",
			{
				body: { availabilitySlotId: 19 },
				credentials: "include",
				method: "PATCH",
			},
		);
	});
});
