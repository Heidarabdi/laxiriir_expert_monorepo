import { APIError, betterAuth } from "better-auth";
import { type DB, drizzleAdapter } from "better-auth/adapters/drizzle";

import type { ApiConfig } from "../config.js";
import * as schema from "../db/schema.js";

export function createAuth(database: DB, config: ApiConfig) {
	return betterAuth({
		appName: "Laxiriir Expert",
		basePath: "/api/auth",
		baseURL: config.BETTER_AUTH_URL,
		database: drizzleAdapter(database, {
			provider: "pg",
			schema,
		}),
		databaseHooks: {
			user: {
				create: {
					before: async (user) => {
						if (user.role !== "client" && user.role !== "expert") {
							throw new APIError("BAD_REQUEST", {
								message: "Role must be client or expert",
							});
						}
					},
				},
				update: {
					before: async (user) => {
						if (user.role !== undefined) {
							throw new APIError("FORBIDDEN", {
								message: "Role cannot be changed through profile updates",
							});
						}
					},
				},
			},
		},
		emailAndPassword: {
			enabled: true,
		},
		secret: config.BETTER_AUTH_SECRET,
		trustedOrigins: config.TRUSTED_ORIGINS,
		user: {
			additionalFields: {
				role: {
					defaultValue: "client",
					input: true,
					required: true,
					type: "string",
				},
			},
		},
	});
}

export type AppAuth = ReturnType<typeof createAuth>;
