import { randomBytes } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import { afterEach, describe, expect, it } from "vitest";

import { ConsultationService } from "../src/consultations/service.js";
import { account, session, user } from "../src/db/auth-schema.js";
import { availabilitySlots } from "../src/db/consultation-schema.js";
import {
	DEVELOPMENT_DEMO_ACCOUNTS,
	seedDevelopmentWorkspace,
} from "../src/db/development-seed.js";
import type { AppDatabase } from "../src/db/postgres.js";
import { createTestApplication } from "./application.js";

const cleanupTasks: Array<() => Promise<void>> = [];

afterEach(async () => {
	await Promise.all(cleanupTasks.splice(0).map((cleanup) => cleanup()));
});

describe("development workspace seed", () => {
	it("creates loginable roles and realistic data without duplicating the week", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		const database = application.database as unknown as AppDatabase;
		const now = new Date("2030-01-16T10:00:00.000Z");
		const password = randomBytes(24).toString("base64url");

		const first = await seedDevelopmentWorkspace(
			database,
			application.auth,
			{ password },
			now,
		);
		expect(first).toMatchObject({ accounts: 7, bookings: 7, slots: 14 });

		const identities = await application.database
			.select()
			.from(user)
			.where(
				inArray(
					user.email,
					DEVELOPMENT_DEMO_ACCOUNTS.map((account) => account.email),
				),
			);
		expect(identities).toHaveLength(DEVELOPMENT_DEMO_ACCOUNTS.length);
		expect(
			identities.find((identity) => identity.email === "admin@laxiriir.local"),
		).toMatchObject({ emailVerified: true, role: "admin" });
		expect(
			identities.find((identity) => identity.email === "expert@laxiriir.local"),
		).toMatchObject({ expertStatus: "approved", role: "expert" });

		const client = identities.find(
			(identity) => identity.email === "client@laxiriir.local",
		);
		const expert = identities.find(
			(identity) => identity.email === "expert@laxiriir.local",
		);
		expect(client).toBeDefined();
		expect(expert).toBeDefined();
		const consultations = new ConsultationService(database);
		const clientBookings = await consultations.listClientBookings(
			client?.id ?? "",
		);
		const expertSummary = await consultations.getExpertDashboardSummary(
			expert?.id ?? "",
			now,
		);
		expect(clientBookings).toHaveLength(7);
		expect(expertSummary).toMatchObject({
			openAvailability: 4,
			pastBookings: 3,
			upcomingBookings: 2,
		});

		await seedDevelopmentWorkspace(
			database,
			application.auth,
			{ password },
			now,
		);
		const repeatedBookings = await consultations.listClientBookings(
			client?.id ?? "",
		);
		const expertIds = identities
			.filter((identity) => identity.role === "expert")
			.map((identity) => identity.id);
		const repeatedSlots = await application.database
			.select()
			.from(availabilitySlots)
			.where(inArray(availabilitySlots.expertId, expertIds));
		expect(repeatedBookings).toHaveLength(7);
		expect(repeatedSlots).toHaveLength(14);

		const seededExpert = identities.find(
			(identity) => identity.email === "expert@laxiriir.local",
		);
		expect(seededExpert).toBeDefined();
		const signIn = await application.auth.api.signInEmail({
			body: {
				email: "expert@laxiriir.local",
				password,
			},
		});
		expect(signIn.user.id).toBe(seededExpert?.id);

		const [storedAdmin] = await application.database
			.select()
			.from(user)
			.where(eq(user.email, "admin@laxiriir.local"));
		expect(storedAdmin.role).toBe("admin");

		// A normal repeat must not change credentials or sign out demo users.
		await seedDevelopmentWorkspace(
			database,
			application.auth,
			{ password },
			now,
		);
		expect(
			await application.database
				.select()
				.from(session)
				.where(eq(session.token, signIn.token)),
		).toHaveLength(1);
	});

	it("rotates all existing demo passwords and revokes only their sessions", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		const database = application.database as unknown as AppDatabase;
		const password = randomBytes(24).toString("base64url");
		const replacement = randomBytes(24).toString("base64url");
		const unrelatedPassword = randomBytes(24).toString("base64url");
		await seedDevelopmentWorkspace(database, application.auth, { password });
		const unrelated = await application.auth.api.signUpEmail({
			body: {
				email: "unrelated@example.com",
				name: "Unrelated user",
				password: unrelatedPassword,
				role: "client",
			},
		});
		await application.database
			.update(user)
			.set({ emailVerified: true })
			.where(eq(user.id, unrelated.user.id));
		const unrelatedSignIn = await application.auth.api.signInEmail({
			body: { email: unrelated.user.email, password: unrelatedPassword },
		});
		for (const demo of DEVELOPMENT_DEMO_ACCOUNTS) {
			await application.auth.api.signInEmail({
				body: { email: demo.email, password },
			});
		}
		expect(await application.database.select().from(session)).toHaveLength(
			DEVELOPMENT_DEMO_ACCOUNTS.length + 1,
		);

		await seedDevelopmentWorkspace(database, application.auth, {
			password: replacement,
		});
		const survivingSessions = await application.database.select().from(session);
		expect(survivingSessions).toHaveLength(1);
		expect(survivingSessions[0].token).toBe(unrelatedSignIn.token);
		for (const demo of DEVELOPMENT_DEMO_ACCOUNTS) {
			await expect(
				application.auth.api.signInEmail({
					body: { email: demo.email, password },
				}),
			).rejects.toThrow();
			const signedIn = await application.auth.api.signInEmail({
				body: { email: demo.email, password: replacement },
			});
			expect(signedIn.user.email).toBe(demo.email);
		}
		expect(
			await application.auth.api.signInEmail({
				body: { email: unrelated.user.email, password: unrelatedPassword },
			}),
		).toHaveProperty("user.id", unrelated.user.id);
		const credentials = await application.database
			.select({ password: account.password })
			.from(account);
		expect(
			credentials.every(
				(credential) =>
					credential.password !== replacement &&
					credential.password !== password,
			),
		).toBe(true);
	});

	it("rejects an empty password before creating any identities", async () => {
		const application = await createTestApplication();
		cleanupTasks.push(() => application.close());
		await expect(
			seedDevelopmentWorkspace(
				application.database as unknown as AppDatabase,
				application.auth,
				{ password: "" },
			),
		).rejects.toThrow();
		expect(await application.database.select().from(user)).toHaveLength(0);
	});
});
