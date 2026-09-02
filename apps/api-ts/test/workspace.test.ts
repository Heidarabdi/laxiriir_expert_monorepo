import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it } from "vitest";

import { ConsultationService } from "../src/consultations/service.js";
import { user } from "../src/db/auth-schema.js";
import { experts } from "../src/db/consultation-schema.js";
import type { AppDatabase } from "../src/db/postgres.js";
import { createTestApplication } from "./application.js";

const cleanupTasks: Array<() => Promise<void>> = [];
const password = "correct-horse-battery-staple";

afterEach(async () => {
	await Promise.all(cleanupTasks.splice(0).map((cleanup) => cleanup()));
});

async function register(
	application: Awaited<ReturnType<typeof createTestApplication>>,
	input: { email: string; name: string; role: "admin" | "client" | "expert" },
) {
	const registration = await application.server.inject({
		method: "POST",
		payload: {
			email: input.email,
			name: input.name,
			password,
			role: input.role === "admin" ? "client" : input.role,
		},
		url: "/api/auth/sign-up/email",
	});
	expect(registration.statusCode).toBe(200);
	const id = registration.json().user.id as string;
	await application.database
		.update(user)
		.set({
			emailVerified: true,
			expertStatus: input.role === "expert" ? "approved" : "not_applicable",
			role: input.role,
		})
		.where(eq(user.id, id));
	if (input.role === "expert") {
		await application.database.insert(experts).values({
			active: true,
			avatarUrl: "https://example.com/workspace-expert.png",
			bio: "An approved expert used for workspace integration coverage.",
			category: "Operations",
			displayName: input.name,
			hourlyRateCents: 12_000,
			id,
			title: "Operations Advisor",
		});
	}
	const signIn = await application.server.inject({
		method: "POST",
		payload: { email: input.email, password },
		url: "/api/auth/sign-in/email",
	});
	return {
		cookie: signIn.cookies.map((item) => `${item.name}=${item.value}`).join("; "),
		id,
	};
}

describe("workspace routes", () => {
	it("connects booking messages, preferences, and support triage", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		const client = await register(application, {
			email: "workspace-client@example.com",
			name: "Workspace Client",
			role: "client",
		});
		const expert = await register(application, {
			email: "workspace-expert@example.com",
			name: "Workspace Expert",
			role: "expert",
		});
		const admin = await register(application, {
			email: "workspace-admin@example.com",
			name: "Workspace Admin",
			role: "admin",
		});
		const consultations = new ConsultationService(
			application.database as unknown as AppDatabase,
		);
		const startsAt = new Date(Date.now() + 86_400_000);
		const slot = await consultations.createAvailability(
			expert.id,
			startsAt,
			new Date(startsAt.getTime() + 3_600_000),
		);
		const booking = await consultations.createBooking(client.id, slot.id);

		const sent = await application.server.inject({
			headers: { cookie: client.cookie },
			method: "POST",
			payload: { body: "Could we focus the session on operational planning?" },
			url: `/api/v1/messages/${booking.id}`,
		});
		expect(sent.statusCode).toBe(201);

		const expertConversations = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "GET",
			url: "/api/v1/messages",
		});
		expect(expertConversations.json()).toMatchObject({
			conversations: [
				{
					bookingId: booking.id,
					counterpart: { displayName: "Workspace Client" },
					unreadCount: 1,
				},
			],
		});

		const markedRead = await application.server.inject({
			headers: { cookie: expert.cookie },
			method: "PATCH",
			url: `/api/v1/messages/${booking.id}/read`,
		});
		expect(markedRead.json()).toEqual({ updatedCount: 1 });

		const preferences = await application.server.inject({
			headers: { cookie: client.cookie },
			method: "PATCH",
			payload: {
				emailBookingUpdates: false,
				inAppBookingUpdates: true,
				timezone: "Africa/Nairobi",
			},
			url: "/api/v1/settings",
		});
		expect(preferences.json().preferences).toEqual({
			emailBookingUpdates: false,
			inAppBookingUpdates: true,
			timezone: "Africa/Nairobi",
		});

		const supportCase = await application.server.inject({
			headers: { cookie: client.cookie },
			method: "POST",
			payload: {
				bookingId: booking.id,
				description: "I need help changing the goals attached to this consultation.",
				priority: "normal",
				subject: "Consultation goals",
			},
			url: "/api/v1/support",
		});
		expect(supportCase.statusCode).toBe(201);
		const caseId = supportCase.json().case.id as string;

		const adminQueue = await application.server.inject({
			headers: { cookie: admin.cookie },
			method: "GET",
			url: "/api/v1/admin/support",
		});
		expect(adminQueue.json().cases).toHaveLength(1);

		const resolved = await application.server.inject({
			headers: { cookie: admin.cookie },
			method: "PATCH",
			payload: { assignToMe: true, status: "resolved" },
			url: `/api/v1/admin/support/${caseId}`,
		});
		expect(resolved.json()).toMatchObject({
			case: { assignedAdminUserId: admin.id, status: "resolved" },
		});
	});

	it("does not expose a booking conversation to another client", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		const owner = await register(application, {
			email: "conversation-owner@example.com",
			name: "Conversation Owner",
			role: "client",
		});
		const other = await register(application, {
			email: "conversation-other@example.com",
			name: "Conversation Other",
			role: "client",
		});
		const expert = await register(application, {
			email: "conversation-expert@example.com",
			name: "Conversation Expert",
			role: "expert",
		});
		const consultations = new ConsultationService(
			application.database as unknown as AppDatabase,
		);
		const startsAt = new Date(Date.now() + 86_400_000);
		const slot = await consultations.createAvailability(
			expert.id,
			startsAt,
			new Date(startsAt.getTime() + 3_600_000),
		);
		const booking = await consultations.createBooking(owner.id, slot.id);

		const response = await application.server.inject({
			headers: { cookie: other.cookie },
			method: "GET",
			url: `/api/v1/messages/${booking.id}`,
		});
		expect(response.statusCode).toBe(404);
	});
});
