import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { describe, expect, it } from "vitest";

import { createAuth } from "../src/auth/factory.js";
import type { AppDatabase } from "../src/db/postgres.js";
import * as schema from "../src/db/schema.js";
import { buildServer } from "../src/server.js";
import { createTestConfig } from "./helpers.js";

describe("legacy Go database migration", () => {
	it("preserves legacy identities and their booking ownership", async () => {
		const client = new PGlite();
		await client.exec(`
			CREATE TABLE account_profiles (
				auth_user_id TEXT PRIMARY KEY,
				email TEXT NOT NULL UNIQUE,
				display_name TEXT NOT NULL,
				primary_role TEXT NOT NULL,
				expert_status TEXT NOT NULL,
				created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
			);
			CREATE TABLE experts (
				id TEXT PRIMARY KEY,
				display_name TEXT NOT NULL,
				title TEXT NOT NULL,
				category TEXT NOT NULL,
				bio TEXT NOT NULL,
				hourly_rate_cents INTEGER NOT NULL CHECK (hourly_rate_cents >= 0),
				avatar_url TEXT NOT NULL,
				created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
			);
			CREATE TABLE availability_slots (
				id BIGSERIAL PRIMARY KEY,
				expert_id TEXT NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
				starts_at TIMESTAMPTZ NOT NULL,
				ends_at TIMESTAMPTZ NOT NULL,
				booked BOOLEAN NOT NULL DEFAULT TRUE,
				created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
				CONSTRAINT availability_slot_time_order CHECK (ends_at > starts_at),
				CONSTRAINT availability_slot_unique_time UNIQUE (expert_id, starts_at)
			);
			CREATE TABLE bookings (
				id TEXT PRIMARY KEY,
				client_user_id TEXT NOT NULL,
				expert_id TEXT NOT NULL REFERENCES experts(id),
				availability_slot_id BIGINT NOT NULL UNIQUE REFERENCES availability_slots(id),
				starts_at TIMESTAMPTZ NOT NULL,
				ends_at TIMESTAMPTZ NOT NULL,
				status TEXT NOT NULL,
				created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
				CONSTRAINT booking_time_order CHECK (ends_at > starts_at)
			);
			INSERT INTO account_profiles
				(auth_user_id, email, display_name, primary_role, expert_status)
			VALUES
				('legacy-client', 'Legacy@Example.com', 'Legacy Client', 'client', 'not_applicable'),
				('suspended-expert', 'suspended@example.com', 'Suspended Expert', 'expert', 'suspended');
			INSERT INTO experts
				(id, display_name, title, category, bio, hourly_rate_cents, avatar_url)
			VALUES
				('legacy-expert', 'Legacy Expert', 'Advisor', 'Strategy', 'Legacy profile', 10000, 'https://example.com/avatar'),
				('suspended-expert', 'Suspended Expert', 'Advisor', 'Strategy', 'Suspended profile', 10000, 'https://example.com/suspended-avatar');
			INSERT INTO availability_slots
				(expert_id, starts_at, ends_at)
			VALUES ('legacy-expert', '2030-01-01T10:00:00Z', '2030-01-01T11:00:00Z');
			INSERT INTO bookings
				(id, client_user_id, expert_id, availability_slot_id, starts_at, ends_at, status)
			VALUES ('legacy-booking', 'legacy-client', 'legacy-expert', 1, '2030-01-01T10:00:00Z', '2030-01-01T11:00:00Z', 'confirmed');
		`);

		const database = drizzle({ client, schema });
		await migrate(database, {
			migrationsFolder: path.join(
				fileURLToPath(new URL("..", import.meta.url)),
				"drizzle",
			),
		});

		const migratedUsers = await client.query<{
			email: string;
			id: string;
		}>(`SELECT id, email FROM "user" WHERE id = 'legacy-client'`);
		const migratedBookings = await client.query<{ client_user_id: string }>(
			`SELECT client_user_id FROM bookings WHERE id = 'legacy-booking'`,
		);
		const suspendedExperts = await client.query<{ active: boolean }>(
			`SELECT active FROM experts WHERE id = 'suspended-expert'`,
		);

		expect(migratedUsers.rows).toEqual([
			{ email: "legacy@example.com", id: "legacy-client" },
		]);
		expect(migratedBookings.rows).toEqual([
			{ client_user_id: "legacy-client" },
		]);
		expect(suspendedExperts.rows).toEqual([{ active: false }]);

		const config = createTestConfig();
		const auth = createAuth(database, config);
		const server = buildServer({
			auth,
			config,
			database: database as unknown as AppDatabase,
		});
		const resetRequest = await server.inject({
			method: "POST",
			payload: { email: "legacy@example.com" },
			url: "/api/auth/request-password-reset",
		});
		expect(resetRequest.statusCode).toBe(200);

		const resetTokens = await client.query<{ identifier: string }>(
			`SELECT identifier FROM verification WHERE identifier LIKE 'reset-password:%'`,
		);
		const token = resetTokens.rows[0]?.identifier.replace("reset-password:", "");
		expect(token).toBeTruthy();
		const reset = await server.inject({
			method: "POST",
			payload: {
				newPassword: "new-correct-horse-battery-staple",
				token,
			},
			url: "/api/auth/reset-password",
		});
		expect(reset.statusCode).toBe(200);

		const credentialAccounts = await client.query<{ password: string }>(
			`SELECT password FROM account WHERE user_id = 'legacy-client' AND provider_id = 'credential'`,
		);
		expect(credentialAccounts.rows[0]?.password).toBeTruthy();
		await client.exec(
			`UPDATE "user" SET email_verified = true WHERE id = 'legacy-client'`,
		);
		const signIn = await server.inject({
			method: "POST",
			payload: {
				email: "legacy@example.com",
				password: "new-correct-horse-battery-staple",
			},
			url: "/api/auth/sign-in/email",
		});
		expect(signIn.statusCode).toBe(200);

		const listed = await server.inject({
			headers: {
				cookie: signIn.cookies
					.map((cookie) => `${cookie.name}=${cookie.value}`)
					.join("; "),
			},
			method: "GET",
			url: "/api/v1/client/bookings",
		});
		expect(listed.statusCode, listed.body).toBe(200);
		expect(listed.json().bookings).toHaveLength(1);

		await server.close();
		await client.close();
	});
});
