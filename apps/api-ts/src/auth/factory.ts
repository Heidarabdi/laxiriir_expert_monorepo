import { APIError, betterAuth } from "better-auth";
import { type DB, drizzleAdapter } from "better-auth/adapters/drizzle";

import type { ApiConfig } from "../config.js";
import * as schema from "../db/schema.js";

async function sendAuthEmail(
	config: ApiConfig,
	message: { subject: string; text: string; to: string },
) {
	if (config.RESEND_API_KEY && config.EMAIL_FROM) {
		const response = await fetch("https://api.resend.com/emails", {
			body: JSON.stringify({
				from: config.EMAIL_FROM,
				subject: message.subject,
				text: message.text,
				to: [message.to],
			}),
			headers: {
				Authorization: `Bearer ${config.RESEND_API_KEY}`,
				"Content-Type": "application/json",
			},
			method: "POST",
		});

		if (!response.ok) {
			throw new Error(`Unable to send authentication email (${response.status})`);
		}
		return;
	}

	if (config.NODE_ENV === "development") {
		process.stdout.write(`[auth-email] ${message.to}: ${message.text}\n`);
	}
}

export function createAuth(database: DB, config: ApiConfig) {
	return betterAuth({
		advanced: {
			defaultCookieAttributes: {
				sameSite: config.NODE_ENV === "production" ? "none" : "lax",
				secure: config.NODE_ENV === "production",
			},
		},
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

						const isBootstrapAdmin =
							config.AUTH_BOOTSTRAP_ADMIN_EMAILS.includes(
								user.email.trim().toLowerCase(),
							);

						return {
							data: {
								...user,
								role: isBootstrapAdmin ? "admin" : user.role,
								expertStatus:
									!isBootstrapAdmin && user.role === "expert"
										? "pending_review"
										: "not_applicable",
							},
						};
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
			requireEmailVerification: true,
			sendResetPassword: async ({ token, user }) => {
				const resetUrl = new URL("/reset-password", config.TRUSTED_ORIGINS[0]);
				resetUrl.searchParams.set("token", token);
				await sendAuthEmail(config, {
					subject: "Reset your Laxiriir Expert password",
					text: resetUrl.toString(),
					to: user.email,
				});
			},
		},
		emailVerification: {
			sendOnSignUp: true,
			sendVerificationEmail: async ({ token, user }) => {
				const verificationUrl = new URL(
					"/verify-email",
					config.TRUSTED_ORIGINS[0],
				);
				verificationUrl.searchParams.set("token", token);
				await sendAuthEmail(config, {
					subject: "Verify your Laxiriir Expert account",
					text: verificationUrl.toString(),
					to: user.email,
				});
			},
		},
		secret: config.BETTER_AUTH_SECRET,
		trustedOrigins: config.TRUSTED_ORIGINS,
		user: {
			additionalFields: {
				expertStatus: {
					defaultValue: "not_applicable",
					input: false,
					required: true,
					type: "string",
				},
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
