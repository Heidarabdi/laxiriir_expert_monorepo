import { afterEach, describe, expect, it } from "vitest";

import { ConsultationService } from "../src/consultations/service.js";
import type { AppDatabase } from "../src/db/postgres.js";
import { createTestApplication } from "./application.js";

const cleanupTasks: Array<() => Promise<void>> = [];

afterEach(async () => {
	await Promise.all(cleanupTasks.splice(0).map((cleanup) => cleanup()));
});

describe("consultation routes", () => {
	it("lists persisted experts", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		const now = new Date("2030-01-01T09:00:00.000Z");
		const consultations = new ConsultationService(
			application.database as unknown as AppDatabase,
		);
		await consultations.seedDemoData(now);

		const response = await application.server.inject({
			method: "GET",
			url: "/api/v1/experts",
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toEqual({
			experts: expect.arrayContaining([
				expect.objectContaining({
					displayName: "Marcus Thorne",
					id: "marcus-thorne",
				}),
			]),
		});
	});

	it("lists future open availability for one expert", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		const consultations = new ConsultationService(
			application.database as unknown as AppDatabase,
		);
		await consultations.seedDemoData(new Date("2030-01-01T09:00:00.000Z"));

		const response = await application.server.inject({
			method: "GET",
			url: "/api/v1/experts/marcus-thorne/availability",
		});

		expect(response.statusCode).toBe(200);
		expect(response.json().slots).toHaveLength(3);
		expect(response.json().slots[0]).toMatchObject({
			booked: false,
			expertId: "marcus-thorne",
		});
	});
});
